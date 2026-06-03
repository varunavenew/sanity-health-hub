import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
 ArrowLeft, ArrowRight, Calendar, Clock, Share2, MapPin, Quote,
 Tag, Play, Stethoscope, HeartPulse, Sparkles,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FaqSection } from "@/components/layout/FaqSection";
import heroOrtopedi from "@/assets/hero/pdf1-clinic-interior.jpg";
import heroClinic from "@/assets/hero/hero-clinic-lounge.jpg";
import galleryTreatment1 from "@/assets/hero/pdf1-treatment1.jpg";
import galleryTreatment2 from "@/assets/hero/pdf1-treatment2.jpg";
import galleryClinic from "@/assets/hero/pdf1-clinic.jpg";
import specialistKristian from "@/assets/specialists/kristian-marstrand-warholm.jpg";
import categoryOrtopedi from "@/assets/categories/ortopedi-real.jpg";
import heroGyn from "@/assets/hero/gynecology-hero.jpg";
import heroInsurance from "@/assets/hero/insurance-hero.jpg";

/**
 * NewsItemMaster — mastermal for NYHETER / pasienthistorier.
 *
 * Layouten her er bevisst lettere og mer journalistisk enn fagartikkel-malen:
 * split-screen hero (tekst + bilde kant-i-kant), kort ingress og en strammere
 * brødtekst-spalte. Tenkes brukt til klinikknyheter, pasienthistorier,
 * stillingsannonser, presse og kortere stykker.
 */

const NewsItemMaster = ({ isChatOpen }: { isChatOpen: boolean }) => {
 useEffect(() => {
 document.title = "Mastermal: Nyhet | CMedical";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <h1 className="sr-only">Mastermal for nyhet og pasienthistorie</h1>

 {/* ───────────── HERO – split screen ───────────── */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[520px] lg:min-h-[640px]">
 {/* Left — meta + tittel + ingress */}
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-14 lg:py-20">
 <div className="max-w-xl w-full">
 <Link
 to="/aktuelt"
 className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-light transition-colors mb-8"
 >
 <ArrowLeft className="w-4 h-4" />
 Tilbake til Aktuelt
 </Link>

 <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-foreground/60 mb-6">
 <span className="inline-flex items-center gap-1.5">
 <span className="w-1 h-1 rounded-full bg-brand-dark" />
 Pasienthistorie
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Calendar className="w-3 h-3" />
 19. mai 2026
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Clock className="w-3 h-3" />
 4 min lesetid
 </span>
 </div>

 <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-foreground mb-6">
 «Etter operasjonen kunne jeg gå tur med barnebarna igjen»
 </h2>

 <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
 Atten måneder etter hofteoperasjonen hos CMedical forteller Kari (68) hva
 inngrepet har betydd for hverdagen — og hvorfor hun valgte å gjøre det
 privat.
 </p>
 </div>
 </div>

 {/* Right — coverbilde, fyller hele halvdelen */}
 <div className="relative min-h-[360px] lg:min-h-full">
 <img
 src={heroOrtopedi}
 alt=""
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* ───────────── BRØDTEKST – stram en-spaltet ───────────── */}
 <article className="bg-background py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-2xl mx-auto">
 {/* Forfatter-byline */}
 <div className="flex items-center gap-3 pb-8 mb-10 border-b border-border/60">
 <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-light text-foreground/70">
 MA
 </div>
 <div>
 <p className="text-sm font-normal text-foreground">Maria Andersen</p>
 <p className="text-xs font-light text-foreground/60">Redaksjonen, CMedical</p>
 </div>
 <button className="ml-auto inline-flex items-center gap-1.5 text-xs font-light text-foreground/60 hover:text-foreground transition-colors">
 <Share2 className="w-3.5 h-3.5" />
 Del
 </button>
 </div>

 <p className="text-lg font-light leading-relaxed text-foreground mb-6">
 Kari Hansen hadde levd med smerter i hoften i flere år. Etter et halvt år på
 venteliste i det offentlige bestemte hun seg for å ta saken i egne hender.
 </p>

 <p className="text-foreground/80 font-light leading-relaxed mb-6">
 «Jeg fikk en time hos en spesialist på CMedical innen ti dager. Vi gikk
 grundig gjennom historikken, bildene og alternativene — og jeg følte for
 første gang at noen virkelig lyttet,» forteller hun.
 </p>

 <p className="text-foreground/80 font-light leading-relaxed mb-10">
 Operasjonen ble gjennomført i Sandvika i januar 2025. I dag, 18 måneder
 senere, går hun tur med barnebarna hver dag.
 </p>

 <h2 className="text-xl md:text-2xl font-light text-foreground mt-12 mb-4">
 Et raskt forløp
 </h2>
 <p className="text-foreground/80 font-light leading-relaxed mb-6">
 Fra første konsultasjon til operasjon tok det fire uker. Etter inngrepet
 fulgte fysioterapeutene Kari tett opp i tre måneder, med ukentlige
 kontroller og et tilpasset treningsopplegg.
 </p>

 <p className="text-foreground/80 font-light leading-relaxed mb-10">
 «Det som overrasket meg mest var hvor godt informert jeg ble underveis. Jeg
 visste alltid hva som skulle skje neste uke,» sier hun.
 </p>

 {/* Faktaboks */}
 <aside className="bg-secondary/40 rounded-sm p-6 md:p-8 my-10">
 <p className="text-[11px] uppercase text-brand-dark mb-3">
 Fakta
 </p>
 <h3 className="text-base font-normal text-foreground mb-3">
 Hofteprotese hos CMedical
 </h3>
 <ul className="space-y-2 text-sm font-light text-foreground/80">
 <li>· Operasjon utføres ved CMedical Sandvika</li>
 <li>· Tid fra konsultasjon til operasjon: typisk 3–6 uker</li>
 <li>· Fysioterapeut-oppfølging inkludert i forløpet</li>
 <li>· Ingen henvisning nødvendig</li>
 </ul>
 </aside>

 <h2 className="text-xl md:text-2xl font-light text-foreground mt-12 mb-4">
 Tilbake til hverdagen
 </h2>
 <p className="text-foreground/80 font-light leading-relaxed mb-6">
 I dag bruker Kari ikke smertestillende i det hele tatt. Hun har begynt å
 danse igjen, og planlegger sin første lange tur til fots i sommer.
 </p>

 <p className="text-foreground/80 font-light leading-relaxed mb-10">
 «Hadde jeg visst hvor godt det skulle gå, hadde jeg gjort det for lenge
 siden,» avslutter hun med et smil.
 </p>

 </div>
 </div>
 </article>

 {/* ───────────── PULL QUOTE – stor fremhevet sitat ───────────── */}
 <section className="bg-brand-light py-16 md:py-24 border-y border-border/60">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto text-center">
 <Quote className="w-8 h-8 text-brand-dark/40 mx-auto mb-6" />
 <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug text-foreground italic">
 «Jeg fikk en time hos en spesialist på CMedical innen ti dager — og følte
 for første gang at noen virkelig lyttet.»
 </p>
 <p className="mt-6 text-sm font-light text-foreground/60">
 — Kari Hansen, pasient
 </p>
 </div>
 </div>
 </section>

 {/* ───────────── VIDEO / MEDIA-SLOT (valgfri) ───────────── */}
 <section className="bg-background py-14 md:py-20">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-4xl mx-auto">
 <p className="text-[11px] uppercase text-brand-dark mb-4">
 Se historien
 </p>
 <div className="relative aspect-video rounded-sm overflow-hidden bg-secondary group cursor-pointer">
 <img src={galleryClinic} alt="" loading="lazy" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-brand-dark/30 flex items-center justify-center">
 <div className="w-16 h-16 rounded-full bg-brand-light/90 flex items-center justify-center group-hover:scale-110 transition-transform">
 <Play className="w-6 h-6 text-brand-dark ml-1" />
 </div>
 </div>
 </div>
 <p className="text-xs font-light text-muted-foreground mt-3">
 Video — 2:14 · CMedical Sandvika
 </p>
 </div>
 </div>
 </section>

 {/* ───────────── BILDEGALLERI ───────────── */}
 <section className="bg-secondary/20 py-14 md:py-20">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-5xl mx-auto">
 <p className="text-[11px] uppercase text-brand-dark mb-4">
 Bilder fra forløpet
 </p>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
 {[galleryClinic, galleryTreatment1, galleryTreatment2, heroOrtopedi].map((img, i) => (
 <div key={i} className="aspect-square overflow-hidden rounded-sm bg-secondary">
 <img src={img} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* ───────────── FREMHEVET ENKELT-SPESIALIST ───────────── */}
 <section className="bg-background py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8 md:gap-12 items-center">
 <div className="md:col-span-2">
 <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
 <img src={specialistKristian} alt="Kristian Marstrand Warholm" loading="lazy" className="w-full h-full object-cover" />
 </div>
 </div>
 <div className="md:col-span-3">
 <p className="text-[11px] uppercase text-brand-dark mb-3">
 Spesialisten i denne saken
 </p>
 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
 Kristian Marstrand Warholm
 </h2>
 <p className="text-sm font-light text-foreground/70 mb-5">
 Ortoped · Spesialist på hofte og kikkhullsoperasjoner
 </p>
 <p className="text-base font-light leading-relaxed text-foreground/80 mb-6">
 Warholm jobber til daglig som overlege ved OUS Ullevål og er en del av
 ortopediteamet ved CMedical Majorstuen. Han har spesialisert seg på
 kikkhullskirurgi i hoften og driver aktiv forskning på feltet.
 </p>
 <div className="flex flex-wrap gap-3">
 <Link
 to="/spesialister/kristian-marstrand-warholm"
 className="inline-flex items-center gap-2 text-sm font-light text-foreground border-b border-foreground pb-0.5 hover:gap-2.5 transition-all"
 >
 Les hele profilen <ArrowRight className="w-4 h-4" />
 </Link>
 <Link
 to="/booking?spesialist=kristian-marstrand-warholm"
 className="inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground transition-colors"
 >
 Bestill time
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* ───────────── SPESIALISTER (flere) – samme som fertilitet ───────────── */}
 <SpecialistsScroller
 category="ortopedi"
 eyebrow="Teamet bak"
 title="Spesialistene som følger deg"
 description="Erfarne ortopeder og fysioterapeuter som jobber sammen om forløpet ditt."
 seeAllHref="/spesialister?kategori=ortopedi"
 />

 {/* ───────────── FREMHEVET ENKELT-TJENESTE ───────────── */}
 <section className="bg-brand-light py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
 <div>
 <p className="text-[11px] uppercase text-brand-dark mb-3">
 Tjenesten i denne saken
 </p>
 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
 Hofteprotese
 </h2>
 <p className="text-base font-light leading-relaxed text-foreground/80 mb-6">
 Et komplett forløp med konsultasjon, operasjon i Sandvika og oppfølging hos
 fysioterapeut. Ingen henvisning nødvendig — typisk 3–6 uker fra første time
 til inngrep.
 </p>
 <ul className="space-y-2 mb-8 text-sm font-light text-foreground/80">
 <li>· Pris fra 95 000 kr</li>
 <li>· Dekkes av de fleste helseforsikringer</li>
 <li>· Konsultasjon innen 10 dager</li>
 </ul>
 <Link
 to="/behandlinger/ortopedi/hofteprotese"
 className="inline-flex items-center gap-2 text-sm font-light text-foreground border-b border-foreground pb-0.5 hover:gap-2.5 transition-all"
 >
 Se hele tjenesten <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 <div className="aspect-[4/3] overflow-hidden rounded-sm bg-secondary order-first md:order-last">
 <img src={categoryOrtopedi} alt="" loading="lazy" className="w-full h-full object-cover" />
 </div>
 </div>
 </div>
 </section>

 {/* ───────────── RELATERTE TJENESTER (grid) ───────────── */}
 <section className="bg-background py-14 md:py-20">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-5xl mx-auto">
 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
 Andre tjenester innen ortopedi
 </h2>
 <p className="text-muted-foreground font-light mb-10">
 Vi tilbyr et komplett forløp for de fleste muskel- og skjelettplager.
 </p>
 <div className="grid md:grid-cols-3 gap-5">
 {[
 { Icon: Stethoscope, t: "Kneprotese", d: "Total- og halvprotese, robotassistert kirurgi.", l: "/behandlinger/ortopedi/kneprotese" },
 { Icon: HeartPulse, t: "Skulder", d: "Skulderlås, slitasje og artroskopi.", l: "/behandlinger/ortopedi/skulder" },
 { Icon: Sparkles, t: "Fysioterapi", d: "Tett pre- og postoperativ oppfølging.", l: "/behandlinger/fysioterapi" },
 ].map((s) => (
 <Link
 key={s.t}
 to={s.l}
 className="group block p-6 rounded-sm border border-border hover:border-brand-dark/40 hover:bg-secondary/30 transition-all"
 >
 <s.Icon className="w-6 h-6 text-brand-dark mb-4" strokeWidth={1.5} />
 <h3 className="text-base font-medium text-foreground mb-1.5">{s.t}</h3>
 <p className="text-sm font-light text-foreground/70 mb-4">{s.d}</p>
 <span className="inline-flex items-center gap-1.5 text-xs font-light text-foreground group-hover:gap-2 transition-all">
 Les mer <ArrowRight className="w-3.5 h-3.5" />
 </span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* ───────────── FAQ – samme komponent som hjemmesiden ───────────── */}
 <FaqSection
 background="bg-secondary/30"
 faqs={[
 { id: "1", question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning fra fastlege." },
 { id: "2", question: "Dekker forsikringen min?", answer: "De fleste private helseforsikringer dekker konsultasjon og inngrep. Sjekk med ditt forsikringsselskap." },
 { id: "3", question: "Hvor lang er ventetiden?", answer: "Som regel får du time innen 10 virkedager." },
 ]}
 />

 {/* ───────────── TAGS + DEL ───────────── */}
 <section className="bg-background py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-3">
 <Tag className="w-4 h-4 text-foreground/50" />
 {["Hofteprotese", "Ortopedi", "Pasienthistorie", "Sandvika"].map((t) => (
 <Link
 key={t}
 to={`/aktuelt?tag=${encodeURIComponent(t)}`}
 className="text-xs font-light px-3 py-1 rounded-full border border-border text-foreground/70 hover:border-brand-dark hover:text-foreground transition-colors"
 >
 {t}
 </Link>
 ))}
 <button className="ml-auto inline-flex items-center gap-1.5 text-xs font-light text-foreground/60 hover:text-foreground transition-colors">
 <Share2 className="w-3.5 h-3.5" /> Del artikkelen
 </button>
 </div>
 </div>
 </section>



 {/* ───────────── RELATERTE NYHETER – samme kortdesign som /aktuelt ───────────── */}
 <section className="bg-secondary/30 border-t border-border py-12 md:py-16">
 <div className="container mx-auto px-6 md:px-16">
 <h2 className="text-lg font-medium text-foreground mb-8">Relaterte artikler</h2>
 <div className="grid md:grid-cols-3 gap-6">
 {[
 { t: "Ny gynekolog på plass i Sandvika", e: "Vi styrker teamet på kvinnehelse i Sandvika.", c: "Klinikknytt", img: heroGyn },
 { t: "Hva ventelistene gjør med oss", e: "Et innblikk i konsekvensene av lange ventetider.", c: "Kommentar", img: heroInsurance },
 { t: "Slik bygget vi det nye operasjonsrommet", e: "Bak kulissene på utbyggingen i Sandvika.", c: "Bak kulissene", img: galleryClinic },
 ].map((n) => (
 <Link key={n.t} to="#" className="group">
 <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
 <img
 src={n.img}
 alt={n.t}
 loading="lazy"
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 <div className="absolute top-3 left-3">
 <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
 {n.c}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
 <Calendar className="w-3 h-3" />
 12. mai 2026
 </div>
 <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors leading-snug mb-1">
 {n.t}
 </h3>
 <p className="text-xs text-muted-foreground font-light line-clamp-2">
 {n.e}
 </p>
 </Link>
 ))}
 </div>
 </div>
 </section>

 <BookingCTA />
 </PageLayout>
 );
};

export default NewsItemMaster;
