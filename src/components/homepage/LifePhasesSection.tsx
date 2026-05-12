import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFaqs } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { FaqSection } from "@/components/layout/FaqSection";

const staticFaqs = [
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
    answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg og Vertikal Helse. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical.",
  },
];

export const LifePhasesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: sanityFaqs } = useFaqs("generelt");

  const faqs = sanityFaqs && sanityFaqs.length > 0
    ? sanityFaqs.map((f: any, i: number) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
    : staticFaqs;

  return (
    <section id="life-phases" className="bg-background">
      <FaqSection faqs={faqs} title={t("faq.title")} />

      {/* Simple CTA below */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="mt-2 md:mt-4 mb-12 md:mb-16 text-center">
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 text-foreground rounded-2xl font-normal hover:bg-secondary transition-colors"
          >
            {t("nav.bookAppointment")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
