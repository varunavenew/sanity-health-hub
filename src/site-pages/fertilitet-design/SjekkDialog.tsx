import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";
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

const prompts = [
  "Bør jeg sjekke nå — eller vente?",
  "Vi vurderer å vente med barn.",
  "Hvor lang tid har jeg igjen?",
  "Er det normalt å lure på dette?",
  "Hva betyr AMH egentlig?",
];

const SjekkDialog = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitetssjekk · Dialog | CMedical"; }, []);

  const { specialists } = useSpecialistsData();

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => specialistMatchesCategory(s, "fertilitet")).slice(0, 3),
    [specialists]
  );

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % prompts.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link to="/fertilitet-design" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* SPLIT HERO */}
      <section className="bg-brand-warm pt-8 pb-0">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">{sjekkContent.title} · {sjekkContent.subtitle}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.02] tracking-tight max-w-4xl">{sjekkContent.heroHeadline}</h1>
        </div>
        <div className="flex flex-col lg:flex-row lg:h-[58vh] lg:min-h-[460px]">
          <div className="lg:w-1/2 h-[40vh] lg:h-full relative">
            <AssetImg src={fertilitetImages.lab} alt="Fertilitetssjekk" className="w-full h-full object-cover" />
          </div>
          <div className="lg:w-1/2 relative bg-brand-mid/40 flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-warm/30 via-transparent to-brand-dark/10" />
            <div className="relative z-10 px-8 md:px-14 py-12 md:py-0 w-full max-w-lg">
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/70 font-light mb-6">Det folk lurer på</p>
              <div className="h-24 md:h-28 mb-8 relative">
                {prompts.map((p, i) => (
                  <p key={p} className={`absolute inset-0 text-2xl md:text-3xl font-light text-foreground italic leading-snug transition-all duration-700 ${i === idx ? "opacity-100" : "opacity-0 translate-y-3"}`}>"{p}"</p>
                ))}
              </div>
              <p className="text-base text-foreground/80 font-light leading-relaxed mb-8">{sjekkContent.heroLead}</p>
              <div className="flex items-center gap-4">
                <Button className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}>
                  Bestill sjekk <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link to="/priser" className="text-sm font-light text-foreground/70 hover:text-foreground underline underline-offset-4">Se pris</Link>
              </div>
              <div className="flex items-center gap-2 mt-8 text-xs text-foreground/60 font-light">
                <Star className="w-3.5 h-3.5 fill-current" strokeWidth={0} /> {sjekkContent.ratingLine}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl space-y-6">
          <p className="text-lg md:text-xl text-foreground font-light leading-[1.6]">{sjekkContent.intro}</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed">{sjekkContent.intro2}</p>
        </div>
      </section>

      {/* FLOW — som dialog */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hva skjer i timen</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Seks korte steg — én konsultasjon</h2>
          <div className="space-y-3">
            {sjekkFlow.map((s) => (
              <div key={s.n} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 bg-brand-warm border border-border/40 rounded-2xl p-6 md:p-7">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light md:w-16 md:flex-shrink-0">{s.n}</p>
                <h3 className="text-lg md:text-xl font-light text-foreground md:w-72 md:flex-shrink-0">{s.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASONS */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvorfor ta en sjekk</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Du trenger ingen god grunn — men her er fem.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sjekkReasons.map((r) => (
              <div key={r.n} className="bg-background border border-border/40 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-3">{r.n}</p>
                <h3 className="text-lg font-light text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvem du møter</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Spesialistene som tar deg igjennom</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {fertilitySpecialists.map((s) => <DemoSpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hvis sjekken viser noe</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Mulige neste steg</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sjekkRelated.map((r) => (
              <Link key={r.title} to={r.href} className="group block bg-background border border-border/40 rounded-2xl p-7 hover:border-foreground/40 transition-all">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">{r.eyebrow}</p>
                <h3 className="text-xl font-light text-foreground mb-3">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">{r.desc}</p>
                <span className="text-sm font-light text-foreground underline underline-offset-4">Les mer →</span>
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

export default SjekkDialog;
