import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-sm font-normal text-foreground hover:text-brand-dark transition-colors"
      >
        {title}
        {open ? <Minus className="w-4 h-4 text-muted-foreground" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
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

export const SpecialistFAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F2ECE6]">
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
              <AccordionItem title="Pris">
                <p className="text-sm text-muted-foreground font-light">
                  <Link to="/priser" className="text-brand-dark font-normal hover:underline">Prislister finnes her.</Link>
                </p>
              </AccordionItem>
              <AccordionItem title="Forsikring">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-light">
                    <strong className="text-foreground">Vi har forsikringsavtale med:</strong><br />
                    EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg.
                  </p>
                  <p className="text-sm text-muted-foreground font-light">
                    <strong className="text-foreground">Hvordan går jeg frem?</strong> Ta kontakt med legen din for henvisning. Send den til forsikringsselskapet og be om time på CMedical.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="Nedbetaling">
                <p className="text-sm text-muted-foreground font-light">
                  Nedbetaling er tilgjengelig på utvalgte klinikker. Spør oss for mer informasjon.
                </p>
              </AccordionItem>
            </div>

            {/* Generelt group */}
            <div>
              <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Ofte stilte spørsmål
              </h3>
              <AccordionItem title="Trenger jeg henvisning?">
                <p className="text-sm text-muted-foreground font-light">
                  Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk uten refusjonsavtale med det offentlige.
                </p>
              </AccordionItem>
              <AccordionItem title="Hvor lang er ventetiden?">
                <p className="text-sm text-muted-foreground font-light">
                  Vi har svært korte ventetider. Generelt får du hjelp <strong className="text-foreground">innen en uke</strong>.
                </p>
              </AccordionItem>
              <AccordionItem title="Kan jeg få sykemelding?">
                <p className="text-sm text-muted-foreground font-light">
                  Ja, ved behov kan vi skrive ut sykmelding i henhold til nasjonale retningslinjer.
                </p>
              </AccordionItem>
              <AccordionItem title="Hva skjer i en utredning?">
                <p className="text-sm text-muted-foreground font-light">
                  Vi anbefaler å starte med en konsultasjon. En vanlig utredning varer ca <strong className="text-foreground">30 minutter</strong>.
                </p>
              </AccordionItem>
              <AccordionItem title="Personvernerklæring">
                <p className="text-sm text-muted-foreground font-light">
                  Her finner du vår <Link to="/personvern" className="text-brand-dark font-normal hover:underline">personvernerklæring</Link>.
                </p>
              </AccordionItem>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
