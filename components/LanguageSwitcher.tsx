"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type LocaleCode,
} from "@/lib/locale";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function persistLocaleCookie(locale: LocaleCode) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = [
    `${LOCALE_COOKIE}=${locale}`,
    "path=/",
    `max-age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function localeFromPathname(pathname: string): LocaleCode {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return DEFAULT_LOCALE;
}

function pathForLocale(pathname: string, next: LocaleCode): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    parts[0] = next;
    return `/${parts.join("/")}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const locale = localeFromPathname(pathname);

  const go = useCallback(
    (next: LocaleCode) => {
      if (next === locale) return;
      persistLocaleCookie(next);
      router.push(pathForLocale(pathname, next));
    },
    [locale, pathname, router],
  );

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex min-h-11 min-w-[5.25rem] shrink-0 items-center justify-center gap-1 text-[13px] font-semibold tabular-nums tracking-wide"
    >
      <button
        type="button"
        onClick={() => go("en")}
        className={[
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors duration-200 [-webkit-tap-highlight-color:transparent]",
          locale === "en"
            ? "text-white"
            : "text-slate-300 hover:text-slate-100",
        ].join(" ")}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </button>
      <span
        className="select-none px-0.5 text-slate-400"
        aria-hidden
      >
        |
      </span>
      <button
        type="button"
        onClick={() => go("de")}
        className={[
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors duration-200 [-webkit-tap-highlight-color:transparent]",
          locale === "de"
            ? "text-white"
            : "text-slate-300 hover:text-slate-100",
        ].join(" ")}
        aria-current={locale === "de" ? "true" : undefined}
      >
        DE
      </button>
    </div>
  );
}
