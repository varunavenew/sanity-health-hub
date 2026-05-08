import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Bot } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadPopup } from "@/components/LeadPopup";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import urologiHero from "@/assets/categories/urologi.jpg";

interface Props {
  isChatOpen: boolean;
}

const entryPoints = [
  {
    label: "Mann med plager i underlivet",
    body:
      "Prostataproblemer, smerter i testikler, ereksjonsproblemer, vannlatingsplager — eller noe du bare vet er der, men ikke vet hva heter. Vi hjelper deg finne svar.",
    cta: "Se behandlinger for menn",
    href: "#behandlinger",
  },
  {
    label: "Kvinne med urologiske plager",
    body:
      "Urinlekkasje, hyppig vannlating, blæreinfeksjoner, blod i urinen — urologi gjelder ikke bare menn. Vi utreder og behandler kvinner like grundig.",
    cta: "Se behandlinger for kvinner",
    href: "#behandlinger",
  },
  {
    label: "Prostatasjekk",
    body:
      "Vi anbefaler alle menn over 50 å ta en prostatasjekk — eller tidligere ved symptomer, forhøyet PSA eller arvelighet. Rask og grundig utredning uten ventetid.",
    cta: "Bestill prostatasjekk",
    href: "/booking?kategori=urologi",
  },
  {
    label: "Sterilisering",
    body:
      "Sterilisering (vasektomi) er den sikreste prevensjonsmetoden og et enkelt inngrep. Vi gjennomfører konsultasjon og inngrep raskt, med kort restitusjon.",
    cta: "Les om sterilisering",
    href: "#behandlinger",
  },
];

const treatmentGroups = [
  {
    label: "Prostata og urinveier",
    items: [
      "Prostatasjekk og utredning",
      "Forstørret prostata",
      "Prostatakreft",
      "Blære og urinveier",
      "Urinlekkasje og inkontinens",
      "Nyrer",
    ],
  },
  {
    label: "Testikler og pung",
    items: ["Kul eller hevelse i pungen", "Smerter i testiklene", "Varicocele"],
  },
  {
    label: "Penis og forhud",
    items: [
      "Trang forhud (fimose)",
      "Skjev penis",
      "Ereksjonsproblemer",
      "Lavt testosteronnivå",
    ],
  },
  {
    label: "Kirurgiske inngrep",
    items: [
      "Sterilisering (vasektomi)",
      "Refertilisering",
      "Mannlig infertilitet",
      "Robotassistert kirurgi",
    ],
  },
];

const journey = [
  {
    label: "Steg 01",
    title: "Bestill når det passer deg",
    body:
      "Online booking døgnet rundt. Ingen fastlege, ingen ventetid. Du kan velge klinikk og tid som passer for deg.",
  },
  {
    label: "Steg 02",
    title: "Samtalen som rekker",
    body:
      "Du møter en urolog som utelukkende jobber med det du trenger hjelp med. Vi tar oss tid til historikk, plager og hva du ønsker svar på — uten hastverk.",
  },
  {
    label: "Steg 03",
    title: "Utredning og plan",
    body:
      "Trygg klinisk undersøkelse og en konkret plan — på et språk du forstår. Trenger du prøver, ultralyd eller videre utredning, ordner vi det samme dag der det er mulig.",
  },
  {
    label: "Steg 04",
    title: "Tverrfaglig oppfølging",
    body:
      "Ved behov samarbeider urologen med gynekolog, fertilitetsspesialist, psykolog, ernæringsfysiolog og sexolog — alt under samme tak.",
  },
];

const faqs = [
  {
    q: "Henvisning",
    a: "Du trenger ingen henvisning fra fastlege for å bestille time hos oss. Du bestiller direkte, og vi tar det derfra.",
  },
  {
    q: "Ventetid",
    a: "Vi har ingen ventetid. Du kan vanligvis få time innen få dager etter at du tar kontakt.",
  },
  {
    q: "Sykemelding",
    a: "Spesialistene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen.",
  },
  {
    q: "Utredning",
    a: "En vanlig utredning hos oss varer ca. 30 minutter. Prøver og ultralyd kan ofte tas samme dag.",
  },
  {
    q: "Forsikring",
    a: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg.",
  },
];

const UrologiPage = ({ isChatOpen }: Props) => {
  const navigate = useNavigate();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Urologi – Ingen ventetid, ingen henvisning | CMedical"
        description="Nordens ledende urologer. Eneste private aktør i Norge med robotassisterte operasjoner. Ingen ventetid, ingen henvisning."
        canonical="/urologi"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Urologi", path: "/urologi" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalSpecialty",
          name: "Urologi",
          provider: { "@type": "MedicalClinic", name: "CMedical" },
        }}
      />

      {/* 1 ── HERO ── split, lys venstre, bilde høyre */}
      <header className="bg-brand-light text-foreground">
        <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[460px] md:min-h-[560px]">
          <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-6">
              Ingen ventetid · Ingen henvisning
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-7 max-w-xl text-foreground">
              Plager i underlivet er vanligere enn du tror.
            </h1>
            <p className="text-base md:text-[17px] text-muted-foreground font-light leading-relaxed max-w-lg mb-9">
              CMedical er eneste private aktør i Norge som tilbyr robot­operasjoner.
              Våre urologer er noen av Nordens fremste — og en erfaren urolog er
              tilgjengelig hver dag.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=urologi")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-foreground/30 text-foreground hover:bg-foreground/10 rounded-2xl"
                onClick={() => navigate("/kontakt")}
              >
                <Phone className="mr-2 w-4 h-4" />
                Kontakt oss
              </Button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 min-h-[280px] md:min-h-0">
            <img
              src={urologiHero}
              alt="Urologi hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 2 ── INTRO ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-5">
            Urologi
          </p>
          <p className="text-lg md:text-xl text-foreground/85 font-light leading-relaxed">
            Urologi omhandler plager knyttet til mannens underliv og urinorganer
            hos begge kjønn — penis, prostata, testikler, urinblære og nyrer. Hos
            oss møter du flere av Nordens ledende spesialister, med spiss­kompetanse
            på ulike undergrupper av sykdommer.
          </p>
        </div>
      </section>

      {/* 3 ── FINN DIN INNGANG ── 4 entry-point cards */}
      <section className="bg-brand-warm py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Finn din inngang
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Hva kan vi hjelpe deg med
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {entryPoints.map((ep) => (
              <div
                key={ep.label}
                className="bg-background p-8 md:p-10 flex flex-col"
              >
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-4 leading-snug">
                  {ep.label}
                </h3>
                <p className="text-sm md:text-[15px] text-muted-foreground font-light leading-relaxed mb-6 flex-1">
                  {ep.body}
                </p>
                {ep.href.startsWith("/") ? (
                  <Link
                    to={ep.href}
                    className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-3 transition-all w-fit border-b border-foreground/40 pb-1"
                  >
                    {ep.cta}
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                ) : (
                  <a
                    href={ep.href}
                    className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-3 transition-all w-fit border-b border-foreground/40 pb-1"
                  >
                    {ep.cta}
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 ── HVA VI BEHANDLER ── 4 column lists */}
      <section id="behandlinger" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Alt under samme tak
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Hva vi behandler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {treatmentGroups.map((g) => (
              <div key={g.label}>
                <h3 className="text-base font-light text-foreground mb-5 pb-3 border-b border-border/60">
                  {g.label}
                </h3>
                <ul className="space-y-3">
                  {g.items.map((t) => (
                    <li
                      key={t}
                      className="text-sm font-light text-muted-foreground leading-relaxed"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ── ROBOT-STAT STRIPE ── kort, fokusert dark band */}
      <section className="bg-brand-dark text-foreground py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/60 font-light mb-5 inline-flex items-center gap-2">
                <Bot className="w-3.5 h-3.5" strokeWidth={1.5} />
                Norges ledende
              </p>
              <h2 className="text-3xl md:text-4xl font-light leading-[1.15] mb-4">
                Robotassistert kirurgi — mer presis, mer skånsom.
              </h2>
              <p className="text-sm md:text-base text-foreground/70 font-light leading-relaxed">
                Vi tilbyr robot­assistert kirurgi på prostata (kreft og godartet
                forstørrelse), brokk, urinblære­utposninger og nyreinngrep. Det
                betyr kortere operasjonstid og raskere restitusjon for deg.
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-6xl md:text-7xl font-light leading-none text-brand-yellow mb-2">
                400+
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 font-light">
                robot­operasjoner i året
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 ── PASIENTREISEN ── numbered horizontal list */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Slik går det for seg
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Pasientreisen, fortalt enkelt
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {journey.map((step) => (
              <div key={step.label} className="bg-brand-warm p-7 md:p-9 flex flex-col">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                  {step.label}
                </p>
                <h3 className="text-lg md:text-xl font-light text-foreground leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 ── SPESIALISTENE ── filterable horizontal scroll */}
      <SpecialistsScroller category="urologi" eyebrow="Menneskene bak" title="Urologene som følger deg." seeAllHref="/spesialister?kategori=urologi" seeAllLabel="Se alle urologer" />

      {/* 8 ── REVIEWS ── */}
      <CategoryReviews categoryId="urologi" categoryTitle="urologi" />

      {/* 9 ── FAQ ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
            Vanlige spørsmål
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`u-${i}`}>
                <AccordionTrigger className="text-left font-light text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 10 ── CLOSING CTA ── */}
      <section className="bg-brand-light py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-5">
                Klar når du er det
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-5 text-foreground">
                Bestill urologtime — eller en gratis prat først.
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Vi sender bekreftelse og forberedelser direkte til deg. Du kan
                også ta en gratis og uforpliktende prat med en av sykepleierne våre.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=urologi")}
              >
                Bestill urologtime
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Link
                to="/priser"
                className="text-center text-sm font-light text-muted-foreground hover:text-foreground underline underline-offset-4 mt-2"
              >
                Se prisliste
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LeadPopup />
    </PageLayout>
  );
};

export default UrologiPage;
