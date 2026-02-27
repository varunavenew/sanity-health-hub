import { ArrowRight, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const fallbackFaqs = [
  { id: "henvisning", question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Sykemelding", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Utredning", answer: "Vi tilbyr grundig utredning innen alle våre fagområder. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
  { id: "selskapet", question: "Selskapet", answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Siden 2002 har over 150 000 pasienter fått behandling hos oss." },
];

export const LifePhasesSection = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = fallbackFaqs;

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="life-phases" className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl font-normal text-foreground text-center mb-8">
            Ofte stilte spørsmål
          </h3>
          
          <div className="space-y-0 border-t border-border">
            {faqs.map((faq: any) => (
              <div key={faq.id || faq.question} className="border-b border-border">
                <button
                  onClick={() => toggleFaq(faq.id || faq.question)}
                  className="w-full flex items-center justify-between py-5 text-left hover:text-accent transition-colors"
                >
                  <span className="text-base md:text-lg font-normal text-foreground">{faq.question}</span>
                  {openFaq === (faq.id || faq.question) ? (
                    <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === (faq.id || faq.question) ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed pr-8">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 text-foreground rounded-full font-normal hover:bg-secondary transition-colors"
          >
            Bestill time
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
