import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import {
  gynekologiContent, gynekologiServices, gynekologiServiceGroups, gynekologiFaqs,
} from "./gynekologiContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

/**
 * IndexVariant – modern, calm, structured.
 * Services are placed immediately after the intro (the main focus).
 * Each chapter is led by a brand-format image (4:5 portrait) and a numbered list.
 */
const IndexVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = `${gynekologiContent.title} · Index | CMedical`;
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 4),
    []
  );

  const groupsWithServices = useMemo(
    () =>
      gynekologiServiceGroups.map((g) => ({
        label: g.label,
        caption: g.caption,
        image: g.image,
        services: gynekologiServices.filter((s) => g.serviceNames.includes(s.name)),
      })),
    []
  );

  const [intro, ...restDescription] = gynekologiContent.description.split("\n\n");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-background pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO – tight, intro carries to services */}
      <section className="bg-background pt-14 md:pt-20 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-10">
            <span className="inline-block w-8 h-px bg-foreground/40 align-middle mr-3" />
            {gynekologiContent.title} — {gynekologiContent.subtitle}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light text-foreground leading-[0.98] tracking-tight max-w-5xl mb-10">
            Kvinnehelse er folkehelse.
          </h1>
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="text-lg md:text-xl text-foreground/80 font-light leading-[1.55] mb-8">
                {intro}
              </p>
              <div className="flex items-center gap-6">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Bestill time
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
          </div>
        </div>
      </section>

      {/* THE INDEX — primary focus, immediately after intro.
          Each chapter is led by a brand-format portrait image (4:5)
          paired with a numbered, calm service list. */}
      <section className="bg-brand-warm py-20 md:py-28 border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Tjenesteregister · {String(gynekologiServices.length).padStart(2, "0")} områder
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.02] tracking-tight">
                {gynekologiContent.servicesHeading}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7 flex md:items-end">
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                {gynekologiContent.servicesIntro}
              </p>
            </div>
          </div>

          <div className="space-y-20 md:space-y-28">
            {groupsWithServices.map((group, gi) => {
              const startIndex = groupsWithServices
                .slice(0, gi)
                .reduce((acc, g) => acc + g.services.length, 0);
              const imageFirst = gi % 2 === 0;
              return (
                <div
                  key={group.label}
                  className="grid grid-cols-12 gap-8 md:gap-12 items-start"
                >
                  {/* Image column — brand-format 4:5 portrait */}
                  <div
                    className={`col-span-12 md:col-span-5 ${
                      imageFirst ? "md:order-1" : "md:order-2 md:col-start-8"
                    }`}
                  >
                    <div className="md:sticky md:top-28 space-y-5">
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                        <img
                          src={group.image}
                          alt={group.label}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-3">
                          Kapittel {String(gi + 1).padStart(2, "0")}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-light text-foreground leading-tight mb-2">
                          {group.label}
                        </h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          {group.caption}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service list column */}
                  <div
                    className={`col-span-12 md:col-span-6 ${
                      imageFirst ? "md:order-2 md:col-start-7" : "md:order-1"
                    }`}
                  >
                    <ul>
                      {group.services.map((s, si) => {
                        const Icon = s.icon;
                        const num = startIndex + si + 1;
                        return (
                          <li
                            key={s.name}
                            className="border-b border-border/50 first:border-t"
                          >
                            <Link
                              to={s.path}
                              className="group flex items-center gap-6 py-5 md:py-6 hover:gap-8 transition-all duration-300"
                            >
                              <span className="text-xs font-light text-muted-foreground tabular-nums w-8">
                                {String(num).padStart(2, "0")}
                              </span>
                              <Icon
                                className="w-4 h-4 text-foreground/50 flex-shrink-0"
                                strokeWidth={1.5}
                              />
                              <span className="text-base md:text-lg font-light text-foreground flex-1">
                                {s.name}
                              </span>
                              <ArrowUpRight
                                className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                                strokeWidth={1.5}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Continued description — calm aftermath of the register */}
      {restDescription.length > 0 && (
        <section className="bg-background py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            {restDescription.map((p, i) => (
              <p
                key={i}
                className="text-lg md:text-xl font-light text-foreground leading-[1.65] mb-6 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Specialists — clean editorial row */}
      <section className="bg-brand-warm py-24 md:py-32 border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-14 md:mb-16">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Møt teamet
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Spesialistene som følger deg
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle gynekologer
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {gynSpecialists.map((s) => (
              <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-muted rounded-2xl mb-4">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <h3 className="text-base font-light text-foreground mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground font-light">
                  {s.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <CategoryReviews categoryId="gynekologi" categoryTitle="Gynekologi" />

      {/* FAQ */}
      <section className="bg-background py-24 md:py-32 border-t border-border/40">
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

      {/* Closing CTA — calm, not loud */}
      <section className="bg-brand-warm py-24 md:py-32 border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">
            Klar når du er det
          </p>
          <h2 className="text-4xl md:text-6xl font-light text-foreground leading-[1.05] tracking-tight mb-8">
            Time innen kort tid.<br />
            Ingen henvisning.
          </h2>
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Bestill gynekologtime
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default IndexVariant;
