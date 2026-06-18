import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, ArrowLeft, Star, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { DemoSpecialistCard } from "./DemoSpecialistCard";
import {
  fertilitetContent, fertilitetImages, fertilitetClinicStats, fertilitetResultStats,
  fertilitetServices, fertilitetWhySteps, fertilitetAudiences, fertilitetSegments,
  fertilitetFaqs,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const FertilitetKlinikk = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitet · Klinikk | CMedical"; }, []);

  const { specialists } = useSpecialistsData();

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => specialistMatchesCategory(s, "fertilitet")).slice(0, 4),
    [specialists]
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link to="/fertilitet-design" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* SPLIT HERO – fakta */}
      <section className="bg-brand-warm pt-8 pb-0">
        <div className="flex flex-col lg:flex-row lg:h-[70vh] lg:min-h-[560px]">
          <div className="lg:w-1/2 h-[45vh] lg:h-full relative">
            <AssetImg src={fertilitetImages.hero} alt="Fertilitet" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
          </div>
          <div className="lg:w-1/2 bg-brand-dark text-white flex items-center">
            <div className="px-8 md:px-14 py-12 md:py-0 w-full max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60 font-light mb-6">{fertilitetContent.title} · Etablert 1989</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-6">
                {fertilitetContent.heroHeadline}
              </h1>
              <p className="text-base text-white/80 font-light leading-relaxed mb-10">{fertilitetContent.heroLead}</p>
              <div className="grid grid-cols-2 gap-6 border-t border-white/15 pt-8 mb-10">
                {fertilitetClinicStats.map((s) => (
                  <div key={s.k}>
                    <p className="text-2xl font-light mb-1">{s.v}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50 font-light">{s.k}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
                  Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link to="/priser" className="text-sm font-light text-white/70 hover:text-white underline underline-offset-4">Se priser</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Kort fortalt</p>
            <p className="text-2xl md:text-3xl font-light text-foreground leading-tight">{fertilitetContent.subtitle}</p>
          </div>
          <p className="col-span-12 md:col-span-8 text-lg md:text-xl text-foreground/80 font-light leading-[1.6]">{fertilitetContent.intro}</p>
        </div>
      </section>

      {/* SPECIALISTS — først */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Teamet</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Spesialistene som driver klinikken</h2>
            </div>
            <Link to="/spesialister" className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground">
              Se alle <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {fertilitySpecialists.map((s) => <DemoSpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </div>
      </section>

      {/* RESULT STATS */}
      <section className="bg-brand-dark py-14 md:py-16 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60 font-light mb-8">Resultater</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {fertilitetResultStats.map((s) => (
              <div key={s.k}>
                <p className="text-3xl md:text-5xl font-light mb-2">{s.v}</p>
                <p className="text-sm text-white/80 font-light">{s.k}</p>
                <p className="text-xs text-white/50 font-light mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — som katalog */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Tilbud</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Behandlingskatalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fertilitetServices.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.name} to={s.href} className="group block bg-background border border-border/40 rounded-2xl p-6 hover:border-foreground/40 transition-all">
                  <Icon className="w-5 h-5 text-foreground/70 mb-5" strokeWidth={1.5} />
                  <h3 className="text-base font-light text-foreground mb-2">{s.name}</h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed mb-5">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-light text-foreground/70 group-hover:text-foreground">Les mer <ArrowRight className="w-3 h-3" strokeWidth={1.5} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvorfor CMedical</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Tre løfter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fertilitetWhySteps.map((w) => (
              <div key={w.n} className="border border-border/40 rounded-2xl p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">{w.n}</p>
                <h3 className="text-xl font-light text-foreground mb-3">{w.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES — sjekkliste */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvem behandler vi</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">Alle er velkomne</h2>
          <ul className="space-y-3">
            {fertilitetAudiences.map((a) => (
              <li key={a.title} className="flex items-start gap-4 bg-background rounded-2xl p-5">
                <Check className="w-5 h-5 text-foreground/70 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-base font-light text-foreground mb-1">{a.title}</p>
                  <p className="text-sm text-muted-foreground font-light">{a.desc}</p>
                </div>
                <Link to={a.href} className="text-xs uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground font-light whitespace-nowrap">Bestill →</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SEGMENTS as quick paths */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Snarveier</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Hva trenger du?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fertilitetSegments.map((s) => (
              <Link key={s.id} to={s.href} className="group flex items-center justify-between gap-4 bg-brand-warm border border-border/40 rounded-2xl p-6 hover:border-foreground/40 transition-all">
                <div className="flex-1">
                  <h3 className="text-base font-light text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground font-light">{s.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Vanlige spørsmål</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">Det folk spør om</h2>
          <Accordion type="single" collapsible className="w-full">
            {fertilitetFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-light text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark py-20 md:py-24 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">Bestill direkte — uten henvisning.</h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">Time samme uke. Snakk med sykepleier først om du er usikker — det er gratis.</p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/60 font-light mb-10">
            <Star className="w-3 h-3 fill-current" strokeWidth={0} /> {fertilitetContent.ratingLine}
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
            Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default FertilitetKlinikk;
