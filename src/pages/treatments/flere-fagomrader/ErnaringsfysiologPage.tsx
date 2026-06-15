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

import heroImg from "@/assets/hero/hero-lifestyle-1.jpg";
import teamImage from "@/assets/hero/tverrfaglig-team.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const BASE = "/behandlinger/flere-fagomrader";
const CANONICAL = `${BASE}/ernaringsfysiolog`;
const BOOKING = buildBookingUrl({
  kategori: "flere-fagomrader",
  tjeneste: "ernaringsfysiolog",
});

const segments = [
  {
    id: "livsstil",
    title: "Du vil ha varige livsstilsendringer",
    desc:
      "Du har prøvd dietter som ikke varer. Sammen legger vi en plan tilpasset hverdagen din — uten urealistiske krav.",
    cta: "Bestill samtale",
    href: BOOKING,
  },
  {
    id: "kirurgi",
    title: "Du forbereder deg til kirurgi",
    desc:
      "Lavkaloridiett før sleeve gastrektomi, og oppfølging etterpå. Ernæringsfysiologen følger deg trygt gjennom hele forløpet.",
    cta: "Les om sleeve",
    href: `${BASE}/bariatrisk-kirurgi/sleeve-gastrektomi`,
  },
  {
    id: "medisinsk",
    title: "Du har en medisinsk tilstand",
    desc:
      "Diabetes, hormonforstyrrelser, IBS eller fertilitetsutfordringer. Riktig kosthold kan være en del av behandlingen.",
    cta: "Snakk med oss",
    href: BOOKING,
  },
];

const audiences = [
  {
    title: "Du som vil endre kosthold",
    Icon: Users,
    desc:
      "Du ønsker konkret veiledning som passer ditt liv — ikke en standardisert diettplan. Vi tar utgangspunkt i deg.",
    href: BOOKING,
  },
  {
    title: "Du som skal opereres",
    Icon: Clock,
    desc:
      "Bariatrisk kirurgi krever forberedelser og oppfølging. Ernæringsfysiolog er en del av det tverrfaglige teamet.",
    href: `${BASE}/bariatrisk-kirurgi/sleeve-gastrektomi`,
  },
  {
    title: "Du som har helseutfordringer",
    Icon: User,
    desc:
      "Hormoner, fordøyelse, fertilitet eller overgangsalder. Kostholdet henger ofte tett sammen med medisinsk behandling.",
    href: BOOKING,
  },
];

const services = [
  { title: "Sleeve gastrektomi", desc: "Forberedelse og oppfølging etter operasjon", href: `${BASE}/bariatrisk-kirurgi/sleeve-gastrektomi` },
  { title: "Bariatrisk kirurgi", desc: "Hele det tverrfaglige forløpet", href: `${BASE}/bariatrisk-kirurgi` },
  { title: "Endokrinologi", desc: "Hormonell utredning og behandling", href: `${BASE}/endokrinologi` },
  { title: "Psykologi", desc: "Mental forberedelse og oppfølging", href: `${BASE}/psykologi` },
  { title: "Gynekologi – overgangsalder", desc: "Kosthold som del av hormonell helse", href: "/behandlinger/gynekologi/overgangsalder" },
  { title: "Fertilitet", desc: "Kosthold ved utredning og behandling", href: "/behandlinger/fertilitet" },
];

const reviews = [
  { text: "Endelig en plan som passer hverdagen min. Jeg fikk verktøy, ikke pekefinger.", author: "Marit S.", date: "3 måneder siden" },
  { text: "Forberedelsen før operasjonen ble mye tryggere med ernæringsfysiolog ved siden.", author: "Tom H.", date: "Operert 2024" },
  { text: "Konkrete råd, lite mas. Jeg har endret kostholdet uten å føle at jeg gir avkall på noe.", author: "Lise B.", date: "6 måneder siden" },
];

const faqs = [
  {
    q: "Hva er en klinisk ernæringsfysiolog?",
    a: "En klinisk ernæringsfysiolog er en autorisert helsearbeider som veileder innen kosthold, ernæring og livsstil — både ved generell helse og ved medisinske tilstander. Hos CMedical jobber ernæringsfysiologen tett med kirurger, gynekologer og endokrinologer.",
  },
  {
    q: "Trenger jeg henvisning?",
    a: "Nei. Du kan bestille time direkte. Ventetiden hos oss er kort.",
  },
  {
    q: "Hvem passer ernæringsveiledning for?",
    a: "Alle som ønsker konkrete, individuelt tilpassede kostholdsråd. Det kan handle om varige livsstilsendringer, forberedelse til bariatrisk kirurgi, hormonelle plager, fertilitet, diabetes eller fordøyelsesproblemer.",
  },
  {
    q: "Hvordan foregår en konsultasjon?",
    a: "Vi starter med en grundig samtale om helse, vaner og mål. Du får en konkret plan og verktøy du kan bruke i hverdagen — og oppfølging i takt med behovet ditt.",
  },
  {
    q: "Hva koster det?",
    a: "Se prislisten vår for oppdaterte priser. Vi går gjennom hva som er inkludert før første time, så det ikke er noen overraskelser.",
  },
  {
    q: "Dekker forsikringen min ernæringsfysiolog?",
    a: "Mange behandlingsforsikringer dekker ernæringsfysiolog ved spesifikke medisinske indikasjoner. Sjekk med ditt forsikringsselskap, eller spør oss — vi har avtaler med EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg.",
  },
];

const ErnaringsfysiologPage = ({ isChatOpen }: PageProps) => {
  const relatedSpecialists = useMemo(() => {
    return specialists
      .filter((s) =>
        s.expertise?.some((e) =>
          ["Ernæring", "Klinisk ernæring", "Bariatrisk", "Endokrinologi"].some((kw) =>
            e.toLowerCase().includes(kw.toLowerCase())
          )
        )
      )
      .slice(0, 5);
  }, []);

  useEffect(() => {
    document.title = "Klinisk ernæringsfysiolog | CMedical";
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
        title="Klinisk ernæringsfysiolog | CMedical"
        description="Individuelt tilpasset kostholdsveiledning hos CMedical. Klinisk ernæringsfysiolog som jobber tverrfaglig med kirurg, gynekolog og endokrinolog."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Flere fagområder", path: "/flere-fagomrader" },
          { name: "Ernæringsfysiolog", path: CANONICAL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="sr-only">
        Klinisk ernæringsfysiolog hos CMedical — individuell veiledning og tverrfaglig oppfølging
      </h1>

      {/* 1. HERO */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          <div className="flex items-center page-edge-text-left py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <p className="text-xs font-light text-foreground/60 mb-5">
                <Link to="/flere-fagomrader" className="hover:text-foreground">
                  Flere fagområder
                </Link>
                <span className="mx-2">/</span>Ernæringsfysiolog
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Kosthold som varer
                <span className="block italic">— tilpasset deg.</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Klinisk ernæringsfysiolog som jobber sammen med kirurg, gynekolog
                og endokrinolog. Du får konkret veiledning — uten standardplaner
                eller pekefinger.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = BOOKING)}
                >
                  Bestill konsultasjon
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                {["Ingen henvisning", "Kort ventetid", "Tverrfaglig team"].map((u) => (
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
              alt="Klinisk ernæringsfysiolog hos CMedical"
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

      {/* 3. SLIK JOBBER VI */}
      <section className="bg-background">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs text-foreground/60 mb-5">Slik jobber vi</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Konkret, individuelt
                <span className="block italic">— og bygget for hverdagen din.</span>
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Målet er å hjelpe deg å nå og beholde god helse gjennom riktig
                kosthold. Ernæringsfysiologen jobber tett med andre spesialister
                hos oss når det er nyttig for deg.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  { n: "01", title: "Kartlegging", desc: "Grundig samtale om helse, vaner, mål og rammer. Ingen standardplaner — alt tar utgangspunkt i deg." },
                  { n: "02", title: "Plan og verktøy", desc: "Du får en konkret plan med tiltak som passer hverdagen, og praktiske verktøy du kan bruke videre på egen hånd." },
                  { n: "03", title: "Oppfølging", desc: "Vi justerer underveis. Du har tilgang til ernæringsfysiologen så lenge du trenger det — alene eller sammen med kirurg, gynekolog eller endokrinolog." },
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
                to="/priser"
                className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
              >
                Se priser
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
                <span className="text-foreground/70">— og hvordan vi hjelper.</span>
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
        title="Hva er ditt utgangspunkt?"
        description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
        items={[
          { symptom: "Jeg vil endre kosthold på en måte som varer", service: "Klinisk ernæringsfysiolog", href: BOOKING },
          { symptom: "Jeg skal opereres med sleeve gastrektomi", service: "Forberedelse og oppfølging", href: `${BASE}/bariatrisk-kirurgi/sleeve-gastrektomi` },
          { symptom: "Jeg har diabetes eller insulinresistens", service: "Ernæring + endokrinolog", href: `${BASE}/endokrinologi` },
          { symptom: "Jeg har hormonelle plager eller PMOS", service: "Ernæring + gynekolog", href: "/behandlinger/gynekologi/overgangsalder" },
          { symptom: "Jeg trenger støtte ved fertilitetsutredning", service: "Ernæring + fertilitet", href: "/behandlinger/fertilitet" },
          { symptom: "Jeg vil ha mental støtte i prosessen", service: "Psykolog", href: `${BASE}/psykologi` },
        ]}
      />

      {/* 6. SLIK KOMMER DU I GANG */}
      <section className="bg-background py-14 md:py-20">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs text-foreground/60 mb-5">Slik kommer du i gang</p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Tre enkle steg
                <span className="block">— fra første samtale til varig endring.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {[
                { n: "01", title: "Bestill time", desc: "Du trenger ingen henvisning. Kort ventetid, og du møter samme ernæringsfysiolog gjennom hele forløpet." },
                { n: "02", title: "Plan tilpasset deg", desc: "Du får konkrete tiltak som passer din hverdag — ikke en standardplan vi gir til alle." },
                { n: "03", title: "Oppfølging i takt", desc: "Vi følger deg opp så lenge du trenger det, og kobler inn kirurg, gynekolog eller endokrinolog ved behov." },
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
                Bestill konsultasjon
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
        description="Ernæringsveiledning hører ofte sammen med andre fagområder. Disse tjenestene henger naturlig sammen."
        items={services}
      />

      {/* 8. STATS */}
      <section className="bg-brand-dark text-brand-light pt-14 md:pt-16 pb-14 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-5">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Hvorfor velge oss.
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-brand-light/70 leading-relaxed max-w-xl">
                  Klinisk ernæringsfysiolog som del av et større team — slik at
                  kostholdet ditt henger sammen med resten av behandlingen.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-light/15 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-light/15">
                {[
                  { v: "1:1", k: "Individuell oppfølging", sub: "Ingen standardplaner" },
                  { v: "0", k: "Krav om henvisning", sub: "Bestill direkte" },
                  { v: "Tverrfaglig", k: "Kirurg, gynekolog, endokrinolog", sub: "Under samme tak" },
                  { v: "Kort", k: "Ventetid", sub: "Time innen kort tid" },
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
              Pris og inkludert oppfølging varierer — se prisliste eller spør oss.
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
                <span className="block italic">før de bestiller time.</span>
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

      {/* 11. CTA */}
      <FeatureSpotlight
        eyebrow="Start her"
        title={<>Begynn med en <span className="italic">samtale</span></>}
        text="Vi går gjennom helse, vaner og mål — og legger en plan som passer livet ditt. Ingen pekefinger, bare konkret hjelp."
        ctaLabel="Bestill konsultasjon"
        ctaHref={BOOKING}
        image={heroImg}
        imageAlt="Klinisk ernæringsfysiolog hos CMedical"
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

export default ErnaringsfysiologPage;
