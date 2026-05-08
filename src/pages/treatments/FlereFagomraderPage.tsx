import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadPopup } from "@/components/LeadPopup";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { getIcon } from "@/lib/icons";
import flereHero from "@/assets/categories/flere-fagomrader.jpg";

interface Props {
  isChatOpen: boolean;
}

// 3 thematic groups from the PDF
const themes = [
  {
    label: "Kropp og vev",
    body:
      "Spesialister på hud, kirurgi og karsystemet. For deg med synlige plager, operasjonsbehov eller tilstander som krever kirurgisk vurdering.",
    services: [
      { name: "Hudlege", icon: "hudlege-cl" },
      { name: "Plastikkirurgi", icon: "plastikkirurgi-cl" },
      { name: "Gastrokirurgi", icon: "gastrokirurgi-cl" },
      { name: "Karkirurgi", icon: "areknuter-cl" },
      { name: "Åreknutebehandling", icon: "areknuter-cl" },
    ],
  },
  {
    label: "Helse og balanse",
    body:
      "Spesialister på indre medisin, hormoner, ledd og kropp. For deg med systemiske plager, langvarige smerter eller hormonforstyrrelser.",
    services: [
      { name: "Ernæringsfysiolog", icon: "ernaringsfysiolog-cl" },
      { name: "Endokrinologi", icon: "endokrinologi-cl" },
      { name: "Revmatologi", icon: "revmatologi-cl" },
      { name: "Osteopati", icon: "osteopati-cl" },
      { name: "Robotkirurgi", icon: "robotkirurgi-gyn-cl" },
    ],
  },
  {
    label: "Sinn og seksualitet",
    body:
      "Spesialister på mental helse og seksuell helse. For deg som trenger et trygt og kompetent sted å snakke om det som er vanskelig å snakke om.",
    services: [
      { name: "Psykologi", icon: "psykologi-cl" },
      { name: "Sexologi", icon: "sexologi-cl" },
    ],
  },
];

// Long descriptive specialist list
const specialistList = [
  { name: "Hudlege", desc: "Eksem, psoriasis, hudkreft, akne, moleanalyse", icon: "hudlege-cl" },
  { name: "Psykologi", desc: "Angst, depresjon, relasjonsproblemer, traumer", icon: "psykologi-cl" },
  { name: "Sexologi", desc: "Seksuell helse, samliv, identitet, funksjonsplager", icon: "sexologi-cl" },
  { name: "Ernæringsfysiolog", desc: "Kosthold, vekttap, matintoleranser, sykdomsernæring", icon: "ernaringsfysiolog-cl" },
  { name: "Endokrinologi", desc: "Diabetes, skjoldbruskkjertelen, binyrer, hormoner", icon: "endokrinologi-cl" },
  { name: "Osteopati", desc: "Muskel- og skjelettsystemet, kroniske smerter", icon: "osteopati-cl" },
  { name: "Revmatologi", desc: "Leddgikt, artrose, bindevevssykdommer", icon: "revmatologi-cl" },
  { name: "Plastikkirurgi", desc: "Rekonstruksjon, korreksjon, estetisk kirurgi", icon: "plastikkirurgi-cl" },
  { name: "Gastrokirurgi", desc: "Mage, tarm, lever, galleblære", icon: "gastrokirurgi-cl" },
  { name: "Karkirurgi", desc: "Åreknuter, blodkar, sirkulasjonsplager", icon: "areknuter-cl" },
  { name: "Robotassistert kirurgi", desc: "Presis, skånsom kirurgi med robot", icon: "robotkirurgi-gyn-cl" },
  { name: "Åreknutebehandling", desc: "Sklerosering, laser, kirurgisk behandling", icon: "areknuter-cl" },
];

const journey = [
  {
    label: "Steg 01",
    title: "Bestill når det passer deg",
    body:
      "Online booking døgnet rundt. Ingen fastlege, ingen ventetid. Usikker på hvem du trenger? Ring oss — vi hjelper deg finne riktig spesialist.",
  },
  {
    label: "Steg 02",
    title: "Samtalen som rekker",
    body:
      "Du møter en spesialist som utelukkende jobber med det du trenger. Vi tar oss tid — og forklarer på et språk du forstår.",
  },
  {
    label: "Steg 03",
    title: "Utredning og plan",
    body:
      "En konkret plan — på et språk du forstår. Trenger du videre oppfølging eller samarbeid med andre spesialister, koordinerer vi det.",
  },
  {
    label: "Steg 04",
    title: "Tverrfaglig oppfølging",
    body:
      "Spesialistene jobber i team. En sexolog samarbeider med gynekologen, en psykolog med urologen. Du slipper å starte på nytt et annet sted.",
  },
];

const faqs = [
  { q: "Henvisning", a: "Du trenger ingen henvisning fra fastlege for å bestille time hos oss. Du bestiller direkte." },
  { q: "Ventetid", a: "Vi har kort ventetid. Du kan vanligvis få time innen få dager etter at du tar kontakt." },
  { q: "Sykemelding", a: "Spesialistene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen." },
  { q: "Utredning", a: "En vanlig konsultasjon hos oss varer ca. 30 minutter. Videre utredning avtales med spesialisten." },
  { q: "Forsikring", a: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg. Ta kontakt for å sjekke hva din forsikring dekker." },
];

const FlereFagomraderPage = ({ isChatOpen }: Props) => {
  const navigate = useNavigate();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Flere fagområder – Tverrfaglige spesialister | CMedical"
        description="Hud, psykologi, sexologi, ernæring, kirurgi og mer — Nordens fremste spesialister, ofte i tverrfaglige team. Kort ventetid, ingen henvisning."
        canonical="/flere-fagomrader"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Flere fagområder", path: "/flere-fagomrader" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: "CMedical – Flere fagområder",
        }}
      />

      {/* 1 ── HERO ── editorial: typografi-tung, bilde under */}
      <header className="bg-background pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-8">
            Kort ventetid · Ingen henvisning
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.02] tracking-tight max-w-4xl mb-10">
            Nordens fremste spesialister — i tverrfaglige team.
          </h1>
          <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end max-w-4xl">
            <p className="text-base md:text-[17px] text-foreground/75 font-light leading-relaxed max-w-xl">
              Vi har samlet noen av Nordens fremste spesialister innen hud,
              psykologi, sexologi, ernæring og kirurgi. Spesialistene jobber
              i tverrfaglige team — og utelukkende med det de kan aller best.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=flere-fagomrader")}
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
        <div className="container mx-auto px-6 md:px-16 max-w-6xl mt-14 md:mt-20">
          <div className="aspect-[21/9] overflow-hidden rounded-2xl">
            <img
              src={flereHero}
              alt="CMedical – flere fagområder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 2 ── INTRO PARAGRAPH ── */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-5">
            Øvrige fagområder
          </p>
          <p className="text-lg md:text-xl text-foreground/85 font-light leading-relaxed">
            Vi har samlet noen av Nordens fremste spesialister innen
            gastrokirurgi, revmatologi, dermatologi, ernæringsfysiologi,
            karkirurgi, osteopati, psykologi og sexologi. Spesialistene jobber
            ofte i tverrfaglige team for å gi deg den beste behandlingen.
          </p>
        </div>
      </section>

      {/* 3 ── 3 THEMATIC TRACKS ── */}
      <section className="bg-brand-warm py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Fagområder
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Finn fagfeltet som passer deg
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {themes.map((t) => (
              <div
                key={t.label}
                className="bg-background rounded-2xl p-7 md:p-8 flex flex-col"
              >
                <h3 className="text-xl md:text-2xl font-light text-foreground mb-4 leading-snug">
                  {t.label}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-7">
                  {t.body}
                </p>
                <ul className="space-y-2 mt-auto pt-6 border-t border-border/60">
                  {t.services.map((s) => (
                    <li key={s.name}>
                      <a
                        href={`#${s.name.toLowerCase().replace(/\s+/g, "-").replace(/æ/g, "a").replace(/ø/g, "o").replace(/å/g, "a")}`}
                        className="group flex items-center justify-between gap-3 py-1.5 text-sm font-light text-foreground/85 hover:text-foreground transition-colors"
                      >
                        <span className="border-b border-transparent group-hover:border-foreground/40 pb-0.5 transition-colors">
                          {s.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 ── ALLE SPESIALISTER (descriptive list) ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              Alle spesialister
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              Ledende spesialister — direkte til deg
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-8">
            {specialistList.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div
                  key={s.name}
                  id={s.name.toLowerCase().replace(/\s+/g, "-").replace(/æ/g, "a").replace(/ø/g, "o").replace(/å/g, "a")}
                  className="border-t border-border/60 pt-6 scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                    <h3 className="text-base font-light text-foreground">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4b ── SPESIALISTENE ── */}
      <SpecialistsScroller
        category="annet"
        title="Spesialistene som følger deg."
        seeAllHref="/spesialister?kategori=annet"
        seeAllLabel="Se alle spesialister"
      />

      {/* 5 ── PASIENTREISEN ── */}
      <section className="bg-brand-warm py-16 md:py-24">
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
              <div key={step.label} className="bg-background p-7 md:p-9 flex flex-col">
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

      {/* 6 ── REVIEWS ── */}
      <CategoryReviews categoryId="flere-fagomrader" categoryTitle="våre spesialister" />

      {/* 7 ── FAQ ── */}
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
              <AccordionItem key={i} value={`f-${i}`}>
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

      {/* 8 ── CLOSING CTA ── */}
      <section className="bg-brand-light py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-5">
                Klar når du er det
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-5 text-foreground">
                Usikker på hvem du trenger? Ta en gratis prat først.
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Vi sender bekreftelse og forberedelser direkte til deg. Du kan
                også ta en gratis og uforpliktende prat med oss først.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="cta"
                size="lg"
                onClick={() => navigate("/booking?kategori=flere-fagomrader")}
              >
                Bestill time
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

export default FlereFagomraderPage;
