import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, Check, Phone, Calendar, MapPin, Clock, FileText, Shield, Plus, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { treatmentContent, TreatmentData, ContentSection, LinkedService } from "@/data/treatmentContent";
import { specialists as allSpecialists, Specialist } from "@/data/specialists";
import { useTreatment } from "@/hooks/useSanity";
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
const TreatmentFaq = ({ question, answer, isLast }: { question: string; answer: string; isLast: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${!isLast ? "border-b border-border" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-5 md:px-6 text-left hover:bg-secondary/20 transition-colors group"
      >
        <span className="text-[15px] md:text-base font-normal text-foreground pr-4">{question}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-foreground" : "bg-secondary"}`}>
          {isOpen ? (
            <Minus className={`w-3.5 h-3.5 ${isOpen ? "text-background" : "text-muted-foreground"}`} />
          ) : (
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed font-light px-5 md:px-6 pb-5 pr-12">
            {answer}
          </p>
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

  const relatedSpecialists = useMemo(() => {
    const slugs = treatment?.relatedSpecialists || staticTreatment?.relatedSpecialists;
    if (!slugs || slugs.length === 0) return [];
    return slugs
      .map(slug => allSpecialists.find(s => s.slug === slug))
      .filter((s): s is Specialist => !!s);
  }, [treatment, staticTreatment]);

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

            {/* ── Content Sections ── */}
            {treatment.sections && treatment.sections.length > 0 && (
              <div className="mb-14 space-y-10">
                {treatment.sections.map((section, i) => (
                  <div key={i} id={section.id || `section-${i}`} className="scroll-mt-24">
                    <h2 className="text-xl md:text-2xl font-normal text-foreground mb-4 pb-3 border-b border-border">
                      {section.heading}
                    </h2>
                    <div className="space-y-3">
                      {section.content.split("\n").map((line, j) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("- ")) {
                          return (
                            <div key={j} className="flex items-start gap-3 pl-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
                              <p
                                className="text-foreground/80 font-light leading-[1.8]"
                                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.slice(2)) }}
                              />
                            </div>
                          );
                        }
                        return (
                          <p
                            key={j}
                            className="text-foreground/80 font-light leading-[1.8]"
                            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Linked Services ── */}
            {treatment.linkedServices && treatment.linkedServices.length > 0 && (
              <div className="mb-14">
                <h2 className="text-xl md:text-2xl font-medium text-foreground mb-6">Vårt tverrfaglige team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {treatment.linkedServices.map((service) => (
                    <button
                      key={service.label}
                      onClick={() => navigate(service.path)}
                      className="text-left p-5 md:p-6 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-border/80 transition-all group card-hover"
                    >
                      <h3 className="text-base md:text-lg font-normal text-foreground mb-2 flex items-center gap-2">
                        {service.label}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {service.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Benefits ── */}
            {treatment.benefits && treatment.benefits.length > 0 && (
              <div className="mb-14 rounded-2xl overflow-hidden border border-border/50">
                <div className="bg-secondary/40 px-6 md:px-8 py-5">
                  <h2 className="text-xl md:text-2xl font-medium text-foreground">
                    {treatment.benefitsTitle || "Hvorfor velge oss"}
                  </h2>
                </div>
                <div className="px-6 md:px-8 py-6 space-y-4 bg-card/50">
                  {treatment.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent-foreground" />
                      </div>
                      <p className="text-foreground/80 font-light text-[15px] leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Treatment Process ── */}
            {treatment.process && treatment.process.length > 0 && (
              <div className="mb-14">
                <h2 className="text-xl md:text-2xl font-medium text-foreground mb-8">
                  Slik foregår behandlingen
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                  <div className="space-y-0">
                    {treatment.process.map((step, i) => (
                      <div key={i} className="flex gap-5 relative">
                        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0 z-10">
                          {i + 1}
                        </div>
                        <div className="pb-8 pt-1 flex-1">
                          <h3 className="font-medium text-foreground mb-1 text-[15px]">{step.title}</h3>
                          <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Related Specialists ── */}
            {relatedSpecialists.length > 0 && (
              <div className="mb-14">
                <h2 className="text-xl md:text-2xl font-medium text-foreground mb-6">
                  Møt din behandler
                </h2>
                <div className="space-y-5">
                  {relatedSpecialists.map((spec) => (
                    <div
                      key={spec.slug}
                      className="rounded-2xl border border-border overflow-hidden bg-card card-hover"
                    >
                      {/* Top section with photo + info */}
                      <div className="flex items-center gap-5 p-5 md:p-6">
                        <img
                          src={spec.image}
                          alt={spec.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 ring-2 ring-border"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-medium text-foreground">{spec.name}</h3>
                          <p className="text-sm text-muted-foreground font-light">{spec.title}</p>
                          {spec.clinics && spec.clinics.length > 0 && (
                            <p className="text-xs text-muted-foreground/60 font-light mt-1.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {spec.clinics.join(", ")}
                            </p>
                          )}
                          {/* Expertise tags */}
                          {spec.expertise && spec.expertise.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {spec.expertise.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground font-light"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bio section */}
                      {spec.bio && (
                        <div className="px-5 md:px-6 pb-2">
                          <p className="text-sm text-foreground/70 font-light leading-relaxed line-clamp-3">
                            {spec.bio}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-t border-border/50 mt-2">
                        <Button
                          variant="outline"
                          className="text-sm rounded-full h-9 px-5 font-light flex-1 sm:flex-none"
                          onClick={() => navigate(`/spesialister/${spec.slug}`)}
                        >
                          Les mer om {spec.name.split(" ")[0]}
                          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                        </Button>
                        <Button
                          className="text-sm rounded-full h-9 px-5 font-light flex-1 sm:flex-none"
                          onClick={() => navigate(`/booking?kategori=${categoryId}`)}
                        >
                          <Calendar className="mr-1.5 w-3.5 h-3.5" />
                          Bestill time
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA ── */}
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

            {/* ── FAQ ── */}
            {treatment.faqs && treatment.faqs.length > 0 && (
              <div className="mb-14">
                <h2 className="text-xl md:text-2xl font-medium text-foreground mb-6">
                  Ofte stilte spørsmål
                </h2>
                <div className="rounded-xl border border-border overflow-hidden bg-card">
                  {treatment.faqs.map((faq, i) => (
                    <TreatmentFaq
                      key={i}
                      question={faq.question}
                      answer={faq.answer}
                      isLast={i === treatment.faqs!.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Back link ── */}
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

      {(categoryId === "fertilitet" || (categoryId === "flere-fagomrader" && subId === "overvektskirurgi")) && <StickyBookingCTA />}
    </PageLayout>
  );
};

export default TreatmentPage;
