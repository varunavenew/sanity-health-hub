import { useEffect, useRef } from "react";
import { StatsSkinBackground } from "@/components/shared/StatsSkinBackground";
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

import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { ClinicPillarsSection } from "@/components/treatments/ClinicPillarsSection";
import spotlightImg from "@/assets/hero/hero-clinic-lounge.jpg";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getServiceImageFromHref } from "@/data/serviceImages";

import flereHero from "@/assets/categories/flere-fagomrader.jpg";
import { PatientFeedbackCarousel } from "@/components/treatments/PatientFeedbackCarousel";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";
import { TRUST_NO_REFERRAL, TRUST_SHORT_WAIT } from "@/lib/trustTags";

interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA
 ────────────────────────────────────────────────────────────── */

const expertAreasRaw: { title: string; desc: string; href: string }[] = [
  { title: "Endokrinologi", desc: "Diabetes, skjoldbrusk, hormoner", href: "/behandlinger/flere-fagomrader/endokrinologi" },
  { title: "Ernæringsfysiolog", desc: "Kosthold, vekttap, intoleranser", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
  { title: "Hudhelse", desc: "Hudlege, hudbehandlinger, føflekksjekk", href: "/behandlinger/flere-fagomrader/hudhelse" },
  { title: "Gastrokirurgi", desc: "Mage, tarm, overvektskirurgi, brokk, hemorroider", href: "/behandlinger/flere-fagomrader/gastrokirurgi" },
  { title: "Plastikkirurgi", desc: "Rekonstruksjon og estetisk", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
  { title: "Robotassistert kirurgi", desc: "Presis, skånsom kirurgi", href: "/behandlinger/flere-fagomrader/robotkirurgi" },
  { title: "Åreknutebehandling", desc: "Sklerosering, laser, kirurgi", href: "/behandlinger/flere-fagomrader/areknuter" },
  { title: "Osteopati", desc: "Muskel, skjelett, kroniske smerter", href: "/behandlinger/flere-fagomrader/osteopati" },
  { title: "Revmatologi", desc: "Leddgikt, artrose, bindevev", href: "/behandlinger/flere-fagomrader/revmatologi" },
  { title: "Psykologi", desc: "Angst, depresjon, traumer", href: "/behandlinger/flere-fagomrader/psykologi" },
  { title: "Sexologi", desc: "Seksuell helse, samliv, identitet", href: "/behandlinger/flere-fagomrader/sexologi" },
];

const expertAreas = expertAreasRaw.map((a) => ({
  ...a,
  image: getServiceImageFromHref(a.href) ?? flereHero,
}));

const journey = [
 { n: "01", title: "Bestill når det passer deg", desc: "Online booking døgnet rundt. Usikker på hvem du trenger? Ring oss — vi hjelper deg finne riktig spesialist." },
 { n: "02", title: "Samtalen som rekker", desc: "Du møter en spesialist som utelukkende jobber med det du trenger. Vi tar oss tid og forklarer på et språk du forstår." },
 { n: "03", title: "Utredning og plan", desc: "En konkret plan på et språk du forstår. Trenger du videre oppfølging eller samarbeid med andre spesialister, koordinerer vi det." },
 { n: "04", title: "Tverrfaglig oppfølging", desc: "Spesialistene jobber i team. En sexolog samarbeider med gynekologen, en psykolog med urologen — du slipper å starte på nytt." },
];

const reviews = [
 { text: "Endelig en psykolog som virkelig lyttet. Jeg følte meg sett fra første time.", author: "Hanne L.", date: "1 måned siden" },
 { text: "Kombinasjonen av ernæringsfysiolog og endokrinolog forandret hverdagen min.", author: "Eva M.", date: "3 måneder siden" },
 { text: "Hudlegen var grundig og forklarte alt. Trygg behandling i hyggelige omgivelser.", author: "Sondre K.", date: "2 måneder siden" },
];

/* ──────────────────────────────────────────────────────────────
 PAGE
 ────────────────────────────────────────────────────────────── */

const FlereFagomraderPage = ({ isChatOpen }: PageProps) => {
 const expertAreasRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
 document.title = "Flere tjenester | CMedical — Tverrfaglige spesialister";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <PageSEO
 title="Flere tjenester | CMedical — Tverrfaglige spesialister"
 description="Hud, psykologi, sexologi, ernæring, kirurgi og mer — Nordens fremste spesialister, ofte i tverrfaglige team. Kort ventetid, ingen henvisning."
 canonical="/flere-fagomrader"
  breadcrumbs={[
  { name: "Hjem", path: "/" },
  { name: "Flere tjenester", path: "/flere-fagomrader" },
  ]}
 jsonLd={{
 "@context": "https://schema.org",
 "@type": "MedicalClinic",
 name: "CMedical – Flere tjenester",
 }}
 />
 <h1 className="sr-only">
 Flere tjenester hos CMedical — tverrfaglige spesialister
 </h1>

 {/* 1. HERO */}
 <header className="bg-brand-light pt-[4.5rem] lg:pt-0">
 <div className="lg:hidden px-6 md:px-16 pb-4">
   <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
     <Link to="/" className="hover:text-foreground">Hjem</Link>
     <span aria-hidden="true">›</span>
     <span className="text-foreground/80">Flere tjenester</span>
   </nav>
   <h2 className="text-4xl font-light text-foreground leading-[1.05]">
     Spesialister <span className="block italic">i team</span>
   </h2>
 </div>
 <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-hero">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
  <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
    <Link to="/" className="hover:text-foreground">Hjem</Link>
    <span aria-hidden="true">›</span>
    <span className="text-foreground/80">Flere tjenester</span>
  </nav>
  <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
  Spesialister <span className="block italic">i team</span>
  </h2>

 <Editable
   as="p"
   field="hero.description"
   multiline
   pagePath="/flere-fagomrader"
   className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground block"
 >
   {`Vi har samlet noen av Nordens fremste spesialister innen hud, psykologi, sexologi, ernæring og kirurgi. Spesialistene jobber i tverrfaglige team — og utelukkende med det de kan aller best.`}
 </Editable>

 <div className="hidden sm:flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() =>
 (window.location.href = buildBookingUrl({
 kategori: "flere-fagomrader",
 }))
 }
 >
 <Editable field="hero.cta" pagePath="/flere-fagomrader">Bestill time</Editable>
 </Button>
 <CallUsClinicPicker variant="light" label="Ring oss" />
 </div>

 <ul className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
 <li className="flex items-center gap-2">
 <Check className="w-4 h-4" aria-hidden="true" />
 {TRUST_NO_REFERRAL}
 </li>
 <li className="flex items-center gap-2">
 <Check className="w-4 h-4" aria-hidden="true" />
 {TRUST_SHORT_WAIT}
 </li>
 </ul>
 </div>
 </div>

 <SplitHeroMedia
 className="min-h-[420px] lg:min-h-full"
 src={flereHero}
 alt="Flere tjenester hos CMedical"
 />
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>


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
 Hos oss møter du spesialister som har spesialisert seg dypt
 innenfor sitt fagfelt — og som samarbeider på tvers når det
 trengs.
 </p>
 </div>
 </div>

 <div ref={expertAreasRef} className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
 {expertAreas.map((a) => (
 <Link
 key={a.title}
 to={a.href}
 className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden w-full"
 >
 <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
 <img
 src={a.image}
 alt={a.title}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
 />
 </div>
 <div className="p-6 md:p-7 flex flex-col flex-1">
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
 </div>
 </div>
 </section>


 {/* 4b. STATS */}
 <section className="stats-band-dark relative overflow-hidden pt-14 md:pt-28 pb-12 md:pb-16 border-t border-brand-dark/5">
 <StatsSkinBackground />
 <div className="relative container mx-auto px-6 md:px-16">
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
 resultatene fra spesialistene våre på tvers av fagfelt.
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


 {/* 5. REVIEWS */}
 <PatientFeedbackCarousel reviews={reviews} />

      <ClinicPillarsSection
        title="Nordens fremste spesialister — samlet på ett sted."
        intro="Vi har samlet noen av Nordens fremste spesialister innen blant annet gastrokirurgi, revmatologi, hudhelse, ernæringsfysiologi, osteopati, psykologi og sexologi."
        pillars={[
          { n: "01", title: "Alt under samme tak", desc: "Utredning, behandling og oppfølging på tvers av fagområder — du slipper å bli sendt videre." },
          { n: "02", title: "Tverrfaglige team", desc: "Spesialistene samarbeider på tvers av fagfelt for å gi deg helhetlig og persontilpasset behandling." },
          { n: "03", title: "Rask hjelp", desc: "Ingen henvisning og kort ventetid — de fleste får time innen en uke." },
        ]}
        image={flereHero}
        imageAlt="Tverrfaglig spesialistteam hos CMedical"
      />

  {/* 6. SPESIALISTER */}

      <SpecialistsScroller
 category="annet"
 title="Spesialistene som følger deg."
 seeAllHref="/spesialister?kategori=annet"
 seeAllLabel="Se alle spesialister"
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
     <Link to={buildBookingUrl({ kategori: "flere-fagomrader" })}>
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
     <Link to={buildBookingUrl({ kategori: "flere-fagomrader" })}>
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

export default FlereFagomraderPage;
