import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DatenschutzPageClient } from "@/components/DatenschutzPageClient";
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
  const title = locale === "de" ? "Datenschutz" : "Privacy";
  const description =
    locale === "de"
      ? `Datenschutzerklärung — ${BRAND_NAME}.`
      : `Privacy policy — ${BRAND_NAME}.`;
  return {
    title,
    description,
    alternates: alternatesForLocale(locale, "/datenschutz"),
    openGraph: {
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DatenschutzPageClient />;
}
