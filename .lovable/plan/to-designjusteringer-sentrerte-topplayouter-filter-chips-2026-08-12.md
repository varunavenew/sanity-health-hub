# To designjusteringer: sentrerte topplayouter + filter-chips

## 1. Sentrerte topplayouter skal være vertikalt midtstilt

I dag har den sentrerte toppseksjonen på /tjenester asymmetrisk luft: `pt-16 md:pt-32 pb-10 md:pb-14`. Den faste headeren (logo/nav) ligger over innholdet, så den opplevde toppluften blir enda mindre enn tallene tilsier.

Løsning: én felles CSS-klasse i `src/index.css` — `.centered-hero` — som gir seksjonen en minimumshøyde, flex-sentrering og lik luft over/under, med headerhøyden trukket fra på toppen (`padding-top: calc(header + X)`, `padding-bottom: X`), slik at det visuelle gapet fra header til overskrift blir likt gapet fra siste element ned til neste seksjon/skillelinje. Egne verdier for mobil og desktop.

Sider/komponenter som får klassen (alle sentrerte topplayouter):
- `src/pages/Services.tsx` (/tjenester)
- `src/pages/KarriereDetail.tsx`
- `src/pages/ClinicDetailPage.tsx` (sentrert topp)
- `src/pages/Guide.tsx`
- `src/pages/themes/KvinnehelsePage.tsx`, `src/pages/themes/RobotkirurgiPage.tsx`
- `src/components/layout/PageHero.tsx` (der den brukes sentrert)
- Øvrige sentrerte topper som dukker opp i gjennomgangen (demoer holdes utenfor med mindre de deler komponent)

Split-heroer (tekst venstre / bilde høyre) og liste-heroen røres ikke — de har allerede egne høyde-tokens.

## 2. Filter-chips: samme radius som «Bestill time»

Fakta i dag: `--radius` = 10px, og alle knapper (inkl. `variant="cta"`/«Bestill time») bruker `rounded-2xl` som er mappet til `var(--radius)` = 10px. Basisklassen `.chip-filter` i `src/index.css` bruker derimot `rounded-full` (9999px), mens noen bruksteder overstyrer til 10px — derav inkonsekvensen.

Valgt løsning (per din bekreftelse): alle filter-chips settes til nøyaktig 10px, samme som «Bestill time».

Endringer:
- `.chip-filter` i `src/index.css`: `rounded-full` → `rounded-[var(--radius)]`
- Fjerne/rydde lokale radius-overstyringer så de ikke spriker:
  - `src/pages/Specialists.tsx` (3 chip-steder)
  - `src/pages/PriserMobile.tsx`, `src/pages/PriserDesktop.tsx`
  - `src/pages/Aktuelt.tsx` (kategorifiltre + «Last inn flere»-knapp)
  - `src/components/specialist/SpecialistHero.tsx`
- `src/components/treatments/TagList.tsx`: `rounded-2xl md:rounded-full` → `rounded-[var(--radius)]` på både pill og «+N»-knapp
- Gjennomgang av øvrige `rounded-full`-treff som faktisk er filter-tags (ikke avatarer, prikker, ikonknapper, progress o.l.) — de rundingene beholdes.

## Verifisering

Playwright-måling som rapporteres til slutt:
- /tjenester desktop + mobil: piksler fra header-bunn til overskrift vs. fra siste element til seksjonsslutt (skal være like)
- Computed `border-radius` på filter-chips (/aktuelt, /spesialister, /priser) vs. «Bestill time»-knappen
