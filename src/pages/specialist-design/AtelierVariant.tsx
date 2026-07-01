import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PartialStars } from "@/components/ui/partial-stars";
import { useDemoSpecialist } from "./_useDemoSpecialist";
import { getBioBlocks, RichBioBlock, getRelevantReviews, SHARED_FAQS } from "./_shared";

interface Props { isChatOpen?: boolean }

/**
 * Forslag 3 — Vertikal scroll-rytme.
 * Smal sentrert kolonne, dramatisk typografi, fullbredt portrettband,
 * sitater i sekvens, inline metadata, FAQ og fokusert CTA — alt fra ekte data.
 */
const Variant3 = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const blocks = getBioBlocks(specialist);
  const reviews = getRelevantReviews(specialist);

  // Pull the first paragraph as a lead, the rest of the rich blocks stays in flow
  const firstParaIdx = blocks.findIndex((b) => b.type === "paragraph");
  const lead = firstParaIdx >= 0 ? (blocks[firstParaIdx] as { text: string }).text : "";
  const remaining = blocks.filter((_, i) => i !== firstParaIdx);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero — narrow column */}
      <header className="bg-brand-light pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs text-brand-dark/50 font-light mb-10">
              01 — Spesialist · {specialist.category}
            </p>
            <h1 className="font-light text-brand-dark leading-[0.95] mb-10 text-[clamp(3rem,9vw,7.5rem)]">
              {specialist.name}
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/75 font-light leading-relaxed max-w-xl">
              {specialist.title}
              {specialist.subtitle && specialist.subtitle !== specialist.title ? `. ${specialist.subtitle}.` : "."}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Full-bleed portrait band */}
      <section className="bg-brand-light">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img src={specialist.image} alt={specialist.name} className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
      </section>

      {/* Lead paragraph */}
      {lead && (
        <section className="bg-brand-light pt-20 md:pt-28 pb-10 md:pb-14">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            <p className="text-2xl md:text-3xl font-light text-brand-dark leading-[1.45]">{lead}</p>
          </div>
        </section>
      )}

      {/* Rest of rich bio (paragraphs, images, video, embeds, links) */}
      {remaining.length > 0 && (
        <section className="bg-brand-light pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl space-y-6">
            {remaining.map((b, i) => <RichBioBlock key={i} block={b} tone="warm" />)}
          </div>
        </section>
      )}

      {/* Inline metadata rows */}
      <section className="bg-brand-light border-t border-brand-dark/10">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl py-14">
          {[
            { label: "Ekspertise", value: specialist.expertise?.join(", ") },
            { label: "Utdanning", value: specialist.education },
            { label: "Språk", value: specialist.languages?.join(", ") },
            { label: "Klinikker", value: specialist.clinics?.join(", ") },
          ]
            .filter((r) => r.value)
            .map((r) => (
              <div key={r.label} className="grid grid-cols-4 gap-6 py-5 border-b border-brand-dark/10">
                <p className="col-span-1 text-xs text-brand-dark/50 font-light">{r.label}</p>
                <p className="col-span-3 text-sm text-brand-dark font-light leading-relaxed">{r.value}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Reviews — sequential quotes */}
      {reviews.length > 0 && (
        <section className="bg-brand-warm py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            <p className="text-xs text-brand-dark/50 font-light mb-3">Pasienterfaringer</p>
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-12">Hva pasientene sier</h2>
            <ul className="space-y-12">
              {reviews.map((r) => (
                <li key={r.id} className="border-l border-brand-dark/15 pl-6 md:pl-8">
                  <Quote className="w-6 h-6 text-brand-dark/20 rotate-180 mb-3" aria-hidden="true" />
                  <PartialStars rating={r.rating} />
                  <p className="text-lg md:text-xl font-light text-brand-dark leading-[1.6] mt-4 mb-4">
                    "{r.text.length > 240 ? r.text.slice(0, 240) + "…" : r.text}"
                  </p>
                  <p className="text-xs text-brand-dark/60 font-light">
                    {r.name} · {r.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ — minimal accordion in narrow column */}
      <section className="bg-brand-light py-16 md:py-20 border-t border-brand-dark/10">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs text-brand-dark/50 font-light mb-3">Ofte stilte spørsmål</p>
          <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-8">Praktisk informasjon</h2>
          <Accordion type="single" collapsible className="w-full">
            {SHARED_FAQS.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-b border-brand-dark/10">
                <AccordionTrigger className="text-left text-base font-light text-brand-dark hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-brand-dark/75 font-light leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Focused dark CTA */}
      <section className="bg-brand-dark py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs text-brand-light/50 font-light mb-6">Ta kontakt</p>
          <h2 className="text-3xl md:text-5xl font-light text-brand-light leading-[1.1] mb-10">
            Bestill en tid hos {firstName}.
          </h2>
          <Button asChild size="lg" className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to={`/spesialister/${specialist.slug}`}>
              Velg time
            </Link>
          </Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-light py-16 md:py-24 border-t border-brand-dark/10">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            <p className="text-xs text-brand-dark/50 font-light mb-8">Beslektede spesialister</p>
            <ul className="divide-y divide-brand-dark/10">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/spesialister/${r.slug}`} className="group flex items-center justify-between py-5">
                    <div>
                      <p className="text-base font-normal text-brand-dark">{r.name}</p>
                      <p className="text-xs text-brand-dark/60 font-light">{r.title}</p>
                    </div>
                    <ArrowUpRight
                      className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-dark group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default Variant3;
