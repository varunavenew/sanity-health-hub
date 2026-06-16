import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { DemoSpecialistCard } from "./DemoSpecialistCard";
import {
  fertilitetContent, fertilitetImages, fertilitetAudiences, fertilitetSegments,
  fertilitetWhySteps, fertilitetServices, fertilitetClinicStats, fertilitetFaqs,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const rotatingPrompts = [
  "Vi har prøvd i et halvt år …",
  "Jeg vil bare vite hvor jeg står.",
  "Jeg er singel — kan jeg starte alene?",
  "Bør vi fryse ned egg nå?",
  "Vi er to kvinner som ønsker barn.",
  "Hva med min del av bildet?",
];

const FertilitetDialog = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitet · Dialog | CMedical"; }, []);

  const { specialists } = useSpecialistsData();

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => specialistMatchesCategory(s, "fertilitet")).slice(0, 4),
    [specialists]
  );

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % rotatingPrompts.length), 2800);
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
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
            {fertilitetContent.title} · {fertilitetContent.subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.02] tracking-tight max-w-4xl">
            {fertilitetContent.heroHeadline}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:h-[60vh] lg:min-h-[480px]">
          <div className="lg:w-1/2 h-[40vh] lg:h-full relative">
            <AssetImg src={fertilitetImages.hero} alt="Fertilitet" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
          </div>
          <div className="lg:w-1/2 relative bg-brand-mid/40 flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-warm/30 via-transparent to-brand-dark/10" />
            <div className="relative z-10 px-8 md:px-14 py-12 md:py-0 w-full max-w-lg">
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/70 font-light mb-6">Det folk sier til oss</p>
              <div className="h-24 md:h-28 mb-8 relative">
                {rotatingPrompts.map((p, i) => (
                  <p
                    key={p}
                    className={`absolute inset-0 text-2xl md:text-3xl font-light text-foreground italic leading-snug transition-all duration-700 ${
                      i === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
                  >
                    "{p}"
                  </p>
                ))}
              </div>
              <p className="text-base text-foreground/80 font-light leading-relaxed mb-8">
                {fertilitetContent.heroLead}
              </p>
              <div className="flex items-center gap-4">
                <Button className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
                  Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link to="/priser" className="text-sm font-light text-foreground/70 hover:text-foreground underline underline-offset-4">Se priser</Link>
              </div>
              <div className="flex items-center gap-2 mt-8 text-xs text-foreground/60 font-light">
                <Star className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
                {fertilitetContent.ratingLine}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl text-foreground font-light leading-[1.6]">{fertilitetContent.intro}</p>
        </div>
      </section>

      {/* AUDIENCES — som dialogkort */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Alle er velkomne</p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Hvem er du som lurer?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {fertilitetAudiences.map((a) => (
              <Link key={a.title} to={a.href} className="group bg-brand-warm border border-border/40 rounded-2xl p-7 md:p-8 hover:border-foreground/40 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-light text-foreground">{a.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEGMENTS — pasientens spørsmål */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hva er ditt utgangspunkt?</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Vi møter deg der du er — ikke der vi tror du burde være.</h2>
          <div className="space-y-3">
            {fertilitetSegments.map((s) => (
              <Link key={s.id} to={s.href} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background hover:bg-background/60 border border-border/40 rounded-2xl p-6 md:p-7 transition-all">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-light text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-light text-foreground/80 group-hover:text-foreground whitespace-nowrap">
                  {s.cta} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY STEPS */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {fertilitetWhySteps.map((w) => (
              <div key={w.n}>
                <p className="text-5xl md:text-6xl font-light text-foreground/15 mb-4">{w.n}</p>
                <h3 className="text-xl font-light text-foreground mb-3">{w.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Mennesker, ikke titler</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Spesialistene som følger dere</h2>
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

      {/* SERVICES — enkel liste */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">Hele tilbudet</p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Alt på ett sted</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {fertilitetServices.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.name}>
                  <Link to={s.href} className="bg-background hover:bg-brand-warm/60 transition-colors flex items-start gap-4 p-5 md:p-6 h-full">
                    <Icon className="w-5 h-5 text-foreground/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-base font-light text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground font-light mt-1">{s.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" strokeWidth={1.5} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* STATS — kort mørk stripe */}
      <section className="bg-brand-dark py-14 md:py-16 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {fertilitetClinicStats.map((s) => (
              <div key={s.k}>
                <p className="text-3xl md:text-4xl font-light mb-2">{s.v}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-light">{s.k}</p>
                <p className="text-xs text-white/50 font-light mt-1">{s.sub}</p>
              </div>
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
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">Ta en uforpliktende prat med sykepleier.</h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">Gratis og uten henvisning. Vi hjelper deg å finne ut hva neste steg er.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
            Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default FertilitetDialog;
