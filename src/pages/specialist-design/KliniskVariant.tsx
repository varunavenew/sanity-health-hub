import { Link } from "react-router-dom";
import { MapPin, Calendar, Languages, GraduationCap, Stethoscope, Check } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDemoSpecialist } from "./_useDemoSpecialist";
import { getBioBlocks, RichBioBlock, getRelevantReviews, ReviewCard, SHARED_FAQS } from "./_shared";

interface Props { isChatOpen?: boolean }

/**
 * Forslag 2 — Bento & redaksjonell flyt.
 * Varm hero med portrett, bento-grid for fakta, brødtekst med marginalia,
 * full integrasjon av anmeldelser, FAQ, beslektede spesialister og booking.
 */
const Variant2 = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const blocks = getBioBlocks(specialist);
  const reviews = getRelevantReviews(specialist);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero */}
      <header className="bg-brand-warm/40 pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-5"
            >
              <div className="aspect-[4/5] overflow-hidden bg-brand-light rounded-sm">
                <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>

            <div className="md:col-span-7">
              <p className="text-xs text-brand-dark/60 font-light mb-4">Spesialistprofil · {specialist.category}</p>
              <h1 className="text-4xl md:text-6xl font-light text-brand-dark leading-[1.02] mb-4">{specialist.name}</h1>
              <p className="text-base md:text-lg text-brand-dark/70 font-light mb-8 max-w-xl">
                {specialist.title}
                {specialist.subtitle && specialist.subtitle !== specialist.title ? ` · ${specialist.subtitle}` : ""}
              </p>

              {specialist.expertise?.length ? (
                <div className="flex flex-wrap gap-2 mb-8">
                  {specialist.expertise.slice(0, 8).map((e) => (
                    <span key={e} className="inline-flex items-center px-3.5 py-1.5 text-xs font-light text-brand-dark border border-brand-dark/20 rounded-2xl md:rounded-full">
                      {e}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button asChild variant="cta" size="lg">
                  <Link to={`/spesialister/${specialist.slug}`}>
                    Bestill time hos {firstName}
                  </Link>
                </Button>
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-brand-dark font-light">
                  {["Ingen henvisning", "Korte ventetider"].map((u) => (
                    <li key={u} className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento facts */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specialist.expertise?.length ? (
              <div className="md:col-span-2 md:row-span-2 bg-brand-warm/30 p-6 md:p-8 rounded-sm">
                <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-light mb-4">
                  <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                  Ekspertise
                </div>
                <ul className="space-y-2 text-base text-brand-dark font-light">
                  {specialist.expertise.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
            ) : null}

            {specialist.education ? (
              <div className="md:col-span-2 bg-brand-warm/30 p-6 md:p-8 rounded-sm">
                <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-light mb-3">
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  Utdanning
                </div>
                <p className="text-sm text-brand-dark font-light leading-relaxed">{specialist.education}</p>
              </div>
            ) : null}

            {specialist.languages?.length ? (
              <div className="bg-brand-warm/30 p-6 md:p-8 rounded-sm">
                <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-light mb-3">
                  <Languages className="w-3.5 h-3.5" aria-hidden="true" />
                  Språk
                </div>
                <p className="text-sm text-brand-dark font-light">{specialist.languages.join(", ")}</p>
              </div>
            ) : null}

            {specialist.clinics?.length ? (
              <div className="bg-brand-warm/30 p-6 md:p-8 rounded-sm">
                <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-light mb-3">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  Klinikker
                </div>
                <ul className="space-y-1 text-sm text-brand-dark font-light">
                  {specialist.clinics.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Bio — long form with marginalia (full rich content incl. media) */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <p className="text-xs text-brand-dark/50 font-light lg:sticky lg:top-28">
                Om {firstName}
              </p>
            </div>
            <div className="lg:col-span-9 max-w-3xl space-y-6">
              {blocks.map((b, i) => <RichBioBlock key={i} block={b} tone="warm" />)}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — three white cards on light */}
      {reviews.length > 0 && (
        <section className="bg-brand-light py-16 md:py-20">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm text-brand-dark/75 font-light mb-2">Pasienterfaringer</p>
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark">Hva pasientene sier</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {reviews.map((r) => <ReviewCard key={r.id} review={r} tone="white" />)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-sm text-brand-dark/60 font-light mb-2">Ofte stilte spørsmål</p>
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
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
          <div>
            <p className="text-xs text-brand-light/50 font-light mb-3">Klar når du er</p>
            <h2 className="text-3xl md:text-4xl font-light text-brand-light leading-tight max-w-xl">
              Finn en tid hos {firstName} som passer din uke.
            </h2>
          </div>
          <Button asChild size="lg" className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            <Link to={`/spesialister/${specialist.slug}`}>
              Bestill time
            </Link>
          </Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-warm/30 py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <p className="text-xs text-brand-dark/50 font-light mb-6">Andre i samme fagområde</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/spesialister/${r.slug}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-3 bg-brand-light rounded-sm">
                    <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  </div>
                  <p className="text-sm font-normal text-brand-dark">{r.name}</p>
                  <p className="text-xs text-brand-dark/60 font-light">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default Variant2;
