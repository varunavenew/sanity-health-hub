## Mål

Alle ~60 undertjenester skal følge Fertilitet-malen (samme strukturelle sections: hero → segments → flow → reasons → promises → related → CTA), med modulære sections som brukes der det gir mening. Innholdet hentes fra `CMedical_innhold_Lovable-7.md`, bildene fra Dropbox-mappen.

## Infrastruktur som allerede finnes

- `SubTreatmentLayout.tsx` — rik master-layout med flow, reasons, promises, expertAreas, textSection, related, CTA, specialists, insurance, FAQ. Brukes allerede av gynekologi/undersokelse og driver alle generiske undersider via `GenericSubTreatmentPage`.
- `treatmentToSubLayout.tsx` — adapter fra `TreatmentData` → `SubTreatmentContent`.
- `treatmentContent.ts` — sentralt datalager (~1700 linjer) som allerede dekker mange undersider, men med tynt innhold.

**Beslutning:** Behold dataarkitekturen. Jeg fyller `treatmentContent.ts` med rikt innhold fra dokumentet og kobler på riktige bilder per slug. Bespoke `.tsx`-sider (Sleeve, Ernæringsfysiolog) beholdes som de er — resten kjøres via den generiske ruten med rikere data. Resultat: alle 60 sider får master-layouten, men hver side er unik på innhold/bilder.

## Runde 1 — Fundament (denne meldingen)

1. Last opp alle 63 Dropbox-bilder som Lovable Assets (én `.asset.json` per bilde under `src/assets/services/`).
2. Bygg `src/data/serviceImages.ts` — en `Record<slug, { url, alt }>` som mapper hver tjenesteslug til sitt bilde. Inkluderer både kategori-hero (Hero_*.jpg) og undertjeneste-bilder.
3. Utvid `treatmentToSubLayout.tsx` til å plukke `heroImage` fra `serviceImages` når `data.heroImage` mangler — så all bildelogikk er sentralisert.
4. Verifiser med eksisterende ruter (Urologi → Prostata, Gynekologi → Endometriose) at bildene kommer fram.

Leverer: bilde-manifest + bilder synlige på eksisterende generiske sider.

## Runde 2 — Innhold per kategori (etter godkjenning)

Bygg ut `treatmentContent.ts` med rik tekst fra dokumentet, én kategori om gangen. For hver undertjeneste fylles:

- `description` — brødtekst fra dokumentet
- `sections` — H4/H5-blokker (Symptomer, Diagnose, Behandling, Etter behandling)
- `process` — tre steg når relevant (kirurgi/utredning)
- `benefits` — bullet-liste fra dokumentet
- `faqs` — egne FAQ-er der dokumentet har dem, ellers standard CMedical-FAQ
- `relatedSpecialists` — slugs basert på spesialist-koblingene i dokumentet
- `linkedServices` — søsken-tjenester i samme kategori

Rekkefølge (én runde per kategori, godkjenn mellom):

1. **Urologi** (9): Blære og urinveier, Forhud, Mannlig infertilitet, Nyrer, Prostata, Refertilisering, Robotassistert kirurgi, Sterilisering, Testikler og pung
2. **Gynekologi** (18): Blødningsforstyrrelser, Celleforandringer, Cyster, Endometriose, Fjerne livmor, Fødselsskader, Fostermedisin, Graviditet, Gynekologisk kirurgi, Hysteroskopi, Labiaplastikk, NIPT, Overgangsalder, PCOS, PMS/PMDD, Robotassistert, Spontanabort, Urinlekkasje, Vaginale fremfall, Vulvalidelser *(de eksisterende «godkjent copy»-sidene rører jeg ikke)*
3. **Fertilitet** (9): IVF, IUI, Eggdonasjon, Nedfrysing, PGT, Mannlig fertilitet, Psykisk helsehjelp, Fertilitetssjekk, Donorbehandling
4. **Ortopedi** (5): Fot/ankel, Hånd/albue, Hofte, Kne, Skulder
5. **Flere fagområder** (12): Åreknute, Endokrinologi, Gastrokirurgi, Hudlege, Osteopati, Plastikkirurgi, Psykologi, Revmatologi, Sexologi, Bariatrisk-klyngen (Sleeve+Ernæring finnes alt)

## Runde 3 — Polish

- Kategori-landingssider (UrologiPage, OrtopediPage, etc.) får oppdatert hero-bilder fra Hero_*.jpg.
- Sjekke at related-cards mellom søsken-tjenester i samme kategori peker riktig.
- SEO-titles, meta-descriptions og JSON-LD per side.

## Hva jeg IKKE rører

- Eksisterende «godkjent copy»-sider: `/behandlinger/gynekologi`, `/behandlinger/fertilitet`, `/behandlinger/fertilitet/fertilitetssjekk`, `/behandlinger/gynekologi/undersokelse` (kun bilde-bytte hvis du ber om det).
- Sleeve-siden og Ernæringsfysiolog-siden (bygget bespoke i forrige runde).
- Spesialistdata (DEL 2 av dokumentet) — egen runde senere hvis du vil.

## Teknisk

```text
src/
  assets/services/
    urologi-prostata.jpg.asset.json         (63 stk totalt)
    ...
  data/
    serviceImages.ts        ← NY: slug → { url, alt }
    treatmentContent.ts     ← UTVIDET med rik tekst
  lib/
    treatmentToSubLayout.tsx ← liten fallback til serviceImages
```

Si JA så starter jeg Runde 1 nå.