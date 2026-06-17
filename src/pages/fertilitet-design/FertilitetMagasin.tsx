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
  fertilitetContent, fertilitetImages, fertilitetAudiences, fertilitetSegments,
  fertilitetServices, fertilitetServiceGroups, fertilitetWhySteps, fertilitetReviews,
  fertilitetFaqs,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const FertilitetMagasin = ({ isChatOpen }: PageProps) => {
  useEffect(() => { document.title = "Fertilitet · Magasin | CMedical"; }, []);

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 6),
    []
  );

  const groups = useMemo(
    () => fertilitetServiceGroups.map((g) => ({
      label: g.label,
      services: fertilitetServices.filter((s) => g.serviceNames.includes(s.name)),
    })),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link to="/fertilitet-design" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-light">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* SPLIT HERO – magasin */}
      <section className="bg-brand-warm pt-8 pb-0">
        <div className="flex flex-col lg:flex-row lg:h-[78vh] lg:min-h-[600px]">
          <div className="lg:w-3/5 h-[45vh] lg:h-full relative">
            <img src={fertilitetImages.hero} alt="Fertilitet" className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
            <div className="absolute top-6 left-6 md:top-10 md:left-10 text-white/90 text-xs font-light drop-shadow">
              Utgave 01 · Fertilitet
            </div>
          </div>
          <div className="lg:w-2/5 relative bg-brand-warm flex flex-col justify-between p-8 md:p-14">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-light mb-10">
                <span>Innhold</span>
                <span>{new Date().getFullYear()}</span>
              </div>
              <ol className="space-y-3 text-sm font-light text-foreground/80 mb-12">
                <li className="flex justify-between border-b border-border/40 pb-2"><span>01 — Hvem er det for</span><span className="text-muted-foreground">s. 02</span></li>
                <li className="flex justify-between border-b border-border/40 pb-2"><span>02 — Reisen</span><span className="text-muted-foreground">s. 03</span></li>
                <li className="flex justify-between border-b border-border/40 pb-2"><span>03 — Spesialistene</span><span className="text-muted-foreground">s. 04</span></li>
                <li className="flex justify-between border-b border-border/40 pb-2"><span>04 — Behandlingene</span><span className="text-muted-foreground">s. 05</span></li>
                <li className="flex justify-between"><span>05 — Stemmer fra pasienter</span><span className="text-muted-foreground">s. 06</span></li>
              </ol>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight mb-6 italic">
                {fertilitetContent.heroHeadline}
              </h1>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">{fertilitetContent.heroLead}</p>
              <div className="flex items-center gap-4">
                <Button className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
                  Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
                  <Star className="w-3 h-3 fill-current" strokeWidth={0} /> 4,7 / 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl">
          <p className="text-2xl md:text-4xl font-light text-foreground leading-[1.3] italic">
            "{fertilitetContent.intro}"
          </p>
        </div>
      </section>

      {/* AUDIENCES — kapittel 01 */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/20">01</p></div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Hvem er det for</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {fertilitetAudiences.map((a, i) => (
              <article key={a.title} className="border-t border-foreground/30 pt-6">
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-4">{a.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">{a.desc}</p>
                <Link to={a.href} className="text-sm font-light text-foreground underline underline-offset-4 hover:text-brand-dark">Bestill →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY STEPS — kapittel 02 */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/15">02</p></div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Reisen</h2>
            </div>
          </div>
          <div className="space-y-12">
            {fertilitetWhySteps.map((w, i) => (
              <div key={w.n} className="grid grid-cols-12 gap-6 md:gap-10 items-start border-t border-border/60 pt-8">
                <div className="col-span-2 md:col-span-1"><p className="text-2xl font-light text-foreground/40">{w.n}</p></div>
                <h3 className="col-span-10 md:col-span-4 text-xl md:text-2xl font-light text-foreground">{w.title}</h3>
                <p className="col-span-12 md:col-span-7 text-base text-muted-foreground font-light leading-relaxed">{w.desc}</p>
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
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Spesialistene</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {fertilitySpecialists.map((s) => <DemoSpecialistCard key={s.slug} specialist={s} />)}
          </div>
        </div>
      </section>

      {/* SERVICES — kapittel 04 */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/15">04</p></div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Behandlingene</h2>
            </div>
          </div>
          <div className="space-y-14">
            {groups.map((g, i) => (
              <div key={g.label}>
                <div className="flex items-baseline gap-6 mb-6">
                  <p className="text-5xl font-light text-foreground/15">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-xl md:text-2xl font-light text-foreground">{g.label}</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {g.services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.name}>
                        <Link to={s.href} className="flex items-start gap-4 p-5 border border-border/60 rounded-2xl hover:border-foreground/40 transition-colors">
                          <Icon className="w-5 h-5 text-foreground/70 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                          <div className="flex-1">
                            <p className="text-base font-light text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground font-light mt-1">{s.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground mt-1.5" strokeWidth={1.5} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGMENTS as side notes */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-12 max-w-3xl">Tre vanlige veier inn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fertilitetSegments.slice(0, 3).map((s) => (
              <Link key={s.id} to={s.href} className="group block bg-background border border-border/40 rounded-2xl p-7 hover:border-foreground/40 transition-all">
                <h3 className="text-lg font-light text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">{s.desc}</p>
                <span className="text-sm font-light text-foreground underline underline-offset-4">{s.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PATIENT VOICES */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14">
            <div className="col-span-12 md:col-span-3"><p className="text-7xl font-light text-foreground/15">05</p></div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">Stemmer fra pasienter</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {fertilitetReviews.map((r) => (
              <blockquote key={r.author} className="border-l-2 border-foreground/30 pl-6">
                <p className="text-base font-light text-foreground italic leading-relaxed mb-6">"{r.text}"</p>
                <footer className="text-xs text-muted-foreground font-light">— {r.author} · {r.date}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
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
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">Klar for å lese videre — sammen med oss?</h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">Bestill en konsultasjon eller en uforpliktende samtale med sykepleier.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12" onClick={() => (window.location.href = "/booking?kategori=fertilitet")}>
            Bestill time <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default FertilitetMagasin;
