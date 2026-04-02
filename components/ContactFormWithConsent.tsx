"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";

import Link from "next/link";

import { sendEmail } from "@/app/actions/sendEmail";
import type { LandingDictionary, LocaleCode } from "@/dictionaries/types";
import { CONTACT_SERVICE_VALUES } from "@/lib/contact-service";

export type ContactFormLabels = LandingDictionary["form"];

type ContactFormWithConsentProps = {
  labels: ContactFormLabels;
  locale: LocaleCode;
};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-600";

export function ContactFormWithConsent({
  labels,
  locale,
}: ContactFormWithConsentProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);
  const mountTs = useRef(0);

  useEffect(() => {
    mountTs.current = Date.now();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setFeedback(null);

    formData.set("_t", String(mountTs.current));

    const consent = formData.get("consent");
    if (consent !== "on" && consent !== "true") {
      setFeedback({ type: "error", message: labels.consentError });
      return;
    }

    startTransition(async () => {
      const result = await sendEmail(formData);
      if (result.success) {
        setFeedback({ type: "success", message: labels.success });
        form.reset();
        mountTs.current = Date.now();
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  }

  return (
    <form
      className="space-y-5"
      aria-label="Contact form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — invisible to real users, bots auto-fill it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {feedback ? (
        <div
          role="status"
          aria-live="polite"
          className={
            feedback.type === "success"
              ? "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200"
              : "rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200"
          }
        >
          {feedback.message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-slate-500"
        >
          {labels.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={200}
          className={fieldClassName}
          disabled={isPending}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-slate-500"
        >
          {labels.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          className={fieldClassName}
          disabled={isPending}
        />
      </div>
      <div>
        <label
          htmlFor="contact-service"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-slate-500"
        >
          {labels.serviceLabel}
        </label>
        <select
          id="contact-service"
          name="service"
          required
          defaultValue=""
          className={fieldClassName}
          disabled={isPending}
        >
          <option value="" disabled>
            {labels.servicePlaceholder}
          </option>
          {CONTACT_SERVICE_VALUES.map((value) => (
            <option key={value} value={value}>
              {labels.serviceOptions[value]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-slate-500"
        >
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          minLength={10}
          maxLength={8000}
          className={`${fieldClassName} resize-y`}
          disabled={isPending}
        />
      </div>

      <div className="flex gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 dark:bg-slate-950/60">
        <input
          id="contact-consent"
          name="consent"
          type="checkbox"
          value="true"
          aria-required="true"
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-zinc-400 bg-zinc-100 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60 dark:border-white/20 dark:bg-slate-900 dark:text-emerald-500 dark:focus:ring-emerald-400/30"
          disabled={isPending}
        />
        <label
          htmlFor="contact-consent"
          className="text-sm leading-relaxed text-zinc-700 dark:text-slate-300"
        >
          {labels.consentLead}
          <Link
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline decoration-emerald-600/40 underline-offset-2 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {labels.consentPrivacyLinkText}
          </Link>
          {labels.consentTrail}
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 min-h-[2.75rem]"
      >
        {isPending ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
