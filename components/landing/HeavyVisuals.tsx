"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { WebGLErrorBoundary } from "@/components/WebGLErrorBoundary";

/** Static hero background until WebGL mounts (TBT / FCP friendly). */
export function HeroCanvasPlaceholder() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden bg-terminal-bg"
      aria-hidden
    />
  );
}

function HeroVisualSkeleton() {
  return <HeroCanvasPlaceholder />;
}

/** Project card header placeholder (matches live Three.js card height). */
export function CardVisualPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={[
        "relative isolate w-full min-h-[12rem] h-48 overflow-hidden rounded-lg border border-white/5 bg-[#050505]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    />
  );
}

export const DynamicHeroVisual = dynamic(
  () => import("@/components/HeroVisual"),
  { ssr: false, loading: HeroVisualSkeleton },
);

export const DynamicDataFlowVisual = dynamic(
  () => import("@/components/DataFlowVisual"),
  { ssr: false, loading: () => <CardVisualPlaceholder /> },
);

export const DynamicInfrastructureGrid = dynamic(
  () => import("@/components/InfrastructureGrid"),
  { ssr: false, loading: () => <CardVisualPlaceholder /> },
);

export const DynamicMarketPulseVisual = dynamic(
  () => import("@/components/MarketPulseVisual"),
  { ssr: false, loading: () => <CardVisualPlaceholder /> },
);

function SafeCardWebGL({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <WebGLErrorBoundary
      fallback={<CardVisualPlaceholder className={className} />}
    >
      {children}
    </WebGLErrorBoundary>
  );
}

export function SafeDynamicDataFlowVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <SafeCardWebGL className={className}>
      <DynamicDataFlowVisual className={className} />
    </SafeCardWebGL>
  );
}

export function SafeDynamicInfrastructureGrid({
  className,
}: {
  className?: string;
}) {
  return (
    <SafeCardWebGL className={className}>
      <DynamicInfrastructureGrid className={className} />
    </SafeCardWebGL>
  );
}

export function SafeDynamicMarketPulseVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <SafeCardWebGL className={className}>
      <DynamicMarketPulseVisual className={className} />
    </SafeCardWebGL>
  );
}

/**
 * Positional, and therefore tied to the order of `projects.featured` in the
 * dictionaries: index 0 here draws the first card there.
 *
 * The pairing is not decorative. The grid belongs to the site's own source, the
 * market trace to the trading journal, the data flow to the ERP pipelines — put
 * a volatility readout on an ERP reporting card and the card argues against its
 * own copy. Reorder the cards and this array has to move with them.
 */
export const projectHeaderVisuals = [
  SafeDynamicInfrastructureGrid,
  SafeDynamicMarketPulseVisual,
  SafeDynamicDataFlowVisual,
] as const;
