import type { Metadata } from "next";

import { LandingPage } from "@/components/LandingPage";

/**
 * Explicit home metadata + canonical help Lighthouse SEO on `/`.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * `LandingPage` is a Client Component but is still **SSR’d** in the first HTML
 * response so the header logo (typical LCP) paints immediately. Heavy Three.js
 * stays deferred via `DeferMount` + `next/dynamic` in `landing/HeavyVisuals`.
 * Non-critical UI (e.g. language switcher) is lazy-loaded inside the page.
 */
export default function HomePage() {
  return <LandingPage />;
}
