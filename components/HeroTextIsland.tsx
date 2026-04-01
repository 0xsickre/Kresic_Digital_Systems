"use client";

import type { ReactNode } from "react";

import { en } from "@/dictionaries/en";
import { useI18n } from "@/lib/i18n";

import { HeroCopyMarkup } from "@/components/HeroCopyMarkup";

/**
 * Keeps server-rendered DE hero as `children` for LCP; swaps to EN copy when locale changes.
 */
export function HeroTextIsland({ children }: { children: ReactNode }) {
  const { locale } = useI18n();

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-4 text-center sm:px-6 sm:py-6 md:py-8 lg:px-8">
      <div className="lcp-fade-in flex w-full max-w-3xl flex-col items-center text-center">
        {locale === "de" ? children : <HeroCopyMarkup h={en.hero} />}
      </div>
    </div>
  );
}
