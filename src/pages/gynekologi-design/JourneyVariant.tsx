import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Clock, Calendar, MessageCircle, HeartHandshake } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { specialists } from "@/data/specialists";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";

interface PageProps { isChatOpen: boolean }

const journey = [
  {
    icon: Calendar,
    label: "Steg 01",
    title: "Bestill når det passer deg",
    body: "Online booking døgnet rundt. Ingen henvisning. De fleste får time innen 1–3 dager.",
  },
  {
    icon: MessageCircle,
    label: "Steg 02",
    title: "Samtalen som rekker",
    body: "30 minutter med en spesialist som lytter. Vi går gjennom historikk, plager og hva du ønsker hjelp med.",
  },
  {
    icon: HeartHandshake,
    label: "Steg 03",
    title: "Undersøkelse og plan",
    body: "Trygg klinisk undersøkelse, ultralyd om nødvendig, og en konkret plan – på et språk du forstår.",
  },
  {
    icon: Clock,
    label: "Steg 04",
    title: "Oppfølging som henger sammen",
    body: "Direkte tilgang til din spesialist. Tverrfaglig støtte tilgjengelig om du trenger det.",
  },
];

const stories = [
  {
    quote:
      "Jeg gikk i åtte år med smerter før noen tok det på alvor. Her ble jeg utredet på to uker.",
    name: "Maria, 31",
    topic: "Endometriose",
    image: heroFamily,
  },
  {
    quote:
      "Overgangsalderen ble plutselig en mulighet til å forstå kroppen min, ikke noe å overleve.",
    name: "Hilde, 52",
    topic: "Hormonbehandling",
    image: kvinnehelseHero,
  },
  {
    quote:
      "Trygg svangerskapsoppfølging, samme lege hver gang. Det betydde alt.",
    name: "Andrea, 29",
    topic: "Svangerskap",
    image: heroPregnancy,
  },
];

const JourneyVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Gynekologi · Reisen | CMedical";
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 4),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden">
        <img
          src={kvinnehelseHero}
          alt="Kvinnehelse hos CMedical"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-brand-dark/40" />

        <div className="absolute top-24 md:top-28 left-0 right-0">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <Link
              to="/gynekologi-design"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/80 hover:text-white font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Tilbake til alle varianter
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/80 font-light mb-6">
              Gynekologi · En reise gjennom året, livet, kroppen
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight max-w-4xl mb-8">
              Fra første time til oppfølging – samme menneske hele veien.
            </h1>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-6 h-11"
              onClick={() => (window.location.href = "/booking")}
            >
              Start din reise
              <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </section>

      {/* The journey – 4 steps */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Slik går det fram
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Pasientreisen, fortalt enkelt
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="bg-background p-8 md:p-10 flex flex-col"
                >
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

      {/* Stories */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Pasienthistorier
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Tre kvinner, tre veier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stories.map((s, i) => (
              <article
                key={i}
                className="bg-background rounded-2xl overflow-hidden border border-border/60 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-7 md:p-8 flex-1 flex flex-col">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                    {s.topic}
                  </p>
                  <p className="text-lg font-light text-foreground leading-snug mb-6 flex-1">
                    «{s.quote}»
                  </p>
                  <p className="text-sm text-muted-foreground font-light">— {s.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists – horizontal scrollable row */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Møt teamet
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Spesialistene som følger deg
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {gynSpecialists.map((s) => (
              <Link
                key={s.slug}
                to={`/spesialister/${s.slug}`}
                className="group block"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-4">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <h3 className="text-base font-light text-foreground mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground font-light uppercase tracking-wider">
                  {s.title}
                </p>
              </Link>
            ))}
          </div>
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
                Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser
                direkte til deg.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light h-12"
                onClick={() => (window.location.href = "/booking")}
              >
                Bestill gynekologtime
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

export default JourneyVariant;
