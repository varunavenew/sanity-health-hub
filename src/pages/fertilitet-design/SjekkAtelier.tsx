import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  sjekkContent, sjekkFlow, sjekkReasons, sjekkRelated, sjekkFaqs,
  fertilitetImages,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const facts = [
  { k: "Varighet", v: "45–60 min" },
  { k: "Inkludert", v: "Blodprøve, ultralyd, samtale" },
  { k: "Henvisning", v: "Ikke nødvendig" },
  { k: "Svar", v: "Innen kort tid" },
];

const SjekkAtelier = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitetssjekk · Atelier | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-background pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/fertilitet-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle forslag
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-background pt-12 md:pt-16 pb-20 md:pb-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-7">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-10">
                <span className="w-8 h-px bg-foreground/30" />
                <span>{sjekkContent.title} · CMedical</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light text-foreground leading-[0.98] tracking-tight mb-10">
                Forstå <br />
                <span className="text-foreground/40">fruktbarheten din.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                {sjekkContent.heroLead}
              </p>
              <div className="flex items-center gap-4 mt-10">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() =>
                    (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")
                  }
                >
                  Bestill fertilitetssjekk
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

            {/* Faktablokk */}
            <aside className="col-span-12 md:col-span-5 md:pl-8 md:border-l border-border/60">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">
                Det praktiske
              </p>
              <dl className="space-y-5">
                {facts.map((f) => (
                  <div key={f.k} className="flex items-baseline justify-between gap-6 border-b border-border/60 pb-4">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light">
                      {f.k}
                    </dt>
                    <dd className="text-base font-light text-foreground text-right">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.55]">
            {sjekkContent.intro}
          </p>
        </div>
      </section>

      {/* Innholdet i sjekken — 2-kolonne tabell-look */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-14 md:mb-16 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Innholdet i sjekken
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
                Seks målepunkter — <br /> ett samlet bilde
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Hver komponent i sjekken har en konkret hensikt. Sammen gir de spesialisten et
                tydelig bilde av hvor du står — og hva som eventuelt bør følges opp.
              </p>
            </div>
          </div>

          <div className="border-t border-border/60">
            {sjekkFlow.map((step) => (
              <article
                key={step.n}
                className="grid grid-cols-12 gap-6 md:gap-10 border-b border-border/60 py-8 md:py-10"
              >
                <div className="col-span-12 md:col-span-1 text-xs font-light text-muted-foreground tracking-widest pt-2">
                  {step.n}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="text-xl md:text-2xl font-light text-foreground leading-snug">
                    {step.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem er sjekken for — sjekkliste */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Hvem er sjekken for
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Kjenner du deg igjen i én av disse?
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
            {sjekkReasons.map((r) => (
              <li key={r.n} className="flex items-start gap-4 border-b border-border/60 pb-6">
                <Check className="w-4 h-4 text-foreground mt-1.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-base md:text-lg font-light text-foreground leading-snug mb-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Image break */}
      <section className="bg-background">
        <div className="w-full h-[40vh] min-h-[320px] overflow-hidden">
          <img
            src={fertilitetImages.lab}
            alt="Fertilitetssjekk hos CMedical"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Veien videre */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Veien videre
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Hvis du vil ta et steg til
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border/60">
            {sjekkRelated.map((r) => (
              <Link
                key={r.title}
                to={r.href}
                className="group block border-b md:border-b-0 md:border-r border-border/60 last:border-r-0 p-7 md:p-8 hover:bg-muted/30 transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                  {r.eyebrow}
                </p>
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-3 leading-snug">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                  {r.desc}
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

      {/* FAQ */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
            Vanlige spørsmål
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {sjekkFaqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Klar til å finne ut hvor du står?
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Bestill fertilitetssjekk direkte — ingen ventetid, ingen henvisning.
          </p>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12"
            onClick={() =>
              (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")
            }
          >
            Bestill fertilitetssjekk
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default SjekkAtelier;
