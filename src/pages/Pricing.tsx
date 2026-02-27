import { useEffect, useState } from "react";
import { Search, ArrowRight, ChevronDown, Heart, Baby, Stethoscope, Shield, CheckCircle, CreditCard, Wallet, Clock, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { RelatedServices, allServices } from "@/components/layout/RelatedServices";
import { Link } from "react-router-dom";
import pricingHero from "@/assets/hero/pricing-hero.jpg";

interface PageProps { isChatOpen: boolean }

interface PriceItem {
  name: string;
  price: string;
  description?: string;
  duration?: string;
  details?: string;
}

interface PriceCategory {
  title: string;
  items: PriceItem[];
}

const Pricing = ({ isChatOpen }: PageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("gynecology");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Prisliste | CMedical - Transparent prising";
  }, []);

  const gynecologyPrices: PriceCategory[] = [
    {
      title: "Konsultasjoner",
      items: [
        { name: "Gynekologisk konsultasjon", price: "1.490 kr", description: "Inkluderer undersøkelse og samtale", duration: "45 min", details: "En grundig gynekologisk undersøkelse med samtale om din helse og eventuelle bekymringer. Inkluderer full undersøkelse og oppfølgingsplan." },
        { name: "Oppfølgingskonsultasjon", price: "990 kr", duration: "30 min", details: "Oppfølgingstime for å gjennomgå prøvesvar, evaluere behandling eller diskutere videre tiltak." },
        { name: "Celleprøve (Pap-prøve)", price: "890 kr", duration: "20 min", details: "Screening for celleforandringer i livmorhalsen. Anbefales regelmessig for tidlig oppdagelse." },
        { name: "HPV-test", price: "790 kr", duration: "15 min", details: "Test for humant papillomavirus, en viktig del av livmorhalskreftforebygging." },
      ]
    },
    {
      title: "Ultralyd",
      items: [
        { name: "Gynekologisk ultralyd", price: "1.290 kr", duration: "30 min", details: "Bildediagnostikk for å undersøke livmor, eggstokker og bekkenorganer." },
        { name: "Ultralyd med konsultasjon", price: "1.890 kr", duration: "45 min", details: "Kombinert undersøkelse med ultralyd og full konsultasjon med gynekolog." },
      ]
    },
    {
      title: "Prevensjon",
      items: [
        { name: "P-stav innsetting", price: "1.890 kr", description: "Inkluderer konsultasjon", duration: "30 min", details: "Innsetting av prevensjonsimplantat som gir beskyttelse i opptil 3 år." },
        { name: "P-stav fjerning", price: "990 kr", duration: "20 min", details: "Enkel prosedyre for fjerning av eksisterende p-stav." },
        { name: "Hormonspiral innsetting", price: "2.490 kr", duration: "30 min", details: "Innsetting av hormonspiral med langvarig prevensjonsbeskyttelse." },
        { name: "Prevensjonsrådgivning", price: "990 kr", duration: "30 min", details: "Samtale om ulike prevensjonsmetoder og hva som passer best for deg." },
      ]
    }
  ];

  const fertilityPrices: PriceCategory[] = [
    {
      title: "Utredning",
      items: [
        { name: "Fertilitetsutredning par", price: "3.990 kr", description: "Komplett utredning", duration: "90 min", details: "Omfattende utredning av begge partnere inkludert hormontester, ultralyd og sædanalyse." },
        { name: "Fertilitetsutredning single", price: "2.490 kr", duration: "60 min", details: "Full fertilitetsutredning for deg som planlegger å bli mor alene." },
        { name: "Sædanalyse", price: "1.290 kr", duration: "30 min", details: "Analyse av sædkvalitet inkludert antall, bevegelighet og morfologi." },
        { name: "Hormontester", price: "Fra 890 kr", duration: "15 min", details: "Blodprøver for å kartlegge hormonbalanse og eggstokkreserve." },
      ]
    },
    {
      title: "Behandlinger",
      items: [
        { name: "IVF-behandling", price: "Fra 35.000 kr", description: "Pris per syklus", duration: "2-3 uker", details: "Prøverørsbehandling der egg befruktes utenfor kroppen. Inkluderer stimulering, egghenting og embryooverføring." },
        { name: "ICSI-behandling", price: "Fra 42.000 kr", duration: "2-3 uker", details: "Avansert IVF der ett spermie injiseres direkte i egget. Anbefales ved nedsatt sædkvalitet." },
        { name: "Inseminasjon (IUI)", price: "Fra 8.900 kr", duration: "1-2 timer", details: "Prosedyre der preparert sæd føres direkte inn i livmoren ved eggløsning." },
        { name: "Nedfrysing av egg", price: "Fra 28.000 kr", duration: "2 uker", details: "Bevaring av eggceller for fremtidig bruk. Inkluderer stimulering og egghenting." },
      ]
    }
  ];

  const urologyPrices: PriceCategory[] = [
    {
      title: "Konsultasjoner",
      items: [
        { name: "Urologisk konsultasjon", price: "1.490 kr", duration: "45 min", details: "Grundig undersøkelse og samtale med urolog om dine bekymringer." },
        { name: "Oppfølging", price: "990 kr", duration: "30 min", details: "Oppfølgingstime for å gjennomgå prøvesvar og evaluere behandling." },
        { name: "Prostataundersøkelse", price: "1.690 kr", description: "Inkluderer PSA-test", duration: "30 min", details: "Komplett prostatasjekk med rektalundersøkelse og blodprøve." },
      ]
    },
    {
      title: "Tester og behandlinger",
      items: [
        { name: "PSA-test", price: "590 kr", duration: "10 min", details: "Blodprøve for å måle prostata-spesifikt antigen." },
        { name: "Testosterontest", price: "790 kr", duration: "10 min", details: "Blodprøve for å måle testosteronnivå." },
        { name: "Behandling erektil dysfunksjon", price: "Fra 1.990 kr", duration: "45 min", details: "Konsultasjon og behandlingsplan for erektil dysfunksjon." },
      ]
    }
  ];

  const filterItems = (categories: PriceCategory[]) => {
    if (!searchTerm) return categories;
    return categories
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(category => category.items.length > 0);
  };

  const tabs = [
    { id: "gynecology", label: "Gynekologi", icon: Heart, prices: gynecologyPrices, link: "/behandlinger/gynekologi" },
    { id: "fertility", label: "Fertilitet", icon: Baby, prices: fertilityPrices, link: "/behandlinger/fertilitet" },
    { id: "urology", label: "Urologi", icon: Stethoscope, prices: urologyPrices, link: "/behandlinger/urologi" },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero Section - Split Layout */}
      <header className="h-[calc(100vh-80px)] flex flex-col lg:flex-row">
        {/* Left - Image */}
        <div className="lg:w-1/2 h-1/2 lg:h-full relative">
          <img 
            src={pricingHero} 
            alt="Prisliste" 
            className="w-full h-full object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-warm/20 lg:hidden" />
          
          {/* Title overlay on mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:hidden">
            <h1 className="text-4xl md:text-5xl font-medium text-white drop-shadow-lg">
              Prisliste
            </h1>
          </div>
        </div>

        {/* Right - Content */}
        <div className="lg:w-1/2 h-1/2 lg:h-full bg-brand-warm flex flex-col justify-center px-8 py-8 lg:px-16 lg:py-0">
          {/* Trust badges - Outline pill design */}
          <div className="flex flex-wrap gap-3 mb-12">
            <span className="px-4 py-2 rounded-full border border-brand-dark/30 text-sm text-brand-dark/80">
              Ingen henvisning
            </span>
            <span className="px-4 py-2 rounded-full border border-brand-dark/30 text-sm text-brand-dark/80">
              Kort ventetid
            </span>
          </div>

          {/* Title - hidden on mobile, shown on desktop */}
          <h1 className="hidden lg:block text-5xl xl:text-6xl font-medium text-brand-dark mb-8">
            Prisliste
          </h1>

          <p className="text-brand-dark/70 leading-relaxed mb-8 max-w-lg">
            Hos CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – en trygg og omsorgsfull opplevelse. Tidligere Livio Oslo-pasienter får nå tilgang til det beste fra begge klinikkene, med kortere ventetid og helhetlig oppfølging.
          </p>

          <Button 
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md w-fit px-8 font-normal"
            onClick={() => document.getElementById('prices')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Se våre priser
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Category Tabs with Connected Content */}
      <section id="prices" className="py-16 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          {/* Tab Navigation - Horizontal on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isFirst = index === 0;
              const isLast = index === tabs.length - 1;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-6 md:p-8 text-left transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-dark text-white z-20' 
                      : 'bg-brand-warm hover:bg-brand-mid/30 text-brand-dark z-10'
                  } ${isFirst ? 'rounded-tl-2xl' : ''} ${isLast ? 'rounded-tr-2xl' : ''}`}
                >
                  {/* Active indicator - connector tab */}
                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-brand-dark z-30" />
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isActive ? 'bg-white/10' : 'bg-brand-dark/5'}`}>
                      <tab.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-brand-dark/70'}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{tab.label}</h3>
                      <p className={`text-sm ${isActive ? 'text-white/60' : 'text-brand-dark/50'}`}>
                        {tab.prices.reduce((sum, cat) => sum + cat.items.length, 0)} tjenester
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Header Badge */}
          <div className="bg-brand-warm rounded-b-2xl pt-8 pb-6 px-6 md:px-8 border-t-4 border-brand-dark">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <currentTab.icon className="w-5 h-5 text-brand-dark/70" strokeWidth={1.5} />
                <span className="text-xl font-medium text-brand-dark">
                  Priser for {currentTab.label}
                </span>
              </div>
              
              {/* Search */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-dark/40 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Søk etter behandling..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-11 rounded-full bg-white border-brand-dark/10 text-brand-dark placeholder:text-brand-dark/40"
                />
              </div>
            </div>
          </div>

          {/* Price List - Connected to tabs */}
          <div className="bg-brand-warm px-6 md:px-8 pb-8 rounded-b-2xl -mt-px">
            <div className="space-y-8">
              {filterItems(currentTab.prices).map((category, idx) => (
                <div key={idx}>
                  <h2 className="text-lg font-medium mb-4 text-brand-dark/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-dark/30" />
                    {category.title}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {category.items.map((item, itemIdx) => {
                      const itemKey = `${category.title}-${item.name}`;
                      const isExpanded = expandedItem === itemKey;
                      
                      return (
                        <div 
                          key={itemIdx} 
                          className={`rounded-xl bg-white border transition-all duration-300 cursor-pointer overflow-hidden ${
                            isExpanded 
                              ? 'border-brand-dark/30 shadow-xl md:col-span-2' 
                              : 'border-brand-dark/5 hover:border-brand-dark/20 hover:shadow-lg'
                          }`}
                          onClick={() => setExpandedItem(isExpanded ? null : itemKey)}
                        >
                          {/* Header */}
                          <div className="p-5 flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-brand-dark">
                                {item.name}
                              </h3>
                              {item.description && !isExpanded && (
                                <p className="text-sm text-brand-dark/50 mt-1">{item.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-brand-dark font-semibold whitespace-nowrap">
                                {item.price}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-brand-dark/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                          
                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-5 pb-5 border-t border-brand-dark/5 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                              <p className="text-brand-dark/70 text-sm leading-relaxed mb-4">
                                {item.details}
                              </p>
                              
                              {/* Duration and Book button on same line */}
                              <div className="flex items-center justify-between">
                                {item.duration && (
                                  <div className="flex items-center gap-2 text-sm text-brand-dark/60">
                                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                                    <span>Varighet: {item.duration}</span>
                                  </div>
                                )}
                                <Button 
                                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full px-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Book appointment action
                                  }}
                                >
                                  <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                                  Book time
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Link to service page */}
            <div className="flex justify-center mt-8 pt-6 border-t border-brand-dark/10">
              <Button 
                variant="outline" 
                className="rounded-full border-brand-dark text-brand-dark bg-white hover:bg-brand-dark hover:text-white transition-colors" 
                asChild
              >
                <Link to={currentTab.link}>
                  Les mer om {currentTab.label.toLowerCase()}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section - Split Layout */}
      <section className="min-h-[70vh] flex flex-col lg:flex-row">
        {/* Left - Content */}
        <div className="lg:w-1/2 bg-brand-dark flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-0">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-8">
            Fleksible betalingsløsninger
          </h2>
          <p className="text-white/70 leading-relaxed mb-8 max-w-lg">
            Vi ønsker at alle skal ha tilgang til best mulig helsehjelp. 
            Derfor tilbyr vi flere betalingsalternativer.
          </p>
          
          <div className="space-y-4">
            {[
              { icon: Shield, title: "Helseforsikring", desc: "Mange helseforsikringer dekker deler av kostnaden" },
              { icon: CheckCircle, title: "Direkte oppgjør", desc: "Vi ordner direkte med de fleste forsikringsselskaper" },
              { icon: CreditCard, title: "Betalingsplaner", desc: "Vi tilbyr nedbetalingsplaner for større behandlinger" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
                <item.icon className="w-6 h-6 text-white/70 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-md"
              asChild
            >
              <Link to="/forsikring">
                Les om forsikring
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right - Visual */}
        <div className="lg:w-1/2 bg-accent flex items-center justify-center p-16">
          <div className="text-center">
            <Wallet className="w-24 h-24 text-accent-foreground/80 mx-auto mb-8" strokeWidth={1} />
            <p className="text-accent-foreground text-2xl font-medium">Transparent prising</p>
            <p className="text-accent-foreground/70 mt-2">Ingen skjulte kostnader</p>
          </div>
        </div>
      </section>

      <RelatedServices 
        services={allServices} 
        currentPath="/pricing"
      />

      <CTASection
        title="Ta vare på livet og underlivet"
        subtitle="Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging"
        primaryCTA="Book time nå"
        secondaryCTA="Kontakt oss"
        secondaryLink="/contact"
      />
    </PageLayout>
  );
};

export default Pricing;