import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Calendar, MessageCircle, Microscope, HeartHandshake,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import {
  fertilitetContent,
  fertilitetImages,
  fertilitetServices,
  fertilitetServiceGroups,
  fertilitetFaqs,
} from "./fertilitetContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

const journey = [
  {
    icon: Calendar,
    label: "Steg 01",
    title: "Bestill når det passer deg",
    body: "Online booking døgnet rundt. Ingen henvisning. De fleste får time samme uke.",
  },
  {
    icon: MessageCircle,
    label: "Steg 02",
    title: "Samtalen og kartleggingen",
    body: "Du møter en fertilitetsspesialist som tar seg tid. Vi går gjennom historikk, hormoner, ultralyd — og det dere lurer på.",
  },
  {
    icon: Microscope,
    label: "Steg 03",
    title: "Behandling i samme bygg",
    body: "Klinikk og laboratorium under samme tak. Ingen transport av egg eller embryo, og samme team gjennom hele forløpet.",
  },
  {
    icon: HeartHandshake,
    label: "Steg 04",
    title: "Oppfølging — også etterpå",
    body: "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene. Psykolog er en del av tilbudet.",
  },
];

const FertilitetJourney = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitet · Reisen | CMedical";
  }, []);

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 4),
    []
  );

  const groupsWithServices = useMemo(
    () =>
      fertilitetServiceGroups.map((g) => ({
        label: g.label,
        services: fertilitetServices.filter((s) => g.serviceNames.includes(s.name)),
      })),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden">
        <img
          src={fertilitetImages.hero}
          alt={fertilitetContent.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/25 to-brand-dark/45" />

        <div className="absolute top-24 md:top-28 left-0 right-0">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <Link
              to="/fertilitet-design"
              className="inline-flex items-center gap-2 text-xs text-white/85 hover:text-white font-light transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Tilbake til alle forslag
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight max-w-4xl mb-8">
              Noen ganger trenger kroppen <em className="italic font-light">litt hjelp</em> på veien.
            </h1>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-6 h-11"
              onClick={() => (window.location.href = "/booking?kategori=fertilitet")}
            >
              Bestill konsultasjon
              <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6] mb-6">
            {fertilitetContent.heroLead}
          </p>
          <p className="text-lg md:text-xl font-light text-foreground leading-[1.6]">
            {fertilitetContent.intro}
          </p>
        </div>
      </section>

      {/* Patient journey */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Fra første samtale til graviditetstest
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="bg-background p-8 md:p-10 flex flex-col">
                  <Icon className="w-6 h-6 text-foreground mb-8" strokeWidth={1.5} />
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

      {/* Tjenester */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 md:mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Tjenestene som hører reisen til
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {groupsWithServices.map((group) => (
              <div
                key={group.label}
                className="bg-card border border-border/60 rounded-2xl p-7 md:p-8"
              >
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-6">
                  {group.label}
                </h3>
                <ul className="space-y-3">
                  {group.services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.name}>
                        <Link
                          to={s.href}
                          className="flex items-center gap-3 text-sm font-light text-foreground/85 hover:text-foreground group"
                        >
                          <Icon className="w-4 h-4 text-foreground/60 flex-shrink-0" strokeWidth={1.5} />
                          <span className="flex-1">{s.name}</span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth={1.5}
                          />
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

      {/* Specialists */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Spesialistene som følger deg
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {fertilitySpecialists.map((s) => (
              <Link key={s.slug} to={`/spesialister/${s.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-4">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <h3 className="text-base font-light text-foreground mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground font-light">
                  {s.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryReviews categoryId="fertilitet" categoryTitle="Fertilitet" />

      {/* FAQ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {fertilitetFaqs.map((faq, i) => (
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
                Booking tar to minutter. Ingen henvisning. Vi sender bekreftelse og forberedelser
                direkte til deg.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light h-12"
                onClick={() => (window.location.href = "/booking?kategori=fertilitet")}
              >
                Bestill konsultasjon
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

export default FertilitetJourney;
