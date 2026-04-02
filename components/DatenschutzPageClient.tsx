"use client";

import { FileDown } from "lucide-react";
import Link from "next/link";

import { LegalPageHeader } from "@/components/LegalPageHeader";
import {
  BRAND_NAME,
  LEGAL_ADDRESS_LINES,
  OWNER_NAME,
  SITE_EMAIL,
} from "@/lib/site";
import { useI18n } from "@/lib/i18n";

function DatenschutzPdfDownload() {
  const { t, locale } = useI18n();
  const href =
    locale === "de"
      ? "/legal/datenschutzerklaerung_kresic_digital_system_de.pdf"
      : "/legal/datenschutzerklaerung_kresic_digital_system_en.pdf";
  const downloadName =
    locale === "de"
      ? "datenschutzerklaerung_kresic_digital_system_de.pdf"
      : "datenschutzerklaerung_kresic_digital_system_en.pdf";

  return (
    <div className="mb-8 flex flex-wrap justify-end border-b border-white/10 pb-6">
      <a
        href={href}
        download={downloadName}
        className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-100 transition-colors hover:border-indigo-400/55 hover:bg-indigo-500/18"
      >
        <FileDown className="h-4 w-4 shrink-0" aria-hidden />
        {t.datenschutz.downloadPdf}
      </a>
    </div>
  );
}

export function DatenschutzPageClient() {
  const { t, locale } = useI18n();
  const ds = t.datenschutz;

  const s4body = ds.s4p1.replace(/\{\{email\}\}/g, SITE_EMAIL);

  const html = ds.htmlBody.trim();

  if (html) {
    return (
      <>
        <LegalPageHeader />
        <div className="min-h-screen bg-terminal-bg text-slate-100">
          <div
            className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-24"
            lang={locale}
          >
            <DatenschutzPdfDownload />
            <div
              className="legal-html mt-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <Link
              href="/#hero"
              className="mt-12 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {ds.backHome}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LegalPageHeader />
      <div className="min-h-screen bg-terminal-bg text-slate-100">
        <div
          className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-24"
          lang={locale}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {ds.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {ds.title}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">{ds.stand}</p>

          <DatenschutzPdfDownload />

          <div className="legal-html mt-12 space-y-10 text-sm leading-relaxed text-slate-300">
            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s1Title}</h2>
              <p>{ds.s1Lead}</p>
              <p>
                {OWNER_NAME}
                <br />
                {BRAND_NAME}
                <br />
                {LEGAL_ADDRESS_LINES.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <p>
                {ds.emailLabel}{" "}
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  {SITE_EMAIL}
                </a>
              </p>
            </section>

            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s2Title}</h2>
              <p>{ds.s2p1}</p>
              <p>{ds.s2p2}</p>
              <p>{ds.s2p3}</p>
            </section>

            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s3Title}</h2>
              <p>{ds.s3p1}</p>
            </section>

            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s4Title}</h2>
              <p>{s4body}</p>
            </section>

            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s5Title}</h2>
              <p>{ds.s5p1}</p>
            </section>

            <section className="border-b border-white/10 pb-10">
              <h2>{ds.s6Title}</h2>
              <p>{ds.s6p1}</p>
            </section>
          </div>

          <Link
            href="/#hero"
            className="mt-12 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            {ds.backHome}
          </Link>
        </div>
      </div>
    </>
  );
}
