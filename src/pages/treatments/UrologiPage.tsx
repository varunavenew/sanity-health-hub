import { useEffect, useMemo, useRef } from "react";
import { ReadMoreLink } from "@/components/ui/ReadMoreLink";
import { CarouselCta } from "@/components/ui/CarouselCta";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Editable } from "@/components/editable/Editable";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import { LeadPopup } from "@/components/LeadPopup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { ClinicPillarsSection } from "@/components/treatments/ClinicPillarsSection";
import { LifePhasesCarousel } from "@/components/treatments/LifePhasesCarousel";
import spotlightImg from "@/assets/hero/cmedical-hands.jpg";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { TagList } from "@/components/treatments/TagList";
import { getServiceImageFromHref } from "@/data/serviceImages";

import urologiHero from "@/assets/services/urologi-hero.jpg.asset.json";
import urologiTeamTrond from "@/assets/urologi/urologi-team-trond5.jpg.asset.json";
import expertProstata from "@/assets/hero/robotkirurgi-hero.jpg";
import expertTestikler from "@/assets/hero/urology-hero.jpg";
import expertPenis from "@/assets/hero/cmedical-hero-2.jpg";
import expertKvinne from "@/assets/hero/hero-clinic-lounge.jpg";
import { PatientFeedbackCarousel } from "@/components/treatments/PatientFeedbackCarousel";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";

interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA
 ────────────────────────────────────────────────────────────── */

const lifePhases = [
 {
 n: "01",
 title: "Mann med plager i underlivet",
 desc:
 "Prostataproblemer, smerter i testikler, ereksjonsproblemer eller vannlatingsplager — vi hjelper deg finne svar.",
 tags: [
   { label: "Prostata", href: "/behandlinger/urologi/prostata" },
   { label: "Vannlating", href: "/behandlinger/urologi/prostata" },
   { label: "Ereksjon", href: "/behandlinger/urologi/prostata" },
 ],
 href: "/booking?kategori=urologi",
 cta: "Bestill konsultasjon",
 },
 {
 n: "02",
 title: "Kvinne med urologiske plager",
 desc:
 "Urinlekkasje, hyppig vannlating, blæreinfeksjoner eller blod i urinen — urologi gjelder ikke bare menn.",
 tags: [
    { label: "Inkontinens", href: "/behandlinger/urologi/blaere" },
    { label: "Blære", href: "/behandlinger/urologi/blaere" },
    { label: "Nyrer", href: "/behandlinger/urologi/nyrer" },
  ],
 href: "/behandlinger/urologi/blaere",
 cta: "Les mer",
 },
 {
 n: "03",
 title: "Prostatasjekk",
 desc:
 "Vi anbefaler alle menn over 50 å ta en prostatasjekk — eller tidligere ved symptomer, forhøyet PSA eller arvelighet.",
 tags: [
   { label: "PSA", href: "/behandlinger/urologi/prostata" },
   { label: "Forebygging", href: "/behandlinger/urologi/prostata" },
   { label: "Utredning", href: "/behandlinger/urologi/prostata" },
 ],
 href: "/booking?kategori=urologi&tjeneste=prostatasjekk",
 cta: "Bestill prostatasjekk",
 },
 {
 n: "04",
 title: "Sterilisering og fertilitet",
 desc:
 "Sterilisering, refertilisering og utredning av mannlig infertilitet — raskt, trygt og med kort restitusjon.",
 tags: [
   { label: "Vasektomi", href: "/behandlinger/urologi/sterilisering" },
   { label: "Refertilisering", href: "/behandlinger/urologi/refertilisering" },
 ],
 href: "/booking?kategori=urologi",
 cta: "Bestill time",
 },
];

const expertAreas = [
 {
 title: "Prostata og urinveier",
 desc:
 "Prostatasjekk, forstørret prostata, prostatakreft, blære- og nyreutredning. Vi har Norges fremste urologer.",
 href: "/behandlinger/urologi/prostata",
 image: getServiceImageFromHref("/behandlinger/urologi/prostata") ?? expertProstata,
 },
 {
 title: "Testikler og pung",
 desc:
 "Kul, hevelse, smerter eller varicocele — grundig undersøkelse og behandling med spesialister du kan stole på.",
 href: "/behandlinger/urologi/testikler",
 image: getServiceImageFromHref("/behandlinger/urologi/testikler") ?? expertTestikler,
 },
 {
 title: "Penis, forhud og potens",
 desc:
 "Trang forhud, skjev penis, ereksjonsproblemer og lavt testosteron — utredning og behandling i trygge rammer.",
 href: "/behandlinger/urologi/forhud",
 image: getServiceImageFromHref("/behandlinger/urologi/forhud") ?? expertPenis,
 },
 {
 title: "Robotassistert kirurgi",
 desc:
 "Eneste private aktør i Norge med robotassisterte operasjoner. Mer presis kirurgi og raskere restitusjon.",
 href: "/behandlinger/urologi/robotkirurgi",
 image: getServiceImageFromHref("/behandlinger/urologi/robotkirurgi") ?? expertProstata,
 },
];

const serviceGroups: { label: string; items: { title: string; desc: string; href: string }[] }[] = [
  {
    label: "Undersøkelse og utredning",
    items: [
      { title: "Prostatasjekk", desc: "Utredning og PSA", href: "/behandlinger/urologi/prostata" },
      { title: "Blære og urinveier", desc: "Utredning og behandling", href: "/behandlinger/urologi/blaere" },
      { title: "Nyrer", desc: "Cyster, tumor og nefrektomi", href: "/behandlinger/urologi/nyrer" },
      { title: "Kul i pungen", desc: "Utredning og behandling", href: "/behandlinger/urologi/testikler" },
      { title: "Smerter i testiklene", desc: "Utredning og behandling", href: "/behandlinger/urologi/testikler" },
      { title: "Mannlig infertilitet", desc: "Utredning og behandling", href: "/behandlinger/urologi/infertilitet" },
    ],
  },
  {
    label: "Behandling og kirurgi",
    items: [
      { title: "Forstørret prostata", desc: "Medisinsk og kirurgisk", href: "/behandlinger/urologi/prostata" },
      { title: "Prostatakreft", desc: "Diagnose og behandling", href: "/behandlinger/urologi/prostata" },
      { title: "Trang forhud (fimose)", desc: "Konservativ og kirurgisk", href: "/behandlinger/urologi/forhud" },
      { title: "Sterilisering (vasektomi)", desc: "Trygt og raskt inngrep", href: "/behandlinger/urologi/sterilisering" },
      { title: "Refertilisering", desc: "Mikrokirurgisk inngrep", href: "/behandlinger/urologi/refertilisering" },
      { title: "Robotassistert kirurgi", desc: "Avansert minimalt invasiv", href: "/behandlinger/urologi/robotkirurgi" },
    ],
  },
];

const journey = [
 { n: "01", title: "Bestill time", desc: "Online booking døgnet rundt. Ingen henvisning, ingen ventetid — du finner et tidspunkt som passer." },
 { n: "02", title: "Samtalen som rekker", desc: "Du møter en urolog som jobber med nettopp det du trenger hjelp med. Vi tar oss tid til historikk og spørsmål." },
 { n: "03", title: "Utredning og plan", desc: "Trygg klinisk undersøkelse og en konkret plan — på et språk du forstår. Prøver og ultralyd ofte samme dag." },
 { n: "04", title: "Tverrfaglig oppfølging", desc: "Ved behov samarbeider urologen med gynekolog, fertilitetsspesialist, psykolog og sexolog — alt under samme tak." },
];

const reviews = [
 { text: "Endelig en urolog som tok seg tid til å forklare. Trygt og profesjonelt fra første minutt.", author: "Per H.", date: "1 måned siden" },
 { text: "Rask time, grundig undersøkelse og tydelig plan. Slik skal det være.", author: "Jan E.", date: "3 måneder siden" },
 { text: "Vasektomi gjort på under en time, helt smertefritt. Veldig fornøyd med oppfølgingen.", author: "Tom S.", date: "2 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
 PAGE
 ────────────────────────────────────────────────────────────── */

const UrologiPage = ({ isChatOpen }: PageProps) => {
 const expertAreasRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
 document.title = "Urologi | CMedical — Spesialister du kan stole på";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <PageSEO
 title="Urologi | CMedical — Spesialister du kan stole på"
 description="Spesialisturologi hos CMedical. Prostata, blære, testikler, ereksjon og robotkirurgi — uten henvisning, uten ventetid."
 canonical="/urologi"
  breadcrumbs={[
  { name: "Hjem", path: "/" },
  { name: "Urologi", path: "/urologi" },
  ]}
 jsonLd={{
 "@context": "https://schema.org",
 "@type": "MedicalSpecialty",
 name: "Urologi",
 provider: { "@type": "MedicalClinic", name: "CMedical" },
 }}
 />
 <h1 className="sr-only">
 Urologi hos CMedical — spesialister du kan stole på
 </h1>

 {/* 1. HERO — split 50/50 */}
 <header className="bg-brand-light pt-[4.5rem] lg:pt-0">
 <div className="lg:hidden px-6 md:px-16 pb-4">
   <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
     <Link to="/" className="hover:text-foreground">Hjem</Link>
     <span aria-hidden="true">›</span>
     <span className="text-foreground/80">Urologi</span>
   </nav>
   <h2 className="text-4xl font-light text-foreground leading-[1.05]">
     Spesialister <span className="block italic">du kan stole på</span>
   </h2>
 </div>
 <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-hero">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
  <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
    <Link to="/" className="hover:text-foreground">Hjem</Link>
    <span aria-hidden="true">›</span>
    <span className="text-foreground/80">Urologi</span>
  </nav>
  <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
  Spesialister <span className="block italic">du kan stole på</span>
  </h2>

 <Editable
   as="p"
   field="hero.description"
   multiline
   pagePath="/urologi"
   className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground block"
 >
   {`Plager i underlivet er vanligere enn du tror — og enklere å hjelpe enn du kanskje frykter. CMedical er eneste private aktør i Norge som tilbyr robotassisterte operasjoner.`}
 </Editable>

 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() =>
 (window.location.href = buildBookingUrl({
 kategori: "urologi",
 }))
 }
 >
 <Editable field="hero.cta" pagePath="/urologi">Bestill urologtime</Editable>
 </Button>
 <CallUsClinicPicker variant="light" label="Ring oss" />
 </div>

 <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
 <li className="flex items-center gap-2">
 <Check className="w-4 h-4" aria-hidden="true" />
 Ingen henvisning
 </li>
 <li className="flex items-center gap-2">
 <Check className="w-4 h-4" aria-hidden="true" />
 Korte ventetider
 </li>
 </ul>
 </div>
 </div>

 <SplitHeroMedia
 className="min-h-[420px] lg:min-h-full"
 src={urologiHero.url}
 alt="Urologi hos CMedical"
 />
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* 2. SEGMENT — Hvor er du nå? */}
 <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <div className="max-w-2xl mb-10">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Vi møter deg der du er — uansett hvorfor du tar kontakt.
 </h2>
 </div>

 <LifePhasesCarousel phases={lifePhases} />
 </div>
 </div>
 </section>


 {/* 3. EKSPERTER */}
 <section className="bg-secondary/40 py-14 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="section-head">
 <div className="lg:col-span-6">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Eksperter som jobber med det de kan aller best.
 </h2>
 </div>
 <div className="lg:col-span-6 lg:pt-3">
 <p className="text-base font-light text-muted-foreground leading-relaxed">
 Hos oss møter du urologer som har spesialisert seg dypt
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
 <ReadMoreLink>Les mer</ReadMoreLink>
 </div>
 </Link>
 ))}
 </div>
 <ScrollArrows scrollRef={expertAreasRef} trailing={<CarouselCta to="/tjenester">Se alle behandlinger</CarouselCta>} />
 </div>
 </div>
 </section>

 {/* 3b. SYMPTOMSJEKK */}
 <SymptomServiceSection
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
 items={[
 { symptom: "Svak eller hyppig vannlating", service: "Prostatautredning", href: "/behandlinger/urologi/prostata" },
 { symptom: "Forhøyet PSA eller mistanke om prostatakreft", service: "Prostatasjekk", href: "/behandlinger/urologi/prostata" },
 { symptom: "Smerter, kul eller hevelse i pungen", service: "Testikkelutredning", href: "/behandlinger/urologi/testikler" },
 { symptom: "Plager fra blære eller urinveier", service: "Blære- og urinveisutredning", href: "/behandlinger/urologi/blaere" },
 { symptom: "Spørsmål om nyrene", service: "Nyreutredning", href: "/behandlinger/urologi/nyrer" },
 { symptom: "Vurderer sterilisering (vasektomi)", service: "Sterilisering", href: "/behandlinger/urologi/sterilisering" },
 ]}
 />

 {/* 4b. STATS */}
 <section className="bg-brand-light text-foreground pt-14 md:pt-28 pb-12 md:pb-16 border-t border-brand-dark/5">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="section-head">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Tall som forteller en historie.
 </h2>
 </div>
 <div className="lg:col-span-7 flex items-end">
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
 Vi måler det vi gjør — fordi du fortjener åpenhet. Her er
 resultatene våre innen urologi de siste årene.
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

  {/* 4. HVA VI TILBYR — gruppert oversikt */}
  <section className="bg-brand-light text-foreground pt-14 md:pt-28 pb-16 md:pb-20">
   <div className="container mx-auto px-6 md:px-16">
    <div className="max-w-6xl mx-auto">
     <div className="section-head">
      <div className="lg:col-span-6">
       <h2 className="text-3xl md:text-5xl font-light leading-tight">
        Hva vi tilbyr
       </h2>
      </div>
      <div className="lg:col-span-6 lg:pt-3">
       <p className="text-base font-light text-muted-foreground leading-relaxed">
        Dette er utredningene, behandlingene og inngrepene vi utfører.
        Vet du allerede hva du trenger? Velg fra listen — eller les mer
        om den enkelte tjenesten.
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


 {/* 5. REVIEWS */}
 <PatientFeedbackCarousel reviews={reviews} />

      <ClinicPillarsSection
        title="Nordens ledende urologimiljø — samlet på ett sted."
        intro="Hos CMedical møter du flere av Nordens ledende spesialister innen urologi — med direkte tilgang til riktig ekspertise, uten omveier."
        pillars={[
          { n: "01", title: "Ledende på robotkirurgi", desc: "Som eneste private aktør i Norge tilbyr vi robotassistert kirurgi — over 400 robotoperasjoner i året innen blant annet prostata, blære og nyrer." },
          { n: "02", title: "Ledende kompetanse", desc: "Flere av Nordens fremste urologer, i tverrfaglige team med blant annet osteopat, ernæringsfysiolog, psykolog og sexolog." },
          { n: "03", title: "Rask hjelp", desc: "Ingen henvisning og kort ventetid — de fleste får time innen en uke." },
        ]}
        image={urologiTeamTrond.url}
        imageAlt="Urolog i konsultasjon med pasient hos CMedical"
      />

  {/* 6. SPESIALISTER */}

      <SpecialistsScroller
 category="urologi"
 title="Urologene som følger deg."
 seeAllHref="/spesialister?kategori=urologi"
 seeAllLabel="Se alle urologer"
 />

 {/* 7. PASIENTREISEN */}
 <section className="bg-background">
 <div className="container mx-auto px-6 md:px-16 py-14 md:py-28">
 <div className="max-w-6xl mx-auto section-head-plain">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
 Fra første kontakt til riktig behandling.
 </h2>
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
 Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos
 oss, fra du booker time til du er ferdig behandlet.
 </p>
<div className="hidden lg:block">
<Button asChild variant="cta" size="lg" className="px-8">
     <Link to={buildBookingUrl({ kategori: "urologi" })}>
     Bestill time
     </Link>
     </Button>
</div>
 </div>

<div className="lg:col-span-7">
 <div className="divide-y divide-border/60 border-t border-border/60">
 {journey.map((step) => (
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
 </div>
 </div>
   <div className="max-w-6xl mx-auto mt-12 lg:hidden">
     <Button asChild variant="cta" size="lg" className="px-8">
     <Link to={buildBookingUrl({ kategori: "urologi" })}>
     Bestill time
     </Link>
     </Button>
   </div>
 </div>
 </section>

 {/* UNIFIED PRE-FOOTER CTA — samme som hjem */}
      <InsurancePartners />
      <BookingCTA />

 <LeadPopup />
 </EditableAutoScope></PageLayout>
 );
};

export default UrologiPage;
