import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, Plus, Minus, ChevronRight, Heart, Stethoscope, Baby, Bone, Scissors, Apple, FlaskConical, Hand, Brain, Pill, Activity, Syringe, SmilePlus, Droplets, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { serviceCategories } from "@/data/serviceCategories";
import { searchSuggestions, type SearchItem } from "@/data/searchData";

import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import urologiImg from "@/assets/categories/urologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import ortopediImg from "@/assets/categories/ortopedi-real.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const primaryOrder = ["gynekologi", "urologi", "fertilitet", "ortopedi"];

const categoryMeta: Record<string, { image: string; intro: string }> = {
  gynekologi: {
    image: gynekologiImg,
    intro: "Vi følger kvinner gjennom hele livsløpet – fra pubertet og fertilitet til graviditet, barseltid og overgangsalder.",
  },
  urologi: {
    image: urologiImg,
    intro: "Spesialiserte helsetjenester for blære, nyrer, prostata og mannlig fertilitet – fra utredning til robotassistert kirurgi.",
  },
  fertilitet: {
    image: fertilitetImg,
    intro: "Fertilitetsklinikk med forskning, erfaring og personlig oppfølging. Fra fertilitetssjekk til IVF og eggfrys.",
  },
  ortopedi: {
    image: ortopediImg,
    intro: "Ortopedisk ekspertise innen fot, ankel, hofte, kne, skulder, hånd og albue – med fokus på presis diagnostikk.",
  },
};

// Icon mapping for "flere fagområder" line items
const serviceIcons: Record<string, React.ReactNode> = {
  "Endokrinologi": <Pill className="w-[18px] h-[18px]" />,
  "Hudlege": <Droplets className="w-[18px] h-[18px]" />,
  "Hudhelse": <SmilePlus className="w-[18px] h-[18px]" />,
  "Ernæringsfysiolog": <Apple className="w-[18px] h-[18px]" />,
  "Gastrokirurgi": <Scissors className="w-[18px] h-[18px]" />,
  "Osteopati": <Hand className="w-[18px] h-[18px]" />,
  "Overvektskirurgi": <Activity className="w-[18px] h-[18px]" />,
  "Plastikkirurgi": <Syringe className="w-[18px] h-[18px]" />,
  "Psykologi": <Brain className="w-[18px] h-[18px]" />,
  "Revmatologi": <Stethoscope className="w-[18px] h-[18px]" />,
  "Robotkirurgi": <FlaskConical className="w-[18px] h-[18px]" />,
  "Sexologi": <Heart className="w-[18px] h-[18px]" />,
  "Åreknutebehandling": <Activity className="w-[18px] h-[18px]" />,
  "Graviditet": <Baby className="w-[18px] h-[18px]" />,
};

const faqs = [
  {
    id: "henvisning",
    question: "Trenger jeg henvisning?",
    answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
  },
  {
    id: "ventetid",
    question: "Hva er ventetiden?",
    answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
  },
  {
    id: "sykemelding",
    question: "Kan jeg få sykemelding?",
    answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
  },
  {
    id: "utredning",
    question: "Hvordan foregår utredning?",
    answer: "Vi tilbyr grundig utredning innen alle våre fagområder. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
  },
];

const Services = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    const results = searchSuggestions(val, 6);
    setSearchResults(results);
    setSelectedIdx(-1);
    setShowResults(val.length > 0 && results.length > 0);
  }, []);

  const onSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      e.preventDefault();
      const item = searchResults[selectedIdx];
      if (item) {
        navigate(item.path);
        setShowResults(false);
        setSearchQuery("");
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  }, [showResults, searchResults, selectedIdx, navigate]);

  useEffect(() => {
    document.title = "Tjenester | CMedical";
  }, []);

  const handleNavigate = (p: string) => {
    window.open(p, "_blank", "noopener,noreferrer");
  };

  // Get primary categories in correct order
  const primaryCategories = primaryOrder
    .map(id => serviceCategories.find(c => c.id === id))
    .filter(Boolean) as typeof serviceCategories;

  // Get "flere fagområder" subcategories + graviditet as line items
  const flereCat = serviceCategories.find(c => c.id === "flere");
  const graviditetCat = serviceCategories.find(c => c.id === "graviditet");
  
  const lineItems = [
    ...(graviditetCat ? [{ label: graviditetCat.label, path: graviditetCat.path }] : []),
    ...(flereCat?.subcategories || []),
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>

      {/* Hero header */}
      <section className="bg-background pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.25em] text-muted-foreground font-light mb-3">
            Fagområder
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">
            Tjenester
          </h1>
          <p className="text-sm md:text-[15px] text-muted-foreground font-light max-w-md mx-auto mb-8">
            Finn behandlingen som passer for deg – ingen henvisning nødvendig
          </p>

          {/* Search */}
          <div ref={searchRef} className="relative max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-foreground/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
                onFocus={() => searchQuery.length > 0 && searchResults.length > 0 && setShowResults(true)}
                placeholder="Søk etter behandling eller fagområde..."
                className="w-full pl-12 pr-5 py-3.5 rounded-sm border border-foreground/15 bg-card/80 text-[15px] font-light text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-all"
              />
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border/60 rounded-sm shadow-lg overflow-hidden"
                >
                  {searchResults.map((item, idx) => (
                    <button
                      key={item.label + item.path}
                      onClick={() => {
                        navigate(item.path);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        idx === selectedIdx ? "bg-muted/60" : "hover:bg-muted/40"
                      } ${idx !== 0 ? "border-t border-border/30" : ""}`}
                    >
                      <div>
                        <span className="text-sm font-light text-foreground">{item.label}</span>
                        <span className="ml-2 text-[10px] tracking-wider text-muted-foreground/60">{item.category}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Primary 4 category image cards */}
      <section className="bg-background pb-10 md:pb-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {primaryCategories.map((category, idx) => {
              const meta = categoryMeta[category.id];
              if (!meta) return null;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="group relative rounded-sm overflow-hidden cursor-pointer aspect-[3/4] md:aspect-[2/3]"
                >
                  <img
                    src={meta.image}
                    alt={category.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between">
                    <span className="text-white font-light text-base md:text-lg">
                      {category.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/80 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  {activeCategory === category.id && (
                    <div className="absolute inset-0 ring-2 ring-accent ring-inset" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Expanded treatments panel */}
          <AnimatePresence>
            {activeCategory && (() => {
              const cat = serviceCategories.find(c => c.id === activeCategory);
              if (!cat) return null;
              return (
                <motion.div
                  key={activeCategory}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 bg-card border border-border/40 rounded-sm px-6 md:px-8 py-7">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-lg font-light text-foreground">{cat.label}</h2>
                        <p className="text-sm text-muted-foreground font-light mt-0.5">
                          {categoryMeta[cat.id]?.intro}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="p-1.5 rounded-full hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => handleNavigate(sub.path)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/60 text-sm font-light text-foreground/70 hover:text-foreground hover:border-foreground/40 hover:bg-muted/40 transition-all duration-200"
                        >
                          {sub.label}
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                      <button
                        onClick={() => navigate(`/booking?kategori=${cat.id}`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-accent-foreground text-sm font-light hover:bg-accent/90 transition-colors"
                      >
                        Bestill time for {cat.label.toLowerCase()}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleNavigate(cat.path)}
                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] font-light text-foreground/50 hover:text-foreground/80 transition-colors"
                      >
                        Les mer
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </section>

      {/* Line-item list for remaining services */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] tracking-[0.25em] text-muted-foreground font-light mb-6">
              Flere tjenester
            </p>
            <div className="divide-y divide-border/50">
              {lineItems.map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center justify-between py-5 group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-muted-foreground/60 group-hover:text-foreground transition-colors">
                      {serviceIcons[item.label] || <Stethoscope className="w-[18px] h-[18px]" />}
                    </span>
                    <span className="text-base font-light text-foreground group-hover:text-foreground/80 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 transition-all group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-brand-mid text-center mb-3 font-light">
              Spørsmål & svar
            </p>
            <h3 className="text-2xl md:text-3xl font-light text-primary-foreground text-center mb-12">
              Ofte stilte spørsmål
            </h3>

            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={faq.id} className={`${index !== 0 ? "border-t border-primary-foreground/10" : ""}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
                  >
                    <span className="text-base md:text-lg font-light text-primary-foreground/90 group-hover:text-accent transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        openFaq === faq.id
                          ? "bg-accent border-accent"
                          : "border-primary-foreground/20 group-hover:border-accent"
                      }`}
                    >
                      {openFaq === faq.id ? (
                        <Minus className="w-3.5 h-3.5 text-accent-foreground" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-primary-foreground/50" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-primary-foreground/60 text-sm md:text-[15px] font-light leading-relaxed pb-6 pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6">
              Ta vare på livet og underlivet
            </h2>
            <p className="text-base md:text-[17px] font-light text-muted-foreground mb-10 max-w-xl mx-auto">
              Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full px-10"
                onClick={() => navigate("/booking")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                asChild
              >
                <Link to="/kontakt">Kontakt oss</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
