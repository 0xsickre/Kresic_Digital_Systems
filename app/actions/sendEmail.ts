"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import de from "@/dictionaries/de.json";
import en from "@/dictionaries/en.json";
import { contactServiceSubjectTag } from "@/lib/contact-service";
import {
  contactFormSchema,
  contactFormZodUserMessage,
} from "@/lib/schemas/contactForm";
import { SITE_EMAIL } from "@/lib/site";

export type SendEmailResult =
  | { success: true }
  | { success: false; error: string };

// ─── Limits ───────────────────────────────────────────────────────────────────

const RESEND_TIMEOUT_MS = 10_000;
const MIN_SUBMIT_DELAY_MS = 2_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 3;

const BASIC_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Strip all C0 controls + DEL so CR/LF/TAB cannot reach subject, headers, or HTML. */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

const GENERIC_ERROR_EN =
  "Could not send your message. Please try again later.";
const GENERIC_ERROR_DE =
  "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.";

// ─── In-memory rate limiter ──────────────────────────────────────────────────
// Effective while the serverless function stays warm. Cold starts reset the map,
// which is an acceptable trade-off for a zero-dependency solution — the honeypot
// and timing checks cover the gap.

type RateEntry = { count: number; windowStart: number };
const ipBucket = new Map<string, RateEntry>();
let lastPurge = Date.now();

function checkRate(ip: string): boolean {
  const now = Date.now();
  if (now - lastPurge > RATE_WINDOW_MS * 5) {
    lastPurge = now;
    for (const [k, v] of ipBucket) {
      if (now - v.windowStart > RATE_WINDOW_MS * 2) ipBucket.delete(k);
    }
  }
  const entry = ipBucket.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    ipBucket.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_MAX_REQUESTS;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV === "development";

function devLog(
  level: "log" | "warn" | "error",
  ...args: unknown[]
): void {
  if (!isDev) return;
  console[level](...args);
}

function trimEnvValue(raw: string | undefined): string {
  if (typeof raw !== "string") return "";
  let t = raw.trim();
  if (
    t.length >= 2 &&
    ((t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'")))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

function stripControl(text: string): string {
  return text.replace(CONTROL_CHARS, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function messages(locale: string) {
  const de = locale === "de";
  return {
    notConfigured: de
      ? "E-Mail-Versand ist nicht konfiguriert."
      : "Email service is not configured.",
    senderNotConfigured: de
      ? "E-Mail-Absender ist für den Live-Betrieb nicht konfiguriert."
      : "Email sender is not configured for production.",
    fillAll: de
      ? "Bitte füllen Sie alle Felder aus."
      : "Please fill in all fields.",
    serviceRequired: de
      ? "Bitte wählen Sie eine Leistung."
      : "Please select a service area.",
    messageTooShort: de
      ? "Bitte geben Sie mindestens 10 Zeichen bei den Projektdetails ein."
      : "Please enter at least 10 characters in the project details.",
    nameTooShort: de
      ? "Bitte geben Sie mindestens 2 Zeichen für den Namen ein."
      : "Please enter at least 2 characters for your name.",
    consent: de ? "Einwilligung ist erforderlich." : "Consent is required.",
    invalidEmail: de
      ? "Bitte geben Sie eine gültige E-Mail-Adresse ein."
      : "Please enter a valid email address.",
    rateLimited: de
      ? "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut."
      : "Too many requests. Please try again in a minute.",
    sendFailed: de ? GENERIC_ERROR_DE : GENERIC_ERROR_EN,
  };
}

function formatResendError(error: unknown): string {
  if (error == null) return "null/undefined";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object") {
    const o = error as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "[unserializable error object]";
  }
}

// ─── Main action ──────────────────────────────────────────────────────────────

export async function sendEmail(
  formData: FormData,
): Promise<SendEmailResult> {
  // Derive locale early so the catch block can use a safe fallback.
  let locale: "de" | "en" = "en";

  try {
    const rawLocale = String(formData.get("locale") ?? "en");
    locale = rawLocale === "de" ? "de" : "en";
  } catch {
    // formData.get can technically throw on corrupt data; keep default "en".
  }

  const t = messages(locale);

  try {
    // ── IP-based rate limiting ───────────────────────────────────────────────

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      "unknown";

    if (checkRate(ip)) {
      devLog("warn", `[sendEmail] Rate-limited IP: ${ip}`);
      return { success: false, error: t.rateLimited };
    }

    // ── Honeypot (invisible field filled only by bots) ───────────────────────

    const honeypot = String(formData.get("website") ?? "");
    if (honeypot.length > 0) {
      devLog("warn", `[sendEmail] Honeypot triggered, IP: ${ip}`);
      return { success: true };
    }

    // ── Timing gate (reject sub-human submit speed) ──────────────────────────

    const ts = Number(formData.get("_t") || 0);
    if (ts > 0 && Date.now() - ts < MIN_SUBMIT_DELAY_MS) {
      devLog("warn", `[sendEmail] Timing check failed, IP: ${ip}`);
      return { success: true };
    }

    // ── API key ──────────────────────────────────────────────────────────────

    const apiKey = trimEnvValue(process.env.RESEND_API_KEY);

    devLog("log", "[sendEmail] API Key present:", apiKey.length > 0);

    if (!apiKey) {
      devLog(
        "warn",
        "[sendEmail] RESEND_API_KEY missing. Add it to .env.local and restart.",
      );
      return { success: false, error: t.notConfigured };
    }

    // ── Input extraction & sanitisation ──────────────────────────────────────

    const rawConsent = formData.get("consent");
    const consentField =
      rawConsent === "on" || rawConsent === "true" ? rawConsent : undefined;

    const payload = {
      name: stripControl(String(formData.get("name") ?? "").trim()),
      email: stripControl(String(formData.get("email") ?? "").trim().toLowerCase()),
      message: stripControl(String(formData.get("message") ?? "").trim()),
      service: stripControl(String(formData.get("service") ?? "").trim()),
      consent: consentField,
    };

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: contactFormZodUserMessage(parsed.error.issues, {
          serviceRequired: t.serviceRequired,
          messageTooShort: t.messageTooShort,
          nameTooShort: t.nameTooShort,
          invalidEmail: t.invalidEmail,
          consent: t.consent,
          fillAll: t.fillAll,
        }),
      };
    }

    const { name, email, message, service } = parsed.data;

    const dict = locale === "de" ? de : en;
    const serviceLabel =
      dict.form.serviceOptions[service] ?? contactServiceSubjectTag(service);

    // ── Sender / recipient ───────────────────────────────────────────────────

    const fromRaw = trimEnvValue(process.env.RESEND_FROM_EMAIL);
    const from =
      fromRaw.length > 0
        ? fromRaw
        : process.env.NODE_ENV === "production"
          ? null
          : "Kresic Digital Systems <onboarding@resend.dev>";

    if (!from) {
      devLog(
        "warn",
        "[sendEmail] RESEND_FROM_EMAIL is not set. Required in production.",
      );
      return { success: false, error: t.senderNotConfigured };
    }

    const toOverride = trimEnvValue(process.env.RESEND_TO_EMAIL);
    const to =
      toOverride.length > 0 && BASIC_EMAIL.test(toOverride)
        ? toOverride
        : SITE_EMAIL;

    // ── Send with timeout ────────────────────────────────────────────────────

    const resend = new Resend(apiKey);
    const tag = contactServiceSubjectTag(service);
    const safeSubject = stripControl(
      `[KDS][${tag}] ${name.slice(0, 60)} — Kresic Digital Systems`,
    ).slice(0, 220);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const sendPromise = resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: safeSubject,
        text: `Name: ${name}\nEmail: ${email}\nService: ${serviceLabel} (${service})\n\nMessage:\n${message}`,
        html: [
          `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
          `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
          `<p><strong>Service:</strong> ${escapeHtml(serviceLabel)} <code>${escapeHtml(service)}</code></p>`,
          `<p><strong>Message:</strong></p>`,
          `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
        ].join(""),
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Resend API request timed out")),
          RESEND_TIMEOUT_MS,
        );
      });

      // If the HTTP call finishes after we time out, avoid unhandled rejections when the SDK rejects.
      void sendPromise.catch(() => {});

      const { error } = await Promise.race([sendPromise, timeoutPromise]);

      if (error) {
        devLog("error", "[sendEmail] Resend error:", formatResendError(error));
        return { success: false, error: t.sendFailed };
      }

      return { success: true };
    } catch (err) {
      devLog(
        "error",
        "[sendEmail] Send failed:",
        err instanceof Error ? err.message : "[unknown]",
      );
      return { success: false, error: t.sendFailed };
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  } catch {
    // Top-level boundary: catches anything from headers(), formData.get(),
    // or any other unanticipated throw. Never leaks internals to the client.
    return {
      success: false,
      error: locale === "de" ? GENERIC_ERROR_DE : GENERIC_ERROR_EN,
    };
  }
}
