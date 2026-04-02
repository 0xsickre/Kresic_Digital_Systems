"use client";

import type { ReactNode } from "react";

/**
 * Hero copy is server-rendered per locale in the page RSC; this shell only
 * supplies layout for LCP markup.
 */
export function HeroTextIsland({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-4 text-center sm:px-6 sm:py-6 md:py-8 lg:px-8">
      <div className="lcp-fade-in flex w-full max-w-3xl flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}
