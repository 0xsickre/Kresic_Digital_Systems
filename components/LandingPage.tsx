"use client";

import type { ReactElement, SVGProps } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { MountWhenVisible } from "@/components/DeferMount";
import { FadeIn } from "@/components/FadeIn";
import {
  CardVisualPlaceholder,
  projectHeaderVisuals,
} from "@/components/landing/HeavyVisuals";
import { KDSLogo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { withLocale } from "@/lib/locale";
import { GITHUB_URL, LINKEDIN_URL, SITE_EMAIL, SITE_MAILTO } from "@/lib/site";

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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              {s.eyebrow}
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl md:text-4xl"
            >
              {s.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:mt-4 sm:text-lg">{s.body}</p>
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
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              {a.eyebrow}
            </p>
            <h2
              id="about-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl sm:leading-tight md:text-4xl"
            >
              {a.title}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed">
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
                sizes="(min-width: 1024px) 192px, 160px"
                className="block h-auto w-full rounded-2xl"
              />
              <figcaption className="mt-3 text-center text-xs leading-snug text-slate-300">
                {a.figcaptionSub}
              </figcaption>
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
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                {p.intro}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-400">
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
                      rootMargin="0px"
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
                  <div className="relative flex min-h-0 flex-1 flex-col border-t border-white/[0.08] bg-gradient-to-b from-slate-900/70 to-slate-900/35 p-6">
                    <div className="flex min-h-0 flex-1 flex-col">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        {project.role}
                      </p>
                      <h3 className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                        {isRestricted ? <IconProjectLock /> : null}
                        <span className="min-w-0">{project.name}</span>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {project.summary}
                      </p>
                      <p className="mt-4 text-sm font-medium leading-relaxed text-slate-200">
                        {project.outcome}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-x-2 gap-y-2.5">
                        {project.tags.map((tag) => (
                          <span
                            key={`${project.name}-${tag}`}
                            className="rounded-md border border-white/10 bg-terminal-800/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {githubUrl ? (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.viewOnGithub}: ${project.name}`}
                        className="mt-6 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_28px_-6px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:text-white hover:shadow-[0_0_36px_-6px_rgba(16,185,129,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:text-xs sm:tracking-[0.14em]"
                      >
                        {p.viewOnGithub}
                        <span aria-hidden className="text-base leading-none text-emerald-200">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <div
                        role="status"
                        aria-label={p.restrictedAccess}
                        className="mt-6 inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:text-xs sm:tracking-[0.14em]"
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
          <p className="max-w-4xl text-xs leading-relaxed text-slate-400">
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
        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
      >
        {o.title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{o.intro}</p>
      <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
        {o.items.map((item, index) => {
          const Icon = opSecIcons[index];
          return (
            <li key={index} className="flex gap-4 py-6 first:pt-8">
              <div className="mt-0.5 shrink-0 text-slate-400" aria-hidden>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-tight text-slate-300">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.body}</p>
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
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {t.contact.body}
            </p>
            <p className="mt-6 text-sm font-medium text-slate-300">
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
  const { t, locale } = useI18n();
  const lf = t.legalFooter;
  const linkClass =
    "inline-flex min-h-11 items-center justify-center rounded-md px-2 text-sm font-medium text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline sm:min-h-[2.75rem]";

  return (
    <footer
      className="border-t border-white/[0.08] bg-terminal-bg py-10 sm:py-12"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:gap-8 sm:px-6 lg:px-8">
        <KDSLogo className="h-12 w-auto text-slate-300 sm:h-14 md:h-16" />
        <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:max-w-none">
          © 2026 Danijel Kresic | Kresic Digital Systems
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1 sm:gap-y-2"
        >
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.a11y.githubProfile}
            className={linkClass}
          >
            GitHub
          </Link>
          <span
            className="hidden h-4 w-px shrink-0 bg-white/15 sm:mx-1 sm:inline-block"
            aria-hidden
          />
          <Link
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.a11y.linkedinProfile}
            className={linkClass}
          >
            LinkedIn
          </Link>
          <span
            className="hidden h-4 w-px shrink-0 bg-white/15 sm:mx-1 sm:inline-block"
            aria-hidden
          />
          <Link
            href={withLocale(locale, "/impressum")}
            prefetch={false}
            className={linkClass}
          >
            {lf.impressum}
          </Link>
          <span
            className="hidden h-4 w-px shrink-0 bg-white/15 sm:mx-1 sm:inline-block"
            aria-hidden
          />
          <Link
            href={withLocale(locale, "/datenschutz")}
            prefetch={false}
            className={linkClass}
          >
            {lf.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <>
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
