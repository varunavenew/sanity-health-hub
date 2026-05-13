## Mål

Du liker rytmen og layouten på `Fertility.tsx`. Vi tar den som "mal" for resten av nettstedet — men "tilpasset hver fagområde" (slik du valgte), ikke 1:1 kopi. Tekst på godkjente sider (gynekologi, fertilitet, fertilitetssjekk, gynekologisk undersøkelse) røres ikke — bare struktur/visuell rytme.

## Fertilitet-rytmen vi gjenbruker

```text
1. HERO            split (foto/video venstre, tittel + 2 CTA + tagline høyre)
2. STAT-STRIPE     bg-brand-dark, 3–4 AnimatedStat
3. SEGMENTER       "Jeg vil…" kort, light bg, venstrejustert
4. TJENESTER       ServicesListSection (ikon + navn + 'fra' pris)
5. SYMPTOMER       SymptomServiceSection
6. SPESIALISTER    SpecialistsScroller
7. REISE/STORY     1–2 foto-blokker med kort tekst
8. REVIEWS         eksisterende komponent
9. FAQ             eksisterende komponent
10. CTA-BUNN       CallUsClinicPicker / BookingCTA, bg-brand-dark
```

Ikke alle sider trenger alle steg (urologi har ikke "segmenter" på samme måte). Vi bruker reglen: behold rytmen lys → mørk-stripe → lys, hopp over seksjoner som ikke gir mening.

## Steg 1 — Trekk ut gjenbrukbare seksjoner

Nye komponenter under `src/components/page-sections/`:

- `SplitHero.tsx` — split-hero (media venstre, tekst + CTA-er høyre, video- eller bilde-prop)
- `StatStripe.tsx` — mørk stripe med `AnimatedStat`
- `SegmentCards.tsx` — "Jeg vil…"-kort med tags + CTA
- `StoryBlock.tsx` — foto + kort tekst, alternerende side
- `FinalCTASection.tsx` — mørk bunn-CTA m/ `CallUsClinicPicker`

`ServicesListSection`, `SymptomServiceSection`, `SpecialistsScroller`, FAQ, reviews-seksjonene gjenbrukes som de er.

Refaktorer `Fertility.tsx` til å bruke de nye komponentene først — som "referanse-implementasjonen". Visuelt resultat skal være identisk.

## Steg 2 — Rull ut, i bolker (én bolk per godkjenning)

Bolk A — behandlingssider (denne runden):
- `treatments/Gynecology.tsx` (kun struktur, ikke tekst)
- `treatments/UrologiPage.tsx`
- `treatments/Ortopedi.tsx` / `OrtopediPage.tsx`
- `treatments/FlereFagomrader.tsx`

Bolk B — tema-sider:
- `themes/KvinnehelsePage.tsx` (har allerede split-hero), `RobotkirurgiPage.tsx`, `TverrfagligePage.tsx`

Bolk C — øvrige (About, Clinics, Insurance, Karriere, Pricing, Services, Contact)
— her må vi diskutere hva som faktisk gir mening, siden flere av disse ikke har "segmenter/symptomer/spesialister".

## Tekstregel

På sider med godkjent tekst (gynekologi m.fl.) flytter vi eksisterende strenger inn i de nye seksjonene uten å endre formuleringer. På sider uten godkjent tekst skriver jeg utkast som du kan justere etterpå.

## I denne runden leverer jeg

1. De fem nye seksjonskomponentene.
2. `Fertility.tsx` refaktorert til å bruke dem (visuelt likt).
3. Bolk A — behandlingssidene over, med fertilitet-rytme tilpasset hvert fagområde.

Bolk B og C tar vi i påfølgende meldinger så omfanget holder seg håndterbart og du kan godkjenne underveis.
