import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Plus, Minus, Clock, Star, ExternalLink, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { usePricingPage, useFaqs } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { getImageUrl } from "@/lib/sanityClient";
import { SplitHero } from "@/components/layout/SplitHero";

import pricingHero from "@/assets/hero/pricing-hero.jpg";

// Note: The page uses Sanity data via usePricingPage() when available,
// falling back to the static priceCategories below.
// Price categories live in src/data/priceList.ts so the treatment hero
// CTAs can derive a "Pris fra" from the same source as this page.
import { priceCategories } from "@/data/priceList";
import { buildBookingUrl } from "@/lib/bookingLinks";

interface PageProps { isChatOpen: boolean }

const testimonials = [
  {
    id: 1,
    name: "Maria S.",
    rating: 5,
    text: "Fantastisk opplevelse fra start til slutt. Spesialistene tok seg god tid og jeg følte meg trygg hele veien.",
    treatment: "Gynekologi"
  },
  {
    id: 2,
    name: "Anders L.",
    rating: 5,
    text: "Profesjonell og diskret behandling. Veldig fornøyd med prisene og servicen.",
    treatment: "Urologi"
  },
  {
    id: 3,
    name: "Sofie H.",
    rating: 5,
    text: "Utrolig takknemlig for den hjelpen vi fikk. Moderne utstyr og dyktige spesialister.",
    treatment: "Fertilitet"
  },
];

const staticFaqs = [
  {
    id: "henvisning",
    question: "Trenger jeg henvisning?",
    answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
  },
  {
    id: "betaling",
    question: "Hvilke betalingsmåter aksepterer dere?",
    answer: "Vi aksepterer kort, Vipps og faktura. Ved forsikringsdekning sender vi faktura direkte til forsikringsselskapet.",
  },
  {
    id: "forsikring",
    question: "Dekker forsikringen min behandlingen?",
    answer: "De fleste helseforsikringer dekker konsultasjoner og behandlinger hos oss. Ta kontakt med ditt forsikringsselskap for å bekrefte dekning før timen.",
  },
  {
    id: "avbestilling",
    question: "Hva er avbestillingsfristen?",
    answer: "Avbestilling må skje senest 24 timer før avtalt time. Ved sen avbestilling eller ikke oppmøte faktureres full konsultasjonspris.",
  },
];

const Priser = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(() => {
    const cat = priceCategories.find(c => c.id === 'gynekologi');
    return cat ? 'gynekologi' : (priceCategories[0]?.id ?? null);
  });
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(() => {
    const cat = priceCategories.find(c => c.id === 'gynekologi');
    return cat?.subcategories[0]?.label ?? null;
  });
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { sorted } = useSpecialistsData();
  const specialists = sorted.slice(0, 8);
  const { data: sanityPricing } = usePricingPage();
  const { data: sanityFaqs } = useFaqs("priser");
  const faqs = sanityFaqs && sanityFaqs.length > 0
    ? sanityFaqs.map((f: any, i: number) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
    : staticFaqs;
  const heroImage = sanityPricing?.heroImage ? getImageUrl(sanityPricing.heroImage) : pricingHero;
  const pageTitle = sanityPricing?.title || "Prisliste";
  const pageSubtitle = sanityPricing?.introText || "Oversiktlige priser sortert etter tjeneste";

  useEffect(() => {
    document.title = "Priser | CMedical";
  }, []);

  const toggleCategory = (id: string) => {
    const newId = expandedCategory === id ? null : id;
    setExpandedCategory(newId);
    setExpandedSubcategory(null);
    if (newId) {
      const scrollToCat = () => {
        const el = document.getElementById(`kat-${newId}`);
        if (!el) return;
        const header = document.querySelector('header');
        const offset = (header?.getBoundingClientRect().height ?? 80) + 16;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      };
      requestAnimationFrame(scrollToCat);
      setTimeout(scrollToCat, 320);
    }
  };

  const toggleSubcategory = (label: string) => {
    const newLabel = expandedSubcategory === label ? null : label;
    setExpandedSubcategory(newLabel);
    if (newLabel) {
      const scrollToSub = () => {
        const el = document.getElementById(`sub-${newLabel}`);
        if (!el) return;
        const header = document.querySelector('header');
        const offset = (header?.getBoundingClientRect().height ?? 80) + 16;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      };
      requestAnimationFrame(scrollToSub);
      setTimeout(scrollToSub, 320);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };


  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={sanityPricing?.seo?.metaTitle || "Priser – Oversiktlig prisliste sortert etter tjeneste"}
        description={sanityPricing?.seo?.metaDescription || "Se alle priser hos CMedical. Oversiktlig prisliste for gynekologi, fertilitet, urologi, ortopedi og flere tjenester. Transparent og forutsigbar prising."}
        canonical="/priser"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Priser", path: "/priser" },
        ]}
      />
      <SplitHero
        title={pageTitle}
        description={pageSubtitle}
        image={heroImage}
        imageAlt={pageTitle}
        primaryCta={{ label: "Bestill time", to: "/booking" }}
        secondaryCta={{ label: "Kontakt oss", to: "/kontakt" }}
      />

      {/* Price List Section */}
      <section id="prisliste" className="py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          {(() => {
            const prioritized = ['gynekologi', 'urologi', 'fertilitet', 'ortopedi'];
            const ordered = [
              ...priceCategories.filter(c => prioritized.includes(c.id)).sort((a, b) => prioritized.indexOf(a.id) - prioritized.indexOf(b.id)),
              ...priceCategories.filter(c => !prioritized.includes(c.id)).sort((a, b) => a.label.localeCompare(b.label, 'nb')),
            ];
            return (
              <div className="max-w-5xl mx-auto">
                <p className="text-xs text-muted-foreground font-light mb-5">
                  Alle priser er veiledende «fra»-priser. Endelig pris kan påvirkes av tid på døgnet, helg og tillegg under behandlingen.
                </p>

                <div className="space-y-3">
                  {ordered.map((category) => {
                    const isOpen = expandedCategory === category.id;
                    const totalItems = category.subcategories.reduce((s, sc) => s + sc.items.length, 0);
                    return (
                      <div
                        id={`kat-${category.id}`}
                        key={category.id}
                        className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                          isOpen
                            ? 'bg-white border-brand-dark/15 border-l-[6px] border-l-brand-dark shadow-[0_4px_24px_rgba(66,51,42,0.08)]'
                            : 'bg-muted border-brand-dark/15 hover:border-brand-dark/30'
                        }`}
                      >
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-5 md:p-6 gap-4 text-left group transition-colors"
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Lukk' : 'Åpne'} ${category.label}`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xl md:text-2xl font-light truncate transition-colors ${
                              isOpen ? 'text-brand-dark' : 'text-foreground group-hover:text-foreground/90'
                            }`}>
                              {category.label}
                            </span>
                            <span className={`text-xs font-light mt-1 ${
                              isOpen ? 'text-brand-dark/60' : 'text-muted-foreground'
                            }`}>
                              {totalItems} tjenester
                            </span>
                          </div>
                          <span
                            aria-hidden="true"
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all border ${
                              isOpen
                                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                                : 'bg-background text-foreground/80 border-foreground/20 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground'
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                            />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 md:px-6 pb-6 md:pb-8">
                                <div className="space-y-2">
                                  {category.subcategories.map((sub) => {
                                    const subOpen = expandedSubcategory === sub.label;
                                    return (
                                      <div
                                        key={sub.label}
                                        id={`sub-${sub.label}`}
                                        className={`scroll-mt-24 rounded-xl border transition-all ${
                                          subOpen
                                            ? 'bg-brand-beige/30 border-brand-dark/15'
                                            : 'bg-white border-brand-dark/20 hover:border-brand-mid/60'
                                        }`}
                                      >

                                        <button
                                          onClick={() => toggleSubcategory(sub.label)}
                                          className={`w-full flex items-center justify-between py-4 px-4 md:px-5 cursor-pointer text-left transition-colors ${
                                            subOpen
                                              ? 'bg-brand-beige/60 rounded-t-xl border-b border-brand-dark/10'
                                              : ''
                                          }`}
                                          aria-expanded={subOpen}
                                        >
                                          <span
                                            className={`text-[15px] md:text-base transition-colors ${
                                              subOpen ? 'text-brand-dark font-medium' : 'text-foreground/80 font-light'
                                            }`}
                                          >
                                            {sub.label}
                                          </span>
                                          <div className="flex items-center gap-3">
                                            <span className="text-brand-dark/40 text-sm font-light">
                                              {sub.items.length}
                                            </span>
                                            <ChevronRight
                                              className={`w-4 h-4 text-brand-mid transition-all ${
                                                subOpen ? 'rotate-90 text-foreground/80' : 'group-hover:text-brand-dark'
                                              }`}
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                          {subOpen && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.15 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="p-3 md:p-4 space-y-1">
                                                {sub.items.map((item, idx) => {
                                                  const isConsult = item.requiresConsultation;
                                                  return (
                                                    <div
                                                      key={idx}
                                                      className="py-3 border-b border-brand-dark/5 last:border-b-0"
                                                    >
                                                      <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0 max-w-prose">
                                                          <span className="block font-normal text-brand-dark">
                                                            {item.name}
                                                          </span>
                                                          {item.duration && (
                                                            <div className="flex items-center gap-3 mt-1 text-sm text-brand-dark/70 font-light flex-wrap">
                                                              <span>{item.duration}</span>
                                                            </div>
                                                          )}
                                                          {item.info && (
                                                            <div className="mt-2 flex items-start gap-2 max-w-[52ch]">
                                                              <Info className="w-4 h-4 text-brand-dark/50 mt-0.5 shrink-0" strokeWidth={1.5} />
                                                              <p className="text-xs font-light text-brand-dark/70 leading-relaxed">
                                                                {item.info}
                                                              </p>
                                                            </div>
                                                          )}
                                                        </div>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                          {isConsult ? (
                                                            <Link
                                                              to={sub.path}
                                                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-light text-brand-dark border border-brand-dark/25 hover:bg-brand-dark hover:text-white transition-colors"
                                                            >
                                                              Les mer
                                                              <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                          ) : (
                                                            <Link
                                                              to={buildBookingUrl({ kategori: category.id })}
                                                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-light text-brand-dark border border-brand-dark/25 hover:bg-brand-dark hover:text-white transition-colors"
                                                            >
                                                              Bestill time
                                                              <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                          )}
                                                          <span className="text-sm font-light text-brand-dark tabular-nums min-w-[70px] text-right">
                                                            {item.price === "0,-" ? "Gratis" : item.price}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                                {/* Les mer — nederst i underfane */}
                                                <div className="pt-4 border-t border-brand-dark/10 mt-2">
                                                  <Link
                                                    to={sub.path}
                                                    className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                                                  >
                                                    Les mer om {sub.label.toLowerCase()}
                                                    <ArrowRight className="w-4 h-4" />
                                                  </Link>
                                                </div>
                                              </div>

                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Les mer — plassert nederst i åpen boks */}
                                <div className="mt-6 pt-5 border-t border-brand-dark/10">
                                  <Link
                                    to={category.path}
                                    className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                                  >
                                    Les mer om {category.label.toLowerCase()}
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* CTA */}
          <div className="mt-16 md:mt-20 text-center">
            <button 
              onClick={() => navigate('/booking')} 
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white rounded-full font-normal hover:bg-brand-dark/90 transition-colors"
            >
              Bestill time
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Specialists Section - Dark background */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10">
            <p className="text-sm text-white/60 mb-3 font-light">
              Våre spesialister
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-white">
              Erfaring, spisskompetanse og moderne teknologi
            </h2>
            <p className="text-white/70 mt-3 max-w-2xl font-light">
              Samlet på ett sted for å gi deg den beste behandlingen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {specialists.map((specialist) => (
              <Link
                to={`/spesialister/${specialist.slug}`}
                key={specialist.slug}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-normal text-white text-sm md:text-base mb-0.5">
                      {specialist.name}
                    </h3>
                    <p className="text-white/70 text-xs font-light line-clamp-1 pr-4">
                      {specialist.expertise.join(', ')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="ghost"
              className="rounded-full border border-white text-white bg-transparent hover:bg-white hover:text-brand-dark"
              asChild
            >
              <Link to="/om-oss">
                Se alle spesialister
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-brand-warm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span className="text-brand-dark font-normal">4.8 / 5</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-normal text-brand-dark">
              Hva pasientene sier
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 font-light leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-normal text-foreground">{testimonial.name}</p>
                  <span className="text-xs text-muted-foreground">{testimonial.treatment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-normal text-foreground mb-8">
              Ofte stilte spørsmål om priser
            </h3>
            
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className={`${index !== 0 ? 'border-t border-border' : ''}`}
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)} 
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground group-hover:text-foreground/80 transition-colors">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all ${
                      openFaq === faq.id ? 'bg-secondary' : ''
                    }`}>
                      {openFaq === faq.id ? (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed pb-5 pr-12">
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

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-6">
              Ta vare på livet og underlivet
            </h2>
            <p className="text-base md:text-[17px] font-light text-white/70 mb-10 max-w-xl mx-auto">
              Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="cta-dark"
                size="lg" 
                className="px-8"
                onClick={() => navigate('/booking')}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="cta-outline-dark"
                size="lg" 
                asChild
              >
                <Link to="/kontakt">
                  Kontakt oss
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Priser;
