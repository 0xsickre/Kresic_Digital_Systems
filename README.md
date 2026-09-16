# Kresic Digital Systems — Portfolio & Marketing Site

Production codebase for **Kresic Digital Systems**: a B2B-facing landing experience with EN/DE copy and a Resend-backed contact flow aligned with DACH expectations. The UI is **dark-first** (`terminal` palette, `dark` class on `<html>`), with a **Three.js** hero scene and lightweight scroll-driven motion on the main page. Public **quant / data-engineering** work is linked from the landing **featured** card to the headless showcase repo on GitHub (no in-site terminal demo).

**Live site:** [https://kresicds.com/](https://kresicds.com/)

---

## What this repo is

| Area | Description |
|------|-------------|
| **Marketing surface** | Home: **`app/[locale]/page.tsx`** composes an **RSC LCP shell** (logo + hero copy for **`de` or `en`**) with client islands for the header chrome and WebGL; **`LandingPage.tsx`** holds the sections below the hero (`#expertise`, `#about`, `#work` incl. an OpSec/trust note, `#contact`) plus the site footer. |
| **Featured work** | Three project cards: one **restricted (no repo)** ERP card, and two with **public GitHub CTAs**; copy and URLs live in `dictionaries/*.json` (`projects.featured`). The third card highlights **Headless Quant Engine & Data Infrastructure** → [`kds-quant-engine-showcase`](https://github.com/Kresic1998/kds-quant-engine-showcase). |
| **Legal** | **`/de/impressum`**, **`/en/impressum`**, **`/de/datenschutz`**, **`/en/datenschutz`** — same visual baseline, body copy rendered from the `htmlBody` field in `dictionaries/*.json`, plus a **PDF download** per locale from `public/legal/`. Legacy bare paths (e.g. `/impressum`) **308** to **`/de/...`**. |
| **Tests** | Unit tests with **Vitest** (`tests/unit/`) and end-to-end specs with **Playwright** (`tests/e2e/`). |

This is not a generic template; structure and copy reflect how the business is presented in production.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|--------|
| Framework | **Next.js 15** (App Router) | Server Actions for email; RSC-friendly layout; client islands where needed (`"use client"`). |
| Runtime | **React 19**, **TypeScript** (strict) | `noEmit` typecheck via `npx tsc --noEmit`; dictionaries typed via `LandingDictionary`. |
| Styling | **Tailwind CSS 3** | `darkMode: "class"`; extended **`terminal`** colors in `tailwind.config.ts`. |
| 3D | **Three.js** | Hero particle/visual (`HeroVisual.tsx`); **`ResizeObserver`**-driven sizing (no sync layout reads on mount); card visuals use the same pattern, each wrapped in `WebGLErrorBoundary`. |
| Motion | **CSS + `FadeIn`** | Scroll-driven fades via `IntersectionObserver` (`FadeIn.tsx`); hero intro uses **`lcp-fade-in`** in `globals.css`. |
| Email | **Resend** | Server Action only (`app/actions/sendEmail.ts`); API key never shipped to the client. |
| Validation | **Zod** | Contact payload validated in the Server Action (`lib/schemas/contactForm.ts`); service area enum in `lib/contact-service.ts`. |
| i18n | **URL segments** + **React Context** + JSON | **`/de` / `/en`** prefixes; **`middleware.ts`** sets **`x-locale`** and redirects **`/`** using **`NEXT_LOCALE`** cookie or **`Accept-Language`** (default **`de`**). `I18nProvider` receives **`initialLocale`** and `initialDictionary` from the root layout (from the header). Dictionaries: `en.json` / `de.json`, typed re-exports in `en.ts` / `de.ts`. |
| Icons | **Inline SVG** + **Lucide** | Most marketing icons are local SVG components; legal pages use `lucide-react` (`FileDown` on Impressum / Datenschutz). |
| Fonts | **`next/font`** (self-hosted) | `Inter` via `next/font/google` (self-hosted at build time — no runtime Google Fonts request) and a 3-glyph local **JetBrains Mono 700** subset for the “KDS” wordmark (`public/fonts/`). |
| Images | **`next/image`** | AVIF/WebP in `next.config.mjs`; tuned `deviceSizes` (portrait in `public/images/`). |
| Testing | **Vitest** + **Playwright** | Node-environment unit tests; Chromium E2E against a locally started `next dev` (see `playwright.config.ts`). |
| Hosting | **Vercel** (typical) | Env-gated secrets; redeploy after changing env vars. |

---

## Architecture notes (senior-level)

- **Client vs server boundaries** — `Providers.tsx` wraps the tree with **`I18nProvider`** ( **`key={locale}`** + **`initialLocale`** from the server so client copy matches the URL). **`app/[locale]/page.tsx`** is a Server Component that streams **logo + hero text** in the first HTML (`KDSLogoSsr`, `HeroCopyMarkup`, `LandingLcpHero`), wraps the interactive header in **`LandingHeaderShellClient`** (client, with a server-rendered logo slot), and mounts **`HeroBackdrop`** (deferred **Three.js** via `DeferHeavyChild` → `requestIdleCallback` after post-hydration delays). **`LandingPage`** is client-only for the rest of the scroll story. Heavy card WebGL uses `next/dynamic` (`ssr: false`) plus `MountWhenVisible` / `DeferHeavyChild` in `components/landing/HeavyVisuals.tsx`. Legal routes use **`generateMetadata`** with **hreflang** (`alternates.languages` via **`lib/seo.ts`**).
- **i18n & SEO** — Locale is **in the path** (`/[locale]/…`). Root **`<html lang>`** and skip-link text follow **`x-locale`**. **`LanguageSwitcher`** updates **`NEXT_LOCALE`** and **`router.push`** to the same path under the other locale. All visible strings for the landing flow go through dictionaries; the contact form posts a hidden `locale` field so **server-side validation errors** match the active language.
- **Consent & native validation** — The form uses **`noValidate`** so the browser does not show OS-localized `required` tooltips on the consent checkbox. The consent label links to the **localized** privacy URL (e.g. **`/de/datenschutz`**) via **`withLocale`** in `lib/locale.ts` (`form.consentLead` / `consentPrivacyLinkText` / `consentTrail`). Consent is enforced **in the submit handler** (`form.consentError`) and **again in the Server Action** (Zod `consent` enum). A required **service area** `<select>` maps to localized labels in `dictionaries/en.json` & `de.json` and short inbox tags (`[KDS][WebGL] …`) on the outbound subject.
- **Contact-form abuse controls** — The Server Action applies an **in-memory per-IP rate limit** (3 requests / 60 s, best-effort while the function stays warm), a **honeypot** field (`website`), and a **timing gate** (submits faster than 2 s are silently dropped). Resend calls are wrapped in a **10 s timeout**.
- **Input hardening in email** — User fields are stripped of C0 control characters (so CR/LF cannot reach the subject or headers) and passed through `escapeHtml()` before being embedded in the Resend HTML payload.
- **Legal copy pipeline** — Long-form legal text is edited in `private-legal/*.html.example` and synced into the `htmlBody` keys of `dictionaries/de.json` / `en.json` with `npm run sync:legal`; the dictionaries are what ships (see `private-legal/README.md`). If `htmlBody` is empty, the pages fall back to the structured paragraph keys.
- **Security headers** — `next.config.mjs` applies CSP, HSTS (2 years, `includeSubDomains; preload`), `X-Frame-Options`, `frame-ancestors 'none'`, `nosniff`, referrer and permissions policy, and disables `x-powered-by`. The CSP is **first-party only** — no third-party origins are allowlisted: `default-src`/`connect-src`/`font-src` are `'self'`, and the only relaxations are Next's inline scripts/styles plus `'unsafe-eval'` **only** in `next dev` (HMR). Adding any external script or beacon requires widening the policy explicitly.

---

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Redirects to **`/de` or `/en`** (cookie → `Accept-Language` → default **`de`**). |
| `/de`, `/en` | Localized landing: RSC shell in **`app/[locale]/page.tsx`** + **`LandingPage`**. |
| `/de/impressum`, `/en/impressum` | Imprint (TMG-oriented); EN page title/metadata use “Imprint”. |
| `/de/datenschutz`, `/en/datenschutz` | Privacy notice (DSGVO-oriented); EN uses “Privacy” in metadata. |
| Any other bare path (e.g. `/impressum`) | **308** permanent redirect to **`/de/...`** (`middleware.ts`). |
| `/legal/*.pdf` | Static imprint / privacy PDFs per locale, linked from the legal pages. |
| `/sitemap.xml` | Lists **`/de`**, **`/en`**, and localized legal URLs only (`app/sitemap.ts`). |
| `/robots.txt` | Crawl rules + sitemap URL (`app/robots.ts`). |

---

## Project structure

```
.
├── middleware.ts                  # Locale redirect, x-locale header
├── app/
│   ├── actions/sendEmail.ts       # Resend Server Action + validation + anti-spam
│   ├── [locale]/
│   │   ├── layout.tsx             # Validates locale → notFound if unknown
│   │   ├── page.tsx               # RSC: LCP logo/hero + header shell + LandingPage
│   │   ├── impressum/page.tsx     # Metadata + ImpressumPageClient
│   │   └── datenschutz/page.tsx   # Metadata + DatenschutzPageClient
│   ├── layout.tsx                 # Fonts, metadata, <html lang> from x-locale
│   ├── globals.css
│   └── robots.ts | sitemap.ts     # /robots.txt, /sitemap.xml
├── components/
│   ├── LandingPage.tsx            # Below-hero sections + site footer (client)
│   ├── KDSLogoSsr.tsx             # Server-safe logo SVG for LCP
│   ├── LandingHeaderShellClient.tsx  # Nav, language switcher, mobile menu
│   ├── LandingLcpHero.tsx         # RSC `<section id="hero">` wrapper
│   ├── HeroBackdrop.tsx           # Deferred hero WebGL + gradients
│   ├── HeroCopyMarkup.tsx | HeroTextIsland.tsx  # Hero copy (RSC supplies locale-specific markup)
│   ├── landing/HeavyVisuals.tsx   # dynamic() wrappers + placeholders for Three.js scenes
│   ├── DeferMount.tsx             # DeferHeavyChild (post-hydration idle) / MountWhenVisible
│   ├── WebGLErrorBoundary.tsx     # Falls back to a static placeholder on WebGL errors
│   ├── DeferredThirdPartyScripts.tsx  # optional next/script lazyOnload
│   ├── HeroVisual.tsx             # Three.js hero
│   ├── DataFlowVisual.tsx | InfrastructureGrid.tsx | MarketPulseVisual.tsx
│   ├── ContactFormWithConsent.tsx
│   ├── ImpressumPageClient.tsx | DatenschutzPageClient.tsx | LegalPageHeader.tsx
│   ├── GlobalLegalFooter.tsx      # Legal links on non-home routes
│   └── Logo.tsx | KdsMonogramLogo.tsx | LanguageSwitcher.tsx | FadeIn.tsx | Providers.tsx
├── dictionaries/
│   ├── types.ts                   # LandingDictionary, LocaleCode
│   ├── en.json | de.json          # Source of truth for all copy (incl. legal htmlBody)
│   └── en.ts | de.ts              # Typed re-exports
├── lib/
│   ├── locale.ts                  # LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale(), withLocale()
│   ├── seo.ts                     # alternates / home metadata helpers
│   ├── i18n.tsx                   # I18nProvider / useI18n
│   ├── contact-service.ts         # Service-area values + subject tags
│   ├── schemas/contactForm.ts     # Zod schema + localized issue mapping
│   ├── webgl.ts
│   └── site.ts                    # BRAND_NAME, OWNER_NAME, SITE_EMAIL, GITHUB_URL, LINKEDIN_URL, siteBaseUrl(), legal lines
├── private-legal/                 # *.html.example sources for legal copy + README
├── scripts/sync-private-legal-to-dictionaries.mjs   # npm run sync:legal
├── tests/
│   ├── unit/                      # Vitest: locale, seo, contact-service
│   └── e2e/                       # Playwright: smoke, navigation, contact form, legal pages
├── public/
│   ├── images/                    # portret.webp
│   ├── fonts/                     # jetbrains-mono-700-kds.woff2 (logo subset)
│   └── legal/                     # Imprint / privacy PDFs (DE + EN)
├── templates/universal.gitignore  # Starter .gitignore for new repos
├── .cursor/                       # Editor rules + commands (engineering conventions)
├── next.config.mjs                # Security headers + image formats
├── tailwind.config.ts | postcss.config.mjs | .eslintrc.json | tsconfig.json
├── vitest.config.ts | playwright.config.ts
├── LICENSE                        # MIT (source code in this repo)
├── .env.example
├── AI_WORK_LOG.md                 # Agent changelog + conventions (read before new work)
└── REPAIR_LOG.md                  # Security / audit notes
```

---

## Environment variables

| Variable | Required | Role |
|----------|----------|------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | `metadataBase` / canonical defaults (falls back to `https://kresicds.com` in `lib/site.ts` if unset or invalid). |
| `RESEND_API_KEY` | Yes (prod) | Send contact emails via Resend. |
| `RESEND_FROM_EMAIL` | Yes (prod) | Verified sender, e.g. `Name <noreply@yourdomain.com>` or plain `you@verified-domain.com`. In development it falls back to Resend's `onboarding@resend.dev` test sender. |
| `RESEND_TO_EMAIL` | No | Override contact-form **recipient**; default is `SITE_EMAIL` in `lib/site.ts`. |
| `NEXT_PUBLIC_DEFERRED_SCRIPT_SRC` | No | Optional analytics/pixel script URL; loaded with `next/script` `lazyOnload`. Update CSP in `next.config.mjs` if the origin is not allowed. |
| `NEXT_PUBLIC_DEFERRED_SCRIPT_INTEGRITY` | No | Optional SRI hash (e.g. `sha384-…`) for the script above; `crossOrigin="anonymous"` is set automatically when present. |

Copy `.env.example` → `.env.local` and fill values. Never commit `.env.local`.

To inspect client bundle composition after `npm run build`, use e.g. `@next/bundle-analyzer` or Chrome DevTools → **Coverage**; chunk hashes (e.g. `page-*.js`) change each build.

---

## Scripts & local development

**Prerequisites:** Node.js **≥ 20**, npm **≥ 10** (aligned with Next 15 / React 19 toolchains; not enforced via `engines`).

```bash
git clone <repository-url>
cd <project-folder>   # package name is "moj-sajt"; the repo is kresic-digital-systems
npm install
cp .env.example .env.local
# Edit .env.local — at minimum set RESEND_* for testing email

npm run dev
```

- **Production:** [https://kresicds.com/](https://kresicds.com/)

| Command | Use |
|---------|-----|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint via `next lint` (`.eslintrc.json` → `next/core-web-vitals`; Next 16 will move to the ESLint CLI — see upstream migration notes). |
| `npm test` / `npm run test:unit` | Vitest unit suite (`tests/unit/`) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright E2E (starts `next dev` automatically; `--headed` / `--ui` variants available) |
| `npm run test:all` | Unit + E2E |
| `npm run sync:legal` | Sync `private-legal/*.html.example` → `htmlBody` in `dictionaries/*.json` |

E2E notes: set `PLAYWRIGHT_BASE_URL` to test an already-running or remote deployment, and `PLAYWRIGHT_SKIP_WEB_SERVER=1` to stop Playwright from starting its own dev server. Chromium is the only configured project.

Before release: **`npm run build`** should complete cleanly, **`npx tsc --noEmit`** should be green, and the unit suite should pass. There is no CI workflow in this repo — these checks are run locally.

---

## Deployment (Vercel)

1. Connect the Git repository and import the project.
2. **Settings → Environment Variables:** set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL` for Production (and Preview if desired), per `.env.example` (no trailing slash on `NEXT_PUBLIC_SITE_URL`).
3. **Redeploy** after changing variables — changes are not always picked up automatically.

---

## Security, privacy & compliance (summary)

- **GDPR / DACH** — Imprint and privacy pages describe processing (hosting, contact via email provider), legal bases, retention, and data-subject rights. Adjust copy only with legal review.
- **No cookie banner today** — There are **no analytics, tracking, or RUM scripts in the tree**. The only hook for a third-party tag is `NEXT_PUBLIC_DEFERRED_SCRIPT_SRC`, which is unset and ships nothing when empty. Re-evaluate the consent position — and update the privacy copy in `dictionaries/*.json` — before adding Plausible, GA, or any monitoring provider.
- **Secrets** — `RESEND_API_KEY` exists only in server code paths.
- **Logging** — `sendEmail` logs (rate-limit hits, honeypot triggers, Resend errors) are **development-only** by design; nothing from the contact flow is written to production logs.

For a chronological list of hardening or incident-related edits, see **`REPAIR_LOG.md`**.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Contact form returns “not configured” | Missing/empty `RESEND_API_KEY`. A separate “sender is not configured” message means `RESEND_FROM_EMAIL` is unset in production. |
| “Could not send” / DE *Nachricht konnte nicht gesendet werden* (after deploy) | Resend rejected the request or the 10 s timeout elapsed. Production logging is disabled, so reproduce locally with `npm run dev` and read `[sendEmail] Resend error` in the terminal, or check the Resend dashboard's own logs. Typical causes: `from` not on a **verified domain** in Resend, domain DNS (SPF/DKIM) not complete, or a `RESEND_FROM_EMAIL` typo. Until a domain is verified, Resend may only allow sending to your account email — the form sends **to** `RESEND_TO_EMAIL`, or `SITE_EMAIL` in `lib/site.ts` when that is unset. |
| Form silently “succeeds” but no email arrives | Honeypot or timing gate fired (submits under 2 s return success without sending), or the per-IP rate limit (3 / 60 s) was hit — the latter shows an explicit “too many requests” message. |
| Emails fail only on Vercel | Env vars not set for the right environment, or domain/sender not verified in Resend. |
| Type errors after editing copy | Add keys to **both** `en.json` and `de.json`, and update `dictionaries/types.ts` if the shape changes. |
| Legal page shows old text after editing `private-legal/*.example` | Run **`npm run sync:legal`** and commit the updated `dictionaries/*.json` — the `.example` files are sources, not what ships. |
| `PageNotFoundError` / missing routes during `next build` | Remove the `.next` folder and run **`npm run build`** again (stale build output after major upgrades). |
| Playwright reuses a stale dev server | An old `next dev` may not pick up config changes (e.g. CSP). Restart it, or run with `CI=true` for a fresh `webServer`. |

---

## Licence

Source code in this repository is licensed under the **[MIT License](LICENSE)** (see `LICENSE` in the repo root). You may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, provided the copyright notice and permission notice are included in all copies or substantial portions.

**Trademarks and site content:** The names **Kresic Digital Systems**, logos, marketing copy in `dictionaries/`, and the live site content are not granted by the MIT licence alone; reuse of branding or long-form legal text may require separate permission. Third-party dependencies remain under their respective licences.

© 2025–2026 Danijel Kresic / Kresic Digital Systems.
