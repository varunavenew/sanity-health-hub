import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import {
 Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { AnimatedStatsSection } from "@/components/treatments/AnimatedStatsSection";
import { ScrollArrows } from "@/components/ui/ScrollArrows";


import ortopediHero from "@/assets/categories/ortopedi-real.jpg";

interface PageProps { isChatOpen: boolean }

const bodyParts = [
 { title: "Skulder", desc: "Inneklemming, kalkavleiringer, seneskader, ustabil skulder" },
 { title: "Kne", desc: "Korsbånd, menisk, slitasjegikt, bruskskader" },
 { title: "Hofte", desc: "Hofteslitasje, labrumskade, fotballbrokk" },
 { title: "Hånd og albue", desc: "Karpaltunnel, tennisalbue, Dupuytren, springfinger" },
 { title: "Fot og ankel", desc: "Hælspore, fotslitasje, ankelbåndskader" },
 { title: "Injeksjoner", desc: "Kortison, hyaluronsyre, blodspinningsteknikk (PRP)" },
 { title: "Second opinion", desc: "Har du fått en diagnose du er usikker på?" },
];

const segments = [
 {
 title: "Jeg har vondt — men vet ikke hva det er",
 desc:
 "Start med en generell ortopedisk konsultasjon. Spesialisten undersøker deg, stiller diagnose og legger en plan — på et språk du forstår.",
 cta: "Ortopedisk konsultasjon",
 href: "/booking?kategori=ortopedi",
 },
 {
 title: "Jeg har fått en diagnose, men er ikke fornøyd",
 desc:
 "Second opinion hos CMedical. Vi får ofte pasienter med kompliserte skader og caser der andre ikke har funnet løsningen. Vi ser på det med nye øyne.",
 cta: "Bestill second opinion",
 href: "/booking?kategori=ortopedi&tjeneste=second-opinion",
 },
];

const treatmentGroups = [
 {
 label: "Skulder",
 items: ["Inneklemming (impingement)", "Kalkavleiringer", "Rotatormansjettskader", "Ustabil skulder", "Frossen skulder"],
 },
 {
 label: "Kne og hofte",
 items: ["Korsbåndruptur", "Meniskskader", "Kneslitasje", "Hofteslitasje", "Labrumskade"],
 },
 {
 label: "Hånd, albue og fot",
 items: ["Karpaltunnelsyndrom", "Tennisalbue og golfalbue", "Dupuytrens kontraktur", "Hælspore og hælsmerter", "Ankelbåndskader"],
 },
 {
 label: "Behandlingsformer",
 items: ["Ortopedisk kirurgi", "Artroskopi", "Kortisoninjeksjoner", "Blodspinningsteknikk (PRP)", "Hyaluronsyre"],
 },
];

const journey = [
 { n: "01", title: "Bestill når det passer deg", desc: "Online booking døgnet rundt. Velg kroppsdel og klinikk — vi matcher deg med riktig spesialist." },
 { n: "02", title: "Samtalen som rekker", desc: "Du møter en ortoped som jobber med nettopp ditt område. Vi tar historikk, ser på bilder og gjør en grundig undersøkelse." },
 { n: "03", title: "Diagnose og plan", desc: "Du forlater konsultasjonen med en klar diagnose og en konkret plan — hva som er galt, hva vi anbefaler, og hva som skjer videre." },
 { n: "04", title: "Tverrfaglig oppfølging", desc: "Ved behov samarbeider ortopeden med fysioterapeut, manuellterapeut, osteopat og ernæringsfysiolog — alt under samme tak." },
];

const reviews = [
 { text: "Hadde slitt med skulderen i to år. Kom til CMedical, fikk diagnose første dag og en plan som faktisk fungerte. Skulle gjort det mye tidligere.", author: "Martin", date: "Google · 2 måneder siden" },
 { text: "Etter kneskaden visste jeg ikke hva jeg skulle gjøre. Ortopeden her forklarte alt tydelig og la opp et løp jeg hadde tro på fra første stund.", author: "Silje", date: "Legelisten · 4 måneder siden" },
 { text: "Kom for second opinion etter å ha vært på sykehus uten å bli bra. Her fant de problemet med en gang og opererte meg uken etter.", author: "Jan Erik", date: "Google · 6 måneder siden" },
];

const faqs = [
 { question: "Trenger jeg henvisning?", answer: "Du trenger ingen henvisning. Du bestiller direkte hos oss — men husk å ta med bilder fra røntgen, CT eller MR om du har det." },
 { question: "Hvor lang er ventetiden?", answer: "Vi har ingen ventetid. Du kan vanligvis få time innen få dager." },
 { question: "Kan dere skrive sykmelding?", answer: "Ortopedene våre kan skrive ut sykmelding ved behov. Ta dette opp i konsultasjonen." },
 { question: "Hvor lenge varer en konsultasjon?", answer: "En vanlig ortopedisk konsultasjon varer ca. 30 minutter. Vi kan ofte bestille MR eller røntgen samme dag." },
 { question: "Hvilke forsikringer har dere avtale med?", answer: "Vi har avtale med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg." },
];

const insurance = ["Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika"];

const Ortopedi = ({ isChatOpen }: PageProps) => {
 useEffect(() => {
 document.title = "Ortopedi | CMedical — skader og sykdommer i muskler, bein og ledd";
 }, []);

 const ortoSpecialists = useMemo(
 () => specialists.filter((s) => s.category === "ortopedi").slice(0, 5),
 []
 );

 const segmentsRef = useRef<HTMLDivElement>(null);
 const specialistsRef = useRef<HTMLDivElement>(null);
 const reviewsRef = useRef<HTMLDivElement>(null);


 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <h1 className="sr-only">Ortopedi hos CMedical — skulder, kne, hofte, hånd og fot</h1>

 {/* HERO */}
 <header className="bg-brand-light pt-24 lg:pt-0">
 <div className="lg:hidden px-6 md:px-16 pb-4">
   <h2 className="text-4xl font-light text-foreground leading-[1.05]">
     Ortopedi
   </h2>
 </div>
 <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
 <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
 <div className="max-w-xl w-full">
 <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Ortopedi
 </h2>

 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
 Det gjør vondt. La oss finne ut hvorfor — og hva vi kan gjøre med det.
 Våre ortopeder er eksperter på skader og sykdommer i muskler, bein, ledd
 og sener. Noen av landets fremste kirurger jobber hos oss.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() => (window.location.href = buildBookingUrl({ kategori: "ortopedi" }))}
 >
 Bestill ortopedtime
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
 <img src={ortopediHero} alt="Ortopedi hos CMedical" className="absolute inset-0 w-full h-full object-cover" />
 </div>
 </div>
 </header>

 {/* INTRO */}
 <section className="bg-background py-16 md:py-20">
 <div className="container mx-auto px-6 md:px-16 max-w-4xl">
 <p className="text-base md:text-lg font-light leading-relaxed text-foreground/85">
 Ortopedi er en medisinsk spesialitet som tar seg av problemer med muskler,
 bein, ledd og sener. Våre ortopeder er eksperter på å behandle skader og
 sykdommer i skulder, hånd, fot, albue, kne og hofte. Hos oss jobber noen av
 landets fremste kirurger med avanserte caser — inkludert second opinion for
 pasienter som ikke har fått hjelp andre steder.
 </p>
 </div>
 </section>

 {/* BODY PART NAVIGATION */}
 <section className="bg-brand-light py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Velg kroppsdel — vi finner riktig spesialist.
 </h2>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {bodyParts.map((b) => (
 <Link
 key={b.title}
 to="/booking?kategori=ortopedi"
 className="bg-background p-6 md:p-7 flex flex-col group hover:bg-secondary/40 transition-colors"
 >
 <h3 className="text-base md:text-lg font-normal text-foreground mb-2">{b.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-5 flex-1">{b.desc}</p>
 <span className="inline-flex items-center text-xs font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
 Se behandlinger
 <ArrowRight className="w-3.5 h-3.5" />
 </span>
 </Link>
 ))}
 </div>

 {/* Two segments */}
 <div className="mt-14 max-w-2xl mb-8">
 <h3 className="text-2xl md:text-3xl font-light text-foreground leading-tight">
 Du trenger ikke en diagnose for å bestille.
 </h3>
 </div>
 <div ref={segmentsRef} className="flex md:grid md:grid-cols-2 gap-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
 {segments.map((s) => (
 <div key={s.title} className="bg-background p-7 rounded-sm border border-border/40 flex flex-col shrink-0 w-[78vw] md:w-auto snap-center">
 <h3 className="text-lg font-normal text-foreground mb-3">{s.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{s.desc}</p>
 <Link to={s.href} className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all">
 {s.cta}
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 ))}
 </div>
 <ScrollArrows scrollRef={segmentsRef} />


 {/* Second opinion dark stripe */}
 <div className="mt-14 bg-brand-dark text-white rounded-sm p-8 md:p-10">
 <h3 className="text-xl md:text-2xl font-light leading-snug mb-3 max-w-2xl">
 Har du vært andre steder uten å bli bra?
 </h3>
 <p className="text-sm md:text-base font-light text-white/70 leading-relaxed max-w-2xl mb-6">
 Vi behandler jevnlig pasienter som kommer til oss med kompliserte skader —
 enten fordi de ikke har fått hjelp, eller fordi de trenger en ny vurdering.
 Hos oss jobber noen av landets fremste ortopeder med nettopp dette.
 </p>
 <Button asChild variant="cta-dark" size="lg" className="px-8">
 <Link to={buildBookingUrl({ kategori: "ortopedi", tjeneste: "second-opinion" })}>Bestill second opinion</Link>
 </Button>
 </div>
 </div>
 </div>
 </section>

 {/* CHECKLISTS */}
 <section className="bg-background py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">Hva vi behandler</h2>
 </div>
 <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
 {treatmentGroups.map((g) => (
 <div key={g.label}>
 <p className="text-sm font-normal text-foreground pb-3 mb-3 border-b border-border">{g.label}</p>
 <ul>
 {g.items.map((item) => (
 <li key={item} className="flex items-start gap-3 py-2.5 border-b border-border/50 text-sm font-light text-foreground">
 <Check className="w-4 h-4 text-brand-dark flex-shrink-0 mt-1" strokeWidth={2} />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* RESULTATER — animerte tall */}
 <AnimatedStatsSection
 categoryLabel="Ortopedi"
 description="Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen ortopedi de siste årene."
 stats={[
 { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
 { v: "3 500", k: "Operasjoner", sub: "Per år" },
 { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
 { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
 ]}
 />

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

 {/* SPECIALISTS */}
 {ortoSpecialists.length > 0 && (
 <section className="bg-brand-warm">
 <div className="container mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-10 md:pb-14">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
 <div>
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">Spesialistene som følger deg.</h2>
 </div>
 <Link to="/spesialister?kategori=ortopedi" className="text-sm font-light text-foreground hover:text-foreground/70">
 Se alle ortopeder →
 </Link>
 </div>
 </div>
 <div ref={specialistsRef} className={`flex md:grid gap-3 md:gap-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide ${ortoSpecialists.length === 5 ? "md:grid-cols-5" : `md:grid-cols-${ortoSpecialists.length}`}`} style={{ scrollbarWidth: 'none' }}>
 {ortoSpecialists.map((sp) => (
 <Link key={sp.slug} to={`/spesialister/${sp.slug}`} className="group relative block shrink-0 w-[78vw] md:w-auto snap-center">
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
 <ScrollArrows scrollRef={specialistsRef} />

 </section>
 )}

 {/* REVIEWS */}
 <section className="bg-brand-warm py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-xl mb-10">
 <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">Hva pasientene sier om ortopedi</h2>
 </div>
 <div ref={reviewsRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
 {reviews.map((r, i) => (
 <div key={i} className="relative p-8 rounded-sm bg-white border border-brand-dark/10 shrink-0 w-[78vw] md:w-auto snap-center">
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
 Vi sender bekreftelse og forberedelser direkte til deg. Husk å ta med
 bilder fra røntgen, CT eller MR om du har det.
 </p>
 </div>
 <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
 <Button asChild variant="cta-dark" size="lg" className="px-8">
 <Link to={buildBookingUrl({ kategori: "ortopedi" })}>Bestill ortopedtime</Link>
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

export default Ortopedi;
