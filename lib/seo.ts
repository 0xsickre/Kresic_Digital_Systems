import type { Metadata } from "next";

import type { LocaleCode } from "@/dictionaries/types";
import {
  BRAND_NAME,
  GITHUB_URL,
  LEGAL_ADDRESS_LINES,
  LINKEDIN_URL,
  OWNER_NAME,
  SITE_EMAIL,
  siteBaseUrl,
} from "@/lib/site";

export { siteBaseUrl };

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
    /**
     * The image itself comes from `app/[locale]/opengraph-image.tsx`; Next fills
     * `twitter:image` from that same file when no `twitter-image` exists. Only
     * the card TYPE has to be stated, and it has to be stated — the default is
     * `summary`, which crops the 1200×630 card into a small square thumbnail.
     */
    twitter: {
      card: "summary_large_image",
      title: h.title,
      description: h.description,
    },
  };
}

const [STREET_ADDRESS, POSTAL_LOCALITY] = LEGAL_ADDRESS_LINES;

/**
 * JSON-LD for the home page — the part of SEO that `<meta>` tags cannot express.
 *
 * Title and description tell a crawler what the page SAYS; this tells it what
 * the page IS, and which real-world entity it belongs to. `sameAs` is the load-
 * bearing field: it is how a search engine ties this domain to the GitHub and
 * LinkedIn profiles as one identity rather than three unrelated pages.
 *
 * `ProfessionalService` over the broader `Organization` because that is what is
 * actually being offered, and it is the type that carries `areaServed`.
 */
export function homeJsonLd(locale: LocaleCode) {
  const base = siteBaseUrl();
  const org = `${base}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": org,
        name: BRAND_NAME,
        url: base,
        email: SITE_EMAIL,
        image: `${base}/${locale}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          streetAddress: STREET_ADDRESS,
          postalCode: POSTAL_LOCALITY.split(" ")[0],
          addressLocality: POSTAL_LOCALITY.split(" ").slice(1).join(" "),
          addressCountry: "DE",
        },
        areaServed: ["DE", "AT", "CH"],
        knowsLanguage: ["de", "en"],
        founder: { "@id": `${base}/#owner` },
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
      {
        "@type": "Person",
        "@id": `${base}/#owner`,
        name: OWNER_NAME,
        jobTitle: "Senior Software Engineer",
        worksFor: { "@id": org },
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: BRAND_NAME,
        inLanguage: locale === "de" ? "de-DE" : "en-US",
        publisher: { "@id": org },
      },
    ],
  };
}

/**
 * `<` is escaped because the JSON is injected into a `<script>` body, where a
 * literal `</script>` inside any string would close the tag early. Every value
 * here is a project constant today, but the escape costs nothing and removes
 * the question.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
