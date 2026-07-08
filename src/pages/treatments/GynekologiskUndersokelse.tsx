import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Clock, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getServiceImageFromHref } from "@/data/serviceImages";

interface PageProps {
 isChatOpen: boolean;
}

const heroPoints = [
 {
 title: "Ingen ventetid",
 desc: "Du finner time hos oss innen få dager — ikke etter måneder i offentlig kø.",
 },
 {
 title: "Du møter riktig spesialist",
 desc: "Gynekologene våre jobber med det de kan best. Vi sørger for at du møter rett person.",
 },
 {
 title: "Vi forstår",
 desc: "Du fortjener tid til samtalen, ikke et fem-minutters møte. Vi tar oss tid.",
 },
 {
 title: "Alt under samme tak",
 desc: "Trenger du videre utredning eller behandling, har du det her. Ingen omveier.",
 },
];

const consultationFlow = [
 {
 n: "Minutt 0–10",
 title: "Samtale og historikk",
 desc: "Vi starter med en grundig samtale om hva du opplever, syklushistorie og eventuelle spørsmål. Ingen spørsmål er for små eller for private.",
 },
 {
 n: "Minutt 10–25",
 title: "Den kliniske undersøkelsen",
 desc: "Vi gjennomfører en gynekologisk undersøkelse, eventuelt med ultralyd — med ditt tempo og din komfort i fokus.",
 },
 {
 n: "Minutt 25–40",
 title: "Funn og forklaring",
 desc: "Legen gjennomgår hva vi finner, forklarer med klare ord — og spør hvordan du opplever det.",
 },
 {
 n: "Minutt 40–55",
 title: "Plan for veien videre",
 desc: "Trenger du ikke mer nå, avslutter vi der. Trenger du oppfølging eller behandling, legger vi en konkret plan.",
 },
];

const reasons = [
 {
 n: "01",
 title: "Smerter eller ubehag i underlivet",
 desc: "Underlivssmerter, smerter ved samleie eller endrede menssmerter — det finnes årsaker, og de kan behandles.",
 },
 {
 n: "02",
 title: "Uregelmessig eller kraftig blødning",
 desc: "Menstruasjonen kommer for sent eller for tidlig, kraftig eller for lite — det kan være lurt å sjekke hva som ligger bak.",
 },
 {
 n: "03",
 title: "Rutinesjekk og cellprøver",
 desc: "Cellprøver er en trygghet. Ingen forklaring trengs — det er kanskje den raskeste timen du tar i året.",
 },
 {
 n: "04",
 title: "Noe føles ikke riktig — men hva?",
 desc: "Du vet ikke helt hva det er, men du merker at noe ikke stemmer helt. Det er en god nok grunn for å ta kontakt.",
 },
 {
 n: "05",
 title: "Prevensjon og hormonell helse",
 desc: "Rådgivning om prevensjon, hormonell ubalanse eller hjelp til å finne det som passer deg.",
 },
];

const promises = [
 {
 title: "Du bestemmer hva du er komfortabel med",
 desc: "Undersøkelsen gjøres alltid i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
 },
 {
 title: "Gynekologer som er spesialister",
 desc: "Hos oss møter du leger som spesifikt jobber med kvinnehelse — ikke et utplassert sykehusansvar. Du har vår fulle oppmerksomhet.",
 },
 {
 title: "Ingenting forsvinner mellom sprekker",
 desc: "Alt er samlet på ett sted: Trenger du kirurgi, fertilitetsbehandling eller psykologhjelp — vi koordinerer hele forløpet for deg.",
 },
];

const relatedAreas = [
 {
 title: "Endometriose",
 desc: "En av de vanligste gynekologiske sykdommene — og en av de mest oversette. Vi har lengre timer enn for å gi grundig og rask vurdering.",
 href: "/behandlinger/gynekologi/endometriose",
 },
 {
 title: "Blødningsforstyrrelser",
 desc: "Kraftige, langvarige eller uregelmessige blødninger kan skyldes myomer, polypper eller hormonell ubalanse — eller noe annet. Vi finner årsaken.",
 href: "/behandlinger/gynekologi/blodningsforstyrrelser",
 },
 {
 title: "PMOS",
 desc: "Polycystisk ovariesyndrom er vanlig, og kan gi uregelmessig syklus, akne og uttretthet — med mer. Vi gir utredning og oppfølging gjennom alle faser av livet.",
 href: "/behandlinger/gynekologi/pcos",
 },
];

const GynekologiskUndersokelse = ({ isChatOpen }: PageProps) => {
 useEffect(() => {
 document.title =
 "Gynekologisk undersøkelse | CMedical — ingen henvisning, ingen ventetid";
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title="Gynekologisk undersøkelse | CMedical"
 description="Trygg gynekologisk undersøkelse uten henvisning og uten ventetid. Du møter en spesialist som tar seg tid — og forklarer alt underveis."
 canonical="/behandlinger/gynekologi/undersokelse"
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Gynekologi", path: "/gynekologi" },
 { name: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
 ]}
 />
 <h1 className="sr-only">Gynekologisk undersøkelse hos CMedical</h1>

 {/* ============================================================
 BREADCRUMB
 ============================================================ */}
 <div className="bg-brand-light pt-24 lg:pt-28 pb-4">
 <div className="container mx-auto px-6 md:px-16">
 <nav className="text-xs font-light text-foreground/60 flex items-center gap-2">
 <Link to="/" className="hover:text-foreground">Hjem</Link>
 <span>›</span>
 <Link to="/gynekologi" className="hover:text-foreground">Gynekologi</Link>
 <span>›</span>
 <span className="text-foreground/80">Gynekologisk undersøkelse</span>
 </nav>
 </div>
 </div>

 {/* ============================================================
 1. HERO — split (text + sjekkpunkter)
 ============================================================ */}
 <header className="bg-brand-light pb-20 md:pb-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
 <div>
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 Noe kjennes ikke helt <span className="italic">riktig</span>
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground max-w-md">
 Du trenger ikke vite hva du er — det er det vi er her for. En
 gynekologisk undersøkelse er det naturlige første steget,
 enten du har konkrete plager eller bare ønsker å sjekke at alt
 er som det skal.
 </p>

              <div className="mb-8 max-w-sm">
                <p className="text-base font-normal text-foreground mb-1">
                  Gynekologisk undersøkelse
                </p>
                <p className="text-sm font-light text-muted-foreground mb-4">
                  Pris fra 2 200 kr
                </p>
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "gynekologi",
                      tjeneste: "undersokelse",
                    }))
                  }
                >
                  Se ledige time
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-light text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  Ingen ventetid
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileX className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  Ingen henvisning
                </span>
              </div>
 </div>

 <div className="bg-secondary/50 p-8 md:p-10 rounded-sm">
 <ul className="space-y-6">
 {heroPoints.map((p) => (
 <li key={p.title} className="flex items-start gap-4">
 <span className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
 <Check className="w-3.5 h-3.5 text-foreground" />
 </span>
 <div>
 <h3 className="text-base font-normal text-foreground mb-1">
 {p.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {p.desc}
 </p>
 </div>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </header>

 {/* ============================================================
 2. KONSULTASJONEN — mørkt, fire trinn
 ============================================================ */}
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 Hva skjer når du er hos oss
 </h2>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {consultationFlow.map((step) => (
 <div key={step.n} className="bg-background p-7 flex flex-col">
 <h3 className="text-lg font-normal mb-3 leading-snug">
 {step.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {step.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* ============================================================
 3. HVEM PASSER DET FOR — split
 ============================================================ */}
 <section className="bg-background py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-24">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
 Du trenger ikke ha en diagnose for å bestille
 </h2>
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-4 max-w-md">
 En gynekologisk undersøkelse er for alle kjønner som har en
 kropp som er som er syns. Kanskje kjenner du på noe vagt og
 udefinerbart, kanskje vil du bare forsikre deg om at alt er
 OK.
 </p>
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-md">
 Det viktigste er at du ikke venter for lenge med å ta kontakt.
 Vi har nettopp fra dette.
 </p>
 </div>

 <div className="lg:col-span-7">
 <div className="divide-y divide-border/60 border-t border-border/60">
 {reasons.map((r) => (
 <div key={r.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
 {r.n}
 </div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {r.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
 {r.desc}
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
 4. VÅRE LØFTER — tre kort
 ============================================================ */}
 <section className="bg-brand-light py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
 {promises.map((p) => (
 <div
 key={p.title}
 className="bg-background p-7 rounded-sm border border-border/40 flex flex-col"
 >
 <h3 className="text-lg font-normal text-foreground mb-3">
 {p.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {p.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ============================================================
 5. ETTER UNDERSØKELSEN — relaterte spesialfelt
 ============================================================ */}
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-12">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 Avhengig av hva vi finner, er neste steg alltid klart
 </h2>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {relatedAreas.map((a) => {
 const img = getServiceImageFromHref(a.href);
 return (
 <Link
 key={a.title}
 to={a.href}
 className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden"
 >
 {img && (
 <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
 <img
 src={img}
 alt={a.title}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
 />
 </div>
 )}
 <div className="p-7 flex flex-col flex-1">
 <h3 className="text-lg font-normal text-foreground mb-3">
 {a.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
 {a.desc}
 </p>
 <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
 Les mer om {a.title.toLowerCase()}
 <ArrowRight className="w-3.5 h-3.5" />
 </span>
 </div>
 </Link>
 );
 })}
 </div>
 </div>
 </div>
 </section>

 {/* ============================================================
 6. SLUTT-CTA
 ============================================================ */}
 <section className="bg-brand-dark text-white py-20 md:py-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
 <div className="lg:col-span-7">
 <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">
 Bestill gynekologisk undersøkelse
 </h2>
 <p className="text-base md:text-lg font-light text-white/70 leading-relaxed max-w-lg">
 Ingen ventetid. Ingen fastlege nødvendig. Du bestiller direkte
 — og vi sørger for at du møter riktig spesialist.
 </p>
 </div>
 <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <p className="text-sm font-light text-white/70 lg:text-right">
                Gynekologisk undersøkelse — pris fra 2 200 kr
              </p>
              <Button asChild variant="cta-dark" size="lg" className="px-8">
                <Link
                  to={buildBookingUrl({
                    kategori: "gynekologi",
                    tjeneste: "undersokelse",
                  })}
                >
                  Se ledige tider og book
                </Link>
              </Button>
 <a
 href="tel:+4722000000"
 className="inline-flex items-center gap-2 text-sm font-light text-white/85 hover:text-white transition-colors px-2"
 >
 <Phone className="w-4 h-4" />
 Ring oss på 22 00 00 00
 </a>
 </div>
 </div>
 </div>
 </section>
 </PageLayout>
 );
};

export default GynekologiskUndersokelse;
