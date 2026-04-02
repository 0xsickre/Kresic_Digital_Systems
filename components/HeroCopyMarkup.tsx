"use client";

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
      <div
        className="relative z-[1] flex w-full min-h-[clamp(3.25rem,14vw,5.5rem)] max-w-[100vw] items-center justify-center px-1 py-2 sm:min-h-[4rem] sm:px-2 md:min-h-[4.75rem]"
        aria-hidden
      >
        <span className="pointer-events-none w-full min-w-0 overflow-hidden text-center font-mono uppercase leading-none whitespace-nowrap text-slate-400 text-[clamp(0.72rem,0.42rem+3.4vw,2.65rem)] tracking-[0.05em] drop-shadow-[0_0_24px_rgba(255,255,255,0.08)] sm:tracking-[0.1em] md:tracking-[0.16em] lg:tracking-[0.22em]">
          {h.kicker}
        </span>
      </div>
      <p className="relative z-10 mt-1 w-full max-w-2xl text-base leading-relaxed text-slate-100 sm:mt-2 sm:text-lg md:mt-3 md:text-xl">
        {h.sub}
      </p>
      <div className="mx-auto mt-16 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 md:mt-12 sm:gap-4">
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
