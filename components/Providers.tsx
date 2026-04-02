"use client";

import type { ReactNode } from "react";

import type { LocaleCode } from "@/dictionaries/types";
import { I18nProvider } from "@/lib/i18n";

export function Providers({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: LocaleCode;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
  );
}
