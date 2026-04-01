import type { ReactNode } from "react";

export function LandingLcpHero({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] shadow-[0_32px_72px_-10px_rgba(0,0,0,0.55),0_16px_40px_-16px_rgba(0,0,0,0.35)]">
      <section
        id="hero"
        className="scroll-mt-24 relative isolate flex min-h-[100dvh] flex-col overflow-x-hidden bg-transparent pb-10 pt-20 sm:pb-24 sm:pt-28 md:pb-32 md:pt-32 lg:pb-40"
        aria-labelledby="hero-heading"
      >
        {children}
      </section>
    </div>
  );
}
