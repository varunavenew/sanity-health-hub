import type { CategoryLandingSeed } from "./category-landing-types";

/** Norwegian category landing seeds (mirrors categoryPageContent.ts). */

const gynekologi: CategoryLandingSeed = {
  id: "gynekologi",
  title: "Gynekologi",
  description:
    "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier. Vårt mål er å gjøre kvinnehelse til folkehelse, i hele Norden.",
  longDescription:
    "Hos oss møter du gynekologer som jobber med den kvinnesykdommen de kan aller best, og ved behov tilbyr vi tverrfaglig behandling med gynekologer, fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer.",
  servicesHeading: "Alt under samme tak",
  servicesIntro:
    "Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:",
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
    "Vulvalidelser": "/behandlinger/gynekologi/vulvalidelser",
    "Gynekologisk kirurgi": "/behandlinger/gynekologi/kirurgi",
    "Robotassistert kirurgi": "/behandlinger/gynekologi/robotkirurgi",
  },
  groups: [
    { label: "Den vanlige timen", serviceNames: ["Gynekologisk undersøkelse", "Celleforandringer"] },
    {
      label: "Når noe ikke kjennes riktig",
      serviceNames: ["Endometriose", "Blødningsforstyrrelser", "Cyster på eggstokkene", "PMS og PMDD", "Vulvalidelser"],
    },
    { label: "Livet skifter form", serviceNames: ["Urinlekkasje", "Overgangsalder", "Vaginale fremfall"] },
    {
      label: "Når kirurgi er svaret",
      serviceNames: ["Fjerne livmor", "Labiaplastikk", "Gynekologisk kirurgi", "Robotassistert kirurgi"],
    },
  ],
  journey: [
    { label: "Steg 01", title: "Bestill når det passer deg", body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { label: "Steg 02", title: "Samtalen som rekker", body: "En gynekolog som utelukkende jobber med din kvinnesykdom. Vi går gjennom historikk, plager og hva du ønsker hjelp med." },
    { label: "Steg 03", title: "Utredning og plan", body: "En vanlig utredning hos oss varer ca 30 minutter. Trygg klinisk undersøkelse og en konkret plan – på et språk du forstår." },
    { label: "Steg 04", title: "Tverrfaglig oppfølging", body: "Ved behov tilbyr vi tverrfaglig behandling med fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer." },
  ],
  bookingPath: "/booking?kategori=gynekologi",
};

const urologi: CategoryLandingSeed = {
  id: "urologi",
  title: "Urologi",
  description:
    "Urologi er en medisinsk spesialitet som omhandler plager og sykdommer knyttet til mannens underliv og urinorganer hos begge kjønn herunder penis, prostata, testikler, urinblære og nyrer. Har du smerter, forstyrrelser med vannlating eller bare ønsker en generell sjekk, vil vår gruppe av spesialister kunne hjelpe.",
  longDescription: "I CMedical har vi flere av Nordens ledende spesialister innen urologi.",
  servicesHeading: "Urologispesialister",
  servicesIntro:
    "Våre spesialister jobber med de fagområdene de kan best. Vi har noen av Nordens ledende spesialister på følgende områder:",
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
  journey: [
    { label: "Steg 01", title: "Bestill når det passer deg", body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { label: "Steg 02", title: "Konsultasjon med spesialist", body: "En urolog som er spesialist på din plage. Vi går gjennom symptomer, historikk og hva du ønsker hjelp med." },
    { label: "Steg 03", title: "Utredning og plan", body: "En vanlig utredning varer ca 30 minutter. Klinisk undersøkelse og en konkret behandlingsplan – på et språk du forstår." },
    { label: "Steg 04", title: "Behandling og oppfølging", body: "Vi tilbyr alt fra konservativ behandling til avansert urologisk kirurgi, med tett oppfølging gjennom hele forløpet." },
  ],
  bookingPath: "/booking?kategori=urologi",
};

const ortopedi: CategoryLandingSeed = {
  id: "ortopedi",
  title: "Ortopedi",
  description:
    "Ortopedi er en medisinsk spesialitet som tar seg av problemer med muskler, bein, ledd og sener i kroppen. Våre ortopeder er eksperter på å behandle skader og sykdommer knyttet til skulder, hånd, fot og albue.",
  longDescription: "Hos oss jobber noen av landets fremste kirurger med avanserte caser.",
  servicesHeading: "Erfarne spesialister",
  servicesIntro:
    "Våre ortopeder er alle spesialister med høy kompetanse innen sine felt. På grunn av vår erfaring får vi ofte pasienter til såkalt second opinion. Hos oss får du tilgang på den samme ekspertisen som du får hos de store universitetssykehusene.",
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
  journey: [
    { label: "Steg 01", title: "Bestill når det passer deg", body: "Online booking døgnet rundt. Ingen henvisning. Korte ventetider, også for second opinion." },
    { label: "Steg 02", title: "Klinisk undersøkelse", body: "En erfaren ortoped går gjennom skaden eller plagen din, og setter sammen et godt bilde av hva som faktisk skjer." },
    { label: "Steg 03", title: "Diagnose og behandlingsplan", body: "Med moderne bildediagnostikk og oppdaterte metoder lager vi en plan – fra konservativ behandling til kirurgi." },
    { label: "Steg 04", title: "Behandling og opptrening", body: "Vi følger deg gjennom hele forløpet – fra inngrep til opptrening, med tett samarbeid med fysioterapeuter." },
  ],
  bookingPath: "/booking?kategori=ortopedi",
};

const graviditet: CategoryLandingSeed = {
  id: "graviditet",
  title: "Graviditet og fostermedisin",
  description:
    "Vi tilbyr trygg og helhetlig oppfølging gjennom svangerskapet, med erfarne fostermedisinere, jordmødre og psykologer som ser hele deg – ikke bare graviditeten.",
  longDescription:
    "Fra tidlig ultralyd og NIPT til oppfølging etter fødsel – vi er der for deg, partneren din og babyen.",
  servicesHeading: "Trygghet gjennom hele reisen",
  servicesIntro:
    "Våre tilbud dekker hele svangerskapet og tiden etter fødsel. Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele forløpet.",
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
  journey: [
    { label: "Steg 01", title: "Bestill den timen du trenger", body: "Du kan komme til enkeltkonsultasjoner eller følges av oss gjennom hele svangerskapet. Ingen henvisning." },
    { label: "Steg 02", title: "Trygg utredning og samtale", body: "Erfarne fostermedisinere, gynekologer og jordmødre tar seg god tid – og forklarer alt på et språk du forstår." },
    { label: "Steg 03", title: "Plan tilpasset deg", body: "Vi setter sammen en plan basert på dine ønsker, behov og hvor du er i svangerskapet." },
    { label: "Steg 04", title: "Helhetlig oppfølging", body: "Ved behov samarbeider vi med psykologer, fysioterapeuter og barselomsorg – også for partneren din." },
  ],
  bookingPath: "/booking?kategori=graviditet",
};

const flereFagomrader: CategoryLandingSeed = {
  id: "flere-fagomrader",
  title: "Flere fagområder",
  description:
    "Vi har samlet noen av Nordens fremste spesialister innen gastrokirurgi, revmatologi, dermatologi, ernæringsfysiologi, karkirurgi, osteopati, psykologi og sexologi.",
  longDescription:
    "Ofte jobber spesialistene i kryssdisiplinære team for å gi deg den beste behandlingen. Husk at du alltid kan ta kontakt med oss hvis du lurer på noe.",
  servicesHeading: "Spesialister på tvers",
  servicesIntro:
    "Ledende spesialister som utelukkende jobber med fagområdet de kan aller best, og vi har noen av Nordens ledende på disse områdene:",
  serviceLinks: {
    "Endokrinologi": "/behandlinger/flere-fagomrader/endokrinologi",
    "Ernæringsfysiolog": "/behandlinger/flere-fagomrader/ernaringsfysiolog",
    "Hudlege": "/behandlinger/flere-fagomrader/hudlege",
    "Hudhelse": "/behandlinger/flere-fagomrader/hudhelse",
    "Gastrokirurgi": "/behandlinger/flere-fagomrader/gastrokirurgi",
    "Overvektskirurgi": "/behandlinger/flere-fagomrader/overvektskirurgi",
    "Plastikkirurgi": "/behandlinger/flere-fagomrader/plastikkirurgi",
    "Robotassistert kirurgi": "/behandlinger/flere-fagomrader/robotkirurgi",
    "Åreknuter": "/behandlinger/flere-fagomrader/areknuter",
    "Osteopati": "/behandlinger/flere-fagomrader/osteopati",
    "Revmatologi": "/behandlinger/flere-fagomrader/revmatologi",
    "Psykologi": "/behandlinger/flere-fagomrader/psykologi",
    "Sexologi": "/behandlinger/flere-fagomrader/sexologi",
  },
  groups: [
    { label: "Hud, hormoner og ernæring", serviceNames: ["Endokrinologi", "Ernæringsfysiolog", "Hudlege", "Hudhelse"] },
    { label: "Mage og kirurgi", serviceNames: ["Gastrokirurgi", "Overvektskirurgi", "Plastikkirurgi", "Robotassistert kirurgi"] },
    { label: "Kropp og bevegelse", serviceNames: ["Osteopati", "Revmatologi", "Åreknuter"] },
    { label: "Mental helse og samliv", serviceNames: ["Psykologi", "Sexologi"] },
  ],
  journey: [
    { label: "Steg 01", title: "Bestill når det passer deg", body: "Online booking døgnet rundt. Ingen henvisning. Vi har fra ingen til svært korte ventetider." },
    { label: "Steg 02", title: "Snakk med riktig spesialist", body: "Du møter en spesialist som utelukkende jobber med fagområdet du trenger hjelp med." },
    { label: "Steg 03", title: "Utredning og plan", body: "Vi setter sammen et helhetsbilde – og lager en konkret plan, ofte i samarbeid med flere fagfelt." },
    { label: "Steg 04", title: "Tverrfaglig oppfølging", body: "Ved behov jobber vi i kryssdisiplinære team for å gi deg den beste, mest helhetlige behandlingen." },
  ],
  bookingPath: "/booking?kategori=flere-fagomrader",
};

const fertilitet: CategoryLandingSeed = {
  id: "fertilitet",
  title: "Fertilitet",
  description:
    "Velkommen til Nordens mest komplette private fertilitetstilbud. Hos oss i CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – enten du er ny pasient eller kommer fra en annen klinikk.",
  longDescription:
    "Vi er den første klinikken i Norden med IVF-behandling og kirurgi samlet på ett sted, og vi tilbyr forskningsbasert behandling kombinert med personlig tilpasset oppfølging.",
  servicesHeading: "Fertilitetsspesialister",
  servicesIntro:
    "Hos CMedical fertilitet jobber vi i et tverrfaglig team. IVF-teamet består av gynekologer med subspesialisering innen fertilitet, IVF-sykepleiere og embryologer. Som pasient ved CMedical er du i trygge hender.",
  serviceLinks: {
    "Infertilitet": "/behandlinger/fertilitet/infertilitet",
    "Assistert befruktning": "/behandlinger/fertilitet/assistert-befruktning",
    "IVF": "/behandlinger/fertilitet/ivf",
    "Assistert befruktning med donor": "/behandlinger/fertilitet/donorbehandling",
    "Eggfrys": "/behandlinger/fertilitet/eggfrys",
    "Sædanalyse": "/behandlinger/fertilitet/saedanalyse",
    "Hysteroskopi": "/behandlinger/fertilitet/hysteroskopi",
    "Vårt team": "/behandlinger/fertilitet/teamet",
  },
  groups: [
    { label: "Når graviditeten lar vente på seg", serviceNames: ["Infertilitet", "Sædanalyse"] },
    { label: "Assistert befruktning", serviceNames: ["IVF", "Assistert befruktning", "Assistert befruktning med donor"] },
    { label: "For fremtiden", serviceNames: ["Eggfrys"] },
    { label: "Utredning og inngrep", serviceNames: ["Hysteroskopi", "Vårt team"] },
  ],
  journey: [
    { label: "Steg 01", title: "Uforpliktende kontakt", body: "Bestill en kostnadsfri prat med en av våre IVF-sykepleiere, eller book konsultasjon direkte. Ingen henvisning." },
    { label: "Steg 02", title: "Konsultasjon og utredning", body: "Sammen med en fertilitetsspesialist går vi gjennom historikk, prøver og hva som kan være riktig vei videre for deg." },
    { label: "Steg 03", title: "Personlig behandlingsplan", body: "Vi setter opp en plan tilpasset deg – fra hormonbehandling og inseminasjon til IVF, ICSI og donorbehandling." },
    { label: "Steg 04", title: "Tett oppfølging gjennom hele reisen", body: "Vårt tverrfaglige team følger deg tett – med både medisinsk, psykologisk og praktisk støtte når du trenger det." },
  ],
  bookingPath: "/booking?kategori=fertilitet",
};

export const categoryLandingNo: Record<string, CategoryLandingSeed> = {
  gynekologi,
  urologi,
  ortopedi,
  graviditet,
  "flere-fagomrader": flereFagomrader,
  fertilitet,
};
