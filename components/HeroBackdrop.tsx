"use client";

import { DeferHeavyChild } from "@/components/DeferMount";
import {
  DynamicHeroVisual,
  HeroCanvasPlaceholder,
} from "@/components/landing/HeavyVisuals";

/** Hero WebGL + gradient layers only (LCP text lives in RSC `page.tsx`). */
export function HeroBackdrop() {
  return (
    <>
      <DeferHeavyChild
        fallback={<HeroCanvasPlaceholder />}
        delayMs={650}
      >
        <DynamicHeroVisual />
      </DeferHeavyChild>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-transparent opacity-100"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[480px] w-[480px] rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-40 bg-gradient-to-b from-transparent via-black/35 to-terminal-bg sm:h-48"
        aria-hidden
      />
    </>
  );
}
