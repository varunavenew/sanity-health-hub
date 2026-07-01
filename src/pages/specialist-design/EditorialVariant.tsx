import { Link } from "react-router-dom";
import { MapPin, Calendar, Check, GraduationCap, Languages, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDemoSpecialist } from "./_useDemoSpecialist";
import { getBioBlocks, RichBioBlock, getRelevantReviews, ReviewCard, SHARED_FAQS } from "./_shared";

interface Props { isChatOpen?: boolean }

/**
 * Forslag 1 — Portrettmonolitten.
 * Fullhøyt portrett til venstre, sittende rail med fakta til høyre,
 * hele profilen (bio, anmeldelser, FAQ, beslektede, booking) ren og editorial.
 */
const Variant1 = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const nameParts = specialist.name.split(" ");
  const blocks = getBioBlocks(specialist);
  const reviews = getRelevantReviews(specialist);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero — portrait monolith */}
      <header className="relative bg-brand-light pt-20 lg:pt-0">
        <div className="grid lg:grid-cols-12 lg:min-h-[88vh]">
          <div className="relative lg:col-span-7 min-h-[60vh] lg:min-h-full">
            <img src={specialist.image} alt={specialist.name} className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/55 to-transparent pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute left-6 md:left-12 bottom-8 md:bottom-12 right-6 md:right-12"
            >
              <p className="text-xs text-brand-light/80 font-light mb-3">Portrett · {specialist.category}</p>
              <h1 className="font-light text-brand-light leading-[0.92] text-[clamp(2.75rem,7vw,6rem)]">
                {nameParts.map((p, i) => <span key={i} className="block">{p}</span>)}
              </h1>
            </motion.div>
          </div>

          <aside className="lg:col-span-5 bg-brand-light flex flex-col justify-between px-6 md:px-12 lg:px-16 py-14 lg:py-20">
            <div>
              <p className="text-xs text-brand-dark/60 font-light mb-4">Spesialist</p>
              <p className="text-xl md:text-2xl font-light text-brand-dark leading-snug max-w-md mb-10">
                {specialist.title}
                {specialist.subtitle && specialist.subtitle !== specialist.title ? `. ${specialist.subtitle}.` : "."}
              </p>

              {specialist.clinics?.length ? (
                <div className="mb-8">
                  <p className="text-xs text-brand-dark/50 font-light mb-3">Tilgjengelig ved</p>
                  <ul className="space-y-1.5">
                    {specialist.clinics.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-brand-dark font-light">
                        <MapPin className="w-3.5 h-3.5 text-brand-dark/50" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <ul className="space-y-2 mb-10">
                {["Ingen henvisning", "Korte ventetider", "Erfaren spesialist"].map((u) => (
                  <li key={u} className="flex items-center gap-2 text-sm text-brand-dark font-light">
                    <Check className="w-4 h-4 text-brand-dark" aria-hidden="true" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
                <Link to={`/spesialister/${specialist.slug}`}>
                  Bestill time hos {firstName}
                </Link>
              </Button>
              <p className="text-xs text-brand-dark/50 font-light">Eller ring oss for hjelp med å finne tid.</p>
            </div>
          </aside>
        </div>
      </header>

      {/* Bio — sticky margin metadata + full rich content */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-8 text-sm font-light">
              {specialist.expertise?.length ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Ekspertise</p>
                  <ul className="space-y-1.5 text-brand-dark">
                    {specialist.expertise.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              ) : null}
              {specialist.education ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Utdanning</p>
                  <p className="text-brand-dark leading-relaxed">{specialist.education}</p>
                </div>
              ) : null}
              {specialist.languages?.length ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Språk</p>
                  <p className="text-brand-dark">{specialist.languages.join(", ")}</p>
                </div>
              ) : null}
            </aside>

            <div className="lg:col-span-8">
              <p className="text-xs text-brand-dark/50 font-light mb-4">Om {firstName}</p>
              <div className="space-y-6">
                {blocks.map((b, i) => <RichBioBlock key={i} block={b} tone="warm" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — pale cards on warm */}
      {reviews.length > 0 && (
        <section className="bg-brand-warm py-16 md:py-20">
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

      {/* Dark CTA */}
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <p className="text-xs text-brand-light/50 font-light mb-3">Ta neste steg</p>
              <h2 className="text-3xl md:text-4xl font-light text-brand-light leading-tight">
                Bestill time hos {firstName} — uten henvisning, kort ventetid.
              </h2>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Button asChild size="lg" className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to={`/spesialister/${specialist.slug}`}>
                  Velg time
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <p className="text-xs text-brand-dark/50 font-light mb-6">Andre i samme fagområde</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/spesialister/${r.slug}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-3 bg-brand-warm">
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

export default Variant1;
