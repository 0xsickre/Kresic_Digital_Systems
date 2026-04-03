import type { Metadata } from "next";

import type { LocaleCode } from "@/dictionaries/types";
import { BRAND_NAME } from "@/lib/site";

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kresic.digital"
  );
}

export function alternatesForLocale(
  locale: LocaleCode,
  pathname: string,
): Metadata["alternates"] {
  const base = siteBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const dePath = path === "/" ? "/de" : `/de${path}`;
  const enPath = path === "/" ? "/en" : `/en${path}`;
  return {
    canonical: `${base}/${locale}${path === "/" ? "" : path}`,
    languages: {
      de: `${base}${dePath}`,
      en: `${base}${enPath}`,
      "x-default": `${base}/de${path === "/" ? "" : path}`,
    },
  };
}

const HOME_COPY: Record<
  LocaleCode,
  { title: string; description: string }
> = {
  de: {
    title: `${BRAND_NAME} — B2B & FinTech Engineering`,
    description:
      "Danijel Kresic: Senior Software Engineer. Skalierbare B2B-Webanwendungen, quantitative Datenpipelines und Enterprise-Architektur — Kresic Digital Systems.",
  },
  en: {
    title: `${BRAND_NAME} — B2B & FinTech Engineering`,
    description:
      "Danijel Kresic: Independent Senior Software Engineer. Scalable B2B web applications, quantitative data pipelines, and enterprise architecture — Kresic Digital Systems.",
  },
};

export function homeMetadata(locale: LocaleCode): Metadata {
  const h = HOME_COPY[locale];
  return {
    /** Root layout uses `title.template` (`%s · ${BRAND_NAME}`); home titles already include the brand — use absolute to avoid "…Engineering · Kresic Digital Systems · Kresic Digital Systems". */
    title: { absolute: h.title },
    description: h.description,
    alternates: alternatesForLocale(locale, "/"),
    openGraph: {
      type: "website",
      title: h.title,
      description: h.description,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}
