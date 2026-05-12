import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import {
  gynekologiContent, gynekologiServices, gynekologiServiceGroups, gynekologiFaqs,
} from "./gynekologiContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

const AtelierVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = `${gynekologiContent.title} · Atelier | CMedical`;
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 6),
    []
  );

  const groupsWithServices = useMemo(
    () =>
      gynekologiServiceGroups.map((g) => ({
        label: g.label,
        services: gynekologiServices.filter((s) => g.serviceNames.includes(s.name)),
      })),
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

      {/* HERO – tighter, more editorial */}
      <section className="bg-brand-warm pt-12 md:pt-16 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 items-end mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-8">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">
                {gynekologiContent.title} — {gynekologiContent.subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light text-foreground leading-[0.98] tracking-tight">
                Direkte tilgang<br />
                til riktig ekspertise.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4">
              <p className="text-base text-muted-foreground font-light leading-relaxed mb-8">
                {intro}
              </p>
              <Button
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light h-11 px-6"
                onClick={() => (window.location.href = "/booking")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
            <img
              src={gynekologiImg}
              alt={gynekologiContent.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 35%" }}
            />
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

      {/* Tjenester – full list, clearly grouped, premium gallery rhythm */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                {gynekologiContent.servicesHeading}
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
                Hele bredden,<br />
                samlet på ett sted.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7 flex md:items-end">
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                {gynekologiContent.servicesIntro}
              </p>
            </div>
          </div>

          <div className="space-y-20 md:space-y-24">
            {groupsWithServices.map((group, i) => (
              <article key={group.label} className="grid grid-cols-12 gap-8 md:gap-12">
                <div className="col-span-12 md:col-span-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-3">
                    {String(i + 1).padStart(2, "0")} — Tema
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-foreground leading-tight">
                    {group.label}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <ul className="divide-y divide-border/60 border-t border-b border-border/60">
                    {group.services.map((s) => {
                      const Icon = s.icon;
                      return (
                        <li key={s.name}>
                          <Link
                            to={s.path}
                            className="group flex items-center gap-5 py-5 hover:px-3 transition-all duration-300"
                          >
                            <Icon className="w-5 h-5 text-foreground/60 flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-lg font-light text-foreground flex-1">
                              {s.name}
                            </span>
                            <ArrowUpRight
                              className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                              strokeWidth={1.5}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists – portrait wall on warm bg */}
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
              <DemoSpecialistCard key={s.slug} specialist={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <CategoryReviews categoryId="gynekologi" categoryTitle="Gynekologi" />

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
