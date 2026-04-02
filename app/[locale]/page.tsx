import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HeroBackdrop } from "@/components/HeroBackdrop";
import { HeroCopyMarkup } from "@/components/HeroCopyMarkup";
import { HeroTextIsland } from "@/components/HeroTextIsland";
import { KDSLogoSsr } from "@/components/KDSLogoSsr";
import { LandingHeaderShellClient } from "@/components/LandingHeaderShellClient";
import { LandingLcpHero } from "@/components/LandingLcpHero";
import { LandingPage } from "@/components/LandingPage";
import { de } from "@/dictionaries/de";
import { en } from "@/dictionaries/en";
import type { LocaleCode } from "@/dictionaries/types";
import { isLocale } from "@/lib/locale";
import { homeMetadata } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/site";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return homeMetadata(raw);
}

/**
 * Logo + hero H1/copy are composed here as RSC children so the first HTML chunk
 * includes LCP markup. Interactive header chrome and WebGL hydrate separately.
 */
export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as LocaleCode;
  const dict = locale === "de" ? de : en;
  const logoAriaLabel = `${BRAND_NAME} — ${dict.a11y.logoToHome}`;

  return (
    <>
      <LandingHeaderShellClient
        logo={(
          <Link
            href="#hero"
            aria-label={logoAriaLabel}
            className="inline-flex min-h-[2.75rem] min-w-0 shrink items-center gap-2 rounded-md text-sm font-semibold leading-tight tracking-tight text-white sm:min-w-[2.75rem] sm:shrink-0 sm:gap-3"
          >
            <KDSLogoSsr className="h-7 w-auto shrink-0 text-white sm:h-8 md:h-9" />
            <span className="hidden min-w-0 sm:inline">{BRAND_NAME}</span>
          </Link>
        )}
      />
      <main
        id="main"
        className="relative z-[1] min-w-0 overflow-x-hidden bg-terminal-bg"
      >
        <LandingLcpHero>
          <HeroBackdrop />
          <HeroTextIsland>
            <HeroCopyMarkup h={dict.hero} />
          </HeroTextIsland>
        </LandingLcpHero>
        <LandingPage />
      </main>
    </>
  );
}
