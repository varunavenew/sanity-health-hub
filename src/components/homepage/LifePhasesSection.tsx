import { ArrowRight, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

// Import category images from CMedical
import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagomraderImg from "@/assets/categories/flere-fagomrader.jpg";

const categories = [
  {
    id: "urologi",
    title: "Urologi",
    subtitle: "Blære, nyrer og prostata",
    image: urologiImg,
    path: "/behandlinger/urologi",
  },
  {
    id: "fertilitet",
    title: "Fertilitet",
    subtitle: "Veien til familielykke",
    image: fertilitetImg,
    path: "/behandlinger/fertilitet",
  },
  {
    id: "gynekologi",
    title: "Gynekologi",
    subtitle: "Underlivshelse",
    image: gynekologiImg,
    path: "/behandlinger/gynekologi",
  },
  {
    id: "ortopedi",
    title: "Ortopedi",
    subtitle: "Bevegelse uten smerte",
    image: ortopediImg,
    path: "/behandlinger/ortopedi",
  },
  {
    id: "flere-fagomrader",
    title: "Flere tjenester",
    subtitle: "Se alle våre tjenester",
    image: flereFagomraderImg,
    path: "/behandlinger/flere-fagomrader",
  },
];

const faqs = [
  {
    id: "henvisning",
    question: "Henvisning",
    answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
  },
  {
    id: "ventetid",
    question: "Ventetid",
    answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
  },
  {
    id: "sykemelding",
    question: "Sykemelding",
    answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
  },
  {
    id: "utredning",
    question: "Utredning",
    answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
  },
  {
    id: "selskapet",
    question: "Selskapet",
    answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
  },
  {
    id: "forsikring",
    question: "Forsikring",
    answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical.",
  },
];

export const LifePhasesSection = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="life-phases" className="py-6 md:py-10 bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
        {/* FAQ Section */}
        <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-foreground text-center mb-8">
            Ofte stilte spørsmål
          </h2>
          
          <div className="space-y-0 border-t border-border">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-b border-border"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
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

        {/* Simple CTA below */}
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
