import { useEffect, useState, useMemo, useRef } from "react";
import { ArrowRight, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { usePricingPage, useFaqs } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { getImageUrl } from "@/lib/sanityClient";
import { SplitHero } from "@/components/layout/SplitHero";

import pricingHeroAsset from "@/assets/hero/pricing-hero-family.jpg.asset.json";
const pricingHero = pricingHeroAsset.url;

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

const PriserMobile = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const toggleItem = (key: string) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
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


  const ordered = useMemo(() => {
    const prioritized = ['gynekologi', 'urologi', 'fertilitet', 'ortopedi'];
    return [
      ...priceCategories.filter(c => prioritized.includes(c.id)).sort((a, b) => prioritized.indexOf(a.id) - prioritized.indexOf(b.id)),
      ...priceCategories.filter(c => !prioritized.includes(c.id)).sort((a, b) => a.label.localeCompare(b.label, 'nb')),
    ];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('gynekologi');
  const navScrollerRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const suspendSpyUntil = useRef<number>(0);
  const [navTop, setNavTop] = useState(64);

  // IntersectionObserver scroll-spy
  useEffect(() => {
    const sections = ordered.map(c => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suspendSpyUntil.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('cat-', '');
          setActiveCategory(id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [ordered]);

  // Auto-scroll active pill into view
  useEffect(() => {
    const scroller = navScrollerRef.current;
    const pill = pillRefs.current[activeCategory];
    if (!scroller || !pill) return;
    const sLeft = scroller.scrollLeft;
    const sWidth = scroller.clientWidth;
    const pLeft = pill.offsetLeft;
    const pRight = pLeft + pill.offsetWidth;
    const margin = 24;
    if (pLeft < sLeft + margin) {
      scroller.scrollTo({ left: Math.max(0, pLeft - margin), behavior: 'smooth' });
    } else if (pRight > sLeft + sWidth - margin) {
      scroller.scrollTo({ left: pRight - sWidth + margin, behavior: 'smooth' });
    }
  }, [activeCategory]);

  // Sync sticky nav top offset with auto-hiding header
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setNavTop(Math.max(0, header.getBoundingClientRect().bottom));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCat = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const header = document.querySelector('header');
    const headerBottom = header?.getBoundingClientRect().bottom ?? 64;
    const navH = navScrollerRef.current?.getBoundingClientRect().height ?? 48;
    const offset = headerBottom + navH + 16;
    suspendSpyUntil.current = Date.now() + 900;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  };

  const toggleSubcategory = (key: string) => {
    setOpenSubcategory((prev) => (prev === key ? null : key));
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
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
        secondaryCta={{ label: "Kontakt oss", to: "/kontakt" }}
        secondaryCta={{ label: "Kontakt oss", to: "/kontakt" }}
        bottomNote="Alle priser er veiledende «fra»-priser. Endelig pris kan påvirkes av tid på døgnet, helg og tillegg under behandlingen."
      />

      {/* Price List Section */}
      <section id="prisliste" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Sticky horizontal category filter bar (Wolt-style) */}
            <div
              className="sticky z-30 -mx-4 bg-brand-light border-b border-brand-mid/30"
              style={{ top: `${navTop}px` }}
            >
              <div
                ref={navScrollerRef}
                className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide [scroll-behavior:smooth]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {ordered.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      ref={(el) => { pillRefs.current[cat.id] = el; }}
                      onClick={() => { setActiveCategory(cat.id); scrollToCat(cat.id); }}
                      className={`inline-flex items-center justify-center px-3 py-1.5 min-h-[36px] rounded-2xl text-xs font-light whitespace-nowrap border transition-colors shrink-0 ${
                        isActive
                          ? 'bg-brand-dark text-brand-warm border-brand-dark'
                          : 'bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>


            {/* Magasin flow — all categories stacked */}
            <div className="space-y-20 md:space-y-28">
              {ordered.map((cat) => (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="scroll-mt-40"
                >
                  <div className="mb-10 pb-4 border-b border-brand-dark/20">
                    <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
                      {cat.label}
                    </h2>
                  </div>

                  <div className="space-y-12">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.label}
                        className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-10 md:items-start"
                      >
                        <div className="md:sticky md:top-48 md:self-start">
                          <h3 className="text-sm font-normal text-brand-dark">
                            {sub.label}
                          </h3>
                          {sub.path && (
                            <Link
                              to={sub.path}
                              className="inline-flex items-center gap-1 mt-2 text-xs font-light text-brand-dark/70 hover:text-brand-dark hover:gap-2 transition-all"
                            >
                              Les mer om {sub.label.toLowerCase()}
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>

                        <div>
                          <ul className="divide-y divide-brand-mid/30">
                            {sub.items.map((item, idx) => {
                              const isConsult = item.requiresConsultation;
                              const itemKey = `${cat.id}-${sub.label}-${idx}`;
                              const isOpen = !!openItems[itemKey];
                              const priceLabel = item.price === "0,-" ? "Gratis" : item.price;
                              return (
                                <li key={idx} className="py-3 md:py-4">
                                  {/* Name (wraps) + price (top-right, no wrap) on the same row */}
                                  <div className="grid grid-cols-[1fr_120px] gap-3 items-start">
                                    <p className="text-[15px] md:text-base font-normal text-brand-dark leading-snug">
                                      {item.name}
                                    </p>
                                    <span className="text-[15px] md:text-base font-normal text-brand-dark tabular-nums text-right whitespace-normal leading-snug">
                                      {priceLabel}
                                    </span>
                                  </div>

                                  {/* Compact meta row (duration / priceNote) — only if present */}
                                  {(item.duration || item.priceNote) && (
                                    <p className="mt-1 text-xs font-light text-brand-dark/60">
                                      {item.duration}
                                      {item.duration && item.priceNote ? ' · ' : ''}
                                      {item.priceNote}
                                    </p>
                                  )}

                                  {/* Actions row: "+" info toggle, Les mer link, Bestill time */}
                                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                    {item.info && (
                                      <button
                                        type="button"
                                        onClick={() => toggleItem(itemKey)}
                                        className="inline-flex items-center gap-1.5 text-xs font-light text-brand-dark hover:text-brand-dark/80 transition-colors"
                                        aria-expanded={isOpen}
                                        aria-controls={`info-${itemKey}`}
                                      >
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-2xl border border-brand-dark/30 text-brand-dark">
                                          {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                        </span>
                                        {isOpen ? 'Skjul beskrivelse' : 'Les beskrivelse'}
                                      </button>
                                    )}
                                    {item.path && (
                                      <Link
                                        to={item.path}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-dark underline underline-offset-4 decoration-brand-dark/40 hover:decoration-brand-dark transition-colors"
                                      >
                                        Les mer om {item.name.toLowerCase()}
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    )}
                                    {!(isConsult || item.price === "Pris ved konsultasjon") && (
                                      <Link
                                        to={buildBookingUrl({ kategori: cat.id })}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-light text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors whitespace-nowrap"
                                      >
                                        Bestill time
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    )}
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {isOpen && item.info && (
                                      <motion.div
                                        id={`info-${itemKey}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <p className="mt-3 text-xs md:text-sm font-light text-brand-dark/75 leading-relaxed max-w-2xl">
                                          {item.info}
                                        </p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </li>
                              );
                            })}
                          </ul>
                          {sub.path && (
                            <div className="pt-4 mt-1">
                              <Link
                                to={sub.path}
                                className="inline-flex items-center gap-2 text-xs font-medium text-brand-dark underline underline-offset-4 decoration-brand-dark/40 hover:decoration-brand-dark transition-all"
                              >
                                Les mer om {sub.label.toLowerCase()}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-6 border-t border-brand-mid/30">
                    <Link
                      to={cat.path}
                      className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                    >
                      Les mer om {cat.label.toLowerCase()}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>
              ))}
            </div>
          </div>


          {/* CTA */}
          <div className="mt-20 md:mt-24 text-center">
            <button
              onClick={() => navigate('/booking')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-normal text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors"
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
              className="rounded-2xl md:rounded-full border border-white text-white bg-transparent hover:bg-white hover:text-brand-dark"
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

export default PriserMobile;
