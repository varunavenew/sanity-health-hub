import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote, Clock, Users, User } from "lucide-react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { AnimatedStat } from "@/components/AnimatedStat";

import heroAsset from "@/assets/hero/overvektskirurgi-hero.jpg.asset.json";
const heroImg = heroAsset.url;
import teamImage from "@/assets/hero/tverrfaglig-team.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const BARIATRISK = "/behandlinger/flere-fagomrader/bariatrisk-kirurgi";
const CANONICAL = "/behandlinger/flere-fagomrader/bariatrisk-kirurgi/sleeve-gastrektomi";
const BOOKING = buildBookingUrl({
  kategori: "flere-fagomrader",
  tjeneste: "sleeve-gastrektomi",
});

const segments = [
  {
    id: "vurderer",
    title: "Jeg vurderer sleeve gastrektomi",
    desc:
      "Du er nysgjerrig på inngrepet, men vil først forstå hva det innebærer. Start med en gratis digital informasjonssamtale — uten forpliktelser.",
    cta: "Bestill gratis samtale",
    href: BOOKING,
  },
  {
    id: "klar",
    title: "Jeg har bestemt meg",
    desc:
      "Du ønsker en planlagt, robotassistert operasjon hos et erfarent team — uten ventelister og med tett oppfølging hele veien.",
    cta: "Bestill vurdering",
    href: BOOKING,
  },
  {
    id: "forberedelse",
    title: "Jeg er i forberedelsesfasen",
    desc:
      "Du står foran lavkaloridiett og forberedelser. Ernæringsfysiolog og kirurg følger deg trygt frem til operasjonsdagen.",
    cta: "Snakk med ernæring",
    href: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
  },
];

const audiences = [
  {
    title: "Du som har prøvd alt",
    Icon: Users,
    desc:
      "Diett, trening og medikamenter har ikke gitt varig resultat. Sleeve gastrektomi kan være neste steg når livsstilstiltak ikke er nok.",
    href: BOOKING,
  },
  {
    title: "Du som har følgesykdom",
    Icon: Clock,
    desc:
      "Diabetes type 2, høyt blodtrykk, søvnapné eller leddslitasje. Vekttap etter sleeve kan endre hele helsebildet ditt.",
    href: BOOKING,
  },
  {
    title: "Du som vil ha trygghet",
    Icon: User,
    desc:
      "Du vil opereres med robotassistert teknikk av et erfarent team — med tett oppfølging fra ernæringsfysiolog og kirurg i to år etterpå.",
    href: BOOKING,
  },
];

const services = [
  { title: "Informasjonssamtale", desc: "Gratis digital førstesamtale", href: BARIATRISK },
  { title: "Robotassistert kirurgi", desc: "Presis og skånsom teknikk", href: "/robotassistert-kirurgi" },
  { title: "Ernæringsfysiolog", desc: "Kosthold før og etter operasjon", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
  { title: "Endokrinologi", desc: "Hormonell utredning og behandling", href: "/behandlinger/flere-fagomrader/endokrinologi" },
  { title: "Psykologi", desc: "Mental forberedelse og oppfølging", href: "/behandlinger/flere-fagomrader/psykologi" },
  { title: "Plastikkirurgi", desc: "Hud og kontur etter vekttap", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
];

const reviews = [
  { text: "Den digitale infosamtalen senket terskelen — jeg fikk svar på alt før jeg bestemte meg.", author: "Kari N.", date: "Operert 2024" },
  { text: "Kort ventetid, robotassistert teknikk og en kirurg som tok seg tid. Jeg var hjemme samme uke.", author: "Geir A.", date: "2 måneder siden" },
  { text: "Oppfølgingen med ernæringsfysiolog etterpå har vært avgjørende for resultatet.", author: "Linn H.", date: "6 måneder siden" },
];

const faqs = [
  {
    q: "Hva er sleeve gastrektomi?",
    a: "Sleeve gastrektomi (gastric sleeve) er en slankeoperasjon der 60–80 % av magesekken fjernes. Den gjenværende delen formes som et smalt rør, slik at du blir mett av mindre mat. Det gjøres ingen omkobling av tarmen.",
  },
  {
    q: "Hvordan utføres inngrepet hos CMedical?",
    a: "Hos CMedical utføres sleeve gastrektomi som robotassistert kikkhullskirurgi (rSG). Robotteknikken gir høyere presisjon, mindre smerter og raskere restitusjon enn tradisjonell laparoskopi.",
  },
  {
    q: "Hvor lang tid tar operasjonen?",
    a: "Selve inngrepet tar 1 til 2 timer. De fleste reiser hjem etter et kort opphold på klinikken.",
  },
  {
    q: "Hva koster gastric sleeve hos CMedical?",
    a: "Pris hos private aktører i Norge starter typisk rundt 98 000 kr. Eksakt pris og hva som er inkludert finner du i prislisten vår — be om en gratis informasjonssamtale for å få en personlig vurdering.",
  },
  {
    q: "Trenger jeg henvisning fra fastlege?",
    a: "Nei. Du kan ta kontakt direkte og bestille en gratis digital informasjonssamtale. Ventetiden hos oss er kort.",
  },
  {
    q: "Hvilke forberedelser kreves før operasjon?",
    a: "De fleste må gjennomføre en lavkaloridiett i ukene før operasjonen for å redusere størrelsen på leveren og gjøre inngrepet tryggere. Du følges av ernæringsfysiolog gjennom forberedelsen.",
  },
  {
    q: "Hvordan er oppfølgingen etter operasjonen?",
    a: "Du følges av et tverrfaglig team — kirurg, ernæringsfysiolog og endokrinolog — før, under og i to år etter inngrepet. Tett oppfølging er en av nøklene til varig resultat.",
  },
];

const SleeveGastrektomiPage = ({ isChatOpen }: PageProps) => {
  const surgerySpecialists = useMemo(() => {
    return specialists
      .filter((s) =>
        s.expertise?.some((e) =>
          ["Overvektskirurgi", "Bariatrisk", "Gastrokirurgi", "Robotkirurgi"].some((kw) =>
            e.toLowerCase().includes(kw.toLowerCase())
          )
        )
      )
      .slice(0, 5);
  }, []);

  useEffect(() => {
    document.title = "Sleeve gastrektomi (gastric sleeve) | CMedical";
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Sleeve gastrektomi (gastric sleeve) | CMedical"
        description="Robotassistert sleeve gastrektomi hos CMedical. Gratis digital informasjonssamtale, kort ventetid og tett oppfølging fra kirurg og ernæringsfysiolog."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Flere fagområder", path: "/flere-fagomrader" },
          { name: "Bariatrisk kirurgi", path: BARIATRISK },
          { name: "Sleeve gastrektomi", path: CANONICAL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="sr-only">
        Sleeve gastrektomi (gastric sleeve) hos CMedical — robotassistert slankeoperasjon
      </h1>

      {/* 1. HERO */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          <div className="flex items-center page-edge-text-left py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <p className="text-xs font-light text-foreground/60 mb-5">
                <Link to={BARIATRISK} className="hover:text-foreground">
                  Bariatrisk kirurgi
                </Link>
                <span className="mx-2">/</span>Sleeve gastrektomi
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Sleeve gastrektomi
                <span className="block italic">— et nytt utgangspunkt</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Robotassistert kikkhullsoperasjon der 60–80 % av magesekken
                fjernes. Bestill en gratis digital informasjonssamtale, og få
                en trygg plan sammen med kirurg og ernæringsfysiolog.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = BOOKING)}
                >
                  Bestill gratis informasjonssamtale
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                {["Gratis førstesamtale", "Ingen henvisning", "Robotassistert teknikk"].map((u) => (
                  <li key={u} className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <img
              src={heroImg}
              alt="Sleeve gastrektomi hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* 2. SEGMENT */}
      <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Fortell oss hvor du er
                <span className="block">— vi finner veien videre.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {segments.map((s) => (
                <div key={s.id} className="bg-background p-7 flex flex-col">
                  <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>
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

      {/* 3. SLIK GJØRES INNGREPET */}
      <section className="bg-background">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs text-foreground/60 mb-5">Slik gjøres inngrepet</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Robotassistert presisjon
                <span className="block italic">— skånsom og effektiv.</span>
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Sleeve gastrektomi gjøres som kikkhullskirurgi med kirurgisk
                robot. 60–80 % av magesekken fjernes, og du blir naturlig mett
                av mindre mat. Det gjøres ingen omkobling av tarmen.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  { n: "01", title: "Metode", desc: "Robotassistert kikkhullskirurgi (rSG) for høy presisjon, mindre snitt og raskere restitusjon." },
                  { n: "02", title: "Varighet", desc: "Selve inngrepet tar 1 til 2 timer. Ingen omkobling av tarmen — kun magesekken formes om." },
                  { n: "03", title: "Restitusjon", desc: "De fleste er hjemme samme dag eller dagen etter. Du følges tett av kirurg og ernæringsfysiolog i to år." },
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
                to="/robotassistert-kirurgi"
                className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
              >
                Les mer om robotassistert kirurgi
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-auto lg:min-h-full overflow-hidden">
            <img
              src={teamImage}
              alt="Tverrfaglig team hos CMedical"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. AUDIENCES */}
      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Hvem passer det for
                <br />
                <span className="text-foreground/70">— og hvem er det ikke for?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {audiences.map((a) => (
                <div
                  key={a.title}
                  className="bg-background rounded-sm border border-border/40 flex flex-col p-7"
                >
                  <div className="mb-6 text-foreground/80">
                    <a.Icon className="w-6 h-6" strokeWidth={1.25} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {a.desc}
                  </p>
                  <Link
                    to={a.href}
                    className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all self-start"
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

      {/* 5. SYMPTOMSJEKK */}
      <SymptomServiceSection
        background="background"
        title="Hva passer for deg?"
        description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
        items={[
          { symptom: "Jeg har prøvd diett og trening uten varig resultat", service: "Gratis informasjonssamtale", href: BOOKING },
          { symptom: "BMI over 35 og en eller flere følgesykdommer", service: "Vurdering hos kirurg", href: BOOKING },
          { symptom: "Jeg har diabetes type 2 og vurderer kirurgi", service: "Endokrinolog + kirurg", href: "/behandlinger/flere-fagomrader/endokrinologi" },
          { symptom: "Jeg trenger hjelp med kostholdet før operasjon", service: "Ernæringsfysiolog", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
          { symptom: "Jeg ønsker mental forberedelse", service: "Psykolog", href: "/behandlinger/flere-fagomrader/psykologi" },
          { symptom: "Hud-overskudd etter vekttap", service: "Plastikkirurgi", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
        ]}
      />

      {/* 6. SLIK KOMMER DU I GANG */}
      <section className="bg-background py-14 md:py-20">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs text-foreground/60 mb-5">Slik kommer du i gang</p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Tre trygge steg
                <span className="block">— fra første samtale til operasjon.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {[
                {
                  n: "01",
                  title: "Bestill konsultasjon",
                  desc: "Du trenger ingen henvisning. Start med en gratis digital førstekonsultasjon — kort ventetid og uten forpliktelser.",
                },
                {
                  n: "02",
                  title: "Forberedelser",
                  desc: "De fleste må gjennomføre en lavkaloridiett i ukene før operasjonen. Du følges av ernæringsfysiolog gjennom hele forberedelsen.",
                },
                {
                  n: "03",
                  title: "Pris og finansiering",
                  desc: "Gastric sleeve hos private aktører starter typisk rundt 98 000 kr. Eksakt pris finner du i prislisten vår.",
                },
              ].map((step) => (
                <div key={step.n} className="bg-background p-7 flex flex-col">
                  <p className="text-xs font-light text-foreground/60 mb-4">{step.n}</p>
                  <h3 className="text-lg font-normal mb-3 leading-snug">{step.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="cta" size="lg" onClick={() => (window.location.href = BOOKING)}>
                Bestill gratis informasjonssamtale
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/priser">Se priser</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RELATERTE TJENESTER */}
      <ServicesListSection
        title="Tjenester som hører sammen."
        description="Sleeve gastrektomi er én del av et lengre forløp. Disse tjenestene henger ofte sammen."
        items={services}
      />

      {/* 8. STATS */}
      <section className="bg-brand-dark text-brand-light pt-14 md:pt-16 pb-14 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-5">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Tall som forteller en historie.
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-brand-light/70 leading-relaxed max-w-xl">
                  Åpenhet om resultater er en del av tilliten. Her er hva vi
                  oppnår sammen med pasientene våre.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-light/15 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-light/15">
                {[
                  { v: "60–80%", k: "Av magesekken fjernes", sub: "Ved sleeve gastrektomi" },
                  { v: "1–2 t", k: "Operasjonstid", sub: "Robotassistert kikkhull" },
                  { v: "2 år", k: "Oppfølging inkludert", sub: "Tverrfaglig team" },
                  { v: "0 kr", k: "Informasjonssamtale", sub: "Digital og uforpliktende" },
                ].map((row, i) => (
                  <div key={row.k} className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 3 ? "md:pr-0" : ""}`}>
                    <dd className="text-3xl md:text-4xl font-light leading-none mb-3">
                      <AnimatedStat value={row.v} />
                    </dd>
                    <dt className="text-sm font-normal text-brand-light mb-1">{row.k}</dt>
                    <p className="text-xs font-light text-brand-light/60">{row.sub}</p>
                  </div>
                ))}
              </dl>
            </div>

            <p className="text-xs font-light text-brand-light/60 mt-8">
              Resultater varierer individuelt. Pris og inkludert oppfølging kan endres — se prisliste.
            </p>
          </div>
        </div>
      </section>

      {/* 9. TILBAKEMELDINGER */}
      <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                Tilbakemeldinger fra ekte pasienter
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <div key={i} className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
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

      {/* 10. FAQ */}
      <section className="bg-background py-14 md:py-20">
        <div className="page-shell">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-xs text-foreground/60 mb-5">Ofte stilte spørsmål</p>
              <h2 className="text-3xl md:text-4xl font-light leading-tight text-foreground">
                Det folk lurer på
                <span className="block italic">før de bestiller samtale.</span>
              </h2>
            </div>
            <div className="divide-y divide-border/60 border-t border-border/60">
              {faqs.map((f, i) => (
                <details key={i} className="group py-6">
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                    <h3 className="text-base md:text-lg font-normal text-foreground leading-snug">
                      {f.q}
                    </h3>
                    <span className="text-foreground/40 group-open:rotate-45 transition-transform mt-1 text-2xl font-light leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm md:text-base font-light text-muted-foreground leading-relaxed max-w-3xl">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. SPESIALISTER + CTA */}
      <FeatureSpotlight
        eyebrow="Start her"
        title={<>Begynn med en <span className="italic">gratis samtale</span></>}
        text="Informasjonssamtalen er digital og uforpliktende. Vi går gjennom dine ønsker, helse og hva som er realistisk — slik at du kan ta valget i ro og mak."
        ctaLabel="Bestill gratis informasjonssamtale"
        ctaHref={BOOKING}
        image={heroImg}
        imageAlt="Digital informasjonssamtale hos CMedical"
      />

      <SpecialistsScroller
        category="flere-fagomrader"
        title="Spesialistene som følger deg."
        seeAllHref="/spesialister?kategori=flere-fagomrader"
        seeAllLabel="Se alle spesialister"
      />

      <InsurancePartners />
      <BookingCTA />
    </PageLayout>
  );
};

export default SleeveGastrektomiPage;
