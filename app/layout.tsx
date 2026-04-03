import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";

import { DeferredThirdPartyScripts } from "@/components/DeferredThirdPartyScripts";
import { GlobalLegalFooter } from "@/components/GlobalLegalFooter";
import { Providers } from "@/components/Providers";
import {
  DEFAULT_LOCALE,
  isLocale,
  type LocaleCode,
} from "@/lib/locale";
import { BRAND_NAME, siteBaseUrl } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

/** Wordmark inside `KDSLogo` SVG — preloaded subset, swap to avoid invisible text during load. */
const kdsLogoMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-kds-logo-mono",
  preload: true,
});

/** Match `homeMetadata` titles: ≤60 chars for Open Graph / link previews. */
const siteTitle = `${BRAND_NAME} — B2B & FinTech Engineering` as const;

const siteDescription =
  "Danijel Kresic: Independent Senior Software Engineer. Scalable B2B web applications, quantitative data pipelines, and enterprise architecture — Kresic Digital Systems." as const;

const siteKeywords: readonly string[] = [
  "Software Engineer",
  "FinTech Architect",
  "B2B Web Development",
  "Quantitative Systems",
  "Next.js",
  "React",
  "TypeScript",
  "Trading Algorithms",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl()),
  title: {
    default: siteTitle,
    template: `%s · ${BRAND_NAME}`,
  },
  description: siteDescription,
  keywords: [...siteKeywords],
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const LOCALE_HEADER = "x-locale";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const raw = h.get(LOCALE_HEADER);
  const locale: LocaleCode =
    raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const htmlLang = locale === "de" ? "de" : "en";
  const skipLabel =
    locale === "de" ? "Zum Inhalt springen" : "Skip to main content";

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${kdsLogoMono.variable} scroll-smooth dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-terminal-bg font-sans text-slate-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          {skipLabel}
        </a>
        <Providers key={locale} initialLocale={locale}>
          {children}
        </Providers>
        <DeferredThirdPartyScripts />
        <GlobalLegalFooter />
      </body>
    </html>
  );
}
