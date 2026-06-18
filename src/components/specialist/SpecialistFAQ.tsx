import { useState } from "react";
import { Link } from "@/lib/router";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useFaqs } from "@/hooks/useSanity";
import type { SpecialistFaq } from "@/lib/sanity/specialist-types";

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-sm font-normal text-foreground hover:text-brand-dark transition-colors"
      >
        {title}
        {open ? <Minus className="w-4 h-4 text-muted-foreground" aria-hidden="true" /> : <Plus className="w-4 h-4 text-muted-foreground" aria-hidden="true" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-5">{children}</div>
      </motion.div>
    </div>
  );
};

function FaqAnswer({ question, answer }: SpecialistFaq) {
  if (question === "Pris") {
    return (
      <Link to="/priser" className="text-brand-dark font-normal hover:underline">
        Prislister finnes her.
      </Link>
    );
  }
  if (question === "Personvernerklæring") {
    return (
      <>
        Her finner du vår{" "}
        <Link to="/personvern" className="text-brand-dark font-normal hover:underline">
          personvernerklæring
        </Link>
        .
      </>
    );
  }
  return <>{answer}</>;
}

function FaqAccordionList({ items }: { items: SpecialistFaq[] }) {
  return (
    <>
      {items.map((item, i) => (
        <AccordionItem key={`${item.question}-${i}`} title={item.question}>
          <p className="text-sm text-muted-foreground font-light">
            <FaqAnswer {...item} />
          </p>
        </AccordionItem>
      ))}
    </>
  );
}

type SpecialistFAQProps = {
  faqs?: SpecialistFaq[];
};

export const SpecialistFAQ = ({ faqs }: SpecialistFAQProps) => {
  const specialistFaqs = (faqs ?? []).filter((item) => item.question && item.answer);
  const useSpecialistFaqs = specialistFaqs.length > 0;

  const { data: finansiering } = useFaqs("finansiering", !useSpecialistFaqs);
  const { data: praktisk } = useFaqs("praktisk", !useSpecialistFaqs);

  const finansieringSafe = Array.isArray(finansiering) ? finansiering : [];
  const praktiskSafe = Array.isArray(praktisk) ? praktisk : [];

  if (useSpecialistFaqs) {
    return (
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-8"
            >
              <FaqAccordionList items={specialistFaqs} />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (!finansieringSafe.length && !praktiskSafe.length) return null;

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8"
          >
            {finansieringSafe.length > 0 && (
              <div className="mb-8">
                <FaqAccordionList items={finansieringSafe} />
              </div>
            )}
            {praktiskSafe.length > 0 && (
              <div>
                <FaqAccordionList items={praktiskSafe} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
