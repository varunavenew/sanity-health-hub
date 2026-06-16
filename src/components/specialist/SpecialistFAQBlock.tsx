import { useMemo } from "react";
import { FaqSection } from "@/components/layout/FaqSection";
import { useFaqs } from "@/hooks/useSanity";
import type { SpecialistFaq } from "@/lib/sanity/specialist-types";

type SpecialistFAQBlockProps = {
  faqs?: SpecialistFaq[];
};

export const SpecialistFAQBlock = ({ faqs }: SpecialistFAQBlockProps) => {
  const specialistFaqs = useMemo(
    () => (faqs ?? []).filter((item) => item.question && item.answer),
    [faqs],
  );
  const useSpecialistFaqs = specialistFaqs.length > 0;

  const { data: finansiering } = useFaqs("finansiering", !useSpecialistFaqs);
  const { data: praktisk } = useFaqs("praktisk", !useSpecialistFaqs);

  const items = useMemo(() => {
    const source = useSpecialistFaqs
      ? specialistFaqs
      : [
          ...(Array.isArray(finansiering) ? finansiering : []),
          ...(Array.isArray(praktisk) ? praktisk : []),
        ];
    return source.map((faq, index) => ({
      id: `specialist-faq-${index}`,
      question: faq.question,
      answer: faq.answer,
    }));
  }, [useSpecialistFaqs, specialistFaqs, finansiering, praktisk]);

  if (items.length === 0) return null;

  return <FaqSection faqs={items} />;
};
