"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  /** Localised section title. Defaults to "Ofte stilte spørsmål". */
  title?: string;
  /** Tailwind background class, defaults to bg-background. */
  background?: string;
  /** Emit FAQPage JSON-LD. Default true. */
  withJsonLd?: boolean;
}

/**
 * Unified FAQ accordion. Matches the home (LifePhasesSection) layout exactly
 * — centered, max-w-3xl, top/bottom borders, plus/minus toggle — and is used
 * everywhere we render a FAQ block so the same UI pattern always reads the
 * same visual language.
 */
export const FaqSection = ({
  faqs,
  title = "Ofte stilte spørsmål",
  background = "bg-background",
  withJsonLd = true,
}: FaqSectionProps) => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className={`py-16 md:py-24 ${background}`}>
      {withJsonLd && <JsonLd data={jsonLd} />}
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-foreground text-center mb-8">
            {title}
          </h2>

          <div className="space-y-0 border-t border-border">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between py-5 text-left hover:text-brand-dark transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-normal text-foreground">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
