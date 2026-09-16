import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WiderrufPageClient } from "@/components/WiderrufPageClient";
import type { LocaleCode } from "@/dictionaries/types";
import { isLocale } from "@/lib/locale";
import { alternatesForLocale } from "@/lib/seo";
import { OWNER_NAME } from "@/lib/site";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as LocaleCode;
  const title = locale === "de" ? "Widerrufsbelehrung" : "Right of Withdrawal";
  const description =
    locale === "de"
      ? `Widerrufsbelehrung und Muster-Widerrufsformular für Verbraucher — ${OWNER_NAME}.`
      : `Right of withdrawal and model withdrawal form for consumers — ${OWNER_NAME}.`;
  return {
    title,
    description,
    alternates: alternatesForLocale(locale, "/widerruf"),
    openGraph: {
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export default async function WiderrufPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <WiderrufPageClient />;
}
