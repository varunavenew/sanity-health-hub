import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
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
    id: "trygg-oppfolging",
    title: "Jeg er gravid og vil ha trygg oppfølging",
    desc:
      "Faste kontroller hos den samme jordmoren og legen gjennom hele svangerskapet — så du slipper å fortelle historien din på nytt hver gang.",
    tags: [
      { label: "Svangerskapskontroll", href: `${GRAV}/svangerskapskontroll` },
      { label: "Jordmor", href: `${GRAV}/svangerskapsteam` },
      { label: "Tidlig ultralyd", href: `${GRAV}/ultralyd` },
      { label: "Kontroll etter fødsel", href: `${GRAV}/svangerskapskontroll` },
    ],
    cta: "Les mer",
    href: `${GRAV}/svangerskapskontroll`,
  },
  {
    id: "ultralyd-nipt",
    title: "Jeg vil ta tidlig ultralyd og NIPT",
    desc:
      "Tidlig svar, tydelig forklaring. Vi tilbyr NIPT-test, organrettet ultralyd og fosterdiagnostikk uten henvisning.",
    tags: [
      { label: "NIPT", href: `${GRAV}/nipt` },
      { label: "Tidlig ultralyd", href: `${GRAV}/ultralyd` },
      { label: "Fosterdiagnostikk", href: `${GRAV}/fosterdiagnostikk` },
      { label: "Organrettet ultralyd", href: `${GRAV}/fosterdiagnostikk` },
    ],
    cta: "Bestill ultralyd",
    href: "/booking?kategori=graviditet&tjeneste=tidlig-ultralyd-nipt",
  },
  {
    id: "forberedelse",
    title: "Jeg trenger fødselsforberedelse",
    desc:
      "Snakk med en jordmor eller psykolog før fødselen. Vi gir deg verktøy, ro og en plan — tilpasset akkurat ditt utgangspunkt.",
    tags: [
      { label: "Fødselsforberedende samtale", href: `${GRAV}/fodselsforberedelse` },
      { label: "Fødselsangst", href: `${GRAV}/fodselsforberedelse` },
      { label: "Jordmor", href: `${GRAV}/svangerskapsteam` },
    ],
    cta: "Snakk med oss",
    href: "/booking?kategori=graviditet&tjeneste=fodselsforberedende-samtale",
  },
  {
    id: "tap-traume",
    title: "Jeg har opplevd tap, abort eller en vanskelig fødsel",
    desc:
      "Du skal slippe å stå i det alene. Vi tilbyr trygge samtaler etter spontanabort, dødfødsel eller en traumatisk fødsel.",
    tags: [
      { label: "Samtale etter abort", href: `${GRAV}/fodselsforberedelse` },
      { label: "Traumatisk fødsel", href: `${GRAV}/fodselsforberedelse` },
      { label: "Psykolog", href: `${GRAV}/fodselsforberedelse` },
    ],
    cta: "Bestill samtale",
    href: "/booking?kategori=graviditet&tjeneste=konsultasjon-etter-abort-eller-dodfodsel",
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
    title: "NIPT og fosterdiagnostikk",
    desc:
      "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med organrettet ultralyd hos erfaren spesialist.",
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
    label: "Kontroll og oppfølging",
    items: [
      { title: "Svangerskapskontroll", desc: "30 min hos jordmor eller lege", href: `${GRAV}/svangerskapskontroll` },
      { title: "Svangerskapsteam", desc: "Fast jordmor og lege", href: `${GRAV}/svangerskapsteam` },
    ],
  },
  {
    label: "Ultralyd og fosterdiagnostikk",
    items: [
      { title: "Tidlig ultralyd", desc: "Hjerteslag, termin og plassering", href: `${GRAV}/ultralyd` },
      { title: "Tidlig ultralyd + NIPT", desc: "Trygg og rask avklaring", href: `${GRAV}/nipt` },
      { title: "Organrettet ultralyd", desc: "Detaljert vurdering av fosteret", href: `${GRAV}/fosterdiagnostikk` },
      { title: "Organrettet ultralyd + NIPT", desc: "Uke 12–14", href: `${GRAV}/fosterdiagnostikk` },
    ],
  },
  {
    label: "Fødselsforberedelse og samtale",
    items: [
      { title: "Fødselsforberedende samtale", desc: "45 min med jordmor", href: `${GRAV}/fodselsforberedelse` },
      { title: "Konsultasjon fødselsangst", desc: "Trygge verktøy før fødsel", href: `${GRAV}/fodselsforberedelse` },
      { title: "Samtale etter tap", desc: "Abort, dødfødsel, traumatisk fødsel", href: `${GRAV}/fodselsforberedelse` },
    ],
  },
];

const journey = [
  { n: "01", title: "Bestill time", desc: "Du booker direkte — ingen henvisning, ingen ventetid. Vi finner et tidspunkt som passer ditt svangerskap." },
  { n: "02", title: "Første konsultasjon", desc: "Du møter jordmoren eller spesialisten din. Vi tar oss tid til samtalen før vi gjør en grundig vurdering." },
  { n: "03", title: "Plan og oppfølging", desc: "Sammen legger vi en plan for resten av svangerskapet, tilpasset deg og din historikk." },
  { n: "04", title: "Etter fødsel", desc: "Vi følger deg også etter fødsel — med kontroll, ammehjelp og samtaler om det som var." },
];

const reviews = [
  { text: "Jeg ble møtt med ro og tid. Endelig en jordmor som husket meg fra forrige time og som så hele situasjonen.", author: "Ingrid", date: "Svangerskap 2025" },
  { text: "Vi tok NIPT og tidlig ultralyd her, og fikk en grundig forklaring vi forsto. Trygghet i en sårbar tid.", author: "Anna og Henrik", date: "2 måneder siden" },
  { text: "Etter en tøff fødsel forrige gang trengte jeg samtaler før vi turte å prøve igjen. Det betød alt.", author: "Kine M.", date: "4 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────────── */

const GraviditetEtterMaster = ({ isChatOpen }: PageProps) => {
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
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Et svangerskap er noe av <span className="block italic">det mest sårbare som finnes</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Du skal kjenne deg trygg, sett og fulgt opp — fra det første
                hjerteslaget til dagene etter fødselen. Hos CMedical møter du
                den samme jordmoren og legen gjennom hele svangerskapet.
              </p>

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
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Fast jordmor</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Erfarne fostermedisinere</li>
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
      <section className="bg-brand-light text-foreground py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Fortell oss hvor du er <span className="block italic">— vi finner veien videre.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {segments.map((s) => (
                <div key={s.id} className="bg-background p-7 flex flex-col">
                  <h3 className="text-lg font-normal mb-4 leading-snug text-foreground">{s.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{s.desc}</p>
                  <TagList tags={s.tags ?? []} initialVisible={3} className="mb-5" />
                  <Link to={s.href} className="inline-flex items-center text-sm font-light text-foreground hover:gap-2.5 gap-2 transition-all">
                    {s.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
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
                defaultValue="faq-0"
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
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="px-6 md:px-16 lg:px-20 py-20 lg:py-28">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
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

            <div className="grid md:grid-cols-2 gap-6">
              {expertAreas.map((a) => (
                <Link
                  key={a.title}
                  to={a.href}
                  className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden"
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
          </div>
        </div>
      </section>

      {/* 5. SYMPTOMSJEKK */}
      <SymptomServiceSection
        title="Hva kjenner du på?"
        description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
        items={[
          { symptom: "Jeg er nettopp blitt gravid og vil ha en tidlig sjekk", service: "Tidlig ultralyd", href: "/booking?kategori=graviditet&tjeneste=tidlig-ultralyd-enkel" },
          { symptom: "Jeg ønsker NIPT for å avklare kromosomavvik", service: "Tidlig ultralyd + NIPT", href: "/booking?kategori=graviditet&tjeneste=tidlig-ultralyd-nipt" },
          { symptom: "Jeg vil ha fast jordmor gjennom svangerskapet", service: "Svangerskapsteam", href: "/booking?kategori=graviditet&tjeneste=svangerskapskontroll" },
          { symptom: "Jeg gruer meg veldig til fødselen", service: "Konsultasjon fødselsangst", href: "/booking?kategori=graviditet&tjeneste=konsultasjon-fodselsangst" },
          { symptom: "Vi har opplevd spontanabort eller dødfødsel", service: "Samtale etter tap", href: "/booking?kategori=graviditet&tjeneste=konsultasjon-etter-abort-eller-dodfodsel" },
          { symptom: "Jeg har vondt eller bekymringer etter fødsel", service: "Kontroll etter fødsel", href: "/booking?kategori=graviditet&tjeneste=kontroll-etter-fodsel" },
        ]}
      />

      {/* 6. VET DU ALLEREDE HVA DU TRENGER */}
      <section className="bg-background text-foreground py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Vet du allerede hva du trenger?
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Klikk og book direkte, eller les mer om den enkelte undersøkelsen eller samtalen.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {allServices.map((s) => (
                <Link
                  key={s.title}
                  to={s.href}
                  className="bg-background p-6 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
                >
                  <div>
                    <h3 className="text-base font-normal text-foreground mb-1.5">{s.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-snug">{s.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
                </Link>
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
                  { v: "98%", k: "Anbefaler oss videre", sub: "Pasienter 2024" },
                  { v: "2 100+", k: "Svangerskap fulgt", sub: "Siste 5 år" },
                  { v: "1–2 uker", k: "Ventetid", sub: "Til første konsultasjon" },
                  { v: "100%", k: "Fast jordmor", sub: "Hele svangerskapet" },
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

export default GraviditetEtterMaster;
