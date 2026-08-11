# CMedical Website V2 — Project Blueprint

**Status:** Read-only audit documentation (no application changes)  
**Repository:** `sanity-health-hub`  
**Audit date:** 2026-08-10  
**Audience:** Senior developers onboarding before making changes  

**Related docs (do not treat as source of truth without code verification):**

- `docs/CMEDICAL_CMS_ARCHITECTURE_BLUEPRINT.md` — proposed CMS redesign (design only, not implemented)
- `docs/aktuelt-page-audit.md` / `docs/aktuelt-page-fix.md` — Aktuelt/News page audits
- `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` — production deployment notes
- `SANITY_CONTENT_AUDIT.md` — content audit artifact
- `README.md` — **outdated** (still describes Vite/Lovable; app is Next.js)

**Rule used in this document:** Every statement is based on repository code/configuration. Where something cannot be confirmed: **NOT CONFIRMED FROM CODE**.

---

## Table of contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [Application Architecture](#4-application-architecture)
5. [Route Map](#5-route-map)
6. [Component Architecture](#6-component-architecture)
7. [Sanity Architecture](#7-sanity-architecture)
8. [Content / Data Flow](#8-content--data-flow)
9. [API Architecture](#9-api-architecture)
10. [Article / News Architecture](#10-article--news-architecture)
11. [Localization](#11-localization)
12. [SEO](#12-seo)
13. [Environment Configuration](#13-environment-configuration)
14. [Security](#14-security)
15. [Performance](#15-performance)
16. [Deployment](#16-deployment)
17. [Current Problems](#17-current-problems)
18. [Technical Debt](#18-technical-debt)
19. [Risk Assessment](#19-risk-assessment)
20. [Recommended Development Priorities](#20-recommended-development-priorities)
21. [Hardcoded vs CMS Content](#21-hardcoded-vs-cms-content)
22. [Important File Map](#22-important-file-map)
23. [Architecture Diagram](#23-architecture-diagram)
24. [Design System & Responsive](#24-design-system--responsive)
25. [Bug / Risk Inventory](#25-bug--risk-inventory)

---

## 1. Executive Summary

CMedical Website V2 is a **Next.js 16 App Router** frontend with an embedded **Sanity Studio v5**, field-level **Norwegian/English** localization, and server proxies for **Metodika booking**, **contact email (SMTP)**, and **Sanity GROQ**.

Most marketing/medical pages resolve through a single CMS catch-all:

```
/{locale}/[[...segments]]
```

Slugs and listing prefixes are **CMS-driven** via a route index GROQ query, not hardcoded folder trees for content pages. Dedicated App Router folders exist for booking, guide, Studio, and design demos.

**Main data sources**

| Source | Role |
|--------|------|
| Sanity (`developer` / `production` datasets) | Pages, treatments, specialists, clinics, articles, site settings |
| Metodika booking API | Availability, caregivers, webaccounts, appointments |
| Patientsky | Optional clinic booking iframe / calendars |
| SMTP (Nodemailer) | Contact form mail |
| Supabase | Present (legacy Vite env names + client); edge functions under `supabase/functions` |
| Static `src/data/*` | Fallbacks / migration leftovers (partially still live) |

**Biggest current issues (summary)**

1. Unauthenticated open GROQ proxy (`/api/sanity/groq`) with server `SANITY_TOKEN`
2. Unauthenticated booking write APIs (`webaccounts`, `appointments`, `complete`)
3. Article category schema enum ≠ live filter/category values
4. Dual SEO stacks (server metadata vs client `PageSEO` hreflang bug)
5. Client-heavy pages + browser GROQ for most CMS content

---

## 2. Technology Stack

Versions below are from `package.json` ranges and **exact installed** versions from `package-lock.json` where resolved.

| Layer | Package / tool | Declared | Installed (lock) |
|-------|----------------|----------|------------------|
| Framework | `next` | `^16.2.12` | `16.2.12` |
| UI library | `react` / `react-dom` | `^19.2.7` | `19.2.7` |
| Language | `typescript` | `^5.8.3` | `5.8.3` |
| CMS | `sanity` | `^5.31.1` | `5.31.1` |
| Next–Sanity | `next-sanity` | `^13.0.11` | `13.0.11` |
| Sanity client | `@sanity/client` | `^7.16.0` | `7.22.1` |
| Images | `@sanity/image-url` | `^2.0.3` | (range) |
| Portable Text | `@portabletext/react` | `^6.0.3` | (range) |
| CSS | `tailwindcss` | `^3.4.17` | `3.4.17` |
| UI primitives | Radix + shadcn (`components.json`) | multiple | — |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | present | zod `3.25.76` |
| i18n | `i18next`, `react-i18next` | present | i18next `26.3.1` |
| Data fetching (client) | `@tanstack/react-query` | `^5.83.0` | — |
| Animation | `framer-motion` | `^12.24.10` | — |
| Carousel | `embla-carousel-react` | `^8.6.0` | — |
| Email | `nodemailer` | `^9.0.4` | — |
| Backend helper | `@supabase/supabase-js` | `^2.105.4` | — |
| Search | `fuse.js` | `^7.3.0` | — |
| Charts | `recharts` | `^2.15.4` | — |
| ML (edge/local) | `@huggingface/transformers` | `^3.7.6` | — |
| Studio plugins | `@sanity/vision`, `@sanity/language-filter`, `sanity-plugin-iframe-pane`, `sanity-plugin-internationalized-array` | present | — |
| Lint | `eslint` + `eslint-config-next` | `^9` / `^16.2.12` | — |

**Node version requirement:** **NOT CONFIRMED FROM CODE** — no `engines`, `.nvmrc`, `.node-version`, or `packageManager` field. README mentions nvm generically. `@types/node` is `^22.16.5` (types only).

**Package managers present:** `package-lock.json`, `bun.lock`, `bun.lockb`. `.npmrc` sets `legacy-peer-deps=true`.

**State management:** React Query for client Sanity/booking data; no Redux/Zustand found in dependencies.

**Auth libraries:** No NextAuth/Clerk/Auth0 dependency. Demo access gate via `NEXT_PUBLIC_ENABLE_ACCESS_GATE` (env flag). Booking/contact APIs do not implement end-user auth.

**Payments:** No Stripe/Vipps/etc. dependency found.

**Maps:** Clinic map component exists; `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` appears in `test/.env.local.example` — production Maps usage **NOT FULLY CONFIRMED** beyond clinic location helpers.

**Analytics:** `src/lib/tracking.ts` pushes to `window.dataLayer` if present (GTM). Cookiebot key exists in Sanity privacy schema — injection into HTML **NOT CONFIRMED FROM CODE**.

**Image handling:** Custom `AssetImg` / Sanity image URL builder; `next.config.ts` allows `cdn.sanity.io`, Unsplash, GCS, R2. App primarily uses `<img>` + Sanity transforms, not `next/image` everywhere.

---

## 3. Repository Structure

```
sanity-health-hub/
├── src/                      # Next.js application
│   ├── app/                  # App Router (layouts, catch-all, API, studio, SEO)
│   ├── components/           # UI + domain components
│   ├── site-pages/           # Page-level React views (CMS-rendered + demos)
│   ├── hooks/                # React Query / Sanity / booking hooks
│   ├── lib/                  # Routing, Sanity, SEO, booking, email, i18n
│   ├── data/                 # Static/fallback content (legacy + some live merges)
│   ├── i18n/                 # i18next config + nb/en JSON
│   ├── integrations/         # Supabase client
│   └── proxy.ts              # Locale redirect / html-lang (Next 16 proxy, not middleware.ts)
├── test/                     # Sanity Studio package + schemas + migrations
│   ├── schemaTypes/          # All Sanity schemas (source of truth)
│   ├── sanity/               # Desk, actions, migrations, preview
│   ├── sanity.config.ts
│   └── package.json          # Nested package for Studio
├── public/                   # Fonts, favicons, videos, robots.txt, manifest
├── scripts/                  # Dev helpers, route generators, repro scripts
├── docs/                     # Audits, runbooks, architecture proposals
├── supabase/                 # config.toml, SQL migrations, Deno edge functions
├── backups/, tmp/            # Local working artifacts
├── .next*, .sanity/          # Generated build/cache (gitignored patterns)
├── next.config.ts
├── sanity.config.ts          # Re-exports test/sanity.config
├── vercel.json               # { "framework": "nextjs" }
├── package.json
└── PROJECT_BLUEPRINT.md      # This file
```

### Why key directories exist

| Path | Purpose |
|------|---------|
| `src/app` | Next routing, RSC entry, API route handlers, embedded Studio |
| `src/site-pages` | Large page compositions reused by catch-all / dedicated routes |
| `src/lib/routing` | CMS route index, resolve/render, path builders |
| `src/lib/sanity` | Fetchers, dual-read, image URL, revalidation tags |
| `src/lib/queries.ts` | Primary GROQ catalog |
| `test/` | Studio + schemas + content migrations (not unit tests) |
| `supabase/functions` | Deno functions (chat, search, translate, Instagram, etc.) |
| `docs/` | Operational and design documentation |

### Generated / build folders

| Path | Notes |
|------|-------|
| `.next` | Default Next dist |
| `.next-build`, `.next-audit`, `.next-work` | Alternate `NEXT_DIST_DIR` when `.next` locked |
| `.sanity`, `test/.sanity` | Sanity runtime cache |
| `node_modules`, `test/node_modules` | Dependencies |
| `tsconfig.tsbuildinfo` | Incremental TS |

### Testing setup

- No Jest/Vitest/Playwright test suite wired in root `package.json` scripts.
- `playwright-1.62.1.tgz` exists at repo root — **usage as active test suite NOT CONFIRMED FROM CODE**.
- “test” folder name means **Sanity Studio package**, not automated tests.
- Verification script: `npm run verify:cms-routes` → `src/scripts/verify-cms-routes.ts`.

---

## 4. Application Architecture

### Router model

- **App Router** (`src/app`)
- **No `middleware.ts`** — locale gating lives in `src/proxy.ts` (Next.js 16 proxy convention)
- **No `loading.tsx` / `error.tsx`** under `src/app` (confirmed absent)

### Request → UI flow

```
Browser request
  → src/proxy.ts
      - skip /api, /studio, static, robots/sitemap
      - if missing locale prefix → redirect to /{detectedLocale}...
      - set x-cmedical-html-lang
  → app/layout.tsx (root HTML lang + default metadata)
  → app/[locale]/layout.tsx
      - fetchCmsRouteIndex()
      - wrap with NextProviders (React Query, i18n, access gate)
  → Dedicated page OR [[...segments]] catch-all
      - Server: generateMetadata, optional prefetch (homepage/treatment/category)
      - Client page components fetch via hooks → POST /api/sanity/groq
  → PageLayout (header/nav/footer from siteSettings)
  → Domain UI
```

### Rendering strategies

| Strategy | Where |
|----------|--------|
| Redirect | `/` → `/{locale}`; unprefixed paths via proxy |
| ISR / revalidate | Catch-all `export const revalidate = 600`; tagged `unstable_cache` for Sanity fetches |
| Server Components | Layouts, catch-all page shell, metadata, some SEO JSON-LD |
| Client Components | Most `site-pages/*`, booking, listing/detail content UIs |
| Server Actions | **NOT CONFIRMED FROM CODE** as a primary pattern (API route handlers used instead) |
| Draft mode | Site queries published docs only (`!(_id in path("drafts.**"))`); no Next draft mode confirmed |

### Data fetching

| Path | Mechanism |
|------|-----------|
| Server | `sanityClient` (`useCdn: false`) + `sanityFetchCached` + tags |
| Browser | `fetch-groq-browser.ts` → `POST /api/sanity/groq` |
| Homepage / treatment / category | Server prefetch + React Query hydration providers |
| Booking | Browser → `/api/booking/*` → Metodika with `BOOKING_API_KEY` |
| Contact | Browser → `POST /api/contact` |

### Caching / revalidation

- Tags/intervals: `src/lib/sanity/sanity-revalidate.ts` (e.g. homepage 300s, singleton 600s)
- Webhook: `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET`
- Catch-all page: `revalidate = 600`, `dynamicParams = true`

### Error / not-found

- Locale not-found: `src/app/[locale]/not-found.tsx` → `site-pages/NotFound`
- Article missing: client UI “not found” state in `ArticlePage`
- Global error boundary pages: **not present** as `error.tsx`

---

## 5. Route Map

### Locales

- URL locales: `no` | `en` (`src/lib/i18n/routing.ts`)
- UI i18n resources: `nb` | `en`
- Sanity content lang: `no` | `en`

### Edge / special

| URL | File | Notes |
|-----|------|-------|
| (all non-static) | `src/proxy.ts` | Locale redirect + html lang header |
| `/` | `src/app/page.tsx` | Redirect to `/{locale}` |
| `/robots.txt` | `src/app/robots.ts` | Non-prod disallow all |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static + CMS route index |
| `/llms.txt` | `src/app/llms.txt/route.ts` | AI/llms helper |
| `/studio/*` | `src/app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio |

### CMS catch-all (primary content surface)

| File | Pattern |
|------|---------|
| `src/app/[locale]/[[...segments]]/page.tsx` | `/{locale}` and `/{locale}/{*segments}` |

Resolved kinds (via `resolveCmsRoute` / `renderCmsRoute`):

| Kind | Typical URL (locale + CMS slugs) | Page component | Data |
|------|----------------------------------|----------------|------|
| Home | `/no`, `/en` | `site-pages/Index` | `fetchHomepageData` (server) |
| Singleton | `/om-oss`, `/kontakt`, `/priser`, … | About, Contact, Priser, Services, … | Client hooks / CMS |
| News listing | `/aktuelt`, `/news` | `Aktuelt` | `NEWS_PAGE_QUERY`, `ARTICLES_QUERY` |
| Article | `/aktuelt/{slug}`, `/news/{slug}` | `ArticlePage` | `ARTICLE_BY_SLUG_QUERY` |
| Clinics listing | `/klinikker`, `/clinics` | `Clinics` | CMS |
| Clinic detail | `/klinikker/{slug}` | `ClinicDetailPage` | CMS |
| Specialists listing | `/spesialister`, `/specialists` | `Specialists` | CMS |
| Specialist detail | `/spesialister/{slug}` | `SpecialistProfile` | CMS |
| Careers | `/karriere` (+ job slug) | `Karriere` / `KarriereDetail` | CMS |
| Category | `/gynekologi`, `/fertilitet`, … | `TreatmentCategoryLanding` | `fetchTreatmentCategoryData` |
| Treatment | `/{category}/{treatment}` | SubTreatment / specialty pages | `fetchTreatmentData` |
| Theme | single-segment theme slug | `CmsThemePage` | CMS |
| Legacy | `/behandlinger/...` | Strip prefix and re-resolve | — |

**FAQ:** No dedicated FAQ route. FAQ content is embedded on homepage / treatments / services via Sanity collections.

**Product routes:** Indexed in GROQ products list but **not** matched in `resolveCmsRoute`. `next.config` redirects `/product/:id` → `/nb/produkt/:id` (locale `nb` while app locales are `no`/`en`) — likely stale.

### Dedicated App Router pages

| URL | File | Role |
|-----|------|------|
| `/{locale}/booking` | `.../booking/page.tsx` | Booking demo (NB nav) |
| `/{locale}/book-appointment` | `.../book-appointment/page.tsx` | EN booking |
| `/{locale}/bestill-time` | `.../bestill-time/page.tsx` | Alias |
| `/{locale}/guide` | `.../guide/page.tsx` | Guide (also CMS `guidePage`) |
| `/{locale}/godkjenning` | noindex internal | |
| `/{locale}/icon-preview` | noindex | |
| `/{locale}/demoer`, `/design-demoer` | Design hub | |
| `/{locale}/fastlegeveiledning-overgangsalder` | Theme/marketing | |
| `/{locale}/gynekologi-design/*` | Design prototypes | |
| `/{locale}/fertilitet-design/*` | Design prototypes | |

### Rewrites / redirects (`next.config.ts`)

- EN aliases: `prices`→`pricing`, `current`→`news`, `about`→`about-us`
- Category EN→NO slug rewrites
- Listing prefix acceptance on EN (`/en/aktuelt` → `/en/news`, etc.)
- Redirects: product legacy; `tjenester-og-priser` → services/tjenester

### API routes

See [§9 API Architecture](#9-api-architecture).

---

## 6. Component Architecture

### Layout / chrome

| Component | Path | CMS? | Notes |
|-----------|------|------|-------|
| `PageLayout` | `components/layout/PageLayout.tsx` | Hybrid | Header + nav + CTA from `siteSettings`, fallbacks in code |
| `Footer` | `components/homepage/Footer.tsx` | Hybrid | Contact/social/links from settings; clinics from Sanity |
| `BurgerMenu` / `MobileNavMenuContent` | layout | Hybrid | |
| `MobileBottomNav` | layout | Mostly hardcoded routes | |
| `ServicesDropdown` | layout | CMS categories | |
| `LanguageSelector` | layout | Hardcoded UI | |

No separate `Header.tsx` — header is inside `PageLayout`.

### Domain component folders

| Folder | Purpose |
|--------|---------|
| `components/homepage/` | Live homepage bands (hero, trust, news, booking CTA, specialists) |
| `components/layout/` | Shared page chrome, heroes, FAQ |
| `components/specialist/` | Profile sections + booking |
| `components/treatments/` | Stats, symptoms, tags, reviews scroller |
| `components/clinic/` | Booking block, map |
| `components/news/` | Portable Text, related, Instagram/social |
| `components/page-sections/` | CMS assembler: specialists/articles/insurance/booking CTA |
| `components/booking/` | Booking journey + Patientsky iframe |
| `components/seo/` | `PageSEO`, JSON-LD, geo helpers |
| `components/media/` | CMS media / responsive hero |
| `components/ui/` | shadcn/Radix primitives |
| Root `components/*Section` | Many legacy marketing sections |

### Page sections (CMS-driven reusable bands)

Rendered by `PageSectionsRenderer`:

- `pageSectionSpecialists`
- `pageSectionArticles`
- `pageSectionInsurance`
- `pageSectionBookingCta`

### Duplication clusters

| Cluster | Examples | Risk |
|---------|----------|------|
| Heroes | `HeroBanner`, `HeroCompact`, `HeroSection`, `SplitHero`, `PageHero`, … | Legacy vs live |
| Specialists sections | root + homepage + elegant re-export | Dead/legacy risk |
| Trust sections | multiple Trust* components | Overlap |
| CTAs | `BookingCTA`, `CTASection` wrapper, sticky FAB, page-section block | Intentional layers + sticky outlier |
| Design labs | `fertilitet-design/*`, `gynekologi-design/*` | Prototypes, not production system |
| Treatment page twins | Old/new specialty page files | Migration debt |

---

## 7. Sanity Architecture

### Configuration

| Item | Location |
|------|----------|
| Studio config (source of truth) | `test/sanity.config.ts` |
| Root re-export | `sanity.config.ts` → `./test/sanity.config` |
| CLI | `sanity.cli.ts` → `./test/sanity.cli` |
| Schemas | `test/schemaTypes/index.ts` |
| Desk | `test/sanity/deskStructure.ts` |
| Dataset guards | `src/lib/sanity/dataset-env.ts`, `test/sanity/dataset-env.ts` |
| Allowed datasets | `"developer"` \| `"production"` (fail-fast) |

### Plugins / Studio features

- `structureTool` + custom desk + `defaultDocumentNode` (iframe previews)
- `visionTool`
- `internationalizedArray` (`no` default, `en`)
- Custom actions: `PublishWithNavSync`, `TranslateToEnglishAction`, safe specialist delete
- Navbar dataset badge

### Desk groups

1. **Pages** — singletons (Home, About, Services, Insurance, Pricing, Clinics, Contact, News+articles, Guide, Careers, Privacy)
2. **Medical Content** — categories, treatments, specialists, clinics
3. **Content Library** — FAQ/CTA/Insurance collections, Google Reviews
4. **Settings** — Site Settings, Booking, Listing Sort

**Hidden from desk but registered:** `themePage`, `product`, `ctaModule`, `heroModule`.

### Localization pattern

- Field-level `internationalizedArray*` types
- Frontend normalize: `src/lib/sanity/normalize-i18n.ts`
- GROQ coalesce: requested lang → Norwegian → legacy raw
- Slug matching: `src/lib/sanity/slug-groq.ts`

### Shared SEO object (`seo`)

Fields: `metaTitle`, `metaDescription`, `ogImage`, `noIndex`  
Many pages also have `geoSummary` for AI/GEO.

### Document types (registry)

**Pages / singletons:** `homepage`, `aboutPage`, `contactPage`, `newsPage`, `pricingPage`, `insurancePage`, `servicesPage`, `clinicsPage`, `careersPage`, `bookingPage`, `guidePage`, `themePage`, `specialistsPage`, `specialistsListingPage`, `privacyPolicyPage`, `siteSettings`, `listingSortSettings`, `googleReviewSettings`

**Entities:** `treatmentCategory`, `treatment`, `specialist`, `clinicPage`, `article`, `jobListing`, `product` (desk-hidden)

**Library:** `faq`, `faqCollection`, `ctaCollection`, `insuranceCollection`, `googleReview`, `testimonial`, `ctaModule`, `heroModule`

**Objects:** `media`, `homepageSpecialistsSection`, `locationSearch`, `subTreatmentLayout`, `pageSection*`, `youtubeEmbed`, `blockContent`, `seo`

### Key entity relationships

```
treatmentCategory ←→ treatment
specialist → treatmentCategory, clinicPage, faqCollection, googleReview, specialist(related)
clinicPage → treatment, specialist, faqCollection
homepage / newsPage → article, faqCollection, googleReview, treatmentCategory
pageSections → specialist | article | ctaCollection | insuranceCollection
```

### Client / images / drafts

| Concern | Implementation |
|---------|----------------|
| Server client | `src/lib/sanityClient.ts` — apiVersion `2024-01-01`, `useCdn: false`, optional `SANITY_TOKEN` |
| Browser | GROQ proxy only (keeps token server-side) |
| Image URLs | `src/lib/sanity/image-url.ts` (`@sanity/image-url`) |
| Drafts | Excluded in queries via `publishedOnly` |
| Preview | Studio iframe panes → local/Vercel URLs by locale (`test/sanity/previewUrls.ts`) |

### Article schema (detail)

`test/schemaTypes/article.ts`:

| Field | Type | Required |
|-------|------|----------|
| `title` | i18n string | yes |
| `slug` | i18n slug from title | yes (pattern) |
| `primaryImage` | image + i18n alt | soft rules |
| `excerpt` | i18n text | optional |
| `body` | i18n blockContent | optional |
| `category` | string enum | yes — `fagartikkel` \| `news` \| `prisliste` \| `stillingsutlysning` |
| `publishedAt` | datetime | yes |
| `seo` | seo object | optional (no `requiredNoEnSeo`) |
| `geoSummary` | i18n | optional |
| `pageSections` | assembler | optional |

**No author document field.** Bylines are body text (`Av …`) styled in Portable Text renderer.

### News page schema

`newsPage` singleton: hero, filters (`key`, labels, `acceptedArticleCategories`), `listSize`, `featuredArticles` (max 4), `listingArticles`, social/Instagram, SEO, booking CTA page section.

Filter aliases: `test/schemaTypes/newsFilterCategories.ts` maps business IDs to stored category strings (e.g. `Pasienthistorier`, `Fagartikler`, `Nytt fra oss`, …) — **broader than article schema enum**.

---

## 8. Content / Data Flow

### Generic CMS page

```
Sanity document (published)
  → GROQ in src/lib/queries.ts (or domain *-data.ts)
  → sanityClient (server) OR /api/sanity/groq (browser)
  → normalize-i18n / dual-read helpers
  → site-pages/* or section components
  → browser UI
```

### Homepage

```
homepage singleton
  → HOMEPAGE_QUERY / fetchHomepageData (server)
  → Homepage hydration provider
  → Index + homepage/* components
```

### Treatment / category

```
treatmentCategory / treatment
  → fetchTreatmentCategoryData / fetchTreatmentData (server on catch-all)
  → TreatmentCategoryLanding / SubTreatmentPage / specialty templates
  → pageSections + dual-read FAQ/CTA/media
```

### Article / News (detailed in §10)

```
newsPage + article documents
  → NEWS_PAGE_QUERY / ARTICLES_QUERY / ARTICLE_BY_SLUG_QUERY
  → useNewsPage / useArticles / useArticle
  → Aktuelt / ArticlePage
```

### Dual-read pattern

Legacy fields + new collections coexist. Helpers under `src/lib/sanity/*-dual-read.ts` (CTA, FAQ, insurance, media, business reputation).

---

## 9. API Architecture

### Booking (Metodika)

Upstream defaults in `src/lib/booking/upstream.ts`:

- Default base: `BOOKING_API_BASE_URL` or hardcoded `http://13.50.107.42/api/v1/resources`
- Auth header: `X-API-KEY` from `BOOKING_API_KEY` (server-only)
- Retries/cache/throttle configurable via env

| Endpoint | Method | Auth to caller | Notes |
|----------|--------|----------------|-------|
| `/api/booking/activity-groups` | GET | None | |
| `/api/booking/category-clinics` | GET | None | |
| `/api/booking/freetimes` | GET | None | |
| `/api/booking/availability` | GET | None | |
| `/api/booking/times` | GET | None | Item prices |
| `/api/booking/locations` | GET | None | |
| `/api/booking/rooms` | GET | None | |
| `/api/booking/users` | GET | None | Caregivers |
| `/api/booking/webaccounts` | POST | None | Creates patient (PII) |
| `/api/booking/appointments` | POST | None | Creates appointment |
| `/api/booking/complete` | POST | None | Account + appointment |
| `/api/booking/no/external` | GET | None | Patientsky calendars via Sanity clinic booking |

**Browser exposure:** Key stays server-side; **routes themselves are publicly callable**.

### Contact

| Endpoint | Method | Auth | Env |
|----------|--------|------|-----|
| `/api/contact` | POST | IP rate limit; SMTP gated | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_SECURE` + Sanity settings |

Zod validation; confirmation email failures non-fatal.

### Sanity

| Endpoint | Method | Auth | Risk |
|----------|--------|------|------|
| `/api/sanity/groq` | POST | **None** | Arbitrary GROQ with server token |
| `/api/sanity/health` | GET | None | Prod returns limited ids |
| `/api/revalidate` | POST | Shared secret header/Bearer | Webhook |

### Assets

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/l5e-assets/[assetId]/[filename]` | GET | Local/R2 asset proxy; path traversal blocked |
| Rewrite `/__l5e/assets-v1/...` | → API route | |

### Other integrations

| Integration | Location | Client/server |
|-------------|----------|---------------|
| Patientsky iframe | `PatientskyIframe.tsx` | `NEXT_PUBLIC_PATIENTSKY_IFRAME_URL` (client) |
| Supabase JS | `src/integrations/supabase/client.ts` | Publishable key (public by design if RLS OK) |
| Supabase edge | `supabase/functions/*` | Deno; separate from Next routes |

---

## 10. Article / News Architecture

### Surfaces

| Surface | Path | Component |
|---------|------|-----------|
| Listing | `/{locale}/{newsSlug}` | `src/site-pages/Aktuelt.tsx` |
| Detail | `/{locale}/{newsSlug}/{articleSlug}` | `src/site-pages/ArticlePage.tsx` |
| Cards | Inline in `Aktuelt.tsx` | FeaturedCard / ArticleCard |
| Portable Text | `src/components/news/article-portable-text.tsx` | |
| Related | `src/components/news/ArticleRelatedSection.tsx` | Same category, max 3 |
| Social | `NewsSocialPlatformSection`, `NewsInstagramSection` | |
| Homepage news | `NewsSplitScreen.tsx` | Can fall back to `src/data/articles.ts` |

### Queries (`src/lib/queries.ts`)

- `NEWS_PAGE_QUERY` — singleton IA, filters, featured/listing refs, social
- `ARTICLES_QUERY` — all published articles ordered by `publishedAt desc`
- `ARTICLE_BY_SLUG_QUERY` — single article + body + pageSections + seo

### Hooks (`src/hooks/useSanity.ts`)

- `useNewsPage`, `useArticles`, `useArticle`

### Listing behavior (code-verified)

- **All filter:** Featured from `featuredArticles[]`; listing from `listingArticles[]` order; size from `listSize`
- **Other filters:** Use full `ARTICLES_QUERY` pool filtered by accepted categories; featured becomes first 4 of sorted set
- Infinite scroll / more button uses `listSize` (default 9 in schema constraints 1–48)

### Why article bugs can appear

| Symptom | Likely cause (from code) |
|---------|--------------------------|
| 1. Missing articles | Unpublished/draft; deleted refs in featured/listing; empty listing + filter excludes; content gap in dataset (docs cite 2 missing in developer) |
| 2. Incorrect content | Wrong slug match `[0]` if duplicates; EN empty → NO coalesce |
| 3. Listing ≠ detail | All uses CMS curated lists; category filters use full article pool |
| 4. Incorrect images | Missing `primaryImage`; CDN URL vs asset builder mismatch; hardcoded CDN project id in static fallbacks |
| 5. Incorrect formatting | Portable Text heuristics (lead after H2; `Av …` byline); missing custom marks |
| 6. Missing sections | Detail does **not** render `pageSections` despite fetching; related hidden if no peers |
| 7. Spacing/design | Client CSS / section composition; design demos vs production pages diverge |
| 8. Wrong category | Schema enum vs live values (`Pasienthistorier` etc.); thin `normalizeCategory`; default `"Nytt fra oss"` |
| 9. Wrong slug | Empty slug drops cards; missing news listing slug yields links without prefix |
| 10. Wrong language | Locale `no`/`en` vs i18n `nb`; coalesce to Norwegian; client cache cross-locale if invalidation fails |

### SEO on articles

- Server: `fetchArticleSeo` / dynamic route metadata uses `article.seo`
- Client: `PageSEO` uses title/excerpt; can ignore CMS metaTitle; hardcodes `https://cmedical.no` in places

---

## 11. Localization

| Concern | Behavior |
|---------|----------|
| Detection | Cookie → geo heuristic (e.g. India→`en`) → default `no` (`detect-locale.ts`) |
| URL | `/no/...`, `/en/...` |
| UI strings | i18next `nb`/`en` JSON |
| CMS fields | `no`/`en` internationalized arrays |
| Fallback | Missing EN → Norwegian coalesce in GROQ/normalize |
| Nav paths | Synced via `PublishWithNavSync`; locale path maps in routing helpers |
| Metadata | Server builders emit `nb-NO` / `en` / `x-default` |
| HTML lang | Proxy sets `en` or `no-NO` |

### Potential language mismatch bugs

1. Triple codes: URL `no`, i18n `nb`, Sanity `no`, HTML `no-NO` vs metadata `nb-NO`
2. Client `PageSEO` hreflang points all langs at same URL
3. Product redirect uses `/nb/` (not `/no/`)
4. Static search/clinic fallback data often Norwegian-only
5. Portable Text byline/section heuristics Norwegian-oriented

---

## 12. SEO

### Dual stack

1. **Server (preferred):** `generateMetadata` via `metadata-builders.ts`, `route-metadata.ts`, `dynamic-route-metadata.ts` — correct alternates via `siteUrl()`
2. **Client (legacy):** `PageSEO` + `useClientDocumentHead` — known hreflang bug (all languages → same URL); can overwrite server tags after hydration

### Coverage

| Page type | Dynamic SEO |
|-----------|-------------|
| CMS catch-all (home, articles, treatments, clinics, …) | Yes |
| Guide / fastlege theme dedicated pages | Yes |
| Booking dedicated pages | No dedicated `generateMetadata` found |
| Design demos | noindex / robots disallow |

### Other SEO assets

- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts` + `robots-paths.ts`
- JSON-LD: homepage, breadcrumbs, geo helpers
- Org phone/address/ratings still hardcoded in some JSON-LD builders
- Clinics ItemList URLs missing locale prefix in at least one path (`Clinics.tsx`) — SEO bug risk

---

## 13. Environment Configuration

**No root `.env.example`.** Variable names only (never print secrets).

### Observed / referenced variables

| Variable | Purpose | Used where | Public? | Required? |
|----------|---------|------------|---------|-----------|
| `SANITY_PROJECT_ID` | Project id | server, next.config inject | No | Yes (fail-fast) |
| `SANITY_DATASET` | `developer`\|`production` | server, next.config | No | Yes |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Mirrored for browser/Studio | client | Yes | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Mirrored dataset | client | Yes | Yes |
| `SANITY_TOKEN` | Authenticated Sanity reads | server client / GROQ proxy | **No** | Required for private `developer` |
| `SANITY_REVALIDATE_SECRET` | Webhook auth | `/api/revalidate` | No | Prod webhook |
| `SANITY_STUDIO_*` | Studio project/dataset overrides | `test/` Studio | Mixed | Studio |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | SEO, deploy detection | Yes | Strongly recommended |
| `BOOKING_API_KEY` | Metodika API key | `/api/booking/*` | **No** | Booking |
| `BOOKING_API_BASE_URL` + per-resource URLs | Upstream endpoints | `upstream.ts` | No | Optional (defaults exist) |
| `BOOKING_*_TTL*`, concurrency | Cache/throttle | booking lib | No | Optional |
| `SMTP_*` | Contact mail | `/api/contact`, smtp.ts | No | Contact |
| `NEXT_PUBLIC_SUPABASE_URL` / `PUBLISHABLE_KEY` | Supabase client | integrations | Yes | If Supabase features used |
| `VITE_SUPABASE_*` | Legacy names in local `.env` | **legacy** | Yes | Prefer NEXT_PUBLIC_* |
| `NEXT_PUBLIC_ENABLE_ACCESS_GATE` | Demo password gate | providers | Yes | Optional |
| `NEXT_PUBLIC_PATIENTSKY_IFRAME_URL` | Embed base | PatientskyIframe | Yes | If Patientsky |
| `PATIENTSKY_API_URL` / `NEXT_PUBLIC_PATIENTSKY_API_URL` | Calendars API | booking/no/external | Mixed | Optional |
| `L5E_ASSETS_CDN_URL`, `L5E_PROJECT_ID` | Asset proxy | l5e-assets route | No | If L5E assets |
| `NEXT_DIST_DIR` | Alternate Next dist | next.config | No | Dev workaround |
| `VERCEL_ENV` / `NODE_ENV` | Environment detection | robots, gates, health | Platform | Platform |
| `ALLOW_PRODUCTION_MIGRATION` | Migration safety | Studio scripts | No | Scripts |
| `OPENAI_API_KEY`, `LOVABLE_API_KEY` | Studio/example only | `test/.env.local.example` | No | Optional tools |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps (example) | test env example | Yes | Optional |

**Secrets must never be committed.** `.gitignore` ignores `.env*`.

---

## 14. Security

### Findings (ranked)

#### CRITICAL

1. **Open GROQ proxy** — `src/app/api/sanity/groq/route.ts` accepts arbitrary GROQ with no auth/allowlist; executes via token-bearing `sanityClient`. If token has write or private data access, this is data exfiltration / mutation risk.
2. **Unauthenticated booking writes** — `webaccounts`, `appointments`, `complete` publicly callable; can create patients/appointments using server key.

#### HIGH

3. **Hardcoded booking API host fallback** over HTTP (`http://13.50.107.42/...`) in `upstream.ts` if env unset.
4. **Booking GET scrape surface** — schedules, users, prices without app-level auth (may be intentional for UX).
5. **Error leakage** — GROQ proxy returns upstream error `message` to client (502 body).

#### MEDIUM

6. **Client SEO hardcoding production host** — staging/preview can emit prod canonicals.
7. **`NEXT_PUBLIC_PATIENTSKY_API_URL`** — API host exposed to bundle (no key in name, widens surface).
8. **Dual env naming** (`VITE_SUPABASE_*` vs `NEXT_PUBLIC_*`) — misconfiguration risk.
9. **No CSRF tokens** on cookie-less JSON POSTs — mitigated partly by same-site defaults; booking/contact still abuseable cross-site without additional controls. **Full CSRF posture NOT CONFIRMED.**

#### LOW

10. XSS via Portable Text — depends on serializer allowlist (`@portabletext/react`); custom HTML injection **NOT CONFIRMED**; YouTube embeds exist.
11. Dependency vulnerabilities — **NOT AUDITED** (`npm audit` not run in this pass).
12. Rate limiting — contact has IP limit; GROQ/booking largely unlimited.

### Positive controls observed

- Sanity project/dataset fail-fast (no silent defaults in bundle)
- Dataset allowlist `developer`|`production`
- Revalidate endpoint secret-gated
- SMTP credentials server-only (`server-only` email module)
- L5E asset path traversal checks
- Contact Zod validation

---

## 15. Performance

### Biggest risks (ranked)

1. **Most product pages are `"use client"`** — large JS hydration cost
2. **Browser GROQ proxy** for listings/details — extra latency; no shared HTTP cache discipline like server `unstable_cache`
3. **No `next/dynamic` splits found** in `src` for heavy pages
4. **Images not consistently using `next/image`** — miss optimizer; Sanity CDN params help
5. **Duplicate queries** possible across homepage sections + route index + client hooks
6. **Booking freetimes** fan-out with concurrency controls — still chatty under load
7. **Heavy deps** available (`@huggingface/transformers`, recharts) — impact depends on import graph (**bundle analysis NOT RUN**)

### Mitigations already present

- Server prefetch + hydration for homepage/treatment/category
- Tagged Sanity cache + webhook revalidation
- Booking response cache / retry / throttle in `upstream.ts`

---

## 16. Deployment

| Item | Finding |
|------|---------|
| Hosting | Vercel (framework nextjs in `vercel.json`; runbook confirms live FE) |
| Build | `next build --webpack` |
| Start | `next start` |
| Dev | `node scripts/next-dev.cjs` |
| Studio | Embedded at `/studio`; also deployable from `test/` (`sanity deploy` / static `dist`) |
| Domains | Canonical default `https://cmedical.no` in `siteUrl()` |
| Image CDN | Sanity CDN + configured remotePatterns |
| Datasets | `developer` (private/token) and `production` |
| Runbook note | Frontend can be live while production dataset migrations lag — content repair separate from FE deploy |

**Do not deploy from this audit.**

---

## 17. Current Problems

1. Security: open GROQ + open booking writes
2. Article category model drift (schema vs filters vs content)
3. Article detail ignores `pageSections`; underuses CMS SEO on client
4. Listing vs filter article pools diverge
5. Dual SEO / broken client hreflang
6. Hardcoded org/contact/SEO fallbacks and static `src/data` merges
7. README outdated; `.env.example` missing
8. Product redirect locale `nb` inconsistency
9. Design-demo routes coexist with production CMS pages
10. Production content gaps documented in Aktuelt audits (dataset-specific)

---

## 18. Technical Debt

| Debt | Safe to leave? | Notes |
|------|----------------|-------|
| Legacy `src/data/*` large files | Short-term yes if unused | Remove after confirming zero runtime imports |
| Dual-read helpers | Needed until migrations complete | Do not remove early |
| Multiple Hero/Trust variants | Cleanup later | Confirm Index imports first |
| Design-lab folders | OK if noindex + robots deny | Keep out of sitemap intent |
| `react-helmet-async` alongside Next metadata | Migrate off client SEO | Causes dual-stack bugs |
| Nested `test/` package name | Confusing | Rename conceptually in docs only for now |
| Bun + npm lockfiles both present | Pick one package manager eventually | |

---

## 19. Risk Assessment

| Area | Risk level | Notes |
|------|------------|-------|
| Security (GROQ/booking) | **Critical** | Public abuse surface |
| Content correctness (News) | **High** | Category/list curation bugs |
| SEO correctness | **High** | hreflang + hardcoded host |
| Localization consistency | **Medium** | Triple locale codes |
| Performance | **Medium–High** | Client-heavy architecture |
| Migration/cutover | **Medium** | Dual-read + dataset lag (per runbook) |
| Dependency CVEs | **Unknown** | Not scanned this pass |

---

## 20. Recommended Development Priorities

1. **Lock down `/api/sanity/groq`** — allowlist queries or move reads server-only; never expose arbitrary GROQ with a privileged token.
2. **Protect booking write endpoints** — rate limit, bot protection, abuse monitoring; review whether public creation is intended.
3. **Unify article categories** — align schema enum, filter aliases, and stored values; migrate content.
4. **Finish SEO single-stack** — prefer server `generateMetadata`; fix/remove client hreflang; use `siteUrl()` everywhere.
5. **Aktuelt/Article parity** — one article source of truth for All vs filters; render or drop unused detail `pageSections`; remove static homepage news fallbacks.

---

## 21. Hardcoded vs CMS Content

### A. Intentionally hardcoded UI

- Layout structure, mobile bottom nav chrome, design-demo pages
- Button/CTA visual system, typography shells
- i18next default strings for UI chrome
- Booking journey step UI

### B. Should probably come from CMS

- Org phone/address/aggregate ratings in JSON-LD (`HomepageSEO`, `home-jsonld`, etc.)
- `src/data/clinicServices.ts` merge into Clinics
- `src/data/articles.ts` / search data fallbacks
- Hardcoded emails in LeadPopup/Insurance (`post@cmedical.no`)
- Placeholder phones on some treatment templates

### C. Should come from environment variables

- Site URL (partially does; client SEO bypasses)
- Sanity project/dataset (correctly env-driven in config; **literals remain in static CDN URLs** in `articles.ts` / `NewsSplitScreen`)
- Booking base URL (has env, but HTTP IP fallback is dangerous)
- SMTP / API keys (already env — keep server-only)

### D. Potential bug / security issue

- Open GROQ proxy
- Unauthenticated booking POSTs
- HTTP booking fallback host
- Client hreflang all same URL
- `/nb/produkt` redirect vs `/no` locale
- Hardcoded Sanity CDN project id `bk8rw7yi` in static article data (may disagree with current project — **verify against active env; do not assume**)

---

## 22. Important File Map

| Path | Purpose | Why it matters |
|------|---------|----------------|
| `src/proxy.ts` | Locale gate | Every non-API HTML request |
| `src/app/[locale]/[[...segments]]/page.tsx` | CMS catch-all | Most content routes |
| `src/lib/routing/resolve-route.ts` | Route kind resolution | URL → page type |
| `src/lib/routing/render-cms-route.tsx` | Render + metadata | Page wiring |
| `src/lib/routing/fetch-route-index.ts` | CMS slug index | Sitemap + resolution |
| `src/lib/queries.ts` | GROQ catalog | Data contracts |
| `src/lib/sanityClient.ts` | Server Sanity client | Token boundary |
| `src/app/api/sanity/groq/route.ts` | Browser GROQ proxy | Security hotspot |
| `src/lib/booking/upstream.ts` | Metodika client | Booking integration |
| `src/site-pages/Aktuelt.tsx` | News listing | Editorial UX |
| `src/site-pages/ArticlePage.tsx` | Article detail | Body/related/SEO |
| `src/components/news/article-portable-text.tsx` | PT renderer | Formatting |
| `src/components/layout/PageLayout.tsx` | Site chrome | Nav/header |
| `src/components/page-sections/PageSectionsRenderer.tsx` | Shared bands | Cross-page CMS blocks |
| `test/schemaTypes/*` | Content model | CMS truth |
| `test/sanity.config.ts` | Studio | Editor experience |
| `test/sanity/deskStructure.ts` | Desk IA | Editor navigation |
| `next.config.ts` | Rewrites/images/env | Deploy behavior |
| `src/lib/seo/metadata-builders.ts` | Server SEO | Canonical/hreflang |
| `src/components/seo/PageSEO.tsx` | Client SEO | Legacy/bugs |
| `src/lib/env.ts` | Public env helpers | Site URL / gates |
| `src/app/api/revalidate/route.ts` | Cache webhook | Freshness |
| `src/app/api/contact/route.ts` | Contact form | Email path |
| `src/index.css` | Design tokens | Visual system |
| `tailwind.config.ts` | Tailwind theme | Brand tokens |
| `docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` | Ops | Live cutover context |

---

## 23. Architecture Diagram

```
                         ┌──────────────────────┐
                         │       Browser         │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │  src/proxy.ts         │
                         │  locale redirect      │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │     Next.js 16        │
                         │  App Router (RSC)     │
                         └──────────┬───────────┘
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
   ┌──────────▼──────────┐ ┌────────▼────────┐ ┌─────────▼─────────┐
   │ [locale]/[[...]]    │ │ Dedicated pages │ │ /studio (Studio)  │
   │ catch-all CMS routes │ │ booking, guide, │ │                    │
   │                      │ │ design demos    │ │                    │
   └──────────┬───────────┘ └────────┬───────┘ └─────────┬─────────┘
              │                      │                    │
   ┌──────────▼──────────────────────▼────────┐          │
   │ site-pages + components + PageLayout     │          │
   └──────────┬───────────────────────────────┘          │
              │                                           │
   ┌──────────▼──────────┐                     ┌─────────▼─────────┐
   │ Data layer          │                     │ test/schemaTypes  │
   │ - server fetch+cache│                     │ Sanity schemas    │
   │ - React Query hooks │                     └─────────┬─────────┘
   │ - normalize/dual-read                                │
   └──────────┬──────────┘                               │
              │                                           │
   ┌──────────▼──────────────────────────────────────────▼──┐
   │                 Integrations                            │
   │  Sanity CDN/API  │  Metodika booking  │  SMTP          │
   │  Patientsky      │  Supabase (+edge)  │  R2/L5E assets │
   └─────────────────────────────────────────────────────────┘
              │
              ▼
         HTML/JSON response → UI
```

---

## 24. Design System & Responsive

### Tokens (`src/index.css` via `globals.css`)

- Brand HSL CSS variables: `--brand-dark`, `--brand-yellow`, `--brand-warm`, `--brand-mid`, `--brand-beige`, `--brand-terracotta`
- Semantic shadcn tokens: background/foreground/primary/accent/muted/…
- `--radius: 0.625rem`, `--max-shell: 1400px`, gutters
- Font: **ABC Ginto Normal** (`public/fonts/`), wired in `tailwind.config.ts`
- Utilities: `.page-shell`, media aspect helpers, gradients, card-hover, mobile spacing overrides
- Dark mode class variables exist; product emphasis is light brand (not dark-first)

### Tailwind

- Default breakpoints; container `2xl: 1400px`
- CTA button variants documented in `ui/button.tsx` (`cta`, `cta-outline`, dark variants)
- Plugin: `tailwindcss-animate`

### Responsive patterns

- Mobile nav: burger + optional bottom nav
- Homepage hero: Framer-based carousel (not Embla)
- Treatment/category carousels: Embla `ui/carousel`
- Responsive media: `ResponsiveHeroMedia`, Sanity srcset helpers
- Overflow/spacing: mobile overrides in `index.css`

Visual redesign is out of scope for this audit.

---

## 25. Bug / Risk Inventory

| # | Issue | Location | Why problem | Severity | Suggested direction (do not implement here) |
|---|-------|----------|-------------|----------|-----------------------------------------------|
| 1 | Arbitrary GROQ proxy | `api/sanity/groq/route.ts` | Token abuse / data leak | CRITICAL | Allowlist or server-only fetchers |
| 2 | Public booking writes | `api/booking/webaccounts\|appointments\|complete` | Spam/fraud appointments | CRITICAL | Auth/rate-limit/captcha + monitoring |
| 3 | HTTP booking fallback host | `lib/booking/upstream.ts` | Cleartext API if env missing | HIGH | Require HTTPS env; fail closed |
| 4 | Article category drift | `article.ts` vs `newsFilterCategories.ts` | Wrong filters/labels | HIGH | Unify vocabulary + migrate docs |
| 5 | Listing vs filter pools | `Aktuelt.tsx` | Inconsistent sets | HIGH | Single query strategy |
| 6 | Client hreflang bug | `PageSEO` / `use-client-document-head` | Bad international SEO | HIGH | Remove client alternates; trust server |
| 7 | Hardcoded SEO base URL | `PageSEO.tsx` etc. | Staging→prod canonicals | MEDIUM | Use `siteUrl()` |
| 8 | Article `pageSections` unused | `ArticlePage.tsx` | Editors expect CTA bands | MEDIUM | Render or remove from schema/query |
| 9 | Static news fallback | `NewsSplitScreen.tsx` + `data/articles.ts` | Stale/wrong homepage news | MEDIUM | Remove fallback or CMS-only empty state |
| 10 | Clinics JSON-LD without locale | `Clinics.tsx` | Incorrect absolute URLs | MEDIUM | Prefix `/no` or `/en` |
| 11 | Product redirect `/nb/` | `next.config.ts` | Broken locale | LOW–MED | Change to `/no` or remove |
| 12 | No app `error.tsx`/`loading.tsx` | `src/app` | Weak UX on failures | LOW | Add boundaries |
| 13 | README outdated | `README.md` | Onboarding confusion | LOW | Rewrite for Next 16 |
| 14 | Missing `.env.example` | repo root | Secret/setup mistakes | MEDIUM | Add names-only example |
| 15 | Triple locale codes | routing/i18n/content-lang | Subtle EN bugs | MEDIUM | Document + centralize mappers |

---

## Appendix A — npm scripts

| Script | Command |
|--------|---------|
| `dev` | `node scripts/next-dev.cjs` |
| `dev:clean` | clean + next-dev |
| `build` | `next build --webpack` |
| `start` | `next start` |
| `lint` | `eslint .` |
| `typecheck` | `tsc --noEmit` |
| `verify:cms-routes` | CMS route verification |
| `backfill:en*` / `migrate:treatment-*` | Delegated to `test/` package |

---

## Appendix B — Implementation gaps vs intended V2 architecture

From code + `docs/CMEDICAL_CMS_ARCHITECTURE_BLUEPRINT.md` (proposal) + Aktuelt docs:

| Area | Current | Gap |
|------|---------|-----|
| Page builder | Limited `pageSections` (4 band types) | Blueprint wants fuller component library — **not implemented** |
| Homepage composition | Largely code-ordered sections | CMS does not fully own section order |
| News | Curated lists + filters | Category enum/filter mismatch; detail sections unused |
| SEO | Dual server/client | Client stack still active |
| Products | Schema + redirect | Not in `resolveCmsRoute` |
| Design demos | Many routes | Parallel to CMS production pages |

---

## Appendix C — Explicit non-claims

- Exact production Sanity project id active on Vercel: documented in runbook as `9jhqpk3a`; static fallbacks reference another id — **treat as environment-specific; verify in deploy env, do not assume**
- Whether Cookiebot/GTM scripts are injected outside this repo (Tag Manager / Vercel)
- Full dependency CVE list
- Visual pixel parity vs design files / PDFs in repo root
- Live dataset content completeness beyond what docs claim

---

*End of PROJECT_BLUEPRINT.md — generated by read-only repository audit on 2026-08-10.*
