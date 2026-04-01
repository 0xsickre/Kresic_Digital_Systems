"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { SITE_EMAIL } from "@/lib/site";

export type SendEmailResult =
  | { success: true }
  | { success: false; error: string };

// ─── Limits ───────────────────────────────────────────────────────────────────

const MAX_NAME_LEN = 200;
const MAX_EMAIL_LEN = 320;
const MAX_MESSAGE_LEN = 8_000;
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
    tooLong: de
      ? "Ein Eingabefeld überschreitet die maximale Länge."
      : "An input field exceeds the maximum allowed length.",
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

    const name = stripControl(String(formData.get("name") ?? "").trim());
    const email = stripControl(
      String(formData.get("email") ?? "").trim().toLowerCase(),
    );
    const message = stripControl(
      String(formData.get("message") ?? "").trim(),
    );
    const consent = formData.get("consent");

    if (!name || !email || !message) {
      return { success: false, error: t.fillAll };
    }

    if (
      name.length > MAX_NAME_LEN ||
      email.length > MAX_EMAIL_LEN ||
      message.length > MAX_MESSAGE_LEN
    ) {
      return { success: false, error: t.tooLong };
    }

    if (consent !== "on" && consent !== "true") {
      return { success: false, error: t.consent };
    }

    if (!BASIC_EMAIL.test(email)) {
      return { success: false, error: t.invalidEmail };
    }

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
    const safeSubject = `New Lead: ${stripControl(name).slice(0, 80)} — Kresic Digital Systems`;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const sendPromise = resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: safeSubject,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: [
          `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
          `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
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
