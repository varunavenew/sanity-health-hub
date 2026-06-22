## Mål

Bytte ut omskrevet brødtekst på 15 behandlingssider med originalteksten fra cmedical.no (klinikkens egen tekst), uten å endre design, layout eller komponenter. Hero-seksjonene beholdes som i dag.

Eierskap dokumenteres som notat i `README.md` (Alternativ 1) før innholdet skrives inn, slik at det er tydelig at klinikken eier og leverer originalen.

## Omfang per side

### A) Hopp over (allerede ~identiske med originalen)
- `/behandlinger/urologi/blaere`
- `/behandlinger/urologi/prostata`

### B) Erstatt brødtekst ordrett (behold dagens hero/intro)
Disse ligger allerede i `src/data/treatmentContent.ts` med `sections[]`. Jeg bytter ut innholdet i hver `sections[i].content` (og evt. `description` hvis den brukes som lang prose under hero) mot originalteksten — distinkte fete tilstander legges som egne accordion-seksjoner der siden allerede bruker accordion.

- `/behandlinger/gynekologi/celleforandringer`
- `/behandlinger/gynekologi/robotkirurgi`
- `/behandlinger/gynekologi/undersokelse` *(merk: ligger i `gynekologiSubPages.tsx` i dag — se C)*
- `/behandlinger/gynekologi/vaginale-fremfall`
- `/behandlinger/gynekologi/cyster`
- `/behandlinger/ortopedi/hofte`
- `/behandlinger/ortopedi/kne`
- `/behandlinger/ortopedi/skulder`
- `/behandlinger/flere-fagomrader/areknuter`
- `/behandlinger/flere-fagomrader/endokrinologi`
- `/behandlinger/flere-fagomrader/plastikkirurgi`
- `/behandlinger/flere-fagomrader/revmatologi`

### C) Migrer fra `gynekologiSubPages.tsx` → `treatmentContent.ts`
Disse bruker i dag `heroDescription` + `reasons[]`-kort og har ikke felt for lang prose. Jeg flytter dem til samme struktur som de øvrige gynekologi-oppføringene i `treatmentContent.ts` (med `description` + `sections[]`), beholder hero/ingress-teksten som `description`/hero, og legger originalteksten som prose i `sections[]`. `GynekologiSubPage.tsx` har allerede fallback-rekkefølge `treatmentContent` → `gynekologiSubPages`, så ingen routing-endring trengs.

- `/behandlinger/gynekologi/pcos`
- `/behandlinger/gynekologi/pms-pmdd`
- `/behandlinger/gynekologi/fostermedisin`
- `/behandlinger/gynekologi/nipt`
- `/behandlinger/gynekologi/undersokelse` *(samme migrering)*

Når en oppføring finnes i `treatmentContent`, fjernes den tilsvarende oppføringen fra `gynekologiSubPages.tsx` for å unngå duplikat-vedlikehold.

### D) Tverrfaglig team — samleområde
`/behandlinger/gynekologi/tverrfaglig` finnes allerede i `treatmentContent.ts` med riktig struktur.

- `sections[0].content` (`alt-pa-ett-sted`) erstattes med originalens «Om»-tekst (ordrett).
- Medlemmene (Osteopat, Sexolog, Psykolog, Ernæringsfysiolog) vises som bilde-kort som lenker videre. `linkedServices` har dem allerede som lenker uten bilde — jeg utvider de fire oppføringene med `image`-feltet (eksisterende `LinkedService.image` støtter dette), slik at de rendres som bilde-kort i samme «Flere fagområder»-stil. Bildene hentes fra eksisterende spesialist-/kategori-assets; ingen nye bilder genereres med mindre passende ikke finnes.

## Tekniske detaljer

- Filer som endres:
  - `src/data/treatmentContent.ts` — innholds-erstatninger + nye oppføringer for `gynekologi/pcos`, `pms-pmdd`, `fostermedisin`, `nipt`, `undersokelse`.
  - `src/data/gynekologiSubPages.tsx` — fjern de fem nevnte oppføringene.
  - `README.md` — kort eierskaps-notat (Alternativ 1).
- Ingen endringer i komponenter, ruter, priser, lenker eller menyer.
- Markdown-konvensjonen som allerede brukes i `ContentSection.content` (`**bold**`, `\n\n` mellom avsnitt, `- ` for lister) gjenbrukes for originalteksten.
- Fete underoverskrifter i originalen som er distinkte tilstander (f.eks. «Blod i urinen», «Vannlatningsproblemer» osv.) splittes ut som egne `sections[]` slik at de havner i accordion der siden allerede bruker accordion.
- Hero-intro endres ikke. Hvis originalens første avsnitt allerede står i hero, utelates det fra brødteksten for å unngå dobling.

## Leveranse / kjøreplan

Jeg gjør én side om gangen i denne rekkefølgen for å holde diff-ene oversiktlige:
1. README-notat
2. Tverrfaglig team (D) — minst tekst, validerer bilde-kort-flyten
3. Migrering C (undersokelse, pcos, pms-pmdd, fostermedisin, nipt)
4. Gynekologi B (celleforandringer, robotkirurgi, vaginale-fremfall, cyster)
5. Ortopedi B (hofte, kne, skulder)
6. Flere fagområder B (areknuter, endokrinologi, plastikkirurgi, revmatologi)

Etter hver gruppe verifiserer jeg build.

## Spørsmål før jeg starter

1. **Bilder for Tverrfaglig team-kortene** — skal jeg bruke eksisterende spesialist-portrettbilder for hver disiplin (hvis tilgjengelig), generiske kategori-bilder, eller generere nye?
2. **`/behandlinger/gynekologi/undersokelse`** — denne har i dag en rik, kuratert layout (heroPoints, flow, promises) i `gynekologiSubPages.tsx`. Ved migrering til `treatmentContent`-strukturen mister vi den layouten. Vil du heller at jeg her *kun* legger originalteksten inn som ny prose-seksjon i den eksisterende fila (f.eks. via et nytt `prose`-felt på `SubTreatmentContent`) og lar resten stå?
