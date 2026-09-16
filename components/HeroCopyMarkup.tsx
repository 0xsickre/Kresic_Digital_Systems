import Link from "next/link";

import type { LandingDictionary } from "@/dictionaries/types";

type Props = { h: LandingDictionary["hero"] };

/**
 * Hero copy (no Framer / IO observers). Brighter gradient for WCAG contrast on desktop.
 */
export function HeroCopyMarkup({ h }: Props) {
  return (
    <>
      <p className="mb-4 w-full text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:mb-6">
        {h.kicker}
      </p>
      <h1
        id="hero-heading"
        className="relative z-10 w-full max-w-3xl font-semibold leading-[1.12] tracking-tight"
      >
        <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-teal-100 bg-clip-text text-transparent text-[clamp(1.65rem,4.6vw,3.25rem)] sm:text-[clamp(1.85rem,4.2vw,3.25rem)] md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
          {h.title}
        </span>
        <span className="mt-2 block bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-100 bg-clip-text text-transparent text-[clamp(1.05rem,3.2vw,1.85rem)] font-semibold leading-snug sm:mt-3 sm:text-[clamp(1.15rem,2.8vw,1.95rem)] md:text-2xl lg:text-[1.75rem]">
          {h.titleLine2}
        </span>
      </h1>
      {/* The decorative monospace band that stood here printed `h.kicker` a
          second time — the same words as the eyebrow above it and as the brand
          in the header, three renderings of one name above the fold. It was
          `aria-hidden`, so it carried no meaning either, and it spent up to
          5.5rem pushing the buttons down. */}
      <p className="relative z-10 mt-5 w-full max-w-2xl text-base leading-relaxed text-slate-100 sm:mt-6 sm:text-lg md:mt-7 md:text-xl">
        {h.sub}
      </p>
      <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 md:mt-12 sm:gap-4">
        <Link
          href="#contact"
          className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200 sm:px-8"
        >
          {h.ctaPrimary}
        </Link>
        <Link
          href="#expertise"
          className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.1] px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/35 hover:bg-white/[0.14] sm:px-8"
        >
          {h.ctaSecondary}
        </Link>
      </div>
    </>
  );
}
