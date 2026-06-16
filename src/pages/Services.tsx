import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, Plus, Minus, ChevronRight, Search } from "lucide-react";
import { getServiceIcon } from "@/pages/treatments/categoryPageContent";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { serviceCategories as staticServiceCategories } from "@/data/serviceCategories";
import { searchSuggestions, type SearchItem } from "@/data/searchData";
import { useTreatmentCategories, useFaqs, useServicesPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { FaqSection } from "@/components/layout/FaqSection";
import { ServicesListSection } from "@/components/layout/ServicesListSection";

// Static fallback images
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import urologiImg from "@/assets/categories/urologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import ortopediImg from "@/assets/categories/ortopedi-real.jpg";
import graviditetImg from "@/assets/hero/hero-pregnancy.jpg";
import flereImg from "@/assets/categories/flere-fagomrader.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const staticFaqs = [
  { id: "henvisning", question: "Trenger jeg henvisning?", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Hva er ventetiden?", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Kan jeg få sykemelding?", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Hvordan foregår utredning?", answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
];

const staticFeatured = [
  { label: "Gynekologi", image: gynekologiImg, path: "/gynekologi" },
  { label: "Urologi", image: urologiImg, path: "/urologi" },
  { label: "Fertilitet", image: fertilitetImg, path: "/fertilitet" },
  { label: "Graviditet", image: graviditetImg, path: "/graviditet" },
  { label: "Ortopedi", image: ortopediImg, path: "/ortopedi" },
  { label: "Flere tjenester", image: flereImg, path: "/flere-fagomrader" },
];

// Icons for "Flere tjenester" grid use the shared Claude.ai (-cl) set via getServiceIcon

const Services = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: sanityCategories } = useTreatmentCategories();
  const { data: sanityFaqs } = useFaqs("tjenester");
  const { data: servicesPage } = useServicesPage();

  const faqs = sanityFaqs && sanityFaqs.length > 0
    ? sanityFaqs.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
    : staticFaqs;

  const serviceCategories = sanityCategories?.length
    ? (() => {
        const seen = new Set<string>();
        return sanityCategories
          .filter((c: any) => {
            const key = c.categoryId || c.slug;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .map((c: any) => ({
            id: c.categoryId || c.slug,
            label: c.title,
            path: `/${c.categoryId || c.slug}`,
            subcategories: (c.treatments || []).map((t: any) => ({
              label: t.title,
              path: `/behandlinger/${c.categoryId || c.slug}/${t.slug}`,
            })),
          }));
      })()
    : staticServiceCategories;

  // Featured service cards from Sanity
  const featuredServices = sanityCategories?.length
    ? (() => {
        const seen = new Set<string>();
        return sanityCategories
          .filter((c: any) => {
            const key = c.categoryId || c.slug;
            if (seen.has(key)) return false;
            seen.add(key);
            return ["gynekologi", "urologi", "fertilitet", "graviditet", "ortopedi", "flere-fagomrader"].includes(key);
          })
          .map((c: any) => ({
            label: c.title,
            image: c.heroImage || staticFeatured.find(s => s.label === c.title)?.image || "",
            path: `/${c.categoryId || c.slug}`,
          }));
      })()
    : staticFeatured;

  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
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
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(prev => Math.min(prev + 1, searchResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(prev => Math.max(prev - 1, 0)); }
    else if (e.key === "Enter" && selectedIdx >= 0) { e.preventDefault(); const item = searchResults[selectedIdx]; if (item) { navigate(item.path); setShowResults(false); setSearchQuery(""); } }
    else if (e.key === "Escape") setShowResults(false);
  }, [showResults, searchResults, selectedIdx, navigate]);

  useEffect(() => { document.title = "Tjenester | CMedical"; }, []);

  // Build "Flere tjenester" list — everything NOT in the 5 featured cards
  const primaryIds = ["gynekologi", "urologi", "fertilitet", "graviditet", "ortopedi", "flere-fagomrader"];
  const additionalServices: { label: string; path: string }[] = [];

  // Add non-primary categories
  serviceCategories.forEach((cat: any) => {
    if (!primaryIds.includes(cat.id)) {
      if (cat.id === "flere" || cat.id === "flere-fagomrader") {
        // Expand subcategories
        cat.subcategories?.forEach((sub: any) => {
          additionalServices.push({ label: sub.label, path: sub.path });
        });
      } else {
        additionalServices.push({ label: cat.label, path: cat.path });
      }
    }
  });
  additionalServices.sort((a, b) => a.label.localeCompare(b.label, "nb"));

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={servicesPage?.seo?.metaTitle || "Tjenester – Finn behandlingen som passer for deg"}
        description={servicesPage?.seo?.metaDescription || "Se alle tjenester hos CMedical: gynekologi, graviditet, fertilitet, urologi, ortopedi og flere fagområder. Ingen henvisning, kort ventetid."}
        canonical="/tjenester"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
        ]}
      />
      {/* Hero header */}
      <section className="bg-background pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">Tjenester</h1>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-md mx-auto mb-4">Finn behandlingen som passer for deg</p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border text-sm font-light text-foreground/70">Ingen henvisning</span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border text-sm font-light text-foreground/70">Ingen ventetid</span>
          </div>

          <div ref={searchRef} className="relative max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-foreground/60" aria-hidden="true" />
              <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} onKeyDown={onSearchKeyDown} onFocus={() => searchQuery.length > 0 && searchResults.length > 0 && setShowResults(true)} placeholder="Søk etter behandling eller fagområde..." aria-label="Søk etter behandling eller fagområde" className="w-full pl-12 pr-5 py-3.5 rounded-sm border border-foreground/30 bg-card text-[15px] font-light text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-foreground transition-all" />
            </div>
            <AnimatePresence>
              {showResults && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border/60 rounded-sm shadow-lg overflow-hidden">
                  {searchResults.map((item, idx) => (
                    <button key={item.label + item.path} onClick={() => { navigate(item.path); setShowResults(false); setSearchQuery(""); }} className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${idx === selectedIdx ? "bg-muted/60" : "hover:bg-muted/40"} ${idx !== 0 ? "border-t border-border/30" : ""}`}>
                      <div>
                        <span className="text-sm font-light text-foreground">{item.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground/60">{item.category}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Fagområder — Featured services (full-bleed, no gaps) */}
      <section className="bg-background pb-10 md:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
          {featuredServices.map((item: any, idx: number) => (
            <motion.button key={item.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.05 }} onClick={() => navigate(item.path)} className="group relative aspect-[3/4] overflow-hidden">
              <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-center justify-between">
                <span className="text-base md:text-lg font-light text-white">{item.label}</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Flere tjenester — unified list section */}
      {additionalServices.length > 0 && (
        <ServicesListSection
          title="Vet du allerede hva du trenger?"
          description="Klikk og book direkte, eller les mer om den enkelte tjenesten."
          items={additionalServices.map((s) => ({ title: s.label, href: s.path }))}
          bookingCta
        />
      )}

      {/* Unified FAQ — same as home */}
      <FaqSection faqs={faqs} />

      {/* Unified pre-footer CTA */}
      <BookingCTA />
    </PageLayout>
  );
};

export default Services;
