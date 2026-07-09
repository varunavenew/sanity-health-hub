import { useEffect, useRef } from "react";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import {
 Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { buildBookingUrl } from "@/lib/bookingLinks";

import flereHero from "@/assets/categories/flere-fagomrader.jpg";

interface PageProps { isChatOpen: boolean }

const clusters = [
 {
 title: "Kropp og vev",
 desc: "Spesialister på hud, kirurgi og karsystemet. For deg med synlige plager, operasjonsbehov eller tilstander som krever kirurgisk vurdering.",
 tags: ["Hudhelse", "Plastikkirurgi", "Gastrokirurgi", "Karkirurgi", "Åreknutebehandling"],
 },
 {
 title: "Helse og balanse",
 desc: "Spesialister på indre medisin, hormoner, ledd og kropp. For deg med systemiske plager, langvarige smerter eller hormonforstyrrelser.",
 tags: ["Ernæringsfysiolog", "Endokrinologi", "Revmatologi", "Osteopati", "Robotkirurgi"],
 },
 {
 title: "Sinn og seksualitet",
 desc: "Spesialister på mental helse og seksuell helse. For deg som trenger et trygt og kompetent sted å snakke om det som er vanskelig.",
 tags: ["Psykologi", "Sexologi"],
 },
];

const allSpecialists = [
 { name: "Hudhelse", desc: "Hudbehandlinger, føflekksjekk, pigment, rødhet og hudpleieprodukter — vurdert av hudlege" },
 { name: "Psykologi", desc: "Angst, depresjon, relasjonsproblemer, traumer" },
 { name: "Sexologi", desc: "Seksuell helse, samliv, identitet, funksjonsplager" },
 { name: "Ernæringsfysiolog", desc: "Kosthold, vekttap, matintoleranser, sykdomsernæring" },
 { name: "Endokrinologi", desc: "Diabetes, skjoldbruskkjertelen, binyrer, hormoner" },
 { name: "Osteopati", desc: "Muskel- og skjelettsystemet, kroniske smerter" },
 { name: "Revmatologi", desc: "Leddgikt, artrose, bindevevssykdommer" },
 { name: "Plastikkirurgi", desc: "Rekonstruksjon, korreksjon, estetisk kirurgi" },
 { name: "Gastrokirurgi", desc: "Mage, tarm, lever, galleblære" },
 { name: "Karkirurgi", desc: "Åreknuter, blodkar, sirkulasjonsplager" },
 { name: "Robotassistert kirurgi", desc: "Presis, skånsom kirurgi med robot" },
 { name: "Åreknutebehandling", desc: "Sklerosering, laser, kirurgisk behandling" },
];

const journey = [
 { n: "01", title: "Bestill når det passer deg", desc: "Online booking døgnet rundt. Usikker på hvem du trenger? Ring oss — vi hjelper deg finne riktig spesialist." },
 { n: "02", title: "Samtalen som rekker", desc: "Du møter en spesialist som utelukkende jobber med det du trenger. Vi tar oss tid og forklarer på et språk du forstår." },
 { n: "03", title: "Utredning og plan", desc: "En konkret plan på et språk du forstår. Trenger du videre oppfølging eller samarbeid med andre spesialister, koordinerer vi det." },
 { n: "04", title: "Tverrfaglig oppfølging", desc: "Spesialistene jobber i team. Sexolog samarbeider med gynekolog, psykolog med urolog. Du slipper å starte på nytt et annet sted." },
];

const reviews = [
 { text: "Hadde gått med hudplager i årevis. Hudlegen fant årsaken på første konsultasjon og satte i gang behandling med en gang. Fantastisk.", author: "Kristine", date: "Google · 2 måneder siden" },
 { text: "Psykologen min er klok, rolig og empatisk. Det er ikke mange steder du kan få hjelp av en psykolog uten å vente i månedsvis.", author: "Marie", date: "Google · 1 måned siden" },
 { text: "Ernæringsfysiologen hjalp meg forstå kroppen min på en helt ny måte. Nyttig, konkret og uten mas. Verdt hver krone.", author: "Per", date: "Legelisten · 3 måneder siden" },
];

const faqs = [
 { question: "Trenger jeg henvisning?", answer: "Du trenger ingen henvisning fra fastlege for å bestille time hos oss. Du bestiller direkte." },
 { question: "Hvor lang er ventetiden?", answer: "Vi har kort ventetid. Du kan vanligvis få time innen få dager etter at du tar kontakt." },
 { question: "Kan dere skrive sykmelding?", answer: "Spesialistene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen." },
 { question: "Hvor lenge varer en konsultasjon?", answer: "En vanlig konsultasjon hos oss varer ca. 30 minutter. Videre utredning avtales med spesialisten." },
 { question: "Hvilke forsikringer har dere avtale med?", answer: "Vi har avtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg." },
];

const insurance = ["Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika"];

const FlereFagomrader = ({ isChatOpen }: PageProps) => {
 useEffect(() => {
 document.title = "Flere fagområder | CMedical — hud, psykologi, sexologi og mer";
 }, []);

 const clustersRef = useRef<HTMLDivElement>(null);
 const reviewsRef = useRef<HTMLDivElement>(null);


 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <h1 className="sr-only">Flere fagområder hos CMedical</h1>

 {/* HERO */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Flere fagområder
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Vi har samlet noen av Nordens fremste spesialister innen hud, psykologi,
 sexologi, ernæring og kirurgi. Spesialistene jobber i tverrfaglige team —
 og utelukkende med det de kan aller best.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() => (window.location.href = buildBookingUrl({ kategori: "flere-fagomrader" }))}
 >
 Bestill time
 </Button>
 <Link to="/kontakt" className="text-sm font-light text-foreground/85 hover:text-foreground border-b border-foreground/40 pb-0.5">
 Gratis prat med sykepleier
 </Link>
 </div>
 <div className="inline-flex items-center gap-3 text-sm font-light text-foreground">
 <div className="flex" aria-hidden="true">
 {[0, 1, 2, 3, 4].map((i) => (
 <Star key={i} className="w-4 h-4 fill-brand-dark text-brand-dark" />
 ))}
 </div>
 <span>4,7 av 5 — Google Reviews</span>
 </div>
 </div>
 </div>
 <div className="relative min-h-[420px] lg:min-h-full">
 <img
 src={flereHero}
 alt="Flere fagområder hos CMedical"
 className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
 />
 </div>
 </div>
 </header>

 {/* INTRO */}
 <section className="bg-background py-16 md:py-20">
 <div className="container mx-auto px-6 md:px-16 max-w-4xl">
 <p className="text-base md:text-lg font-light leading-relaxed text-foreground/85">
 Vi har samlet noen av Nordens fremste spesialister innen gastrokirurgi,
 revmatologi, dermatologi, ernæringsfysiologi, karkirurgi, osteopati,
 psykologi og sexologi. Spesialistene jobber ofte i tverrfaglige team for å gi
 deg den beste behandlingen. Husk at du alltid kan ta kontakt med oss om du
 lurer på noe.
 </p>
 </div>
 </section>

 {/* CLUSTERS */}
 <section className="bg-brand-light py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">Finn fagfeltet som passer deg.</h2>
 </div>
 <div ref={clustersRef} className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
 {clusters.map((c) => (
 <div key={c.title} className="bg-background p-7 rounded-sm border border-border/40 flex flex-col shrink-0 w-[85vw] md:w-auto snap-center">
 <h3 className="text-lg font-normal text-foreground mb-3">{c.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{c.desc}</p>
 <div className="flex flex-wrap gap-2">
 {c.tags.map((t) => (
 <span key={t} className="text-xs font-light bg-secondary text-foreground/80 px-3 py-1 rounded-2xl md:rounded-full">{t}</span>
 ))}
 </div>
 </div>
 ))}
 </div>
 <ScrollArrows scrollRef={clustersRef} />

 </div>
 </div>
 </section>

 {/* ALL SPECIALISTS */}
 <section className="bg-background py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Ledende spesialister — direkte til deg.
 </h2>
 </div>
 <div className="grid sm:grid-cols-2 gap-px bg-border/60 rounded-sm overflow-hidden">
 {allSpecialists.map((s) => (
 <Link
 key={s.name}
 to="/booking?kategori=flere-fagomrader"
 className="group bg-background p-6 flex items-start justify-between gap-4 hover:bg-secondary/40 transition-colors"
 >
 <div>
 <h3 className="text-base font-normal text-foreground mb-1">{s.name}</h3>
 <p className="text-sm font-light text-muted-foreground leading-snug">{s.desc}</p>
 </div>
 <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* JOURNEY */}
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">Pasientreisen, fortalt enkelt</h2>
 </div>
 <div className="divide-y divide-border/60 border-t border-border/60">
 {journey.map((step) => (
 <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-2xl">{step.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* REVIEWS */}
 <section className="bg-brand-warm py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">Hva pasientene sier</h2>
 </div>
 
 <div ref={reviewsRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
 {reviews.map((r, i) => (
 <div key={i} className="relative p-8 rounded-sm bg-white border border-brand-dark/10 shrink-0 w-[85vw] md:w-auto snap-center">
 <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
 <div className="flex mb-4">
 {[0, 1, 2, 3, 4].map((s) => (
 <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
 ))}
 </div>
 <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">"{r.text}"</p>
 <div className="pt-4 border-t border-brand-dark/10">
 <p className="text-brand-dark font-normal text-sm">{r.author}</p>
 <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
 </div>
 </div>
 ))}
 </div>
 <ScrollArrows scrollRef={reviewsRef} />
 </div>
 </div>

 </section>

 {/* FAQ */}
 <section className="bg-background py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight tracking-tight mb-10 text-center">Det folk spør om</h2>
 <Accordion type="single" collapsible className="w-full">
 {faqs.map((faq, i) => (
 <AccordionItem key={i} value={`item-${i}`}>
 <AccordionTrigger className="text-left font-light text-base">{faq.question}</AccordionTrigger>
 <AccordionContent className="text-muted-foreground font-light leading-relaxed">{faq.answer}</AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>
 </div>
 </section>

 {/* DARK CTA */}
 <section className="bg-brand-dark text-white py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
 <div className="lg:col-span-7">
 <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">Booking tar to minutter. Ingen henvisning.</h2>
 <p className="text-base md:text-lg font-light text-white/70 leading-relaxed max-w-lg">
 Usikker på hvem du trenger? Ta en gratis og uforpliktende prat med oss
 først — vi hjelper deg finne riktig spesialist.
 </p>
 </div>
 <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
 <Button asChild variant="cta-dark" size="lg" className="px-8">
 <Link to={buildBookingUrl({ kategori: "flere-fagomrader" })}>Bestill time</Link>
 </Button>
 <a href="tel:+4722000000" className="inline-flex items-center gap-2 text-sm font-light text-white/85 hover:text-white px-2">
 <Phone className="w-4 h-4" />
 Eller ring oss på 22 00 00 00
 </a>
 </div>
 </div>
 </div>
 </section>

 {/* INSURANCE */}
 <section className="bg-brand-light text-foreground py-14 md:py-16">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-24 items-start">
 <div className="lg:col-span-4">
 
 <h3 className="text-xl md:text-2xl font-light leading-snug text-foreground">
 Vi har avtale med de største forsikringsselskapene i Norge.
 </h3>
 </div>
 <div className="lg:col-span-8">
 <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-brand-dark/10">
 {insurance.map((name) => (
 <li
 key={name}
 className="border-b border-brand-dark/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-brand-dark/10 py-4 px-4 text-sm font-light text-foreground/85"
 >
 {name}
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </section>
 </EditableAutoScope></PageLayout>
 );
};

export default FlereFagomrader;
