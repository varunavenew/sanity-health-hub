import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Phone, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useTreatment } from "@/hooks/useSanity";
import { treatmentContent } from "@/data/treatmentContent";

interface TreatmentPageProps {
  categoryId: string;
  isChatOpen: boolean;
}

const specialistLabels: Record<string, string> = {
  gynekologi: "gynekolog", urologi: "urolog", fertilitet: "fertilitetsspesialist",
  ortopedi: "ortoped", "flere-fagomrader": "spesialist",
};

const TreatmentFaq = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-secondary/30 transition-colors">
        <span className="text-base font-normal text-foreground">{question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-60 pb-5 px-6" : "max-h-0"}`}>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light pr-8">{answer}</p>
      </div>
    </div>
  );
};

const TreatmentPage = ({ categoryId, isChatOpen }: TreatmentPageProps) => {
  const { subId } = useParams();
  const navigate = useNavigate();
  
  const { data: sanityTreatment } = useTreatment(categoryId, subId || "");
  const staticTreatment = treatmentContent[`${categoryId}/${subId}`];
  
  const treatment = sanityTreatment || staticTreatment;

  useEffect(() => {
    if (treatment) document.title = `${treatment.title} | CMedical`;
  }, [treatment]);

  if (!treatment) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-foreground mb-4">Siden finnes ikke</h1>
            <p className="text-muted-foreground font-light mb-8">Vi fant ikke behandlingen du leter etter.</p>
            <Button onClick={() => navigate(`/${categoryId}`)} className="rounded-md">Tilbake til {categoryId}</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const specialistLabel = specialistLabels[categoryId] || "spesialist";
  const parentCategory = treatment.parentCategory || categoryId;
  const heroImage = treatment.heroImage;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <header className="relative h-[30vh] md:h-[35vh] overflow-hidden">
        <img src={heroImage} alt={treatment.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-brand-dark/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto px-0 md:px-8">
            <p className="text-xs text-white/60 tracking-wide mb-2 font-light">{parentCategory}</p>
            <h1 className="text-3xl md:text-4xl font-normal text-white">{treatment.title}</h1>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <p className="text-base md:text-[17px] text-foreground/80 leading-relaxed font-light whitespace-pre-line">{treatment.description}</p>
            </div>

            {treatment.benefits && treatment.benefits.length > 0 && (
              <div className="mb-12 bg-secondary/30 rounded-xl p-8">
                <h2 className="text-2xl font-normal text-foreground mb-6">{treatment.benefitsTitle || "Hvorfor velge oss"}</h2>
                <div className="space-y-4">
                  {treatment.benefits.map((benefit: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-background" />
                      </div>
                      <p className="text-foreground/80 font-light">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {treatment.process && treatment.process.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-normal text-foreground mb-6">Slik foregår behandlingen</h2>
                <div className="space-y-6">
                  {treatment.process.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">{i + 1}</div>
                        {i < treatment.process!.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-normal text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground font-light">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-dark rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-normal text-white mb-3">Klar for å ta neste steg?</h2>
              <p className="text-white/70 font-light mb-8 max-w-md mx-auto">Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal" onClick={() => navigate(`/booking?kategori=${categoryId}`)}>
                  Bestill time hos en {specialistLabel}<ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="ghost" className="border border-white text-white bg-transparent hover:bg-white hover:text-brand-dark rounded-md px-8 font-normal" onClick={() => navigate("/kontakt")}>
                  <Phone className="mr-2 w-4 h-4" />Kontakt oss
                </Button>
              </div>
            </div>

            {treatment.faqs && treatment.faqs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-normal text-foreground mb-8 text-center">Ofte stilte spørsmål om {treatment.title.toLowerCase()}</h2>
                <div className="border-t border-border rounded-lg bg-white overflow-hidden">
                  {treatment.faqs.map((faq: any, i: number) => (
                    <TreatmentFaq key={i} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(`/${categoryId}`)} className="text-sm text-muted-foreground hover:text-foreground font-light underline underline-offset-4 transition-colors">
              ← Tilbake til {parentCategory}
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TreatmentPage;
