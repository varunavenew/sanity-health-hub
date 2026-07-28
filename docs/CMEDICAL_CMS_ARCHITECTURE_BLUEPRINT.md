# CMedical CMS Architecture Blueprint

**Status:** Design only — not implemented  
**Scope:** Sanity Studio redesign for CMedical  
**Dataset policy:** All redesign work on `developer` only. Production untouched until client-approved cutover.

| Snapshot | Value |
|----------|-------|
| Document types today | 28 |
| Reusable page-section blocks today | 3 |
| Localization | Field-level NO/EN |
| Safe dataset for redesign | `developer` |

**Source analysis:** `test/schemaTypes` (40 files), `test/sanity.config.ts`, `src/lib/queries.ts`, catch-all CMS routing, Studio plugins/actions.

---

## Table of contents

0. [Overview](#0-overview--current-state-diagnosis)  
1. [Content Model](#1-content-model--domain-map)  
2. [Page Architecture](#2-page-architecture)  
3. [Component Library](#3-component-library)  
4. [Business Entities](#4-business-entities)  
5. [Page Builder](#5-page-builder-design)  
6. [Global Content](#6-global-content)  
7. [Localization](#7-localization-experience)  
8. [Editor Experience](#8-editor-experience-by-persona)  
9. [Desk Structure](#9-proposed-desk-structure)  
10. [Reusability Strategy](#10-reusability-strategy)  
11. [Migration Strategy](#11-migration-strategy-developer-only)  
12. [Future Scalability](#12-future-scalability)  
13. [Enterprise Practices](#13-enterprise-cms-patterns-to-adopt)

---

## 0. Overview — current-state diagnosis

### Core problem

The CMS mixes **business entities**, **page layout**, **UI chrome strings**, and **marketing blocks** inside the same documents. Editors face long forms (especially `treatmentCategory.landingPage` and `treatment`), while the frontend hard-wires field names 1:1. Extending a landing page means schema + GROQ + React changes together.

### What works today

- CMS-owned routing via slug index + locale
- Field-level NO/EN with coalesce fallback
- Entity graph: category ↔ treatment ↔ specialist ↔ clinic
- Shared `seo` / `blockContent` / `pageSections` seeds
- Translate-to-EN + nav-sync document actions
- Iframe previews per locale

### What blocks enterprise UX

- Hero / FAQ / CTA / stats reinvented per page type
- Only 3 modular blocks; homepage composition is code-owned
- Dual models: `googleReview` vs `testimonial`; FAQ ref or inline
- Orphans: `locationSearch`, `subTreatmentLayout`, product routing
- Desk mixes singletons into a flat “other” list
- Editors see both languages without strong filtering

### North-star principles (5–10 years)

| Principle | Meaning for CMedical |
|-----------|----------------------|
| Entities ≠ pages | Treatments, clinics, specialists store facts; pages compose presentation |
| Compose by reference | Heroes, FAQs, CTAs, review bands live in a Component Library |
| One section registry | All layouts use the same page-builder array + typed blocks |
| Editor path first | Desk, filters, and defaults optimize for clinic/marketing staff |
| Safe evolution | New section types without rewriting documents; migrations on `developer` only |

---

## 1. Content model — domain map

**Separation rule:** Every document must answer: Is this a page, a medical entity, a reusable component, or global configuration? If two answers apply, split it.

### Domains

| Domain | Contains | Why here | Examples (target) |
|--------|----------|----------|-------------------|
| **Pages** | Routable compositions + SEO | Editors think in websites, not schemas | home, about, contact, services, insurance, pricing, privacy, guide, careers shell, news shell, clinics shell, booking copy page, theme pages |
| **Medical Content** | Clinical/marketing entities with own URLs | Stable IDs, relationships, long life | treatmentCategory, treatment, specialist, clinic |
| **Editorial Content** | Time-based publishable content | Different lifecycle than medical entities | article, jobListing |
| **Component Library** | Reusable presentation modules | Edit once, reuse many | heroModule, faqCollection, ctaModule, reviewCollection, statsModule, partnerLogoSet, richContentModule, formConfig, announcement |
| **Global Settings** | Site-wide chrome & defaults | One place for brand/ops defaults | siteSettings, navigation, footer, seoDefaults, cookie/consent keys, listingSort, 404 |
| **Utilities / Media helpers** | Cross-cutting typed objects | Consistency, not navigation destinations | seo, portableText, mediaAsset meta, geoSummary, booking integration fields |

### Document residence (current → proposed)

| Current type | Proposed domain | Decision |
|--------------|-----------------|----------|
| homepage / `*Page` singletons | Pages | Keep as pages; shrink fixed fields; compose via builder |
| treatmentCategory / treatment | Medical Content | Keep entities; move layout to builder + refs |
| specialist / clinicPage | Medical Content | Keep; presentation chrome out of listing singletons where possible |
| article / jobListing | Editorial | Keep |
| faq / googleReview | Component Library (collections) | Promote collections; single review stays atomic |
| testimonial | Merge into review library | Unify social proof models |
| siteSettings / listingSort / googleReviewSettings | Global Settings | Merge review band defaults into settings or library |
| product / themePage | Pages or deprecate | themePage → page builder; product audit/retire if unused |
| bookingPage | Pages (UI copy) **or** Global | Prefer Global → Booking texts (not a marketing page) |
| specialistsPage vs specialistsListingPage | Pages | Merge to one specialists listing page + optional about block |

---

## 2. Page architecture

**Rule:** Pages own slug, SEO, and an ordered section list. Pages do **not** own entity master data or reusable marketing modules inline.

| Page | Belongs inside | Must NOT belong | Refs / reusable |
|------|----------------|-----------------|-----------------|
| **Home** | Slug (root), SEO, section order, homepage-only flags | Raw category/treatments lists; review text paste; UI chrome for booking wizard | Hero module, trust band, stats, news/articles band, specialists band, FAQ collection, booking CTA |
| **About** | SEO, hero, story body, values as modules or portable text | Clinic master data | Clinic refs for “our clinics”; shared CTA; page sections |
| **Contact** | SEO, hero, contact facts (or ref site settings), dialog labels if contact-only | Global phone/email duplicates if already in site settings | CTA cards as CTA library refs; form config ref |
| **Services hub** | SEO, intro, which categories featured | Category landing layouts | treatmentCategory refs; FAQ collection; booking CTA |
| **Clinics listing** | SEO, listing chrome, intro | Per-clinic addresses/hours (live on clinic entity) | Optional hero module; auto clinic grid (dynamic section) |
| **Clinic detail** | Entity page: operational + local presentation sections | Global review averages | Treatments/specialists refs; FAQ collection; booking CTA; gallery |
| **Treatment category** | Clinical identity, categoryId, related treatments, SEO | One-off nested `landingPage` mega-object forever growing | Composer of library sections + dynamic treatments/specialists |
| **Treatment** | Clinical identity, parent category, facts, SEO | Hardcoded UI string packs duplicated per treatment | Shared treatment UI chrome from settings; FAQ collection; related treatments |
| **Specialists listing / profile** | Listing chrome; profile = professional facts + sections | Profile UI string packs on listing page only forever | Move profile chrome to Global Settings; related specialists module |
| **Articles / News** | Listing shell + article body/editorial SEO | Static article fallbacks as long-term CMS | Featured article refs; articles band module |
| **Booking** | Wizard UI copy & support phone | Clinic availability (systems of record) | Live in Global → Booking texts; optional badges ref clinics |
| **Pricing** | SEO, categories/prices (or productized price tables) | One-off non-i18n testimonials forever | FAQ + review/testimonial collection refs |
| **Insurance** | SEO, steps/benefits narrative | Partner logos pasted per treatment and page | Partner logo set (library) referenced everywhere |
| **Guide / Careers / Privacy** | SEO + builder sections + careers filter labels / policy body | Job master data on careers shell | Jobs are editorial entities; privacy body + cookie key in settings |

---

## 3. Component library

Each library document is reusable, previewable, and referenceable from any page-builder section. Prefer thin section wrappers that point at library docs over deep inline objects.

| Component | Purpose | Key fields | Reuse pattern | Future scalability |
|-----------|---------|------------|---------------|--------------------|
| **Hero Module** | First-viewport marketing hero | Variant (slider/single/video), media, heading, sub, CTAs, theme | Referenced by home, category, listing pages | Add variants without new page schemas |
| **FAQ Collection** | Ordered Q&A sets | Title, items[] → faq or embedded locked | Replace inline FAQs; one collection → many pages | Collections by specialty or site-wide |
| **CTA Module** | Conversion band | Variant, heading, buttons, image, bookingCategory | Replaces ad-hoc CTAs / guide closes / promo blocks | A/B via new modules, not schema forks |
| **Review Collection** | Social proof set | Source (manual Google reviews / average display), heading, CTA | Unifies homepage + category + googleReviewSettings | Swap collections without page edits |
| **Stats Module** | Numbers / results bars | Items (value+label), layout | Home results + category stats | New metrics without field sprawl |
| **Partner Logo Set** | Insurance / brand logos | Localized labels + logo assets + links | insurancePage + treatment insurance rows | One edit updates all references |
| **Rich Content Module** | Portable Text + media block | body, optional media | About values, policy excerpts, theme intro | Avoid new singleton fields for prose |
| **Media / Gallery / Video** | Ordered visuals | Images/videos, captions, aspect | Clinic galleries, treatment flow images | CDN + Sanity assets stay single source |
| **Form Config** | Contact / lead forms | Fields labels, success, destination | Contact dialog + future forms | Add forms without code if renderer supports registry |
| **Announcement Bar** | Site-wide or page-scoped notice | Message, link, schedule, locales | Global default + page override | Campaigns without deploys |
| **SEO Snippet / Defaults** | Reusable meta patterns | Title/description templates | Fallback when page SEO empty | Brand consistency |
| **Specialists / Articles Band** | Entity carousels (already exist) | displayMode, variant, refs | Keep; elevate to first-class library entries optional | Already closest to target pattern |

---

## 4. Business entities

| Entity | Business data | Presentation data | Relationships | Scale notes |
|--------|---------------|-------------------|---------------|-------------|
| **Treatment Category** | title, categoryId, numeric/booking IDs, slug, geo | `sections[]` composition (not mega `landingPage`) | → treatments[]; ← specialists | `categoryId` remains integration contract; protect via validation |
| **Treatment** | title, slug, parent category, clinical facts, Metodika hooks if any | Builder sections + shared treatment UI chrome from settings | → category, faqs/collection, related treatments | Deprecate flattened layout sprawl & `subTreatmentLayout` twin |
| **Specialist** | name, role, bio, credentials, bookingCategoryIds | Optional profile sections; chrome from global `profileUi` | → categories, treatments, clinics, reviews, related specialists | Name stays language-invariant; bio stays i18n |
| **Clinic** | address, hours, contact, booking method, geo (use Places input) | Hero/gallery/FAQ sections | → treatments, specialists | Wire `locationSearch`; drop orphan input |
| **Article** | title, slug, dates, category taxonomy, body | Optional bottom sections | Featured on news/home via refs | Fix taxonomy label drift (`news` vs `nyheter`) |
| **Job Listing** | role, location, dept, apply, active, deadline | Careers shell owns filters/empty states | Listed under careers page | Localize title/body properly |
| **Product** | Commerce-ish fields | n/a unless product surface returns | Routed but not rendered today | Archive or restore a real product domain — do not leave half-wired |

---

## 5. Page builder design

> **Design only — not implementing.** Expand today’s `pageSections` (3 types) into a typed section registry with drag-and-drop order respected by the frontend (today CMS order is ignored).

| Topic | Blueprint |
|-------|-----------|
| **Section architecture** | `page.sections[]` of typed objects: `{_type, _key, settings, contentRef?}`. Settings are local (padding, theme); content prefers library references. |
| **Drag and drop** | Native Sanity array ordering. Frontend must render in array order (fix `PageSectionsRenderer` re-sort). |
| **References** | section → library document (`heroModule`, `faqCollection`, …). Allows reuse + locked “local override” mode when needed. |
| **Reusable sections** | Default path. Editors pick from Component Library; rare “custom/local” for one-off pages. |
| **Custom / one-off sections** | Allowed types: `richContent`, `imageBreak`, `customHtml` (restricted). Prevent escaping into new schema fields. |
| **Dynamic sections** | `specialistsBand`, `treatmentsInCategory`, `clinicsGrid`, `latestArticles` — query-driven with filters, not pasted lists. |
| **Automatic sections** | Optional: insert required legal footer CTA on all medical pages via desk templates/initial value, still overridable. |
| **Previews & icons** | Each section type: Studio icon + preview title showing referenced module name; iframe preview already exists — keep NO/EN tabs. |
| **Editor workflow** | 1) Open page → 2) Add section → 3) Choose type → 4) Pick library item (or create) → 5) Reorder → 6) Preview locale → 7) Publish |

### Recommended initial section registry

`heroRef` · `richContent` · `statsRef` · `faqRef` · `ctaRef` · `reviewsRef` · `specialistsBand` · `articlesBand` · `bookingCta` · `gallery` · `partnersRef` · `announcement` · `formRef` · `clinicsGrid` · `treatmentsGrid`

---

## 6. Global content

| Concern | Lives in | Notes |
|---------|----------|-------|
| Navigation | `siteSettings.navigation` (or nav document) | Keep `navId` contract; paths stay bilingual; publish hooks sync optional |
| Footer | `siteSettings.footer` | About links + contact; services list from category order settings |
| Booking texts | `bookingTexts` singleton under Settings | Move off marketing Pages mindshare; still editable |
| SEO defaults | `seoDefaults` | Fallback title/description/OG; page seo overrides |
| 404 | `siteSettings.notFound` | Keep |
| Forms | `formConfig` library + contact refs | Labels out of mega contactPage where possible |
| Cookie banner | privacy/consent settings (Cookiebot key today) | Keep key in Settings, not only privacy page |
| Announcement bar | announcement module + site default | Schedule fields |
| Listing sort | `listingSortSettings` | Keep under Settings |
| Profile / treatment UI chrome | `uiChrome` settings | Pull strings off `specialistsListingPage` / treatment docs |
| Translations ops | Localization desk + actions | Not a content type — workflow |
| Site Settings | Root singleton | Brand, social, contact defaults, CTA button |

---

## 7. Localization experience

**Keep field-level i18n.** Document-per-language would explode maintenance given shared entities (one specialist, two locales). Stay on internationalized arrays; fix the editor surface.

| Capability | Recommendation |
|------------|----------------|
| Language filter | Enable Sanity language filter / studio pane: work in NO or EN only; show the other on demand |
| Translation workflow | Keep Translate to English action; add “needs translation” document list filtered by empty EN |
| Missing translation indicators | Field-level badges + list preview pill when EN incomplete for required fields |
| Completeness | Computed readiness: required i18n fields present for publish-to-EN sites; optional soft gate |
| Fallback strategy | Keep frontend coalesce: requested lang → `no` → raw. Document this as deliberate product behavior |
| What not to duplicate | Names, phones, IDs, shared media, booking system IDs — single language-invariant fields |
| Future SE | Add language in plugin config only; no schema redesign if field-level stays |

---

## 8. Editor experience by persona

| Persona / screen | Current UX | Improved UX | Why better |
|------------------|------------|-------------|------------|
| Receptionist — update clinic hours | Find Clinics list (custom mid-desk), long form, geo object without Places | Desk → Clinics → clinic → “Practical info” tab; Places map input | Task-shaped tabs, fewer fields visible |
| Marketing — change homepage hero | Open homepage; edit nested `heroBanner.slides` among many sections | Pages → Home → sections → Hero (ref) → edit Hero Library item once | Same hero reusable; shorter home document |
| Marketing — reuse FAQ on 5 pages | Inline Q&A or scatter faq refs per page | Component Library → FAQ collection → reference from each page | One edit propagates |
| Doctor / clinical lead — treatment facts | Scroll past layout/hero/promises/UI labels | Tabs: Clinical \| Media \| Sections \| SEO; chrome from settings | Clinical edits don’t mix with layout |
| Admin — nav path EN wrong | `siteSettings` buried in mixed list; publish sync opaque | Settings → Navigation with clear per-locale paths + validation | Nav as first-class task |
| Translator — fill EN | Both NO/EN fields always visible; Translate action helps | EN mode filter + completeness queue | Less noise, measurable backlog |

---

## 9. Proposed desk structure

| Desk group | Contents | Why |
|------------|----------|-----|
| **Pages** | All routable singletons + theme pages | Website mental model first |
| **Medical Content** | Categories, Treatments | Clinical IA separate from marketing pages |
| **Specialists** | All specialist profiles | High-frequency edits |
| **Clinics** | Listing page + clinic docs | Ops-critical |
| **Articles** | News page + articles | Editorial cadence |
| **Careers** | Careers page + jobs | HR cadence |
| **Component Library** | Heroes, FAQs, CTAs, Reviews, Stats, Partners, Forms, Announcements | Reuse center |
| **Settings** | Site, Navigation, Footer, Booking texts, SEO defaults, Sort, Consent, UI chrome | Ops not content |
| **Localization** | Translation queue / incomplete EN | Workflow surface |

**Hide from default clutter:** Utility objects, deprecated types (`subTreatmentLayout`), and internal settings must not appear as peer documents beside Homepage.

---

## 10. Reusability strategy

| Content | Become | Reference rule |
|---------|--------|----------------|
| FAQ | faq item + `faqCollection` | Pages reference collections; avoid inline except migration period |
| Hero | `heroModule` | Page section → ref; local hero only if unique forever |
| CTA / booking CTA | `ctaModule` (+ existing booking block) | Prefer library; bookingCta may stay typed section |
| Statistics | `statsModule` | Always by ref |
| Reviews / testimonials | review + `reviewCollection` | Unify models; collections by placement |
| Insurance logos | `partnerLogoSet` | insurance page + treatments reference same set |
| Forms | `formConfig` | Contact and future lead forms |
| Rich text blocks | `richContentModule` | When reused ≥2 times |
| Media / video | `galleryModule` / `videoModule` | Shared assets + captions |
| Buttons / CTA labels | Inside `ctaModule` or link object type | Standardize link object `{label i18n, href i18n \| internal ref}` |
| SEO | page seo + `seoDefaults` | Fallback chain, not duplication |

**Reference pattern:** Weak refs for editorial flexibility; validation warns if required section missing target. Dereference in GROQ once in shared fragments — never bespoke projections per page forever.

---

## 11. Migration strategy (developer only)

> **Production is off-limits.** All schema experiments and data migrations run against the `developer` dataset. Production requires explicit approval + `ALLOW_PRODUCTION_MIGRATION=true` and a cutover plan.

| Phase | Work | Exit criteria |
|-------|------|---------------|
| **0 — Freeze & inventory** | Blueprint approval; inventory documents; map fields → new model | Signed-off field map |
| **1 — Additive schemas** | Introduce library types + expanded sections alongside old fields | Studio works; old frontend still runs |
| **2 — Data migrate (developer)** | Scripts create library docs from inline heroes/FAQs/etc.; wire refs | Spot-check counts; no production writes |
| **3 — Frontend dual-read** | Prefer new refs; fallback to legacy fields | Visual QA NO/EN on key templates |
| **4 — Editor pilot** | Marketing edits only via new desk on developer Studio | Editor acceptance |
| **5 — Remove legacy reads** | Drop dual-read; hide deprecated fields | Query/contract tests green |
| **6 — Client approval** | Demo + content parity checklist | Written go-ahead |
| **7 — Production cutover** | Migrate production data once; deploy Studio + Next together | Health checks; rollback tag ready |

### Rollback & compatibility

Keep dual-read until cutover + soak. Git tags for app + schema. Dataset export before production migration. Frontend feature flag optional for section renderer. Never partially deploy schema that breaks old GROQ without fallbacks.

---

## 12. Future scalability

| Extension | How architecture absorbs it |
|-----------|----------------------------|
| New page type | Add singleton/page doc with `sections[]` only; register route + desk entry |
| New section | Add to section registry + one React renderer + icon/preview |
| New language | Plugin languages + filter; no document clone |
| New integration | Entity-level integration object (booking provider fields) — not page fields |
| New booking system | `Clinic.booking.provider` discriminator; UI chrome stays in `bookingTexts` |
| New content type | Choose domain first; never start as homepage nested object |

---

## 13. Enterprise CMS patterns to adopt

| Source | Adopt | Adapt / avoid |
|--------|-------|---------------|
| **Storyblok** | Blok/component library + nestable sections; editor-friendly naming | Avoid unbounded nest depth; Sanity prefers shallower refs |
| **Builder.io** | Visual section composition mindset; clear section previews | Avoid pixel-drag layout in Sanity — keep structured sections |
| **Payload** | Blocks arrays, auth-shaped collections, strict TS contracts | Bring block registry discipline; keep Sanity Studio UX |
| **Contentful** | Content type domains; reference-heavy graphs | Avoid over-fragmenting micro-entries that hurt editors |
| **Sanity best practices** | Presentation tool / iframe previews, desk structure, field-level i18n, GROQ fragments, singular entities | Avoid god-documents; avoid 1:1 schema mirroring of React components as fields |

### Recommended adoption set for CMedical

Storyblok-like component library + Payload-like block registry + Contentful-like domain split + Sanity field-level i18n with language filter + ordered page builder that the frontend respects.

---

## Approval gate before implementation

Confirm before any schemas or code are written:

1. Domain map and document residence decisions  
2. Section registry v1 list  
3. Entity vs presentation split for `treatmentCategory`  
4. Unify reviews / testimonials  
5. `bookingTexts` location under Settings  
6. Migration phase gates and production lock  

**Implementation must not start until this blueprint is accepted.**
