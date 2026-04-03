import Script from "next/script";

/**
 * Optional third-party tags (analytics, pixels). Loaded after the main thread
 * is idle — does not block LCP or TBT. Set NEXT_PUBLIC_DEFERRED_SCRIPT_SRC
 * to a single script URL when you add a provider.
 */
export function DeferredThirdPartyScripts() {
  const src = process.env.NEXT_PUBLIC_DEFERRED_SCRIPT_SRC?.trim();
  if (!src) return null;

  const integrity = process.env.NEXT_PUBLIC_DEFERRED_SCRIPT_INTEGRITY?.trim();

  return (
    <Script
      id="deferred-third-party"
      src={src}
      strategy="lazyOnload"
      {...(integrity
        ? { integrity, crossOrigin: "anonymous" as const }
        : {})}
    />
  );
}
