# Sanity CMS Content Audit

Audit date: 2026-07-03

## Scope and Method

This is a source-code audit of all Next.js routes, the legacy Vite route map, page
components, shared layout components, page-section blocks, local data modules,
Sanity GROQ queries, and the schemas under `test/schemaTypes`.

The classifications mean:

- **Sanity**: the rendered value is read from a Sanity document/query.
- **Fallback**: Sanity is attempted first, but another value is rendered when the
  CMS value/document is empty or unavailable. Locale JSON (`t(...)`) is considered
  fallback/static content, not Sanity.
- **Hardcoded / Static**: the value comes from JSX, a TypeScript constant/array,
  local JSON, a bundled asset, an API other than Sanity, or a fixed URL.

Technical constants (CSS classes, React keys, query-cache keys, numeric layout
limits, and icon component implementations) are not treated as editorial content.
Icon *selection* is reported where an editor could reasonably need to control it.

This audit verifies code paths and schema/query support. It does not assert that
every required field is populated in the live Sanity dataset.

## Executive Summary

- **No public page is fully managed from Sanity end to end.** Even the strongest
  CMS pages inherit header/search/footer strings, fixed paths, logo assets, or
  metadata/schema defaults outside Sanity.
- The strongest CMS coverage is in homepage content, generic theme pages,
  treatment/category documents, articles, specialists, clinics, careers, and
  modular `pageSections`.
- The highest-risk fallbacks are the full booking copy object, the full static
  fastlege guide, service-category fallback data, specialist-profile UI defaults,
  social-feed posts, default navigation, SEO descriptions/images, and locale JSON.
- The explicit design/demo routes, icon preview, approval tool, and several legacy
  product/skin components are predominantly static. They should be removed from
  production routing or explicitly excluded from the CMS requirement if they are
  internal tools.
- Many schemas already contain the needed fields. The main problem is often that
  components still prefer `t(...)`, literals, fixed paths, or local arrays instead
  of querying those fields consistently.

# 1. Fully Managed from Sanity

There is no complete route in this category once shared header, footer, metadata,
schema data, empty states, and fallback behavior are included.

The following **content blocks** are fully Sanity-driven when populated:

Page / Route: All routes using modular page sections  
Section / Component: `PageSectionsRenderer` and its three block renderers  
Content Type: Specialist rows, article rows, booking CTA fields, images, links  
Current Source: **Sanity**  
Issue: No editorial hardcoding in the section dispatch itself. Child booking CTA
still has locale-file defaults if individual fields are omitted.  
File Path: `src/components/page-sections/PageSectionsRenderer.tsx`;
`PageSectionSpecialistsBlock.tsx`; `PageSectionArticlesBlock.tsx`;
`PageSectionBookingCtaBlock.tsx`; query in `src/lib/queries.ts` (`PAGE_SECTIONS_GROQ`)  
Recommendation: Keep these blocks, but make required fields required in the schema
or render nothing when omitted so child defaults cannot silently replace CMS copy.

Page / Route: Dynamic theme routes (`/{theme-slug}`)  
Section / Component: Generic theme body  
Content Type: Title, hero image, intro paragraphs, sections, life phases, CTA,
SEO, GEO summary  
Current Source: **Sanity**  
Issue: The generic body is CMS-driven; its route path, generated metadata
fallback, shared chrome, and image alt behavior are not fully CMS-driven.  
File Path: `src/site-pages/CmsThemePage.tsx`; `test/schemaTypes/themePage.ts`;
`src/lib/queries.ts`  
Recommendation: Add explicit hero image alt and canonical/path fields to the
projection and remove title/empty-string metadata fallbacks.

Page / Route: Article detail (`/{news-slug}/{article-slug}`)  
Section / Component: Portable Text article body  
Content Type: Article title, excerpt, image, Portable Text, author/date/category,
related article documents, GEO summary  
Current Source: **Sanity**  
Issue: The document content is Sanity-managed, but empty states, paths, related
heading, synthesized SEO description, and breadcrumbs are static.  
File Path: `src/site-pages/ArticlePage.tsx`; `test/schemaTypes/article.ts`;
`src/hooks/useSanity.ts`; `src/lib/queries.ts`  
Recommendation: Keep the document model; move detail-page UI and related-section
labels into `newsPage.articleUi`, and use CMS route-index paths.

Page / Route: Privacy (`/personvern`, localized equivalent)  
Section / Component: Portable Text policy body and embedded media  
Content Type: Policy body, inline links/images/video, title, GEO summary,
page sections  
Current Source: **Sanity**  
Issue: SEO description, breadcrumbs, loading/empty copy are static.  
File Path: `src/site-pages/Personvern.tsx`;
`test/schemaTypes/privacyPolicyPage.ts`  
Recommendation: Add/query localized `seo`, `loadingLabel`, and `emptyMessage`;
use CMS route paths for canonical and breadcrumb URLs.

# 2. Partially Managed from Sanity

Page / Route: Home (`/{locale}`)  
Section / Component: Homepage composition  
Content Type: Hero slides, service categories, badges, trust banner, news,
statistics, social posts, booking CTA, specialists, SEO/GEO  
Current Source: **Sanity**  
Issue: Most section content is queried, but JSON-LD clinic/organization values,
logo/brand, some section child defaults, social fallback posts, and shared chrome
are static. Homepage medical-page JSON-LD also uses a fixed `"CMedical"` name.  
File Path: `src/app/[locale]/page.tsx`; `src/site-pages/Index.tsx`;
`src/lib/queries.ts` (`HOMEPAGE_QUERY`); `src/lib/seo/home-jsonld.ts`;
`src/lib/seo/geo-jsonld.ts`; `src/components/homepage/SoMeFeed.tsx`;
`src/components/homepage/BookingCTA.tsx`  
Recommendation: Put organization/clinic schema fields in `siteSettings`; require
all child-section copy; remove local social posts and CTA defaults.

Page / Route: About (`/om-oss`)  
Section / Component: Hero, body sections, clinics, modular sections  
Content Type: Title, subtitle, hero image, paragraphs, clinics heading/list  
Current Source: **Sanity**  
Issue: `"Om CMedical"` eyebrow/name fallback, `"CMedical"` alt, and fixed about
path are static.  
File Path: `src/site-pages/About.tsx` (lines 26, 42, 51, 73)  
Recommendation: Add `heroEyebrow`, `heroImageAlt`, and use the queried localized
slug/canonical. Do not substitute literals when fields are blank.

Page / Route: About specialists (`/om-spesialister`)  
Section / Component: Hero and SEO  
Content Type: Title, subtitle, SEO  
Current Source: **Fallback**  
Issue: Page data is queried, but title, subtitle, SEO title/description, path, and
`"Vårt team"` eyebrow have literal fallbacks.  
File Path: `src/site-pages/AboutSpecialists.tsx` (lines 24-31, 63)  
Recommendation: Require these in `specialistsPage`, query a localized slug and
`heroEyebrow`, and remove literals.

Page / Route: News listing (`/aktuelt`)  
Section / Component: Hero, filters, cards, featured articles, specialists, social  
Content Type: Articles and most labels  
Current Source: **Fallback**  
Issue: Articles are Sanity documents, but every listing label falls back to locale
JSON; category-to-filter maps, page size, fixed paths, category labels, SEO, and
date formatting are static. Social content can fall through to API/local posts.  
File Path: `src/site-pages/Aktuelt.tsx` (lines 21-37, 219-286, 316-320);
`src/i18n/locales/nb.json`; `src/i18n/locales/en.json`;
`src/components/homepage/SoMeFeed.tsx`  
Recommendation: Make `newsPage` UI fields required and add filter definitions
(`key`, localized label, accepted article categories), list size, and social mode.

Page / Route: Clinics listing (`/klinikker`)  
Section / Component: Hero, clinic cards, CTAs, SEO/GEO/schema  
Content Type: Clinic documents and page hero  
Current Source: **Fallback**  
Issue: CTA label/path, GEO name, fixed listing/detail paths, card ARIA/alt strings,
and some schema values fall back to locale JSON or literals.  
File Path: `src/site-pages/Clinics.tsx` (lines 38-60, 89-90, 129, 149, 154);
`test/schemaTypes/clinicsPage.ts`  
Recommendation: Add card UI/alt templates to `clinicsPage`; use route-index slugs
and require CTA/SEO fields.

Page / Route: Clinic detail (`/klinikker/{slug}`)  
Section / Component: Hero, practical info, services, gallery/map, FAQ,
specialists, treatments, SEO/GEO  
Content Type: Clinic-specific values  
Current Source: **Sanity** plus **Hardcoded / Static** UI  
Issue: Clinic values are queried, but all section headings/labels, not-found copy,
default `"Klinikk"`, generated SEO description, image alt, ARIA text, and paths are
literal Norwegian.  
File Path: `src/site-pages/ClinicDetailPage.tsx` (lines 42, 68-80, 117-135,
182, 216-456)  
Recommendation: Add a localized `detailUi` object to `clinicsPage` (shared labels,
not-found state, SEO description template) and add clinic image alts to
`clinicPage`; resolve links through the CMS route index.

Page / Route: Contact (`/kontakt`)  
Section / Component: Hero, contact cards, clinics, form, metadata  
Content Type: Hero/cards/page sections and clinics  
Current Source: **Sanity** plus **Hardcoded / Static** form behavior/copy  
Issue: Hero/cards are CMS-driven, but fallback contact name, icon defaults, form
field definitions, validation/toast strings, fixed links, and form submission
behavior are in code/locale files.  
File Path: `src/site-pages/Contact.tsx`; `src/components/ContactRequestDialog.tsx`;
`src/lib/sanity/contact-request-dialog-copy.ts`  
Recommendation: Put all dialog/form UI in the existing contact-dialog schema,
make fields required, and add configurable destination/action settings.

Page / Route: Guide (`/guide`)  
Section / Component: Hero, category/treatment guide, CTA, SEO/GEO  
Content Type: Page copy and referenced categories  
Current Source: **Sanity** plus **Fallback**  
Issue: CTA path defaults to `/booking`; `"Guide"` and metadata fallback strings
are static. This route is also explicit rather than solely CMS-index-driven.  
File Path: `src/site-pages/Guide.tsx` (lines 78-120);
`src/app/[locale]/guide/page.tsx`; `test/schemaTypes/guidePage.ts`  
Recommendation: Require CTA path/title and image alt; query/use the localized page
slug and remove the explicit path once route-index resolution covers it.

187

Page / Route: Insurance (`/forsikring`)  
Section / Component: Hero, partners, steps, benefits, help CTA  
Content Type: Core arrays/title/image from Sanity; UI labels from locale JSON  
Current Source: **Sanity** plus **Hardcoded / Static**  
Issue: Image alt, booking/contact paths, all section headings/explanatory copy,
email address, CTA labels, breadcrumb/path, and help strip are not page fields.  
File Path: `src/site-pages/Insurance.tsx` (lines 34-49 and all `t("insurance.*")`
uses; fixed `post@cmedical.no`)  
Recommendation: Extend `insurancePage` with localized section heading/UI fields,
hero CTAs, image alt, contact reference/email, and page slug; query those fields.

Page / Route: Pricing (`/priser`)  
Section / Component: Hero, price accordion, testimonials, FAQ, specialists  
Content Type: Hero/testimonials/headings from Sanity; prices from booking API  
Current Source: **Sanity** plus **Hardcoded / Static** external API/UI  
Issue: Actual service names/prices/durations come from the booking API, not Sanity
(acceptable operational data but not CMS-managed). `"Gratis"`, price formats,
errors, accordion/search labels, paths, and various UI strings are code/locale
values.  
File Path: `src/site-pages/Priser.tsx` (notably `mapApiCategoryToPriceCategory`
and `useBookingPriceCategories`); `src/app/api/booking/activity-groups/route.ts`  
Recommendation: Decide ownership explicitly: keep transactional price data in the
booking system, but add all presentation copy, category aliases/order, price
format templates, and error states to `pricingPage`.

Page / Route: Services (`/tjenester`)  
Section / Component: Hero, featured categories, more services, FAQ, sections  
Content Type: Page copy/categories from Sanity with local fallback  
Current Source: **Fallback**  
Issue: Uses `buildMoreServicesFromStaticCategories` when CMS categories are not
available; service path defaults and UI labels also come from literals/locale JSON.  
File Path: `src/site-pages/Services.tsx`; `src/lib/sanity/services-page-fallbacks.ts`;
`src/data/serviceCategories.ts`  
Recommendation: Remove `buildMoreServicesFromStaticCategories`; show a controlled
empty/error state. Store category selection/order and all labels in `servicesPage`.

Page / Route: Specialists listing (`/spesialister`)  
Section / Component: Hero, filters/search, cards, empty state, SEO  
Content Type: Specialists and listing page data from Sanity  
Current Source: **Sanity** plus **Fallback**  
Issue: Filter mechanics/category keys, paths, card labels, empty/loading copy and
some SEO/UI strings remain literal or locale JSON.  
File Path: `src/site-pages/Specialists.tsx`;
`src/components/treatments/SpecialistsScroller.tsx`;
`src/hooks/useSpecialistsData.ts`  
Recommendation: Add a listing `filters[]` model and card UI templates to
`specialistsListingPage`; resolve specialist paths from localized slugs.

Page / Route: Specialist detail (`/spesialister/{slug}`)  
Section / Component: Hero, bio, booking, reviews, featured service, related  
Content Type: Specialist document from Sanity; UI object with defaults  
Current Source: **Fallback**  
Issue: `profileUi` is queried from `specialistsListingPage`, but every field is
silently replaced by bilingual TypeScript defaults if missing. Child components
also contain structural label/path fallbacks.  
File Path: `src/site-pages/SpecialistProfile.tsx`;
`src/lib/sanity/specialist-profile-ui.ts`; `src/components/specialist/*.tsx`  
Recommendation: Make `profileUi` fields required, return `null`/editor-visible
configuration errors when absent, and remove `DEFAULT_PROFILE_UI`.

Page / Route: Careers listing/detail (`/karriere`, `/karriere/{slug}`)  
Section / Component: Hero, listing/cards, application/contact cards, body  
Content Type: Careers page and job documents from Sanity  
Current Source: **Sanity** plus **Fallback**  
Issue: Detail formatting labels, empty/loading states, fixed listing paths, date
formatting, and email/link behavior are static. Detail SEO falls back to job
excerpt and a page suffix.  
File Path: `src/site-pages/Karriere.tsx`; `src/site-pages/KarriereDetail.tsx`;
`src/lib/seo/dynamic-route-metadata.ts` (lines 264-265)  
Recommendation: Add `jobDetailUi` and application-link behavior to `careersPage`;
require per-job SEO or model an intentional SEO template in Sanity.

Page / Route: Treatment category (`/{category-slug}`)  
Section / Component: Full category landing composition  
Content Type: Hero, segments, reasons, audiences, symptoms, services, results,
reviews, specialist sections  
Current Source: **Sanity** plus **Fallback**  
Issue: `"Les mer"` appears in several fallbacks; booking/call labels fall back to
locale JSON; icon choice defaults to a static icon; image alt and GEO/JSON-LD
descriptions are synthesized from other content; missing landing content exposes
a hardcoded configuration message.  
File Path: `src/site-pages/treatments/TreatmentCategoryLanding.tsx` (lines 175,
279, 328, 372-374, 459-495, 554, 623, 668, 686);
`src/lib/sanity/category-data.ts`; `test/schemaTypes/categoryLanding.ts`  
Recommendation: Require CTA labels, image alts, icon keys, GEO summary, and
landing content; replace the public config message with `notFound()` or a CMS
empty-state field.

Page / Route: Treatment detail (`/{category}/{treatment}`)  
Section / Component: Generic treatment page and sub-treatment layouts  
Content Type: Treatment body, benefits, FAQs, CTAs, layout, related content  
Current Source: **Sanity** plus **Fallback**  
Issue: Image falls back from treatment to category, SEO/GEO fields are synthesized,
quick-info icons are positional, and generic layout/UI strings and paths remain
static. Gynecology/fertility data mappers can still source legacy local content.  
File Path: `src/site-pages/treatments/TreatmentPage.tsx`;
`src/components/layout/SubTreatmentLayout.tsx`;
`src/site-pages/treatments/GynekologiSubPage.tsx`;
`src/site-pages/treatments/FertilitetSubPage.tsx`;
`src/lib/sanity/map-sub-treatment-content.ts`;
`src/data/gynekologiSubPages.tsx`; `src/data/fertilitetSubPages.tsx`;
`src/data/treatmentContent.ts`  
Recommendation: Remove legacy content imports after migration validation; make
layout fields required and model icon keys, labels, alts, and links explicitly.

Page / Route: Product detail (`/produkt/{id}`)  
Section / Component: Product hero/details/recommendations  
Content Type: Product data from Sanity; product UI from code  
Current Source: **Sanity** plus **Hardcoded / Static**  
Issue: The route is still ID/path-specific and the component contains fallback
labels, purchase/product UI, and static related behavior. Several reusable product
components use local product/image datasets.  
File Path: `src/site-pages/ProductDetail.tsx`;
`src/components/ProductGallery.tsx`; `RecommendedProductCard.tsx`;
`SeasonalProducts.tsx`; `TopRatedProducts.tsx`;
`test/schemaTypes/product.ts`  
Recommendation: Add a product-page UI singleton or product-module schema and
replace the `[id]` contract with localized Sanity slugs.

# 3. Using Fallback Content

Page / Route: Booking (`/booking`, `/bestill-time`, `/book-appointment`)  
Section / Component: Entire booking wizard  
Content Type: More than 90 labels, placeholders, help texts, errors, success copy  
Current Source: **Fallback**  
Issue: `useBookingPage()` defaults the entire page to
`DEFAULT_BOOKING_PAGE_COPY`; a partial CMS document is also normalized with these
defaults. Additional literal `"Bestill"` and `Steg ...` strings remain in JSX.  
File Path: `src/site-pages/BookingDemo.tsx` (lines 197, 365, 1338);
`src/lib/sanity/booking-page-copy.ts`; `src/hooks/useSanity.ts`;
`test/schemaTypes/bookingPage.ts`  
Recommendation: Remove `DEFAULT_BOOKING_PAGE_COPY`, make all booking copy required
in `bookingPage`, validate the document server-side, and render a controlled
service-unavailable state if it is absent.

Page / Route: Fastlege guide (`/fastlegeveiledning-overgangsalder`)  
Section / Component: Entire article  
Content Type: Clinical guide, headings, lists, SEO, breadcrumbs, CTAs  
Current Source: **Fallback**  
Issue: A `themePage` is used only if it has a body; otherwise approximately the
entire long-form medical guide is rendered from JSX. This is the largest
editorial hardcode and can become medically stale without CMS governance.  
File Path: `src/site-pages/FastlegeveiledningOvergangsalder.tsx` (static branch
starts line 52 and continues through the article)  
Recommendation: Migrate the article to localized Portable Text (prefer a dedicated
`clinicalGuide` document with reviewer, reviewed date, sources, and SEO), then
delete the static branch.

Page / Route: All pages  
Section / Component: Header/navigation/search/burger menu  
Content Type: Nav items, CTA, phone/address, search copy/quick terms, ARIA labels  
Current Source: **Fallback**  
Issue: Header navigation falls back to `DEFAULT_MAIN_NAVIGATION`; nav labels and
search UI come from locale JSON; popular searches are a JSX array; burger contact
details fall back to a hardcoded phone and city list.  
File Path: `src/components/layout/PageLayout.tsx` (lines 55-83, search area and
popular-term array); `src/lib/navigation/default-main-navigation.ts`;
`src/components/BurgerMenu.tsx` (lines 72-88);
`src/data/searchData.ts`; `src/data/searchSynonyms.ts`;
`src/i18n/locales/*.json`  
Recommendation: Make site settings mandatory; add search UI, curated terms, and
synonyms to `siteSettings`; remove default navigation/contact values.

Page / Route: All pages  
Section / Component: Footer  
Content Type: Column headings, ordering, labels, logo, copyright, privacy path,
social ARIA labels  
Current Source: **Sanity** plus **Fallback**  
Issue: Contact/social/about links and clinics are Sanity-driven, but column copy is
locale JSON; service order/IDs are a static array; logo is bundled; clinic and
privacy paths are fixed; social labels are literal.  
File Path: `src/components/homepage/Footer.tsx` (lines 11-12, 65 onward)  
Recommendation: Add footer columns/order, legal links, copyright template,
wordmark image/alt, and resolved references to `siteSettings`.

Page / Route: Home/news and any `SoMeFeed` consumer  
Section / Component: Social feed  
Content Type: Posts, captions, images, permalinks, social URLs, headings  
Current Source: **Fallback**  
Issue: Priority is Sanity, then Supabase Instagram API, then eight local posts.
Social URLs and non-compact headings also have static fallbacks.  
File Path: `src/components/homepage/SoMeFeed.tsx` (lines 10-41, 138-165, 221+)  
Recommendation: Remove `fallbackPosts` and `fallbackSocial`; require CMS posts or
render nothing. Move headings to the parent page schema.

Page / Route: Any page using `BookingCTA`  
Section / Component: Booking CTA  
Content Type: Title, subtitle, buttons, quick-info labels, paths  
Current Source: **Fallback**  
Issue: Missing props resolve to locale JSON and fixed `/booking`/`/kontakt` paths;
two default quick-info rows are created in the component.  
File Path: `src/components/homepage/BookingCTA.tsx` (lines 71-103, 170+)  
Recommendation: Require CTA content from a `pageSectionBookingCta`; use references
or route IDs instead of fixed paths.

Page / Route: Specialist detail  
Section / Component: Profile UI  
Content Type: All shared profile labels/messages  
Current Source: **Fallback**  
Issue: Complete Norwegian and English defaults mask missing Sanity fields.  
File Path: `src/lib/sanity/specialist-profile-ui.ts` (`DEFAULT_PROFILE_UI` and
`parseSpecialistProfileUi`)  
Recommendation: Make the singleton complete and fail validation/publishing when a
locale is missing.

Page / Route: Services  
Section / Component: More-services list  
Content Type: Category/treatment titles and paths  
Current Source: **Fallback**  
Issue: Local `serviceCategories` are used offline.  
File Path: `src/lib/sanity/services-page-fallbacks.ts`;
`src/data/serviceCategories.ts`  
Recommendation: Delete the local fallback after confirming category documents.

Page / Route: All metadata-enabled routes  
Section / Component: SEO/Open Graph/GEO/JSON-LD  
Content Type: Meta title/description, OG image, organization descriptions, schema  
Current Source: **Fallback**  
Issue: Metadata builders synthesize values from page titles/excerpts/slugs;
Open Graph image has a fixed external URL; homepage organization descriptions and
some structured-data values are hardcoded; `geoSummary` can fall back to body copy.  
File Path: `src/lib/seo/defaults.ts`; `src/lib/seo/dynamic-route-metadata.ts`;
`src/lib/seo/route-metadata.ts`; `src/lib/seo/seo-fields.ts`;
`src/lib/seo/home-jsonld.ts`; `src/lib/seo/geo-jsonld.ts`;
`src/lib/seo/geo-page.ts`; `src/app/[locale]/page.tsx`  
Recommendation: Require localized SEO/GEO fields on publish, move organization
schema and default OG image into `siteSettings`, and use explicit CMS templates
where templating is desired.

# 4. Hardcoded / Static Content

Page / Route: All gynecology design routes under `/gynekologi-design/*`  
Section / Component: All design variants and hub  
Content Type: Hero copy, section copy, cards, journeys, CTAs, images, labels  
Current Source: **Hardcoded / Static**  
Issue: These pages use `gynekologiContent.ts` and extensive inline JSX; only
specialist rows may come from Sanity.  
File Path: `src/site-pages/gynekologi-design/*.tsx`;
`src/site-pages/gynekologi-design/gynekologiContent.ts`;
explicit wrappers in `src/app/[locale]/gynekologi-design/**/page.tsx`  
Recommendation: Mark as non-production/internal and protect/remove routes, or
create a `designDemoPage` schema if editors genuinely need them.

Page / Route: All fertility design routes under `/fertilitet-design/*`  
Section / Component: All design variants and hub  
Content Type: Hero copy, narratives, services, process, CTAs, local images  
Current Source: **Hardcoded / Static**  
Issue: Uses `fertilitetContent.ts` plus inline JSX; specialists alone may be live.  
File Path: `src/site-pages/fertilitet-design/*.tsx`;
`src/site-pages/fertilitet-design/fertilitetContent.ts`;
explicit wrappers in `src/app/[locale]/fertilitet-design/**/page.tsx`  
Recommendation: Remove/protect in production or model them as CMS demo documents.

Page / Route: `/icon-preview`  
Section / Component: Icon preview catalog  
Content Type: Headings, groups, labels, icon registry  
Current Source: **Hardcoded / Static**  
Issue: Entire internal utility is static and publicly routed.  
File Path: `src/site-pages/IconPreview.tsx`;
`src/app/[locale]/icon-preview/page.tsx`; `src/lib/customIcons.tsx`  
Recommendation: Exclude from CMS scope and production deployment, or protect it.

Page / Route: `/demoer`, `/design-demoer`  
Section / Component: Demo index  
Content Type: Demo labels/descriptions/links  
Current Source: **Hardcoded / Static**  
Issue: Entire internal route is code-defined.  
File Path: `src/site-pages/DemoOversikt.tsx`;
`src/app/[locale]/demoer/page.tsx`;
`src/app/[locale]/design-demoer/page.tsx`  
Recommendation: Remove/protect in production; no CMS schema is needed if internal.

Page / Route: `/godkjenning`  
Section / Component: Approval dashboard/dialog/inbox  
Content Type: Page inventory, labels, statuses, instructions  
Current Source: **Hardcoded / Static**  
Issue: Uses a static page registry and component literals, not Sanity content.  
File Path: `src/site-pages/Godkjenning.tsx`; `src/data/sitePages.ts`;
`src/components/godkjenning/ChangeRequestDialog.tsx`;
`ChangeRequestInbox.tsx`  
Recommendation: Treat as an internal application and protect it. If it must track
CMS pages, populate its page list from the route-index query rather than static data.

Page / Route: Legacy Vite-only category/treatment pages  
Section / Component: Old category implementations  
Content Type: Full page copy, arrays, images, cards, labels  
Current Source: **Hardcoded / Static**  
Issue: `App.tsx` still maps many routes to legacy pages including `CategoryPage`,
`CategoryPageNew`, `Urology`, `Ortopedi`, `FlereFagomrader`, and
`GynekologiskUndersokelse`; these contain large static content sets. The Next app
mostly uses the CMS router, but `npm run dev:vite` still exposes them.  
File Path: `src/App.tsx`; `src/site-pages/treatments/CategoryPage.tsx`;
`CategoryPageNew.tsx`; `Urology.tsx`; `Ortopedi.tsx`;
`FlereFagomrader.tsx`; `GynekologiskUndersokelse.tsx`;
`categoryPageContent.ts`; `src/data/treatmentContent.ts`  
Recommendation: Retire the Vite router and dead legacy pages, or refactor them to
the same Sanity providers as the Next routes.

Page / Route: Legacy skin/e-commerce experience (not in the primary Next router,
but present as reusable components)  
Section / Component: Product, bundles, skin scan, assistant, promotions  
Content Type: Products, testimonials, stats, treatments, promises, assistant copy  
Current Source: **Hardcoded / Static**  
Issue: Many reusable blocks contain local arrays and bundled assets and can render
editorial content without Sanity.  
File Path: `src/components/BeforeAfterSection.tsx`; `BundlePackages.tsx`;
`HeroChat.tsx`; `HeroSlider.tsx`; `IdaGuide.tsx`; `InfoCards.tsx`;
`PatientJourneySection.tsx`; `PremiumBanner.tsx`; `PromoBanner.tsx`;
`SaleSection.tsx`; `SkinConcernCategories.tsx`; `StatsSection.tsx`;
`TestimonialSection.tsx`; `TopRatedProducts.tsx`; `TreatmentCategories.tsx`;
`TreatmentInfoSection.tsx`; `TreatmentShowcase.tsx`; `TrustSection.tsx`;
`ValuesSection.tsx`; related images under `src/assets/`  
Recommendation: Delete if unreachable. If retained, add schemas for product
collections/content blocks and pass all content as required props from Sanity.

Page / Route: Header search on every page  
Section / Component: Search suggestions/synonyms/popular terms  
Content Type: Labels, categories, paths, synonyms  
Current Source: **Hardcoded / Static**  
Issue: Search has a static data corpus and synonym map in addition to live search;
popular terms are embedded in JSX.  
File Path: `src/components/layout/PageLayout.tsx`;
`src/data/searchData.ts`; `src/data/searchSynonyms.ts`;
`src/hooks/useSmartSearch.ts`  
Recommendation: Query searchable documents from Sanity and store curated synonyms
and popular terms in `siteSettings.search`.

Page / Route: Not-found  
Section / Component: Metadata and empty state  
Content Type: SEO title/description; visible title/text/image/CTA  
Current Source: **Sanity** plus **Hardcoded / Static** metadata  
Issue: Visible fields come from `siteSettings` and disappear if absent, but SEO is
literal Norwegian and image alt is empty.  
File Path: `src/site-pages/NotFound.tsx` (lines 24-35, 81);
`src/app/[locale]/not-found.tsx`  
Recommendation: Add/query localized 404 SEO and image alt in `siteSettings`.

Page / Route: Robots, sitemap, llms.txt  
Section / Component: Machine-readable discovery files  
Content Type: Paths, default labels/descriptions, crawler policy  
Current Source: **Sanity** plus **Hardcoded / Static**  
Issue: Sitemap uses Sanity slugs but project/dataset have hardcoded defaults;
`llms.txt` has static fallback paths/content; robots policy and AI crawler lists
are code-defined.  
File Path: `src/app/sitemap.ts`; `src/lib/sanity/sitemap-data.ts`;
`src/app/robots.ts`; `src/lib/seo/robots-paths.ts`;
`src/app/llms.txt/route.ts`; `src/lib/seo/llms-txt.ts`;
`src/lib/seo/ai-crawler-user-agents.ts`  
Recommendation: Keep crawler policy in code if it is operational configuration,
but move public descriptions and intentional canonical navigation into
`siteSettings`; remove hardcoded Sanity project fallback values.

# 5. Missing Sanity Schema or Query Support

Page / Route: All  
Section / Component: Global organization/schema configuration  
Content Type: Organization/clinic name, descriptions, logos, canonical base,
default OG image, sameAs, medical specialties  
Current Source: **Hardcoded / Static**  
Issue: `siteSettings` does not serve as the single queried source for all JSON-LD
and metadata defaults.  
File Path: `src/lib/seo/home-jsonld.ts`; `src/lib/seo/geo-jsonld.ts`;
`src/lib/seo/defaults.ts`; `test/schemaTypes/siteSettings.ts`  
Recommendation: Add a `structuredData` and `seoDefaults` object to `siteSettings`
and project it server-side into every metadata/schema builder.

Page / Route: All  
Section / Component: Header/footer/search  
Content Type: Search UI/terms/synonyms, footer columns/order/legal copy, logo alts  
Current Source: **Hardcoded / Static**  
Issue: Existing `siteSettings` support is incomplete for these rendered fields.  
File Path: `src/components/layout/PageLayout.tsx`;
`src/components/homepage/Footer.tsx`; `test/schemaTypes/siteSettings.ts`  
Recommendation: Extend schema/query with `search`, `footer`, `brandAssets`, and
localized accessibility-label objects.

Page / Route: Clinic detail  
Section / Component: Shared detail-page UI  
Content Type: Section titles, field labels, not-found copy, card/alt/ARIA templates  
Current Source: **Hardcoded / Static**  
Issue: Clinic documents contain data, but no page-level UI object is queried.  
File Path: `src/site-pages/ClinicDetailPage.tsx`;
`test/schemaTypes/clinicPage.ts`; `test/schemaTypes/clinicsPage.ts`  
Recommendation: Add `detailUi` to `clinicsPage` and image alt fields to
`clinicPage`; include them in the relevant GROQ projection.

Page / Route: Article detail  
Section / Component: Shared detail-page UI  
Content Type: Not-found/loading/related headings and SEO templates  
Current Source: **Hardcoded / Static**  
Issue: `newsPage` query supports listing UI but not all detail UI.  
File Path: `src/site-pages/ArticlePage.tsx`;
`test/schemaTypes/newsPage.ts`; `src/lib/queries.ts`  
Recommendation: Add and query an `articleUi` object on `newsPage`.

Page / Route: Careers detail  
Section / Component: Shared detail/application UI  
Content Type: Labels, empty states, application/contact formatting  
Current Source: **Hardcoded / Static**  
Issue: Existing careers schema does not cover every detail label/template.  
File Path: `src/site-pages/KarriereDetail.tsx`;
`test/schemaTypes/careersPage.ts`  
Recommendation: Add/query `jobDetailUi`.

Page / Route: Product routes and legacy commerce blocks  
Section / Component: Product listing/detail/editorial modules  
Content Type: UI labels, collection composition, promotions, bundles,
before/after, assistant content  
Current Source: **Hardcoded / Static**  
Issue: `product` documents exist, but no complete page/collection/block schemas
support the rendered legacy feature set.  
File Path: `test/schemaTypes/product.ts`; product/skin components listed above  
Recommendation: Add schemas only for features that remain in product scope;
otherwise delete the unused components and assets.

Page / Route: Fastlege guide  
Section / Component: Governed clinical content  
Content Type: Body, sources, medical reviewer, review/expiry date, SEO/GEO  
Current Source: **Hardcoded / Static** fallback  
Issue: Generic `themePage` technically accepts content but lacks clinical
governance fields and Portable Text richness for this use case.  
File Path: `src/site-pages/FastlegeveiledningOvergangsalder.tsx`;
`test/schemaTypes/themePage.ts`  
Recommendation: Add `clinicalGuide` (preferred) or extend `themePage` with
Portable Text, citations, reviewer, last reviewed, next review, and status.

Page / Route: Booking  
Section / Component: Operational presentation configuration  
Content Type: Complete UI copy, formatting templates, legal links, support details  
Current Source: **Fallback**  
Issue: A schema exists, but query/normalization permits a missing/partial document
to be replaced wholesale from code. Literal progress labels remain outside it.  
File Path: `test/schemaTypes/bookingPage.ts`;
`src/lib/sanity/booking-page-copy.ts`; `src/site-pages/BookingDemo.tsx`  
Recommendation: Add missing literal fields, strengthen schema validation, and
return a completeness error instead of merging code defaults.

## Reusable Component Inventory

The following grouping prevents dormant reusable blocks from being mistaken for
CMS-connected blocks.

**Sanity-prop/data driven (with the noted child fallbacks):**

- `homepage/HeroBanner`, `ValueBadges`, `PatientTrustSection`,
  `LifePhasesSection`, `PromoBlocks`, `ResultsStatsSection`,
  `GoogleReviewsSection`, `SpecialistsSection`, `WhyCMedicalSection`
- `page-sections/PageSectionsRenderer`, `PageSectionArticlesBlock`,
  `PageSectionSpecialistsBlock`, `PageSectionBookingCtaBlock`
- `specialist/SpecialistHero`, `SpecialistBio`, `SpecialistFAQ`,
  `SpecialistFAQBlock`, `SpecialistReviews`, `SpecialistFeaturedService`,
  `RelatedSpecialists`, `InlineBookingSection`
- `treatments/SpecialistsScroller`, `CategoryReviews`,
  `SymptomServiceSection`, `AnimatedStatsSection`, `TagList`
- `clinic/ClinicBookingBlock`, `ClinicMap`

These are not independently “fully managed” when they contain `t(...)`, literal
empty states, fixed paths, icon defaults, or default props. Their parent schemas
must provide the remaining values.

**Shared chrome/UI with editorial fallback content:**

- `layout/PageLayout`, `BurgerMenu`, `MobileNavMenuContent`,
  `MobileBottomNav`, `ServicesDropdown`, `LanguageSelector`
- `homepage/Footer`, `BookingCTA`, `BookingWidget`, `SoMeFeed`,
  `NewsSplitScreen`
- `ContactRequestDialog`, `LeadPopup`, `NewsletterSection`, `StickyBookingCTA`
- booking components under `src/components/booking`

**Static/legacy editorial blocks:**

- `BeforeAfterSection`, `BundlePackages`, `DrawerAssistant`, `ExpertiseSection`,
  `FaceScanCamera`, `HeroChat`, `HeroSlider`, `IdaGuide`, `InfoCards`,
  `PatientJourneySection`, `PremiumBanner`, `ProductGallery`, `PromoBanner`,
  `RecommendedProductCard`, `SaleSection`, `SeasonalProducts`,
  `SkinConcernCategories`, `SpecialistsSection`, `StatsSection`,
  `TestimonialSection`, `TopRatedProducts`, `TreatmentCategories`,
  `TreatmentInfoSection`, `TreatmentShowcase`, `TrustSection`, `ValuesSection`

**Presentational primitives (no CMS responsibility):**

- `AssetImg`, `AnimatedStat`, provider/hydration components, SEO emitters,
  Portable Text renderers, navigation scroll helpers, and `src/components/ui/*`.
- Accessibility defaults inside third-party-style UI primitives are code
  interface copy rather than site editorial copy. Site-specific labels passed to
  those primitives are covered above.

## Static Data and Asset Inventory

The following files can provide visible/searchable content outside Sanity:

- `src/data/articleContent.ts`, `articles.ts`, `clinicServices.ts`,
  `fertilitetSubPages.tsx`, `googleReviews.ts`, `gynekologiSubPages.tsx`,
  `jobListings.ts`, `searchData.ts`, `searchSynonyms.ts`,
  `serviceCategories.ts`, `sitePages.ts`, `specialists.ts`,
  `sub-treatment-source.ts`, `treatmentContent.ts`
- `src/site-pages/gynekologi-design/gynekologiContent.ts`
- `src/site-pages/fertilitet-design/fertilitetContent.ts`
- `src/i18n/locales/nb.json`, `src/i18n/locales/en.json`
- Bundled editorial images under `src/assets` and fixed media under `public`

Some data modules are now used only for TypeScript types or migrations, while
others remain runtime fallbacks. To prevent regression, move migration-only data
under `test/sanity/data`, remove unused runtime imports, and add an ESLint rule or
CI check forbidding `src/data/*` imports from public page components.

## Route Coverage Checklist

Audited Next routes:

- Homepage, CMS catch-all singleton/listing/theme/category/treatment/detail routes
- Booking aliases, product detail, guide, fastlege guide
- All gynecology/fertility design routes
- Demo indexes, icon preview, approval tool, not-found
- Studio, API routes, sitemap, robots, and llms.txt (operational/non-editorial
  routes were checked only for public copy and content-source behavior)

Audited legacy routes:

- Every route declared in `src/App.tsx`, including legacy aliases, category and
  treatment routes, theme pages, careers/news/specialists/clinics, demos, and 404.

## Recommended Remediation Order

1. Remove the static fastlege article fallback and booking copy fallback.
2. Make `siteSettings`, page SEO/GEO, and page-level UI objects complete and
   required; remove locale/TypeScript defaults from public rendering.
3. Remove service, treatment, specialist, article, job, and social runtime
   datasets after confirming Sanity migration completeness.
4. Centralize all routes/links through CMS route references instead of literal
   Norwegian paths.
5. Add the missing `detailUi`, `articleUi`, `jobDetailUi`, search/footer, and
   structured-data schema/query fields.
6. Remove or protect demo, icon-preview, approval, legacy Vite, and dormant
   e-commerce/skin experiences.
7. Add CI checks for user-facing JSX literals, public imports from `src/data`, and
   fallback operators around CMS editorial fields.

