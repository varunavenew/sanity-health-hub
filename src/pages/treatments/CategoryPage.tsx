import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LeadPopup } from "@/components/LeadPopup";
import { ArrowRight, ChevronRight, ChevronLeft, Plus, Minus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { specialists as staticSpecialists } from "@/data/specialists";
import { useTreatmentCategory, useSpecialists } from "@/hooks/useSanity";

// Category data types
interface SubService {
  name: string;
  path?: string;
}

interface Service {
  name: string;
  subServices?: SubService[];
  path?: string;
}

interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  services: Service[];
  faqs: { question: string; answer: string }[];
}

// Import category images
import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";

// Map categoryId to specialist label for CTA
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

// Category configurations
const categoryData: Record<string, CategoryData> = {
  urologi: {
    id: "urologi",
    title: "Urologi",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Urologi er en medisinsk spesialdisiplin som tar seg av problemer med nyrer, urinblære, urinledere og urinrør hos begge kjønn, samt prostata og mannlige kjønnsorganer. Vi tilbyr omfattende utredning og behandling av alle urologiske tilstander.",
    heroImage: urologiImg,
    services: [
      { name: "Blære og urinveier", path: "/behandlinger/urologi/blaere" },
      { name: "Forhud", path: "/behandlinger/urologi/forhud" },
      { name: "Mannlig infertilitet", path: "/behandlinger/urologi/infertilitet" },
      { name: "Nyrer", path: "/behandlinger/urologi/nyrer" },
      { name: "Prostata", path: "/behandlinger/urologi/prostata" },
      { name: "Refertilisering", path: "/behandlinger/urologi/refertilisering" },
      { name: "Robotkirurgi", path: "/behandlinger/urologi/robotkirurgi" },
      { name: "Sterilisering", path: "/behandlinger/urologi/sterilisering" },
      { name: "Testikler og pung", path: "/behandlinger/urologi/testikler" },
    ],
    faqs: [
      {
        question: "Henvisning",
        answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss.",
      },
      {
        question: "Ventetid",
        answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager.",
      },
      {
        question: "Sykemelding",
        answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det.",
      },
      {
        question: "Utredning",
        answer: "Vi tilbyr grundig utredning innen alle våre fagområder.",
      },
      {
        question: "Selskapet",
        answer: "CMedical er Nordens ledende klinikk for livet og underlivet. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      },
    ],
  },
  fertilitet: {
    id: "fertilitet",
    title: "Fertilitet",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vårt fertilitetssenter tilbyr omfattende utredning og behandling for par og enslige som ønsker barn. Vi har lang erfaring med assistert befruktning, IVF, eggdonasjon og andre moderne fertilitetsbehandlinger.",
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
      {
        question: "Henvisning",
        answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss.",
      },
      {
        question: "Ventetid",
        answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager.",
      },
      {
        question: "Sykemelding",
        answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det.",
      },
      {
        question: "Utredning",
        answer: "Vi tilbyr grundig utredning innen alle våre fagområder.",
      },
      {
        question: "Selskapet",
        answer: "CMedical er Nordens ledende klinikk for livet og underlivet. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      },
    ],
  },
  gynekologi: {
    id: "gynekologi",
    title: "Gynekologi",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Velkommen til vår gynekologiklinikk hvor kvinner i alle aldre får hjelp med underlivshelse, blødning, cystekontroll, graviditet og hormonell behandling. Våre spesialister har lang erfaring og tilbyr moderne behandlingsmetoder.",
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
      { name: "Robotkirurgi", path: "/behandlinger/gynekologi/robotkirurgi" },
      { name: "Spontanabort", path: "/behandlinger/gynekologi/spontanabort" },
      { name: "Vulvalidelser", path: "/behandlinger/gynekologi/vulvalidelser" },
    ],
    faqs: [
      {
        question: "Henvisning",
        answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss.",
      },
      {
        question: "Ventetid",
        answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager.",
      },
      {
        question: "Sykemelding",
        answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det.",
      },
      {
        question: "Utredning",
        answer: "Vi tilbyr grundig utredning innen alle våre fagområder.",
      },
      {
        question: "Selskapet",
        answer: "CMedical er Nordens ledende klinikk for livet og underlivet. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      },
    ],
  },
  graviditet: {
    id: "graviditet",
    title: "Graviditet",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vi tilbyr trygg og helhetlig oppfølging gjennom svangerskapet. Vårt tverrfaglige team sørger for at du får den beste omsorgen – fra tidlig ultralyd til fødsel.",
    heroImage: gynekologiImg,
    services: [
      { name: "Ultralyd", path: "/behandlinger/graviditet/ultralyd" },
      { name: "NIPT", path: "/behandlinger/graviditet/nipt" },
      { name: "Svangerskapsteam", path: "/behandlinger/graviditet/svangerskapsteam" },
      { name: "Fosterdiagnostikk", path: "/behandlinger/graviditet/fosterdiagnostikk" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss." },
      { question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager." },
      { question: "Utredning", answer: "Vi tilbyr grundig utredning og oppfølging gjennom hele svangerskapet." },
    ],
  },
  "flere-fagomrader": {
    id: "flere-fagomrader",
    title: "Flere fagområder",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Vi tilbyr et bredt spekter av spesialisttjenester innenfor ulike medisinske fagområder. Våre erfarne spesialister gir deg helhetlig behandling og oppfølging.",
    heroImage: flereFagomraderImg,
    services: [
      { name: "Endokrinologi", path: "/behandlinger/flere-fagomrader/endokrinologi" },
      { name: "Hudlege", path: "/behandlinger/flere-fagomrader/hudlege" },
      { name: "Hudhelse", path: "/behandlinger/flere-fagomrader/hudhelse" },
      { name: "Ernæringsfysiolog", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
      { name: "Gastrokirurgi", path: "/behandlinger/flere-fagomrader/gastrokirurgi" },
      { name: "Osteopati", path: "/behandlinger/flere-fagomrader/osteopati" },
      { name: "Overvektskirurgi", path: "/behandlinger/flere-fagomrader/overvektskirurgi" },
      { name: "Plastikkirurgi", path: "/behandlinger/flere-fagomrader/plastikkirurgi" },
      { name: "Psykologi", path: "/behandlinger/flere-fagomrader/psykologi" },
      { name: "Revmatologi", path: "/behandlinger/flere-fagomrader/revmatologi" },
      { name: "Robotkirurgi", path: "/behandlinger/flere-fagomrader/robotkirurgi" },
      { name: "Sexologi", path: "/behandlinger/flere-fagomrader/sexologi" },
      { name: "Åreknutebehandling", path: "/behandlinger/flere-fagomrader/areknuter" },
    ],
    faqs: [
      {
        question: "Henvisning",
        answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss.",
      },
      {
        question: "Ventetid",
        answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager.",
      },
      {
        question: "Sykemelding",
        answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det.",
      },
      {
        question: "Utredning",
        answer: "Vi tilbyr grundig utredning innen alle våre fagområder.",
      },
      {
        question: "Selskapet",
        answer: "CMedical er Nordens ledende klinikk for livet og underlivet. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      },
    ],
  },
  ortopedi: {
    id: "ortopedi",
    title: "Ortopedi",
    subtitle: "Kort ventetid • Ingen henvisning",
    description: "Ortopedi er en medisinsk spesialitet som tar seg av problemer med muskler, ledd, skjelett og bindevev. Hos oss får du tilgang på den samme ekspertisen som du får hos de store universitetssykehusene.",
    heroImage: ortopediImg,
    services: [
      { name: "Fot og ankel", path: "/behandlinger/ortopedi/fot-ankel" },
      { name: "Hofte", path: "/behandlinger/ortopedi/hofte" },
      { name: "Hånd og albue", path: "/behandlinger/ortopedi/hand-albue" },
      { name: "Kne", path: "/behandlinger/ortopedi/kne" },
      { name: "Skulder", path: "/behandlinger/ortopedi/skulder" },
    ],
    faqs: [
      {
        question: "Henvisning",
        answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss.",
      },
      {
        question: "Ventetid",
        answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager.",
      },
      {
        question: "Sykemelding",
        answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det.",
      },
      {
        question: "Utredning",
        answer: "Vi tilbyr grundig utredning innen alle våre fagområder.",
      },
      {
        question: "Selskapet",
        answer: "CMedical er Nordens ledende klinikk for livet og underlivet. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      },
    ],
  },
};

interface CategoryPageProps {
  categoryId: string;
  isChatOpen: boolean;
}

// Specialists component for category pages
const CategorySpecialists = ({ categoryId, categoryTitle }: { categoryId: string; categoryTitle: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: sanitySpecialists } = useSpecialists();
  
  // Use Sanity specialists if available, otherwise fallback to static
  const allSpecialists = sanitySpecialists?.length ? sanitySpecialists : staticSpecialists;
  
  // Filter specialists by category
  const categorySpecialists = allSpecialists.filter(
    (specialist: any) => specialist.category === categoryId
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (categorySpecialists.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header */}
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
            {/* Navigation arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                aria-label="Scroll spesialister til venstre"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button 
                onClick={() => scroll('right')}
                aria-label="Scroll spesialister til høyre"
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <Button 
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Se alle {categorySpecialists.length} spesialister
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-16 snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {categorySpecialists.map((specialist) => (
          <Link
            to={`/spesialister/${specialist.slug}`}
            key={specialist.name}
            className="group flex-shrink-0 w-[280px] snap-start"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-secondary">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
              
              {/* Info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white mb-1">{specialist.name}</h3>
                <p className="text-sm text-accent font-light">{specialist.title}</p>
              </div>
            </div>

            {/* Expertise below */}
            <p className="text-sm text-white/60 font-light px-1">{specialist.expertise.join(', ')}</p>
          </Link>
        ))}
        
        {/* "See all" card at end */}
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

      {/* Mobile scroll hint */}
      <div className="md:hidden flex justify-center mt-4 gap-1">
        <span className="text-xs text-white/60">Sveip for å se flere →</span>
      </div>
    </section>
  );
};

export const CategoryPage = ({ categoryId, isChatOpen }: CategoryPageProps) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  // Get Sanity data
  const { data: sanityCategory } = useTreatmentCategory(categoryId);
  
  // Use Sanity data if available, merge with hardcoded fallback
  const staticCategory = categoryData[categoryId];
  const category = sanityCategory ? {
    ...staticCategory,
    title: sanityCategory.title || staticCategory?.title,
    description: sanityCategory.description || staticCategory?.description,
    heroImage: sanityCategory.heroImage || staticCategory?.heroImage,
    services: sanityCategory.services?.length ? sanityCategory.services : staticCategory?.services || [],
    faqs: sanityCategory.faqs?.length ? sanityCategory.faqs : staticCategory?.faqs || [],
  } : staticCategory;
  
  useEffect(() => {
    if (category) {
      document.title = `${category.title} | CMedical`;
    }
  }, [category]);

  if (!category) {
    return <div>Kategori ikke funnet</div>;
  }

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const toggleService = (name: string) => {
    setExpandedService(expandedService === name ? null : name);
  };

  const handleServiceClick = (service: Service) => {
    if (service.subServices && service.subServices.length > 0) {
      toggleService(service.name);
    } else if (service.path) {
      navigate(service.path);
    }
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Compact Hero Banner */}
      <header className="relative h-[30vh] md:h-[35vh] overflow-hidden">
        <img 
          src={category.heroImage} 
          alt={category.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-brand-dark/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto px-0 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs text-white/60 tracking-wide mb-2 font-light">
                  {category.subtitle}
                </p>
                <h1 className="text-3xl md:text-4xl font-normal text-white">
                  {category.title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-6 font-normal"
                  onClick={() => navigate(`/booking?kategori=${categoryId}`)}
                >
                  Bestill time for {category.title.toLowerCase()}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="ghost"
                  className="bg-transparent border border-accent/70 text-accent hover:bg-accent/10 rounded-md px-6 font-normal"
                  onClick={() => navigate('/kontakt')}
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Ring for konsultasjon
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-base md:text-[17px] text-foreground/80 leading-relaxed font-light">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <p className="text-sm tracking-widest text-muted-foreground mb-3 font-light">
                Våre behandlinger
              </p>
              <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">
                {category.title}tjenester
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-light">
                Våre spesialister tilbyr med de fagområdene du har vist. Vi har noen av Nordens ledende spesialister på behandlingsområdene.
              </p>
            </div>

            {/* Services List */}
            <div className="border-t border-border">
              {category.services.map((service, index) => (
                <div key={index} className="border-b border-border">
                  <button
                    onClick={() => handleServiceClick(service)}
                    className="w-full flex items-center justify-between py-5 text-left transition-colors group"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground group-hover:text-brand-dark transition-colors">
                      {service.name}
                    </span>
                    {service.subServices && service.subServices.length > 0 ? (
                      expandedService === service.name ? (
                        <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                  
                  {/* Sub-services */}
                  {service.subServices && expandedService === service.name && (
                    <div className="pb-4 pl-4 space-y-2">
                      {service.subServices.map((subService, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() => subService.path && navigate(subService.path)}
                          className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-secondary/50 rounded-lg transition-colors group"
                        >
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {subService.name}
                          </span>
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

      {/* Specialists Section */}
      <CategorySpecialists categoryId={categoryId} categoryTitle={category.title} />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-4">
                Ofte stilte spørsmål
              </h2>
              <p className="text-muted-foreground font-light">
                Det kan være enkelt å være pasient hos oss. Finner du ikke svar på det du lurer på, finner du kontaktinformasjonen vår nedenfor.
              </p>
            </div>
            
            <div className="space-y-0 border-t border-border bg-background rounded-lg overflow-hidden">
              {category.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    onClick={() => toggleFaq(`faq-${index}`)}
                    className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground">
                      {faq.question}
                    </span>
                    {openFaq === `faq-${index}` ? (
                      <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openFaq === `faq-${index}` ? "max-h-40 pb-5 px-6" : "max-h-0"
                    }`}
                  >
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed pr-8 font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA after FAQ */}
      <section className="py-16 md:py-20 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-normal text-white mb-4">
              Klar for å ta neste steg?
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-lg mx-auto">
              Bestill time enkelt online eller ring oss for en uforpliktende konsultasjon. Ingen henvisning nødvendig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal"
                onClick={() => navigate(`/booking?kategori=${categoryId}`)}
              >
                Bestill time for {category.title.toLowerCase()}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="ghost"
                className="bg-transparent border border-white text-white hover:bg-white hover:text-brand-dark rounded-md px-8 font-normal"
                onClick={() => navigate('/kontakt')}
              >
                <Phone className="mr-2 w-4 h-4" />
                Ring for konsultasjon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead popup - only on category pages */}
      <LeadPopup />
    </PageLayout>
  );
};

export default CategoryPage;
