import { getCategoryEntryPrice } from "@/data/priceList";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Quote, Users, Clock, User } from "lucide-react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { VideoPlayer } from "@/components/ui/video-player";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Editable } from "@/components/editable/Editable";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { LifePhasesCarousel } from "@/components/treatments/LifePhasesCarousel";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getServiceImageFromHref } from "@/data/serviceImages";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";



import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import journeyLab from "@/assets/fertility/journey-02-lab.jpg";
import journeyResult from "@/assets/fertility/journey-03-result.jpg";
import audienceCouple from "@/assets/fertility/audience-couple.jpg";
import audienceSingle from "@/assets/fertility/audience-single.jpg";
import audienceWaiting from "@/assets/fertility/audience-waiting.jpg";
import fertilityHeroAsset from "@/assets/hero-fertilitet.jpg.asset.json";
const fertilityHeroImg = fertilityHeroAsset.url;
import fertilityHeroVideo from "@/assets/fertilitet-hero-v2.mp4.asset.json";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import imgPsykologi from "@/assets/services/flere-psykologi.jpg.asset.json";
import imgSexologi from "@/assets/services/flere-sexologi.jpg.asset.json";
import { AnimatedStat } from "@/components/AnimatedStat";


interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA — segments, audiences, services
 ────────────────────────────────────────────────────────────── */

const FERT = "/behandlinger/fertilitet";

const segments = [
 {
 id: "forsta",
 title: "Jeg vil forstå fruktbarheten min",
 desc:
 "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
  tags: [
  { label: "Fertilitetsutredning", href: `${FERT}/fertilitetsutredning` },
  { label: "Hormoner", href: `${FERT}/fertilitetsutredning` },
  { label: "AMH", href: `${FERT}/fertilitetsutredning` },
  { label: "Ultralyd", href: `${FERT}/fertilitetsutredning` },
  { label: "Hysteroskopi", href: `${FERT}/fertilitetsutredning` },
  { label: "Rådgivning online", href: `${FERT}/infertilitet` },
  ],
  cta: "Les mer",
  href: `${FERT}/fertilitetsutredning`,
 },
 {
 id: "gravid",
 title: "Jeg vil bli gravid",
 desc:
 "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
 tags: [
  { label: "IVF", href: `${FERT}/assistert-befruktning` },
  { label: "Inseminasjon", href: `${FERT}/assistert-befruktning` },
  { label: "Utredning", href: `${FERT}/fertilitetsutredning` },
  { label: "Assistert befruktning", href: `${FERT}/assistert-befruktning` },
  { label: "Donor-IVF", href: `${FERT}/donorbehandling` },
  { label: "Eggløsningsstimulering", href: `${FERT}/assistert-befruktning` },
  { label: "Second opinion", href: `${FERT}/fertilitetsutredning` },
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
 { label: "Nedfrysing av egg", href: `${FERT}/eggfrys` },
 { label: "Eggdonasjon", href: `${FERT}/donorbehandling` },
 { label: "Spermiefrys", href: `${FERT}/eggfrys` },
 { label: "Eggløsningsstimulering", href: `${FERT}/assistert-befruktning` },
 ],
  cta: "Les mer",
  href: "/behandlinger/fertilitet/eggfrys",
  },
 {
 id: "mann",
 title: "Jeg er mann og vil sjekke fruktbarheten",
 desc:
 "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
 tags: [
 { label: "Sædanalyse", href: `${FERT}/saedanalyse` },
 { label: "Mannlig fertilitet", href: `${FERT}/saedanalyse` },
 { label: "Rådgivning online", href: `${FERT}/infertilitet` },
 ],
 cta: "Bestill analyse",
 href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
 },
];




const audiences = [
  {
    title: "Heterofile par",
    desc:
      "Dere har prøvd en stund og lurer på om noe er galt. Vi starter med utredning av begge — ingen henvisning, ingen ventetid.",
    href: "/behandlinger/fertilitet/infertilitet",
    image: getServiceImageFromHref("/behandlinger/fertilitet/infertilitet") ?? audienceCouple,
  },
  {
    title: "De ventende",
    desc:
      "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
    href: "/behandlinger/fertilitet/fertilitetsutredning",
    image: getServiceImageFromHref("/behandlinger/fertilitet/fertilitetsutredning") ?? audienceWaiting,
  },
  {
    title: "Singel",
    desc:
      "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
    href: "/behandlinger/fertilitet/donorbehandling",
    image: getServiceImageFromHref("/behandlinger/fertilitet/donorbehandling") ?? audienceSingle,
  },
];

const expertAreas = [
  {
    title: "Infertilitet",
    desc:
      "Årsaker til ufrivillig barnløshet hos kvinner og menn – og når du bør søke hjelp.",
    href: "/behandlinger/fertilitet/infertilitet",
    image: getServiceImageFromHref("/behandlinger/fertilitet/infertilitet") ?? journeyConsultation,
  },
  {
    title: "Assistert befruktning",
    desc:
      "IVF, ICSI og inseminasjon — også med donor. Norges eldste private fertilitetsklinikk, med erfaring siden 1989.",
    href: "/behandlinger/fertilitet/assistert-befruktning",
    image: getServiceImageFromHref("/behandlinger/fertilitet/assistert-befruktning") ?? journeyLab,
  },
  {
    title: "Fertilitetsutredning",
    desc:
      "Grundig kartlegging som gir svar og en plan tilpasset deg.",
    href: "/behandlinger/fertilitet/fertilitetsutredning",
    image: getServiceImageFromHref("/behandlinger/fertilitet/fertilitetsutredning") ?? journeyConsultation,
  },
  {
    title: "Nedfrysning av egg",
    desc:
      "For deg som vil bevare mulighetene dine. Vi forklarer hva som er realistisk å forvente — og hva som ikke er det.",
    href: "/behandlinger/fertilitet/eggfrys",
    image: getServiceImageFromHref("/behandlinger/fertilitet/eggfrys") ?? audienceWaiting,
  },
  {
    title: "Donorbehandling",
    desc:
      "Donorsæd, donoregg og partnerdonasjon — vi følger dere trygt gjennom hele forløpet, etter norsk lov.",
    href: "/behandlinger/fertilitet/donorbehandling",
    image: getServiceImageFromHref("/behandlinger/fertilitet/donorbehandling") ?? journeyResult,
  },
  {
    title: "Sædanalyse",
    desc:
      "Sædprøve, hormonprøver og avanserte teknikker som mikro-TESE. Halvparten av forklaringen ligger ofte hos mannen.",
    href: "/behandlinger/fertilitet/saedanalyse",
    image: getServiceImageFromHref("/behandlinger/fertilitet/saedanalyse") ?? audienceCouple,
  },
];


const serviceGroups: { label: string; items: { title: string; desc: string; href: string }[] }[] = [
  {
    label: "Undersøkelse og utredning",
    items: [
      { title: "Fertilitetsutredning", desc: "Blodprøver, ultralyd og sædanalyse", href: "/behandlinger/fertilitet/fertilitetsutredning" },
      { title: "Infertilitet", desc: "Forstå årsaker og veien videre", href: "/behandlinger/fertilitet/infertilitet" },
      { title: "Sædanalyse", desc: "Mannlig fertilitet og mikro-TESE", href: "/behandlinger/fertilitet/saedanalyse" },
      { title: "Hysteroskopi", desc: "Skånsom vurdering av livmorhulen", href: "/behandlinger/fertilitet/hysteroskopi" },
    ],
  },
  {
    label: "Behandling",
    items: [
      { title: "Assistert befruktning", desc: "IVF, ICSI og inseminasjon (IUI)", href: "/behandlinger/fertilitet/assistert-befruktning" },
      { title: "Donorbehandling", desc: "Donorsæd, donoregg og partnerdonasjon", href: "/behandlinger/fertilitet/donorbehandling" },
      { title: "Nedfrysning av egg", desc: "Egg, sæd og embryo", href: "/behandlinger/fertilitet/eggfrys" },
      { title: "Gynekologi og kirurgi", desc: "Polypper, endometriose, myomer", href: "/behandlinger/gynekologi" },
    ],
  },
];


const reviews = [
 { text: "Vi følte oss trygge fra første møte. De tok seg virkelig tid til å bli kjent med oss og vårt utgangspunkt — og det betød alt.", author: "Hilde", date: "IVF-forløp 2024" },
 { text: "Profesjonelle, varme og tydelige hele veien. Endelig følte vi at noen lyttet og hadde en plan vi kunne forstå.", author: "Marte og Jonas", date: "1 måned siden" },
 { text: "Korte ventetider, dyktige spesialister og et tilbud som faktisk er tilpasset oss. Anbefales på det sterkeste.", author: "Sara L.", date: "3 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
 PAGE
 ────────────────────────────────────────────────────────────── */

const Fertility = ({ isChatOpen }: PageProps) => {
 // Spesialister: Madeleine først, deretter resten av fertilitetsspesialistene
 const fertilitySpecialists = useMemo(() => {
 const fertility = specialists.filter((s) => s.category === "fertilitet");
 const madeleine = specialists.find((s) => s.slug === "madeleine-engen");
 const withoutMadeleine = fertility.filter((s) => s.slug !== "madeleine-engen");
 const list = madeleine ? [madeleine, ...withoutMadeleine] : fertility;
 return list.slice(0, 5);
 }, []);

 const audiencesRef = useRef<HTMLDivElement>(null);
 const expertAreasRef = useRef<HTMLDivElement>(null);
 const stotteRef = useRef<HTMLDivElement>(null);
 const reviewsRef = useRef<HTMLDivElement>(null);


 useEffect(() => {
 document.title =
 "Fertilitet | CMedical — fertilitetsbehandling for alle veier til foreldreskap";
 }, []);

 return (
  <PageLayout isChatOpen={isChatOpen}>
  <PageSEO
  title="Fertilitet | CMedical — fertilitetsbehandling for alle veier til foreldreskap"
  description="Fertilitetsbehandling hos CMedical. IVF, inseminasjon, eggfrys, fertilitetsutredning og donorbehandling — uten henvisning, uten ventetid."
  canonical="/fertilitet"
  breadcrumbs={[
  { name: "Hjem", path: "/" },
  { name: "Fertilitet", path: "/fertilitet" },
  ]}
  />
  <h1 className="sr-only">
  Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning
  </h1>

  {/* ============================================================
  1. HERO — split screen 50/50, autoplay video kant-i-kant
  ============================================================ */}
  <header className="bg-brand-light pt-24 lg:pt-0">
  <div className="lg:hidden page-edge-text-left pb-4">
    <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
      <Link to="/" className="hover:text-foreground">Hjem</Link>
      <span aria-hidden="true">›</span>
      <span className="text-foreground/80">Fertilitet</span>
    </nav>
    <h2 className="text-4xl font-light text-foreground leading-[1.05]">
      Noen ganger trenger kroppen <span className="block italic">litt hjelp på veien</span>
    </h2>
  </div>
  <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
  {/* Left — copy + CTA */}
  <div className="flex items-center page-edge-text-left py-16 lg:py-24">
  <div className="max-w-xl w-full">
  <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
    <Link to="/" className="hover:text-foreground">Hjem</Link>
    <span aria-hidden="true">›</span>
    <span className="text-foreground/80">Fertilitet</span>
  </nav>
  <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
  Noen ganger trenger kroppen <span className="block italic">litt hjelp på veien</span>
  </h2>


  <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
  Å ville bli foreldre er noe av det sterkeste man kan kjenne på.
  For mange går det av seg selv. For andre tar det litt lenger
  tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og
  det finnes svar.
  </p>

  {(() => {
  const entry = getCategoryEntryPrice("fertilitet");
  return entry ? (
  <div className="mb-4 text-sm font-light text-foreground/80">
  <span className="block text-base text-foreground">{entry.label}</span>
  <span className="block">{entry.price}</span>
  </div>
  ) : null;
  })()}
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
  <Button
  variant="cta"
  size="lg"
  className="px-8 w-full sm:w-auto"
  onClick={() =>
  (window.location.href = buildBookingUrl({
  kategori: "fertilitet",
  }))
  }
  >
  Bestill time
  </Button>
  <CallUsClinicPicker variant="light" label="Ring oss" />
  </div>

   <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
   {["Ingen henvisning", "Korte ventetider"].map((u) => (
   <li key={u} className="flex items-center gap-2">
   <Check className="w-4 h-4" aria-hidden="true" />
   <span>{u}</span>
   </li>
   ))}
   </ul>
  </div>
  </div>

  {/* Right — covervideo, fyller hele halvdelen */}
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






 {/* ============================================================
 2. SEGMENT — "Fortell oss hvor du er" (identifiser deg)
 ============================================================ */}
 <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">

 <div className="page-shell">
 <div className="max-w-3xl mx-auto">
 <div className="max-w-2xl mb-10">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Fortell oss hvor du er
 <span className="block">— vi finner veien videre.</span>
 </h2>
 </div>

 <LifePhasesCarousel phases={segments.map((s) => ({ ...s, n: s.id }))} />
 </div>
 </div>

 </section>

 {/* ============================================================
 3. HVORFOR CMEDICAL — Det beste fra to klinikker (tillit tidlig)
 ============================================================ */}
  <section className="bg-background">
  <div className="flex flex-col-reverse lg:grid lg:grid-cols-12">
 <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
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
 {
 n: "01",
 title: "Et trygt sted å starte",
 desc:
 "Klinikk og laboratorium under samme tak. Ingen lange transporter, ingen mellommenn — bare oss og dere.",
 },
 {
 n: "02",
 title: "Ledende kompetanse",
 desc:
 "Spesialister med erfaring fra Rikshospitalet, Livio og internasjonale fertilitetssentre.",
 },
 {
 n: "03",
 title: "Tett oppfølging",
 desc:
 "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene.",
 },
 ].map((step) => (
 <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
 {step.n}
 </div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {step.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
 {step.desc}
 </p>
 </div>
 </div>
 ))}
  </div>

  <Link
   to="/om-oss"
   className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
  >
   Les mer om klinikken
   <ArrowRight className="w-3.5 h-3.5" />
  </Link>
 </div>
 </div>

 <div className="lg:col-span-5 relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-full overflow-hidden">
 <img
 src={heroClinicLounge}
 alt="CMedical fertilitetsklinikk i Sandvika"
 loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 </section>

 {/* ============================================================
 4. ALLE ER VELKOMNE — målgrupper (inkluderende beroligelse)
 ============================================================ */}
 <section className="bg-secondary/40 py-14 md:py-20">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Alle er velkomne
 <br />
 <span className="text-foreground/70">— uansett utgangspunkt.</span>
 </h2>
 </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {audiences.map((a) => (
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
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                      {a.desc}
                    </p>
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

      {/* ============================================================
       4b. EKSPERTER SOM JOBBER MED DET DE KAN ALLER BEST
       ============================================================ */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  Eksperter som jobber med det de kan aller best.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Hos oss møter du fertilitetsspesialister som har spesialisert seg dypt
                  innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første
                  konsultasjon — uten omveier.
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

      {/* 5. SYMPTOMSJEKK — selvdiagnose, peker mot tjenester */}
 <SymptomServiceSection
 background="background"
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
  items={[
   { symptom: "Vi har prøvd i over et år uten å lykkes", service: "Fertilitetsutredning", href: "/behandlinger/fertilitet/fertilitetsutredning", image: audienceCouple, imageAlt: "Par i samtale" },
   { symptom: "Uregelmessig syklus eller mistanke om PMOS", service: "Hormonutredning", href: "/behandlinger/fertilitet/fertilitetsutredning", image: journeyConsultation, imageAlt: "Konsultasjon med spesialist" },
   { symptom: "Jeg vil vite hvor mye tid jeg har", service: "AMH og eggstokkreserve", href: "/behandlinger/fertilitet/fertilitetsutredning", image: audienceWaiting, imageAlt: "Stille refleksjon" },
   { symptom: "Vi vurderer nedfrysing av egg", service: "Konsultasjon eggfrys", href: "/behandlinger/fertilitet/eggfrys", image: journeyLab, imageAlt: "Laboratorium for nedfrysing" },
   { symptom: "Partneren vil sjekke fruktbarheten", service: "Sædanalyse", href: "/behandlinger/fertilitet/saedanalyse", image: fertilityHeroImg, imageAlt: "Mannlig fertilitetsutredning" },
   { symptom: "Vi ønsker å bli foreldre som likekjønnet par", service: "Donorbehandling", href: "/behandlinger/fertilitet/donorbehandling", image: audienceSingle, imageAlt: "Vei mot foreldreskap" },
  ]}
 />

  {/* ============================================================
  6. HVA VI TILBYR — gruppert oversikt
  ============================================================ */}
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
        Fra første samtale til oppfølging — hele fertilitetstilbudet
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


      {/* ============================================================
      6b. STØTTE GJENNOM FERTILITETSPROSESSEN
      ============================================================ */}
      <section className="bg-brand-light py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Støtte gjennom fertilitetsprosessen
              </h2>
            </div>
            <div ref={stotteRef} className="flex md:grid md:grid-cols-2 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              <Link
                to="/behandlinger/flere-fagomrader/psykologi"
                className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[92%] md:w-auto snap-start"
              >

                <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                  <img
                    src={imgPsykologi.url}
                    alt="Psykisk hjelp under fertilitetsprosess"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-light text-foreground mb-3">Psykisk hjelp under fertilitetsprosess</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    Rådgivning og støtte fra psykolog for deg som står i en fertilitetsprosess.
                  </p>
                  <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                    Les mer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
              <Link
                to="/behandlinger/flere-fagomrader/sexologi"
                className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[92%] md:w-auto snap-start"
              >

                <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                  <img
                    src={imgSexologi.url}
                    alt="Intimitet i parforhold under fertilitetsprosess"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-light text-foreground mb-3">Intimitet i parforhold under fertilitetsprosess</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    Veiledning fra sexolog om intimitet og parforhold gjennom fertilitetsforløpet.
                  </p>
                  <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                    Les mer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
            <ScrollArrows scrollRef={stotteRef} />

          </div>
        </div>
      </section>

  {/* ============================================================
 7. RESULTATER — bevis etter at tilbudet er presentert
 ============================================================ */}
 <section className="bg-brand-light text-foreground pt-14 md:pt-16 pb-10 md:pb-12">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Tall som forteller en historie.
 </h2>
 </div>
 <div className="lg:col-span-7 flex items-end">
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
 Vi måler det vi gjør — fordi du fortjener åpenhet. Her er
 resultatene våre innen fertilitetsbehandling de siste årene.
 </p>
 </div>
 </div>

 <div className="border-t border-brand-dark/15 py-8 md:py-10">
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {[
 { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
 { v: "3 500", k: "Operasjoner", sub: "Per år" },
 { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
 { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
 ].map((row, i) => (
 <div
 key={row.k}
 className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 3 ? "md:pr-0" : ""}`}
 >
 <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
 <AnimatedStat value={row.v} />
 </dd>
 <dt className="text-sm font-normal text-foreground mb-1">
 {row.k}
 </dt>
 <p className="text-xs font-light text-foreground/60">
 {row.sub}
 </p>
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

  {/* ============================================================
 8. TILBAKEMELDINGER — sosial bevis rett før spesialistene
 ============================================================ */}
 <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
 Tilbakemeldinger fra ekte pasienter
 </h2>
 </div>
 <div ref={reviewsRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
 {reviews.map((r, i) => (
 <div
 key={i}
 className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300 shrink-0 w-[78vw] md:w-auto snap-center"
 >

 <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
 <div className="flex mb-4">
 {[0, 1, 2, 3, 4].map((s) => (
 <Star
 key={s}
 className="w-4 h-4 fill-[#FFC107] text-[#FFC107]"
 />
 ))}
 </div>
 <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">
 "{r.text}"
 </p>
 <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
 <div>
 <p className="text-brand-dark font-normal text-sm">
 {r.author}
 </p>
 <p className="text-xs text-brand-dark/60 font-light">
 {r.date}
 </p>
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
 <ScrollArrows scrollRef={reviewsRef} />

 </div>
 </div>
 </section>

 {/* ============================================================
 9. SPESIALISTER — menneskene bak
 ============================================================ */}
  <FeatureSpotlight
        
        title={<>Begynn med en <span className="italic">fertilitetsutredning</span></>}
        text="En grundig kartlegging av eggstokkreserve, hormoner og anatomi — slik at du vet hvor du står. Du møter en spesialist som går gjennom funnene og legger en plan tilpasset deg og din partner."
        ctaLabel="Les mer om fertilitetsutredning"
        ctaHref="/behandlinger/fertilitet/fertilitetsutredning"
        image={fertilityHeroImg}
        imageAlt="Konsultasjon med fertilitetsspesialist hos CMedical"
      />

      <SpecialistsScroller
 category="fertilitet"
 title="Fertilitetsspesialistene som følger deg."
 seeAllHref="/spesialister?kategori=fertilitet"
 seeAllLabel="Se alle fertilitetsspesialister"
 />

 {/* ============================================================
 10. UNIFIED PRE-FOOTER CTA
 ============================================================ */}
      <InsurancePartners />
      <BookingCTA />


 </PageLayout>
 );
};

export default Fertility;
