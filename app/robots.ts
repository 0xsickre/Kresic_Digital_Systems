import type { MetadataRoute } from "next";

import { siteBaseUrl } from "@/lib/site";

const base = siteBaseUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
