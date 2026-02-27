import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Plus, Minus, Clock, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSpecialistsSortedByLastName } from "@/data/specialists";

import pricingHero from "@/assets/hero/pricing-hero.jpg";

interface PageProps { isChatOpen: boolean }

interface PriceItem {
  name: string;
  price: string;
  duration: string;
}

interface PriceSubcategory {
  label: string;
  path: string;
  items: PriceItem[];
}

interface PriceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: PriceSubcategory[];
}

// Price categories matching the service categories structure
const priceCategories: PriceCategory[] = [
  {
    id: 'gynekologi',
    label: 'Gynekologi',
    path: '/gynekologi',
    subcategories: [
      {
        label: 'Generell gynekologi',
        path: '/behandlinger/gynekologi/undersokelse',
        items: [
          { name: "Gynekologisk undersøkelse", price: "kr 2100,-", duration: "30 min" },
          { name: "Kontroll / oppfølging", price: "kr 2100,-", duration: "30 min" },
          { name: "Digitaltime Gynekolog", price: "kr 2100,-", duration: "20 min" },
        ]
      },
      {
        label: 'Hormoner og overgangsalder',
        path: '/behandlinger/gynekologi/overgangsalder',
        items: [
          { name: "Overgangsalder", price: "kr 3200,-", duration: "45 min" },
          { name: "PCOS / Hormonforstyrrelser", price: "kr 3200,-", duration: "45 min" },
          { name: "Premenstruelle plager (PMS / PMDD)", price: "kr 3200,-", duration: "45 min" },
        ]
      },
      {
        label: 'Endometriose og smerter',
        path: '/behandlinger/gynekologi/endometriose',
        items: [
          { name: "Endometriose / adenomyose", price: "kr 3200,-", duration: "45 min" },
          { name: "Smerter i underlivet / Vulvodyni / Vaginisme", price: "kr 3200,-", duration: "45 min" },
        ]
      },
      {
        label: 'Blødningsforstyrrelser',
        path: '/behandlinger/gynekologi/blodningsfortyrrelser',
        items: [
          { name: "Blødningsforstyrrelser / muskelknuter / polypper", price: "kr 3200,-", duration: "45 min" },
        ]
      },
      {
        label: 'Urinlekkasje og fremfall',
        path: '/behandlinger/gynekologi/urinlekkasje',
        items: [
          { name: "Urinlekkasje", price: "kr 2100,-", duration: "30 min" },
          { name: "Fremfall / tyngdefølelse underliv", price: "kr 2100,-", duration: "30 min" },
        ]
      },
      {
        label: 'Graviditet og fødsel',
        path: '/behandlinger/gynekologi/graviditet',
        items: [
          { name: "Svangerskapskontroll", price: "kr 2100,-", duration: "30 min" },
          { name: "Tidlig ultralyd enkel", price: "kr 2100,-", duration: "30 min" },
          { name: "Kontroll etter fødsel", price: "kr 2100,-", duration: "30 min" },
          { name: "Ammehjelp ved brystbetennelse", price: "kr 3200,-", duration: "45 min" },
        ]
      },
      {
        label: 'Hudlidelser vulva',
        path: '/behandlinger/gynekologi/vulvalidelser',
        items: [
          { name: "Hudlidelser vulva", price: "kr 2100,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'urologi',
    label: 'Urologi',
    path: '/urologi',
    subcategories: [
      {
        label: 'Prostata',
        path: '/behandlinger/urologi/prostata',
        items: [
          { name: "Prostataundersøkelse", price: "kr 1900,-", duration: "30 min" },
          { name: "Uforpliktende telefonsamtale om prostata", price: "kr 0,-", duration: "15 min" },
        ]
      },
      {
        label: 'Blære og urinveier',
        path: '/behandlinger/urologi/blaere-og-urinveier',
        items: [
          { name: "Konsultasjon urolog", price: "kr 1900,-", duration: "30 min" },
          { name: "Blod i urin, cystoskopi", price: "kr 2650,-", duration: "30 min" },
        ]
      },
      {
        label: 'Sterilisering',
        path: '/behandlinger/urologi/sterilisering',
        items: [
          { name: "Sterilisering Mann", price: "kr 6500,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'fertilitet',
    label: 'Fertilitet',
    path: '/fertilitet',
    subcategories: [
      {
        label: 'Utredning',
        path: '/behandlinger/fertilitet/fertilitet-infertilitet',
        items: [
          { name: "Fertilitetsutredning enkeltperson/single", price: "kr 2850,-", duration: "1 time" },
          { name: "Fertilitetsutredning par", price: "kr 2850,-", duration: "1 time" },
          { name: "Uforpliktende telefonsamtale med sykepleier", price: "kr 0,-", duration: "20 min" },
        ]
      },
      {
        label: 'Sædanalyse',
        path: '/behandlinger/fertilitet/saedanalyse',
        items: [
          { name: "Enkel sædanalyse", price: "kr 1950,-", duration: "30 min" },
          { name: "Infertilitet Mann (inkl. sædprøve)", price: "kr 2850,-", duration: "45 min" },
        ]
      },
      {
        label: 'Oppfølging',
        path: '/behandlinger/fertilitet/oppfolging',
        items: [
          { name: "Telefonkonsultasjon fertilitet", price: "kr 2850,-", duration: "45 min" },
          { name: "Samtaleterapi under fertilitetsbehandling", price: "kr 1000,-", duration: "1 time" },
        ]
      },
      {
        label: 'Fosterdiagnostikk',
        path: '/behandlinger/gynekologi/graviditet',
        items: [
          { name: "Tidlig ultralyd", price: "kr 2100,-", duration: "30 min" },
          { name: "Organrettet ultralyd", price: "kr 2100,-", duration: "30 min" },
          { name: "Tidlig ultralyd + NIPT-test", price: "kr 8990,-", duration: "30 min" },
          { name: "Organrettet ultralyd + NIPT test (uke 12-14)", price: "kr 9950,-", duration: "30 min" },
          { name: "Svangerskapskontroll", price: "kr 2100,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'ortopedi',
    label: 'Ortopedi',
    path: '/ortopedi',
    subcategories: [
      {
        label: 'Konsultasjoner',
        path: '/behandlinger/ortopedi/konsultasjon',
        items: [
          { name: "Konsultasjon ortoped skulder", price: "kr 1800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped kne", price: "kr 1800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped hofte", price: "kr 1800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped fot/ankel", price: "kr 1800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped hånd", price: "kr 1800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped albue", price: "kr 1800,-", duration: "30 min" },
        ]
      },
      {
        label: 'Håndterapi',
        path: '/behandlinger/ortopedi/hand-albue',
        items: [
          { name: "Konsultasjon håndterapeut", price: "kr 1400,-", duration: "45 min" },
        ]
      },
      {
        label: 'Fysioterapi',
        path: '/behandlinger/ortopedi/fysioterapi',
        items: [
          { name: "Oppfølgingstime Fysioterapeut / Osteopat 60 min", price: "kr 1800,-", duration: "1 time" },
          { name: "Oppfølgingstime Fysioterapeut / Osteopat 30 min", price: "kr 950,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'flere',
    label: 'Flere fagområder',
    path: '/flere-fagomrader',
    subcategories: [
      {
        label: 'Endokrinologi',
        path: '/behandlinger/flere-fagomrader/endokrinologi',
        items: [
          { name: "Endokrinolog 60 min konsultasjon", price: "kr 4500,-", duration: "1 time" },
          { name: "Endokrinolog oppfølging/kontroll 30 min", price: "kr 2900,-", duration: "30 min" },
        ]
      },
      {
        label: 'Gastrokirurgi',
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
        items: [
          { name: "Digital konsultasjon fedme vurdering", price: "kr 0,-", duration: "45 min" },
          { name: "Endetarmsplager", price: "kr 2100,-", duration: "30 min" },
          { name: "Mage / tarm spesialist", price: "kr 2100,-", duration: "30 min" },
        ]
      },
      {
        label: 'Psykologi',
        path: '/behandlinger/flere-fagomrader/psykologi',
        items: [
          { name: "Psykolog 50 min", price: "kr 1900,-", duration: "1 time" },
          { name: "Psykolog 50 min, digitaltime", price: "kr 1900,-", duration: "1 time" },
          { name: "Psykolog 80 min", price: "kr 2500,-", duration: "1 time 30 min" },
          { name: "Psykolog 80 min, digitaltime", price: "kr 2500,-", duration: "1 time 30 min" },
          { name: "Psykolog partime 50 min", price: "kr 2300,-", duration: "1 time" },
          { name: "Psykolog partime 80 min", price: "kr 2950,-", duration: "1 time 30 min" },
        ]
      },
      {
        label: 'Sexologi',
        path: '/behandlinger/flere-fagomrader/sexologi',
        items: [
          { name: "Sexolog", price: "kr 1600,-", duration: "1 time" },
          { name: "Sexolog for par", price: "kr 1600,-", duration: "1 time" },
        ]
      },
      {
        label: 'Revmatologi',
        path: '/behandlinger/flere-fagomrader/revmatologi',
        items: [
          { name: "Førstegangskonsultasjon revmatolog", price: "kr 3150,-", duration: "45 min" },
        ]
      },
      {
        label: 'Ernæringsfysiolog',
        path: '/behandlinger/flere-fagomrader/ernaeringsfysiolog',
        items: [
          { name: "Klinisk ernæringsfysiolog", price: "kr 1990,-", duration: "1 time" },
          { name: "Klinisk ernæringsfysiolog oppfølging", price: "kr 1500,-", duration: "45 min" },
        ]
      },
      {
        label: 'Åreknutebehandling',
        path: '/behandlinger/flere-fagomrader/areknutebehandling',
        items: [
          { name: "Vurdering åreknuter", price: "kr 1800,-", duration: "30 min" },
        ]
      },
    ]
  },
];

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

const faqs = [
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>('gynekologi');
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const specialists = getSpecialistsSortedByLastName().slice(0, 8);

  useEffect(() => {
    document.title = "Priser | CMedical";
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedSubcategory(null);
  };

  const toggleSubcategory = (label: string) => {
    setExpandedSubcategory(expandedSubcategory === label ? null : label);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero Section - Compact */}
      <header className="relative">
        <div className="h-[25vh] md:h-[30vh] relative">
          <img 
            src={pricingHero} 
            alt="Priser" 
            className="w-full h-full object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:px-16">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white">
                Prisliste
              </h1>
              <p className="text-white/70 mt-2 max-w-lg font-light text-sm md:text-base">
                Oversiktlige priser sortert etter fagområde
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Price List Section */}
      <section id="prisliste" className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {/* Categories - Direct content */}
          <div className="max-w-5xl mx-auto space-y-4">
            {priceCategories.map((category) => (
              <div 
                key={category.id}
                className={`rounded-xl overflow-hidden transition-all duration-300 border ${
                  expandedCategory === category.id 
                    ? 'bg-white border-border shadow-sm' 
                    : 'bg-white/60 border-border/50 hover:bg-white hover:border-border'
                }`}
              >
                {/* Category Header - entire bar is clickable to toggle */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer text-left"
                  aria-expanded={expandedCategory === category.id}
                  aria-label={`${expandedCategory === category.id ? 'Lukk' : 'Åpne'} ${category.label}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(category.path);
                      }}
                      className="text-xl md:text-2xl font-light text-foreground underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground/60 transition-colors"
                    >
                      {category.label}
                    </span>
                    <span className="text-sm font-light text-muted-foreground">
                      {category.subcategories.reduce((sum, sub) => sum + sub.items.length, 0)} tjenester
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all bg-foreground/5 border border-foreground/10`}>
                    {expandedCategory === category.id ? (
                      <Minus className="w-4 h-4 text-foreground/50" aria-hidden="true" />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground/50" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {/* Subcategories - Expanded Content */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 md:pb-8 space-y-3">
                        {category.subcategories.map((sub) => (
                          <div 
                            key={sub.label}
                            className={`rounded-lg transition-all border ${
                              expandedSubcategory === sub.label 
                                ? 'bg-secondary/60 border-border/50' 
                                : 'bg-secondary/30 border-transparent hover:bg-secondary/50 hover:border-border/30'
                            }`}
                          >
                            <button
                              onClick={() => toggleSubcategory(sub.label)}
                              className="w-full flex items-center justify-between p-4 cursor-pointer"
                              aria-expanded={expandedSubcategory === sub.label}
                            >
                              <span
                                 className={`text-[15px] font-light transition-colors ${
                                   expandedSubcategory === sub.label ? 'text-foreground font-normal' : 'text-foreground/70'
                                 }`}
                              >
                                {sub.label}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground text-sm">
                                  {sub.items.length} tjenester
                                </span>
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                                  expandedSubcategory === sub.label ? 'rotate-90 text-foreground/50' : ''
                                }`} aria-hidden="true" />
                              </div>
                            </button>

                            {/* Price items */}
                            <AnimatePresence>
                              {expandedSubcategory === sub.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 space-y-2">
                                    <div className="pt-2 border-t border-border/50">
                                      {sub.items.map((item, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => navigate(`/booking?kategori=${category.id}&tjeneste=${encodeURIComponent(item.name)}`)}
                                          className="w-full flex items-center justify-between py-3 border-b border-border/30 last:border-b-0 hover:bg-white rounded-sm px-2 -mx-2 transition-colors group/item text-left"
                                        >
                                          <div className="flex-1">
                                            <p className="text-foreground text-sm font-light underline underline-offset-4 decoration-foreground/20 group-hover/item:decoration-foreground/60 transition-colors">
                                              {item.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                              <Clock className="w-3 h-3" />
                                              {item.duration}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <p className="font-normal text-foreground text-sm">
                                              fra {item.price}
                                            </p>
                                            <ArrowRight className="w-3.5 h-3.5 text-foreground/20 group-hover/item:text-foreground/50 transition-colors" />
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

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
          <div className="text-center mb-10">
            <p className="text-sm tracking-widest text-white/60 mb-3 font-light">
              Våre spesialister
            </p>
            <h2 className="text-3xl md:text-4xl font-normal text-white">
              Erfaring, spisskompetanse og moderne teknologi
            </h2>
            <p className="text-white/70 mt-3 max-w-2xl mx-auto font-light">
              Samlet på ett sted for å gi deg den beste behandlingen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {specialists.map((specialist) => (
              <div
                key={specialist.slug}
                className="group text-center"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-3">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3 className="font-normal text-white text-sm md:text-base">
                  {specialist.name}
                </h3>
                <p className="text-white/60 text-xs md:text-sm line-clamp-1 font-light">
                  {specialist.expertise.join(', ')}
                </p>
              </div>
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
            <h3 className="text-2xl md:text-3xl font-normal text-foreground text-center mb-12">
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
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8" 
                onClick={() => navigate('/booking')}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-md" 
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
