## Mål

Flytte statisk innhold fra TS-filer inn i Sanity som dokumenter med både norsk og engelsk tekst. Redaktører får full kontroll, og språkbytte i frontend leser fra Sanity (eksisterende `_en`-coalesce er allerede på plass).

## Innhold som skal migreres

| Kilde-fil | Linjer | Sanity-mål |
|---|---:|---|
| `src/pages/treatments/categoryPageContent.ts` | 469 | Utvider eksisterende `treatmentCategory` |
| `src/pages/gynekologi-design/gynekologiContent.ts` | 117 | Inn i `treatmentCategory` (gynekologi) |
| `src/pages/fertilitet-design/fertilitetContent.ts` | 234 | Inn i `treatmentCategory` (fertilitet) + ny `themePage`-blokker |
| `src/data/treatmentContent.ts` | 1730 | Inn i eksisterende `treatment`-dokumenter (fase 2) |

## Steg

### 1. Utvid `treatmentCategory`-schema (`test/schemaTypes/treatmentCategory.ts`)
Nye felter (alle som `internationalizedArray*` eller med parallel `_en`):
- `subtitle` – kort tagline ("Ingen ventetid • Ingen henvisning")
- `servicesHeading`, `servicesIntro`
- `serviceGroups[]` – `{ label, caption, image, serviceNames[] }`
- `journey[]` – `{ icon, label, title, body }`
- `closing` – `{ title, body, cta }`
- `faqs[]` – referanse til eksisterende `faq`-dokumenter, med fallback til `relatedTreatmentCategory`-koblingen som allerede finnes
- `bookingPath`

### 2. Migrasjons-skript (`test/sanity/migrate-static-category-content.ts`)
- Leser direkte fra TS-modulene (importerer dem)
- For hver kategori: bygger Sanity-patch med NO-verdier
- Patcher eksisterende `treatmentCategory`-dokumenter (matcher på `categoryId`)
- Idempotent: hopper over felt som allerede er satt (med `FORCE=1` for overstyring)
- Genererer `_key` for arrays

### 3. EN-oversettelse
- Kjør `translate-all-content.ts` etterpå (eksisterende skript). Det vil automatisk se de nye feltene og generere `_en` via Lovable AI Gateway. Ingen ny kode trengs.

### 4. GROQ-queries (`src/lib/queries.ts`)
Utvid `TREATMENT_CATEGORY_BY_SLUG_QUERY` med de nye feltene + deres `_en`-varianter. `normalizeI18n` håndterer språkvalg automatisk.

### 5. Komponent-oppdateringer
- `src/pages/treatments/CategoryPage.tsx` – les fra Sanity i stedet for `categoryPageContent.ts`. Behold TS-filen som statisk fallback inntil migrasjonen er bekreftet.
- `src/pages/gynekologi-design/*` og `src/pages/fertilitet-design/*` – les fra ny Sanity-data via en `useCategoryContent(slug)` hook
- Behold TS-fallback i hooken: `data ?? staticContent[slug]`

### 6. Cleanup (etter verifisering)
- Etter at Sanity-innholdet er bekreftet riktig på alle berørte sider, fjern de statiske TS-filene
- Oppdater memory: `data-fetching-strategy` reflekterer at category-innhold nå er Sanity-først uten fallback

## Fase 2 (separat, etter godkjent fase 1)
`treatmentContent.ts` (1730 linjer, per-behandling). Krever større skript som patcher hvert eksisterende `treatment`-dokument. Tar denne i egen runde for å holde dette PR-en håndterlig.

## Tekniske detaljer

- All EN-oversettelse går gjennom `LOVABLE_API_KEY` (allerede konfigurert) via `translate-all-content.ts`
- Bildereferanser i `serviceGroups[].image` kan enten beholdes som assets i frontend (lookup på label), eller migreres til Sanity-assets (mer arbeid – foreslår å starte uten)
- Ikoner lagres som strings (Lucide-navn), løses i frontend via `getIcon()`
- Validering: bruk eksisterende Sanity-typer (`internationalizedArrayString`, `internationalizedArrayText`)

## Hva som ikke endres
- Approved customer copy beholdes ordrett – migrasjonen flytter den, oversetter ikke NO
- Eksisterende `treatment`-dokumenter blir ikke rørt i denne fasen
- `en.json` blir værende for UI-chrome (nav, knapper)

## Estimat
Fase 1 (kategori-innhold): ~30–45 minutter implementering + ~5 min EN-oversettelse. Fase 2 (per-treatment): separat, ~45 min.
