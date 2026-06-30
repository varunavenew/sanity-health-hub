import { useMemo } from "react";
import { FaqSection } from "@/components/layout/FaqSection";
import type { SpecialistFaq } from "@/lib/sanity/specialist-types";

type SpecialistFAQBlockProps = {
  faqs?: SpecialistFaq[];
  title?: string;
};

export const SpecialistFAQBlock = ({ faqs, title }: SpecialistFAQBlockProps) => {
  const items = useMemo(() => {
    return (faqs ?? [])
      .filter((item) => item.question && item.answer)
      .map((faq, index) => ({
        id: `specialist-faq-${index}`,
        question: faq.question,
        answer: faq.answer,
      }));
  }, [faqs]);

  if (items.length === 0 || !title?.trim()) return null;

  return <FaqSection faqs={items} title={title} />;
};
