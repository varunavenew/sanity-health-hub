// Shared real content for /gynekologi design variants.
// Sourced from the static fallback in src/site-pages/treatments/CategoryPage.tsx
// to keep all variants in sync with what is shown on /gynekologi today.

import {
  Stethoscope, Droplets, Ribbon, Sun, HeartPulse, Activity, Microscope,
  CircleDot, Scissors, Heart, Flower2, ShieldCheck, Bot, Pill, Scan,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gynekologiReal from "@/assets/categories/gynekologi-real.jpg";
import gynekologiHero from "@/assets/categories/gynekologi.jpg";
import fertilitetReal from "@/assets/categories/fertilitet-real.jpg";
import flereReal from "@/assets/categories/flere-fagomrader.jpg";

export const gynekologiContent = {
  title: "Gynekologi",
  subtitle: "Ingen ventetid • Ingen henvisning",
  description:
    "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier. Vårt mål er å gjøre kvinnehelse til folkehelse, i hele Norden.\n\nHos oss møter du gynekologer som jobber med den kvinnesykdommen de kan aller best, og ved behov tilbyr vi tverrfaglig behandling med gynekologer, fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer.",
  servicesHeading: "Alt under samme tak",
  servicesIntro:
    "Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:",
};

export interface GynService {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const gynekologiServices: GynService[] = [
  { name: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse", icon: Stethoscope },
  { name: "Urinlekkasje", path: "/behandlinger/gynekologi/urinlekkasje", icon: Droplets },
  { name: "Endometriose", path: "/behandlinger/gynekologi/endometriose", icon: Ribbon },
  { name: "Overgangsalder", path: "/behandlinger/gynekologi/overgangsalder", icon: Sun },
  { name: "Vaginale fremfall", path: "/behandlinger/gynekologi/vaginale-fremfall", icon: HeartPulse },
  { name: "Blødningsforstyrrelser", path: "/behandlinger/gynekologi/blodningsforstyrrelser", icon: Activity },
  { name: "Celleforandringer", path: "/behandlinger/gynekologi/celleforandringer", icon: Microscope },
  { name: "Cyster på eggstokkene", path: "/behandlinger/gynekologi/cyster", icon: CircleDot },
  { name: "Fjerne livmor", path: "/behandlinger/gynekologi/fjerne-livmor", icon: Scissors },
  { name: "PMS og PMDD", path: "/behandlinger/gynekologi/pms-pmdd", icon: Heart },
  { name: "Labiaplastikk", path: "/behandlinger/gynekologi/labiaplastikk", icon: Flower2 },
  { name: "Vaginal tørrhet", path: "/behandlinger/gynekologi/vaginal-torrhet", icon: Droplets },
  { name: "Vulvalidelser", path: "/behandlinger/gynekologi/vulvalidelser", icon: ShieldCheck },
  { name: "Gynekologisk kirurgi", path: "/behandlinger/gynekologi/kirurgi", icon: Scissors },
  { name: "Robotassistert kirurgi", path: "/behandlinger/gynekologi/robotkirurgi", icon: Bot },
];

export const gynekologiFaqs = [
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

// Thematic groupings of the same 15 services – useful for editorial/journey
// variants that want to tell a story without inventing new services.
// Each group has an associated image from the brand-approved category library
// so visual variants can lead each chapter with imagery in the house style.
export const gynekologiServiceGroups = [
  {
    label: "Den vanlige timen",
    caption: "Rutine, screening og forebygging",
    image: gynekologiHero,
    serviceNames: ["Gynekologisk undersøkelse", "Celleforandringer", "Vaginal tørrhet"],
  },
  {
    label: "Når noe ikke kjennes riktig",
    caption: "Utredning av smerter, blødninger og plager",
    image: gynekologiReal,
    serviceNames: [
      "Endometriose",
      "Blødningsforstyrrelser",
      "PMS og PMDD",
      "Cyster på eggstokkene",
      "Vulvalidelser",
    ],
  },
  {
    label: "Livet skifter form",
    caption: "Overgangsalder, fødselsskader og hormonelle faser",
    image: fertilitetReal,
    serviceNames: ["Overgangsalder", "Urinlekkasje", "Vaginale fremfall"],
  },
  {
    label: "Når kirurgi er svaret",
    caption: "Skånsom og robotassistert gynekologisk kirurgi",
    image: flereReal,
    serviceNames: [
      "Gynekologisk kirurgi",
      "Robotassistert kirurgi",
      "Fjerne livmor",
      "Labiaplastikk",
    ],
  },
];
