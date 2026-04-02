import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImpressumPageClient } from "@/components/ImpressumPageClient";
import type { LocaleCode } from "@/dictionaries/types";
import { isLocale } from "@/lib/locale";
import { alternatesForLocale } from "@/lib/seo";
import { BRAND_NAME, OWNER_NAME } from "@/lib/site";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as LocaleCode;
  const title = locale === "de" ? "Impressum" : "Imprint";
  const description =
    locale === "de"
      ? `Impressum — ${BRAND_NAME}, ${OWNER_NAME}.`
      : `Imprint — ${BRAND_NAME}, ${OWNER_NAME}.`;
  return {
    title,
    description,
    alternates: alternatesForLocale(locale, "/impressum"),
    openGraph: {
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ImpressumPageClient />;
}
