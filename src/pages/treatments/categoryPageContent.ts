// Shared content for the new category page layout.
// Each category gets:
//  - hero/intro copy (reuses staticCategoryData from CategoryPage where possible)
//  - service groupings (4 thematic cards in "Hva vi behandler")
//  - a 4-step "Pasientreisen" journey
//
// All service names map back to the existing services in CategoryPage.staticCategoryData,
// so all links continue to work.

import {
  Calendar, MessageCircle, HeartHandshake, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getIcon } from "@/lib/icons";

import urologiHeroAsset from "@/assets/services/urologi-hero.jpg.asset.json";
const urologiImg = urologiHeroAsset.url;
import fertilitetAsset from "@/assets/hero-fertilitet.jpg.asset.json";
const fertilitetImg = fertilitetAsset.url;
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";
import graviditetImg from "@/assets/hero/hero-pregnancy.jpg";

// Map service display name -> Claude.ai (-cl) icon key registered in src/lib/icons.ts
export const serviceIconKeyMap: Record<string, string> = {
  // Gynekologi
  "Gynekologisk undersøkelse": "gynekologisk-undersokelse-cl",
  "Urinlekkasje": "urinlekkasje-cl",
  "Endometriose": "endometriose-cl",
  "Overgangsalder": "overgangsalder-cl",
  "Vaginale fremfall": "vaginale-fremfall-cl",
  "Blødningsforstyrrelser": "blodningsforstyrrelser-cl",
  "Celleforandringer": "celleforandringer-cl",
  "Cyster på eggstokkene": "cyster-cl",
  "Fjerne livmor": "fjerne-livmor-cl",
  "PMS og PMDD": "pms-pmdd-cl",
  "Labiaplastikk": "labiaplastikk-cl",
  "Vaginal tørrhet": "vaginal-torrhet-cl",
  "Vulvalidelser": "vulvalidelser-cl",
  "Gynekologisk kirurgi": "gynekologisk-kirurgi-cl",
  "Robotassistert kirurgi": "robotkirurgi-gyn-cl",
  // Fertilitet
  "Infertilitet": "infertilitet-cl",
  "Fertilitetsutredning": "infertilitet-cl",
  "Assistert befruktning": "assistert-befruktning-cl",
  "Assistert befruktning med donor": "donorbehandling-cl",
  "Eggfrys": "eggfrys-cl",
  "Hormonforstyrrelser": "hormonforstyrrelser-cl",
  "Hysteroskopi": "hysteroskopi-cl",
  "IVF": "ivf-cl",
  "Vårt team": "fertilitetsteamet-cl",
  // Urologi
  "Blære og urinveier": "blaere-cl",
  "Forhud": "forhud-cl",
  "Mannlig infertilitet": "mannlig-infertilitet-cl",
  "Nyrer": "nyrer-cl",
  "Prevensjon": "hormonforstyrrelser-cl",
  "Testikler og pung": "testikler-cl",
  "Prostata": "prostata-cl",
  "Sterilisering": "sterilisering-cl",
  "Refertilisering": "refertilisering-cl",
  "Sædanalyse": "saedanalyse-cl",
  "Åreknuter": "areknuter-cl",
  // Ortopedi
  "Fot og ankel": "fot-ankel-cl",
  "Hofte": "hofte-cl",
  "Hånd og albue": "hand-albue-cl",
  "Kne": "kne-cl",
  // Graviditet
  "Ultralyd": "ultralyd-cl",
  "NIPT": "nipt-cl",
  "6-ukerskontroll etter fødsel": "graviditet-cl",
  "Traumatisk fødsel": "svangerskapsteam-cl",
  "Fødselsangst": "psykologi-cl",
  "For partnere": "tverrfaglig-team-cl",
  "Fostermedisin": "fosterdiagnostikk-cl",
  "Fosterdiagnostikk": "fosterdiagnostikk-cl",
  "Svangerskapsteam": "svangerskapsteam-cl",
  "Spontanabort": "spontanabort-cl",
  // Flere fagområder
  "Endokrinologi": "endokrinologi-cl",
  "Ernæringsfysiolog": "ernaringsfysiolog-cl",
  // (Hudlege fjernet — alt ligger nå under Hudhelse)
  "Gastrokirurgi": "gastrokirurgi-cl",
  "Overvektskirurgi": "overvektskirurgi-cl",
  "Osteopati": "osteopati-cl",
  "Psykologi": "psykologi-cl",
  "Sexologi": "sexologi-cl",
  "Kvinnehelse": "gynekologi-cl",
  "Tverrfaglig team": "tverrfaglig-team-cl",
  // Aliaser brukt i /tjenester-grid og menyer
  "Graviditet": "graviditet-cl",
  "Graviditet og fostermedisin": "graviditet-cl",
  "Hudhelse": "hudlege-cl",
  "Plastikkirurgi": "labiaplastikk-cl",
  "Revmatologi": "ortopedi-cl",
  "Robotkirurgi": "robotkirurgi-gyn-cl",
  "Åreknutebehandling": "blaere-cl",
};

export const getServiceIcon = (name: string): LucideIcon =>
  getIcon(serviceIconKeyMap[name] ?? "flere-fagomrader-cl");

// Backwards-compat: legacy name kept so existing imports don't break.
export const serviceIconMap = serviceIconKeyMap;

export interface ServiceGroup {
  label: string;
  serviceNames: string[];
}

export interface JourneyStep {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
}

export interface CategoryNewContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;          // first paragraph used in hero + intro
  longDescription?: string;     // full description for SEO/intro fallbacks
  servicesHeading: string;
  servicesIntro: string;
  heroImage: string;
  // Map name → URL path (for the grouped lists)
  serviceLinks: Record<string, string>;
  groups: ServiceGroup[];
  faqs: { question: string; answer: string }[];
  journey: JourneyStep[];
  bookingPath: string;          // e.g. "/booking?kategori=gynekologi"
  closingTitle: string;
  closingBody: string;
  closingCta: string;
}

const standardFaqs = [
  {
    question: "Henvisning",
    answer:
      "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige.",
  },
  {
    question: "Ventetid",
    answer:
      "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!",
  },
  {
    question: "Sykemelding",
    answer:
      "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer.",
  },
  {
    question: "Utredning",
    answer:
      "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter.",
  },
  {
    question: "Selskapet",
    answer:
      "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde.",
  },
];

// ─── GYNEKOLOGI ───────────────────────────────────────────────────────────────
const gynekologi: CategoryNewContent = {
  id: "gynekologi",
  title: "Gynekologi",
  subtitle: "Ingen ventetid • Ingen henvisning",
  description:
    "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier. Vårt mål er å gjøre kvinnehelse til folkehelse, i hele Norden.",
  longDescription:
    "Hos oss møter du gynekologer som jobber med den kvinnesykdommen de kan aller best, og ved behov tilbyr vi tverrfaglig behandling med gynekologer, fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer.",
  servicesHeading: "Alt under samme tak",
  servicesIntro:
    "Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:",
  heroImage: gynekologiImg,
  serviceLinks: {
    "Gynekologisk undersøkelse": "/behandlinger/gynekologi/undersokelse",
    "Urinlekkasje": "/behandlinger/gynekologi/urinlekkasje",
    "Endometriose": "/behandlinger/gynekologi/endometriose",
    "Overgangsalder": "/behandlinger/gynekologi/overgangsalder",
    "Vaginale fremfall": "/behandlinger/gynekologi/vaginale-fremfall",
    "Urogynekologi": "/behandlinger/gynekologi/urogynekologi",
    "Blødningsforstyrrelser": "/behandlinger/gynekologi/blodningsforstyrrelser",
    "Celleforandringer": "/behandlinger/gynekologi/celleforandringer",
    "Cyster på eggstokkene": "/behandlinger/gynekologi/cyster",
    "Fjerne livmor": "/behandlinger/gynekologi/fjerne-livmor",
    "PMS og PMDD": "/behandlinger/gynekologi/pms-pmdd",
    "Labiaplastikk": "/behandlinger/gynekologi/labiaplastikk",
    "Vulvalidelser": "/behandlinger/gynekologi/vulvalidelser",
    "Gynekologisk kirurgi": "/behandlinger/gynekologi/kirurgi",
    "Robotassistert kirurgi": "/behandlinger/gynekologi/robotkirurgi",
  },
  groups: [
    {
      label: "Den vanlige timen",
      serviceNames: ["Gynekologisk undersøkelse", "Celleforandringer"],
    },
    {
      label: "Når noe ikke kjennes riktig",
      serviceNames: ["Endometriose", "Blødningsforstyrrelser", "Cyster på eggstokkene", "PMS og PMDD", "Vulvalidelser"],
    },
    {
      label: "Livet skifter form",
      serviceNames: ["Urogynekologi", "Urinlekkasje", "Overgangsalder", "Vaginale fremfall"],
    },
    {
      label: "Når kirurgi er svaret",
      serviceNames: ["Fjerne livmor", "Labiaplastikk", "Gynekologisk kirurgi", "Robotassistert kirurgi"],
    },
  ],
  faqs: standardFaqs,
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Bestill når det passer deg",
      body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { icon: MessageCircle, label: "Steg 02", title: "Samtalen som rekker",
      body: "En gynekolog som utelukkende jobber med din kvinnesykdom. Vi går gjennom historikk, plager og hva du ønsker hjelp med." },
    { icon: HeartHandshake, label: "Steg 03", title: "Utredning og plan",
      body: "En vanlig utredning hos oss varer ca 30 minutter. Trygg klinisk undersøkelse og en konkret plan – på et språk du forstår." },
    { icon: Clock, label: "Steg 04", title: "Tverrfaglig oppfølging",
      body: "Ved behov tilbyr vi tverrfaglig behandling med fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer." },
  ],
  bookingPath: "/booking?kategori=gynekologi",
  closingTitle: "Klar når du er det",
  closingBody:
    "Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.",
  closingCta: "Bestill gynekologtime",
};

// ─── UROLOGI ──────────────────────────────────────────────────────────────────
const urologi: CategoryNewContent = {
  id: "urologi",
  title: "Urologi",
  subtitle: "Ingen ventetid • Ingen henvisning",
  description:
    "Urologi er en medisinsk spesialitet som omhandler plager og sykdommer knyttet til mannens underliv og urinorganer hos begge kjønn herunder penis, prostata, testikler, urinblære og nyrer. Har du smerter, forstyrrelser med vannlating eller bare ønsker en generell sjekk, vil vår gruppe av spesialister kunne hjelpe.",
  longDescription:
    "I CMedical har vi flere av Nordens ledende spesialister innen urologi.",
  servicesHeading: "Urologispesialister",
  servicesIntro:
    "Våre spesialister jobber med de fagområdene de kan best. Vi har noen av Nordens ledende spesialister på følgende områder:",
  heroImage: urologiImg,
  serviceLinks: {
    "Blære og urinveier": "/behandlinger/urologi/blaere",
    "Forhud": "/behandlinger/urologi/forhud",
    "Mannlig infertilitet": "/behandlinger/urologi/infertilitet",
    "Nyrer": "/behandlinger/urologi/nyrer",
    "Prostata": "/behandlinger/urologi/prostata",
    "Refertilisering": "/behandlinger/urologi/refertilisering",
    "Robotassistert kirurgi": "/behandlinger/urologi/robotkirurgi",
    "Sterilisering": "/behandlinger/urologi/sterilisering",
    "Testikler og pung": "/behandlinger/urologi/testikler",
  },
  groups: [
    { label: "Vannlating og blære", serviceNames: ["Blære og urinveier", "Nyrer"] },
    { label: "Mannlig helse", serviceNames: ["Forhud", "Testikler og pung", "Mannlig infertilitet"] },
    { label: "Prostata", serviceNames: ["Prostata", "Robotassistert kirurgi"] },
    { label: "Familieplanlegging", serviceNames: ["Sterilisering", "Refertilisering"] },
  ],
  faqs: standardFaqs,
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Bestill når det passer deg",
      body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { icon: MessageCircle, label: "Steg 02", title: "Konsultasjon med spesialist",
      body: "En urolog som er spesialist på din plage. Vi går gjennom symptomer, historikk og hva du ønsker hjelp med." },
    { icon: HeartHandshake, label: "Steg 03", title: "Utredning og plan",
      body: "En vanlig utredning varer ca 30 minutter. Klinisk undersøkelse og en konkret behandlingsplan – på et språk du forstår." },
    { icon: Clock, label: "Steg 04", title: "Behandling og oppfølging",
      body: "Vi tilbyr alt fra konservativ behandling til avansert urologisk kirurgi, med tett oppfølging gjennom hele forløpet." },
  ],
  bookingPath: "/booking?kategori=urologi",
  closingTitle: "Klar når du er det",
  closingBody:
    "Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.",
  closingCta: "Bestill urologtime",
};

// ─── FERTILITET ───────────────────────────────────────────────────────────────
const fertilitet: CategoryNewContent = {
  id: "fertilitet",
  title: "Fertilitet",
  subtitle: "Uten henvisning • Ingen ventetid",
  description:
    "Velkommen til Nordens mest komplette private fertilitetstilbud. Hos oss i CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – enten du er ny pasient eller kommer fra en annen klinikk.",
  longDescription:
    "Vi er den første klinikken i Norden med IVF-behandling og kirurgi samlet på ett sted, og vi tilbyr forskningsbasert behandling kombinert med personlig tilpasset oppfølging.",
  servicesHeading: "Fertilitetsspesialister",
  servicesIntro:
    "Hos CMedical fertilitet jobber vi i et tverrfaglig team. IVF-teamet består av gynekologer med subspesialisering innen fertilitet, IVF-sykepleiere og embryologer. Som pasient ved CMedical er du i trygge hender.",
  heroImage: fertilitetImg,
  serviceLinks: {
    "Fertilitetsutredning": "/behandlinger/fertilitet/fertilitetsutredning",
    "Infertilitet": "/behandlinger/fertilitet/infertilitet",
    "Assistert befruktning": "/behandlinger/fertilitet/assistert-befruktning",
    "Nedfrysning av egg": "/behandlinger/fertilitet/eggfrys",
    "Donorbehandling": "/behandlinger/fertilitet/donorbehandling",
    "Sædanalyse": "/behandlinger/fertilitet/saedanalyse",
    "Hysteroskopi": "/behandlinger/fertilitet/hysteroskopi",
  },
  groups: [
    { label: "Kartlegging", serviceNames: ["Fertilitetsutredning", "Infertilitet", "Sædanalyse"] },
    { label: "Behandling", serviceNames: ["Assistert befruktning", "Donorbehandling", "Hysteroskopi"] },
    { label: "For fremtiden", serviceNames: ["Nedfrysning av egg"] },
  ],
  faqs: standardFaqs,
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Uforpliktende kontakt",
      body: "Bestill en kostnadsfri prat med en av våre IVF-sykepleiere, eller book konsultasjon direkte. Ingen henvisning." },
    { icon: MessageCircle, label: "Steg 02", title: "Konsultasjon og utredning",
      body: "Sammen med en fertilitetsspesialist går vi gjennom historikk, prøver og hva som kan være riktig vei videre for deg." },
    { icon: HeartHandshake, label: "Steg 03", title: "Personlig behandlingsplan",
      body: "Vi setter opp en plan tilpasset deg – fra hormonbehandling og inseminasjon til IVF, ICSI og donorbehandling." },
    { icon: Clock, label: "Steg 04", title: "Tett oppfølging gjennom hele reisen",
      body: "Vårt tverrfaglige team følger deg tett – med både medisinsk, psykologisk og praktisk støtte når du trenger det." },
  ],
  bookingPath: "/booking?kategori=fertilitet",
  closingTitle: "Klar når du er det",
  closingBody:
    "Snakk med en av våre IVF-sykepleiere eller book konsultasjon med en fertilitetsspesialist. Ingen henvisning.",
  closingCta: "Bestill fertilitetstime",
};

// ─── ORTOPEDI ─────────────────────────────────────────────────────────────────
const ortopedi: CategoryNewContent = {
  id: "ortopedi",
  title: "Ortopedi",
  subtitle: "Ingen ventetid • Ingen henvisning",
  description:
    "Ortopedi er en medisinsk spesialitet som tar seg av problemer med muskler, bein, ledd og sener i kroppen. Våre ortopeder er eksperter på å behandle skader og sykdommer knyttet til skulder, hånd, fot og albue.",
  longDescription:
    "Hos oss jobber noen av landets fremste kirurger med avanserte caser.",
  servicesHeading: "Erfarne spesialister",
  servicesIntro:
    "Våre ortopeder er alle spesialister med høy kompetanse innen sine felt. På grunn av vår erfaring får vi ofte pasienter til såkalt second opinion. Hos oss får du tilgang på den samme ekspertisen som du får hos de store universitetssykehusene.",
  heroImage: ortopediImg,
  serviceLinks: {
    "Fot og ankel": "/behandlinger/ortopedi/fot-ankel",
    "Hofte": "/behandlinger/ortopedi/hofte",
    "Hånd og albue": "/behandlinger/ortopedi/hand-albue",
    "Kne": "/behandlinger/ortopedi/kne",
  },
  groups: [
    { label: "Underekstremiteter", serviceNames: ["Fot og ankel", "Kne"] },
    { label: "Hofte og bekken", serviceNames: ["Hofte"] },
    { label: "Overekstremiteter", serviceNames: ["Hånd og albue"] },
    { label: "Avanserte caser", serviceNames: ["Hofte", "Kne"] },
  ],
  faqs: standardFaqs,
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Bestill når det passer deg",
      body: "Online booking døgnet rundt. Ingen henvisning. Korte ventetider, også for second opinion." },
    { icon: MessageCircle, label: "Steg 02", title: "Klinisk undersøkelse",
      body: "En erfaren ortoped går gjennom skaden eller plagen din, og setter sammen et godt bilde av hva som faktisk skjer." },
    { icon: HeartHandshake, label: "Steg 03", title: "Diagnose og behandlingsplan",
      body: "Med moderne bildediagnostikk og oppdaterte metoder lager vi en plan – fra konservativ behandling til kirurgi." },
    { icon: Clock, label: "Steg 04", title: "Behandling og opptrening",
      body: "Vi følger deg gjennom hele forløpet – fra inngrep til opptrening, med tett samarbeid med fysioterapeuter." },
  ],
  bookingPath: "/booking?kategori=ortopedi",
  closingTitle: "Klar når du er det",
  closingBody:
    "Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.",
  closingCta: "Bestill ortopedtime",
};

// ─── GRAVIDITET ───────────────────────────────────────────────────────────────
const graviditet: CategoryNewContent = {
  id: "graviditet",
  title: "Graviditet og fostermedisin",
  subtitle: "Kort ventetid • Ingen henvisning",
  description:
    "Vi tilbyr trygg og helhetlig oppfølging gjennom svangerskapet, med erfarne fostermedisinere, jordmødre og psykologer som ser hele deg – ikke bare graviditeten.",
  longDescription:
    "Fra tidlig ultralyd og NIPT til oppfølging etter fødsel – vi er der for deg, partneren din og babyen.",
  servicesHeading: "Trygghet gjennom hele reisen",
  servicesIntro:
    "Våre tilbud dekker hele svangerskapet og tiden etter fødsel. Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele forløpet.",
  heroImage: graviditetImg,
  serviceLinks: {
    "Ultralyd": "/behandlinger/graviditet/ultralyd",
    "NIPT": "/behandlinger/graviditet/nipt",
    "Fosterdiagnostikk": "/behandlinger/graviditet/fosterdiagnostikk",
    "Svangerskapsteam": "/behandlinger/graviditet/svangerskapsteam",
  },
  groups: [
    { label: "Tidlig i svangerskapet", serviceNames: ["Ultralyd", "NIPT"] },
    { label: "Utredning", serviceNames: ["Fosterdiagnostikk"] },
    { label: "Helhetlig oppfølging", serviceNames: ["Svangerskapsteam"] },
  ],
  faqs: standardFaqs.slice(0, 3),
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Bestill den timen du trenger",
      body: "Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele svangerskapet. Ingen henvisning." },
    { icon: MessageCircle, label: "Steg 02", title: "Trygg utredning og samtale",
      body: "Erfarne fostermedisinere, gynekologer og jordmødre tar seg god tid – og forklarer alt på et språk du forstår." },
    { icon: HeartHandshake, label: "Steg 03", title: "Plan tilpasset deg",
      body: "Vi setter sammen en plan basert på dine ønsker, behov og hvor du er i svangerskapet." },
    { icon: Clock, label: "Steg 04", title: "Helhetlig oppfølging",
      body: "Ved behov samarbeider vi med psykologer, fysioterapeuter og barselomsorg – også for partneren din." },
  ],
  bookingPath: "/booking?kategori=graviditet",
  closingTitle: "Klar når du er det",
  closingBody:
    "Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.",
  closingCta: "Bestill time",
};

// ─── FLERE FAGOMRÅDER ─────────────────────────────────────────────────────────
const flereFagomrader: CategoryNewContent = {
  id: "flere-fagomrader",
  title: "Flere fagområder",
  subtitle: "Kort ventetid • Ingen henvisning",
  description:
    "Vi har samlet noen av Nordens fremste spesialister innen gastrokirurgi, revmatologi, dermatologi, ernæringsfysiologi, karkirurgi, osteopati, psykologi og sexologi.",
  longDescription:
    "Ofte jobber spesialistene i kryssdisiplinære team for å gi deg den beste behandlingen. Husk at du alltid kan ta kontakt med oss hvis du lurer på noe.",
  servicesHeading: "Spesialister på tvers",
  servicesIntro:
    "Ledende spesialister som utelukkende jobber med fagområdet de kan aller best, og vi har noen av Nordens ledende på disse områdene:",
  heroImage: flereFagomraderImg,
  serviceLinks: {
    "Endokrinologi": "/behandlinger/flere-fagomrader/endokrinologi",
    "Ernæringsfysiolog": "/behandlinger/flere-fagomrader/ernaringsfysiolog",
    // (Hudlege fjernet — alt ligger nå under Hudhelse)
    "Hudhelse": "/behandlinger/flere-fagomrader/hudhelse",
    "Gastrokirurgi": "/behandlinger/flere-fagomrader/gastrokirurgi",
    "Plastikkirurgi": "/behandlinger/flere-fagomrader/plastikkirurgi",
    "Robotassistert kirurgi": "/behandlinger/flere-fagomrader/robotkirurgi",
    "Åreknuter": "/behandlinger/flere-fagomrader/areknuter",
    "Osteopati": "/behandlinger/flere-fagomrader/osteopati",
    "Revmatologi": "/behandlinger/flere-fagomrader/revmatologi",
    "Psykologi": "/behandlinger/flere-fagomrader/psykologi",
    "Sexologi": "/behandlinger/flere-fagomrader/sexologi",
  },
  groups: [
    { label: "Hud, hormoner og ernæring", serviceNames: ["Endokrinologi", "Ernæringsfysiolog", "Hudhelse"] },
    { label: "Mage og kirurgi", serviceNames: ["Gastrokirurgi", "Plastikkirurgi", "Robotassistert kirurgi"] },
    { label: "Kropp og bevegelse", serviceNames: ["Osteopati", "Revmatologi", "Åreknuter"] },
    { label: "Mental helse og samliv", serviceNames: ["Psykologi", "Sexologi"] },
  ],
  faqs: standardFaqs,
  journey: [
    { icon: Calendar, label: "Steg 01", title: "Bestill når det passer deg",
      body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { icon: MessageCircle, label: "Steg 02", title: "Snakk med riktig spesialist",
      body: "Du møter en spesialist som utelukkende jobber med fagområdet du trenger hjelp med." },
    { icon: HeartHandshake, label: "Steg 03", title: "Utredning og plan",
      body: "Vi setter sammen et helhetsbilde – og lager en konkret plan, ofte i samarbeid med flere fagfelt." },
    { icon: Clock, label: "Steg 04", title: "Tverrfaglig oppfølging",
      body: "Ved behov jobber vi i kryssdisiplinære team for å gi deg den beste, mest helhetlige behandlingen." },
  ],
  bookingPath: "/booking?kategori=flere-fagomrader",
  closingTitle: "Klar når du er det",
  closingBody:
    "Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser direkte til deg.",
  closingCta: "Bestill time",
};

export const categoryNewContent: Record<string, CategoryNewContent> = {
  gynekologi,
  urologi,
  fertilitet,
  ortopedi,
  graviditet,
  "flere-fagomrader": flereFagomrader,
};
