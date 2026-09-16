import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AgbPageClient } from "@/components/AgbPageClient";
import type { LocaleCode } from "@/dictionaries/types";
import { isLocale } from "@/lib/locale";
import { alternatesForLocale } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/site";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as LocaleCode;
  const title =
    locale === "de"
      ? "Allgemeine Geschäftsbedingungen"
      : "General Terms and Conditions";
  const description =
    locale === "de"
      ? `Allgemeine Geschäftsbedingungen für Verbraucher und Unternehmer — ${BRAND_NAME}.`
      : `General terms and conditions for consumers and businesses — ${BRAND_NAME}.`;
  return {
    title,
    description,
    alternates: alternatesForLocale(locale, "/agb"),
    openGraph: {
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export default async function AgbPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AgbPageClient />;
}
