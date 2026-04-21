import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import {
  gynekologiContent, gynekologiServices, gynekologiFaqs,
} from "./gynekologiContent";

interface PageProps { isChatOpen: boolean }

const AtelierVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = `${gynekologiContent.title} · Atelier | CMedical`;
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 6),
    []
  );

  const [intro, ...restDescription] = gynekologiContent.description.split("\n\n");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO – full bleed image */}
      <section className="bg-brand-warm pt-10 md:pt-12 pb-6 md:pb-8">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
            <img
              src={gynekologiImg}
              alt={gynekologiContent.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 35%" }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-warm pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12 mt-6 md:mt-8">
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light">
                {gynekologiContent.title}
              </p>
              <p className="text-xs text-muted-foreground font-light mt-2">
                {gynekologiContent.subtitle}
              </p>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.02] tracking-tight">
                CMedical Kvinnehelse – direkte tilgang til riktig ekspertise, uten omveier.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                {intro}
              </p>
              <Button
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light h-11 w-full md:w-auto"
                onClick={() => (window.location.href = "/booking")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Continued description */}
      {restDescription.length > 0 && (
        <section className="bg-background py-20 md:py-28 border-t border-border/60">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            {restDescription.map((p, i) => (
              <p
                key={i}
                className="text-lg md:text-xl font-light text-foreground leading-[1.6] mb-6 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Tjenester – ALL 15 services as a tag wall */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12">
            <div className="col-span-12 md:col-span-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                {gynekologiContent.servicesHeading}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-6">
                Hele bredden – samlet på ett sted
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {gynekologiContent.servicesIntro}
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="flex flex-wrap gap-2.5">
                {gynekologiServices.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.name}>
                      <Link
                        to={s.path}
                        className="inline-flex items-center gap-2 text-sm font-light text-foreground px-4 py-2.5 rounded-full border border-border hover:bg-muted hover:border-foreground/40 transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 text-foreground/60" strokeWidth={1.5} />
                        {s.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists – portrait wall */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Portrettveggen
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Spesialistene
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {gynSpecialists.map((s) => (
              <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <p className="text-sm font-light text-foreground leading-tight">{s.name}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            {gynekologiFaqs.map((faq, i) => (
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

      {/* Final CTA */}
      <section className="bg-brand-warm py-20 md:py-28 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Bestill din time.
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-4 max-w-md">
              Kort ventetid. Ingen henvisning. Et helsetilbud som henger sammen.
            </p>
          </div>
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Til booking
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default AtelierVariant;
