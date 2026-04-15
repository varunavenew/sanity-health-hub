import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LeadPopup } from "@/components/LeadPopup";
import { StickyBookingCTA } from "@/components/StickyBookingCTA";
import {
  ArrowRight, ChevronRight, ChevronLeft, Plus, Minus, Phone, MapPin,
  Stethoscope, Droplets, Ribbon, Sun, HeartPulse, Microscope, Scissors,
  Baby, Syringe, Flower2, ShieldCheck, Scan, CircleDot, Bot, Hand,
  Bone, Footprints, Activity, Apple, Brain, Smile, Heart, Users,
  Pill, Dna, Snowflake, FlaskConical, TestTube, BicepsFlexed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTreatmentCategory } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import type { LucideIcon } from "lucide-react";

// Static fallback images
import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";

// Icon mapping for treatment services
const serviceIconMap: Record<string, LucideIcon> = {
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
  "Infertilitet": Dna,
  "Assistert befruktning": FlaskConical,
  "Assistert befruktning med donor": TestTube,
  "Eggfrys": Snowflake,
  "Hormonforstyrrelser": Pill,
  "Hysteroskopi": Scan,
  "Blære og urinveier": Droplets,
  "Forhud": ShieldCheck,
  "Mannlig infertilitet": Dna,
  "Nyrer": Activity,
  "Prevensjon": Pill,
  "Fot og ankel": Footprints,
  "Hofte": BicepsFlexed,
  "Hånd og albue": Hand,
  "Kne": Bone,
  "Ultralyd": Scan,
  "NIPT": Microscope,
  "6-ukerskontroll etter fødsel": Baby,
  "Traumatisk fødsel": HeartPulse,
  "Fødselsangst": Heart,
  "For partnere": Users,
  "Fostermedisin": Baby,
  "Spontanabort": Heart,
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

const getServiceIcon = (name: string): LucideIcon => {
  return serviceIconMap[name] || Stethoscope;
};

interface SubService {
  name: string;
  subServices?: { name: string; path?: string }[];
  path?: string;
}

interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  servicesIntro?: string;
  servicesHeading?: string;
  heroImage: string;
  services: SubService[];
  faqs: { question: string; answer: string }[];
}

const getSpecialistLabel = (categoryId: string): string => {
  const labels: Record<string, string> = {
    gynekologi: 'gynekolog',
    urologi: 'urolog',
    fertilitet: 'fertilitetsspesialist',
    ortopedi: 'ortoped',
    'flere-fagomrader': 'spesialist',
  };
  return labels[categoryId] || 'spesialist';
};

// Static fallback data
const staticCategoryData: Record<string, CategoryData> = {
  urologi: {
    id: "urologi", title: "Urologi", subtitle: "Ingen ventetid • Ingen henvisning",
    description: "Urologi er en medisinsk spesialitet som omhandler plager og sykdommer knyttet til mannens underliv og urinorganer hos begge kjønn herunder penis, prostata, testikler urinblære og nyrer. Har du smerter, forstyrrelser med vannlating eller bare ønsker en generell sjekk vil vår gruppe av spesialister kunne hjelpe.\n\nI CMedical har vi flere av Nordens ledende spesialister innen urologi.",
    servicesHeading: "Urologispesialister",
    servicesIntro: "Våre spesialister jobber med de fagområdene de kan best. Vi har noen av Nordens ledende spesialister på følgende områder:",
    heroImage: urologiImg,
    services: [
      { name: "Blære og urinveier", path: "/behandlinger/urologi/blaere" },
      { name: "Forhud", path: "/behandlinger/urologi/forhud" },
      { name: "Mannlig infertilitet", path: "/behandlinger/urologi/infertilitet" },
      { name: "Nyrer", path: "/behandlinger/urologi/nyrer" },
      { name: "Prevensjon", path: "/behandlinger/urologi/prevensjon" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },
  fertilitet: {
    id: "fertilitet", title: "Fertilitet", subtitle: "Uten henvisning • Ingen ventetid",
    description: "Velkommen til Nordens mest komplette private fertilitetstilbud. Hos oss i CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – enten du er ny pasient eller kommer fra en annen klinikk.\n\nLivio Oslo er nå en del av CMedical. Som Norges eldste fertilitetsklinikk bringer Livio med seg lang erfaring og solid fagkompetanse inn i CMedical. Sammen tilbyr vi et helhetlig og trygt fertilitetstilbud, basert på kvalitet, kontinuitet og omsorg.\n\nVi er den første klinikken i Norden med IVF-behandling og kirurgi samlet på ett sted, og vi tilbyr forskningsbasert behandling kombinert med personlig tilpasset oppfølging.\n\nCMedical Fertilitet benytter det nyeste innen teknologiske hjelpemidler. Vi har en time-lapse-inkubator som sikrer nøyaktig og trygg overvåkning av befruktede egg, samt elektronisk overvåkning av alle steg i en prøverørsbehandling. Alle apparater er tilkoblet et eksternt alarmsystem som sikrer trygg oppbevaring av humane celler.\n\nFertilitetsbehandling kan oppleves som både følelsesmessig og fysisk krevende. Synes du det er vanskelig å sette seg inn i alt? Du er ikke alene. Ta gjerne kontakt med oss for en uforpliktende og kostnadsfri prat med en av våre sykepleiere, eller bestill time til konsultasjon.",
    servicesHeading: "Fertilitetsspesialister",
    servicesIntro: "Hos CMedical fertilitet jobber vi i et tverrfagelig team. IVF teamet består av gynekologer med subspesialisering innen fertilitet, IVF sykepleiere og embryologer. Våre embryologer har internasjonal erfaring fra store IVF klinikker i verden samt forskningserfaring og ESHRE sertifisering. Våre gynekologer har lang erfaring fra Reproduksjonsmedisinsk avdeling Oslo Universitetssykehus. Øvrig samarbeider gynekolog, urolog, ernæringsfysiolog, osteopat og fertilitetscoach for å kunne gi deg en trygg og helhetlig behandling. Som pasienten ved CMedical er du i trygge hender.",
    heroImage: fertilitetImg,
    services: [
      { name: "Infertilitet", path: "/behandlinger/fertilitet/infertilitet" },
      { name: "Assistert befruktning", path: "/behandlinger/fertilitet/assistert-befruktning" },
      { name: "Assistert befruktning med donor", path: "/behandlinger/fertilitet/donorbehandling" },
      { name: "Eggfrys", path: "/behandlinger/fertilitet/eggfrys" },
      { name: "Hormonforstyrrelser", path: "/behandlinger/fertilitet/hormonforstyrrelser" },
      { name: "Hysteroskopi", path: "/behandlinger/fertilitet/hysteroskopi" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },
  gynekologi: {
    id: "gynekologi", title: "Gynekologi", subtitle: "Ingen ventetid • Ingen henvisning",
    description: "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier. Vårt mål er å gjøre kvinnehelse til folkehelse, i hele Norden.\n\nHos oss møter du gynekologer som jobber med den kvinnesykdommen de kan aller best, og ved behov tilbyr vi tverrfaglig behandling med gynekologer, fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer.",
    servicesHeading: "Alt under samme tak",
    servicesIntro: "Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:",
    heroImage: gynekologiImg,
    services: [
      { name: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
      { name: "Urinlekkasje", path: "/behandlinger/gynekologi/urinlekkasje" },
      { name: "Endometriose", path: "/behandlinger/gynekologi/endometriose" },
      { name: "Overgangsalder", path: "/behandlinger/gynekologi/overgangsalder" },
      { name: "Vaginale fremfall", path: "/behandlinger/gynekologi/vaginale-fremfall" },
      { name: "Blødningsforstyrrelser", path: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { name: "Celleforandringer", path: "/behandlinger/gynekologi/celleforandringer" },
      { name: "Cyster på eggstokkene", path: "/behandlinger/gynekologi/cyster" },
      { name: "Fjerne livmor", path: "/behandlinger/gynekologi/fjerne-livmor" },
      { name: "PMS og PMDD", path: "/behandlinger/gynekologi/pms-pmdd" },
      { name: "Labiaplastikk", path: "/behandlinger/gynekologi/labiaplastikk" },
      { name: "Vaginal tørrhet", path: "/behandlinger/gynekologi/vaginal-torrhet" },
      { name: "Vulvalidelser", path: "/behandlinger/gynekologi/vulvalidelser" },
      { name: "Gynekologisk kirurgi", path: "/behandlinger/gynekologi/kirurgi" },
      { name: "Robotassistert kirurgi", path: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },
  graviditet: {
    id: "graviditet", title: "Graviditet og fostermedisin", subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vi tilbyr trygg og helhetlig oppfølging gjennom svangerskapet.",
    heroImage: gynekologiImg,
    services: [
      { name: "Ultralyd", path: "/behandlinger/graviditet/ultralyd" },
      { name: "NIPT", path: "/behandlinger/graviditet/nipt" },
      { name: "6-ukerskontroll etter fødsel", path: "/behandlinger/graviditet/6-ukerskontroll" },
      { name: "Traumatisk fødsel", path: "/behandlinger/graviditet/traumatisk-fodsel" },
      { name: "Fødselsangst", path: "/behandlinger/graviditet/fodselsangst" },
      { name: "For partnere", path: "/behandlinger/graviditet/for-partnere" },
      { name: "Fostermedisin", path: "/behandlinger/graviditet/fostermedisin" },
      { name: "Spontanabort", path: "/behandlinger/graviditet/spontanabort" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Utredning", answer: "Vi tilbyr grundig utredning og oppfølging gjennom hele svangerskapet." },
    ],
  },
  "flere-fagomrader": {
    id: "flere-fagomrader", title: "Flere fagområder", subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vi har samlet noen av Nordens fremste spesialister innen gastrokirurgi, revmatologi, dermatologi, ernæringsfysologi, karkirurgi, osteopati, psykologi og sexologi. Ofte jobber spesialistene i kryssdisiplinære team for å gi deg den beste behandlingen. Husk at du alltid kan ta kontakt med oss hvis du lurer på noe.",
    servicesHeading: "Spesialist",
    servicesIntro: "Ledende spesialister som utelukkende jobber med fagområdet de kan aller best, og vi har noen av Nordens ledende på disse områdene:",
    heroImage: flereFagomraderImg,
    services: [
      { name: "Endokrinologi", path: "/behandlinger/flere-fagomrader/endokrinologi" },
      { name: "Ernæringsfysiolog", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
      { name: "Hudlege", path: "/behandlinger/flere-fagomrader/hudlege" },
      { name: "Gastrokirurgi", path: "/behandlinger/flere-fagomrader/gastrokirurgi" },
      { name: "Overvektskirurgi", path: "/behandlinger/flere-fagomrader/overvektskirurgi" },
      { name: "Osteopati", path: "/behandlinger/flere-fagomrader/osteopati" },
      { name: "Psykologi", path: "/behandlinger/flere-fagomrader/psykologi" },
      { name: "Sexologi", path: "/behandlinger/flere-fagomrader/sexologi" },
      { name: "Kvinnehelse", path: "/behandlinger/flere-fagomrader/kvinnehelse" },
      { name: "Tverrfaglig team", path: "/behandlinger/flere-fagomrader/tverrfaglig" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },
  ortopedi: {
    id: "ortopedi", title: "Ortopedi", subtitle: "Ingen ventetid • Ingen henvisning",
    description: "Ortopedi er en medisinsk spesialitet som tar seg av problemer med muskler, bein, ledd og sener i kroppen. Våre ortopeder er eksperter på å behandle skader og sykdommer knyttet til skulder, hånd, fot og albue. Hos oss jobber noen av landets fremste kirurger med avanserte caser.",
    servicesHeading: "Erfarne spesialister",
    servicesIntro: "Våre ortopeder er alle spesialister med høy kompetanse innen sine felt. På grunn av vår erfaring, får vi ofte pasienter til såkalt second opinion hvor pasientene trenger ny operasjon eller har kompliserte skader. Vi benytter et bredt spekter av anerkjente behandlingsformer og er til enhver tid oppdatert. Hos oss får du tilgang på den samme ekspertisen som du får hos de store universitetssykehusene.",
    heroImage: ortopediImg,
    services: [
      { name: "Fot og ankel", path: "/behandlinger/ortopedi/fot-ankel" },
      { name: "Hofte", path: "/behandlinger/ortopedi/hofte" },
      { name: "Hånd og albue", path: "/behandlinger/ortopedi/hand-albue" },
      { name: "Kne", path: "/behandlinger/ortopedi/kne" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },
};

// Specialists component for category pages
const CategorySpecialists = ({ categoryId, categoryTitle }: { categoryId: string; categoryTitle: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { specialists } = useSpecialistsData();
  
  const categorySpecialists = specialists.filter(
    (specialist) => specialist.category === categoryId
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      });
    }
  };

  if (categorySpecialists.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-white/70 font-light mb-3">Våre {categoryTitle.toLowerCase()}-eksperter</p>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
              Møt våre {categoryTitle.toLowerCase()}-spesialister
            </h2>
            <p className="text-white/70 font-light">
              Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll('left')} aria-label="Scroll spesialister til venstre" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button onClick={() => scroll('right')} aria-label="Scroll spesialister til høyre" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <Button variant="cta-dark" className="rounded-2xl">
              Se alle {categorySpecialists.length} spesialister
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-16 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {categorySpecialists.map((specialist) => (
          <Link to={`/spesialister/${specialist.slug}`} key={specialist.name} className="group flex-shrink-0 w-[280px] snap-start">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-3 bg-brand-dark">
              <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

              {specialist.clinics && specialist.clinics.length > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white/80 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" aria-hidden="true" />
                  {specialist.clinics.join(' · ')}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white mb-0.5">{specialist.name}</h3>
                <p className="text-sm text-white/70 font-light">
                  {specialist.title}
                  {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70 font-normal px-1">{specialist.expertise.join(', ')}</p>
          </Link>
        ))}
        
        <Link to="/spesialister" className="flex-shrink-0 w-[280px] snap-start">
          <div className="aspect-[3/4] rounded-lg bg-white/10 border border-white/20 flex flex-col items-center justify-center hover:bg-white/15 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-accent" aria-hidden="true" />
            </div>
            <p className="text-white font-normal mb-1">Se alle</p>
            <p className="text-white/60 text-sm font-light">{categorySpecialists.length} spesialister</p>
          </div>
        </Link>
      </div>

      <div className="md:hidden flex justify-center mt-4 gap-1">
        <span className="text-xs text-white/60">Sveip for å se flere →</span>
      </div>
    </section>
  );
};

/**
 * ─── LAYOUT ALIGNMENT RULE ───
 * Text sections use max-w-3xl for readable line lengths.
 * Grid sections (services, cards) use full container width for better use of space.
 */
const TEXT_MAX_W = "max-w-3xl";
const GRID_MAX_W = "max-w-6xl";

interface CategoryPageProps {
  categoryId: string;
  isChatOpen: boolean;
}

export const CategoryPage = ({ categoryId, isChatOpen }: CategoryPageProps) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  const { data: sanityCategory } = useTreatmentCategory(categoryId);
  const staticCategory = staticCategoryData[categoryId];

  const category: CategoryData | undefined = sanityCategory
    ? {
        id: sanityCategory.categoryId || sanityCategory.slug || categoryId,
        title: sanityCategory.title,
        subtitle: "Kort ventetid • Ingen henvisning",
        description: sanityCategory.description || staticCategory?.description || "",
        heroImage: sanityCategory.heroImage || staticCategory?.heroImage || "",
        services: (sanityCategory.services || []).map((s: any) => ({
          name: s.name,
          path: s.path,
        })),
        faqs: sanityCategory.faqs?.length ? sanityCategory.faqs : (staticCategory?.faqs || []),
      }
    : staticCategory;
  
  useEffect(() => {
    if (category) {
      document.title = `${category.title} | CMedical`;
    }
  }, [category]);

  if (!category) {
    return <div>Kategori ikke funnet</div>;
  }

  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const handleServiceClick = (service: SubService) => {
    if (service.subServices && service.subServices.length > 0) {
      setExpandedService(expandedService === service.name ? null : service.name);
    } else if (service.path) {
      navigate(service.path);
    }
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={`${category.title} – Spesialistbehandling hos CMedical`}
        description={category.description.split('\n')[0].slice(0, 155)}
        canonical={`/${categoryId}`}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: category.title, path: `/${categoryId}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalSpecialty",
          name: category.title,
          description: category.description.split('\n')[0],
          provider: { "@type": "MedicalClinic", name: "CMedical" },
        }}
      />

      {/* ── 1. Hero: Split-screen ── */}
      <header className="bg-brand-dark">
        <div className="grid md:grid-cols-2 min-h-[420px] md:min-h-[520px]">
          {/* Left: text */}
          <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1">
            <p className="text-xs text-white/50 font-light tracking-wide mb-4">{category.subtitle}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.1] mb-6">
              {category.title}
            </h1>
            <p className="text-base text-white/60 font-light leading-relaxed max-w-md mb-8">
              {category.description.split('\n')[0]?.slice(0, 160)}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="cta" size="lg" onClick={() => navigate(`/booking?kategori=${categoryId}`)}>
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-white/30 text-white hover:bg-white hover:text-brand-dark rounded-2xl"
                onClick={() => navigate('/kontakt')}
              >
                <Phone className="mr-2 w-4 h-4" />
                Kontakt oss
              </Button>
            </div>
          </div>
          {/* Right: image */}
          <div className="relative order-1 md:order-2 min-h-[260px] md:min-h-0">
            <img
              src={category.heroImage}
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── 2. Introduction ── */}
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl">
            {category.description.split('\n').slice(1).map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={i} className="text-base md:text-[17px] text-foreground/80 leading-relaxed font-light mb-4 last:mb-0">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Services: 2-column grid ── */}
      <section id="services" className="py-10 md:py-14 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">
              {category.servicesHeading || `${category.title}tjenester`}
            </h2>
            {category.servicesIntro && (
              <p className="text-muted-foreground font-light">
                {category.servicesIntro}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 border-t border-border">
            {category.services.map((service, index) => (
              <div key={index} className="border-b border-border">
                <button
                  onClick={() => handleServiceClick(service)}
                  className="w-full flex items-center justify-between py-4 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = getServiceIcon(service.name);
                      return (
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-brand-dark transition-colors flex-shrink-0" strokeWidth={1.5} />
                      );
                    })()}
                    <span className="text-base font-normal text-foreground group-hover:text-brand-dark transition-colors">
                      {service.name}
                    </span>
                  </div>
                  {service.subServices && service.subServices.length > 0 ? (
                    expandedService === service.name
                      ? <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      : <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
                {service.subServices && expandedService === service.name && (
                  <div className="pb-4 pl-4 space-y-2">
                    {service.subServices.map((subService, subIndex) => (
                      <button key={subIndex} onClick={() => subService.path && navigate(subService.path)} className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-background rounded-lg transition-colors group">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{subService.name}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Specialists ── */}
      <CategorySpecialists categoryId={categoryId} categoryTitle={category.title} />

      {/* ── 5. Reviews ── */}
      <CategoryReviews categoryId={categoryId} categoryTitle={category.title} />


      {/* ── 6. Finansiering ── */}
      <section className="py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mb-10">
            <p className="text-sm text-muted-foreground font-light mb-2">Praktisk informasjon</p>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">Finansiering</h2>
            <p className="text-foreground/80 font-light leading-relaxed">
              Vi er et privat helsetilbud. Du betaler selv – eller får behandling dekket av helseforsikring.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            {/* Pris */}
            <button
              onClick={() => navigate('/priser')}
              className="group bg-background rounded-xl border border-border/60 p-6 text-left hover:border-brand-dark/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-brand-dark/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-brand-dark/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-base font-normal text-foreground mb-1.5">Priser</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                Oversikt over priser for konsultasjoner, undersøkelser og behandlinger.
              </p>
              <span className="text-sm text-foreground font-normal inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Se prisliste <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Forsikring */}
            <button
              onClick={() => navigate('/forsikring')}
              className="group bg-background rounded-xl border border-border/60 p-6 text-left hover:border-brand-dark/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-brand-dark/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-brand-dark/70" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-normal text-foreground mb-1.5">Forsikring</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                Vi har avtale med EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg og Vertikal Helse.
              </p>
              <span className="text-sm text-foreground font-normal inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Les mer <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Nedbetaling */}
            <button
              onClick={() => navigate('/kontakt')}
              className="group bg-background rounded-xl border border-border/60 p-6 text-left hover:border-brand-dark/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-brand-dark/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-brand-dark/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h3 className="text-base font-normal text-foreground mb-1.5">Nedbetaling</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                Nedbetaling tilgjengelig på utvalgte klinikker. Kontakt oss for mer informasjon.
              </p>
              <span className="text-sm text-foreground font-normal inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Kontakt oss <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">Ofte stilte spørsmål</h2>
            <p className="text-muted-foreground font-light mb-8">
              Finner du ikke svar på det du lurer på? Ta gjerne kontakt med oss.
            </p>
            <div className="border-t border-border">
              {category.faqs.map((faq, index) => (
                <div key={index} className="border-b border-border">
                  <button onClick={() => toggleFaq(`faq-${index}`)} className="w-full flex items-center justify-between py-5 text-left hover:bg-secondary/30 transition-colors">
                    <span className="text-base font-normal text-foreground">{faq.question}</span>
                    {openFaq === `faq-${index}`
                      ? <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      : <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    }
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === `faq-${index}` ? "max-h-40 pb-5" : "max-h-0"}`}>
                    <p className="text-muted-foreground text-sm leading-relaxed pr-8 font-light">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ── */}
      <section className="py-14 md:py-20 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-2">Klar for å ta neste steg?</h2>
            <p className="text-white/60 font-light mb-8">
              Bestill time enkelt online – ingen henvisning nødvendig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="cta-dark" size="lg" onClick={() => navigate(`/booking?kategori=${categoryId}`)}>
                Bestill time for {category.title.toLowerCase()}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="cta-outline-dark" size="lg" onClick={() => navigate('/kontakt')}>
                <Phone className="mr-2 w-4 h-4" />
                Ring oss
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LeadPopup />
    </PageLayout>
  );
};

export default CategoryPage;
