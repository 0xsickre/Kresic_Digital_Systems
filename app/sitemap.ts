import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/locale";
import { siteBaseUrl } from "@/lib/site";

const base = siteBaseUrl();

const LEGAL_SLUGS = ["impressum", "datenschutz"] as const;

/**
 * Every URL is listed with its translations, so the two locales are indexed as
 * one page in two languages rather than as near-duplicates competing with each
 * other. The `<head>` already carries the same hreflang set; a crawler that
 * reads the sitemap first should not have to fetch both pages to learn it.
 *
 * `/` is deliberately absent: it 308s to a locale, and a sitemap is for
 * canonical URLs, not for the redirects that lead to them.
 */
function languagesFor(path: string): Record<string, string> {
  return {
    de: `${base}/de${path}`,
    en: `${base}/en${path}`,
    "x-default": `${base}/de${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const loc of LOCALES) {
    entries.push({
      url: `${base}/${loc}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languagesFor("") },
    });
    for (const slug of LEGAL_SLUGS) {
      entries.push({
        url: `${base}/${loc}/${slug}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.5,
        alternates: { languages: languagesFor(`/${slug}`) },
      });
    }
  }

  return entries;
}
