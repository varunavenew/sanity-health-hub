import { useEffect, useMemo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Editable } from "@/components/editable/Editable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { LifePhasesCarousel } from "@/components/treatments/LifePhasesCarousel";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";

import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getCategoryEntryPrice } from "@/data/priceList";

import heroAsset from "@/assets/services/graviditet-hero.jpg.asset.json";
import ultralydAsset from "@/assets/services/graviditet-ultralyd.jpg.asset.json";
import niptAsset from "@/assets/services/graviditet-nipt.jpg.asset.json";
import fosterAsset from "@/assets/services/graviditet-fosterdiagnostikk.jpg.asset.json";
import teamAsset from "@/assets/services/graviditet-svangerskapsteam.jpg.asset.json";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";

const heroImg = heroAsset.url;
const ultralydImg = ultralydAsset.url;
const niptImg = niptAsset.url;
const fosterImg = fosterAsset.url;
const teamImg = teamAsset.url;

interface PageProps {
  isChatOpen: boolean;
}

const GRAV = "/behandlinger/graviditet";

/* ──────────────────────────────────────────────────────────────
   DATA — segments, expertAreas, services, journey, reviews
   ────────────────────────────────────────────────────────────── */

const segments = [
  {
    id: "tidlig-ultralyd",
    title: "Jeg vil ta tidlig ultralyd",
    desc:
      "Trygghet tidlig i svangerskapet — vi sjekker hjerteslag, plassering og termin, og tar oss god tid til spørsmålene dine.",
    tags: [
      { label: "Tidlig ultralyd", href: `${GRAV}/ultralyd` },
      { label: "Termin og plassering", href: `${GRAV}/ultralyd` },
    ],
    cta: "Les mer",
    href: `${GRAV}/ultralyd`,
  },
  {
    id: "nipt",
    title: "Jeg vil ta NIPT",
    desc:
      "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med tidlig ultralyd hos erfaren spesialist.",
    tags: [
      { label: "NIPT", href: `${GRAV}/nipt` },
      { label: "Tidlig ultralyd + NIPT", href: `${GRAV}/nipt` },
    ],
    cta: "Les mer",
    href: `${GRAV}/nipt`,
  },
  {
    id: "fosterdiagnostikk",
    title: "Jeg vil ha fosterdiagnostikk i uke 12–14",
    desc:
      "Grundig organrettet undersøkelse i et viktig vindu i svangerskapet. Du møter en spesialist i fostermedisin.",
    tags: [
      { label: "Fosterdiagnostikk", href: `${GRAV}/fosterdiagnostikk` },
      { label: "Organrettet ultralyd", href: `${GRAV}/fosterdiagnostikk` },
    ],
    cta: "Les mer",
    href: `${GRAV}/fosterdiagnostikk`,
  },
  {
    id: "team",
    title: "Jeg vil ha fast jordmor og lege",
    desc:
      "Tett, personlig oppfølging gjennom hele svangerskapet — i ro og uten ventetid. Du møter de samme folkene hver gang.",
    tags: [
      { label: "Svangerskapsteam", href: `${GRAV}/svangerskapsteam` },
      { label: "Jordmor", href: `${GRAV}/svangerskapsteam` },
    ],
    cta: "Les mer",
    href: `${GRAV}/svangerskapsteam`,
  },
];

const expertAreas = [
  {
    title: "Tidlig ultralyd",
    desc:
      "Trygghet tidlig i svangerskapet. Vi sjekker hjerteslag, plassering og termin — og tar oss god tid til spørsmålene dine.",
    href: `${GRAV}/ultralyd`,
    image: ultralydImg,
  },
  {
    title: "NIPT",
    desc:
      "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med tidlig ultralyd hos erfaren spesialist.",
    href: `${GRAV}/nipt`,
    image: niptImg,
  },
  {
    title: "Fosterdiagnostikk uke 12–14",
    desc:
      "Grundig organrettet undersøkelse i et viktig vindu i svangerskapet. Du møter en spesialist i fostermedisin.",
    href: `${GRAV}/fosterdiagnostikk`,
    image: fosterImg,
  },
  {
    title: "Svangerskapsteam og jordmor",
    desc:
      "Fast jordmor og lege gjennom hele svangerskapet. Tett, personlig oppfølging — i ro og uten ventetid.",
    href: `${GRAV}/svangerskapsteam`,
    image: teamImg,
  },
];

const serviceGroups: { label: string; items: { title: string; desc: string; href: string }[] }[] = [
  {
    label: "Tidlig i svangerskapet",
    items: [
      { title: "Tidlig ultralyd", desc: "Hjerteslag, termin og plassering", href: `${GRAV}/ultralyd` },
      { title: "NIPT", desc: "Trygg og rask avklaring av kromosomavvik", href: `${GRAV}/nipt` },
      { title: "Tidlig ultralyd + NIPT", desc: "Kombinert tilbud i én konsultasjon", href: `${GRAV}/nipt` },
    ],
  },
  {
    label: "Fostermedisin og diagnostikk",
    items: [
      { title: "Fosterdiagnostikk", desc: "Detaljert vurdering av fosteret", href: `${GRAV}/fosterdiagnostikk` },
      { title: "Organrettet ultralyd uke 12–14", desc: "Spesialist i fostermedisin", href: `${GRAV}/fosterdiagnostikk` },
    ],
  },
  {
    label: "Oppfølging gjennom svangerskapet",
    items: [
      { title: "Svangerskapsteam", desc: "Fast jordmor og lege hele veien", href: `${GRAV}/svangerskapsteam` },
    ],
  },
];

const journey = [
  {
    n: "01",
    title: "Bestill time",
    desc: "Du booker direkte — ingen henvisning, ingen ventetid. Vi finner et tidspunkt som passer ditt svangerskap.",
  },
  {
    n: "02",
    title: "Første konsultasjon",
    desc: "Du møter jordmoren eller spesialisten din. Vi tar oss tid til samtalen før vi gjør en grundig vurdering.",
  },
  {
    n: "03",
    title: "Plan og oppfølging",
    desc: "Sammen legger vi en plan for resten av svangerskapet, tilpasset deg og din historikk.",
  },
  {
    n: "04",
    title: "Etter fødsel",
    desc: "Vi følger deg også etter fødsel — med kontroll, ammehjelp og samtaler om det som var.",
  },
];

const reviews = [
  { text: "Jeg ble møtt med ro og tid. Endelig en jordmor som husket meg fra forrige time og som så hele situasjonen.", author: "Ingrid", date: "Svangerskap 2025" },
  { text: "Vi tok NIPT og tidlig ultralyd her, og fikk en grundig forklaring vi forsto. Trygghet i en sårbar tid.", author: "Anna og Henrik", date: "2 måneder siden" },
  { text: "Etter en tøff fødsel forrige gang trengte jeg samtaler før vi turte å prøve igjen. Det betød alt.", author: "Kine M.", date: "4 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────────── */

const Graviditet = ({ isChatOpen }: PageProps) => {
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    document.title = "Graviditet og fostermedisin | CMedical";
  }, []);

  const entryPrice = getCategoryEntryPrice("graviditet");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Graviditet og fostermedisin | CMedical — trygg oppfølging gjennom hele svangerskapet"
        description="Svangerskapskontroll, tidlig ultralyd, NIPT, fosterdiagnostikk og fødselsforberedelse hos CMedical. Fast jordmor, ingen henvisning, korte ventetider."
        canonical="/graviditet"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Graviditet", path: "/graviditet" },
        ]}
      />
      <h1 className="sr-only">
        Graviditet og fostermedisin hos CMedical — ultralyd, NIPT og svangerskapsoppfølging
      </h1>

      {/* 1. HERO */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="lg:hidden px-6 md:px-16 pb-4">
          <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
            <Link to="/" className="hover:text-foreground">Hjem</Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground/80">Graviditet</span>
          </nav>
          <h2 className="text-4xl font-light text-foreground leading-[1.05]">
            Et svangerskap er noe av <span className="block italic">det mest sårbare som finnes</span>
          </h2>
        </div>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-screen">
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
                <Link to="/" className="hover:text-foreground">Hjem</Link>
                <span aria-hidden="true">›</span>
                <span className="text-foreground/80">Graviditet</span>
              </nav>
              <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Et svangerskap er noe av <span className="block italic">det mest sårbare som finnes</span>
              </h2>

              <Editable
                as="p"
                field="hero.description"
                multiline
                pagePath="/graviditet"
                className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground block"
              >
                {`Du skal kjenne deg trygg, sett og fulgt opp — fra det første hjerteslaget til dagene etter fødselen. Hos CMedical møter du den samme jordmoren og legen gjennom hele svangerskapet.`}
              </Editable>

              {entryPrice && (
                <div className="mb-4 text-sm font-light text-foreground/80">
                  <span className="block text-base text-foreground">{entryPrice.label}</span>
                  <span className="block">{entryPrice.price}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({ kategori: "graviditet" }))
                  }
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Ingen henvisning</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Korte ventetider</li>
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <img
              src={heroImg}
              alt="Gravid kvinne hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* 2. SEGMENT-SEKSJON */}
      <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Fortell oss hvor du er <span className="block italic">— vi finner veien videre.</span>
              </h2>
            </div>

            <LifePhasesCarousel phases={segments.map((s) => ({ ...s, n: s.id }))} />
          </div>
        </div>
      </section>


      {/* 2b. SPLIT-FAQ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-28">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                  Det du lurer på — fordelt så det er enkelt å finne.
                </h2>
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-3">
                  Mange spørsmål dukker opp i et svangerskap. Her har vi samlet
                  de vanligste — så du raskt finner svaret som er relevant for
                  akkurat deg.
                </p>
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Første punkt er åpent som standard, så det viktigste alltid
                  møter leseren først.
                </p>
              </div>
            </div>

            <div>
              <Accordion
                type="single"
                collapsible
                defaultValue={isMobile ? undefined : "faq-0"}
                className="border-t border-border/60"
              >
                {[
                  {
                    q: "Trenger jeg henvisning fra fastlege?",
                    a: "Nei. Du kan ta direkte kontakt med oss uten henvisning. Har du allerede en utredning eller prøvesvar, tar vi gjerne imot dem i forkant så vi sparer tid.",
                  },
                  {
                    q: "Når bør jeg ta tidlig ultralyd og NIPT?",
                    a: "Tidlig ultralyd og NIPT gjøres vanligvis mellom uke 10 og 14. Vi anbefaler å bestille time tidlig i svangerskapet så vi finner et tidspunkt som gir deg svar når du trenger dem.",
                  },
                  {
                    q: "Hvor lang ventetid har dere?",
                    a: "Vi har som regel kort ventetid på første konsultasjon — ofte innen 1–2 uker. Akutt behov søker vi alltid å imøtekomme samme uke.",
                  },
                  {
                    q: "Hva koster svangerskapsoppfølging hos dere?",
                    a: "Prisene varierer med hvilken kontroll eller undersøkelse du trenger. Prisene på siden er «fra»-priser og en grundig prisoversikt får du i første konsultasjon.",
                  },
                  {
                    q: "Kan jeg bruke helseforsikring?",
                    a: "Mange forsikringer dekker deler av svangerskapsoppfølgingen. Vi hjelper deg med å sjekke hva din avtale dekker før vi starter.",
                  },
                ].map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="border-b border-border/60"
                  >
                    <AccordionTrigger className="py-6 text-left text-lg md:text-xl font-normal text-foreground hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <p className="text-sm md:text-base font-light text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HVORFOR CMEDICAL */}
      <section className="bg-background">
        <h2 className="lg:hidden text-3xl font-light leading-[1.1] text-foreground px-6 md:px-16 pt-16 pb-4">
          Trygghet hele veien — fra første kontroll til etter fødsel.
        </h2>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-screen">
          <div className="px-6 md:px-16 lg:px-20 py-20 lg:py-28">
            <div className="max-w-xl">
              <h2 className="hidden lg:block text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Trygghet hele veien — fra første kontroll til etter fødsel.
              </h2>

              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Hos CMedical får du et team som følger deg gjennom hele
                svangerskapet, ikke en ny behandler hver gang.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  { n: "01", title: "Fast jordmor og lege", desc: "Du møter de samme menneskene hver gang. De kjenner historien din, og du slipper å starte på nytt." },
                  { n: "02", title: "Ledende fostermedisinere", desc: "Spesialister med erfaring fra Rikshospitalet og fostermedisinsk avdeling — på samme klinikk som jordmoren din." },
                  { n: "03", title: "Også der det er vanskelig", desc: "Vi følger deg gjennom det fine — og gjennom det vondt. Tap, traumatiske fødsler og fødselsangst hører hjemme her." },
                ].map((step) => (
                  <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                    <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
            <img
              src={heroClinicLounge}
              alt="CMedical klinikk"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. EKSPERTER */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  Eksperter som jobber med det de kan aller best.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Hos oss møter du jordmødre, gynekologer og fostermedisinere
                  som har spesialisert seg dypt innenfor svangerskap og fødsel —
                  uten omveier.
                </p>
              </div>
            </div>

            <div ref={expertAreasRef} className="flex md:grid md:grid-cols-2 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {expertAreas.map((a) => (
                <Link
                  key={a.title}
                  to={a.href}
                  className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[92%] md:w-auto snap-start"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-light text-foreground mb-3">{a.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{a.desc}</p>
                    <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                      Les mer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollArrows scrollRef={expertAreasRef} />
          </div>
        </div>
      </section>


      {/* 6. HVA VI TILBYR — gruppert oversikt */}
      <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Hva vi tilbyr
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Fra tidlig ultralyd til fast jordmor — hele svangerskapstilbudet
                  vårt finner du her. Trenger du hjelp til å velge, ring oss
                  for en uforpliktende prat.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {serviceGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-light text-foreground/60 mb-4">
                    {group.label}
                  </p>
                  <ul className="border-t border-brand-dark/10">
                    {group.items.map((s) => (
                      <li key={s.title} className="border-b border-brand-dark/10">
                        <Link
                          to={s.href}
                          className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_auto] items-baseline gap-4 sm:gap-8 py-5 group"
                        >
                          <h3 className="text-base font-normal text-foreground group-hover:text-foreground/70 transition-colors">
                            {s.title}
                          </h3>
                          <p className="hidden sm:block text-sm font-light text-muted-foreground leading-snug">
                            {s.desc}
                          </p>
                          <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. RESULTATER */}
      <section className="bg-brand-light text-foreground py-20 md:py-28 border-t border-brand-dark/5">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-14">
              <div>
                <h2 className="text-3xl md:text-5xl font-light leading-tight">Tall som forteller en historie.</h2>
              </div>
              <div className="flex items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  Vi måler det vi gjør — fordi du fortjener åpenhet. Her er
                  noen tall fra svangerskapsoppfølgingen vår de siste årene.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-dark/5 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
                {[
                  { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
                  { v: "3 500", k: "Operasjoner", sub: "Per år" },
                  { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
                  { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
                ].map((row, i) => (
                  <div key={row.k} className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 3 ? "md:pr-0" : ""}`}>
                    <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
                      <AnimatedStat value={row.v} />
                    </dd>
                    <dt className="text-sm font-normal text-foreground mb-1">{row.k}</dt>
                    <p className="text-xs font-light text-muted-foreground">{row.sub}</p>
                  </div>
                ))}
              </dl>
            </div>

            <p className="text-xs font-light text-muted-foreground mt-8">
              Tall oppdatert per Q1 2026. Resultater varierer individuelt.
            </p>
          </div>
        </div>
      </section>

      {/* 8. PASIENTSITATER */}
      <section className="bg-brand-warm py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                Tilbakemeldinger fra ekte pasienter
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
                  <div className="flex mb-4">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                  <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">"{r.text}"</p>
                  <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                    <div>
                      <p className="text-brand-dark font-normal text-sm">{r.author}</p>
                      <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brand-dark/75">
                      <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none">
                        <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                        <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                        <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                        <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                      </svg>
                      <span>Google</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. SPESIALISTER */}
      <FeatureSpotlight
        title={<>Start med en <span className="italic">tidlig ultralyd</span></>}
        text="En trygg start på svangerskapet. Vi sjekker hjerteslag, plassering og termin — og gir deg ro til å puste litt før resten av reisen begynner."
        ctaLabel="Les mer om tidlig ultralyd"
        ctaHref={`${GRAV}/ultralyd`}
        image={ultralydImg}
        imageAlt="Tidlig ultralyd hos CMedical"
      />

      <SpecialistsScroller
        category="gynekologi"
        title="Jordmødre og spesialistene som følger deg."
        seeAllHref="/spesialister"
        seeAllLabel="Se alle spesialister"
      />

      {/* 10. FRA FØRSTE KONTAKT TIL RIKTIG OPPFØLGING */}
      <section className="bg-background">
        <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
                Fra første kontakt til riktig oppfølging.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                Du tar kontakt — vi tar over. Slik ser et vanlig svangerskapsforløp
                ut hos oss, fra du booker time til kontrollen etter fødsel.
              </p>
              <Button asChild variant="cta" size="lg" className="px-8">
                <Link to={buildBookingUrl({ kategori: "graviditet" })}>Bestill time</Link>
              </Button>
            </div>

            <div>
              <div className="divide-y divide-border/60 border-t border-border/60">
              {journey.map((step) => (
                  <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                    <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PRE-FOOTER CTA */}
      <BookingCTA />
      <InsurancePartners />
    </PageLayout>
  );
};

export default Graviditet;
