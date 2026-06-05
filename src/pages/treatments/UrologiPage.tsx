import { useEffect, useMemo } from "react";
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
import spotlightImg from "@/assets/hero/cmedical-hands.jpg";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { TagList } from "@/components/treatments/TagList";

import urologiHero from "@/assets/categories/urologi-real.jpg";
import expertProstata from "@/assets/hero/robotkirurgi-hero.jpg";
import expertTestikler from "@/assets/hero/urology-hero.jpg";
import expertPenis from "@/assets/hero/cmedical-hero-2.jpg";
import expertKvinne from "@/assets/hero/hero-clinic-lounge.jpg";

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
   { label: "Ereksjon", href: "/behandlinger/urologi/ereksjon" },
 ],
 href: "/booking?kategori=urologi",
 },
 {
 n: "02",
 title: "Kvinne med urologiske plager",
 desc:
 "Urinlekkasje, hyppig vannlating, blæreinfeksjoner eller blod i urinen — urologi gjelder ikke bare menn.",
 tags: [
   { label: "Inkontinens", href: "/behandlinger/urologi/urinlekkasje" },
   { label: "Blære", href: "/behandlinger/urologi/blare" },
   { label: "Nyrer", href: "/behandlinger/urologi/nyrer" },
 ],
 href: "/booking?kategori=urologi",
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
 },
];

const expertAreas = [
 {
 eyebrow: "Spesialfelt",
 title: "Prostata og urinveier",
 desc:
 "Prostatasjekk, forstørret prostata, prostatakreft, blære- og nyreutredning. Vi har Norges fremste urologer.",
 href: "/behandlinger/urologi/prostata",
 image: expertProstata,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Testikler og pung",
 desc:
 "Kul, hevelse, smerter eller varicocele — grundig undersøkelse og behandling med spesialister du kan stole på.",
 href: "/behandlinger/urologi/testikler",
 image: expertTestikler,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Penis, forhud og potens",
 desc:
 "Trang forhud, skjev penis, ereksjonsproblemer og lavt testosteron — utredning og behandling i trygge rammer.",
 href: "/behandlinger/urologi/penis",
 image: expertPenis,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Robotassistert kirurgi",
 desc:
 "Eneste private aktør i Norge med robotassisterte operasjoner. Mer presis kirurgi og raskere restitusjon.",
 href: "/behandlinger/urologi/robotkirurgi",
 image: expertProstata,
 },
];

const allServices = [
 { title: "Prostatasjekk", desc: "Utredning og PSA", href: "/behandlinger/urologi/prostata" },
 { title: "Forstørret prostata", desc: "Medisinsk og kirurgisk", href: "/behandlinger/urologi/prostata" },
 { title: "Prostatakreft", desc: "Diagnose og behandling", href: "/behandlinger/urologi/prostata" },
 { title: "Blære og urinveier", desc: "Utredning og behandling", href: "/behandlinger/urologi/blare" },
 { title: "Urinlekkasje", desc: "Konservativ og kirurgisk", href: "/behandlinger/urologi/urinlekkasje" },
 { title: "Nyrer", desc: "Stein, cyster og funksjon", href: "/behandlinger/urologi/nyrer" },
 { title: "Kul i pungen", desc: "Utredning og behandling", href: "/behandlinger/urologi/testikler" },
 { title: "Smerter i testiklene", desc: "Utredning og behandling", href: "/behandlinger/urologi/testikler" },
 { title: "Varicocele", desc: "Utredning og kirurgi", href: "/behandlinger/urologi/varicocele" },
 { title: "Trang forhud (fimose)", desc: "Konservativ og kirurgisk", href: "/behandlinger/urologi/forhud" },
 { title: "Skjev penis", desc: "Utredning og behandling", href: "/behandlinger/urologi/penis" },
 { title: "Ereksjonsproblemer", desc: "Utredning og oppfølging", href: "/behandlinger/urologi/ereksjon" },
 { title: "Lavt testosteron", desc: "Utredning og behandling", href: "/behandlinger/urologi/testosteron" },
 { title: "Sterilisering (vasektomi)", desc: "Trygt og raskt inngrep", href: "/behandlinger/urologi/sterilisering" },
 { title: "Refertilisering", desc: "Mikrokirurgisk inngrep", href: "/behandlinger/urologi/refertilisering" },
 { title: "Mannlig infertilitet", desc: "Utredning og behandling", href: "/behandlinger/urologi/infertilitet" },
 { title: "Robotassistert kirurgi", desc: "Avansert minimalt invasiv", href: "/behandlinger/urologi/robotkirurgi" },
 { title: "Brokk", desc: "Robotassistert kirurgi", href: "/behandlinger/urologi/brokk" },
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
 useEffect(() => {
 document.title = "Urologi | CMedical — Spesialister du kan stole på";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title="Urologi | CMedical — Spesialister du kan stole på"
 description="Spesialisturologi hos CMedical. Prostata, blære, testikler, ereksjon og robotkirurgi — uten henvisning, uten ventetid."
 canonical="/urologi"
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Tjenester", path: "/tjenester" },
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
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Spesialister <span className="block italic">du kan stole på</span>
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Plager i underlivet er vanligere enn du tror — og enklere å
 hjelpe enn du kanskje frykter. CMedical er eneste private aktør
 i Norge som tilbyr robotassisterte operasjoner.
 </p>

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
 Bestill urologtime
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
 src={urologiHero}
 alt="Urologi hos CMedical"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* 2. SEGMENT — Hvor er du nå? */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Vi møter deg der du er — uansett hvorfor du tar kontakt.
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
 <div className="flex flex-wrap gap-1.5 mb-5">
 {p.tags.map((tag) => (
 <span
 key={tag}
 className="text-xs font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-full"
 >
 {tag}
 </span>
 ))}
 </div>
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
 Hos oss møter du urologer som har spesialisert seg dypt
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
 { symptom: "Svak eller hyppig vannlating", service: "Prostatautredning", href: "/booking?kategori=urologi&tjeneste=prostata" },
 { symptom: "Forhøyet PSA eller mistanke om prostatakreft", service: "Prostatasjekk", href: "/booking?kategori=urologi&tjeneste=prostatasjekk" },
 { symptom: "Smerter, kul eller hevelse i pungen", service: "Testikkelutredning", href: "/booking?kategori=urologi&tjeneste=testikler" },
 { symptom: "Ereksjonsproblemer eller lavt testosteron", service: "Potens- og hormonutredning", href: "/booking?kategori=urologi&tjeneste=ereksjon" },
 { symptom: "Urinlekkasje eller blæreplager", service: "Bekkenbunns- og blæreutredning", href: "/booking?kategori=urologi&tjeneste=urinlekkasje" },
 { symptom: "Vurderer sterilisering (vasektomi)", service: "Sterilisering", href: "/booking?kategori=urologi&tjeneste=sterilisering" },
 ]}
 />

 {/* 4b. STATS */}
 <section className="bg-brand-light text-foreground py-20 md:py-28 border-t border-brand-dark/5">
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
 resultatene våre innen urologi de siste årene.
 </p>
 </div>
 </div>

 <div className="border-t border-brand-dark/5 py-8 md:py-10">
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {[
 { v: "400+", k: "Robotoperasjoner", sub: "Per år" },
 { v: "8 200", k: "Konsultasjoner", sub: "I 2024" },
 { v: "97%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
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

 {/* 4. ALLE BEHANDLINGER */}
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
 Klikk og book direkte, eller les mer om den enkelte
 urologiske utredningen eller behandlingen.
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
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {s.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-snug">
 {s.desc}
 </p>
 </div>
 <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* 5. REVIEWS */}
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
 <FeatureSpotlight
        title={`Når er det riktig å snakke med en urolog?`}
        text="Mange venter for lenge. Her er tegnene som er verdt en konsultasjon — og hva en utredning faktisk innebærer."
        ctaLabel="Les mer"
        ctaHref="/aktuelt"
        image={spotlightImg}
        imageAlt=""
      />

      <SpecialistsScroller
 category="urologi"
 title="Urologene som følger deg."
 seeAllHref="/spesialister?kategori=urologi"
 seeAllLabel="Se alle urologer"
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
 <Link to={buildBookingUrl({ kategori: "urologi" })}>
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

export default UrologiPage;
