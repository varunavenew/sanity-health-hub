import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, ArrowLeft, Check, Clock, FileText, ShieldCheck } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { DemoSpecialistCard } from "./DemoSpecialistCard";
import {
  sjekkContent, sjekkFlow, sjekkReasons, sjekkRelated, sjekkFaqs, fertilitetImages,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const facts = [
  { icon: Clock, k: "Varighet", v: "45–60 min" },
  { icon: FileText, k: "Henvisning", v: "Ikke nødvendig" },
  { icon: ShieldCheck, k: "Innhold", v: "AMH · AFC · Hormoner · Ultralyd" },
];

const SjekkKlinikk = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitetssjekk · Klinikk | CMedical"; }, []);

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
            <AssetImg src={fertilitetImages.lab} alt="Fertilitetssjekk" className="w-full h-full object-cover" />
          </div>
          <div className="lg:w-1/2 bg-brand-dark text-white flex items-center">
            <div className="px-8 md:px-14 py-12 md:py-0 w-full max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60 font-light mb-6">{sjekkContent.title}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-6">{sjekkContent.heroHeadline}</h1>
              <p className="text-base text-white/80 font-light leading-relaxed mb-10">{sjekkContent.heroLead}</p>
              <ul className="border-t border-white/15 pt-8 mb-10 space-y-4">
                {facts.map((f) => (
                  <li key={f.k} className="flex items-center gap-4">
                    <f.icon className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-[0.18em] text-white/50 font-light w-28 flex-shrink-0">{f.k}</span>
                    <span className="text-sm font-light text-white">{f.v}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}>
                Bestill sjekk <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Kort fortalt</p>
            <p className="text-2xl md:text-3xl font-light text-foreground leading-tight">{sjekkContent.subtitle}</p>
          </div>
          <div className="col-span-12 md:col-span-8 space-y-5">
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-[1.6]">{sjekkContent.intro}</p>
            <p className="text-base text-muted-foreground font-light leading-relaxed">{sjekkContent.intro2}</p>
          </div>
        </div>
      </section>

      {/* SPECIALISTS — først */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvem du møter</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Fertilitetsspesialistene</h2>
            </div>
            <Link to="/spesialister" className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground">Se alle <ArrowRight className="w-4 h-4" strokeWidth={1.5} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {fertilitySpecialists.map((s) => <DemoSpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </div>
      </section>

      {/* FLOW — som tabell */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Innhold</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Seks målepunkter</h2>
          <div className="bg-background border border-border/40 rounded-2xl overflow-hidden">
            {sjekkFlow.map((s, i) => (
              <div key={s.n} className={`grid grid-cols-12 gap-6 md:gap-10 px-6 md:px-8 py-6 ${i > 0 ? "border-t border-border/40" : ""}`}>
                <p className="col-span-2 md:col-span-1 text-xs uppercase tracking-[0.18em] text-muted-foreground font-light pt-1">{s.n}</p>
                <h3 className="col-span-10 md:col-span-4 text-base md:text-lg font-light text-foreground">{s.title}</h3>
                <p className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASONS — sjekkliste */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Sjekken er for deg som</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">Kjenner du deg igjen?</h2>
          <ul className="space-y-3">
            {sjekkReasons.map((r) => (
              <li key={r.n} className="flex items-start gap-4 bg-brand-warm rounded-2xl p-5">
                <Check className="w-5 h-5 text-foreground/70 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-base font-light text-foreground mb-1">{r.title}</p>
                  <p className="text-sm text-muted-foreground font-light">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Etter sjekken</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Aktuelle neste steg</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sjekkRelated.map((r) => (
              <Link key={r.title} to={r.href} className="group block bg-background border border-border/40 rounded-2xl p-7 hover:border-foreground/40 transition-all">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">{r.eyebrow}</p>
                <h3 className="text-lg font-light text-foreground mb-3">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-light text-foreground/70 group-hover:text-foreground">Les mer <ArrowRight className="w-3 h-3" strokeWidth={1.5} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Vanlige spørsmål</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">Det folk spør om</h2>
          <Accordion type="single" collapsible className="w-full">
            {sjekkFaqs.map((faq, i) => (
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
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">{sjekkContent.ctaTitle}</h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">{sjekkContent.ctaDescription}</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12" onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}>
            Bestill fertilitetssjekk <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default SjekkKlinikk;
