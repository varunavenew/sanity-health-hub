import { getCategoryEntryPrice } from "@/data/priceList";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import {
 Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { AnimatedStat } from "@/components/AnimatedStat";
import { AnimatedStatsSection } from "@/components/treatments/AnimatedStatsSection";

import urologyHeroAsset from "@/assets/services/urologi-hero.jpg.asset.json";
const urologyHero = urologyHeroAsset.url;

interface PageProps { isChatOpen: boolean }

/* ── DATA ───────────────────────────────────────────────── */

const segments = [
 {
 title: "Jeg er mann med plager i underlivet",
 desc:
 "Prostataproblemer, smerter i testikler, ereksjonsproblemer eller vannlatingsplager — eller noe du bare vet er der, men ikke vet hva heter. Vi hjelper deg finne svar.",
 cta: "Behandlinger for menn",
 href: "/booking?kategori=urologi",
 },
 {
 title: "Jeg er kvinne med urologiske plager",
 desc:
 "Urinlekkasje, hyppig vannlating, blæreinfeksjoner, blod i urinen — urologi gjelder ikke bare menn. Vi utreder og behandler kvinner like grundig.",
 cta: "Behandlinger for kvinner",
 href: "/booking?kategori=urologi",
 },
 {
 title: "Jeg vil ha en prostatasjekk",
 desc:
 "Vi anbefaler alle menn over 50 å ta en prostatasjekk — eller tidligere ved symptomer, forhøyet PSA eller arvelighet. Rask og grundig utredning uten ventetid.",
 cta: "Bestill prostatasjekk",
 href: "/booking?kategori=urologi&tjeneste=prostata",
 },
 {
 title: "Jeg vurderer sterilisering",
 desc:
 "Sterilisering (vasektomi) er den sikreste prevensjonsmetoden og et enkelt inngrep. Konsultasjon og inngrep raskt, med kort restitusjon.",
 cta: "Les om sterilisering",
 href: "/booking?kategori=urologi&tjeneste=sterilisering",
 },
];

const treatmentGroups = [
 {
 label: "Prostata og urinveier",
 items: [
 "Prostatasjekk og utredning",
 "Forstørret prostata",
 "Prostatakreft",
 "Blære og urinveier",
 "Urinlekkasje og inkontinens",
 "Nyrer",
 ],
 },
 {
 label: "Testikler og pung",
 items: [
 "Kul eller hevelse i pungen",
 "Smerter i testiklene",
 "Varicocele",
 ],
 },
 {
 label: "Penis og forhud",
 items: [
 "Trang forhud (fimose)",
 "Skjev penis",
 "Ereksjonsproblemer",
 "Lavt testosteronnivå",
 ],
 },
 {
 label: "Kirurgiske inngrep",
 items: [
 "Sterilisering (vasektomi)",
 "Refertilisering",
 "Mannlig infertilitet",
 "Robotassistert kirurgi",
 ],
 },
];

const journey = [
 {
 n: "01",
 title: "Bestill når det passer deg",
 desc: "Online booking døgnet rundt. Ingen fastlege, ingen ventetid. Du velger klinikk og tid som passer deg.",
 },
 {
 n: "02",
 title: "Samtalen som rekker",
 desc: "Du møter en urolog som utelukkende jobber med det du trenger hjelp med. Vi tar oss tid — uten hastverk.",
 },
 {
 n: "03",
 title: "Utredning og plan",
 desc: "Trygg klinisk undersøkelse og en konkret plan på et språk du forstår. Prøver og ultralyd ofte samme dag.",
 },
 {
 n: "04",
 title: "Tverrfaglig oppfølging",
 desc: "Ved behov samarbeider urologen med gynekolog, fertilitetsspesialist, psykolog og sexolog — alt under samme tak.",
 },
];

const reviews = [
 { text: "Endelig fikk jeg svar på noe jeg hadde gått med i årevis. Legen var profesjonell, rolig og forklarte alt på en måte jeg faktisk forstod.", author: "Thomas", date: "Google · 3 måneder siden" },
 { text: "Ingen ventetid, ingen mas. Bestilte time, møtte legen dagen etter, fikk svar samme dag. Akkurat slik det burde fungere.", author: "Anders", date: "Legelisten · 1 måned siden" },
 { text: "Tok kontakt med en gang jeg merket noe var galt med prostata. Kort ventetid og grundig oppfølging. Anbefaler varmt.", author: "Knut", date: "Google · 5 måneder siden" },
];

const faqs = [
 { question: "Trenger jeg henvisning?", answer: "Du trenger ingen henvisning fra fastlege for å bestille time hos oss. Du bestiller direkte." },
 { question: "Hvor lang er ventetiden?", answer: "Vi har ingen ventetid. Du kan vanligvis få time innen få dager." },
 { question: "Kan dere skrive sykmelding?", answer: "Spesialistene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen." },
 { question: "Hvor lenge varer en konsultasjon?", answer: "En vanlig utredning varer ca. 30 minutter. Prøver og ultralyd kan ofte tas samme dag." },
 { question: "Hvilke forsikringer har dere avtale med?", answer: "Vi har avtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg." },
];

const insurance = ["Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika"];

/* ── PAGE ───────────────────────────────────────────────── */

const Urology = ({ isChatOpen }: PageProps) => {
 useEffect(() => {
 document.title = "Urologi | CMedical — diskret og profesjonell mannehelse";
 }, []);

 const urologySpecialists = useMemo(
 () => specialists.filter((s) => s.category === "urologi").slice(0, 5),
 []
 );

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <h1 className="sr-only">Urologi hos CMedical — prostata, urinveier og mannehelse</h1>

 {/* 1. HERO */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Urologi
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Plager i underlivet er vanligere enn du tror — og enklere å hjelpe enn du
 kanskje frykter. CMedical er eneste private aktør i Norge som tilbyr
 robotoperasjoner. Ingen ventetid, ingen henvisning nødvendig.
 </p>
 {(() => {
 const entry = getCategoryEntryPrice("urologi");
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
 onClick={() => (window.location.href = buildBookingUrl({ kategori: "urologi" }))}
 >
 Bestill urologtime
 </Button>
 <Link
 to="/kontakt"
 className="text-sm font-light text-foreground/85 hover:text-foreground border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
 >
 Gratis prat med sykepleier
 </Link>
 </div>
 <div className="inline-flex items-center gap-3 text-sm font-light text-foreground">
 <div className="flex" aria-hidden="true">
 {[0, 1, 2, 3, 4].map((i) => (
 <Star key={i} className="w-4 h-4 fill-brand-dark text-brand-dark" />
 ))}
 </div>
 <span>4,6 av 5 — Google Reviews</span>
 </div>
 </div>
 </div>
 <div className="relative min-h-[420px] lg:min-h-full">
 <img
 src={urologyHero}
 alt="Urologisk behandling hos CMedical"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 </header>

 {/* 2. INTRO */}
 <section className="bg-background py-16 md:py-20">
 <div className="container mx-auto px-6 md:px-16 max-w-4xl">
 <p className="text-base md:text-lg font-light leading-relaxed text-foreground/85">
 Urologi er en medisinsk spesialitet som omhandler plager knyttet til mannens
 underliv og urinorganer hos begge kjønn — herunder penis, prostata, testikler,
 urinblære og nyrer. I CMedical har vi flere av Nordens ledende spesialister
 innen urologi. En erfaren urolog er tilgjengelig hver dag, og vi har et bredt
 tverrfaglig team med spisskompetanse på ulike undergrupper av sykdommer.
 </p>
 </div>
 </section>

 {/* 3. SEGMENTS — finn din inngang */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Hva kan vi hjelpe deg med?
 </h2>
 </div>
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {segments.map((s) => (
 <div key={s.title} className="bg-background p-7 flex flex-col">
 <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{s.desc}</p>
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

 {/* 4. CHECKLISTS — alt under samme tak */}
 <section className="bg-background py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Hva vi behandler
 </h2>
 </div>

 <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
 {treatmentGroups.map((g) => (
 <div key={g.label}>
 <p className="text-sm font-normal text-foreground pb-3 mb-3 border-b border-border">{g.label}</p>
 <ul>
 {g.items.map((item) => (
 <li
 key={item}
 className="flex items-start gap-3 py-2.5 border-b border-border/50 text-sm font-light text-foreground"
 >
 <Check className="w-4 h-4 text-brand-dark flex-shrink-0 mt-1" strokeWidth={2} />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 {/* Robot highlight box — short focused dark stripe */}
 <div className="mt-14 bg-brand-dark text-white rounded-sm p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
 <div>
 <h3 className="text-xl md:text-2xl font-light leading-snug mb-3">
 Eneste private klinikk i Norge med robotoperasjoner
 </h3>
 <p className="text-sm md:text-base font-light text-white/70 leading-relaxed max-w-xl">
 Vi tilbyr robotassistert kirurgi på prostata (kreft og godartet forstørrelse),
 brokk, urinblæreutposninger og nyreinngrep. Det betyr mer presis kirurgi,
 kortere operasjonstid og raskere restitusjon for deg.
 </p>
 </div>
 <div className="md:text-right">
 <p className="text-4xl md:text-5xl font-light leading-none mb-2">
 <AnimatedStat value="400+" />
 </p>
 <p className="text-xs font-light text-white/60">robotoperasjoner i året</p>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* 4b. RESULTATER — animerte tall */}
 <AnimatedStatsSection
 categoryLabel="Urologi"
 description="Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen urologi de siste årene."
 stats={[
 { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
 { v: "3 500", k: "Operasjoner", sub: "Per år" },
 { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
 { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
 ]}
 />

 {/* 5. JOURNEY */}
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Pasientreisen, fortalt enkelt
 </h2>
 </div>
 <div className="divide-y divide-border/60 border-t border-border/60">
 {journey.map((step) => (
 <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
 {step.n}
 </div>
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

 {/* 6. SPECIALISTS */}
 {urologySpecialists.length > 0 && (
 <section className="bg-brand-warm">
 <div className="container mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-10 md:pb-14">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
 <div>
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Spesialistene som følger deg.
 </h2>
 </div>
 <Link to="/spesialister?kategori=urologi" className="text-sm font-light text-foreground hover:text-foreground/70 transition-colors">
 Se alle urologer →
 </Link>
 </div>
 </div>
 <div className={`grid grid-cols-2 gap-0 ${urologySpecialists.length === 5 ? "md:grid-cols-5" : `md:grid-cols-${urologySpecialists.length}`}`}>
 {urologySpecialists.map((sp) => (
 <Link key={sp.slug} to={`/spesialister/${sp.slug}`} className="group relative block">
 <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
 <img src={sp.image} alt={sp.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/30 to-brand-dark/10" />
 <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
 <h3 className="text-base md:text-lg font-normal text-white mb-0.5">{sp.name}</h3>
 <p className="text-sm font-light text-white/75">{sp.subtitle || sp.title}</p>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </section>
 )}

 {/* 7. REVIEWS */}
 <section className="bg-brand-warm py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
 Hva pasientene sier om urologi
 </h2>
 </div>
 <div className="grid md:grid-cols-3 gap-6">
 {reviews.map((r, i) => (
 <div key={i} className="relative p-8 rounded-sm bg-white border border-brand-dark/10">
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
 </div>
 </div>
 </section>

 {/* 8. FAQ */}
 <section className="bg-background py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight tracking-tight mb-10 text-center">
 Det folk spør om
 </h2>
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

 {/* 9. DARK CTA */}
 <section className="bg-brand-dark text-white py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
 <div className="lg:col-span-7">
 <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">
 Booking tar to minutter. Ingen henvisning.
 </h2>
 <p className="text-base md:text-lg font-light text-white/70 leading-relaxed max-w-lg">
 Vi sender bekreftelse og forberedelser direkte til deg. Du kan også ta en
 gratis og uforpliktende prat med en av sykepleierne våre.
 </p>
 </div>
 <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
 <Button asChild variant="cta-dark" size="lg" className="px-8">
 <Link to={buildBookingUrl({ kategori: "urologi" })}>Bestill urologtime</Link>
 </Button>
 <a href="tel:+4722000000" className="inline-flex items-center gap-2 text-sm font-light text-white/85 hover:text-white px-2">
 <Phone className="w-4 h-4" />
 Eller ring oss på 22 00 00 00
 </a>
 </div>
 </div>
 </div>
 </section>

 {/* 10. INSURANCE */}
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
 </PageLayout>
 );
};

export default Urology;
