# Booking — kontrast, smart default-dato, og konsekvent capitalisering

Tre koblede endringer i `src/pages/BookingDemo.tsx`. Ingen logikkendring i bookingdataen — kun UX/visning.

## 1. Smart default-dato — alltid en reell, bookbar dag

I dag settes `selectedDate` til `addDays(today, 1)`. Hvis "i morgen" er lørdag/søndag, eller hvis dagen ikke har ledige tider, ender brukeren på "Ingen ledige timer denne dagen" (skjermbildet med Lørdag 16. Mai). Det skal aldri skje.

Ny regel — `getFirstAvailableDate(fromDate, specialist)`:
1. Hvis `today` er en hverdag (man–fre) **og** `generateTimeSlots(today, specialist).length > 0` → velg `today`. Knappen får "I dag"-merket og er forhåndsvalgt.
2. Ellers iterer fremover én dag av gangen:
   - Hopp over lørdag (6) og søndag (0).
   - Hopp over datoer uten ledige slots for valgt behandler/tjeneste.
3. Returner første treff. Hvis treffet ligger utenfor synlig 4-ukers strip, sett `rangeStart` til uken som inneholder dagen, så brukeren ser markeringen umiddelbart.

Hvor det kjøres:
- `useEffect` som trigger på `bookingData.specialist`, `bookingData.service`, og når brukeren når Steg 4. Setter både `selectedDate` og evt. `rangeStart`.

Visning av lørdag/søndag:
- Kalenderen viser fortsatt kun ma–fr (slik den gjør nå). "Førstkommende ledig" kan derfor aldri lande på en helg — verken visuelt eller logisk.

## 2. Kontrast — WCAG AA i hele bookingen

Brukerproblemene fra skjermbildene:
- Tjenestekortene (Velg tjeneste) flyter sammen med beige bakgrunn — kortene har kun `border-brand-dark/10` mot `bg-brand-beige` (skjermbilde 3).
- Kalender-rad og containere er begge beige (skjermbilde 4) — for lav skille.
- "Forrige periode"-pilen er nesten usynlig når aktiv (kun outline mot beige).

Ny visuell hierarki — tre nivåer:

| Nivå | Bruk | Token |
|------|------|-------|
| Side-bg | Hele bookingsiden | `bg-brand-light` (#F2ECE6) |
| Container/kort-bg | Kalender-boks, tidsbloks-boks, tjenestekategori-aksordion | `bg-brand-beige` (litt mørkere enn light) |
| Interaktivt element | Dato-knapp, tidsslot-knapp, tjeneste-rad | `bg-white` med tydelig border |

Konkrete endringer:

**Tjenestekort (skjermbilde 3, linjer ~720–770)**
- Container forblir `bg-brand-beige`.
- Hver tjeneste-rad: `bg-white border border-brand-dark/20` (i dag `border-brand-dark/10` — for svakt). Hover: `border-brand-dark bg-white shadow-sm`.
- Kategorioverskrift ("Graviditet - fostermedisiner") får `text-brand-dark font-medium` for klar separator mot listen.
- Mellomrom mellom rader: `gap-2` (i dag visuelt sammenklebet).

**Kalender (skjermbilde 4, linjer ~953–1085)**
- Ytre container beholdes `bg-brand-beige` med `border border-brand-dark/15`.
- Dato-knapper: aktiv = `bg-white border-brand-dark/25 text-brand-dark`. I dag er den `border-brand-dark/15` — for svakt mot beige. Bumpes til `/25` slik at hver knapp får tydelig form.
- Hover: `border-brand-dark bg-brand-dark/5`.
- **Selected**: `bg-brand-dark text-brand-light border-brand-dark` (kontrastforhold ~12:1, langt over WCAG AA 4.5:1).
- **Disabled / utenfor området**: `bg-brand-beige border-brand-dark/10 text-brand-dark/40 cursor-not-allowed`. Skiller seg klart fra aktive (mørkere bakgrunn, ingen hvit boks).
- "I dag"-pillen: byttes fra `text-brand-dark/60` til `text-brand-dark` — alle små labels skal minst på `/70` for å oppfylle AA på liten tekst.
- Ukelabels og ukedager (`ma`, `ti`, …, `denne uken`, `uke 21`): `text-brand-dark/70` + `font-medium` (i dag `/60` font-light — under AA på 12px).

**Pilknapper (linjer ~963–993)**
- Aktiv: alltid `bg-brand-dark text-brand-light border-brand-dark` (samme stil for venstre og høyre når aktiv).
- Disabled: `bg-brand-beige border-brand-dark/15 text-brand-dark/30`.
- Aldri en aktiv knapp som bare er outline — ujevnt og lav kontrast.

**Tidslot-blokk (linjer ~1087+)**
- Container: `bg-brand-beige`.
- Slot-knapp hvile: `bg-white border-brand-dark/20`.
- Hover: `border-brand-dark`.
- Valgt: `bg-brand-dark text-brand-light`.
- "Ingen ledige timer"-fallback: får ikke vises på default-dagen lenger (rettet av §1). Kortet beholdes for tilfeller der bruker manuelt klikker en tom dag, men teksten endres til stor forbokstav (se §3).

**Bekreftelses-/skjemaseksjon (linjer ~1170–1220)**
- Inputs: `bg-white border-brand-dark/20 text-brand-dark placeholder:text-brand-dark/50`.
- Hjelpetekst: `text-brand-dark/70`.

**Generelt**
- Erstatt alle `text-foreground`/`text-muted-foreground` i `BookingDemo.tsx` med `text-brand-dark` / `text-brand-dark/70`. Dagens default-tema gir grå mot beige — for lav kontrast.
- Min-størrelse på all tekst i bookingen: 12px (allerede regelen, men vi sjekker `text-[10px]`/`text-[11px]` og bumper til `text-xs` der nødvendig).

## 3. Konsekvent capitalisering — stor forbokstav overalt i booking

Regel: stor forbokstav på første ord i hver label/overskrift. Skal gjelde hele bookingreisen.

Konkrete steder:

| Linje | Nå | Skal være | Fix |
|------|----|-----------|-----|
| 611 | step-label `capitalize` | "Steg X av 5 · Tjeneste/Klinikk/…" | sikre kildedata starter med stor bokstav |
| 957 | `velg en dag` (`lowercase` tvunget) | Velg en dag | fjern `lowercase` |
| 1000–1006 | `ma ti on to fr` | Ma · Ti · On · To · Fr | fjern `lowercase` |
| 1024 | `denne uken` | Denne uken | fjern `lowercase` |
| 1025 | `uke 21` | Uke 21 | fjern `lowercase` |
| 1033 | ukelabel `lowercase` klasse | — | fjern `lowercase` |
| 1069–1072 | `i dag` | I dag | fjern `lowercase` |
| 1093 | `velg en tid` | Velg en tid | fjern `lowercase` |
| 1100 | varighet med `lowercase` | "Varighet 30 minutter" | fjern `lowercase`, kapitaliser |
| Andre | "Ingen ledige timer denne dagen" / "Prøv en annen dag…" | — | allerede ok |

Søk og fjern alle `lowercase`-Tailwind-klasser i `BookingDemo.tsx`. `capitalize` beholdes kun på datoformatering der `date-fns nb` returnerer småskrevne månedsnavn ("11. mai" → "11. Mai").

Sjekk også for `lowercase`-klasser i:
- `src/components/booking/CallUsClinicPicker.tsx`
- `src/components/booking/FriendlyEmpty.tsx`
- `src/components/clinic/ClinicBookingBlock.tsx`

## Tekniske detaljer

```text
src/pages/BookingDemo.tsx
├── helpers (top of file)
│   └── getFirstAvailableDate(from, specialist)            ← ny
├── useEffect [bookingData.specialist, bookingData.service, currentStep]
│   └── set selectedDate + rangeStart                       ← ny
├── render Step 1 (Tjeneste)
│   └── kort: bg-white border-brand-dark/20, font-medium overskrift
├── render Step 4 (Tid)
│   ├── kalender: dato-knapp border /25, disabled bg-brand-beige
│   ├── pilknapper: aktiv = mørk solid, disabled = beige outline
│   ├── tidsslot: bg-white border /20, valgt = mørk solid
│   └── alle labels: stor forbokstav, /70 opacity-min
└── render Step 5 (Bekreft)
    └── inputs: bg-white border /20, text-brand-dark
```

WCAG-sjekk på de nye kombinasjonene:
- `text-brand-dark` (#42332A) på `bg-white` → 12.6:1 (AAA).
- `text-brand-dark/70` på `bg-brand-beige` (~#E8DFD3) → ~7:1 (AAA på normal tekst).
- `text-brand-light` på `bg-brand-dark` (selected) → ~11:1 (AAA).
- `text-brand-dark/40` (disabled) — kun dekorativt, ikke kritisk informasjon (dato-tall som uansett ikke kan klikkes), så unntatt fra AA-kravet.

## Out of scope
- Ekte ledighetsdata (fortsatt mock via `generateTimeSlots`).
- Helger i kalenderen (forblir kun ma–fr).
- Endringer på andre sider enn booking.
