import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowRight, Check, Phone, Calendar, MapPin, Clock, FileText, Shield, Plus, Minus, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { treatmentContent, TreatmentData, ContentSection, LinkedService } from "@/data/treatmentContent";
import { specialists as allSpecialists, Specialist } from "@/data/specialists";
import { useTreatment, useFaqsByTreatmentCategory } from "@/hooks/useSanity";
import { StickyBookingCTA } from "@/components/StickyBookingCTA";

interface TreatmentPageProps {
  categoryId: string;
  isChatOpen: boolean;
}

const specialistLabels: Record<string, string> = {
  gynekologi: "gynekolog",
  urologi: "urolog",
  fertilitet: "fertilitetsspesialist",
  ortopedi: "ortoped",
  "flere-fagomrader": "spesialist",
};

const formatInlineMarkdown = (text: string): string => {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-4 hover:text-foreground transition-colors">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
};

/* ─── FAQ Accordion ─── */
const TreatmentFaq = ({ question, answer, isLast, customContent }: { question: string; answer: string; isLast: boolean; customContent?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${!isLast ? "border-b border-border" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-5 md:px-6 text-left hover:bg-secondary/20 transition-colors group"
      >
        <span className="text-[15px] md:text-base font-normal text-foreground pr-4">{question}</span>
        {isOpen ? <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-5 pr-12">
            {customContent || (
              <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed font-light">
                {answer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Quick Info Badges ─── */
const QuickInfoBar = () => (
  <div className="flex flex-wrap gap-3 mb-10">
    {[
      { icon: FileText, label: "Ingen henvisning" },
      { icon: Clock, label: "Kort ventetid" },
      { icon: Shield, label: "Forsikring godkjent" },
    ].map(({ icon: Icon, label }) => (
      <div
        key={label}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/50 border border-border/50"
      >
        <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-xs md:text-sm text-foreground/70 font-light">{label}</span>
      </div>
    ))}
  </div>
);

/* ─── Main Component ─── */
const TreatmentPage = ({ categoryId, isChatOpen }: TreatmentPageProps) => {
  const { subId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: sanityTreatment } = useTreatment(categoryId, subId || "");
  const { data: sanityFaqs } = useFaqsByTreatmentCategory(categoryId);
  const treatmentKey = `${categoryId}/${subId}`;
  const staticTreatment = treatmentContent[treatmentKey];

  const treatment: TreatmentData | undefined = sanityTreatment
    ? {
        title: sanityTreatment.title,
        subtitle: sanityTreatment.subtitle,
        description: sanityTreatment.description,
        heroImage: sanityTreatment.heroImage || staticTreatment?.heroImage || "",
        parentCategory: sanityTreatment.parentCategory || staticTreatment?.parentCategory || categoryId,
        benefits: sanityTreatment.benefits,
        benefitsTitle: sanityTreatment.benefitsTitle,
        process: sanityTreatment.process,
        faqs: sanityTreatment.faqs,
      }
    : staticTreatment;

  // Get related specialists: explicit slugs first, fallback to all in category
  const displaySpecialists = useMemo(() => {
    const slugs = treatment?.relatedSpecialists || staticTreatment?.relatedSpecialists;
    if (slugs && slugs.length > 0) {
      return slugs
        .map(slug => allSpecialists.find(s => s.slug === slug))
        .filter((s): s is Specialist => !!s);
    }
    // Fallback: all specialists in this category
    return allSpecialists.filter(s => s.category === categoryId);
  }, [treatment, staticTreatment, categoryId]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSpecialists = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (treatment) {
      document.title = `${treatment.title} | CMedical`;
    }
  }, [treatment]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, [location.hash, treatment]);

  if (!treatment) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-foreground mb-4">Siden finnes ikke</h1>
            <p className="text-muted-foreground font-light mb-8">Vi fant ikke behandlingen du leter etter.</p>
            <Button onClick={() => navigate(`/${categoryId}`)} className="rounded-md">
              Tilbake til {categoryId}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const specialistLabel = specialistLabels[categoryId] || "spesialist";

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* ── Hero ── */}
      <header className="relative h-[32vh] md:h-[38vh] overflow-hidden">
        <img
          src={treatment.heroImage}
          alt={treatment.title}
          className="w-full h-full object-cover object-[center_30%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto px-0 md:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-3 font-light">
              <button onClick={() => navigate("/")} className="hover:text-white/70 transition-colors">Hjem</button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => navigate(`/${categoryId}`)} className="hover:text-white/70 transition-colors">{treatment.parentCategory}</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/70">{treatment.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-white leading-tight">
              {treatment.title}
            </h1>
            {treatment.subtitle && (
              <p className="text-sm md:text-base text-white/60 font-light mt-2">{treatment.subtitle}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">

            {/* Quick info badges */}
            <QuickInfoBar />

            {/* Introduction */}
            <div className="mb-14">
              <div className="text-base md:text-[17px] text-foreground/80 leading-[1.8] font-light whitespace-pre-line">
                {treatment.description}
              </div>
            </div>

            {/* ── All sections as accordions ── */}
            <div className="mb-14 rounded-2xl border border-border/50 overflow-hidden">
              {/* Content Sections */}
              {treatment.sections && treatment.sections.length > 0 && treatment.sections.map((section, i) => (
                <TreatmentFaq
                  key={`section-${i}`}
                  question={section.heading}
                  answer=""
                  isLast={false}
                  customContent={
                    <div className="space-y-3">
                      {section.content.split("\n").map((line, j) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("- ")) {
                          return (
                            <div key={j} className="flex items-start gap-3 pl-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
                              <p className="text-foreground/80 font-light leading-[1.8]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.slice(2)) }} />
                            </div>
                          );
                        }
                        return <p key={j} className="text-foreground/80 font-light leading-[1.8]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />;
                      })}
                    </div>
                  }
                />
              ))}

              {/* Linked Services */}
              {treatment.linkedServices && treatment.linkedServices.length > 0 && (
                <TreatmentFaq
                  question="Vårt tverrfaglige team"
                  answer=""
                  isLast={false}
                  customContent={
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {treatment.linkedServices.map((service) => (
                        <button key={service.label} onClick={() => navigate(service.path)} className="text-left p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all group">
                          <h3 className="text-sm font-normal text-foreground mb-1 flex items-center gap-2">{service.label} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" /></h3>
                          <p className="text-xs text-muted-foreground font-light leading-relaxed">{service.description}</p>
                        </button>
                      ))}
                    </div>
                  }
                />
              )}

              {/* Benefits */}
              {treatment.benefits && treatment.benefits.length > 0 && (
                <TreatmentFaq
                  question={treatment.benefitsTitle || "Hvorfor velge oss"}
                  answer=""
                  isLast={false}
                  customContent={
                    <div className="space-y-3">
                      {treatment.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-accent-foreground" /></div>
                          <p className="text-foreground/80 font-light text-[15px] leading-relaxed">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  }
                />
              )}

              {/* Treatment Process */}
              {treatment.process && treatment.process.length > 0 && (
                <TreatmentFaq
                  question="Slik foregår behandlingen"
                  answer=""
                  isLast={false}
                  customContent={
                    <div className="relative">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                      <div className="space-y-0">
                        {treatment.process.map((step, i) => (
                          <div key={i} className="flex gap-5 relative">
                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">{i + 1}</div>
                            <div className="pb-6 pt-1 flex-1">
                              <h3 className="font-medium text-foreground mb-1 text-[15px]">{step.title}</h3>
                              <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                />
              )}

              {/* Related Specialists - shown as carousel below */}
            </div>

          </div>
        </div>
      </section>

      {/* ── Specialist Section ── */}
      {displaySpecialists.length > 0 && (
        <section className="py-14 md:py-20 bg-secondary">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground font-light mb-3">Dine behandlere</p>
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
                Møt våre spesialister
              </h2>
              <p className="text-muted-foreground font-light mb-10">
                Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.
              </p>

              <div className="space-y-4">
                {displaySpecialists.map((spec) => (
                  <div key={spec.slug} className="rounded-2xl border border-border overflow-hidden bg-background">
                    <div className="flex items-center gap-4 p-5">
                      <img
                        src={spec.image}
                        alt={spec.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-border"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-foreground">{spec.name}</h3>
                        <p className="text-sm text-muted-foreground font-light">{spec.title}</p>
                        {spec.clinics && spec.clinics.length > 0 && (
                          <p className="text-xs text-muted-foreground font-light mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" aria-hidden="true" />
                            {spec.clinics.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    {spec.expertise.length > 0 && (
                      <div className="px-5 pb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {spec.expertise.map((tag) => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-light">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 px-5 py-3.5 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full font-light flex-1 sm:flex-none"
                        onClick={() => navigate(`/spesialister/${spec.slug}`)}
                      >
                        Les mer om {spec.name.split(' ')[0]}
                        <ArrowRight className="ml-1 w-3 h-3" aria-hidden="true" />
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs rounded-full font-light flex-1 sm:flex-none bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => navigate(`/booking?kategori=${categoryId}`)}
                      >
                        <Calendar className="mr-1.5 w-3 h-3" aria-hidden="true" />
                        Bestill time hos {spec.name.split(' ')[0]}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── General FAQ Section ── */}
      {(() => {
        const dynamicFaqs = sanityFaqs && sanityFaqs.length > 0 ? sanityFaqs : null;
        const treatmentFaqs = treatment.faqs && treatment.faqs.length > 0 ? treatment.faqs : null;
        const faqs = dynamicFaqs || treatmentFaqs;
        if (!faqs || faqs.length === 0) return null;
        return (
          <section className="py-14 md:py-20 bg-secondary">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">Ofte stilte spørsmål</h2>
                <div className="rounded-2xl border border-border/50 overflow-hidden bg-background">
                  {faqs.map((faq, i) => (
                    <TreatmentFaq
                      key={`faq-${i}`}
                      question={faq.question}
                      answer={faq.answer}
                      isLast={i === faqs.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── CTA Section ── */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-brand-dark rounded-2xl p-8 md:p-12 text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-normal text-white mb-3">
                Klar for å ta neste steg?
              </h2>
              <p className="text-white/60 font-light mb-8 max-w-md mx-auto text-[15px]">
                Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-normal"
                  onClick={() => navigate(`/booking?kategori=${categoryId}`)}
                >
                  Bestill time hos en {specialistLabel}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white bg-transparent hover:bg-white/10 rounded-full px-8 font-normal"
                  onClick={() => navigate("/kontakt")}
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Kontakt oss
                </Button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/${categoryId}`)}
              className="text-sm text-muted-foreground hover:text-foreground font-light flex items-center gap-1.5 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Tilbake til {treatment.parentCategory}
            </button>
          </div>
        </div>
      </section>

    </PageLayout>
  );
};

export default TreatmentPage;
