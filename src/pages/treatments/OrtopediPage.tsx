import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Quote } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { LeadPopup } from "@/components/LeadPopup";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import spotlightImg from "@/assets/hero/hero-treatment.jpg";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { TagList } from "@/components/treatments/TagList";

import ortopediHero from "@/assets/categories/ortopedi-real.jpg";
import expertSkulder from "@/assets/hero/hero-treatment.jpg";
import expertKne from "@/assets/hero/hero-technology.jpg";
import expertHand from "@/assets/hero/cmedical-hands.jpg";
import expertSecondOpinion from "@/assets/hero/cmedical-hero-3.jpg";

interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA
 ────────────────────────────────────────────────────────────── */

const lifePhases = [
 {
 n: "01",
 title: "Akutt skade eller smerte",
 desc:
 "Vridd kne, vondt etter et fall, akutt skulder- eller hoftesmerte — vi ser deg raskt og legger en plan med en gang.",
 tags: [
   { label: "Akutt", href: "/booking?kategori=ortopedi" },
   { label: "Diagnose", href: "/behandlinger/ortopedi/second-opinion" },
   { label: "MR", href: "/booking?kategori=ortopedi" },
 ],
 href: "/booking?kategori=ortopedi",
 },
 {
 n: "02",
 title: "Slitasje og kroniske plager",
 desc:
 "Kne- og hofteslitasje, frossen skulder, langvarige smerter — utredning og behandling i ditt tempo.",
 tags: [
   { label: "Artrose", href: "/behandlinger/ortopedi/kne" },
   { label: "Smerte", href: "/behandlinger/ortopedi/skulder" },
   { label: "Bevegelse", href: "/behandlinger/ortopedi/hofte" },
 ],
 href: "/booking?kategori=ortopedi",
 },
 {
 n: "03",
 title: "Trenger second opinion",
 desc:
 "Har du fått en diagnose du er usikker på? Vi får ofte pasienter med kompliserte caser — og ser dem med nye øyne.",
 tags: [
   { label: "Second opinion", href: "/behandlinger/ortopedi/second-opinion" },
   { label: "Vurdering", href: "/behandlinger/ortopedi/second-opinion" },
 ],
 href: "/booking?kategori=ortopedi&tjeneste=second-opinion",
 },
 {
 n: "04",
 title: "Klar for kirurgi eller injeksjon",
 desc:
 "Artroskopi, kortisoninjeksjon, PRP eller hyaluronsyre — vi tilbyr hele bredden av ortopediske behandlinger.",
 tags: [
   { label: "Kirurgi", href: "/behandlinger/ortopedi/artroskopi" },
   { label: "PRP", href: "/behandlinger/ortopedi/kne" },
   { label: "Injeksjon", href: "/behandlinger/ortopedi/kne" },
 ],
 href: "/booking?kategori=ortopedi",
 },
];

const expertAreas = [
 {
 title: "Skulder",
 desc:
 "Inneklemming, kalkavleiringer, rotatormansjettskader, frossen og ustabil skulder — utredet og behandlet av spesialister.",
 href: "/behandlinger/ortopedi/skulder",
 image: expertSkulder,
 },
 {
 title: "Kne og hofte",
 desc:
 "Korsbånd, menisk, slitasje og labrumskader. Vi tilbyr både konservativ behandling og avansert artroskopi.",
 href: "/behandlinger/ortopedi/kne",
 image: expertKne,
 },
 {
 title: "Hånd, albue og fot",
 desc:
 "Karpaltunnel, tennisalbue, Dupuytren, hælspore — presisjonskirurgi og injeksjonsbehandling.",
 href: "/behandlinger/ortopedi/hand",
 image: expertHand,
 },
 {
 title: "Andre vurdering",
 desc:
 "Kompliserte skader eller diagnoser du er usikker på? Noen av landets fremste ortopeder ser på det med nye øyne.",
 href: "/behandlinger/ortopedi/second-opinion",
 image: expertSecondOpinion,
 },
];

const serviceGroups: { label: string; items: { title: string; desc: string; href: string }[] }[] = [
  {
    label: "Undersøkelse og utredning",
    items: [
      { title: "Inneklemming (impingement)", desc: "Skulder — utredning og behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Kalkavleiringer", desc: "Skulder — utredning og behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Rotatormansjettskader", desc: "Skulder — utredning og behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Frossen skulder", desc: "Skulder — utredning og behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Kneslitasje", desc: "Kne — utredning og behandling", href: "/behandlinger/ortopedi/kne" },
      { title: "Hofteslitasje", desc: "Hofte — utredning og behandling", href: "/behandlinger/ortopedi/hofte" },
      { title: "Labrumskade i hofte", desc: "Hofte — utredning og behandling", href: "/behandlinger/ortopedi/hofte" },
      { title: "Tennisalbue og golfalbue", desc: "Albue — utredning og behandling", href: "/behandlinger/ortopedi/albue" },
      { title: "Hælspore og hælsmerter", desc: "Fot — utredning og behandling", href: "/behandlinger/ortopedi/fot" },
      { title: "Ankelbåndskader", desc: "Fot — utredning og behandling", href: "/behandlinger/ortopedi/fot" },
    ],
  },
  {
    label: "Behandling og kirurgi",
    items: [
      { title: "Kortisoninjeksjoner", desc: "Injeksjonsbehandling", href: "/behandlinger/ortopedi/injeksjon" },
      { title: "Blodspinningsteknikk (PRP)", desc: "Injeksjonsbehandling", href: "/behandlinger/ortopedi/prp" },
      { title: "Korsbåndruptur", desc: "Kne — utredning og kirurgi", href: "/behandlinger/ortopedi/kne" },
      { title: "Meniskskader", desc: "Kne — utredning og kirurgi", href: "/behandlinger/ortopedi/kne" },
      { title: "Karpaltunnelsyndrom", desc: "Hånd — utredning og kirurgi", href: "/behandlinger/ortopedi/hand" },
      { title: "Dupuytrens kontraktur", desc: "Hånd — utredning og kirurgi", href: "/behandlinger/ortopedi/hand" },
      { title: "Artroskopi", desc: "Kirurgisk behandling", href: "/behandlinger/ortopedi/artroskopi" },
    ],
  },
];

const journey = [
 { n: "01", title: "Bestill når det passer deg", desc: "Online booking døgnet rundt. Ingen henvisning, ingen ventetid — vi matcher deg med riktig spesialist." },
 { n: "02", title: "Samtalen som rekker", desc: "Du møter en ortoped som jobber med ditt område. Vi tar historikk, ser på bilder og gjør en grundig undersøkelse." },
 { n: "03", title: "Diagnose og plan", desc: "Du forlater konsultasjonen med en klar diagnose og en konkret plan — på et språk du forstår." },
 { n: "04", title: "Tverrfaglig oppfølging", desc: "Ved behov samarbeider ortopeden med fysioterapeut, manuellterapeut, osteopat og ernæringsfysiolog." },
];

const reviews = [
 { text: "Endelig fikk jeg en klar diagnose og en plan. Ortopeden tok seg tid og forklarte alt grundig.", author: "Knut R.", date: "2 måneder siden" },
 { text: "Operert på kneet og tilbake i trening på 8 uker. Profesjonelt fra start til slutt.", author: "Mari T.", date: "3 måneder siden" },
 { text: "Second opinion som forandret alt. Anbefales på det varmeste.", author: "Lars B.", date: "1 måned siden" },
];

/* ──────────────────────────────────────────────────────────────
 PAGE
 ────────────────────────────────────────────────────────────── */

const OrtopediPage = ({ isChatOpen }: PageProps) => {
 useEffect(() => {
 document.title = "Ortopedi | CMedical — Når det gjør vondt";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title="Ortopedi | CMedical — Når det gjør vondt"
 description="Spesialistortopedi hos CMedical. Skulder, kne, hofte, hånd og fot — diagnose og plan på første konsultasjon. Ingen henvisning, ingen ventetid."
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
 <h1 className="sr-only">Ortopedi hos CMedical — når det gjør vondt</h1>

 {/* 1. HERO */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Det gjør vondt. <span className="block italic">La oss finne ut hvorfor.</span>
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Våre ortopeder er eksperter på skader og sykdommer i muskler,
 bein, ledd og sener. Noen av landets fremste kirurger jobber
 hos oss — også med second opinion.
 </p>

 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() =>
 (window.location.href = buildBookingUrl({
 kategori: "ortopedi",
 }))
 }
 >
 Bestill ortopedtime
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
 <li className="flex items-center gap-2">
 <Check className="w-4 h-4" aria-hidden="true" />
 Erfarne spesialister
 </li>
 </ul>
 </div>
 </div>

 <div className="relative min-h-[420px] lg:min-h-full">
 <img
 src={ortopediHero}
 alt="Ortopedi hos CMedical"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* 2. SEGMENT */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Vi møter deg uansett hvorfor du tar kontakt.
 </h2>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {lifePhases.map((p) => (
 <div key={p.n} className="bg-background p-7 flex flex-col">
 <h3 className="text-lg font-normal mb-4 leading-snug text-foreground">
 {p.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
 {p.desc}
 </p>
 <TagList tags={p.tags ?? []} initialVisible={3} className="mb-5" />
 <Link
 to={p.href}
 className="inline-flex items-center text-sm font-light text-foreground hover:gap-2.5 gap-2 transition-all"
 >
 Les mer
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* 3. EKSPERTER */}
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
 Hos oss møter du ortopeder som har spesialisert seg dypt
 innenfor sitt fagfelt — fra skulder og kne til hånd og fot.
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

 {/* 3b. SYMPTOMSJEKK */}
 <SymptomServiceSection
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
 items={[
 { symptom: "Smerter i skulderen ved løft", service: "Skulderutredning", href: "/booking?kategori=ortopedi&tjeneste=skulder" },
 { symptom: "Vondt eller ustabilt kne", service: "Kneutredning", href: "/booking?kategori=ortopedi&tjeneste=kne" },
 { symptom: "Hofteslitasje eller liesmerter", service: "Hofteutredning", href: "/booking?kategori=ortopedi&tjeneste=hofte" },
 { symptom: "Nummenhet eller stikninger i hånden", service: "Karpaltunnel-utredning", href: "/booking?kategori=ortopedi&tjeneste=hand" },
 { symptom: "Vondt i albuen ved gripe-bevegelser", service: "Tennisalbue-utredning", href: "/booking?kategori=ortopedi&tjeneste=albue" },
 { symptom: "Diagnose du er usikker på", service: "Second opinion", href: "/booking?kategori=ortopedi&tjeneste=second-opinion" },
 ]}
 />

 {/* 4b. STATS */}
 <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-12 md:pb-16 border-t border-brand-dark/5">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Tall som forteller en historie.
 </h2>
 </div>
 <div className="lg:col-span-7 flex items-end">
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
 Vi måler det vi gjør — fordi du fortjener åpenhet. Her er
 resultatene våre innen ortopedi de siste årene.
 </p>
 </div>
 </div>

 <div className="border-t border-brand-dark/5 py-8 md:py-10">
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {[
 { v: "12 400+", k: "Konsultasjoner", sub: "Per år" },
 { v: "1 800", k: "Inngrep og artroskopier", sub: "I 2024" },
 { v: "96%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
 { v: "< 7 dager", k: "Ventetid", sub: "Snitt til første time" },
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
  <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-16 md:pb-20">
   <div className="container mx-auto px-6 md:px-16">
    <div className="max-w-6xl mx-auto">
     <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
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
 <section className="bg-brand-warm pt-12 md:pt-16 pb-20 md:pb-24">
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
 </div>
 </div>
 </section>

  {/* 6. SPESIALISTER */}

      <SpecialistsScroller
 category="ortopedi"
 title="Ortopedene som følger deg."
 seeAllHref="/spesialister?kategori=ortopedi"
 seeAllLabel="Se alle ortopeder"
 />

 {/* 7. PASIENTREISEN */}
 <section className="bg-background">
 <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
 Fra første kontakt til riktig behandling.
 </h2>
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
 Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos
 oss, fra du booker time til du er ferdig behandlet.
 </p>
 <Button asChild variant="cta" size="lg" className="px-8">
 <Link to={buildBookingUrl({ kategori: "ortopedi" })}>
 Bestill time
 </Link>
 </Button>
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
 </div>
 </section>

 {/* UNIFIED PRE-FOOTER CTA — samme som hjem */}
      <InsurancePartners />
      <BookingCTA />

 <LeadPopup />
 </PageLayout>
 );
};

export default OrtopediPage;
