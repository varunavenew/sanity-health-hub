## Endringer fra kundetilbakemelding

Forslag til hvordan vi løser hvert punkt. Si fra hvis noe skal endres eller droppes — så implementerer jeg alt i én runde.

### Robotkirurgi
Filer: `src/pages/themes/RobotkirurgiPage.tsx` (siden `/robotassistert-kirurgi`) og `src/data/gynekologiSubPages.tsx` (siden `/behandlinger/gynekologi/robotkirurgi`).

1. **Sykmeldingslengde 2–6 uker.** Endre "2–3 uker" → "2–6 uker" og legge til en setning om at RALP (prostatakreft) typisk ligger i øvre del av spennet (4–6 uker).
2. **Safe Histology Surgery.** Legge til et nytt kort avsnitt under "Presisjon som merkes" som forklarer hva Safe Histology Surgery er og hvorfor det er viktig (mer presis vevsdiagnostikk, tryggere reseksjon). Jeg trenger en kort kunde-tekst eller godkjenner at jeg formulerer et nøytralt avsnitt selv.
3. **Våre robotkirurger — Bjørn Brennhovd, Nicolai Wessel og Thomas Thaulow.** Legge til en seksjon "Våre robotkirurger" (samme format som "Vår karkirurg" på åreknuter) med kort bio. Jeg trenger bio-tekstene fra kunden, eller jeg skriver utkast basert på offentlig info som de godkjenner.

### Ortopedi (`src/data/treatmentContent.ts` + ev. sub-page-data)
4. **Hånd & albue:** Fjerne PRP fra Oslo-tilbudet (kun Faust). Legge til seksjon "Våre spesialister" med info om at de jobber i to-spann ved avansert kirurgi (navn fra kunde).
5. **Fot & ankel:** Fremheve MIS og MICA (minimalt invasiv kirurgi) tydelig.
6. **Hofte:** Få frem at vi gjør mer enn vanlig hofteskopi (f.eks. tenodese). Legge til "Vår spesialist" Warholm med bio.
7. **Kne:** Tone ned artrose/protese (vi gjør ikke protesekirurgi). Løfte frem korsbånd og menisk. Legge til Marc som "Vår spesialist" med bio.

### Urologi — Nyrer (`src/pages/treatments/UrologiPage.tsx` / sub-page)
8. Fjerne nyrestein, erstatte med blærestein.
9. Legge til nefrektomi (presisere at det ikke kun gjelder nyrekreft).

### Gynekologi — Robotkirurgi
10. Thomas Thaulow med info — dekkes av punkt 3 over.

### Det jeg trenger fra deg før implementering
- Bio-tekst (eller OK til å skrive utkast) for: Brennhovd, Wessel, Thaulow, Warholm, Marc, og hånd/albue-spesialistene.
- Kort beskrivelse av Safe Histology Surgery slik dere ønsker det formulert, eller OK til at jeg skriver et nøytralt utkast.
- Bekreftelse på at sykmelding skal stå som "2–6 uker (4–6 uker ved RALP)".

Si fra hva du har av tekst, så implementerer jeg alt samlet.
