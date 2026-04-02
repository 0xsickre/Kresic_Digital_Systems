"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LocaleCode } from "@/dictionaries/types";
import { DEFAULT_LOCALE, isLocale, withLocale } from "@/lib/locale";

const linkClass =
  "inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white";

function normalizePath(p: string): string {
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

/**
 * Legal links on non-home routes. Localized URLs; current route is a span with
 * aria-current (avoids redundant self-links). Footer hidden on `/de` and `/en` home.
 */
export function GlobalLegalFooter() {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/").filter(Boolean);
  const seg = segments[0];
  const isLocalizedHome =
    (seg === "de" || seg === "en") && segments.length <= 1;
  if (isLocalizedHome) return null;

  let locale: LocaleCode =
    seg && isLocale(seg) ? seg : DEFAULT_LOCALE;
  if (pathname.startsWith("/demo")) locale = "en";

  const impressumHref = withLocale(locale, "/impressum");
  const datenschutzHref = withLocale(locale, "/datenschutz");
  const here = normalizePath(pathname);

  return (
    <footer
      className="border-t border-white/[0.08] bg-terminal-bg py-4"
      role="contentinfo"
    >
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center text-sm font-medium text-slate-300 sm:gap-x-8 sm:px-6 lg:px-8"
        aria-label="Rechtliche Hinweise"
      >
        {here === normalizePath(impressumHref) ? (
          <span className={linkClass} aria-current="page">
            Impressum
          </span>
        ) : (
          <Link
            href={impressumHref}
            className={linkClass}
            prefetch={false}
          >
            Impressum
          </Link>
        )}
        {here === normalizePath(datenschutzHref) ? (
          <span className={linkClass} aria-current="page">
            Datenschutzerklärung
          </span>
        ) : (
          <Link
            href={datenschutzHref}
            className={linkClass}
            prefetch={false}
          >
            Datenschutzerklärung
          </Link>
        )}
      </nav>
    </footer>
  );
}
