"use client";

import { useMemo } from "react";
import { useNavigate } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { FaqSection } from "@/components/layout/FaqSection";
import { Button } from "@/components/ui/button";

export const LifePhasesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: homepage } = useHomepage();
  const homepageFaqs = homepage?.faqs ?? [];

  const faqs = useMemo(() => {
    return homepageFaqs
      .filter((f) => typeof f.question === "string" && f.question.trim().length > 0)
      .map((f, i) => ({
        id: `faq-${i}`,
        question: f.question,
        answer: f.answer,
      }));
  }, [homepageFaqs]);

  if (faqs.length === 0) return null;

  const faqTitle = homepage?.faqSectionTitle?.trim() || "";

  return (
    <section id="life-phases" className="bg-background">
      <FaqSection faqs={faqs} title={faqTitle} />

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto mt-6 md:mt-4 mb-12 md:mb-16 text-center">
          <Button
            variant="cta-dark"
            size="lg"
            className="w-full h-14 text-base shadow-sm border border-border/30 md:w-auto md:h-12 md:px-8"
            onClick={() => navigate("/booking")}
          >
            {t("nav.bookAppointment")}
          </Button>
        </div>
      </div>
    </section>
  );
};
