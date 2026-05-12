import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Calendar, Stethoscope, Microscope, ClipboardCheck,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  sjekkContent, sjekkFlow, sjekkReasons, sjekkRelated, sjekkFaqs, fertilitetImages,
} from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const journey = [
  {
    icon: Calendar,
    label: "Steg 01",
    title: "Bestill direkte",
    body: "Online booking — ingen henvisning, ingen ventetid. Velg tid som passer deg.",
  },
  {
    icon: Stethoscope,
    label: "Steg 02",
    title: "Klinisk undersøkelse",
    body: "Ultralyd, AFC og blodprøver. Du får tid til spørsmål og en grundig samtale.",
  },
  {
    icon: Microscope,
    label: "Steg 03",
    title: "Analyser i lab",
    body: "Hormonanalyser gjøres internt. Korte svartider — uten omveier via tredjepart.",
  },
  {
    icon: ClipboardCheck,
    label: "Steg 04",
    title: "Resultat og plan",
    body: "Spesialisten gjennomgår funnene med deg. Du sitter igjen med konkret kunnskap — og en plan om noe bør følges opp.",
  },
];

const SjekkJourney = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitetssjekk · Reisen | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden">
        <img
          src={fertilitetImages.lab}
          alt={sjekkContent.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/25 to-brand-dark/45" />

        <div className="absolute top-24 md:top-28 left-0 right-0">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <Link
              to="/fertilitet-design"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/85 hover:text-white font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Tilbake til alle forslag
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/85 font-light mb-6">
              {sjekkContent.title} · {sjekkContent.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight max-w-4xl mb-8">
              Forstå <em className="italic font-light">fruktbarheten</em> din.
            </h1>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-6 h-11"
              onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}
            >
              Bestill fertilitetssjekk
              <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6] mb-6">
            {sjekkContent.heroLead}
          </p>
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6]">
            {sjekkContent.intro}
          </p>
        </div>
      </section>

      {/* Sjekken steg for steg */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Slik foregår det
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Sjekken steg for steg
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="bg-background p-8 md:p-10 flex flex-col">
                  <Icon className="w-6 h-6 text-foreground mb-8" strokeWidth={1.5} />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                    {step.label}
                  </p>
                  <h3 className="text-xl font-light text-foreground leading-snug mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Innholdet i sjekken */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Innholdet i sjekken
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Det vi kartlegger
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {sjekkFlow.map((step) => (
              <div
                key={step.n}
                className="bg-card border border-border/60 rounded-2xl p-7 md:p-8"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                  {step.n}
                </p>
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem er sjekken for */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Hvem er sjekken for
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              En sjekk gir deg svar
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sjekkReasons.map((r) => (
              <li
                key={r.n}
                className="bg-background border border-border/60 rounded-2xl p-6 md:p-7"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                  {r.n}
                </p>
                <h3 className="text-lg font-light text-foreground leading-snug mb-3">
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
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Veien videre
            </p>
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
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                  {r.eyebrow}
                </p>
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
      <section className="bg-background py-20 md:py-28">
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

      {/* Closing booking band */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
                Klar når du er det
              </h2>
              <p className="text-base text-white/70 font-light leading-relaxed">
                Bestill fertilitetssjekken direkte. Vi sender bekreftelse og forberedelser til deg.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light h-12"
                onClick={() => (window.location.href = "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk")}
              >
                Bestill fertilitetssjekk
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Link
                to="/priser"
                className="text-center text-sm font-light text-white/70 hover:text-white underline underline-offset-4 mt-2"
              >
                Se prisliste
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SjekkJourney;
