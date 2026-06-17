import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  sjekkContent, sjekkFlow, sjekkReasons, sjekkRelated, sjekkFaqs,
} from "./fertilitetContent";
import { fertilitetImages } from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const SjekkEditorial = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitetssjekk · Editorial | CMedical";
  }, []);

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
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] tracking-tight">
                Forstå <em className="italic font-light">fruktbarheten</em> din.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {sjekkContent.heroLead}
              </p>
              <div className="flex items-center gap-4 mt-8">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}
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
          </div>
        </div>
      </section>

      {/* Wide image */}
      <section className="bg-brand-warm">
        <div className="w-full h-[55vh] min-h-[420px] overflow-hidden">
          <img
            src={fertilitetImages.alt}
            alt="Fertilitetssjekk hos CMedical"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
      </section>

      {/* Intro */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6]">
            {sjekkContent.intro}
          </p>
        </div>
      </section>

      {/* Innholdet i sjekken — chapters */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Det vi kartlegger — og hva det betyr for deg
            </h2>
          </div>

          <div className="space-y-12 md:space-y-14">
            {sjekkFlow.map((step) => (
              <article
                key={step.n}
                className="grid grid-cols-12 gap-6 md:gap-10 items-start border-t border-border/60 pt-10"
              >
                <div className="col-span-12 md:col-span-2">
                  <p className="text-7xl md:text-8xl font-light text-foreground/15 leading-none">
                    {step.n}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="text-2xl md:text-3xl font-light text-foreground mb-4 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem er sjekken for */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              En sjekk gir deg svar — ikke nødvendigvis problemer
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {sjekkReasons.map((r) => (
              <li key={r.n} className="bg-background p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-light text-foreground leading-snug mb-3">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {r.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Veien videre */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Hvis du vil ta et steg til
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sjekkRelated.map((r) => (
              <Link
                key={r.title}
                to={r.href}
                className="group block bg-card border border-border/60 rounded-2xl p-7 md:p-8 hover:border-foreground/40 transition-all"
              >
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-3">{r.title}</h3>
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

      {/* Closing CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Klar til å finne ut hvor du står?
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Bestill fertilitetssjekk direkte — ingen ventetid, ingen henvisning. Eller ta en gratis
            og uforpliktende prat med sykepleier om du er usikker på hva du trenger.
          </p>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}
          >
            Bestill fertilitetssjekk
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default SjekkEditorial;
