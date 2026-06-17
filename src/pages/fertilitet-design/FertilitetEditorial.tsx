import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";
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
  fertilitetServiceGroups,
  fertilitetFaqs,
  fertilitetAudiences,
} from "./fertilitetContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

const FertilitetEditorial = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitet · Editorial | CMedical";
  }, []);

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 3),
    []
  );

  const groupsWithServices = useMemo(
    () =>
      fertilitetServiceGroups.map((g) => ({
        label: g.label,
        services: fertilitetServices.filter((s) => g.serviceNames.includes(s.name)),
      })),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/fertilitet-design"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-brand-warm pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="text-xs text-muted-foreground font-light mb-8">
                {fertilitetContent.title} · {fertilitetContent.subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] tracking-tight">
                Noen ganger trenger kroppen <em className="italic font-light">litt hjelp</em> på veien.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {fertilitetContent.heroLead}
              </p>
              <div className="flex items-center gap-4 mt-8">
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
          </div>
        </div>
      </section>

      {/* Wide image */}
      <section className="bg-brand-warm">
        <div className="w-full h-[55vh] min-h-[420px] overflow-hidden">
          <img
            src={fertilitetImages.hero}
            alt="Fertilitetsbehandling hos CMedical"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6]">
            {fertilitetContent.intro}
          </p>
          <div className="inline-flex items-center gap-3 text-sm font-light text-foreground mt-8">
            <div className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-brand-dark text-brand-dark" />
              ))}
            </div>
            <span>{fertilitetContent.ratingLine}</span>
          </div>
        </div>
      </section>

      {/* Segments as chapters */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p className="text-xs text-muted-foreground font-light mb-6">
              Hvor er du i dag?
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Fortell oss hvor du er — vi finner veien videre.
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16">
            {fertilitetSegments.map((s, i) => (
              <article key={s.id} className="grid grid-cols-12 gap-6 md:gap-10 items-start border-t border-border/60 pt-12 md:pt-14">
                <div className="col-span-12 md:col-span-2">
                  <p className="text-7xl md:text-8xl font-light text-foreground/15 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-2xl md:text-3xl font-light text-foreground mb-4 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed max-w-xl">
                    {s.desc}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right">
                  <Link
                    to={s.href}
                    className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 hover:border-foreground/70 pb-0.5 transition-colors"
                  >
                    {s.cta}
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Alle er velkomne — fra /fertilitet */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs text-muted-foreground font-light mb-6">
              For deg som
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Alle er velkomne — uansett utgangspunkt.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {fertilitetAudiences.map((a) => (
              <Link
                key={a.title}
                to={a.href}
                className="group block bg-card border border-border/60 rounded-2xl p-7 md:p-8 hover:border-foreground/40 transition-all"
              >
                <h3 className="text-xl font-light text-foreground mb-3">{a.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                  {a.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-light text-foreground group-hover:gap-2.5 transition-all">
                  Les mer
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services grouped */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs text-muted-foreground font-light mb-6">
              Alt under samme tak
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Tjenester, kapittel for kapittel
            </h2>
          </div>

          <div className="space-y-14">
            {groupsWithServices.map((group, i) => (
              <article key={group.label}>
                <div className="flex items-baseline gap-6 mb-6">
                  <p className="text-6xl md:text-7xl font-light text-foreground/10 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-foreground">{group.label}</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
                  {group.services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.name}>
                        <Link
                          to={s.href}
                          className="bg-background hover:bg-muted/40 transition-colors flex items-start gap-4 p-5 md:p-6 h-full"
                        >
                          <Icon className="w-5 h-5 text-foreground/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div className="flex-1">
                            <p className="text-base font-light text-foreground mb-1">{s.name}</p>
                            <p className="text-xs text-muted-foreground font-light">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" strokeWidth={1.5} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="max-w-xl">
              <p className="text-xs text-muted-foreground font-light mb-6">
                Spesialistene
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Mennesker som følger deg
              </h2>
            </div>
            <Link
              to="/spesialister?kategori=fertilitet"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle fertilitetsspesialister
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {fertilitySpecialists.map((s) => (
              <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-muted mb-5 rounded-sm">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-light mb-2">
                  {s.subtitle || s.title}
                </p>
                <h3 className="text-xl font-light text-foreground mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {s.expertise.slice(0, 2).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs text-muted-foreground font-light mb-6">
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

      {/* Closing CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Time innen kort tid. Ingen henvisning.
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Vi tror på faglig trygghet, tid til samtalen og en oppfølging som faktisk henger sammen.
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

export default FertilitetEditorial;
