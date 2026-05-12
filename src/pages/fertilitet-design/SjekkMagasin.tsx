import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { DemoSpecialistCard } from "./DemoSpecialistCard";
import {
  sjekkContent, sjekkFlow, sjekkReasons, sjekkRelated, sjekkFaqs, fertilitetImages,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const SjekkMagasin = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitetssjekk · Magasin | CMedical"; }, []);

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 4),
    []
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

      {/* SPLIT HERO – magasin */}
      <section className="bg-brand-warm pt-8 pb-0">
        <div className="flex flex-col lg:flex-row lg:h-[78vh] lg:min-h-[600px]">
          <div className="lg:w-3/5 h-[45vh] lg:h-full relative">
            <img src={fertilitetImages.lab} alt="Fertilitetssjekk" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 md:top-10 md:left-10 text-white/90 text-xs uppercase tracking-[0.3em] font-light drop-shadow">Utgave 02 · Sjekken</div>
          </div>
          <div className="lg:w-2/5 bg-brand-warm flex flex-col justify-between p-8 md:p-14">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-10">
                <span>I dette nummeret</span>
                <span>{new Date().getFullYear()}</span>
              </div>
              <ol className="space-y-3 text-sm font-light text-foreground/80 mb-12">
                <li className="flex justify-between border-b border-border/40 pb-2"><span>01 — Hvorfor en sjekk</span><span className="text-muted-foreground">s. 02</span></li>
                <li className="flex justify-between border-b border-border/40 pb-2"><span>02 — Slik foregår det</span><span className="text-muted-foreground">s. 03</span></li>
                <li className="flex justify-between border-b border-border/40 pb-2"><span>03 — Spesialistene</span><span className="text-muted-foreground">s. 04</span></li>
                <li className="flex justify-between"><span>04 — Hva skjer etterpå</span><span className="text-muted-foreground">s. 05</span></li>
              </ol>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight mb-6 italic">{sjekkContent.heroHeadline}</h1>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">{sjekkContent.heroLead}</p>
              <Button className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}>
                Bestill sjekk <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">Lederen</p>
          <p className="text-2xl md:text-4xl font-light text-foreground leading-[1.3] italic mb-8">"{sjekkContent.intro}"</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed">{sjekkContent.intro2}</p>
        </div>
      </section>

      {/* REASONS — kapittel 01 */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/20">01</p></div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">Kapittel 01</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Hvorfor ta en sjekk</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {sjekkReasons.map((r) => (
              <article key={r.n} className="border-t border-foreground/30 pt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-3">{r.n}</p>
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-3">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{r.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FLOW — kapittel 02 */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/15">02</p></div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">Kapittel 02</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Slik foregår det</h2>
            </div>
          </div>
          <div className="space-y-10">
            {sjekkFlow.map((s) => (
              <div key={s.n} className="grid grid-cols-12 gap-6 md:gap-10 items-start border-t border-border/60 pt-8">
                <div className="col-span-2 md:col-span-1"><p className="text-2xl font-light text-foreground/40">{s.n}</p></div>
                <h3 className="col-span-10 md:col-span-4 text-xl md:text-2xl font-light text-foreground">{s.title}</h3>
                <p className="col-span-12 md:col-span-7 text-base text-muted-foreground font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS — kapittel 03 */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/20">03</p></div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">Kapittel 03</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Spesialistene</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {fertilitySpecialists.map((s) => <DemoSpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </div>
      </section>

      {/* RELATED — kapittel 04 */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/15">04</p></div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-4">Kapittel 04</p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Hva skjer etterpå</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {sjekkRelated.map((r) => (
              <Link key={r.title} to={r.href} className="group block border-t border-foreground/30 pt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-3">{r.eyebrow}</p>
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-4">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">{r.desc}</p>
                <span className="text-sm font-light text-foreground underline underline-offset-4">Les mer →</span>
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
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-6">{sjekkContent.ctaDescription}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/60 font-light mb-10">
            <Star className="w-3 h-3 fill-current" strokeWidth={0} /> {sjekkContent.ratingLine}
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12" onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}>
            Bestill sjekk <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default SjekkMagasin;
