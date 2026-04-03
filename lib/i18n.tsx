"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { LandingDictionary, LocaleCode } from "@/dictionaries/types";
import { DEFAULT_LOCALE } from "@/lib/locale";

type I18nContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: LandingDictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Dictionary is passed as a prop from the server (RSC) so only the active
 * locale ships in the RSC payload — not as a JS chunk the client must parse.
 * Language switching navigates to a new URL; the server re-renders with the
 * new locale's dictionary.
 */
export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  initialDictionary,
}: {
  children: ReactNode;
  initialLocale?: LocaleCode;
  initialDictionary: LandingDictionary;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale);
  const [dictionary] = useState<LandingDictionary>(initialDictionary);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionary,
    }),
    [locale, setLocale, dictionary]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
