import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadPopup } from "@/components/LeadPopup";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { getIcon } from "@/lib/icons";
import ortopediHero from "@/assets/categories/ortopedi.jpg";
import ortopediReal from "@/assets/categories/ortopedi-real.jpg";

interface Props {
  isChatOpen: boolean;
}

const bodyParts = [
  {
    label: "Skulder",
    body: "Inneklemming, kalkavleiringer, seneskader, ustabil skulder",
    icon: "skulder-cl",
  },
  {
    label: "Kne",
    body: "Korsbånd, menisk, slitasjegikt, bruskskader",
    icon: "kne-cl",
  },
  {
    label: "Hofte",
    body: "Hofteslitasje, labrumskade, fotballbrokk",
    icon: "hofte-cl",
  },
  {
    label: "Hånd og albue",
    body: "Karpaltunnel, tennisalbue, Dupuytren, springfinger",
    icon: "hand-albue-cl",
  },
  {
    label: "Fot og ankel",
    body: "Hælspore, fotslitasje, ankelbåndskader",
    icon: "fot-ankel-cl",
  },
  {
    label: "Rygg og nakke",
    body: "Skiveprolaps, spinalstenose, nakkeplager",
    icon: "ortopedi-cl",
  },
  {
    label: "Injeksjoner",
    body: "Kortison, hyaluronsyre, blodspinningsteknikk (PRP)",
    icon: "ortopedi-cl",
  },
];

const treatmentGroups = [
  {
    label: "Skulder",
    items: [
      "Inneklemming (impingement)",
      "Kalkavleiringer",
      "Rotatormansjettskader",
      "Ustabil skulder",
      "Frossen skulder",
    ],
  },
  {
    label: "Kne og hofte",
    items: [
      "Korsbåndruptur",
      "Meniskskader",
      "Kneslitasje",
      "Hofteslitasje",
      "Labrumskade",
    ],
  },
  {
    label: "Hånd, albue og fot",
    items: [
      "Karpaltunnelsyndrom",
      "Tennisalbue og golfalbue",
      "Dupuytrens kontraktur",
      "Hælspore og hælsmerter",
      "Ankelbåndskader",
    ],
  },
  {
    label: "Behandlingsformer",
    items: [
      "Ortopedisk kirurgi",
      "Artroskopi",
      "Kortisoninjeksjoner",
      "Blodspinningsteknikk (PRP)",
      "Hyaluronsyre",
    ],
  },
];

const journey = [
  {
    label: "Steg 01",
    title: "Bestill når det passer deg",
    body:
      "Online booking døgnet rundt. Ingen fastlege, ingen ventetid. Velg kroppsdel og klinikk — vi matcher deg med riktig spesialist.",
  },
  {
    label: "Steg 02",
    title: "Samtalen som rekker",
    body:
      "Du møter en ortoped som jobber med nettopp ditt område. Vi tar historikk, ser på bilder og gjør en grundig klinisk undersøkelse.",
  },
  {
    label: "Steg 03",
    title: "Diagnose og plan",
    body:
      "Du forlater konsultasjonen med en klar diagnose og en konkret plan — hva som er galt, hva vi anbefaler, og hva som skjer videre.",
  },
  {
    label: "Steg 04",
    title: "Tverrfaglig oppfølging",
    body:
      "Ved behov samarbeider ortopeden med fysioterapeut, manuellterapeut, osteopat og ernæringsfysiolog — alt under samme tak.",
  },
];

const faqs = [
  {
    q: "Henvisning",
    a: "Du trenger ingen henvisning. Du bestiller direkte hos oss — men husk å ta med bilder fra røntgen, CT eller MR om du har det.",
  },
  {
    q: "Ventetid",
    a: "Vi har ingen ventetid. Du kan vanligvis få time innen få dager.",
  },
  {
    q: "Sykemelding",
    a: "Ortopedene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen.",
  },
  {
    q: "Utredning",
    a: "En vanlig ortopedisk konsultasjon varer ca. 30 minutter. Vi kan ofte bestille MR eller røntgen samme dag.",
  },
  {
    q: "Forsikring",
    a: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg.",
  },
];

const OrtopediPage = ({ isChatOpen }: Props) => {
  const navigate = useNavigate();
  const { specialists } = useSpecialistsData();

  const teamSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "ortopedi").slice(0, 4),
    [specialists]
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Ortopedi – Skulder, kne, hofte, hånd og fot | CMedical"
        description="Noen av landets fremste ortopeder. Ingen ventetid, ingen henvisning. Diagnose og plan på første konsultasjon — også second opinion."
        canonical="/ortopedi"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Ortopedi", path: "/ortopedi" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalSpecialty",
          name: "Ortopedi",
          provider: { "@type": "MedicalClinic", name: "CMedical" },
        }}
      />

      {/* 1 ── HERO ── light split, image-left */}
      <header className="bg-brand-warm">
        <div className="grid md:grid-cols-2 min-h-[440px] md:min-h-[560px]">
          <div className="relative min-h-[280px] md:min-h-0">
            <img
              src={ortopediHero}
              alt="Ortopedi hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-6">
              Ingen ventetid · Ingen henvisning
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-7 max-w-xl">
              Det gjør vondt. La oss finne ut hvorfor.
            </h1>
            <p className="text-base md:text-[17px] text-foreground/75 font-light leading-relaxed max-w-lg mb-9">
              Våre ortopeder er eksperter på skader og sykdommer i muskler, bein,
              ledd og sener. Noen av landets fremste kirurger jobber hos oss —
              også med second opinion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=ortopedi")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-foreground/30 text-foreground hover:bg-brand-dark hover:text-foreground hover:border-brand-dark rounded-2xl"
                onClick={() => navigate("/kontakt")}
              >
                <Phone className="mr-2 w-4 h-4" />
                Kontakt oss
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 2 ── INTRO ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-5">
            Ortopedi
          </p>
          <p className="text-lg md:text-xl text-foreground/85 font-light leading-relaxed">
            Ortopedi tar seg av problemer med muskler, bein, ledd og sener. Hos
            oss jobber noen av landets fremste kirurger med avanserte caser —
            inkludert second opinion for pasienter som ikke har fått hjelp andre
            steder.
          </p>
        </div>
      </section>

      {/* 3 ── VELG KROPPSDEL ── 7-tile picker */}
      <section className="bg-brand-warm py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Finn din inngang
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Velg kroppsdel — vi finner riktig spesialist
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {bodyParts.map((bp) => {
              const Icon = getIcon(bp.icon);
              return (
                <a
                  key={bp.label}
                  href="#behandlinger"
                  className="bg-background p-6 md:p-7 flex flex-col group hover:bg-card transition-colors"
                >
                  <Icon className="w-5 h-5 text-foreground/70 mb-5" strokeWidth={1.5} />
                  <h3 className="text-base md:text-lg font-light text-foreground mb-2">
                    {bp.label}
                  </h3>
                  <p className="text-xs md:text-[13px] text-muted-foreground font-light leading-relaxed mb-5 flex-1">
                    {bp.body}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-light text-foreground/80 group-hover:gap-2.5 transition-all">
                    Se behandlinger
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                </a>
              );
            })}
            {/* Second opinion as 8th tile */}
            <a
              href="#second-opinion"
              className="bg-brand-dark text-foreground p-6 md:p-7 flex flex-col group"
            >
              <Sparkles className="w-5 h-5 text-brand-yellow mb-5" strokeWidth={1.5} />
              <h3 className="text-base md:text-lg font-light mb-2">Second opinion</h3>
              <p className="text-xs md:text-[13px] text-foreground/70 font-light leading-relaxed mb-5 flex-1">
                Har du fått en diagnose du er usikker på? Vi ser på den med nye øyne.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-light text-brand-yellow group-hover:gap-2.5 transition-all">
                Les mer
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 4 ── TWO ENTRY DIALOGUE BOXES ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Vet du ikke hva det heter?
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Du trenger ikke en diagnose for å bestille
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-brand-warm rounded-2xl p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-light text-foreground mb-4 leading-snug">
                Jeg har vondt — men vet ikke hva det er
              </h3>
              <p className="text-sm md:text-[15px] text-muted-foreground font-light leading-relaxed mb-6">
                Start med en generell ortopedisk konsultasjon. Spesialisten
                undersøker deg, stiller diagnose og legger en plan — på et språk
                du forstår.
              </p>
              <Button
                variant="ghost"
                className="border border-foreground/30 text-foreground hover:bg-brand-dark hover:text-foreground hover:border-brand-dark rounded-2xl"
                onClick={() => navigate("/booking?kategori=ortopedi")}
              >
                Ortopedisk konsultasjon
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
            <div
              id="second-opinion"
              className="bg-brand-warm rounded-2xl p-8 md:p-10"
            >
              <h3 className="text-xl md:text-2xl font-light text-foreground mb-4 leading-snug">
                Jeg har fått en diagnose, men er ikke fornøyd
              </h3>
              <p className="text-sm md:text-[15px] text-muted-foreground font-light leading-relaxed mb-6">
                Second opinion hos CMedical. Vi får ofte pasienter med
                kompliserte skader og caser der andre ikke har funnet løsningen.
                Vi ser på det med nye øyne.
              </p>
              <Button
                variant="cta"
                onClick={() => navigate("/booking?kategori=ortopedi")}
              >
                Bestill second opinion
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 ── HVA VI BEHANDLER ── */}
      <section id="behandlinger" className="bg-brand-warm py-16 md:py-24">
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

      {/* 6 ── PASIENTREISEN ── */}
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

      {/* 7 ── SPESIALISTENE ── */}
      {teamSpecialists.length > 0 && (
        <section className="bg-brand-warm pt-16 md:pt-20">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <div className="mb-10 md:mb-14 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
                Møt teamet
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
                Spesialistene som følger deg
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {teamSpecialists.map((s) => (
              <Link
                key={s.slug}
                to={`/spesialister/${s.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden bg-muted"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <h3 className="text-base md:text-lg font-light text-foreground mb-0.5">
                    {s.name}
                  </h3>
                  <p className="text-[11px] md:text-xs text-foreground/80 font-light uppercase tracking-wider">
                    {s.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8 ── REVIEWS ── */}
      <CategoryReviews categoryId="ortopedi" categoryTitle="ortopedi" />

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
              <AccordionItem key={i} value={`o-${i}`}>
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
                Bestill ortopedtime — bilder kommer godt med.
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Vi sender bekreftelse og forberedelser direkte til deg. Husk å ta
                med bilder fra røntgen, CT eller MR om du har det.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=ortopedi")}
              >
                Bestill ortopedtime
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

export default OrtopediPage;
