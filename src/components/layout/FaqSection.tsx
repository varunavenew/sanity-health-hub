/**
 * Unified FAQ accordion.
 *
 * - `centered` (default): homepage-style centered stack with +/- toggles
 * - `split`: category-landing style (title + description sticky left, accordion right)
 *   matching Lovable graviditet / similar reference pages
 */
"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/seo/JsonLd";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  /** Localised section title. Defaults to a locale-aware "Frequently asked questions" / "Ofte stilte spørsmål". */
  title?: string;
  /** Optional supporting copy under the title (split layout / Pregnancy FAQ). */
  description?: string;
  /** Tailwind background class, defaults to bg-background. */
  background?: string;
  /** Emit FAQPage JSON-LD. Default true. */
  withJsonLd?: boolean;
  /**
   * `centered` — stacked (homepage).
   * `split` — two-column category landing (auto when description is set).
   */
  layout?: "centered" | "split";
  /** When true, open the first FAQ item on mount (opt-in; default closed). */
  defaultOpenFirst?: boolean;
  /**
   * Optional section padding/spacing override.
   * Category landings pass tighter vertical padding to match shared bands.
   */
  sectionClassName?: string;
}

export const FaqSection = ({
  faqs,
  title,
  description,
  background = "bg-background",
  withJsonLd = true,
  layout,
  defaultOpenFirst = false,
  sectionClassName,
}: FaqSectionProps) => {
  const { i18n } = useTranslation();
  const isEn = (i18n.language || "nb").startsWith("en");
  const resolvedTitle = title?.trim() || (isEn ? "Frequently asked questions" : "Ofte stilte spørsmål");
  const resolvedLayout =
    layout ?? (description?.trim() ? "split" : "centered");
  const [openFaq, setOpenFaq] = useState<string | null>(() =>
    defaultOpenFirst && faqs?.[0]?.id ? faqs[0].id : null,
  );

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

  const descriptionParagraphs = (description || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (resolvedLayout === "split") {
    return (
      <section className={`${sectionClassName || "py-20 md:py-28"} ${background}`}>
        {withJsonLd && <JsonLd data={jsonLd} />}
        <div className="page-shell">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-28">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                  {resolvedTitle}
                </h2>
                {descriptionParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className={`text-base font-light text-muted-foreground leading-relaxed ${
                      i < descriptionParagraphs.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-border/60">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="border-b border-border/60">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full flex-1 items-center justify-between py-6 text-left text-lg md:text-xl font-normal text-foreground"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? "max-h-96 pb-8" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm md:text-base font-light text-muted-foreground leading-relaxed">
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
  }

  return (
    <section className={`${sectionClassName || "py-16 md:py-24"} ${background}`}>
      {withJsonLd && <JsonLd data={jsonLd} />}
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-foreground text-center mb-8">
            {resolvedTitle}
          </h2>
          {description?.trim() ? (
            <p className="text-sm md:text-base font-light text-muted-foreground text-center leading-relaxed mb-10 whitespace-pre-line">
              {description.trim()}
            </p>
          ) : null}

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
