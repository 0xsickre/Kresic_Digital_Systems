import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/locale";

const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://kresic.digital";

const LEGAL_SLUGS = ["impressum", "datenschutz"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const loc of LOCALES) {
    entries.push({
      url: `${base}/${loc}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    });
    for (const slug of LEGAL_SLUGS) {
      entries.push({
        url: `${base}/${loc}/${slug}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
