import { useParams, Link, Navigate } from "react-router-dom";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * MalDemo – komplette mastermal-sider for kundegodkjenning.
 *
 * Hver mal viser ALLE tilgjengelige seksjonstyper samlet på én side,
 * slik at kunden kan godkjenne den fullkomne malen. Innholdet kan
 * tilpasses i ettertid per faktisk side i Sanity.
 */

type Section = { _type: string; _key: string; enabled?: boolean; [k: string]: any };

const heroSection = (heading: string, eyebrow: string, subheading: string): Section => ({
  _type: "sectionHero",
  _key: "hero",
  eyebrow,
  heading,
  subheading,
  ctaLabel: "Bestill time",
  ctaHref: "/booking",
});

const introSection = (heading: string, body: string): Section => ({
  _type: "sectionIntro",
  _key: "intro",
  heading,
  body,
});

const statsSection: Section = {
  _type: "sectionStats",
  _key: "stats",
  background: "dark",
  heading: "Erfaring du kan stole på",
  items: [
    { _key: "s1", value: "25+", label: "Års erfaring" },
    { _key: "s2", value: "40 000", label: "Konsultasjoner årlig" },
    { _key: "s3", value: "98%", label: "Pasienttilfredshet" },
    { _key: "s4", value: "5", label: "Klinikker" },
  ],
};

const benefitsSection: Section = {
  _type: "sectionBenefits",
  _key: "benefits",
  heading: "Hva du kan forvente",
  items: [
    "Kort ventetid – ofte time samme uke",
    "Erfarne spesialister med tverrfaglig samarbeid",
    "Moderne utstyr og trygge rammer",
    "Tydelig oppfølging etter konsultasjon",
  ],
};

const processSection: Section = {
  _type: "sectionProcess",
  _key: "process",
  heading: "Slik foregår det",
  steps: [
    { title: "Bestill time", description: "Velg klinikk, dag og spesialist online eller på telefon." },
    { title: "Konsultasjon", description: "Grundig samtale, undersøkelse og plan tilpasset deg." },
    { title: "Oppfølging", description: "Klar dokumentasjon og videre plan – med tilgang til ditt team." },
  ],
};

const journeySection: Section = {
  _type: "sectionJourney",
  _key: "journey",
  heading: "Din vei gjennom oss",
  steps: [
    { _key: "j1", icon: "calendar", label: "Steg 01", title: "Booking", body: "Velg det som passer deg." },
    { _key: "j2", icon: "stethoscope", label: "Steg 02", title: "Utredning", body: "Trygg og grundig kartlegging." },
    { _key: "j3", icon: "heart", label: "Steg 03", title: "Behandling", body: "Skreddersydd plan og tiltak." },
    { _key: "j4", icon: "users", label: "Steg 04", title: "Oppfølging", body: "Vi følger deg helt i mål." },
  ],
};

const servicesListSection: Section = {
  _type: "sectionServicesList",
  _key: "services",
  heading: "Behandlinger i denne kategorien",
  intro: "Et utvalg av hva vi tilbyr. Klikk for å lese mer.",
  manualItems: [
    { label: "Konsultasjon og undersøkelse", path: "#" },
    { label: "Utredning og diagnostikk", path: "#" },
    { label: "Kirurgisk behandling", path: "#" },
    { label: "Oppfølging og kontroll", path: "#" },
  ],
};

const serviceGroupsSection: Section = {
  _type: "sectionServiceGroups",
  _key: "groups",
  heading: "Tjenester gruppert etter tema",
  groups: [
    { _key: "g1", caption: "Utredning", label: "Diagnostikk", items: ["Førstegangs konsultasjon", "Bildediagnostikk", "Laboratorieprøver"] },
    { _key: "g2", caption: "Behandling", label: "Inngrep", items: ["Dagkirurgi", "Robotassistert kirurgi", "Minimal-invasive inngrep"] },
    { _key: "g3", caption: "Etter", label: "Oppfølging", items: ["Kontroll", "Rehabilitering", "Tverrfaglig team"] },
  ],
};

const accordionSection: Section = {
  _type: "sectionAccordionContent",
  _key: "accordion",
  heading: "Detaljert informasjon",
  items: [
    { _key: "a1", heading: "Hvordan forberede deg", content: "Møt opp 10 minutter før timen. Ta med legitimasjon og eventuell henvisning." },
    { _key: "a2", heading: "Hva koster det", content: "Priser finner du på prislisten. Forsikring dekker ofte konsultasjon og inngrep." },
    { _key: "a3", heading: "Etter behandling", content: "Du får skriftlig oppsummering og plan for videre oppfølging." },
  ],
};

const linkedServicesSection: Section = {
  _type: "sectionLinkedServices",
  _key: "linked",
  heading: "Relaterte behandlinger",
  items: [
    { label: "Gynekologisk undersøkelse", description: "Trygg, grundig undersøkelse hos erfaren spesialist.", path: "/behandlinger/gynekologi/undersokelse" },
    { label: "Fertilitetssjekk", description: "Komplett kartlegging av din fruktbarhet.", path: "/behandlinger/fertilitet/fertilitetssjekk" },
  ],
};

const quoteSection: Section = {
  _type: "sectionQuote",
  _key: "quote",
  quote: "Jeg følte meg sett og ivaretatt fra første øyeblikk. Klare svar og en plan jeg forsto.",
  source: "Pasient, 38 år",
};

const richTextSection: Section = {
  _type: "sectionRichText",
  _key: "rich",
  heading: "Mer om temaet",
  body:
    "Vi tror på **trygghet, kompetanse og kontinuitet**. Det betyr at du møter samme team gjennom hele forløpet, og at vi tar oss tid til å forklare.\n\nLes mer i vår [pasientguide](/guide).",
};

const faqSection: Section = {
  _type: "sectionFaq",
  _key: "faq",
  heading: "Ofte stilte spørsmål",
  intro: "Svar på det pasienter oftest lurer på.",
  items: [
    { _key: "f1", question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte hos oss." },
    { _key: "f2", question: "Dekker forsikringen?", answer: "De fleste helseforsikringer dekker konsultasjon og inngrep hos oss." },
    { _key: "f3", question: "Hvor raskt får jeg time?", answer: "Som regel innen en uke – ofte raskere." },
  ],
};

const ctaSection: Section = {
  _type: "sectionCta",
  _key: "cta",
  background: "dark",
  heading: "Klar for å ta neste steg?",
  body: "Bestill time online eller ring oss. Vi er her for deg.",
  ctaLabel: "Bestill time nå",
  ctaHref: "/booking",
};

/* ───────── Mal-definisjoner ───────── */

const TEMPLATES: Record<
  string,
  { title: string; description: string; sections: Section[] }
> = {
  treatmentCategory: {
    title: "Mal: Fagområde",
    description:
      "Mastermal for hovedkategorier som Gynekologi, Fertilitet, Urologi. Alle seksjonstyper er vist samlet.",
    sections: [
      heroSection(
        "Fagområde – komplett mal",
        "Mastermal · Fagområde",
        "Eksempel på et fagområde med hero, intro, statistikk, tjenester, prosess, accordion, FAQ og CTA."
      ),
      introSection(
        "Trygg spesialisthelsetjeneste",
        "Vi tilbyr utredning, behandling og oppfølging innen [fagområde]. Hele forløpet skjer hos oss – med erfarne spesialister og tverrfaglige team."
      ),
      statsSection,
      servicesListSection,
      serviceGroupsSection,
      benefitsSection,
      processSection,
      journeySection,
      accordionSection,
      quoteSection,
      faqSection,
      ctaSection,
    ],
  },
  themePage: {
    title: "Mal: Temaside",
    description:
      "Mastermal for tverrgående temaer som Kvinnehelse, Robotkirurgi. Fleksibel seksjonsoppbygging.",
    sections: [
      heroSection(
        "Temaside – komplett mal",
        "Mastermal · Tema",
        "Tverrgående tema som samler flere fagområder og behandlinger under én historie."
      ),
      introSection(
        "Et samlet tilbud rundt deg",
        "Denne malen brukes for tematiske inngangsporter som kobler sammen flere fagområder."
      ),
      richTextSection,
      linkedServicesSection,
      statsSection,
      quoteSection,
      benefitsSection,
      faqSection,
      ctaSection,
    ],
  },
  treatment: {
    title: "Mal: Underbehandling",
    description:
      "Mastermal for enkeltbehandlinger under et fagområde. Symptomer og prosess utenfor accordions.",
    sections: [
      heroSection(
        "Underbehandling – komplett mal",
        "Mastermal · Behandling",
        "Eksempel på en enkeltbehandling med detaljert pasientforløp og fagstoff."
      ),
      introSection(
        "Hva er denne behandlingen?",
        "Kort, klar beskrivelse av hva behandlingen innebærer, hvem den passer for, og hva pasienten kan forvente."
      ),
      benefitsSection,
      processSection,
      journeySection,
      accordionSection,
      quoteSection,
      faqSection,
      ctaSection,
    ],
  },
  newsItem: {
    title: "Mal: Nyhet / Aktuelt",
    description:
      "Mastermal for korte nyhetsoppslag. Kompakt struktur for løpende publisering.",
    sections: [
      heroSection(
        "Nyhetsoppslag – komplett mal",
        "Mastermal · Aktuelt",
        "Kort nyhetsoppslag med ingress, brødtekst, sitat og CTA."
      ),
      introSection(
        "Ingress",
        "En kort ingress som oppsummerer hovedpoenget i nyheten. Vises både på siden og i Aktuelt-feeden."
      ),
      richTextSection,
      quoteSection,
      ctaSection,
    ],
  },
  article: {
    title: "Mal: Fagartikkel",
    description:
      "Mastermal for lengre redaksjonelle artikler med pinning, kategorier og SEO.",
    sections: [
      heroSection(
        "Fagartikkel – komplett mal",
        "Mastermal · Artikkel",
        "Eksempel på en lengre fagartikkel med rik tekst, FAQ og relaterte tjenester."
      ),
      introSection(
        "Forfatterens ingress",
        "En lengre ingress som setter scenen for artikkelen og gir leseren grunn til å lese videre."
      ),
      richTextSection,
      accordionSection,
      quoteSection,
      linkedServicesSection,
      faqSection,
      ctaSection,
    ],
  },
};

export default function MalDemo() {
  const { key = "" } = useParams();
  const mal = TEMPLATES[key];

  if (!mal) return <Navigate to="/godkjenning" replace />;

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Mal-banner */}
      <div className="bg-brand-dark text-brand-light">
        <div className="container mx-auto px-6 md:px-16 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-light">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-light/10 text-xs uppercase tracking-wide">
              Mastermal
            </span>
            <span className="hidden sm:inline">{mal.title}</span>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link to="/godkjenning" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Til godkjenning
            </Link>
          </Button>
        </div>
      </div>

      {/* Intro */}
      <header className="container mx-auto px-6 md:px-16 pt-12 pb-4 max-w-3xl">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Komplett mal med alle seksjoner
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">{mal.title}</h1>
        <p className="text-muted-foreground font-light">{mal.description}</p>
      </header>

      <SectionRenderer sections={mal.sections} />

      {/* Footer-CTA tilbake til godkjenning */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-6 md:px-16 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-light text-muted-foreground">Ferdig med å se gjennom?</p>
            <p className="text-foreground font-normal">Gå tilbake og godkjenn eller be om endringer.</p>
          </div>
          <Button asChild>
            <Link to="/godkjenning">Til godkjenning</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
