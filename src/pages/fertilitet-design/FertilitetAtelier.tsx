import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import {
  fertilitetContent,
  fertilitetImages,
  fertilitetSegments,
  fertilitetServices,
  fertilitetFaqs,
} from "./fertilitetContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

const stats = [
  { value: "1989", label: "Etablert år" },
  { value: "3 800+", label: "Barn født etter behandling" },
  { value: "4,7", label: "Snitt på Legelisten" },
  { value: "0", label: "Krav om henvisning" },
];

const FertilitetAtelier = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitet · Atelier | CMedical";
  }, []);

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 4),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-background pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/fertilitet-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* HERO — clinical, data-forward, asymmetric */}
      <section className="bg-background pt-12 md:pt-16 pb-20 md:pb-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-7">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-10">
                <span className="w-8 h-px bg-foreground/30" />
                <span>{fertilitetContent.subtitle}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light text-foreground leading-[0.98] tracking-tight mb-10">
                Fertilitet — <br />
                <span className="text-foreground/40">presisjon og nærhet.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                {fertilitetContent.heroLead}
              </p>
              <div className="flex items-center gap-4 mt-10">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() => (window.location.href = "/booking?kategori=fertilitet")}
                >
                  Bestill konsultasjon
                  <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link
                  to="/priser"
                  className="text-sm font-light text-foreground/70 hover:text-foreground underline underline-offset-4"
                >
                  Se priser
                </Link>
              </div>
            </div>

            {/* Numerisk panel */}
            <aside className="col-span-12 md:col-span-5 md:pl-8 md:border-l border-border/60">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">
                Klinikken i tall
              </p>
              <dl className="grid grid-cols-2 gap-y-10 gap-x-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-2">
                      {s.value}
                    </dt>
                    <dd className="text-xs text-muted-foreground font-light leading-snug">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Spesialistene — forgrunn */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14 md:mb-16 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Teamet
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
                Du møter spesialistene <br /> som faktisk behandler deg.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Hos CMedical går du ikke fra den ene til den andre. Samme spesialist følger
                deg gjennom hele forløpet — fra første samtale til siste oppfølging.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {fertilitySpecialists.map((s) => (
              <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-light mb-1.5">
                  {s.subtitle || s.title}
                </p>
                <h3 className="text-base font-light text-foreground leading-snug">{s.name}</h3>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/spesialister?kategori=fertilitet"
              className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 pb-0.5"
            >
              Se alle fertilitetsspesialister
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hva trenger du? — segments som tabell */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Hva trenger du?
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Fire utgangspunkt — én klinikk
            </h2>
          </div>

          <div className="border-t border-border/60">
            {fertilitetSegments.map((s, i) => (
              <Link
                key={s.id}
                to={s.href}
                className="group grid grid-cols-12 gap-6 md:gap-10 border-b border-border/60 py-8 md:py-10 hover:bg-muted/30 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
              >
                <div className="col-span-12 md:col-span-1 text-xs font-light text-muted-foreground tracking-widest pt-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3 className="text-xl md:text-2xl font-light text-foreground leading-snug">
                    {s.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-1 md:text-right pt-2">
                  <ArrowRight
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground inline-block group-hover:translate-x-1 transition-all"
                    strokeWidth={1.5}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tjenestekatalog — kompakt indeks */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-12">
            <div className="col-span-12 md:col-span-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Tjenestekatalog
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
                Et komplett fertilitetstilbud — under samme tak.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:pt-4">
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                Klinikk, laboratorium og psykolog på én adresse. Fra første sjekk til genetisk
                testing — vi gjør det vi gjør, og vi gjør det grundig.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-border/60">
            {fertilitetServices.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.name} className="border-b border-border/60 md:border-r last:border-r-0">
                  <Link to={s.href} className="flex items-start gap-4 p-6 md:p-7 h-full hover:bg-background/60 transition-colors group">
                    <Icon className="w-5 h-5 text-foreground/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-base font-light text-foreground mb-1.5 leading-snug">{s.name}</p>
                      <p className="text-xs text-muted-foreground font-light">{s.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Wide image break */}
      <section className="bg-background">
        <div className="w-full h-[45vh] min-h-[360px] overflow-hidden">
          <img
            src={fertilitetImages.lab}
            alt="Laboratorium hos CMedical"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
            Vanlige spørsmål
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {fertilitetFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-light text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Time innen kort tid. Ingen henvisning.
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Faglig presisjon, tid til samtalen og et team som følger deg helt fram.
          </p>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking?kategori=fertilitet")}
          >
            Bestill konsultasjon
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default FertilitetAtelier;
