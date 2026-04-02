"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkClass =
  "inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white";

/**
 * Legal links on non-home routes. Current page is a span (avoids duplicate
 * navigation to the same URL as redundant links).
 */
export function GlobalLegalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer
      className="border-t border-white/[0.08] bg-terminal-bg py-4"
      role="contentinfo"
    >
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center text-sm font-medium text-slate-300 sm:gap-x-8 sm:px-6 lg:px-8"
        aria-label="Rechtliche Hinweise"
      >
        {pathname === "/impressum" ? (
          <span className={linkClass} aria-current="page">
            Impressum
          </span>
        ) : (
          <Link
            href="/impressum"
            className={linkClass}
            prefetch={false}
          >
            Impressum
          </Link>
        )}
        {pathname === "/datenschutz" ? (
          <span className={linkClass} aria-current="page">
            Datenschutzerklärung
          </span>
        ) : (
          <Link
            href="/datenschutz"
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
