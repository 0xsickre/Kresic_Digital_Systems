import type { LocaleCode } from "@/dictionaries/types";

export type { LocaleCode };

export const LOCALES: readonly LocaleCode[] = ["de", "en"];

export const DEFAULT_LOCALE: LocaleCode = "de";

/** Cookie persisted when user switches language (used for `/` redirect). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is LocaleCode {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefix a path with locale, e.g. `/impressum` → `/de/impressum`. */
export function withLocale(locale: LocaleCode, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
