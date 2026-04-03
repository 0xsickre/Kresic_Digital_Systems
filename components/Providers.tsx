"use client";

import type { ReactNode } from "react";

import type { LandingDictionary, LocaleCode } from "@/dictionaries/types";
import { I18nProvider } from "@/lib/i18n";

export function Providers({
  children,
  initialLocale,
  initialDictionary,
}: {
  children: ReactNode;
  initialLocale: LocaleCode;
  initialDictionary: LandingDictionary;
}) {
  return (
    <I18nProvider initialLocale={initialLocale} initialDictionary={initialDictionary}>
      {children}
    </I18nProvider>
  );
}
