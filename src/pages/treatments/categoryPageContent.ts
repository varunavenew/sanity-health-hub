// Shared content for the new category page layout.
// Each category gets:
//  - hero/intro copy (reuses staticCategoryData from CategoryPage where possible)
//  - service groupings (4 thematic cards in "Hva vi behandler")
//  - a 4-step "Pasientreisen" journey
//
// All service names map back to the existing services in CategoryPage.staticCategoryData,
// so all links continue to work.

import {
  Stethoscope, Droplets, Ribbon, Sun, HeartPulse, Microscope, Scissors,
  Baby, Syringe, Flower2, ShieldCheck, Scan, CircleDot, Bot, Hand,
  Bone, Footprints, Activity, Apple, Brain, Smile, Heart, Users,
  Pill, Dna, Snowflake, FlaskConical, TestTube, BicepsFlexed,
  Calendar, MessageCircle, HeartHandshake, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";
import graviditetImg from "@/assets/hero/hero-pregnancy.jpg";

export const serviceIconMap: Record<string, LucideIcon> = {
  // Gynekologi
  "Gynekologisk undersøkelse": Stethoscope,
  "Urinlekkasje": Droplets,
  "Endometriose": Ribbon,
  "Overgangsalder": Sun,
  "Vaginale fremfall": HeartPulse,
  "Blødningsforstyrrelser": Activity,
  "Celleforandringer": Microscope,
  "Cyster på eggstokkene": CircleDot,
  "Fjerne livmor": Scissors,
  "PMS og PMDD": Heart,
  "Labiaplastikk": Flower2,
  "Vaginal tørrhet": Droplets,
  "Vulvalidelser": ShieldCheck,
  "Gynekologisk kirurgi": Scissors,
  "Robotassistert kirurgi": Bot,
  // Fertilitet
  "Infertilitet": Dna,
  "Assistert befruktning": FlaskConical,
  "Assistert befruktning med donor": TestTube,
  "Eggfrys": Snowflake,
  "Hormonforstyrrelser": Pill,
  "Hysteroskopi": Scan,
  // Urologi
  "Blære og urinveier": Droplets,
  "Forhud": ShieldCheck,
  "Mannlig infertilitet": Dna,
  "Nyrer": Activity,
  "Prevensjon": Pill,
  // Ortopedi
  "Fot og ankel": Footprints,
  "Hofte": BicepsFlexed,
  "Hånd og albue": Hand,
  "Kne": Bone,
  // Graviditet
  "Ultralyd": Scan,
  "NIPT": Microscope,
  "6-ukerskontroll etter fødsel": Baby,
  "Traumatisk fødsel": HeartPulse,
  "Fødselsangst": Heart,
  "For partnere": Users,
  "Fostermedisin": Baby,
  "Spontanabort": Heart,
  // Flere fagområder
  "Endokrinologi": Syringe,
  "Ernæringsfysiolog": Apple,
  "Hudlege": Flower2,
  "Gastrokirurgi": Scissors,
  "Overvektskirurgi": Scissors,
  "Osteopati": Hand,
  "Psykologi": Brain,
  "Sexologi": Smile,
  "Kvinnehelse": Heart,
  "Tverrfaglig team": Users,
};

export const getServiceIcon = (name: string): LucideIcon =>
  serviceIconMap[name] || Stethoscope;

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
    "Blødningsforstyrrelser": "/behandlinger/gynekologi/blodningsforstyrrelser",
    "Celleforandringer": "/behandlinger/gynekologi/celleforandringer",
    "Cyster på eggstokkene": "/behandlinger/gynekologi/cyster",
    "Fjerne livmor": "/behandlinger/gynekologi/fjerne-livmor",
    "PMS og PMDD": "/behandlinger/gynekologi/pms-pmdd",
    "Labiaplastikk": "/behandlinger/gynekologi/labiaplastikk",
    "Vaginal tørrhet": "/behandlinger/gynekologi/vaginal-torrhet",
    "Vulvalidelser": "/behandlinger/gynekologi/vulvalidelser",
    "Gynekologisk kirurgi": "/behandlinger/gynekologi/kirurgi",
    "Robotassistert kirurgi": "/behandlinger/gynekologi/robotkirurgi",
  },
  groups: [
    {
      label: "Den vanlige timen",
      serviceNames: ["Gynekologisk undersøkelse", "Celleforandringer", "Vaginal tørrhet"],
    },
    {
      label: "Når noe ikke kjennes riktig",
      serviceNames: ["Endometriose", "Blødningsforstyrrelser", "Cyster på eggstokkene", "PMS og PMDD", "Vulvalidelser"],
    },
    {
      label: "Livet skifter form",
      serviceNames: ["Urinlekkasje", "Overgangsalder", "Vaginale fremfall"],
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
    "Prevensjon": "/behandlinger/urologi/prevensjon",
  },
  groups: [
    { label: "Vannlating og blære", serviceNames: ["Blære og urinveier", "Nyrer"] },
    { label: "Mannlig helse", serviceNames: ["Forhud", "Mannlig infertilitet"] },
    { label: "Familieplanlegging", serviceNames: ["Prevensjon"] },
    { label: "Tverrfaglig samarbeid", serviceNames: ["Mannlig infertilitet"] },
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
    "Infertilitet": "/behandlinger/fertilitet/infertilitet",
    "Assistert befruktning": "/behandlinger/fertilitet/assistert-befruktning",
    "Assistert befruktning med donor": "/behandlinger/fertilitet/donorbehandling",
    "Eggfrys": "/behandlinger/fertilitet/eggfrys",
    "Hormonforstyrrelser": "/behandlinger/fertilitet/hormonforstyrrelser",
    "Hysteroskopi": "/behandlinger/fertilitet/hysteroskopi",
  },
  groups: [
    { label: "Når graviditeten lar vente på seg", serviceNames: ["Infertilitet", "Hormonforstyrrelser"] },
    { label: "Assistert befruktning", serviceNames: ["Assistert befruktning", "Assistert befruktning med donor"] },
    { label: "For fremtiden", serviceNames: ["Eggfrys"] },
    { label: "Utredning og inngrep", serviceNames: ["Hysteroskopi"] },
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
    "6-ukerskontroll etter fødsel": "/behandlinger/graviditet/6-ukerskontroll",
    "Traumatisk fødsel": "/behandlinger/graviditet/traumatisk-fodsel",
    "Fødselsangst": "/behandlinger/graviditet/fodselsangst",
    "For partnere": "/behandlinger/graviditet/for-partnere",
    "Fostermedisin": "/behandlinger/graviditet/fostermedisin",
    "Spontanabort": "/behandlinger/graviditet/spontanabort",
  },
  groups: [
    { label: "Tidlig i svangerskapet", serviceNames: ["Ultralyd", "NIPT", "Fostermedisin"] },
    { label: "Når noe ikke går som planlagt", serviceNames: ["Spontanabort", "Traumatisk fødsel"] },
    { label: "Mental helse rundt fødsel", serviceNames: ["Fødselsangst", "For partnere"] },
    { label: "Etter fødsel", serviceNames: ["6-ukerskontroll etter fødsel"] },
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
    "Hudlege": "/behandlinger/flere-fagomrader/hudlege",
    "Gastrokirurgi": "/behandlinger/flere-fagomrader/gastrokirurgi",
    "Overvektskirurgi": "/behandlinger/flere-fagomrader/overvektskirurgi",
    "Osteopati": "/behandlinger/flere-fagomrader/osteopati",
    "Psykologi": "/behandlinger/flere-fagomrader/psykologi",
    "Sexologi": "/behandlinger/flere-fagomrader/sexologi",
    "Kvinnehelse": "/behandlinger/flere-fagomrader/kvinnehelse",
    "Tverrfaglig team": "/behandlinger/flere-fagomrader/tverrfaglig",
  },
  groups: [
    { label: "Hud, hormoner og ernæring", serviceNames: ["Endokrinologi", "Ernæringsfysiolog", "Hudlege"] },
    { label: "Mage og kirurgi", serviceNames: ["Gastrokirurgi", "Overvektskirurgi"] },
    { label: "Kropp og bevegelse", serviceNames: ["Osteopati"] },
    { label: "Mental helse og samliv", serviceNames: ["Psykologi", "Sexologi", "Kvinnehelse", "Tverrfaglig team"] },
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
