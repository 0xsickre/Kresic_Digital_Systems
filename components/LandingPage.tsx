"use client";

import type { ReactElement, SVGProps } from "react";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { DeferHeavyChild, MountWhenVisible } from "@/components/DeferMount";
import { FadeIn } from "@/components/FadeIn";
import {
  CardVisualPlaceholder,
  DynamicHeroVisual,
  HeroCanvasPlaceholder,
  projectHeaderVisuals,
} from "@/components/landing/HeavyVisuals";
import { KDSLogo } from "@/components/Logo";
import {
  BRAND_NAME,
  GITHUB_URL,
  SITE_EMAIL,
  SITE_MAILTO,
} from "@/lib/site";
import { useI18n } from "@/lib/i18n";

const ContactFormLazy = dynamic(
  () =>
    import("@/components/ContactFormWithConsent").then((m) => ({
      default: m.ContactFormWithConsent,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[min(24rem,55vh)] rounded-xl border border-white/5 bg-slate-900/40"
        aria-hidden
      />
    ),
  },
);

const LanguageSwitcherLazy = dynamic(
  () =>
    import("@/components/LanguageSwitcher").then((m) => ({
      default: m.LanguageSwitcher,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-11 min-w-[5.25rem] shrink-0" aria-hidden />
    ),
  },
);

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;

function IconCustomWeb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x={3} y={4} width={18} height={14} rx={2} />
      <path d="M7 8h4M7 12h10" />
      <path d="M3 18h18" />
    </svg>
  );
}

function IconQuantFinance(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x={4} y={3} width={16} height={18} rx={2} />
      <path d="M8 7h8M8 11h5M8 15h8" />
    </svg>
  );
}

function IconTradingData(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15l3-4 3 2 4-6" />
      <circle cx={8} cy={15} r={1.25} fill="currentColor" stroke="none" />
      <circle cx={11} cy={11} r={1.25} fill="currentColor" stroke="none" />
      <circle cx={14} cy={13} r={1.25} fill="currentColor" stroke="none" />
      <circle cx={18} cy={7} r={1.25} fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconOptimization(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M14.5 4.5 19 9l-7 7-4 1 1-4 7-7Z" />
      <path d="m12 15 3-3M9 18l-2 2M5 14l2-2" />
    </svg>
  );
}

function IconOpSecIsolation(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconOpSecEncrypted(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x={5} y={11} width={14} height={10} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx={12} cy={16} r={1} fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconOpSecDiscretion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3 20 6v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const expertiseIcons: readonly IconComponent[] = [
  IconCustomWeb,
  IconQuantFinance,
  IconTradingData,
  IconOptimization,
];

const opSecIcons: readonly IconComponent[] = [
  IconOpSecIsolation,
  IconOpSecEncrypted,
  IconOpSecDiscretion,
];

function IconProjectLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[1.05rem] w-[1.05rem] shrink-0 text-amber-400/90"
      {...props}
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SiteHeader() {
  const { t } = useI18n();
  const a11y = t.a11y;
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, close]);

  const nav = [
    { href: "#expertise", label: t.nav.expertise },
    { href: "#about", label: t.nav.about },
    { href: "#work", label: t.nav.work },
    { href: "/demo/market-analytics", label: t.nav.liveDemo },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-terminal-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 pl-4 pr-[max(0.875rem,env(safe-area-inset-right))] sm:px-6 sm:pl-6 sm:pr-6 lg:px-8">
        <Link
          href="#hero"
          onClick={close}
          aria-label={`${BRAND_NAME} — ${a11y.logoToHome}`}
          className="inline-flex min-h-[2.75rem] min-w-0 shrink items-center gap-2 rounded-md text-sm font-semibold leading-tight tracking-tight text-white sm:min-w-[2.75rem] sm:shrink-0 sm:gap-3"
        >
          <KDSLogo className="h-7 w-auto shrink-0 text-white sm:h-8 md:h-9" />
          <span className="hidden min-w-0 sm:inline">{BRAND_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <LanguageSwitcherLazy />
          <Link
            href="#contact"
            onClick={close}
            className="hidden min-h-[2.75rem] items-center justify-center rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-950/30 transition hover:bg-emerald-400 sm:inline-flex"
          >
            {t.headerCta}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? a11y.closeMenu : a11y.openMenu}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      {mobileOpen && (
        <nav
          className="border-t border-white/[0.06] bg-terminal-bg/95 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex min-h-[2.75rem] items-center rounded-lg px-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            onClick={close}
            className="mt-4 flex min-h-[2.75rem] w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white shadow-sm shadow-emerald-950/30 transition hover:bg-emerald-400"
          >
            {t.headerCta}
          </Link>
        </nav>
      )}
    </header>
  );
}

function HeroSection() {
  const { t } = useI18n();
  const h = t.hero;

  return (
    <div className="relative z-[1] shadow-[0_32px_72px_-10px_rgba(0,0,0,0.55),0_16px_40px_-16px_rgba(0,0,0,0.35)]">
    <section
      id="hero"
      className="scroll-mt-24 relative isolate flex min-h-[100dvh] flex-col overflow-x-hidden bg-transparent pb-10 pt-20 sm:pb-24 sm:pt-28 md:pb-32 md:pt-32 lg:pb-40"
      aria-labelledby="hero-heading"
    >
      <DeferHeavyChild fallback={<HeroCanvasPlaceholder />}>
        <DynamicHeroVisual />
      </DeferHeavyChild>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-transparent opacity-100"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[480px] w-[480px] rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      {/* Meki prelaz u donju sekciju — senka + ton u terminal-bg */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-40 bg-gradient-to-b from-transparent via-black/35 to-terminal-bg sm:h-48"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-4 text-center sm:px-6 sm:py-6 md:py-8 lg:px-8">
        <FadeIn className="flex w-full max-w-3xl flex-col items-center text-center">
          <p className="mb-4 w-full text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:mb-6">
            {h.kicker}
          </p>
          <h1
            id="hero-heading"
            className="relative z-10 w-full max-w-3xl text-[clamp(1.75rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.08]"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {h.title}
            </span>
          </h1>
          {/* Watermark tačno u traci između naslova i podnaslova (iznad 3D pozadine, ispod teksta) */}
          <div
            className="relative z-[1] flex w-full min-h-[clamp(3.25rem,14vw,5.5rem)] max-w-[100vw] items-center justify-center px-1 py-2 sm:min-h-[4rem] sm:px-2 md:min-h-[4.75rem]"
            aria-hidden
          >
            <span className="pointer-events-none w-full min-w-0 overflow-hidden text-center font-mono uppercase leading-none whitespace-nowrap text-white/[0.36] text-[clamp(0.72rem,0.42rem+3.4vw,2.65rem)] tracking-[0.05em] drop-shadow-[0_0_24px_rgba(255,255,255,0.08)] sm:tracking-[0.1em] md:tracking-[0.16em] lg:tracking-[0.22em]">
              Kresic Digital Systems
            </span>
          </div>
          <p className="relative z-10 mt-1 w-full max-w-2xl text-base leading-relaxed text-slate-200 sm:mt-2 sm:text-lg md:mt-3 md:text-xl">
            {h.sub}
          </p>
          <div className="mx-auto mt-16 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 md:mt-12 sm:gap-4">
            <Link
              href="#contact"
              className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200 sm:px-8"
            >
              {h.ctaPrimary}
            </Link>
            <Link
              href="#expertise"
              className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1] sm:px-8"
            >
              {h.ctaSecondary}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
    </div>
  );
}

function ServicesSection() {
  const { t } = useI18n();
  const s = t.services;

  return (
    <section
      id="expertise"
      className="scroll-mt-24 border-b border-white/[0.06] bg-terminal-bg py-14 sm:py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400/90">
              {s.eyebrow}
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl md:text-4xl"
            >
              {s.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400 sm:mt-4 sm:text-lg">{s.body}</p>
          </div>
        </FadeIn>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {s.cards.map((card, index) => {
            const Icon = expertiseIcons[index];
            return (
              <li key={index} className="h-full min-h-0">
                <FadeIn delay={index * 0.1} className="h-full">
                  <article className="group flex h-full flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/30 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-zinc-900/50 hover:shadow-lg hover:shadow-indigo-500/5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-900/80 text-indigo-300 transition-all duration-300 group-hover:border-indigo-500/25 group-hover:text-indigo-200"
                      aria-hidden
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                    </div>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                      {card.description}
                    </p>
                  </article>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useI18n();
  const a = t.about;

  return (
    <section
      id="about"
      className="scroll-mt-24 border-b border-white/[0.08] bg-terminal-bg py-14 sm:py-20 md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400/90">
              {a.eyebrow}
            </p>
            <h2
              id="about-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl sm:leading-tight md:text-4xl"
            >
              {a.title}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-400 sm:text-lg sm:leading-relaxed">
              <p className="text-slate-300">{a.body}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-2 sm:gap-2.5">
              {a.pills.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-300 backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </FadeIn>
          <FadeIn
            delay={0.12}
            className="flex w-full justify-center lg:pt-2"
          >
            <figure
              className="relative mx-auto w-full max-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_64px_-12px_rgba(99,102,241,0.25),0_0_80px_-20px_rgba(129,140,248,0.35)] lg:max-w-[192px]"
            >
              <Image
                src="/images/portret.webp"
                alt={a.altText}
                width={192}
                height={240}
                priority
                sizes="(min-width: 1024px) 192px, 160px"
                className="block h-auto w-full rounded-2xl"
              />
            </figure>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t } = useI18n();
  const p = t.projects;

  return (
    <section
      id="work"
      className="scroll-mt-24 border-b border-white/[0.08] bg-terminal-bg py-14 sm:py-20 md:py-28"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2
                id="work-heading"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
              >
                {p.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                {p.intro}
              </p>
              <Link
                href="/demo/market-analytics"
                className="mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-950/40 transition hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                {t.nav.liveDemo}
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </Link>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500">
                {p.demoIntro}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {p.tagline}
            </p>
          </div>
        </FadeIn>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-3 lg:gap-8">
          {p.featured.map((project, index) => {
            const HeaderVisual = projectHeaderVisuals[index] ?? projectHeaderVisuals[0];
            const githubUrl = project.githubUrl;
            const isRestricted = !githubUrl;
            return (
              <FadeIn key={project.name} delay={index * 0.12} className="min-h-0">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/35 shadow-none transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-white/20 hover:bg-slate-900/50 hover:shadow-2xl hover:shadow-black/50">
                  <div className="relative isolate w-full shrink-0 overflow-hidden bg-black/40">
                    <MountWhenVisible
                      className="relative block w-full min-h-48"
                      rootMargin="100px"
                      fallback={
                        <CardVisualPlaceholder className="w-full rounded-none border-0 shadow-none ring-0" />
                      }
                    >
                      <HeaderVisual className="w-full rounded-none border-0 shadow-none ring-0" />
                    </MountWhenVisible>
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="relative flex flex-1 flex-col border-t border-white/[0.08] bg-gradient-to-b from-slate-900/70 to-slate-900/35 p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      {project.role}
                    </p>
                    <h3 className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                      {isRestricted ? <IconProjectLock /> : null}
                      <span className="min-w-0">{project.name}</span>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {project.summary}
                    </p>
                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-200">
                      {project.outcome}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={`${project.name}-${tag}`}
                          className="rounded-md border border-white/10 bg-terminal-800/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {githubUrl ? (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100 shadow-[0_0_28px_-6px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-emerald-500/[0.12] hover:text-white hover:shadow-[0_0_36px_-6px_rgba(16,185,129,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-xs sm:tracking-[0.14em]"
                      >
                        {p.viewOnGithub}
                        <span aria-hidden className="text-base leading-none text-emerald-300/90">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <div
                        role="status"
                        aria-label={p.restrictedAccess}
                        className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:text-xs sm:tracking-[0.14em]"
                      >
                        {p.restrictedAccess}
                      </div>
                    )}
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn delay={0.2} className="mt-10 lg:mt-12">
          <p className="max-w-4xl text-xs leading-relaxed text-slate-500">
            {p.legalNote}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function ContactOpSecTrustModule() {
  const { t } = useI18n();
  const o = t.opSec;

  return (
    <aside
      className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 lg:p-10"
      aria-labelledby="opsec-trust-heading"
    >
      <h3
        id="opsec-trust-heading"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
      >
        {o.title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">{o.intro}</p>
      <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
        {o.items.map((item, index) => {
          const Icon = opSecIcons[index];
          return (
            <li key={index} className="flex gap-4 py-6 first:pt-8">
              <div className="mt-0.5 shrink-0 text-slate-500" aria-hidden>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-tight text-slate-300">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function ContactSection() {
  const { t, locale } = useI18n();

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-terminal-bg py-14 sm:py-20 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <FadeIn>
            <h2
              id="contact-heading"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl"
            >
              {t.contact.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              {t.contact.body}
            </p>
            <p className="mt-6 text-sm font-medium text-slate-400">
              {t.contact.writtenContactLead}
            </p>
            <a
              href={SITE_MAILTO}
              className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm font-medium text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              {SITE_EMAIL}
              <span aria-hidden className="shrink-0">
                →
              </span>
            </a>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-none sm:p-8">
              <MountWhenVisible
                className="min-h-[min(24rem,55vh)]"
                rootMargin="180px"
                fallback={
                  <div
                    className="min-h-[min(24rem,55vh)] rounded-xl border border-white/5 bg-slate-900/30"
                    aria-hidden
                  />
                }
              >
                <ContactFormLazy labels={t.form} locale={locale} />
              </MountWhenVisible>
            </div>
          </FadeIn>
          <div className="lg:col-span-2">
            <FadeIn delay={0.18} className="mt-12 lg:mt-16">
              <ContactOpSecTrustModule />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/[0.08] bg-terminal-bg py-8 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:gap-8 sm:px-6 lg:px-8">
        <KDSLogo className="h-12 w-auto text-slate-300 sm:h-14 md:h-16" />
        <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-400">
            © 2026 Danijel Kresic | Kresic Digital Systems
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.githubProfile}
              className="text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="relative z-[1] min-w-0 overflow-x-hidden bg-terminal-bg"
      >
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
