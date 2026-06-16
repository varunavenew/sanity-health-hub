import React from "react";
import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";

const parent = { name: "Fertilitet", path: "/fertilitet" };
const baseBooking = { kategori: "fertilitet" as const };

const standardPromises = [
  {
    eyebrow: "Trygghet",
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stille spørsmål underveis og ta med deg noen om du ønsker det.",
  },
  {
    eyebrow: "Kompetanse",
    title: "Spesialister med dybde",
    desc: "Hos oss møter du leger og embryologer med erfaring fra ledende fertilitetssentre — ikke en generalist på utplassering.",
  },
  {
    eyebrow: "Helhet",
    title: "Alt under samme tak",
    desc: "Konsultasjon, laboratorium og behandling i samme bygg. Vi koordinerer hele forløpet — ingenting forsvinner mellom sprekker.",
  },
];

export const fertilitetSubPages: Record<string, SubTreatmentContent> = {
  /* ───────────────────────── FERTILITETSSJEKK ───────────────────────── */
  fertilitetssjekk: {
    seoTitle: "Fertilitetssjekk | CMedical — forstå fruktbarheten din",
    seoDescription:
      "Fertilitetssjekk uten henvisning. Hormoner, ultralyd og sædanalyse — du får et klart bilde av hvor du står på under en uke.",
    canonical: "/behandlinger/fertilitet/fertilitetssjekk",
    parent,
    title: "Fertilitetssjekk",
    eyebrow: "Fertilitet — CMedical",
    heroTitle: <>Forstå <span className="italic">fruktbarheten</span> din</>,
    heroDescription:
      "En fertilitetssjekk gir deg et klart bilde av hvor du står. Ikke fordi noe nødvendigvis er galt — men fordi du fortjener gode svar. Vi tar blodprøver, ultralyd og en grundig samtale med spesialist.",
    heroPoints: [
      { title: "Antall follikler (AFC)", desc: "Ultralyd som teller dine egganlegg — eggstokkreserven." },
      { title: "AMH — eggstokkreserven", desc: "Blodprøve som sier noe om din fertilitetsprofil." },
      { title: "Hormonstatus", desc: "FSH, LH, østrogen og andre relevante hormoner." },
      { title: "Vurdering av livmor og eggstokker", desc: "Gjennomgang for å avdekke struktur og sykdom." },
      { title: "Samtale med fertilitetsspesialist", desc: "Gjennomgang av funn og veien videre." },
    ],
    rating: "4,8 — Norges eldste private fertilitetsklinikk",
    booking: { ...baseBooking, tjeneste: "fertilitetssjekk" },
    primaryCtaLabel: "Bestill fertilitetssjekk",
    flowEyebrow: "Innholdet i sjekken",
    flowTitle: "Det vi kartlegger — og hva det betyr for deg",
    flow: [
      { n: "01", title: "Eggstokkreserve (AMH)", desc: "AMH er et hormon som sier noe om hvor mange egganlegg du har igjen — en indikator på fruktbarhetsvinduet ditt." },
      { n: "02", title: "Antall follikler (AFC)", desc: "Med ultralyd teller vi antall småfollikler — sammen med AMH gir dette et godt bilde av eggstokkreserven." },
      { n: "03", title: "Hormonstatus", desc: "Vi tar blodprøver for FSH, LH, østrogen og andre relevante hormoner som påvirker eggløsning og graviditet." },
      { n: "04", title: "Anatomisk vurdering", desc: "Vi ser på livmorens form og størrelse via ultralyd og fanger opp polypper eller myomer som kan påvirke fruktbarheten." },
      { n: "05", title: "Samtale med spesialist", desc: "Du møter en fertilitetsspesialist som gjennomgår alle funn med deg — og legger en plan om noe bør følges opp." },
      { n: "06", title: "Individuell plan", desc: "Basert på funnene setter vi opp det som er aktuelt: 'vil følge opp' eller 'her er neste behandling'." },
    ],
    reasonsEyebrow: "Hva får du ut av en fertilitetssjekk",
    reasonsTitle: "En sjekk gir deg svar — ikke nødvendigvis problemer",
    reasonsLead:
      "Mange tror en fertilitetssjekk er noe man gjør først når man har prøvd lenge og noe er galt. Slik er det ikke. En sjekk er rett og slett en kartlegging av fruktbarheten din — slik at du vet hva du har å forholde deg til.",
    reasonsLead2:
      "Vi ser på eggstokkreserven din (AMH), teller egganlegg via ultralyd (AFC) og tar en rekke hormoner. Etter konsultasjonen sitter du igjen med konkret informasjon — og en spesialist som forklarer hva det betyr for deg.",
    reasons: [
      { n: "01", title: "Planlegger å få barn — men ikke i dag", desc: "Du vil vite hva du har å forholde deg til før du tar valget." },
      { n: "02", title: "Har prøvd 6–12 måneder uten å bli gravid", desc: "En sjekk er det naturlige neste steget for å finne årsak." },
      { n: "03", title: "Vurderer å fryse eggene dine", desc: "Sjekken viser om du er i et godt vindu for nedfrysing." },
      { n: "04", title: "Har uregelmessig syklus eller hormonell ubalanse", desc: "PCOS, endometriose og andre tilstander påvirker fruktbarheten." },
      { n: "05", title: "Er mann og vil sjekke din del av bildet", desc: "Vi tilbyr sædanalyse — en enkel og rask test." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Behandling", title: "IVF — prøverørsbehandling", desc: "Hvis du har behov for hjelp på veien, er IVF den vanligste behandlingen vi tilbyr.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Behandling", title: "IUI — inseminasjon", desc: "Et enklere første steg når årsaken er mild — eller når du ønsker donor.", href: "/behandlinger/fertilitet/iui" },
      { eyebrow: "Mulighet", title: "Nedfrysing av egg", desc: "Gir deg tid. Vi forklarer når det er riktig — og hva det innebærer.", href: "/behandlinger/fertilitet/nedfrysing" },
    ],
    ctaTitle: "Klar til å finne ut hvor du står?",
    ctaDescription:
      "Bestill fertilitetssjekk direkte — ingen ventetid, ingen henvisning. Eller ta en gratis og uforpliktende prat med sykepleier om du er usikker på hva du trenger.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── IVF ───────────────────────── */
  ivf: {
    seoTitle: "IVF — prøverørsbehandling | CMedical",
    seoDescription:
      "IVF og ICSI ved Norges eldste private fertilitetsklinikk. Trygt, moderne laboratorium og spesialister som følger deg gjennom hele forløpet.",
    canonical: "/behandlinger/fertilitet/ivf",
    parent,
    title: "IVF",
    eyebrow: "Behandling — CMedical",
    heroTitle: <>Når kroppen trenger litt <span className="italic">hjelp</span> på veien</>,
    heroDescription:
      "IVF — prøverørsbehandling — er den mest effektive fertilitetsbehandlingen som finnes. Vi har gjort det siden 1989 og fulgt over 3 800 barn inn i verden. Du møter samme team gjennom hele forløpet.",
    heroPoints: [
      { title: "Klinikk og laboratorium under samme tak", desc: "Ingen transport av egg eller embryo — alt skjer hos oss." },
      { title: "ICSI når det trengs", desc: "Mikroinjeksjon ved nedsatt sædkvalitet eller tidligere mislykkede forsøk." },
      { title: "Erfaring siden 1989", desc: "Norges eldste private fertilitetsklinikk." },
      { title: "Tett oppfølging hele veien", desc: "Du møter samme team — fra første samtale til graviditetstest." },
    ],
    rating: "42% suksessrate IVF — kvinner under 35 år",
    booking: { ...baseBooking, tjeneste: "ivf" },
    primaryCtaLabel: "Bestill IVF-konsultasjon",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik gjennomføres en IVF-syklus",
    flow: [
      { n: "Steg 01", title: "Konsultasjon og plan", desc: "Vi går gjennom utredningen, legger en behandlingsplan og forklarer hva du kan forvente." },
      { n: "Steg 02", title: "Hormonstimulering", desc: "Du tar daglige sprøyter i ca. 10–14 dager. Vi følger med på utviklingen via ultralyd og blodprøver." },
      { n: "Steg 03", title: "Egguthenting", desc: "Et kort dagkirurgisk inngrep i lett narkose. Du er hjemme samme dag." },
      { n: "Steg 04", title: "Befruktning og kultur", desc: "Embryologene befrukter eggene — IVF eller ICSI — og dyrker embryoene i laboratoriet i 3–5 dager." },
      { n: "Steg 05", title: "Embryooverføring", desc: "Det beste embryoet settes tilbake i livmoren. Et enkelt og smertefritt inngrep." },
      { n: "Steg 06", title: "Venting og test", desc: "To ukers venting før graviditetstest. Vi følger deg tett gjennom hele perioden." },
    ],
    reasonsEyebrow: "Når er IVF aktuelt",
    reasonsTitle: "Hvem passer IVF for?",
    reasonsLead:
      "IVF er ikke alltid første steg, men det er ofte det mest effektive. Behandlingen passer for mange — og vi vurderer alltid det enkleste alternativet først.",
    reasons: [
      { n: "01", title: "Tette eller skadede eggledere", desc: "Når egget ikke kan møte sæden naturlig, er IVF løsningen." },
      { n: "02", title: "Nedsatt sædkvalitet", desc: "Kombinert med ICSI gir IVF gode muligheter også ved få og lite bevegelige sædceller." },
      { n: "03", title: "Endometriose eller PCOS", desc: "Tilstander som påvirker eggløsning eller livmorhelse." },
      { n: "04", title: "Uforklart infertilitet", desc: "Når utredning ikke viser klar årsak, er IVF ofte veien videre." },
      { n: "05", title: "Tidligere mislykkede behandlinger", desc: "Hvis IUI eller andre behandlinger ikke har gitt resultat." },
      { n: "06", title: "Aleneforeldre eller likekjønnede par", desc: "IVF med donorsæd eller donoregg." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk", desc: "Det naturlige første steget — vi finner årsaken før vi behandler.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
      { eyebrow: "Alternativ", title: "IUI — inseminasjon", desc: "En enklere behandling som ofte prøves først ved milde årsaker.", href: "/behandlinger/fertilitet/iui" },
      { eyebrow: "Tilleggstest", title: "Genetisk testing (PGT)", desc: "Genetisk vurdering av embryoene før overføring — for utvalgte indikasjoner.", href: "/behandlinger/fertilitet/pgt" },
    ],
    ctaTitle: "Bestill IVF-konsultasjon",
    ctaDescription:
      "Vi tar deg gjennom alle alternativer — uten henvisning og uten ventetid. Du betaler ikke for samtalen før du vet om IVF er riktig for deg.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── IUI ───────────────────────── */
  iui: {
    seoTitle: "IUI — inseminasjon | CMedical",
    seoDescription:
      "Inseminasjon (IUI) med partner eller donor. En skånsom og enkel fertilitetsbehandling — ofte det første steget.",
    canonical: "/behandlinger/fertilitet/iui",
    parent,
    title: "IUI — inseminasjon",
    eyebrow: "Behandling — CMedical",
    heroTitle: <>Den <span className="italic">enkleste</span> veien — når den passer</>,
    heroDescription:
      "Inseminasjon (IUI) er en skånsom fertilitetsbehandling der bearbeidet sæd plasseres direkte i livmoren rundt eggløsning. Det er ofte det første steget — og passer mange par, single og likekjønnede par.",
    heroPoints: [
      { title: "Ingen narkose, ingen kirurgi", desc: "En kort, smertefri prosedyre på klinikken." },
      { title: "Med partnersæd eller donor", desc: "Vi har egen sædbank med kvalitetssikret donor­sæd." },
      { title: "Skånsom hormonstimulering", desc: "Mild stimulering for å øke sjansen — eller naturlig syklus." },
      { title: "Rask og enkel oppfølging", desc: "Få besøk på klinikken — og vi følger deg tett underveis." },
    ],
    rating: "4,7 — Norges eldste private fertilitetsklinikk",
    booking: { ...baseBooking, tjeneste: "iui" },
    primaryCtaLabel: "Bestill IUI-samtale",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik foregår en IUI-behandling",
    flow: [
      { n: "Steg 01", title: "Konsultasjon", desc: "Vi går gjennom utredning, sykluskontroll og om IUI er rett behandling for deg." },
      { n: "Steg 02", title: "Mild stimulering", desc: "Tabletter eller lave doser hormoner for å støtte eggløsningen — etter vurdering." },
      { n: "Steg 03", title: "Eggløsningskontroll", desc: "Ultralyd for å bekrefte at egget er klart for befruktning." },
      { n: "Steg 04", title: "Inseminasjon", desc: "Bearbeidet sæd plasseres direkte i livmoren — en kort, smertefri prosedyre." },
      { n: "Steg 05", title: "Oppfølging", desc: "Graviditetstest etter ca. to uker — vi følger deg tett gjennom ventetiden." },
    ],
    reasonsEyebrow: "Når er IUI aktuelt",
    reasonsTitle: "Hvem passer IUI for?",
    reasonsLead:
      "IUI er ofte det første behandlingssteget når årsaken til ufrivillig barnløshet er mild — og når egglederne er åpne.",
    reasons: [
      { n: "01", title: "Mild nedsatt sædkvalitet", desc: "Når det er nok bevegelig sæd til at IUI gir god sjanse." },
      { n: "02", title: "Single som ønsker barn", desc: "IUI med donorsæd er ofte det enkleste første steget." },
      { n: "03", title: "Likekjønnede kvinnelige par", desc: "Donorinseminasjon — vi følger dere trygt fra første samtale." },
      { n: "04", title: "Eggløsningsforstyrrelser", desc: "Mild stimulering kombinert med IUI kan gi god effekt." },
      { n: "05", title: "Uforklart infertilitet", desc: "Som første behandlingsforsøk før vi vurderer IVF." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Behandling", title: "IVF", desc: "Hvis IUI ikke gir resultat, er IVF det neste naturlige steget.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Mulighet", title: "Eggdonasjon", desc: "Hvis dine egne egg ikke er et alternativ.", href: "/behandlinger/fertilitet/eggdonasjon" },
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk", desc: "Forstå hvor du står før du velger behandling.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
    ],
    ctaTitle: "Bestill IUI-samtale",
    ctaDescription:
      "Du trenger ikke henvisning. Vi tar oss tid til å forklare alt — og vurderer alltid det enkleste alternativet først.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── EGGDONASJON ───────────────────────── */
  eggdonasjon: {
    seoTitle: "Eggdonasjon | CMedical — Norges nyeste eggbank",
    seoDescription:
      "Eggdonasjon ved CMedical — Norges nyeste eggbank. Trygg, åpen og regulert prosess med tett oppfølging hele veien.",
    canonical: "/behandlinger/fertilitet/eggdonasjon",
    parent,
    title: "Eggdonasjon",
    eyebrow: "Behandling — CMedical",
    heroTitle: <>Når svaret ligger i en <span className="italic">annen</span> celle</>,
    heroDescription:
      "Eggdonasjon er en trygg og regulert behandling — og for mange den eneste muligheten til å bli gravid. Vi har Norges nyeste eggbank, og du møter et team som har gjort dette siden ordningen ble lovlig.",
    heroPoints: [
      { title: "Norges nyeste eggbank", desc: "Et bredt utvalg av kvalitetssikrede donorer." },
      { title: "Trygg og regulert prosess", desc: "Behandlingen følger norsk lov og våre etiske retningslinjer." },
      { title: "Spesialister med erfaring", desc: "Vi har gjennomført eggdonasjon siden ordningen ble innført i Norge." },
      { title: "Psykologisk støtte hele veien", desc: "Egne samtaler er en del av forløpet — for deg og din partner." },
    ],
    rating: "4,8 — Trygt og åpent",
    booking: { ...baseBooking, tjeneste: "eggdonasjon" },
    primaryCtaLabel: "Bestill samtale om eggdonasjon",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik foregår eggdonasjon hos oss",
    flow: [
      { n: "Steg 01", title: "Førstegangssamtale", desc: "Vi forklarer hele prosessen, hva loven sier og hva som er aktuelt for dere." },
      { n: "Steg 02", title: "Medisinsk utredning", desc: "Vi sikrer at livmoren og kroppen er klar for graviditet." },
      { n: "Steg 03", title: "Donorvalg", desc: "Du får tilgang til et utvalg av donorer — vi hjelper deg gjennom valget." },
      { n: "Steg 04", title: "Behandling og overføring", desc: "Donoregg befruktes med partner- eller donorsæd. Embryoet overføres til livmoren." },
      { n: "Steg 05", title: "Oppfølging", desc: "Tett medisinsk og psykologisk oppfølging gjennom hele forløpet — også etter graviditetstest." },
    ],
    reasonsEyebrow: "Når er eggdonasjon aktuelt",
    reasonsTitle: "Hvem passer eggdonasjon for?",
    reasonsLead:
      "Eggdonasjon kan være riktig løsning når egne egg ikke gir resultat — eller ikke er et alternativ. Vi tar alle samtaler trygt og uten press.",
    reasons: [
      { n: "01", title: "Lav eggstokkreserve", desc: "Når AMH og AFC er lave, og IVF med egne egg ikke har gitt resultat." },
      { n: "02", title: "Tidlig overgangsalder", desc: "Når menstruasjonen har stoppet før normal alder." },
      { n: "03", title: "Genetiske årsaker", desc: "Når man bærer en arvelig sykdom man ikke ønsker å gi videre." },
      { n: "04", title: "Gjentatte mislykkede IVF-forsøk", desc: "Når flere IVF-runder med egne egg ikke har lyktes." },
      { n: "05", title: "Etter kreftbehandling", desc: "Når cellegift eller stråling har redusert eggreserven." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Behandling", title: "IVF", desc: "Eggdonasjon kombineres alltid med IVF-prosess.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Mulighet", title: "Nedfrysing av egg", desc: "Hvis du ønsker å bevare egne egg for fremtiden.", href: "/behandlinger/fertilitet/nedfrysing" },
      { eyebrow: "Støtte", title: "Psykisk helsehjelp", desc: "Samtaler er en viktig del av et donor­forløp.", href: "/behandlinger/fertilitet/psykisk-helsehjelp" },
    ],
    ctaTitle: "Snakk med oss om eggdonasjon",
    ctaDescription:
      "Det er en stor avgjørelse. Vi tar oss tiden som trengs — og du er aldri alene i prosessen.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── NEDFRYSING ───────────────────────── */
  nedfrysing: {
    seoTitle: "Nedfrysing av egg, sæd og embryo | CMedical",
    seoDescription:
      "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
    canonical: "/behandlinger/fertilitet/nedfrysing",
    parent,
    title: "Nedfrysing av egg",
    eyebrow: "Mulighet — CMedical",
    heroTitle: <>Litt mer <span className="italic">tid</span> når du trenger det</>,
    heroDescription:
      "Nedfrysing av egg lar deg ta vare på fertiliteten din nå — uten å måtte ta valget om barn i dag. Vi tilbyr også nedfrysing av sæd og embryo, som del av eller utenfor en IVF-behandling.",
    heroPoints: [
      { title: "Egg, sæd og embryo", desc: "Vi fryser ned alt som kan være relevant for fremtiden din." },
      { title: "Moderne vitrifikasjonsmetode", desc: "Skånsom rask nedfrysing som beskytter cellene best mulig." },
      { title: "Trygg lagring i Norge", desc: "Lagring under streng kvalitetskontroll på vår klinikk." },
      { title: "Riktig informasjon før du velger", desc: "Vi forklarer realistiske sjanser, kostnader og tidsperspektiv." },
    ],
    rating: "4,7 — Norges eldste private fertilitetsklinikk",
    booking: { ...baseBooking, tjeneste: "nedfrysing" },
    primaryCtaLabel: "Bestill samtale om nedfrysing",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik foregår nedfrysing av egg",
    flow: [
      { n: "Steg 01", title: "Samtale og fertilitetssjekk", desc: "Vi vurderer eggstokkreserven din og om nedfrysing gir mening i din situasjon." },
      { n: "Steg 02", title: "Hormonstimulering", desc: "Daglige sprøyter i 10–14 dager for å modne flere egg samtidig." },
      { n: "Steg 03", title: "Egguthenting", desc: "Et kort dagkirurgisk inngrep i lett narkose. Hjem samme dag." },
      { n: "Steg 04", title: "Nedfrysing og lagring", desc: "Eggene fryses ned med vitrifikasjon og lagres trygt på klinikken." },
      { n: "Steg 05", title: "Bruk når du er klar", desc: "Når du ønsker å bli gravid, tiner vi eggene og gjennomfører IVF." },
    ],
    reasonsEyebrow: "Når kan nedfrysing være riktig",
    reasonsTitle: "Hvem velger å fryse ned egg?",
    reasonsLead:
      "Det finnes mange gode grunner til å fryse ned egg. Det viktigste er at du tar valget basert på riktig informasjon — ikke press.",
    reasons: [
      { n: "01", title: "Du er ikke klar for barn ennå", desc: "Karriere, livssituasjon eller partner — ulike grunner, samme behov for tid." },
      { n: "02", title: "Lav eggstokkreserve i ung alder", desc: "Hvis sjekken viser at fertilitetsvinduet er kortere enn forventet." },
      { n: "03", title: "Før kreftbehandling", desc: "Cellegift kan redusere fruktbarhet — nedfrysing før behandling beskytter mulighetene." },
      { n: "04", title: "Genetiske eller medisinske årsaker", desc: "Tilstander som tidlig overgangsalder eller endometriose." },
      { n: "05", title: "Som del av en IVF-behandling", desc: "Overskuddsembryo og sæd lagres ofte for senere bruk." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk", desc: "Sjekken viser om du er i et godt vindu for nedfrysing.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
      { eyebrow: "Behandling", title: "IVF", desc: "Når du vil bruke eggene dine, går de inn i en IVF-prosess.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Mannlig", title: "Mannlig fertilitet", desc: "Vi fryser også ned sæd — før kreftbehandling eller annen indikasjon.", href: "/behandlinger/fertilitet/mannlig-fertilitet" },
    ],
    ctaTitle: "Snakk med oss om nedfrysing",
    ctaDescription:
      "Vi forklarer realistiske sjanser, hva prosessen innebærer og hva det koster — uten press, og uten ventetid.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── PGT ───────────────────────── */
  pgt: {
    seoTitle: "Genetisk testing (PGT) | CMedical",
    seoDescription:
      "Genetisk testing av embryoer (PGT) ved utvalgte indikasjoner. Vi forklarer mulighetene og begrensningene — uten å overselge.",
    canonical: "/behandlinger/fertilitet/pgt",
    parent,
    title: "Genetisk testing (PGT)",
    eyebrow: "Tilleggstest — CMedical",
    heroTitle: <>Trygghet <span className="italic">før</span> overføring</>,
    heroDescription:
      "PGT — preimplantasjonsgenetisk testing — undersøker embryoene før de settes tilbake i livmoren. Det er aktuelt ved utvalgte indikasjoner og kan øke sjansen for vellykket graviditet.",
    heroPoints: [
      { title: "PGT-A — kromosomtelling", desc: "Sjekk for normalt antall kromosomer i embryoet." },
      { title: "PGT-M — arvelig sykdom", desc: "For par som vet de bærer en spesifikk genetisk sykdom." },
      { title: "Internasjonalt samarbeid", desc: "Analysene gjøres ved akkrediterte laboratorier." },
      { title: "Realistisk rådgivning", desc: "Vi forklarer hva PGT kan — og ikke kan — gjøre for deg." },
    ],
    rating: "4,8 — Spesialister på fertilitet",
    booking: { ...baseBooking, tjeneste: "pgt" },
    primaryCtaLabel: "Bestill PGT-samtale",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik fungerer PGT i et IVF-forløp",
    flow: [
      { n: "Steg 01", title: "Genetisk veiledning", desc: "Vi går gjennom indikasjon, hva testen kan svare på og hva den ikke kan." },
      { n: "Steg 02", title: "IVF-syklus", desc: "Stimulering, egguthenting og befruktning — som ved standard IVF." },
      { n: "Steg 03", title: "Biopsi og test", desc: "Noen få celler tas fra embryoet på dag 5–6 og sendes til genetisk analyse." },
      { n: "Steg 04", title: "Resultat", desc: "Vi gjennomgår resultatene sammen — og hvilke embryo som er aktuelle for overføring." },
      { n: "Steg 05", title: "Embryooverføring", desc: "Det best egnede embryoet settes tilbake i livmoren." },
    ],
    reasonsEyebrow: "Når er PGT aktuelt",
    reasonsTitle: "Hvem kan PGT være riktig for?",
    reasonsLead:
      "PGT er ikke for alle som tar IVF. Det er en tilleggstest med klare indikasjoner — og vi vurderer alltid om det er riktig for deg.",
    reasons: [
      { n: "01", title: "Gjentatte spontanaborter", desc: "Tre eller flere uforklarte spontanaborter — kromosom­avvik kan være årsak." },
      { n: "02", title: "Gjentatte mislykkede IVF-forsøk", desc: "Når flere overføringer av tilsynelatende gode embryo ikke har gitt graviditet." },
      { n: "03", title: "Kjent arvelig sykdom (PGT-M)", desc: "Når dere bærer en spesifikk genetisk sykdom dere ikke vil overføre." },
      { n: "04", title: "Høy alder", desc: "Risiko for kromosomavvik øker med kvinnens alder — PGT-A kan være aktuelt." },
      { n: "05", title: "Strukturelle kromosom­avvik hos foreldre", desc: "Når kjent translokasjon eller annet avvik er påvist." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Forarbeid", title: "IVF", desc: "PGT gjøres alltid som del av en IVF-behandling.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk", desc: "Først kartlegger vi grunnlaget — så vurderer vi PGT.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
      { eyebrow: "Støtte", title: "Psykisk helsehjelp", desc: "Genetiske spørsmål er tunge. Vi tilbyr samtaler hele veien.", href: "/behandlinger/fertilitet/psykisk-helsehjelp" },
    ],
    ctaTitle: "Bestill PGT-samtale",
    ctaDescription:
      "Vi tar tid til den genetiske veiledningen — og forklarer hva testen kan og ikke kan svare på.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── MANNLIG FERTILITET ───────────────────────── */
  "mannlig-fertilitet": {
    seoTitle: "Mannlig fertilitet — sædanalyse og mikro-TESE | CMedical",
    seoDescription:
      "Halvparten av forklaringen ligger ofte hos mannen. Sædanalyse, hormonprøver og mikro-TESE hos spesialister — diskret og raskt.",
    canonical: "/behandlinger/fertilitet/mannlig-fertilitet",
    parent,
    title: "Mannlig fertilitet",
    eyebrow: "For menn — CMedical",
    heroTitle: <>Halvparten av <span className="italic">svaret</span> ligger ofte her</>,
    heroDescription:
      "Når et par ikke blir gravide, er årsaken hos mannen i omtrent halvparten av tilfellene. En enkel sædanalyse gir deg svar — og er det naturlige første steget.",
    heroPoints: [
      { title: "Sædanalyse", desc: "Antall, bevegelighet og form — analysert av vårt eget laboratorium." },
      { title: "Hormonstatus", desc: "Blodprøver for testosteron, FSH, LH og andre relevante hormoner." },
      { title: "Mikro-TESE", desc: "Henting av sædceller fra testikkelen ved azoospermi (ingen sædceller i sæd)." },
      { title: "Diskret og rask prosess", desc: "Du får svar raskt — uten unødvendige besøk." },
    ],
    rating: "4,7 — Spesialister på mannlig fertilitet",
    booking: { ...baseBooking, tjeneste: "sedanalyse" },
    primaryCtaLabel: "Bestill sædanalyse",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik utreder vi mannlig fertilitet",
    flow: [
      { n: "Steg 01", title: "Sædanalyse", desc: "Du leverer en prøve — analysen gjøres samme dag av vårt laboratorium." },
      { n: "Steg 02", title: "Konsultasjon", desc: "Vi går gjennom resultatet, hormonprøver og din helsehistorie." },
      { n: "Steg 03", title: "Eventuell videre utredning", desc: "Ultralyd, hormonprøver eller henvisning til urolog ved behov." },
      { n: "Steg 04", title: "Behandlingsplan", desc: "Vi vurderer alt fra livsstilsendringer til IVF/ICSI eller mikro-TESE." },
    ],
    reasonsEyebrow: "Når sjekke mannlig fertilitet",
    reasonsTitle: "Når er det lurt å ta en sjekk?",
    reasonsLead:
      "En sædanalyse er enkel, rask og gir konkrete svar. Det burde være en selvfølge når et par utreder fertilitet — ikke noe som kommer som siste utvei.",
    reasons: [
      { n: "01", title: "Dere har prøvd uten å bli gravide", desc: "Etter 6–12 måneder bør begge utredes — samtidig." },
      { n: "02", title: "Du har hatt kvise, infeksjon eller skade", desc: "Tidligere testikkelproblemer kan påvirke fruktbarheten." },
      { n: "03", title: "Du planlegger å bli forelder senere", desc: "En sjekk gir oversikt — og mulighet for nedfrysing om aktuelt." },
      { n: "04", title: "Hormonelle symptomer", desc: "Lav energi, redusert libido eller endring i kroppen kan henge sammen." },
      { n: "05", title: "Før kreftbehandling", desc: "Nedfrysing av sæd før cellegift eller stråling beskytter mulighetene dine." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Behandling", title: "IVF med ICSI", desc: "Ved nedsatt sædkvalitet er IVF med ICSI ofte løsningen.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Mulighet", title: "Nedfrysing av sæd", desc: "Frys ned sæd før behandling eller for fremtiden.", href: "/behandlinger/fertilitet/nedfrysing" },
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk (par)", desc: "Vi anbefaler at begge tar en sjekk samtidig.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
    ],
    ctaTitle: "Bestill sædanalyse",
    ctaDescription:
      "Diskret og raskt — du har svar i hånden samme dag. Vi tar imot deg uten henvisning og uten ventetid.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },

  /* ───────────────────────── PSYKISK HELSEHJELP ───────────────────────── */
  "psykisk-helsehjelp": {
    seoTitle: "Psykisk helsehjelp i fertilitetsforløp | CMedical",
    seoDescription:
      "Samtaler med psykolog gjennom hele fertilitetsforløpet — før, under og etter behandling. Du er ikke alene.",
    canonical: "/behandlinger/fertilitet/psykisk-helsehjelp",
    parent,
    title: "Psykisk helsehjelp",
    eyebrow: "Støtte — CMedical",
    heroTitle: <>Du skal ikke <span className="italic">stå</span> i dette alene</>,
    heroDescription:
      "Et fertilitetsforløp tar mye plass — også psykisk. Vi tilbyr samtaler med psykolog som kjenner forløpet, fra første utredning til etter graviditetstest. Det er en del av tilbudet vårt — ikke et tillegg.",
    heroPoints: [
      { title: "Psykolog med fertilitetserfaring", desc: "Du møter noen som forstår hva du står i — uten lange forklaringer." },
      { title: "Samtaler hele veien", desc: "Før, under og etter behandling — så lenge du trenger det." },
      { title: "For par og enkeltpersoner", desc: "Sammen eller hver for dere — vi tilpasser etter ønsker." },
      { title: "Trygt rom", desc: "Alt du sier blir værende mellom deg og psykologen." },
    ],
    rating: "4,9 — Psykologer som forstår forløpet",
    booking: { ...baseBooking, tjeneste: "samtale" },
    primaryCtaLabel: "Bestill samtale",
    flowEyebrow: "Forløpet",
    flowTitle: "Slik tilbyr vi psykisk støtte",
    flow: [
      { n: "Steg 01", title: "Første samtale", desc: "En åpen, uforpliktende samtale der vi blir kjent og finner ut hva du trenger." },
      { n: "Steg 02", title: "Plan for oppfølging", desc: "Vi avtaler hyppighet og format basert på dine behov." },
      { n: "Steg 03", title: "Samtaler i ditt tempo", desc: "Underveis i behandlingen — og etterpå om du ønsker det." },
      { n: "Steg 04", title: "Tett samspill med behandlerteamet", desc: "Med ditt samtykke samarbeider vi på tvers, slik at du opplever helhet." },
    ],
    reasonsEyebrow: "Når kan psykolog hjelpe",
    reasonsTitle: "Du trenger ikke vente på krisen",
    reasonsLead:
      "Mange ber om hjelp først når det blir tungt. Vi vil at du skal vite at samtalene står klare hele veien — også når alt 'går greit'.",
    reasons: [
      { n: "01", title: "Beslutningstunge valg", desc: "IVF, eggdonasjon, antall forsøk — vi hjelper deg å tenke høyt." },
      { n: "02", title: "Sorgen etter et negativt svar", desc: "Hver runde kan være et tap. Du fortjener et rom for det." },
      { n: "03", title: "Etter spontanabort", desc: "Tap er tap — uansett hvor langt på vei du var." },
      { n: "04", title: "Belastning på parforholdet", desc: "Et fertilitetsforløp setter parforholdet på prøve. Vi snakker sammen, om dere ønsker det." },
      { n: "05", title: "Etter graviditetstest", desc: "Også positive svar bringer komplekse følelser. Vi er der — også da." },
    ],
    promises: standardPromises,
    related: [
      { eyebrow: "Behandling", title: "IVF", desc: "Psykologisk støtte hører naturlig hjemme i et IVF-forløp.", href: "/behandlinger/fertilitet/ivf" },
      { eyebrow: "Mulighet", title: "Eggdonasjon", desc: "Egne psykologsamtaler er en obligatorisk del av forløpet.", href: "/behandlinger/fertilitet/eggdonasjon" },
      { eyebrow: "Forarbeid", title: "Fertilitetssjekk", desc: "Vi snakker også med deg som vurderer om dette er rett for deg.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
    ],
    ctaTitle: "Bestill en samtale",
    ctaDescription:
      "Du trenger ikke å vite hvor du skal begynne. En første samtale er et godt sted å starte.",
    specialistCategory: "fertilitet",
    specialistCtaLabel: "Se alle fertilitetsspesialister",
    specialistCtaHref: "/spesialister?kategori=fertilitet",
  },
};
