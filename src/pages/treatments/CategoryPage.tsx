import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LeadPopup } from "@/components/LeadPopup";
import { StickyBookingCTA } from "@/components/StickyBookingCTA";
import { ArrowRight, ChevronRight, ChevronLeft, Plus, Minus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTreatmentCategory } from "@/hooks/useSanity";

// Static fallback images
import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";

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
    description: "Urologi er en medisinsk spesialitet som omhandler plager og sykdommer knyttet til mannens underliv og urinorganer hos begge kjønn herunder penis, prostata, testikler urinblære og nyrer. Har du smerter, forstyrrelser med vannlating eller bare ønsker en generell sjekk vil vår gruppe av spesialister kunne hjelpe.\n\nI CMedical har vi flere av Nordens ledende spesialister innen urologi. En erfaren urolog er tilgjengelig hver dag og i tillegg har vi et bredt tverrfaglig team med spesialister som har spisskompetanse på ulike undergrupper av sykdommer.\n\nCMedical er eneste private aktør i Norge som tilbyr robotoperasjoner. Vi kan tilby inngrep med robot på prostata både for kreft og godartet forstørrelse, brokk, utposninger på urinblære og enkelte nyreinngrep.\n\nTa gjerne kontakt med oss for en uforpliktende prat.",
    servicesHeading: "Urologispesialister",
    servicesIntro: "Våre spesialister jobber med de fagområdene de kan best. Vi har noen av Nordens ledende spesialister på følgende områder:",
    heroImage: urologiImg,
    services: [
      { name: "Blære og urinveier", path: "/behandlinger/urologi/blaere" },
      { name: "Forhud", path: "/behandlinger/urologi/forhud" },
      { name: "Mannlig infertilitet", path: "/behandlinger/urologi/infertilitet" },
      { name: "Nyrer", path: "/behandlinger/urologi/nyrer" },
      { name: "Prostata", path: "/behandlinger/urologi/prostata" },
      { name: "Refertilisering", path: "/behandlinger/urologi/refertilisering" },
      { name: "Robotassistert kirurgi", path: "/behandlinger/urologi/robotkirurgi" },
      { name: "Sterilisering", path: "/behandlinger/urologi/sterilisering" },
      { name: "Testikler og pung", path: "/behandlinger/urologi/testikler" },
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
      { name: "IVF", path: "/behandlinger/fertilitet/ivf" },
      { name: "Eggfrys", path: "/behandlinger/fertilitet/eggfrys" },
      { name: "Donorbehandling", path: "/behandlinger/fertilitet/donorbehandling" },
      { name: "Hysteroskopi", path: "/behandlinger/fertilitet/hysteroskopi" },
      { name: "Sædanalyse", path: "/behandlinger/fertilitet/saedanalyse" },
      { name: "Om oss / Fertilitetsteamet", path: "/behandlinger/fertilitet/teamet" },
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
    description: "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier. Vårt mål er å gjøre kvinnehelse til folkehelse, i hele Norden.\n\nHos oss møter du gynekologer som jobber med den kvinnesykdommen de kan aller best, og ved behov tilbyr vi tverrfaglig behandling med gynekologer, fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer. Vi har unike ekspertteam innen bla. fødselsskader (vaginale fremfall, urinlekkasje), infertilitet, endometriose, vulvalidelser og overgangsalder (med kompetanse på komplekse tilfeller).\n\nVi har Nordens mest komplette private fertilitetstilbud med erfaring, spisskompetanse og moderne teknologi samlet på ett sted.\n\nVi tilbyr en sømløs pasientreise fra utredning til behandling. Vi utfører alt av gynekologisk kirurgi, og gjennom robotassistert kirurgi kan vi utføre avansert kirurgi, noe som er spesielt effektivt og skånsomt ved for eksempel endometriose.\n\nVi har pasienten i sentrum, og vi følger deg gjennom hele livsløpet, fra pubertet, gjennom barneønske og graviditet, fødsel og barseltid (6-ukerskontroll) - til tiden før, under og etter overgangsalderen. Kvinnehelse for livet.\n\nCMedical er et sted for alle kvinner - Kvinnehelse for livet.",
    servicesHeading: "Alt under samme tak",
    servicesIntro: "Hos oss møter du ledende gynekologer som utelukkende jobber med den kvinnesykdommen de kan aller best. Våre spesialister jobber innenfor disse områdene:",
    heroImage: gynekologiImg,
    services: [
      { name: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring", path: "/behandlinger/gynekologi/tverrfaglig" },
      { name: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
      { name: "Urinlekkasje", path: "/behandlinger/gynekologi/urinlekkasje" },
      { name: "Endometriose", path: "/behandlinger/gynekologi/endometriose" },
      { name: "Overgangsalder", path: "/behandlinger/gynekologi/overgangsalder" },
      { name: "Vaginale fremfall", path: "/behandlinger/gynekologi/vaginale-fremfall" },
      { name: "Blødningsforstyrrelser", path: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { name: "Celleforandringer", path: "/behandlinger/gynekologi/celleforandringer" },
      { name: "Cyster på eggstokkene", path: "/behandlinger/gynekologi/cyster" },
      { name: "Fjerne livmor", path: "/behandlinger/gynekologi/fjerne-livmor" },
      { name: "Graviditet", path: "/behandlinger/gynekologi/graviditet" },
      { name: "Gynekologisk kirurgi", path: "/behandlinger/gynekologi/kirurgi" },
      { name: "Hormonforstyrrelser", path: "/behandlinger/gynekologi/hormonforstyrrelser" },
      { name: "Hysteroskopi", path: "/behandlinger/gynekologi/hysteroskopi" },
      { name: "Labiaplastikk", path: "/behandlinger/gynekologi/labiaplastikk" },
      { name: "Robotassistert kirurgi", path: "/behandlinger/gynekologi/robotkirurgi" },
      { name: "Spontanabort", path: "/behandlinger/gynekologi/spontanabort" },
      { name: "Vulvalidelser", path: "/behandlinger/gynekologi/vulvalidelser" },
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
    id: "graviditet", title: "Graviditet", subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vi tilbyr trygg og helhetlig oppfølging gjennom svangerskapet.",
    heroImage: gynekologiImg,
    services: [
      { name: "Ultralyd", path: "/behandlinger/graviditet/ultralyd" },
      { name: "NIPT", path: "/behandlinger/graviditet/nipt" },
      { name: "Svangerskapsteam", path: "/behandlinger/graviditet/svangerskapsteam" },
      { name: "Fosterdiagnostikk", path: "/behandlinger/graviditet/fosterdiagnostikk" },
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
      { name: "Osteopati", path: "/behandlinger/flere-fagomrader/osteopati" },
      { name: "Plastikkirurgi", path: "/behandlinger/flere-fagomrader/plastikkirurgi" },
      { name: "Psykologi", path: "/behandlinger/flere-fagomrader/psykologi" },
      { name: "Revmatologi", path: "/behandlinger/flere-fagomrader/revmatologi" },
      { name: "Robotassistert kirurgi", path: "/behandlinger/flere-fagomrader/robotkirurgi" },
      { name: "Sexologi", path: "/behandlinger/flere-fagomrader/sexologi" },
      { name: "Åreknutebehandling", path: "/behandlinger/flere-fagomrader/areknuter" },
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
      { name: "Skulder", path: "/behandlinger/ortopedi/skulder" },
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
    <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-white/70 font-light mb-3">Våre {categoryTitle.toLowerCase()}-eksperter</p>
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">
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
            <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
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
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-brand-dark">
              <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.7] brightness-[0.95] contrast-[1.05]" />
              <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white mb-1">{specialist.name}</h3>
                <p className="text-sm text-accent font-light">{specialist.title}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 font-light px-1">{specialist.expertise.join(', ')}</p>
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

interface CategoryPageProps {
  categoryId: string;
  isChatOpen: boolean;
}

export const CategoryPage = ({ categoryId, isChatOpen }: CategoryPageProps) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  // Fetch from Sanity with static fallback
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
      {/* Compact Hero Banner */}
      <header className="relative h-[30vh] md:h-[35vh] overflow-hidden">
        <img src={category.heroImage} alt={category.title} className="w-full h-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-brand-dark/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto px-0 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs text-white/60 mb-2 font-light">{category.subtitle}</p>
                <h1 className="text-3xl md:text-4xl font-normal text-white">{category.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-6 font-normal" onClick={() => navigate(`/booking?kategori=${categoryId}`)}>
                  Bestill time for {category.title.toLowerCase()}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="ghost" className="bg-transparent border border-accent/70 text-accent hover:bg-accent/10 rounded-md px-6 font-normal" onClick={() => navigate('/kontakt')}>
                  <Phone className="mr-2 w-4 h-4" />
                  Ring for konsultasjon
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            {category.description.split('\n').map((paragraph, i) => {
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

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">
                {category.servicesHeading || `${category.title}tjenester`}
              </h2>
              {category.servicesIntro && (
                <p className="text-muted-foreground font-light max-w-3xl">
                  {category.servicesIntro}
                </p>
              )}
            </div>

            <div className="border-t border-border">
              {category.services.map((service, index) => (
                <div key={index} className="border-b border-border">
                  <button onClick={() => handleServiceClick(service)} className="w-full flex items-center justify-between py-5 text-left transition-colors group">
                    <span className="text-base md:text-lg font-normal text-foreground group-hover:text-brand-dark transition-colors">{service.name}</span>
                    {service.subServices && service.subServices.length > 0 ? (
                      expandedService === service.name ? <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                  {service.subServices && expandedService === service.name && (
                    <div className="pb-4 pl-4 space-y-2">
                      {service.subServices.map((subService, subIndex) => (
                        <button key={subIndex} onClick={() => subService.path && navigate(subService.path)} className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-secondary/50 rounded-lg transition-colors group">
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
        </div>
      </section>

      {/* Spesialistklinikker Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-6">Spesialistklinikker</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="text-sm text-muted-foreground font-light bg-background px-4 py-2 rounded-full border border-border">Kort ventetid</span>
              <span className="text-sm text-muted-foreground font-light bg-background px-4 py-2 rounded-full border border-border">Ingen henvisning</span>
            </div>
            <div className="space-y-4 mb-8">
              <p className="text-foreground/80 font-light leading-relaxed">
                CMedical er Nordens ledende på kvinnen og mannens underliv. Hos oss møter du engasjerte kirurger, gynekologer, fertilitetsleger og urologer som jobber med den sykdommen de kan best - i unike tverrfaglige team, bestående av osteopater, ernæringsfysiologer, sexologer, psykologer og fysioterapeuter. Sammen skreddersyr vi behandlingen tilpasset deg.
              </p>
              <p className="text-foreground/80 font-light leading-relaxed">
                Hos CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – en trygg og omsorgsfull opplevelse, enten du er ny pasient eller kommer fra en annen klinikk.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="rounded-full font-normal" onClick={() => navigate('/spesialister')}>
                Spesialister <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="rounded-full font-normal" onClick={() => navigate('/klinikker')}>
                Klinikker <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Finansiering Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-8">Finansiering</h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-8">
              Vi er et privat helsetilbud. Det betyr at du betaler selv – eller får utredning eller behandling dekket av helseforsikring.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-normal text-foreground mb-2">Pris</h3>
                <p className="text-foreground/80 font-light">
                  <button onClick={() => navigate('/priser')} className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors">Prislister finnes her.</button>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-foreground mb-3">Forsikring</h3>
                <p className="text-foreground/80 font-light leading-relaxed mb-3">
                  <strong>Vi har forsikringsavtale med:</strong> EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg.
                </p>
                <p className="text-foreground/80 font-light leading-relaxed mb-3">
                  <strong>Hvordan går jeg frem?</strong> Et typisk behandlingsløp er at du tar kontakt med lege (fastlege eller annen privat lege/legevakt) og får en henvisning til utredning/behandlingen som er nødvendig for deg. Henvisningen sender du til forsikringsselskapet ditt og du kan da be om å få time på CMedical. Forsikringsselskapet tar kontakt med oss og vi ringer deg for å sette opp en time.
                </p>
                <p className="text-foreground/80 font-light leading-relaxed mb-3">
                  <strong>Hvis forsikringen ikke dekker behandlingen:</strong> Er det behandling som ikke dekkes av din forsikring, men som tilbys hos CMedical, så kan vi tilby deg behandlingen som privat betalende pasient.
                </p>
                <p className="text-foreground/80 font-light leading-relaxed">
                  <strong>Selskapene har ulike regler:</strong> Forsikringsselskapene har ulike regler for hva de betaler for. De har også ulike produkter som gjør at ikke alle kunder får dekket det samme. Et av kravene som er likt hos alle selskapene er at behandlingen du ønsker gjennomført, skal være medisinsk nødvendig og at den tilbys i offentlig helsevesen. Sjekk med ditt forsikringsselskap hva din forsikring dekker.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-foreground mb-2">Nedbetaling</h3>
                <p className="text-foreground/80 font-light">
                  Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists Section */}
      <CategorySpecialists categoryId={categoryId} categoryTitle={category.title} />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-4">Ofte stilte spørsmål</h2>
              <p className="text-muted-foreground font-light">
                Det kan være enkelt å være pasient hos oss. Finner du ikke svar på det du lurer på, finner du kontaktinformasjonen vår nedenfor.
              </p>
            </div>
            
            <div className="space-y-0 border-t border-border bg-background rounded-lg overflow-hidden">
              {category.faqs.map((faq, index) => (
                <div key={index} className="border-b border-border last:border-b-0">
                  <button onClick={() => toggleFaq(`faq-${index}`)} className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-secondary/30 transition-colors">
                    <span className="text-base md:text-lg font-normal text-foreground">{faq.question}</span>
                    {openFaq === `faq-${index}` ? <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === `faq-${index}` ? "max-h-40 pb-5 px-6" : "max-h-0"}`}>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed pr-8 font-light">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-normal text-white mb-4">Klar for å ta neste steg?</h2>
            <p className="text-white/70 font-light mb-8 max-w-lg mx-auto">
              Bestill time enkelt online eller ring oss for en uforpliktende konsultasjon. Ingen henvisning nødvendig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal" onClick={() => navigate(`/booking?kategori=${categoryId}`)}>
                Bestill time for {category.title.toLowerCase()}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="ghost" className="bg-transparent border border-white text-white hover:bg-white hover:text-brand-dark rounded-md px-8 font-normal" onClick={() => navigate('/kontakt')}>
                <Phone className="mr-2 w-4 h-4" />
                Ring for konsultasjon
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LeadPopup />
      {categoryId === "fertilitet" && <StickyBookingCTA />}
    </PageLayout>
  );
};

export default CategoryPage;
