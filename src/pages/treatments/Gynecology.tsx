import { getCategoryEntryPrice } from "@/data/priceList";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote, Users, Clock, User, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LifePhasesCarousel } from "@/components/treatments/LifePhasesCarousel";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Editable } from "@/components/editable/Editable";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import spotlightImg from "@/assets/hero/gynecology-hero.jpg";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";

import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getServiceImageFromHref } from "@/data/serviceImages";
import { ScrollArrows } from "@/components/ui/ScrollArrows";


import gynekologiHeroImg from "@/assets/categories/gynekologi-real.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import expertEndometriose from "@/assets/hero/gynecology-hero.jpg";
import expertBekkenbunn from "@/assets/hero/hero-pregnancy.jpg";
import expertOvergangsalder from "@/assets/hero/cmedical-hero-2.jpg";
import expertVulva from "@/assets/hero/kvinnehelse-hero.jpg";
import kvinnehelseVideo from "@/assets/kvinnehelse-8.mp4.asset.json";

interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA — livsfaser, spesialistområder, full liste
 ────────────────────────────────────────────────────────────── */

const lifePhases = [
 {
 title: "Menstruasjonssyklus, hormonell helse og prevensjon",
 desc:
 "Vi hjelper deg med prevensjon, syklusforstyrrelser og hormonelle plager — og finner ut hva som er normalt for nettopp deg.",
 tags: [
 { label: "Prevensjonsveiledning", href: "/behandlinger/gynekologi/undersokelse" },
 { label: "PMOS & POI", href: "/behandlinger/gynekologi/pcos" },
 { label: "Hormonforstyrrelser", href: "/behandlinger/gynekologi/pcos" },
 { label: "PMS / PMDD", href: "/behandlinger/gynekologi/pms-pmdd" },
 { label: "Uregelmessige eller kraftige blødninger", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
 { label: "Muskelknuter og polypper", href: "/behandlinger/gynekologi/cyster" },
 ],
 href: "/behandlinger/gynekologi/blodningsforstyrrelser",
 },
 {
 title: "Smerter eller ubehag i underlivet og livmoren",
 desc:
 "Vondt under samleie, vedvarende underlivsplager eller funn som bør undersøkes — vi tar oss tid til å forstå hva som skjer.",
 tags: [
 { label: "Vulvodyni", href: "/behandlinger/gynekologi/vulvalidelser" },
 { label: "Vaginisme", href: "/behandlinger/gynekologi/vulvalidelser" },
 { label: "Hudproblemer i vulva", href: "/behandlinger/gynekologi/vulvalidelser" },
 { label: "Test for klamydia / gonoré", href: "/behandlinger/gynekologi/undersokelse" },
 { label: "Celleforandringer og cyster", href: "/behandlinger/gynekologi/celleforandringer" },
 { label: "Konisering", href: "/behandlinger/gynekologi/celleforandringer" },
 { label: "Endometriose", href: "/behandlinger/gynekologi/endometriose" },
 ],
 href: "/behandlinger/gynekologi/vulvalidelser",
 },
 {
 title: "Graviditet, fødsel og tiden etter",
 desc:
 "Svangerskapskontroll, ultralyd, etterkontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
    tags: [
    { label: "Tidlig ultralyd", href: "/behandlinger/graviditet/ultralyd" },
    { label: "NIPT", href: "/behandlinger/graviditet/nipt" },
    { label: "Graviditetsoppfølging", href: "/behandlinger/graviditet/svangerskapsteam" },
    { label: "6-ukerskontroll etter fødsel", href: "/behandlinger/gynekologi/fodselsskader" },
    { label: "Spontanabort", href: "/behandlinger/gynekologi/spontanabort" },
    { label: "Abort", href: "/behandlinger/gynekologi/undersokelse" },
    { label: "Fødselsskader", href: "/behandlinger/gynekologi/fodselsskader" },
    ],
    href: "/behandlinger/graviditet",
    },
  {
  title: "Urogynekologi — fremfall og lekkasje",
  desc:
  "Tyngdefølelse i underlivet, fremfall (prolaps) eller urinlekkasje kan oppstå i alle livsfaser. Vi utreder og behandler både konservativt og kirurgisk.",
  tags: [
  { label: "Urogynekologi (samlet)", href: "/behandlinger/gynekologi/urogynekologi" },
  { label: "Vaginale fremfall", href: "/behandlinger/gynekologi/vaginale-fremfall" },
  { label: "Urininkontinens", href: "/behandlinger/gynekologi/urinlekkasje" },
  { label: "Bekkenbunnsdysfunksjon", href: "/behandlinger/gynekologi/urogynekologi" },
  { label: "Tyngdefølelse i underlivet", href: "/behandlinger/gynekologi/urogynekologi" },
  ],
  href: "/behandlinger/gynekologi/urogynekologi",
  },
  {
  title: "Overgangsalder — på dine premisser",
  desc:
  "Perimenopause og menopause kan være krevende. Vi hjelper deg å forstå kroppen og finner riktig behandling for deg.",
  tags: [
  { label: "Overgangsalder / klimakteriet", href: "/behandlinger/gynekologi/overgangsalder" },
  { label: "Hormonbehandling", href: "/behandlinger/gynekologi/overgangsalder" },
  { label: "Tørrhet i underlivet", href: "/behandlinger/gynekologi/overgangsalder" },
  { label: "Hetetokter og søvnproblemer", href: "/behandlinger/gynekologi/overgangsalder" },
  ],
  href: "/behandlinger/gynekologi/overgangsalder",
  },
];

const expertAreas = [
 {
 title: "Endometriose",
 desc:
 "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
 href: "/behandlinger/gynekologi/endometriose",
 image: getServiceImageFromHref("/behandlinger/gynekologi/endometriose") ?? expertEndometriose,
 },
 {
 title: "Fødselsskader og bekkenbunnshelse",
 desc:
 "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
 href: "/behandlinger/gynekologi/urinlekkasje",
 image: getServiceImageFromHref("/behandlinger/gynekologi/urinlekkasje") ?? expertBekkenbunn,
 },
 {
 title: "Overgangsalder",
 desc:
 "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
 href: "/behandlinger/gynekologi/overgangsalder",
 image: getServiceImageFromHref("/behandlinger/gynekologi/overgangsalder") ?? expertOvergangsalder,
 },
 {
  title: "Vulvasmerter",
  desc:
   "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
  href: "/behandlinger/gynekologi/vulvalidelser",
  image: getServiceImageFromHref("/behandlinger/gynekologi/vulvalidelser") ?? expertVulva,
 },
 {
  title: "Urogynekologi",
  desc:
   "Fremfall (prolaps) og urinlekkasje samlet – utredning og behandling.",
  href: "/behandlinger/gynekologi/urogynekologi",
  image: getServiceImageFromHref("/behandlinger/gynekologi/urogynekologi") ?? expertBekkenbunn,
 },
];

const audiences = [
 {
  title: "Første gynekologtime",
  desc:
   "Det første møtet skal være trygt og forklart. Vi tar oss tid — uansett om det er prevensjon, syklus eller bare et spørsmål du har båret på lenge.",
   href: "/behandlinger/gynekologi/undersokelse",
   image: getServiceImageFromHref("/behandlinger/gynekologi/undersokelse") ?? gynekologiHeroImg,
  },
  {
   title: "Gravid eller nylig forløst",
   desc:
    "Ultralyd, svangerskapsoppfølging, 6-ukerskontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
   href: "/graviditet",
   image: getServiceImageFromHref("/graviditet") ?? expertBekkenbunn,
 },
 {
  title: "Midt i livet og videre",
  desc:
   "Overgangsalder, hormoner, urinlekkasje eller fremfall — vi hjelper deg å forstå kroppen og finne riktig behandling på dine premisser.",
  href: "/behandlinger/gynekologi/overgangsalder",
  image: getServiceImageFromHref("/behandlinger/gynekologi/overgangsalder") ?? expertOvergangsalder,
 },
];

const serviceGroups: { label: string; items: { title: string; desc: string; href: string }[] }[] = [
 {
  label: "Undersøkelse og utredning",
  items: [
   { title: "Gynekologisk undersøkelse", desc: "Helsesjekk og førstekonsultasjon", href: "/behandlinger/gynekologi/undersokelse" },
   { title: "Ultralyd", desc: "Gynekologisk og tidlig graviditet", href: "/behandlinger/gynekologi/undersokelse" },
   { title: "Hysteroskopi", desc: "Undersøkelse av livmorhulen", href: "/behandlinger/gynekologi/kirurgi" },
   { title: "Office-hysteroskopi", desc: "Poliklinisk inngrep uten narkose", href: "/behandlinger/gynekologi/kirurgi" },
   { title: "NIPT", desc: "Fosterdiagnostikk", href: "/behandlinger/graviditet/nipt" },
   { title: "Prevensjon og rådgivning", desc: "Valg av riktig prevensjon", href: "/behandlinger/gynekologi/undersokelse" },
  ],
 },
  {
   label: "Behandling og kirurgi",
   items: [
    { title: "Hormonbehandling", desc: "Overgangsalder og hormonforstyrrelser", href: "/behandlinger/gynekologi/overgangsalder" },
    { title: "Botoxbehandling", desc: "Vaginisme og vulvalidelser", href: "/behandlinger/gynekologi/vulvalidelser" },
    { title: "Konisering", desc: "Behandling av celleforandringer", href: "/behandlinger/gynekologi/celleforandringer" },
    { title: "6-ukers kontroll etter fødsel", desc: "Oppfølging etter fødsel", href: "/behandlinger/gynekologi/undersokelse" },
    { title: "Robotassistert kirurgi", desc: "Høy presisjon, rask rehabilitering", href: "/behandlinger/gynekologi/robotkirurgi" },
    { title: "Gynekologisk kirurgi", desc: "Laparoskopi og åpen kirurgi", href: "/behandlinger/gynekologi/kirurgi" },
    { title: "Fjerne livmor (hysterektomi)", desc: "Kirurgisk fjerning av livmor", href: "/behandlinger/gynekologi/fjerne-livmor" },
    { title: "Labiaplastikk", desc: "Kirurgisk inngrep", href: "/behandlinger/gynekologi/labiaplastikk" },
   ],
  },
];


const reviews = [
 { text: "Trygg og god konsultasjon. Endelig en gynekolog som tok seg tid og forsto plagene mine.", author: "Anne K.", date: "2 måneder siden" },
 { text: "Fryktet konsultasjonen, men ble møtt med varme og kompetanse. Anbefales på det varmeste.", author: "Marit S.", date: "3 måneder siden" },
 { text: "Veldig fornøyd. Korte ventetider, dyktig spesialist og tydelige svar — slik kvinnehelse bør være.", author: "Ingrid L.", date: "1 måned siden" },
];

/* ──────────────────────────────────────────────────────────────
 PAGE
 ────────────────────────────────────────────────────────────── */

const Gynecology = ({ isChatOpen }: PageProps) => {
 const gynSpecialists = useMemo(() => {
 return specialists.filter((s) => s.category === "gynekologi").slice(0, 5);
 }, []);

 const audiencesRef = useRef<HTMLDivElement>(null);
 const expertAreasRef = useRef<HTMLDivElement>(null);
 const reviewsRef = useRef<HTMLDivElement>(null);



 useEffect(() => {
 document.title = "Gynekologi | CMedical — Kvinnehelse for livet";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title="Gynekologi | CMedical — Kvinnehelse for livet"
 description="Spesialistgynekologi hos CMedical. Endometriose, overgangsalder, urinlekkasje, fødselsskader og kvinnehelse — uten henvisning, uten ventetid."
 canonical="/gynekologi"
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Gynekologi", path: "/gynekologi" },
 ]}
 />
 <h1 className="sr-only">
 Gynekologi hos CMedical — kvinnehelse for livet
 </h1>

 {/* ============================================================
 1. HERO — split screen 50/50, bilde kant-i-kant
 ============================================================ */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="lg:hidden page-edge-text-left pb-4">
   <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
     <Link to="/" className="hover:text-foreground">Hjem</Link>
     <span aria-hidden="true">›</span>
     <span className="text-foreground/80">Gynekologi</span>
   </nav>
   <h2 className="text-4xl font-light text-foreground leading-[1.05]">
     Kvinnehelse <span className="block italic">for livet</span>
   </h2>
 </div>
 <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
 <div className="flex items-center page-edge-text-left py-16 lg:py-24">
 <div className="max-w-xl w-full">
            <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
              <Link to="/" className="hover:text-foreground">Hjem</Link>
              <span aria-hidden="true">›</span>
              <span className="text-foreground/80">Gynekologi</span>
            </nav>
            <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
              Kvinnehelse <span className="block italic">for livet</span>
            </h2>

 <Editable
   as="p"
   field="hero.description"
   multiline
   pagePath="/gynekologi"
   className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground block"
 >
   {`Vi følger deg gjennom hele livet — fra de første spørsmålene i tenårene, gjennom svangerskap og overgangsalder, og videre. Gynekologene våre jobber med det de kan best, og vi tar oss alltid tid til å forstå hele deg.`}
 </Editable>

 {(() => {
 const entry = getCategoryEntryPrice("gynekologi");
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
 kategori: "gynekologi",
 tjeneste: "generell-undersokelse",
 }))
 }
 >
 <Editable field="hero.cta" pagePath="/gynekologi">Bestill gynekologisk undersøkelse</Editable>
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

  <div className="relative min-h-[420px] lg:min-h-full">
  <video
  src={kvinnehelseVideo.url}
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
 2. MØRK SEGMENT-SEKSJON — Livsfaser
 ============================================================ */}
  <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
  <div className="page-shell">
  <div className="max-w-3xl mx-auto">
  <div className="max-w-2xl mb-10">
  <h2 className="text-3xl md:text-5xl font-light leading-tight">
  Kroppen endrer seg gjennom livet — vi er her i alle fasene.
  </h2>
  </div>

  <LifePhasesCarousel phases={lifePhases} />

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
 title: "En trygg base for kvinnehelse",
 desc:
 "Konsultasjon, ultralyd og inngrep under samme tak. Du slipper å bli sendt videre — vi tar deg gjennom hele forløpet.",
 },
 {
 n: "02",
 title: "Ledende kompetanse",
 desc:
 "Gynekologer med spesialisering fra Rikshospitalet, Livio og ledende kvinnehelsemiljøer i Norden.",
 },
 {
 n: "03",
 title: "Tett oppfølging",
 desc:
 "Du får ett team som følger deg over tid — fra første samtale til kontroll etter behandling.",
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
 alt="CMedical kvinnehelseklinikk i Sandvika"
 loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 </section>

 {/* ============================================================
 3b. ALLE ER VELKOMNE — målgrupper (inkluderende beroligelse)
 ============================================================ */}
 <section className="bg-secondary/40 py-14 md:py-20">
  <div className="page-shell">
   <div className="max-w-6xl mx-auto">
    <div className="max-w-2xl mb-14">
     <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
      Alle er velkomne
      <br />
      <span className="text-foreground/70">— uansett livsfase.</span>
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
 4. EKSPERTER SOM JOBBER MED DET DE KAN ALLER BEST
 ============================================================ */}
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
 <div className="lg:col-span-6">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Eksperter som jobber med det de kan aller best.
 </h2>
 </div>
 <div className="lg:col-span-6 lg:pt-3">
 <p className="text-base font-light text-muted-foreground leading-relaxed">
 Hos oss møter du gynekologer som har spesialisert seg dypt
 innenfor sitt fagfelt. Det betyr at du får riktig kompetanse
 fra første konsultasjon — uten omveier.
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
 <h3 className="text-xl font-light text-foreground mb-3">
 {a.title}
 </h3>
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
 <ScrollArrows scrollRef={expertAreasRef} />

 </div>
 </div>
 </section>

 {/* 5. SYMPTOMSJEKK — fra symptom til tjeneste */}
 <SymptomServiceSection
 background="background"
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
 items={[
 { symptom: "Vondt under samleie", service: "Gynekologisk undersøkelse", href: "/behandlinger/gynekologi/undersokelse" },
 { symptom: "Kraftige eller langvarige menssmerter", service: "Endometriose-utredning", href: "/behandlinger/gynekologi/endometriose" },
 { symptom: "Urinlekkasje eller bekkenbunnsplager", service: "Bekkenbunnsutredning", href: "/behandlinger/gynekologi/urinlekkasje" },
 { symptom: "Hetetokter, søvnløshet, humørsvingninger", service: "Overgangsalder-konsultasjon", href: "/behandlinger/gynekologi/overgangsalder" },
 { symptom: "Uregelmessig syklus eller mistanke om PMOS", service: "PMOS-utredning", href: "/behandlinger/gynekologi/pcos" },
 { symptom: "Smerter, kløe eller ubehag i vulva", service: "Vulva-utredning", href: "/behandlinger/gynekologi/vulvalidelser" },
 ]}
 />

 {/* ============================================================
 6. HVA VI TILBYR — gruppert oversikt
 ============================================================ */}
 <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-16 md:pb-20">
  <div className="page-shell">
   <div className="max-w-6xl mx-auto">
     <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
      <div className="lg:col-span-6">
       <h2 className="text-3xl md:text-5xl font-light leading-tight">
        Hva vi tilbyr
       </h2>
      </div>
      <div className="lg:col-span-6 lg:pt-3">
       <p className="text-base font-light text-muted-foreground leading-relaxed">
        Dette er undersøkelsene, behandlingene og inngrepene vi utfører.
        Usikker på hva du trenger? Start med en gynekologisk undersøkelse —
        så tar vi det derfra.
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
 resultatene våre innen gynekologi de siste årene.
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
 <p className="text-xs font-light text-muted-foreground">
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
 8. PASIENTSITATER — sosial bevis
 ============================================================ */}
 <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
 Tilbakemeldinger fra ekte pasienter
 </h2>
 </div>
 <div ref={reviewsRef} className="flex md:grid md:grid-cols-3 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
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
        title={<>Begynn med en <span className="italic">gynekologisk undersøkelse</span></>}
        text="En grundig helsesjekk med samtale, klinisk undersøkelse og ultralyd. Du møter en spesialist som tar seg tid til å forstå hele bildet — og legger en plan tilpasset deg."
        ctaLabel="Les mer om gynekologisk undersøkelse"
        ctaHref="/behandlinger/gynekologi/undersokelse"
        image={spotlightImg}
        imageAlt="Konsultasjon hos gynekolog hos CMedical"
      />

      <SpecialistsScroller
 category="gynekologi"
 title="Gynekologene som følger deg."
 seeAllHref="/spesialister?kategori=gynekologi"
 seeAllLabel="Se alle gynekologer"
 />

 {/* ============================================================
 10. UNIFIED PRE-FOOTER CTA — samme som hjem
 ============================================================ */}
      <InsurancePartners />
      <BookingCTA />
 </PageLayout>
 );
};

export default Gynecology;
