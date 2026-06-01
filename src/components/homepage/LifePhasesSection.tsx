import { ArrowRight } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { useFaqs } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { FaqSection } from "@/components/layout/FaqSection";

export const LifePhasesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: sanityFaqs } = useFaqs("generelt");

  const faqs = (sanityFaqs || [])
    .filter((f: any) => typeof f.question === "string" && f.question.trim().length > 0)
    .map((f: any, i: number) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }));

  if (faqs.length === 0) return null;

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
