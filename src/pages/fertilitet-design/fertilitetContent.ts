// Shared content for the /fertilitet-design proposals.
// Pulls real copy from src/pages/treatments/Fertility.tsx and
// src/data/fertilitetSubPages.tsx so variants stay in sync.

import {
  HeartPulse,
  Microscope,
  Snowflake,
  Baby,
  Stethoscope,
  Dna,
  ShieldPlus,
  HeartHandshake,
  Brain,
  type LucideIcon,
} from "lucide-react";

import fertilitetHero from "@/assets/categories/fertilitet-real.jpg";
import fertilitetAlt from "@/assets/categories/fertilitet.jpg";
import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import journeyLab from "@/assets/fertility/journey-02-lab.jpg";
import journeyResult from "@/assets/fertility/journey-03-result.jpg";

export const fertilitetImages = {
  hero: fertilitetHero,
  alt: fertilitetAlt,
  consultation: journeyConsultation,
  lab: journeyLab,
  result: journeyResult,
};

/* ─────────────────────────── FERTILITET ─────────────────────────── */

export const fertilitetContent = {
  title: "Fertilitet",
  subtitle: "Norges eldste private fertilitetsklinikk",
  // Eksakt H1 fra /fertilitet
  heroHeadline: "Noen ganger trenger kroppen litt hjelp på veien",
  heroLead:
    "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For mange går det av seg selv. For andre tar det litt lenger tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar.",
  intro:
    "Livio og CMedical Sandvika har slått seg sammen. Det betyr mer erfaring, samme team — og et tilbud som dekker hele veien. Klinikk og laboratorium under samme tak, samme team gjennom hele forløpet — og fri tilgang uten henvisning.",
  ratingLine: "4,7 av 5 — Norges eldste private fertilitetsklinikk",
};

// Fra /fertilitet — målgruppe-seksjonen "Alle er velkomne"
export const fertilitetAudiences = [
  {
    title: "Heterofile par",
    desc: "Dere har prøvd en stund og lurer på om noe er galt. Vi starter med utredning av begge — ingen henvisning, ingen ventetid.",
    href: "/booking?kategori=fertilitet",
  },
  {
    title: "De ventende",
    desc: "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
  },
  {
    title: "Singel",
    desc: "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
    href: "/booking?kategori=fertilitet",
  },
];

// Fra /fertilitet — "Hvorfor CMedical"
export const fertilitetWhySteps = [
  {
    n: "01",
    title: "Et trygt sted å starte",
    desc: "Klinikk og laboratorium under samme tak. Ingen lange transporter, ingen mellommenn — bare oss og dere.",
  },
  {
    n: "02",
    title: "Ledende kompetanse",
    desc: "Spesialister med erfaring fra Rikshospitalet, Livio og internasjonale fertilitetssentre.",
  },
  {
    n: "03",
    title: "Tett oppfølging",
    desc: "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene.",
  },
];

// Fra /fertilitet — "CMedical i tall"
export const fertilitetClinicStats = [
  { k: "Klinikker", v: "Norges eldste", sub: "Etablert 1989" },
  { k: "Ventetid", v: "Ingen", sub: "Time samme uke" },
  { k: "Henvisning", v: "Nei", sub: "Book direkte" },
  { k: "Vurdering", v: "4,7", sub: "1 200+ pasienter" },
];

// Fra /fertilitet — "Resultater" / datastrimler
export const fertilitetResultStats = [
  { v: "42%", k: "Suksessrate IVF", sub: "Kvinner under 35 år" },
  { v: "3 800+", k: "Barn født", sub: "Siden oppstart i 1989" },
  { v: "11 200", k: "Egg uthentet", sub: "Siste 5 år" },
  { v: "1 450", k: "IVF-sykluser", sub: "Gjennomført i 2024" },
];

// Fra /fertilitet — forsikringspartnere
export const fertilitetInsurance = [
  "Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika",
];

export const fertilitetSegments = [
  {
    id: "forsta",
    title: "Jeg vil forstå fruktbarheten min",
    desc: "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
    cta: "Bestill fertilitetssjekk",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
  },
  {
    id: "gravid",
    title: "Jeg vil bli gravid",
    desc: "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
    cta: "Bestill utredning",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
  },
  {
    id: "bevare",
    title: "Jeg vil bevare mulighetene mine",
    desc: "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
    cta: "Snakk med oss",
    href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon",
  },
  {
    id: "mann",
    title: "Jeg er mann og vil sjekke fruktbarheten",
    desc: "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
    cta: "Bestill analyse",
    href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
  },
];

export interface FertilitetService {
  name: string;
  desc: string;
  href: string;
  icon: LucideIcon;
}

export const fertilitetServices: FertilitetService[] = [
  { name: "Fertilitetssjekk og utredning", desc: "Hormoner, ultralyd, sædanalyse", href: "/behandlinger/fertilitet/fertilitetssjekk", icon: HeartPulse },
  { name: "IVF — prøverørsbehandling", desc: "Inkludert ICSI ved behov", href: "/behandlinger/fertilitet/ivf", icon: Microscope },
  { name: "IUI — inseminasjon", desc: "Med partner eller donor", href: "/behandlinger/fertilitet/iui", icon: Baby },
  { name: "Eggdonasjon", desc: "Norges nyeste eggbank", href: "/behandlinger/fertilitet/eggdonasjon", icon: HeartHandshake },
  { name: "Nedfrysing av egg", desc: "Egg, sæd og embryo", href: "/behandlinger/fertilitet/nedfrysing", icon: Snowflake },
  { name: "Genetisk testing (PGT)", desc: "For utvalgte indikasjoner", href: "/behandlinger/fertilitet/pgt", icon: Dna },
  { name: "Mannlig fertilitet", desc: "Sædanalyse og mikro-TESE", href: "/behandlinger/fertilitet/mannlig-fertilitet", icon: Stethoscope },
  { name: "Gynekologi og kirurgi", desc: "Polypper, endometriose, myomer", href: "/behandlinger/gynekologi", icon: ShieldPlus },
  { name: "Psykisk helsehjelp", desc: "Samtaler gjennom hele forløpet", href: "/behandlinger/fertilitet/psykisk-helsehjelp", icon: Brain },
];

export const fertilitetServiceGroups = [
  {
    label: "Forstå utgangspunktet",
    serviceNames: ["Fertilitetssjekk og utredning", "Mannlig fertilitet"],
  },
  {
    label: "Behandlingene",
    serviceNames: ["IVF — prøverørsbehandling", "IUI — inseminasjon", "Eggdonasjon", "Genetisk testing (PGT)"],
  },
  {
    label: "Bevar mulighetene",
    serviceNames: ["Nedfrysing av egg"],
  },
  {
    label: "Helheten rundt deg",
    serviceNames: ["Gynekologi og kirurgi", "Psykisk helsehjelp"],
  },
];

export const fertilitetReviews = [
  { text: "Vi følte oss trygge fra første møte. De tok seg virkelig tid til å bli kjent med oss og vårt utgangspunkt — og det betød alt.", author: "Hilde", date: "IVF-forløp 2024" },
  { text: "Profesjonelle, varme og tydelige hele veien. Endelig følte vi at noen lyttet og hadde en plan vi kunne forstå.", author: "Marte og Jonas", date: "1 måned siden" },
  { text: "Korte ventetider, dyktige spesialister og et tilbud som faktisk er tilpasset oss. Anbefales på det sterkeste.", author: "Sara L.", date: "3 måneder siden" },
];

export const fertilitetFaqs = [
  { question: "Trenger jeg henvisning?", answer: "Nei. CMedical er en privat klinikk — du booker direkte uten henvisning fra fastlegen." },
  { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. De fleste får time innen samme uke." },
  { question: "Hva koster en konsultasjon?", answer: "Priser er åpne og oppgis i forkant. Se prislisten — og snakk gjerne med sykepleier først om du er usikker." },
  { question: "Hvem behandler dere?", answer: "Vi tar imot heterofile par, likekjønnede par, single, og menn som vil sjekke sin del av bildet." },
];

/* ─────────────────────────── FERTILITETSSJEKK ─────────────────────────── */

export const sjekkContent = {
  title: "Fertilitetssjekk",
  subtitle: "Forstå fruktbarheten din",
  // Eksakt heroTitle fra fertilitetSubPages.fertilitetssjekk
  heroHeadline: "Forstå fruktbarheten din",
  heroLead:
    "En fertilitetssjekk gir deg et klart bilde av hvor du står. Ikke fordi noe nødvendigvis er galt — men fordi du fortjener gode svar. Vi tar blodprøver, ultralyd og en grundig samtale med spesialist.",
  intro:
    "Mange tror en fertilitetssjekk er noe man gjør først når man har prøvd lenge og noe er galt. Slik er det ikke. En sjekk er rett og slett en kartlegging av fruktbarheten din — slik at du vet hva du har å forholde deg til.",
  intro2:
    "Vi ser på eggstokkreserven din (AMH), teller egganlegg via ultralyd (AFC) og tar en rekke hormoner. Etter konsultasjonen sitter du igjen med konkret informasjon — og en spesialist som forklarer hva det betyr for deg.",
  ratingLine: "4,8 — Norges eldste private fertilitetsklinikk",
  ctaTitle: "Klar til å finne ut hvor du står?",
  ctaDescription:
    "Bestill fertilitetssjekk direkte — ingen ventetid, ingen henvisning. Eller ta en gratis og uforpliktende prat med sykepleier om du er usikker på hva du trenger.",
};

export const sjekkFlow = [
  { n: "01", title: "Eggstokkreserve (AMH)", desc: "AMH er et hormon som sier noe om hvor mange egganlegg du har igjen — en indikator på fruktbarhetsvinduet ditt." },
  { n: "02", title: "Antall follikler (AFC)", desc: "Med ultralyd teller vi antall småfollikler — sammen med AMH gir dette et godt bilde av eggstokkreserven." },
  { n: "03", title: "Hormonstatus", desc: "Vi tar blodprøver for FSH, LH, østrogen og andre relevante hormoner som påvirker eggløsning og graviditet." },
  { n: "04", title: "Anatomisk vurdering", desc: "Vi ser på livmorens form og størrelse via ultralyd og fanger opp polypper eller myomer som kan påvirke fruktbarheten." },
  { n: "05", title: "Samtale med spesialist", desc: "Du møter en fertilitetsspesialist som gjennomgår alle funn med deg — og legger en plan om noe bør følges opp." },
  { n: "06", title: "Individuell plan", desc: "Basert på funnene setter vi opp det som er aktuelt: «vil følge opp» eller «her er neste behandling»." },
];

export const sjekkReasons = [
  { n: "01", title: "Planlegger å få barn — men ikke i dag", desc: "Du vil vite hva du har å forholde deg til før du tar valget." },
  { n: "02", title: "Har prøvd 6–12 måneder uten å bli gravid", desc: "En sjekk er det naturlige neste steget for å finne årsak." },
  { n: "03", title: "Vurderer å fryse eggene dine", desc: "Sjekken viser om du er i et godt vindu for nedfrysing." },
  { n: "04", title: "Har uregelmessig syklus eller hormonell ubalanse", desc: "PCOS, endometriose og andre tilstander påvirker fruktbarheten." },
  { n: "05", title: "Er mann og vil sjekke din del av bildet", desc: "Vi tilbyr sædanalyse — en enkel og rask test." },
];

export const sjekkRelated = [
  { eyebrow: "Behandling", title: "IVF — prøverørsbehandling", desc: "Hvis du har behov for hjelp på veien, er IVF den vanligste behandlingen vi tilbyr.", href: "/behandlinger/fertilitet/ivf" },
  { eyebrow: "Behandling", title: "IUI — inseminasjon", desc: "Et enklere første steg når årsaken er mild — eller når du ønsker donor.", href: "/behandlinger/fertilitet/iui" },
  { eyebrow: "Mulighet", title: "Nedfrysing av egg", desc: "Gir deg tid. Vi forklarer når det er riktig — og hva det innebærer.", href: "/behandlinger/fertilitet/nedfrysing" },
];

export const sjekkFaqs = [
  { question: "Trenger jeg henvisning?", answer: "Nei. Du booker direkte uten henvisning. Vi anbefaler en kort prat med sykepleier på forhånd om du er usikker." },
  { question: "Hvor lang tid tar det?", answer: "Selve sjekken tar ca. 45–60 minutter. Blodprøvesvar er klare innen kort tid og gjennomgås i samtale med spesialist." },
  { question: "Bør partneren bli med?", answer: "Hvis dere prøver å bli gravide sammen, anbefaler vi at begge tar en sjekk samtidig — det gir et helhetlig bilde." },
  { question: "Hva koster fertilitetssjekken?", answer: "Prisen er åpen og oppgis i forkant av timen. Se prislisten for oppdaterte priser." },
];
