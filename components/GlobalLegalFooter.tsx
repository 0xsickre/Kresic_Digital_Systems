import Link from "next/link";

/**
 * Serverski footer: skeneri i alati (npr. eRecht24) vide uvek iste &lt;a href&gt; na svim rutama,
 * bez oslanjanja na klijentski i18n.
 */
export function GlobalLegalFooter() {
  return (
    <footer
      className="border-t border-white/[0.08] bg-terminal-bg py-4"
      role="contentinfo"
    >
      <nav
        className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-1 px-4 text-center text-sm font-medium text-slate-400 sm:gap-x-8 sm:px-6 lg:px-8"
        aria-label="Rechtliche Hinweise"
      >
        <Link
          href="/impressum"
          className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white"
          prefetch={false}
        >
          Impressum
        </Link>
        <Link
          href="/datenschutz"
          className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white"
          prefetch={false}
        >
          Datenschutzerklärung
        </Link>
      </nav>
    </footer>
  );
}
