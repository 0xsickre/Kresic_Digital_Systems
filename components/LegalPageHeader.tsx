"use client";

import Link from "next/link";

import { KDSLogo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { withLocale } from "@/lib/locale";
import { BRAND_NAME } from "@/lib/site";

/** Fixed header with language switch on legal pages. */
export function LegalPageHeader() {
  const { t, locale } = useI18n();
  const home = withLocale(locale, "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-terminal-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href={`${home}#hero`}
          className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-md text-sm font-semibold leading-tight tracking-tight text-white sm:gap-3"
        >
          <KDSLogo className="h-8 w-auto shrink-0 text-white sm:h-9" />
          <span className="hidden min-w-0 sm:inline">{BRAND_NAME}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <Link
            href={`${home}#contact`}
            className="inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-emerald-700 px-3 text-xs font-semibold text-white shadow-sm shadow-emerald-950/30 transition hover:bg-emerald-600 sm:px-5 sm:text-sm"
          >
            {t.headerCta}
          </Link>
        </div>
      </div>
    </header>
  );
}
