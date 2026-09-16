"use client";

import { FileDown } from "lucide-react";
import Link from "next/link";

import { LegalPageHeader } from "@/components/LegalPageHeader";
import { useI18n } from "@/lib/i18n";
import { withLocale } from "@/lib/locale";

function WiderrufPdfDownload() {
  const { t, locale } = useI18n();
  const name = `widerrufsbelehrung_kresic_digital_systems_${locale}.pdf`;

  return (
    <div className="mb-8 flex flex-wrap justify-end border-b border-white/10 pb-6">
      <a
        href={`/legal/${name}`}
        download={name}
        className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-100 transition-colors hover:border-indigo-400/55 hover:bg-indigo-500/18"
      >
        <FileDown className="h-4 w-4 shrink-0" aria-hidden />
        {t.widerruf.downloadPdf}
      </a>
    </div>
  );
}

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
          <WiderrufPdfDownload />
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
