import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useFaqs } from "@/hooks/useSanity";

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

// Static fallbacks
const staticFinansiering = [
  { question: "Pris", answer: "Prislister finnes på vår prisside.", link: "/priser" },
  { question: "Forsikring", answer: "Vi har forsikringsavtale med: EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg og Vertikal Helse. Ta kontakt med legen din for henvisning. Send den til forsikringsselskapet og be om time på CMedical." },
  { question: "Nedbetaling", answer: "Nedbetaling er tilgjengelig på utvalgte klinikker. Spør oss for mer informasjon." },
];

const staticPraktisk = [
  { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk uten refusjonsavtale med det offentlige." },
  { question: "Hvor lang er ventetiden?", answer: "Vi har svært korte ventetider. Generelt får du hjelp innen en uke." },
  { question: "Kan jeg få sykemelding?", answer: "Ja, ved behov kan vi skrive ut sykmelding i henhold til nasjonale retningslinjer." },
  { question: "Hva skjer i en utredning?", answer: "Vi anbefaler å starte med en konsultasjon. En vanlig utredning varer ca 30 minutter." },
  { question: "Personvernerklæring", answer: "personvern", link: "/personvern" },
];

export const SpecialistFAQ = () => {
  const { data: sanityFinansiering } = useFaqs("finansiering");
  const { data: sanityPraktisk } = useFaqs("praktisk");

  const finansiering = sanityFinansiering && sanityFinansiering.length > 0
    ? sanityFinansiering
    : staticFinansiering;

  const praktisk = sanityPraktisk && sanityPraktisk.length > 0
    ? sanityPraktisk
    : staticPraktisk;

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: Section headers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4"
          >
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">
              Praktisk informasjon
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm">
              Alt du trenger å vite før timen. Finner du ikke svar, ta gjerne kontakt med oss.
            </p>
          </motion.div>

          {/* Right: Two accordion groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8"
          >
            {/* Finansiering group */}
            <div className="mb-8">
              <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Finansiering
              </h3>
              {finansiering.map((item: any, i: number) => (
                <AccordionItem key={i} title={item.question}>
                  <p className="text-sm text-muted-foreground font-light">
                    {item.question === "Pris" ? (
                      <Link to="/priser" className="text-brand-dark font-normal hover:underline">Prislister finnes her.</Link>
                    ) : (
                      item.answer
                    )}
                  </p>
                </AccordionItem>
              ))}
            </div>

            {/* Generelt group */}
            <div>
              <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Ofte stilte spørsmål
              </h3>
              {praktisk.map((item: any, i: number) => (
                <AccordionItem key={i} title={item.question}>
                  <p className="text-sm text-muted-foreground font-light">
                    {item.question === "Personvernerklæring" ? (
                      <>Her finner du vår <Link to="/personvern" className="text-brand-dark font-normal hover:underline">personvernerklæring</Link>.</>
                    ) : (
                      item.answer
                    )}
                  </p>
                </AccordionItem>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
