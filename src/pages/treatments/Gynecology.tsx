import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Quote } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";

import gynekologiHeroImg from "@/assets/categories/gynekologi-real.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import expertEndometriose from "@/assets/hero/gynecology-hero.jpg";
import expertBekkenbunn from "@/assets/hero/hero-pregnancy.jpg";
import expertOvergangsalder from "@/assets/hero/cmedical-hero-2.jpg";
import expertVulva from "@/assets/hero/kvinnehelse-hero.jpg";

interface PageProps {
 isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
 DATA — livsfaser, spesialistområder, full liste
 ────────────────────────────────────────────────────────────── */

const lifePhases = [
 {
 n: "01",
 title: "Menstruasjonssyklus, hormonell helse og prevensjon",
 desc:
 "Vi hjelper deg med prevensjon, syklusforstyrrelser og hormonelle plager — og finner ut hva som er normalt for nettopp deg.",
 tags: [
 "Prevensjonsveiledning",
 "PCOS & POI",
 "Hormonforstyrrelser",
 "PMS / PMDD",
 "Uregelmessige eller kraftige blødninger",
 "Muskelknuter og polypper",
 ],
 href: "/booking?kategori=gynekologi",
 },
 {
 n: "02",
 title: "Smerter eller ubehag i underlivet og livmoren",
 desc:
 "Vondt under samleie, vedvarende underlivsplager eller funn som bør undersøkes — vi tar oss tid til å forstå hva som skjer.",
 tags: [
 "Vulvodyni",
 "Vaginisme",
 "Hudproblemer i vulva",
 "Test for klamydia / gonoré",
 "Celleforandringer og cyster",
 "Konisering",
 "Endometriose",
 ],
 href: "/booking?kategori=gynekologi",
 },
 {
 n: "03",
 title: "Graviditet, fødsel og tiden etter",
 desc:
 "Svangerskapskontroll, ultralyd, etterkontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
 tags: [
 "Tidlig ultralyd",
 "NIPT",
 "Graviditetsoppfølging",
 "6-ukerskontroll etter fødsel",
 "Spontanabort",
 "Abort",
 "Fremfall og fødselsskader",
 ],
 href: "/booking?kategori=gynekologi",
 },
 {
 n: "04",
 title: "Overgangsalder — på dine premisser",
 desc:
 "Perimenopause og menopause kan være krevende. Vi hjelper deg å forstå kroppen og finner riktig behandling for deg.",
 tags: [
 "Overgangsalder / klimakteriet",
 "Hormonbehandling",
 "Urininkontinens",
 "Tørrhet i underlivet",
 ],
 href: "/booking?kategori=gynekologi",
 },
];

const expertAreas = [
 {
 eyebrow: "Spesialfelt",
 title: "Endometriose",
 desc:
 "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
 href: "/behandlinger/gynekologi/endometriose",
 image: expertEndometriose,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Fødselsskader og bekkenbunnshelse",
 desc:
 "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
 href: "/behandlinger/gynekologi/urinlekkasje",
 image: expertBekkenbunn,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Overgangsalder",
 desc:
 "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
 href: "/behandlinger/gynekologi/overgangsalder",
 image: expertOvergangsalder,
 },
 {
 eyebrow: "Spesialfelt",
 title: "Vulvasmerter",
 desc:
 "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
 href: "/behandlinger/gynekologi/vulvalidelser",
 image: expertVulva,
 },
];

const allServices = [
 { title: "Gynekologisk undersøkelse", desc: "Utredning og samtale", href: "/behandlinger/gynekologi/undersokelse" },
 { title: "Endometriose", desc: "Utredning og behandling", href: "/behandlinger/gynekologi/endometriose" },
 { title: "Overgangsalder", desc: "Hormonbehandling og oppfølging", href: "/behandlinger/gynekologi/overgangsalder" },
 { title: "Urinlekkasje", desc: "Konservativ og kirurgisk behandling", href: "/behandlinger/gynekologi/urinlekkasje" },
 { title: "PCOS", desc: "Utredning og oppfølging", href: "/behandlinger/gynekologi/pcos" },
 { title: "Vulvalidelser", desc: "Spesialisert utredning", href: "/behandlinger/gynekologi/vulvalidelser" },
 { title: "Cellforandringer", desc: "Oppfølging og konisering", href: "/behandlinger/gynekologi/celleforandringer" },
 { title: "PMS og PMDD", desc: "Utredning og behandling", href: "/behandlinger/gynekologi/pms-pmdd" },
 { title: "Cellprøver", desc: "Screening og oppfølging", href: "/behandlinger/gynekologi/undersokelse" },
 { title: "Vaginale fremfall", desc: "Konservativ og kirurgisk", href: "/behandlinger/gynekologi/vaginale-fremfall" },
 { title: "Cyster på eggstokkene", desc: "Utredning og behandling", href: "/behandlinger/gynekologi/cyster" },
 { title: "Robotassistert kirurgi", desc: "Avansert minimalt invasiv", href: "/behandlinger/gynekologi/robotkirurgi" },
 { title: "Hysteroskopi", desc: "Inngrep i livmoren", href: "/behandlinger/gynekologi/kirurgi" },
 { title: "Fjerne livmor", desc: "Planlagt kirurgi", href: "/behandlinger/gynekologi/fjerne-livmor" },
 { title: "Labiaplastikk", desc: "Estetisk og funksjonell", href: "/behandlinger/gynekologi/labiaplastikk" },
];

const journey = [
 { n: "01", title: "Bestill time", desc: "Du ringer eller booker direkte. Ingen henvisning, ingen ventetid — vi finner et tidspunkt som passer." },
 { n: "02", title: "Første konsultasjon og undersøkelse", desc: "Du møter spesialisten din. Vi tar oss tid til samtalen, før vi gjør en grundig undersøkelse." },
 { n: "03", title: "Utredning og plan", desc: "Vi forklarer hva vi finner og legger en plan sammen med deg — i ditt tempo." },
 { n: "04", title: "Behandling og oppfølging", desc: "Konservativ, medikamentell eller kirurgisk — du blir fulgt opp gjennom hele forløpet." },
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
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <p className="text-xs text-foreground/60 mb-8">
 Gynekologi — CMedical
 </p>
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Kvinnehelse <span className="block italic">for livet</span>
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Vi følger deg gjennom hele livet — fra de første spørsmålene
 i tenårene, gjennom svangerskap og overgangsalder, og videre.
 Gynekologene våre jobber med det de kan best, og vi tar oss
 alltid tid til å forstå hele deg.
 </p>

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
 Bestill gynekologisk undersøkelse
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
 src={gynekologiHeroImg}
 alt="Gynekologi hos CMedical"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* ============================================================
 2. MØRK SEGMENT-SEKSJON — Livsfaser
 ============================================================ */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <p className="text-xs text-foreground/60 mb-4">
 Hvor er du nå?
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Kroppen endrer seg gjennom livet — vi er her i alle fasene.
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

 {/* ============================================================
 3. HVORFOR CMEDICAL — Det beste fra to klinikker (tillit tidlig)
 ============================================================ */}
 <section className="bg-background">
 <div className="grid lg:grid-cols-12">
 <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28">
 <div className="max-w-xl">
 <p className="text-xs text-foreground/60 mb-5">
 Hvorfor CMedical
 </p>
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
 </div>
 </div>

 <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
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
 4. EKSPERTER SOM JOBBER MED DET DE KAN ALLER BEST
 ============================================================ */}
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-6">
 <p className="text-xs text-foreground/60 mb-4">
 Spesialistområder
 </p>
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
 <p className="text-xs text-foreground/80 mb-4 uppercase">
 {a.eyebrow}
 </p>
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

 {/* 5. SYMPTOMSJEKK — fra symptom til tjeneste */}
 <SymptomServiceSection
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
 items={[
 { symptom: "Vondt under samleie", service: "Gynekologisk undersøkelse", href: "/booking?kategori=gynekologi&tjeneste=undersokelse" },
 { symptom: "Kraftige eller langvarige menssmerter", service: "Endometriose-utredning", href: "/booking?kategori=gynekologi&tjeneste=endometriose" },
 { symptom: "Urinlekkasje eller bekkenbunnsplager", service: "Bekkenbunnsutredning", href: "/booking?kategori=gynekologi&tjeneste=urinlekkasje" },
 { symptom: "Hetetokter, søvnløshet, humørsvingninger", service: "Overgangsalder-konsultasjon", href: "/booking?kategori=gynekologi&tjeneste=overgangsalder" },
 { symptom: "Uregelmessig syklus eller mistanke om PCOS", service: "PCOS-utredning", href: "/booking?kategori=gynekologi&tjeneste=pcos" },
 { symptom: "Smerter, kløe eller ubehag i vulva", service: "Vulva-utredning", href: "/booking?kategori=gynekologi&tjeneste=vulvalidelser" },
 ]}
 />

 {/* ============================================================
 6. VET DU ALLEREDE HVA DU TRENGER? — full liste (handlingsvalg)
 ============================================================ */}
 <section className="bg-background text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-6">
 <p className="text-xs text-foreground/60 mb-4">
 Alle behandlinger
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Vet du allerede hva du trenger?
 </h2>
 </div>
 <div className="lg:col-span-6 lg:pt-3">
 <p className="text-base font-light text-muted-foreground leading-relaxed">
 Klikk og book direkte, eller les mer om den enkelte
 gynekologiske utredningen eller behandlingen.
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

 {/* ============================================================
 7. RESULTATER — bevis etter at tilbudet er presentert
 ============================================================ */}
 <section className="bg-brand-light text-foreground py-20 md:py-28 border-t border-brand-dark/5">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-5">
 <p className="text-xs text-foreground/60 mb-4 uppercase">
 Resultater
 </p>
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

 <div className="border-t border-brand-dark/5 py-8 md:py-10">
 <p className="text-xs tracking-[0.18em] text-brand-dark mb-6 uppercase">
 Gynekologi
 </p>
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {[
 { v: "9 600+", k: "Konsultasjoner", sub: "Per år" },
 { v: "2 100", k: "Ultralydundersøkelser", sub: "I 2024" },
 { v: "98%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
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

 {/* ============================================================
 8. PASIENTSITATER — sosial bevis
 ============================================================ */}
 <section className="bg-brand-warm py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <p className="text-sm text-brand-dark/60 font-light mb-3">
 Hva pasientene sier
 </p>
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

 {/* ============================================================
 9. SPESIALISTER — menneskene bak
 ============================================================ */}
 <SpecialistsScroller
 category="gynekologi"
 title="Gynekologene som følger deg."
 seeAllHref="/spesialister?kategori=gynekologi"
 seeAllLabel="Se alle gynekologer"
 />

 {/* ============================================================
 6. FRA FØRSTE KONTAKT TIL RIKTIG BEHANDLING — split
 ============================================================ */}
 <section className="bg-background">
 <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
 <div className="lg:col-span-5">
 <p className="text-xs text-foreground/60 mb-4">
 Pasientreisen
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
 Fra første kontakt til riktig behandling.
 </h2>
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
 Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos
 oss, fra du booker time til du er ferdig behandlet.
 </p>
 <Button
 asChild
 variant="cta"
 size="lg"
 className="px-8"
 >
 <Link to={buildBookingUrl({ kategori: "gynekologi" })}>
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

 {/* ============================================================
 10. UNIFIED PRE-FOOTER CTA — samme som hjem
 ============================================================ */}
 <BookingCTA />
 </PageLayout>
 );
};

export default Gynecology;
