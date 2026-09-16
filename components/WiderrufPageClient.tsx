"use client";

import Link from "next/link";

import { LegalPageHeader } from "@/components/LegalPageHeader";
import { useI18n } from "@/lib/i18n";
import { withLocale } from "@/lib/locale";

export function WiderrufPageClient() {
  const { t, locale } = useI18n();
  const w = t.widerruf;
  const home = withLocale(locale, "/");

  return (
    <>
      <LegalPageHeader />
      <div className="min-h-screen bg-terminal-bg text-slate-100">
        <div
          className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-24"
          lang={locale}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {w.eyebrow}
          </p>
          <div
            className="legal-html mt-6"
            dangerouslySetInnerHTML={{ __html: w.htmlBody.trim() }}
          />
          <Link
            href={`${home}#hero`}
            className="mt-12 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            {w.backHome}
          </Link>
        </div>
      </div>
    </>
  );
}
