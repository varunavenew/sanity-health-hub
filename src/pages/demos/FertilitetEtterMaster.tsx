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
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getCategoryEntryPrice } from "@/data/priceList";

import fertilityHeroImg from "@/assets/categories/fertilitet-real.jpg";
import fertilityHeroVideo from "@/assets/hero/fertilitet-hero.mp4.asset.json";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import journeyLab from "@/assets/fertility/journey-02-lab.jpg";
import journeyResult from "@/assets/fertility/journey-03-result.jpg";
import audienceCouple from "@/assets/fertility/audience-couple.jpg";
import audienceSingle from "@/assets/fertility/audience-single.jpg";
import audienceWaiting from "@/assets/fertility/audience-waiting.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const FERT = "/behandlinger/fertilitet";

/* ──────────────────────────────────────────────────────────────
   DATA — segments, expertAreas, services, journey, reviews
   ────────────────────────────────────────────────────────────── */

const segments = [
  {
    id: "forsta",
    title: "Jeg vil forstå fruktbarheten min",
    desc:
      "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
    tags: [
      { label: "Fertilitetssjekk", href: `${FERT}/fertilitetssjekk` },
      { label: "Hormoner", href: `${FERT}/fertilitetssjekk` },
      { label: "AMH", href: `${FERT}/fertilitetssjekk` },
      { label: "Ultralyd", href: `${FERT}/fertilitetssjekk` },
      { label: "Hysteroskopi", href: `${FERT}/fertilitetssjekk` },
    ],
    cta: "Les mer",
    href: `${FERT}/fertilitetssjekk`,
  },
  {
    id: "gravid",
    title: "Jeg vil bli gravid",
    desc:
      "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
    tags: [
      { label: "IVF", href: `${FERT}/ivf` },
      { label: "Inseminasjon", href: `${FERT}/iui` },
      { label: "Utredning", href: `${FERT}/fertilitetssjekk` },
      { label: "Donor-IVF", href: `${FERT}/eggdonasjon` },
      { label: "Eggløsningsstimulering", href: `${FERT}/iui` },
    ],
    cta: "Bestill utredning",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
  },
  {
    id: "bevare",
    title: "Jeg vil bevare mulighetene mine",
    desc:
      "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
    tags: [
      { label: "Nedfrysing av egg", href: `${FERT}/nedfrysing` },
      { label: "Eggdonasjon", href: `${FERT}/eggdonasjon` },
      { label: "Spermiefrys", href: `${FERT}/nedfrysing` },
    ],
    cta: "Snakk med oss",
    href: "/booking?kategori=fertilitet&tjeneste=uforpliktende-telefonsamtale-om-fertilitet-med-sykepleier",
  },
  {
    id: "mann",
    title: "Jeg er mann og vil sjekke fruktbarheten",
    desc:
      "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
    tags: [
      { label: "Sædanalyse", href: `${FERT}/mannlig-fertilitet` },
      { label: "Mannlig fertilitet", href: `${FERT}/mannlig-fertilitet` },
    ],
    cta: "Bestill analyse",
    href: "/booking?kategori=fertilitet&tjeneste=enkel-sedanalyse",
  },
];

const expertAreas = [
  {
    title: "IVF — prøverørsbehandling",
    desc:
      "Vårt mest etablerte fagfelt. Vi har gjennomført IVF siden 1989 og kombinerer erfaring med oppdaterte protokoller.",
    href: `${FERT}/ivf`,
    image: journeyLab,
  },
  {
    title: "Eggdonasjon",
    desc:
      "Norges nyeste eggbank. Vi følger dere trygt gjennom hele forløpet — fra første samtale til oppfølging.",
    href: `${FERT}/eggdonasjon`,
    image: journeyResult,
  },
  {
    title: "Nedfrysing av egg",
    desc:
      "For deg som vil bevare mulighetene dine. Vi forklarer hva som er realistisk å forvente — og hva som ikke er det.",
    href: `${FERT}/nedfrysing`,
    image: audienceWaiting,
  },
  {
    title: "Mannlig fertilitet",
    desc:
      "Sædanalyse, utredning og avanserte teknikker som mikro-TESE. Halvparten av forklaringen ligger ofte hos mannen.",
    href: `${FERT}/mannlig-fertilitet`,
    image: audienceCouple,
  },
];

const allServices = [
  { title: "Fertilitetssjekk og utredning", desc: "Hormoner, ultralyd, sædanalyse", href: `${FERT}/fertilitetssjekk` },
  { title: "IVF — prøverørsbehandling", desc: "Inkludert ICSI ved behov", href: `${FERT}/ivf` },
  { title: "IUI — inseminasjon", desc: "Med partner eller donor", href: `${FERT}/iui` },
  { title: "Eggdonasjon", desc: "Norges nyeste eggbank", href: `${FERT}/eggdonasjon` },
  { title: "Nedfrysing av egg", desc: "Egg, sæd og embryo", href: `${FERT}/nedfrysing` },
  { title: "Genetisk testing (PGT)", desc: "For utvalgte indikasjoner", href: `${FERT}/pgt` },
  { title: "Gynekologi og kirurgi", desc: "Polypper, endometriose, myomer", href: "/behandlinger/gynekologi" },
  { title: "Mannlig fertilitet", desc: "Sædanalyse og mikro-TESE", href: `${FERT}/mannlig-fertilitet` },
  { title: "Psykisk helsehjelp", desc: "Samtaler gjennom hele forløpet", href: `${FERT}/psykisk-helsehjelp` },
];

const journey = [
  { n: "01", title: "Bestill time", desc: "Du ringer eller booker direkte. Ingen henvisning, ingen ventetid — vi finner et tidspunkt som passer." },
  { n: "02", title: "Første konsultasjon og utredning", desc: "Du møter spesialisten din. Vi tar oss tid til samtalen, før vi gjør en grundig utredning av begge." },
  { n: "03", title: "Plan og behandling", desc: "Vi forklarer hva vi finner og legger en plan sammen med dere — i deres tempo." },
  { n: "04", title: "Oppfølging", desc: "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene." },
];

const reviews = [
  { text: "Vi følte oss trygge fra første møte. De tok seg virkelig tid til å bli kjent med oss og vårt utgangspunkt — og det betød alt.", author: "Hilde", date: "IVF-forløp 2024" },
  { text: "Profesjonelle, varme og tydelige hele veien. Endelig følte vi at noen lyttet og hadde en plan vi kunne forstå.", author: "Marte og Jonas", date: "1 måned siden" },
  { text: "Korte ventetider, dyktige spesialister og et tilbud som faktisk er tilpasset oss. Anbefales på det sterkeste.", author: "Sara L.", date: "3 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
   PAGE — mirrors MasterMalToUkerSiden exactly, kun innhold byttet
   ────────────────────────────────────────────────────────────── */

const FertilitetEtterMaster = ({ isChatOpen }: PageProps) => {
  const fertilitySpecialists = useMemo(() => {
    const fertility = specialists.filter((s) => s.category === "fertilitet");
    const madeleine = specialists.find((s) => s.slug === "madeleine-engen");
    const withoutMadeleine = fertility.filter((s) => s.slug !== "madeleine-engen");
    const list = madeleine ? [madeleine, ...withoutMadeleine] : fertility;
    return list.slice(0, 5);
  }, []);

  useEffect(() => {
    document.title = "Fertilitet (mal-demo) | CMedical";
  }, []);

  const entryPrice = getCategoryEntryPrice("fertilitet");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Fertilitet | CMedical — fertilitetsbehandling for alle veier til foreldreskap"
        description="Fertilitetsbehandling hos CMedical. IVF, inseminasjon, eggdonasjon, nedfrysing og mannlig fertilitet — uten henvisning, korte ventetider."
        canonical="/maler/fertilitetEtterMaster"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Fertilitet", path: "/behandlinger/fertilitet" },
        ]}
      />
      <h1 className="sr-only">
        Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning
      </h1>

      {/* 1. HERO — split screen 50/50, autoplay video kant-i-kant */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Noen ganger trenger kroppen <span className="block italic">litt hjelp på veien</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Å ville bli foreldre er noe av det sterkeste man kan kjenne på.
                For mange går det av seg selv. For andre tar det litt lenger
                tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og
                det finnes svar.
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
                    (window.location.href = buildBookingUrl({ kategori: "fertilitet" }))
                  }
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Ingen henvisning</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Korte ventetider</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" aria-hidden="true" />Erfarne spesialister</li>
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <video
              src={fertilityHeroVideo.url}
              poster={fertilityHeroImg}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* 2. SEGMENT-SEKSJON — Fortell oss hvor du er */}
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

      {/* 2b. SPLIT-FAQ — alternativ for undertjenester med mye tekst
            (samme mønster som NIPT / GynekologiSubPage). På undertjenester
            erstatter denne seksjonen "Fortell oss hvor du er", siden brukeren
            allerede har valgt sitt steg i livet. */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-28">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                  Det du lurer på — fordelt så det er enkelt å finne.
                </h2>
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-3">
                  På undertjenester med mye fagstoff bruker vi denne split-løsningen
                  istedenfor segment-seksjonen over. Innholdet fordeles strategisk
                  så du raskt kan lese akkurat det som er relevant for deg.
                </p>
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Første punkt er åpent som standard, så det viktigste alltid
                  møter leseren først — uten ekstra scroll.
                </p>
              </div>
            </div>

            <div>
              <Accordion
                type="single"
                collapsible
                
                className="border-t border-border/60"
              >
                {[
                  {
                    q: "Hva er IVF, og når er det aktuelt?",
                    a: "IVF (in vitro-fertilisering) er prøverørsbehandling der egg og sæd møtes utenfor kroppen. Det er aktuelt når andre forsøk ikke har lyktes, ved nedsatt eggstokkreserve, ved tubefaktor eller når sædkvaliteten er nedsatt.",
                  },
                  {
                    q: "Hvor lang ventetid har dere?",
                    a: "Vi har som regel kort ventetid på første konsultasjon — ofte innen 1–2 uker. Selve behandlingen planlegges deretter etter din syklus og vårt laboratoriums kapasitet.",
                  },
                  {
                    q: "Trenger jeg henvisning fra fastlege?",
                    a: "Nei. Du kan ta direkte kontakt med oss uten henvisning. Har du allerede en utredning eller prøvesvar, tar vi gjerne imot dem i forkant så vi sparer tid.",
                  },
                  {
                    q: "Hva koster en fertilitetsbehandling?",
                    a: "Prisene varierer med behandlingstype. Prisene på siden er «fra»-priser og en grundig prisoversikt får du i første konsultasjon, der vi går gjennom forløpet som passer deg.",
                  },
                  {
                    q: "Kan jeg bruke helseforsikring?",
                    a: "Mange forsikringer dekker utredning og deler av behandlingen. Vi hjelper deg med å sjekke hva din avtale dekker før vi starter.",
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

      {/* 3. HVORFOR CMEDICAL — Det beste fra to klinikker */}
      <section className="bg-background">
        <div className="grid lg:grid-cols-2 min-h-screen">
          <div className="px-6 md:px-16 lg:px-20 py-20 lg:py-28">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Det beste fra to klinikker — samlet på ett sted.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Livio og CMedical Sandvika har slått seg sammen. Det betyr mer
                erfaring, samme team — og et tilbud som dekker hele veien.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  { n: "01", title: "Et trygt sted å starte", desc: "Klinikk og laboratorium under samme tak. Ingen lange transporter, ingen mellommenn — bare oss og dere." },
                  { n: "02", title: "Ledende kompetanse", desc: "Spesialister med erfaring fra Rikshospitalet, Livio og internasjonale fertilitetssentre." },
                  { n: "03", title: "Tett oppfølging", desc: "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene." },
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
              alt="CMedical fertilitetsklinikk i Sandvika"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. EKSPERTER SOM JOBBER MED DET DE KAN ALLER BEST */}
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
                  Hos oss møter du fertilitetsspesialister som har spesialisert seg dypt
                  innenfor sitt fagfelt. Det betyr at du får riktig kompetanse
                  fra første konsultasjon — uten omveier.
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
          { symptom: "Vi har prøvd i over et år uten å lykkes", service: "Fertilitetsutredning", href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning" },
          { symptom: "Uregelmessig syklus eller mistanke om PMOS", service: "Hormonutredning", href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk" },
          { symptom: "Jeg vil vite hvor mye tid jeg har", service: "AMH og eggstokkreserve", href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk" },
          { symptom: "Vi vurderer nedfrysing av egg", service: "Konsultasjon eggfrys", href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon" },
          { symptom: "Partneren vil sjekke fruktbarheten", service: "Sædanalyse", href: "/booking?kategori=fertilitet&tjeneste=sedanalyse" },
          { symptom: "Vi ønsker å bli foreldre som likekjønnet par", service: "Samtale og utredning", href: "/booking?kategori=fertilitet" },
        ]}
      />

      {/* 6. VET DU ALLEREDE HVA DU TRENGER — full liste */}
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
                  Klikk og book direkte, eller les mer om den enkelte utredningen eller behandlingen.
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
                  resultatene våre innen fertilitetsbehandling de siste årene.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-dark/5 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
                {[
                  { v: "42%", k: "Suksessrate IVF", sub: "Kvinner under 35 år" },
                  { v: "3 800+", k: "Barn født", sub: "Siden oppstart i 1989" },
                  { v: "11 200", k: "Egg uthentet", sub: "Siste 5 år" },
                  { v: "1 450", k: "IVF-sykluser", sub: "Gjennomført i 2024" },
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
        title={<>Begynn med en <span className="italic">fertilitetssjekk</span></>}
        text="En grundig kartlegging av eggstokkreserve, hormoner og anatomi — slik at du vet hvor du står. Du møter en spesialist som går gjennom funnene og legger en plan tilpasset deg og din partner."
        ctaLabel="Les mer om fertilitetssjekk"
        ctaHref={`${FERT}/fertilitetssjekk`}
        image={journeyConsultation}
        imageAlt="Konsultasjon med fertilitetsspesialist hos CMedical"
      />

      <SpecialistsScroller
        category="fertilitet"
        title="Fertilitetsspesialistene som følger deg."
        seeAllHref="/spesialister?kategori=fertilitet"
        seeAllLabel="Se alle fertilitetsspesialister"
      />

      {/* 10. FRA FØRSTE KONTAKT TIL RIKTIG BEHANDLING */}
      <section className="bg-background">
        <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
                Fra første kontakt til riktig behandling.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos
                oss, fra du booker time til du er ferdig behandlet.
              </p>
              <Button asChild variant="cta" size="lg" className="px-8">
                <Link to={buildBookingUrl({ kategori: "fertilitet" })}>Bestill time</Link>
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

export default FertilitetEtterMaster;
