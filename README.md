# Kresic Digital Systems — Portfolio & Marketing Site

Production codebase for **Kresic Digital Systems**: a B2B-facing landing experience with EN/DE copy, a Resend-backed contact flow aligned with DACH expectations, and a separate market-analytics demo route. The UI is **dark-first** (`terminal` palette, `dark` class on `<html>`), with a **Three.js** hero scene and lightweight scroll-driven motion on the main page.

**Live site:** [https://kresicds.com/](https://kresicds.com/)

---

## What this repo is

| Area | Description |
|------|-------------|
| **Marketing surface** | Home: **`app/[locale]/page.tsx`** composes an **RSC LCP shell** (logo + hero copy for **`de` or `en`**) with client islands for the header chrome and WebGL; **`LandingPage.tsx`** holds the sections below the hero (services, about, work, contact) plus footer. |
| **Featured work** | Project cards mix **public GitHub CTAs** and a **restricted (no repo)** card; copy and URLs live in `dictionaries/*.json`. |
| **Demo** | `/demo/market-analytics` — client-side terminal UI (Framer Motion + deterministic mock data), `noindex`; **no locale prefix** (middleware treats it as English for document language). |
| **Legal** | **`/de/impressum`**, **`/en/impressum`**, **`/de/datenschutz`**, **`/en/datenschutz`** — same visual baseline; legacy bare paths (e.g. `/impressum`) **308** to **`/de/...`**. |

This is not a generic template; structure and copy reflect how the business is presented in production.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|--------|
| Framework | **Next.js 15** (App Router) | Server Actions for email; RSC-friendly layout; client islands where needed (`"use client"`). |
| Runtime | **React 19**, **TypeScript** (strict) | `noEmit` typecheck in CI/local workflow; dictionaries typed via `LandingDictionary`. |
| Styling | **Tailwind CSS 3** | `darkMode: "class"`; extended **`terminal`** colors in `tailwind.config.ts`. |
| 3D | **Three.js** | Hero particle/visual (`HeroVisual.tsx`); **`ResizeObserver`**-driven sizing (no sync layout reads on mount); card visuals use the same pattern. |
| Motion | **Framer Motion** | Scoped to **`/demo/market-analytics`**; landing below the hero uses **`FadeIn`** + CSS; hero intro uses a small **`lcp-fade-in`** keyframe in `globals.css`. |
| Email | **Resend** | Server Action only (`app/actions/sendEmail.ts`); API key never shipped to the client. |
| Validation | **Zod** | Contact payload validated in the Server Action (`lib/schemas/contactForm.ts`); service area enum in `lib/contact-service.ts`. |
| i18n | **URL segments** + **React Context** + JSON | **`/de` / `/en`** prefixes; **`middleware.ts`** sets **`x-locale`** and redirects **`/`** using **`NEXT_LOCALE`** cookie or **`Accept-Language`** (default **`de`**). `I18nProvider` receives **`initialLocale`** from the root layout (from the header). Dictionaries: `en.json` / `de.json` as `LandingDictionary`. |
| Icons | **Inline SVG** + **Lucide** | Most marketing icons are local SVG components; demo route uses `lucide-react`. |
| Images | **`next/image`** | AVIF/WebP in `next.config.mjs`; tuned `deviceSizes`. |
| Hosting | **Vercel** (typical) | Env-gated secrets; redeploy after changing env vars. |

---

## Architecture notes (senior-level)

- **Client vs server boundaries** — `Providers.tsx` wraps the tree with **`I18nProvider`** ( **`key={locale}`** + **`initialLocale`** from the server so client copy matches the URL). **`app/[locale]/page.tsx`** is a Server Component that streams **logo + hero text** in the first HTML (`KDSLogoSsr`, `HeroCopyMarkup`, `LandingLcpHero`), wraps the interactive header in **`LandingHeaderShellClient`** (client, with a server-rendered logo slot), and mounts **`HeroBackdrop`** (deferred **Three.js** via `DeferMount` → `requestIdleCallback` after post-hydration delays). **`LandingPage`** is client-only for the rest of the scroll story. Heavy card WebGL uses `next/dynamic` (`ssr: false`) plus `MountWhenVisible` / `DeferMount` in `components/landing/HeavyVisuals.tsx`. Legal routes use **`generateMetadata`** with **hreflang** (`alternates.languages` via **`lib/seo.ts`**).
- **i18n & SEO** — Locale is **in the path** (`/[locale]/…`). Root **`<html lang>`** and skip-link text follow **`x-locale`**. **`LanguageSwitcher`** updates **`NEXT_LOCALE`** and **`router.push`** to the same path under the other locale (from `/demo/*` it navigates to **`/de` or `/en`** home). All visible strings for the landing flow go through dictionaries; the contact form posts a hidden `locale` field so **server-side validation errors** match the active language.
- **Consent & native validation** — The form uses **`noValidate`** so the browser does not show OS-localized `required` tooltips on the consent checkbox. The consent label links to the **localized** privacy URL (e.g. **`/de/datenschutz`**) via **`withLocale`** in `lib/locale.ts` (`form.consentLead` / `consentPrivacyLinkText` / `consentTrail`). Consent is enforced **in submit handler** (`form.consentError`) and **again in the Server Action** (Zod `consent` enum). A required **service area** `<select>` maps to localized labels in `dictionaries/en.json` & `de.json` and short inbox tags (`[KDS][WebGL] …`) on the outbound subject.
- **XSS hardening in email** — Outbound HTML from user fields passes through `escapeHtml()` before being embedded in the Resend payload.
- **Security headers** — `next.config.mjs` applies CSP (with allowances for Next inline scripts/styles + Google Fonts), HSTS, frame ancestors, permissions policy, etc.

---

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Redirects to **`/de` or `/en`** (cookie → `Accept-Language` → default **`de`**). |
| `/de`, `/en` | Localized landing: RSC shell in **`app/[locale]/page.tsx`** + **`LandingPage`**. |
| `/de/impressum`, `/en/impressum` | Imprint (TMG-oriented); EN page title/metadata use “Imprint”. |
| `/de/datenschutz`, `/en/datenschutz` | Privacy notice (DSGVO-oriented); EN uses “Privacy” in metadata. |
| `/impressum`, `/datenschutz` (legacy) | **308** permanent redirect to **`/de/...`**. |
| `/demo/market-analytics` | Interactive demo; metadata discourages indexing; no locale prefix. |
| `/sitemap.xml` | Lists **`/de`**, **`/en`**, localized legal URLs, and the demo (`app/sitemap.ts`). |
| `/robots.txt` | Crawl rules + sitemap URL (`app/robots.ts`). |

---

## Project structure

```
.
├── middleware.ts                  # Locale redirect, x-locale header, demo = en
├── app/
│   ├── actions/sendEmail.ts       # Resend Server Action + validation
│   ├── [locale]/                  # Localized marketing + legal
│   │   ├── layout.tsx             # Validates locale → notFound if unknown
│   │   ├── page.tsx               # RSC: LCP logo/hero + header shell + LandingPage
│   │   ├── impressum/ | datenschutz/
│   │   └── …
│   ├── demo/market-analytics/     # Quant-style terminal demo (no [locale])
│   ├── layout.tsx                 # Fonts, metadata, <html lang> from x-locale
│   ├── globals.css
│   ├── robots.ts | sitemap.ts     # /robots.txt, /sitemap.xml
│   └── …
├── components/
│   ├── LandingPage.tsx            # Below-hero sections + footer (client)
│   ├── KDSLogoSsr.tsx             # Server-safe logo SVG for LCP
│   ├── LandingHeaderShellClient.tsx  # Nav, language switcher, mobile menu
│   ├── LandingLcpHero.tsx         # RSC `<section id="hero">` wrapper
│   ├── HeroBackdrop.tsx           # Deferred hero WebGL + gradients
│   ├── HeroCopyMarkup.tsx | HeroTextIsland.tsx  # Hero copy (RSC supplies locale-specific markup)
│   ├── landing/HeavyVisuals.tsx   # dynamic() wrappers for Three.js scenes
│   ├── DeferMount.tsx             # post-hydration idle / intersection gates
│   ├── DeferredThirdPartyScripts.tsx  # optional next/script lazyOnload
│   ├── HeroVisual.tsx             # Three.js hero
│   ├── DataFlowVisual.tsx | InfrastructureGrid.tsx | MarketPulseVisual.tsx
│   ├── ContactFormWithConsent.tsx
│   ├── Logo.tsx | LanguageSwitcher.tsx | FadeIn.tsx | Providers.tsx
│   └── …
├── dictionaries/
│   ├── types.ts                  # LandingDictionary, LocaleCode
│   ├── en.json | de.json
│   └── en.ts | de.ts             # Typed re-exports
├── lib/
│   ├── locale.ts                 # LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, withLocale()
│   ├── seo.ts                    # alternates / home metadata helpers
│   ├── i18n.tsx
│   └── site.ts                   # BRAND_NAME, SITE_EMAIL, GITHUB_URL, legal lines
├── public/images/
├── next.config.mjs               # Headers + image formats
├── tailwind.config.ts
├── .env.example
└── REPAIR_LOG.md                 # Security / audit notes (if present)
```

---

## Environment variables

| Variable | Required | Role |
|----------|----------|------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | `metadataBase` / canonical defaults (falls back to production URL in code if unset). |
| `RESEND_API_KEY` | Yes (prod) | Send contact emails via Resend. |
| `RESEND_FROM_EMAIL` | Yes (prod) | Verified sender, e.g. `Name <noreply@yourdomain.com>` or plain `you@verified-domain.com`. |
| `RESEND_TO_EMAIL` | No | Override contact-form **recipient**; default is `SITE_EMAIL` in `lib/site.ts`. |
| `NEXT_PUBLIC_DEFERRED_SCRIPT_SRC` | No | Optional analytics/pixel script URL; loaded with `next/script` `lazyOnload`. Update CSP in `next.config.mjs` if the origin is not allowed. |

Copy `.env.example` → `.env.local` and fill values. Never commit `.env.local`.

To inspect client bundle composition after `npm run build`, use e.g. `@next/bundle-analyzer` or Chrome DevTools → **Coverage**; chunk hashes (e.g. `page-*.js`) change each build.

---

## Scripts & local development

**Prerequisites:** Node.js **≥ 20**, npm **≥ 10** (aligned with Next 15 / React 19 toolchains).

```bash
git clone <repository-url>
cd <project-folder>   # e.g. moj_sajt or kresic-digital-systems
npm install
cp .env.example .env.local
# Edit .env.local — at minimum set RESEND_* for testing email

npm run dev
```

- **Local:** [http://localhost:3000](http://localhost:3000)
- **Production:** [https://kresicds.com/](https://kresicds.com/)

| Command | Use |
|---------|-----|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint via `next lint` (`.eslintrc.json` → `next/core-web-vitals`; Next 16 will move to the ESLint CLI — see upstream migration notes). |

Before release: **`npm run build`** should complete cleanly; keep **`npx tsc --noEmit`** green in your workflow if you rely on stricter checks than lint alone.

---

## Deployment (Vercel)

1. Connect the Git repository and import the project.
2. **Settings → Environment Variables:** set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL` for Production (and Preview if desired), per `.env.example` (no trailing slash on `NEXT_PUBLIC_SITE_URL`).
3. **Redeploy** after changing variables — changes are not always picked up automatically.

---

## Security, privacy & compliance (summary)

- **GDPR / DACH** — Imprint and privacy pages describe processing (hosting, contact via email provider), legal bases, retention, and data-subject rights. Adjust copy only with legal review.
- **No cookie banner for analytics** — As long as you do not add trackers or non-essential cookies, the current positioning (no analytics scripts in tree) avoids a consent banner for that class of tooling. Re-evaluate if you add Plausible, GA, etc.
- **Secrets** — `RESEND_API_KEY` exists only in server code paths. Server logs for failed sends (including production) may include Resend API error text — avoid pasting production logs into public channels if they contain internal details.

For a chronological list of hardening or incident-related edits, see **`REPAIR_LOG.md`** when maintained.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Contact form returns “not configured” | Missing/empty `RESEND_API_KEY` or invalid production `RESEND_FROM_EMAIL`. |
| “Could not send” / DE *Nachricht konnte nicht gesendet werden* (after deploy) | Resend rejected the request. In **Vercel → Logs**, search for `[sendEmail] Resend error`. Typical causes: `from` not on a **verified domain** in Resend, domain DNS (SPF/DKIM) not complete, or `RESEND_FROM_EMAIL` typo. Until a domain is verified, Resend may only allow sending to your account email — the form always sends **to** `SITE_EMAIL` in `lib/site.ts` (your inbox). |
| Emails fail only on Vercel | Env vars not set for the right environment, or domain/sender not verified in Resend. |
| Type errors after editing copy | Add keys to **both** `en.json` and `de.json`, and update `dictionaries/types.ts` if the shape changes. |
| `PageNotFoundError` / missing routes during `next build` | Remove the `.next` folder and run **`npm run build`** again (stale build output after major upgrades). |

---

## Licence

All rights reserved. © 2025–2026 Danijel Kresic / Kresic Digital Systems.  
Unauthorised reproduction or redistribution of this codebase is prohibited unless otherwise agreed in writing.
