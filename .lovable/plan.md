## Mål

Tre mastermaler i Sanity som dekker **alle** seksjoner sidene våre kan vise. Redaktøren slår av/på og sorterer seksjoner i én liste, men kan ikke finne på nye seksjonstyper (frontend må kunne rendre dem).

- **Master A — Hovedkategori** (`treatmentCategory`): /gynekologi, /fertilitet, /urologi, /ortopedi, /graviditet, /flere-fagomrader
- **Master B — Undertjeneste** (`treatment`): /behandlinger/{kategori}/{slug} (alle 60+ undersider)
- **Master C — Artikkel/nyhet** (`article`): /aktuelt/{slug}, fagartikler, prislister, stillingsutlysninger

## Designprinsipp: «sections[]» med togglebare blokker

I stedet for faste topp-nivå-felter brukes ett `sections[]`-array av polymorfe objekttyper. Hver seksjon har:
- `_type` (bestemmer komponent i frontend)
- `enabled` (boolean, default true) — rask av/på uten å slette
- `anchorId` (valgfri) — for #scroll
- Seksjonsspesifikke felter

Editor får én «Sideoppbygging»-liste i Studio der hen kan dra-og-slippe rekkefølge, klikke ➕ for å sette inn ny seksjon fra en kuratert liste, eller klikke 👁 for å skjule midlertidig. Faste felter (tittel, slug, hero-bilde, SEO) ligger fortsatt på toppen.

```text
┌─ treatmentCategory (Master A) ──────────────┐
│ title, slug, categoryId, hero, SEO          │
│ sections[] ◄── dra-og-slipp                 │
│   • sectionHero            (på)             │
│   • sectionIntro           (på)             │
│   • sectionStats           (av)  ◄─ skjult  │
│   • sectionServicesList    (på)             │
│   • sectionServiceGroups   (på)             │
│   • sectionSpecialists     (på)             │
│   • sectionJourney         (på)             │
│   • sectionReviews         (på)             │
│   • sectionFaq             (på)             │
│   • sectionCta             (på)             │
└─────────────────────────────────────────────┘
```

## Seksjonsbibliotek

Alle tre maler deler ett felles sett med seksjons-objekttyper i `test/schemaTypes/sections/`. Hver mal eksponerer en hvit-liste over hvilke seksjoner som er gyldige.

### Felles for alle maler
| `_type` | Felter | Brukes i |
|---|---|---|
| `sectionHero` | overskrift, undertekst, bilde/video, eyebrow, CTA | A, B, C |
| `sectionIntro` | rich-tekst, valgfritt bilde | A, B, C |
| `sectionStats` | array av `{value, label}` + bg-variant | A, B, C |
| `sectionFaq` | tittel, intro, `items[]{question, answer}` | A, B, C |
| `sectionCta` | tittel, body, knappetekst, lenke, bakgrunn (lys/mørk) | A, B, C |
| `sectionRichText` | fri portable-text-blokk | A, B, C |
| `sectionVideo` | url, thumbnail, caption | A, B, C |
| `sectionImageGallery` | bilder + caption | A, B, C |
| `sectionQuote` | sitat, kilde, bilde | A, B, C |
| `sectionTrustBadges` | logoer + tekst | A, C |

### Spesifikt for Master A (hovedkategori)
| `_type` | Felter |
|---|---|
| `sectionServicesList` | overskrift, intro, lenker til `treatment[]` (eller frie `{label, path}`) |
| `sectionServiceGroups` | grupper `[{label, caption, items[]}]` (tematisk gruppering) |
| `sectionSpecialists` | filter på kategori, antall, layout (carousel/grid) |
| `sectionJourney` | steg `[{icon, label, title, body}]` |
| `sectionReviews` | kilde (google/legelisten), antall |
| `sectionPriceTeaser` | utvalgte priser fra `pricingPage` |
| `sectionRelatedThemes` | lenker til `themePage` (Kvinnehelse, Robotkirurgi, Tverrfaglige) |

### Spesifikt for Master B (undertjeneste)
| `_type` | Felter |
|---|---|
| `sectionBenefits` | tittel, `items[]` (punktliste) |
| `sectionProcess` | steg `[{title, description}]` |
| `sectionAccordionContent` | trekkspill `[{id, heading, content}]` (dagens `sections` i treatment) |
| `sectionLinkedServices` | krysslenker `[{label, description, path}]` |
| `sectionSpecialists` | (samme som A, men filtrert per behandling) |
| `sectionSymptoms` | symptomliste + når-bør-du-kontakte-oss |
| `sectionTreatmentOptions` | kirurgi-/behandlingsalternativer som kort |
| `sectionPriceCard` | pris «fra», hva inngår, forsikringsinfo |
| `sectionInsuranceInfo` | godkjente forsikringsselskap |
| `sectionClinicLocations` | hvilke klinikker tilbyr behandlingen |
| `sectionBookingCta` | direkte til booking med forhåndsvalgt kategori |
| `sectionRelatedTreatments` | andre behandlinger i samme kategori |

### Spesifikt for Master C (artikkel/nyhet)
| `_type` | Felter |
|---|---|
| `sectionArticleHero` | bilde, kategori-tag, dato, forfatter, leselengde |
| `sectionArticleBody` | hoved portable-text (det som i dag er `body`) |
| `sectionAuthorBio` | referanse til `specialist` |
| `sectionRelatedArticles` | auto (samme kategori) eller manuelt valgte |
| `sectionRelatedTreatments` | lenker til relevante behandlinger |
| `sectionNewsletterCta` | overskrift, form-id |
| `sectionTableOfContents` | auto-generert fra h2/h3 i body |
| `sectionDownload` | PDF/vedlegg (prislister, jobbutlysninger) |
| `sectionJobApplication` | for stillingsutlysninger: form-felter, søknadsfrist |

## Implementasjon

### Steg 1 — Bygg seksjonsbiblioteket
`test/schemaTypes/sections/index.ts` eksporterer alle `section*`-typer. Hver type har `enabled` (boolean, default true) og felter med `internationalizedArray*` der det trengs.

### Steg 2 — Mastermal-dokument
Ny dokumenttype `pageTemplate` i Studio som er en «levende referansemal». Inneholder en standard `sections[]`-konfigurasjon for hver av A/B/C. Editor kan duplisere en mal for å starte en ny side med alle seksjoner pre-utfylt. Vises som egen meny-gruppe «Maler» i Studio.

### Steg 3 — Utvid eksisterende skjemaer
Legg til `sections[]` på `treatmentCategory`, `treatment` og `article`. Behold dagens felter som «legacy» en periode (skjul med `hidden` i Studio når `sections` har innhold) — sikrer at gamle dokumenter fortsatt fungerer mens vi migrerer.

### Steg 4 — Studio-UX
- Ett array-felt `sections` med tydelige preview-ikoner per `_type`
- Custom `previewSelect` viser type-navn + første overskrift
- Toggle `enabled` synlig i preview (👁 / 🚫)
- Gruppér felter: «Innhold» (sections), «Meta» (slug, SEO, kategori), «Innstillinger»

### Steg 5 — Migrasjon av eksisterende data
- `test/sanity/migrate-to-sections-template.ts`: leser dagens `treatmentCategory`-felter (`subtitle`, `servicesHeading`, `serviceGroups`, `journey`, `staticFaqs`, `closing*`) og pakker dem inn som `sections[]`-entries
- Tilsvarende for `treatment` (`description`, `benefits`, `process`, `sections`, `faqs`, `linkedServices`) og `article` (`body` → `sectionArticleBody`)
- Kjøres med `DRY_RUN=1` først, deretter `FORCE=1`
- Idempotent

### Steg 6 — Frontend-renderer
`src/components/sections/SectionRenderer.tsx`:
```tsx
const REGISTRY = {
  sectionHero: HeroSection,
  sectionStats: StatsSection,
  sectionFaq: FaqSection,
  // ...
};
export function SectionRenderer({ sections }) {
  return sections
    .filter(s => s.enabled !== false)
    .map(s => {
      const Cmp = REGISTRY[s._type];
      return Cmp ? <Cmp key={s._key} {...s} /> : null;
    });
}
```

Hver eksisterende komponent (`CategoryReviews`, `AnimatedStatsSection`, `FaqSection`, osv.) wrappes/justeres for å ta data fra section-objektet.

### Steg 7 — GROQ
`sections[]` projiseres som union med felt per `_type`. `normalizeI18n` håndterer NO/EN automatisk siden samme `internationalizedArray*`-typer brukes.

### Steg 8 — Side-komponenter forenkles
`CategoryPage.tsx`, `TreatmentPage.tsx`, `ArticlePage.tsx` blir tynne wrappere som henter dokumentet og kjører `<SectionRenderer sections={data.sections} />`. Statisk fallback beholdes inntil migrasjonen er bekreftet på alle sider.

### Steg 9 — EN-oversettelse
`translate-all-content.ts` utvides til å traversere `sections[]` og oversette alle `internationalizedArray*`-felter rekursivt — én funksjon som gjelder alle tre maler.

### Steg 10 — Cleanup
- Slett `src/data/treatmentContent.ts`, `categoryPageContent.ts`, `gynekologiContent.ts`, `fertilitetContent.ts` etter bekreftet migrasjon
- Skjul legacy-felter helt i Studio
- Oppdater memory: `data-fetching-strategy` og `behandlingssider` reflekterer ny mastermal-arkitektur

## Avklaringer før jeg starter

1. **Skal eksisterende `subItems` (treatment), `serviceGroups` (category) osv. flyttes inn i `sections[]`, eller fortsatt være topp-nivå-felter?** Anbefaler: flytt inn i sections (én sannhet, full fleksibilitet).
2. **Skal `pageTemplate`-dokumentet kunne tvinge oppdatering på alle sider som bruker malen (template-arv), eller bare være et «start her»-utgangspunkt?** Template-arv er mye mer arbeid; foreslår starter-mal.
3. **Master C dekker også «Prisliste» og «Stillingsutlysning» (begge er i dag `article` med ulik category). Skal disse splittes til egne dokumenttyper, eller fortsette som artikkel med betingede seksjoner?** Foreslår: behold som article, bruk `category`-feltet til å foreslå riktig section-mal.

## Estimat
- Steg 1–4 (skjema + Studio-UX): ~60 min
- Steg 5 (migrasjon): ~45 min
- Steg 6–8 (frontend-renderer + tre sider): ~90 min
- Steg 9–10 (oversettelse + cleanup): ~30 min

Totalt ~3,5–4 timer fordelt over 2–3 PR-er. Foreslår å starte med **Master A** (mest gjennomarbeidet allerede), deretter B, deretter C.
