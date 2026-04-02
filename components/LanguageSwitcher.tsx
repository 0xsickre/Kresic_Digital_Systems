"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex min-h-11 min-w-[5.25rem] shrink-0 items-center justify-center gap-1 text-[13px] font-semibold tabular-nums tracking-wide"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
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
        onClick={() => setLocale("de")}
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
