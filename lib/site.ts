/**
 * Fallback when `NEXT_PUBLIC_SITE_URL` is unset (local preview, misconfigured env).
 * Must match the primary production hostname so canonicals, hreflang, sitemap, and
 * `metadataBase` align with where Lighthouse/SEO tools run (e.g. kresicds.com).
 */
export const DEFAULT_PUBLIC_SITE_URL = "https://kresicds.com" as const;

/**
 * Normalized https origin for metadata, sitemap, and robots.
 * Invalid or non-http(s) env values fall back to avoid broken canonicals.
 */
export function siteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_PUBLIC_SITE_URL;
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return DEFAULT_PUBLIC_SITE_URL;
    }
    return u.origin;
  } catch {
    return DEFAULT_PUBLIC_SITE_URL;
  }
}

export const BRAND_NAME = "Kresic Digital Systems" as const;
export const OWNER_NAME = "Danijel Kresic" as const;
export const SITE_EMAIL = "kresic.systems@protonmail.com" as const;
export const SITE_MAILTO = `mailto:${SITE_EMAIL}` as const;
export const GITHUB_URL = "https://github.com/Kresic1998" as const;

export const LEGAL_ADDRESS_LINES = [
  "Burggasse 3",
  "89604 Allmendingen",
  "Deutschland",
] as const;
