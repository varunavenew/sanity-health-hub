# Mastermaler — 5 dokumenttyper

Hver mal er en Sanity-dokumenttype med felles `sections[]`-array av polymorfe seksjoner. Hver seksjon har `enabled` (toggle av/på), `anchorId`, og typespesifikke felter. Redaktør kan dra/sortere, skru av, eller fjerne — uten å miste data.

## Maler

### 1. `treatmentCategory` — Fagområde (eks. Gynekologi, Urologi)
Toppnivå-tjenesteområde. Seksjoner:
- `sectionHero` (bilde/video, tittel, ingress, CTA)
- `sectionIntro` (kort tekst + USP)
- `sectionStats` (3–4 nøkkeltall)
- `sectionServiceGroups` (grupperte undertjenester med ikon)
- `sectionServicesList` (flat liste)
- `sectionSpecialists` (knyttede behandlere)
- `sectionJourney` (steg-for-steg)
- `sectionReviews` (Google/Legelisten)
- `sectionFaq`
- `sectionPriceTeaser`
- `sectionRelatedThemes`
- `sectionCta` (booking)

### 2. `themePage` — Tema (eks. Kvinnehelse, Mannehelse) — NY
Tverrgående temasider på tvers av fagområder. Seksjoner:
- `sectionHero`
- `sectionIntro`
- `sectionRichText` (lengre redaksjonell tekst)
- `sectionCategoryLinks` (peker til relevante fagområder)
- `sectionTreatmentHighlights` (utvalgte behandlinger)
- `sectionSpecialists`
- `sectionArticleFeed` (relaterte artikler)
- `sectionStats`
- `sectionReviews`
- `sectionFaq`
- `sectionCta`

### 3. `treatment` — Underbehandling (eks. Fertilitetssjekk)
Konkret behandling/inngrep. Seksjoner:
- `sectionHero`
- `sectionIntro` (hva er det, hvem passer det for)
- `sectionSymptoms` (utenfor accordion)
- `sectionBenefits`
- `sectionProcess` (forløp)
- `sectionAccordionContent` (forberedelse, etterpå, risiko)
- `sectionTreatmentOptions` (kirurgi/varianter)
- `sectionPriceCard` ("fra"-pris + disclaimer)
- `sectionInsuranceInfo`
- `sectionLinkedServices`
- `sectionSpecialists`
- `sectionClinicLocations`
- `sectionReviews`
- `sectionFaq`
- `sectionBookingCta`
- `sectionRelatedTreatments`

### 4. `newsItem` — Nyhet — NY (splittet ut fra article)
Korte aktualitetsinnlegg. Seksjoner:
- `sectionArticleHero` (bilde, kategori-chip, dato)
- `sectionRichText` (kort brødtekst)
- `sectionQuote`
- `sectionImageGallery`
- `sectionCta`
- `sectionRelatedArticles`

### 5. `article` — Artikkel (fagartikkel/guide)
Lengre redaksjonelt innhold. Seksjoner:
- `sectionArticleHero`
- `sectionTableOfContents`
- `sectionRichText`
- `sectionVideo`
- `sectionImageGallery`
- `sectionQuote`
- `sectionAuthorBio`
- `sectionDownload` (PDF/vedlegg)
- `sectionRelatedTreatments`
- `sectionRelatedArticles`
- `sectionNewsletterCta`

## Delte seksjoner (gjenbruk i `test/schemaTypes/sections/`)
`sectionHero`, `sectionIntro`, `sectionStats`, `sectionRichText`, `sectionFaq`, `sectionCta`, `sectionVideo`, `sectionImageGallery`, `sectionQuote`, `sectionReviews`, `sectionSpecialists`, `sectionTrustBadges`, `sectionRelatedArticles`, `sectionRelatedTreatments`.

Spesifikke: `sectionServiceGroups`, `sectionServicesList`, `sectionJourney`, `sectionPriceTeaser`, `sectionRelatedThemes`, `sectionCategoryLinks`, `sectionTreatmentHighlights`, `sectionArticleFeed`, `sectionSymptoms`, `sectionBenefits`, `sectionProcess`, `sectionAccordionContent`, `sectionTreatmentOptions`, `sectionPriceCard`, `sectionInsuranceInfo`, `sectionLinkedServices`, `sectionClinicLocations`, `sectionBookingCta`, `sectionArticleHero`, `sectionTableOfContents`, `sectionAuthorBio`, `sectionDownload`, `sectionNewsletterCta`.

## Implementering

### Steg
1. Utvid seksjonsbiblioteket i `test/schemaTypes/sections/` med manglende typer fra Tema og Nyhet.
2. Opprett `themePage` og `newsItem` skjemaer med `sections[]`.
3. Studio: legg de fem malene under egen "Mastermaler"-gruppe i deskstructure, med ikoner og preview.
4. Utvid `SectionRenderer.tsx` med komponenter for nye seksjonstyper.
5. Migrasjonsskript:
   - `migrate-theme-to-sections.ts` — pakker eksisterende kvinnehelse o.l. inn i `themePage.sections[]`.
   - `migrate-news-to-sections.ts` — splitter eksisterende `article` med `category=nyhet` over til `newsItem`.
6. GROQ-spørringer: legg til `THEME_PAGE_BY_SLUG_QUERY` og `NEWS_BY_SLUG_QUERY`, og union-projeksjon per `_type` i `sections[]`.
7. Frontend-ruter:
   - `/kvinnehelse`, `/mannehelse` → `ThemePage.tsx` (tynn wrapper rundt SectionRenderer)
   - `/aktuelt/[slug]` → splitter: hvis `newsItem` → `NewsPage.tsx`, ellers `ArticlePage.tsx`
8. Oversettelses-pipeline: utvid `translate-all-content.ts` til å traversere `sections[]` rekursivt for alle 5 typer.
9. Ryd opp i utgåtte statiske filer etter migrasjon er verifisert.

### Tekniske detaljer
- Hver seksjon: `{ _type, _key, enabled: boolean (default true), anchorId?: string, ...feltene }`
- `SectionRenderer` filtrerer `enabled !== false` og mapper `_type` → React-komponent via REGISTRY.
- Fallback: hvis dokumentet ikke har `sections[]`, render legacy-layout (bakoverkompatibel).
- Lokalisering: alle tekstfelt bruker `internationalizedArray` (NO+EN).

### Estimat
~4–5 timer totalt. Foreslår rekkefølge: Tema → Nyhet (mindre, raske) → så de tre eksisterende får finpuss.

## Spørsmål før jeg starter
1. Skal `themePage` ha egen URL-prefix (`/tema/[slug]`) eller flat (`/kvinnehelse`)? Eksisterende `/kvinnehelse` tilsier flat.
2. Skal eksisterende `article`-dokumenter med kategori "nyhet" automatisk migreres til `newsItem`, eller manuelt i Studio?
3. OK at "Stillingsutlysning" og "Prisliste" forblir egne dokumenttyper utenfor disse 5 malene?
