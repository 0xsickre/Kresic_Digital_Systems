"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import { useI18n } from "@/lib/i18n";

const LanguageSwitcherLazy = dynamic(
  () =>
    import("@/components/LanguageSwitcher").then((m) => ({
      default: m.LanguageSwitcher,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-11 min-w-[5.25rem] shrink-0" aria-hidden />
    ),
  },
);

type Props = {
  /** Server-rendered logo + brand link (LCP). Must stay free of client-only animation wrappers. */
  logo: ReactNode;
};

export function LandingHeaderShellClient({ logo }: Props) {
  const { t } = useI18n();
  const a11y = t.a11y;
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, close]);

  const nav = [
    { href: "#expertise", label: t.nav.expertise },
    { href: "#about", label: t.nav.about },
    { href: "#work", label: t.nav.work },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-terminal-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 pl-4 pr-[max(0.875rem,env(safe-area-inset-right))] sm:px-6 sm:pl-6 sm:pr-6 lg:px-8">
        {logo}

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-slate-200 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <LanguageSwitcherLazy />
          <Link
            href="#contact"
            onClick={close}
            className="hidden min-h-[2.75rem] items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-950/40 transition hover:bg-emerald-500 sm:inline-flex"
          >
            {t.headerCta}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? a11y.closeMenu : a11y.openMenu}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-white/[0.06] bg-terminal-bg/95 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-[2.75rem] items-center rounded-lg px-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            onClick={close}
            className="mt-4 flex min-h-[2.75rem] w-full items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white shadow-md shadow-emerald-950/40 transition hover:bg-emerald-500"
          >
            {t.headerCta}
          </Link>
        </nav>
      )}
    </header>
  );
}
