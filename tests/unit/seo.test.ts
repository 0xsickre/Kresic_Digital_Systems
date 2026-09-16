import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  alternatesForLocale,
  homeJsonLd,
  homeMetadata,
  jsonLdScript,
  siteBaseUrl,
} from "@/lib/seo";

describe("siteBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns default when NEXT_PUBLIC_SITE_URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("strips a single trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kresicds.com/");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("preserves URLs without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kresicds.com");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("normalizes path without leading slash via env (still valid origin)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    expect(siteBaseUrl()).toBe("https://example.test");
  });

  it("uses https when the env value omits the scheme", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "kresicds.com");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("falls back to default when the env value is not a valid URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", ":::");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("falls back for javascript: and other non-http(s) schemes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "javascript:alert(1)");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });
});

describe("alternatesForLocale", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds canonical and hreflang for home path", () => {
    const a = alternatesForLocale("en", "/");
    expect(a?.canonical).toBe("https://example.test/en");
    expect(a?.languages?.de).toBe("https://example.test/de");
    expect(a?.languages?.en).toBe("https://example.test/en");
    expect(a?.languages?.["x-default"]).toBe("https://example.test/de");
  });

  it("prefixes a nested path for both locales and x-default (German)", () => {
    const a = alternatesForLocale("de", "/impressum");
    expect(a?.canonical).toBe("https://example.test/de/impressum");
    expect(a?.languages?.de).toBe("https://example.test/de/impressum");
    expect(a?.languages?.en).toBe("https://example.test/en/impressum");
    expect(a?.languages?.["x-default"]).toBe(
      "https://example.test/de/impressum",
    );
  });

  it("normalizes pathname without a leading slash", () => {
    const a = alternatesForLocale("en", "datenschutz");
    expect(a?.canonical).toBe("https://example.test/en/datenschutz");
  });
});

describe("homeMetadata", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns absolute title and Open Graph locale for English", () => {
    const m = homeMetadata("en");
    expect(m.title).toEqual({
      absolute: "Kresic Digital Systems — B2B & FinTech Engineering",
    });
    expect(m.openGraph?.locale).toBe("en_US");
    expect(m.alternates?.canonical).toBe("https://example.test/en");
  });

  it("uses German Open Graph locale for de", () => {
    const m = homeMetadata("de");
    expect(m.openGraph?.locale).toBe("de_DE");
    expect(m.alternates?.canonical).toBe("https://example.test/de");
  });

  it("asks for the large Twitter card, because the default crops to a square", () => {
    // `Metadata["twitter"]` is a union across card kinds, so `card` is the
    // discriminant rather than a property reachable on the union itself.
    const twitter = homeMetadata("en").twitter as { card?: string } | null;
    expect(twitter?.card).toBe("summary_large_image");
  });
});

describe("homeJsonLd", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function graph(locale: "de" | "en") {
    return homeJsonLd(locale)["@graph"] as Record<string, unknown>[];
  }

  it("describes the service, the person behind it, and the site", () => {
    expect(graph("en").map((n) => n["@type"])).toEqual([
      "ProfessionalService",
      "Person",
      "WebSite",
    ]);
  });

  it("splits the legal address into postal code and locality", () => {
    expect(graph("de")[0].address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Burggasse 3",
      postalCode: "89604",
      addressLocality: "Allmendingen",
      addressCountry: "DE",
    });
  });

  /**
   * `sameAs` is the whole point of the block — it is what ties the domain to the
   * profiles as one identity. It pointed at `Kresic1998` for a while after that
   * account was renamed, which is not a dead link so much as a claim about
   * someone else's username.
   */
  it("claims only profiles that still belong to the owner", () => {
    for (const node of graph("en").slice(0, 2)) {
      expect(node.sameAs).toContain("https://github.com/0xsickre");
      expect(JSON.stringify(node.sameAs)).not.toContain("Kresic1998");
    }
  });

  it("escapes < so the block cannot close its own script tag", () => {
    expect(jsonLdScript({ a: "</script><b>" })).not.toContain("</script>");
  });
});
