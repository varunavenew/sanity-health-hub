import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Quote } from "lucide-react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import audienceCoupleImg from "@/assets/fertility/audience-couple.jpg";
import audienceWaitingImg from "@/assets/fertility/audience-waiting.jpg";
import audienceSingleImg from "@/assets/fertility/audience-single.jpg";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";

import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import fertilityHeroImg from "@/assets/categories/fertilitet-real.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
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
 { label: "Fertilitetssjekk", href: `${FERT}/fertilitetssjekk` },
 { label: "Hormoner", href: `${FERT}/fertilitetssjekk` },
 { label: "AMH", href: `${FERT}/fertilitetssjekk` },
 { label: "Ultralyd", href: `${FERT}/fertilitetssjekk` },
 { label: "Hysteroskopi", href: `${FERT}/fertilitetssjekk` },
 { label: "Rådgivning online", href: `${FERT}/psykisk-helsehjelp` },
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
 { label: "Assistert befruktning", href: `${FERT}/ivf` },
 { label: "Donor-IVF", href: `${FERT}/eggdonasjon` },
 { label: "Eggløsningsstimulering", href: `${FERT}/iui` },
 { label: "Second opinion", href: `${FERT}/fertilitetssjekk` },
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
 { label: "Eggløsningsstimulering", href: `${FERT}/iui` },
 ],
 cta: "Snakk med oss",
 href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon",
 },
 {
 id: "mann",
 title: "Jeg er mann og vil sjekke fruktbarheten",
 desc:
 "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
 tags: [
 { label: "Sædanalyse", href: `${FERT}/mannlig-fertilitet` },
 { label: "Mannlig fertilitet", href: `${FERT}/mannlig-fertilitet` },
 { label: "Rådgivning online", href: `${FERT}/psykisk-helsehjelp` },
 ],
 cta: "Bestill analyse",
 href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
 },
];




const audiences = [
 {
 title: "Heterofile par",
 image: audienceCoupleImg,
 desc:
 "Dere har prøvd en stund og lurer på om noe er galt. Vi starter med utredning av begge — ingen henvisning, ingen ventetid.",
 href: "/booking?kategori=fertilitet",
 },
 {
 title: "De ventende",
 image: audienceWaitingImg,
 desc:
 "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
 href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
 },
 {
 title: "Singel",
 image: audienceSingleImg,
 desc:
 "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
 href: "/booking?kategori=fertilitet",
 },
];

const services = [
 { title: "Fertilitetssjekk og utredning", desc: "Hormoner, ultralyd, sædanalyse", href: "/behandlinger/fertilitet/fertilitetssjekk" },
 { title: "IVF — prøverørsbehandling", desc: "Inkludert ICSI ved behov", href: "/behandlinger/fertilitet/ivf" },
 { title: "IUI — inseminasjon", desc: "Med partner eller donor", href: "/behandlinger/fertilitet/iui" },
 { title: "Eggdonasjon", desc: "Norges nyeste eggbank", href: "/behandlinger/fertilitet/eggdonasjon" },
 { title: "Nedfrysing av egg", desc: "Egg, sæd og embryo", href: "/behandlinger/fertilitet/nedfrysing" },
 { title: "Genetisk testing (PGT)", desc: "For utvalgte indikasjoner", href: "/behandlinger/fertilitet/pgt" },
 { title: "Gynekologi og kirurgi", desc: "Polypper, endometriose, myomer", href: "/behandlinger/gynekologi" },
 { title: "Mannlig fertilitet", desc: "Sædanalyse og mikro-TESE", href: "/behandlinger/fertilitet/mannlig-fertilitet" },
 { title: "Psykisk helsehjelp", desc: "Samtaler gjennom hele forløpet", href: "/behandlinger/fertilitet/psykisk-helsehjelp" },
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

 useEffect(() => {
 document.title =
 "Fertilitet | CMedical — fertilitetsbehandling for alle veier til foreldreskap";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <h1 className="sr-only">
 Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning
 </h1>

 {/* ============================================================
 1. HERO — split screen 50/50, bilde kant-i-kant
 ============================================================ */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 {/* Left — copy + CTA */}
 <div className="flex items-center page-edge-text-left py-16 lg:py-24">
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

 <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
 {["Ingen henvisning", "Korte ventetider", "Erfarne spesialister"].map((u) => (
 <li key={u} className="inline-flex items-center gap-2">
 <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
 <span>{u}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Right — coverbilde, fyller hele halvdelen */}
 <div className="relative min-h-[420px] lg:min-h-full">
 <img
 src={fertilityHeroImg}
 alt="Fertilitetsbehandling hos CMedical"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>


 {/* ============================================================
 2. SEGMENT — "Fortell oss hvor du er" (identifiser deg)
 ============================================================ */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Fortell oss hvor du er
 <span className="block">— vi finner veien videre.</span>
 </h2>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {segments.map((s) => (
 <div
 key={s.id}
 className="bg-background p-7 flex flex-col"
 >
 <h3 className="text-lg font-normal mb-4 leading-snug">
 {s.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
 {s.desc}
 </p>
 <TagList tags={s.tags ?? []} initialVisible={3} className="mb-5" />
 <Link
 to={s.href}
 className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
 >
 {s.cta}
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
 <div className="lg:col-span-7 page-edge-text-left py-20 lg:py-28">
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

 <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
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
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="page-shell">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Alle er velkomne
 <br />
 <span className="text-foreground/70">— uansett utgangspunkt.</span>
 </h2>
 </div>

  <div className="grid md:grid-cols-3 gap-6">
   {audiences.map((a) => (
    <div
     key={a.title}
     className="bg-background rounded-sm border border-border/40 flex flex-col overflow-hidden"
    >
     <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary">
      <img
       src={a.image}
       alt={a.title}
       loading="lazy"
       className="absolute inset-0 w-full h-full object-cover"
      />
     </div>
     <div className="p-7 flex flex-col flex-1">
      <h3 className="text-lg font-normal text-foreground mb-3">
       {a.title}
      </h3>
      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
       {a.desc}
      </p>
      <Link
       to={a.href}
       className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
      >
       Les mer
       <ArrowRight className="w-3.5 h-3.5" />
      </Link>
     </div>
    </div>
   ))}
  </div>
 </div>
 </div>
 </section>

 {/* 5. SYMPTOMSJEKK — selvdiagnose, peker mot tjenester */}
 <SymptomServiceSection
 title="Hva kjenner du på?"
 description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
 items={[
 { symptom: "Vi har prøvd i over et år uten å lykkes", service: "Fertilitetsutredning", href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning" },
 { symptom: "Uregelmessig syklus eller mistanke om PCOS", service: "Hormonutredning", href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk" },
 { symptom: "Jeg vil vite hvor mye tid jeg har", service: "AMH og eggstokkreserve", href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk" },
 { symptom: "Vi vurderer nedfrysing av egg", service: "Konsultasjon eggfrys", href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon" },
 { symptom: "Partneren vil sjekke fruktbarheten", service: "Sædanalyse", href: "/booking?kategori=fertilitet&tjeneste=sedanalyse" },
 { symptom: "Vi ønsker å bli foreldre som likekjønnet par", service: "Samtale og utredning", href: "/booking?kategori=fertilitet" },
 ]}
 />

 {/* ============================================================
 6. HVA VI TILBYR — tjeneste-grid (handlingsvalg)
 ============================================================ */}
 <ServicesListSection
 title="Hva vi tilbyr."
 description="Fra første samtale til oppfølging — hele fertilitetstilbudet vårt finner du her. Trenger du hjelp til å velge, kan du alltid ringe oss for en uforpliktende prat."
 items={services}
 />

 {/* ============================================================
 7. RESULTATER — bevis etter at tilbudet er presentert
 ============================================================ */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="page-shell">
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
 resultatene våre innen fertilitetsbehandling de siste årene.
 </p>
 </div>
 </div>

 <div className="border-t border-brand-dark/15 py-8 md:py-10">
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {[
 { v: "42%", k: "Suksessrate IVF", sub: "Kvinner under 35 år" },
 { v: "3 800+", k: "Barn født", sub: "Siden oppstart i 1989" },
 { v: "11 200", k: "Egg uthentet", sub: "Siste 5 år" },
 { v: "1 450", k: "IVF-sykluser", sub: "Gjennomført i 2024" },
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
 <section className="bg-brand-warm py-20 md:py-24">
 <div className="page-shell">
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

 {/* ============================================================
 9. SPESIALISTER — menneskene bak
 ============================================================ */}
 <FeatureSpotlight
        title={`«Endelig følte du at noen lyttet — og hadde en plan dere kunne forstå.»`}
        text="Les hvordan ett par fant veien til foreldreskap etter flere år med usikkerhet — og hva som var annerledes hos CMedical."
        ctaLabel="Les hele historien"
        ctaHref="/aktuelt"
        image={fertilityHeroImg}
        imageAlt=""
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
