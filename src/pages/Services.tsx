import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, Plus, Minus, ChevronRight, Search } from "lucide-react";
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
    answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
  },
];

const Services = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Build a flat list of ALL services sorted A-Ø
  const allServices: { label: string; path: string }[] = [];

  // Add primary categories as services too
  const primaryIds = ["gynekologi", "urologi", "fertilitet", "ortopedi"];
  primaryIds.forEach(id => {
    const cat = serviceCategories.find(c => c.id === id);
    if (cat) allServices.push({ label: cat.label, path: cat.path });
  });

  // Add graviditet
  const graviditetCat = serviceCategories.find(c => c.id === "graviditet");
  if (graviditetCat) allServices.push({ label: graviditetCat.label, path: graviditetCat.path });

  // Add all "flere" subcategories
  const flereCat = serviceCategories.find(c => c.id === "flere");
  if (flereCat) {
    flereCat.subcategories.forEach(sub => {
      allServices.push({ label: sub.label, path: sub.path });
    });
  }

  // Sort A-Ø
  allServices.sort((a, b) => a.label.localeCompare(b.label, "nb"));

  return (
    <PageLayout isChatOpen={isChatOpen}>

      {/* Hero header */}
      <section className="bg-background pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">
            Tjenester
          </h1>
          <p className="text-sm md:text-[15px] text-muted-foreground font-light max-w-md mx-auto mb-4">
            Finn behandlingen som passer for deg
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/60 text-xs font-light text-foreground/70">
              Ingen henvisning
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/60 text-xs font-light text-foreground/70">
              Ingen ventetid
            </span>
          </div>

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
                placeholder="Søk etter behandling eller tjeneste..."
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
                        <span className="ml-2 text-[10px] text-muted-foreground/60">{item.category}</span>
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

      {/* Utvalgte tjenester - image cards */}
      <section className="bg-background pb-10 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs text-muted-foreground font-light mb-6">
              Utvalgte tjenester
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Gynekologi", image: gynekologiImg, path: "/gynekologi" },
                { label: "Urologi", image: urologiImg, path: "/urologi" },
                { label: "Fertilitet", image: fertilitetImg, path: "/fertilitet" },
                { label: "Ortopedi", image: ortopediImg, path: "/ortopedi" },
              ].map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => navigate(item.path)}
                  className="group relative aspect-[3/4] rounded-sm overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                    <span className="text-sm font-light text-white">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alle tjenester - single column, A-Ø */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs text-muted-foreground font-light mb-6">
              Alle tjenester
            </p>
            <div className="divide-y divide-border/50">
              {allServices.map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between py-4 md:py-5 group text-left"
                >
                  <span className="text-base md:text-lg font-light text-foreground group-hover:text-foreground/80 transition-colors">
                    {item.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 transition-all group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - same style as homepage (beige background) */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground text-center mb-3 font-light">
              Spørsmål & svar
            </p>
            <h3 className="text-xl md:text-2xl font-normal text-foreground text-center mb-8">
              Ofte stilte spørsmål
            </h3>

            <div className="space-y-0 border-t border-border">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between py-5 text-left hover:text-brand-dark transition-colors"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground">
                      {faq.question}
                    </span>
                    {openFaq === faq.id ? (
                      <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openFaq === faq.id ? "max-h-40 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
              Ta vare på livet og underlivet
            </h2>
            <p className="text-base md:text-[17px] font-light text-white/60 mb-10 max-w-xl mx-auto">
              Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-sm bg-white text-brand-dark hover:bg-white/90 px-10"
                onClick={() => navigate("/booking")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark rounded-sm"
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
