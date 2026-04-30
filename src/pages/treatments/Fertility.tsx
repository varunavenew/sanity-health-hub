import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";

import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import madeleineEngen from "@/assets/specialists/madeleine-engen.jpg";

interface PageProps {
  isChatOpen: boolean;
}

/* ──────────────────────────────────────────────────────────────
   DATA — segments, audiences, services
   ────────────────────────────────────────────────────────────── */

const segments = [
  {
    id: "forsta",
    title: "Jeg vil forstå fruktbarheten min",
    desc:
      "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
    cta: "Les mer",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
  },
  {
    id: "gravid",
    title: "Jeg vil bli gravid",
    desc:
      "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
    cta: "Bestill utredning",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
  },
  {
    id: "bevare",
    title: "Jeg vil bevare mulighetene mine",
    desc:
      "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
    cta: "Snakk med oss",
    href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon",
  },
  {
    id: "mann",
    title: "Jeg er mann og vil sjekke fruktbarheten",
    desc:
      "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
    cta: "Bestill analyse",
    href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
  },
];

const audiences = [
  {
    title: "Heterofile par",
    desc:
      "Dere har prøvd en stund og lurer på om noe er galt. Vi starter med utredning av begge — ingen henvisning, ingen ventetid.",
    href: "/booking?kategori=fertilitet",
  },
  {
    title: "De ventende",
    desc:
      "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
  },
  {
    title: "Singel",
    desc:
      "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
    href: "/booking?kategori=fertilitet",
  },
];

const services = [
  { title: "Fertilitetssjekk og utredning", desc: "Hormoner, ultralyd, sædanalyse" },
  { title: "IVF — prøverørsbehandling", desc: "Inkludert ICSI ved behov" },
  { title: "IUI — inseminasjon", desc: "Med partner eller donor" },
  { title: "Eggdonasjon", desc: "Norges nyeste eggbank" },
  { title: "Nedfrysing av egg", desc: "Egg, sæd og embryo" },
  { title: "Genetisk testing (PGT)", desc: "For utvalgte indikasjoner" },
  { title: "Gynekologi og kirurgi", desc: "Polypper, endometriose, myomer" },
  { title: "Mannlig fertilitet", desc: "Sædanalyse og mikro-TESE" },
  { title: "Psykisk helsehjelp", desc: "Samtaler gjennom hele forløpet" },
];

const insurance = [
  "Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika",
];

/* ──────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────────── */

const Fertility = ({ isChatOpen }: PageProps) => {
  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 4),
    []
  );

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
          1. HERO — split: lys venstre med tekst + lys høyre med "Første"-kort
      ============================================================ */}
      <section className="bg-secondary/40">
        <div className="container mx-auto px-6 md:px-16 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            {/* Left — copy + CTA */}
            <div className="lg:col-span-7">
              <p className="text-xs tracking-wide text-foreground/60 mb-5">
                Fertilitet — CMedical
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.04] text-foreground mb-8">
                Noen ganger trenger kroppen <span className="underline decoration-brand-dark/40 decoration-[2px] underline-offset-[6px]">litt hjelp</span> på veien.
              </h2>
              <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed max-w-xl mb-10">
                Vi tilbyr fertilitet for alle som ønsker barn. Med fagmiljøet
                vårt under samme tak, korte ventetider og en behandling som
                møter dere som mennesker — ikke kun som en sak.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "fertilitet",
                    }))
                  }
                >
                  Bestill konsultasjon
                </Button>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-light text-foreground hover:text-foreground/70 transition-colors"
                >
                  Gratis gjennomført rådgiving →
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground font-light">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span>4,7 av 5 — basert på 1 200+ pasientvurderinger</span>
              </div>
            </div>

            {/* Right — "Første"-kort */}
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-secondary mb-6">
                <img
                  src={journeyConsultation}
                  alt="Første samtale hos CMedical"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-secondary/60 p-6 rounded-sm border border-border/40">
                <p className="text-xs tracking-wide text-foreground/60 mb-2">Første</p>
                <p className="text-base font-light text-foreground leading-relaxed">
                  Konsultasjon hvor vi får et tydelig bilde av hvor dere står — og hva som er neste steg.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. MØRK SEGMENT-SEKSJON — "Fortell oss hvor du er"
      ============================================================ */}
      <section className="bg-brand-dark text-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs tracking-wide text-white/60 mb-4">
                Hva kan vi hjelpe deg med?
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Fortell oss hvor du er — vi finner veien videre.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-sm overflow-hidden">
              {segments.map((s) => (
                <div
                  key={s.id}
                  className="bg-brand-dark p-7 flex flex-col"
                >
                  <h3 className="text-lg font-normal mb-4 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-sm font-light text-white/70 leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>
                  <Link
                    to={s.href}
                    className="inline-flex items-center text-sm font-light text-accent hover:gap-2.5 gap-2 transition-all"
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
          3. ALLE ER VELKOMNE — tre målgrupper
      ============================================================ */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                For deg som
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Alle er velkomne — uansett utgangspunkt.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {audiences.map((a) => (
                <div
                  key={a.title}
                  className="bg-background p-7 rounded-sm border border-border/40 flex flex-col"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center mb-5">
                    <Check className="w-4 h-4 text-foreground/70" />
                  </div>
                  <h3 className="text-lg font-normal text-foreground mb-3">
                    {a.title}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {a.desc}
                  </p>
                  <Link
                    to={a.href}
                    className="inline-flex items-center text-sm font-light text-foreground hover:text-accent-foreground hover:gap-2.5 gap-2 transition-all"
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
          4. TO KLINIKKER SAMLET — 3 steg + sammenligning
      ============================================================ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Hvorfor CMedical
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-5">
                Det beste fra to klinikker — samlet på ett sted.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Livio og CMedical Sandvika har slått seg sammen. Det betyr mer
                erfaring, samme team — og et tilbud som dekker hele veien.
              </p>

              <div className="space-y-8">
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
                  <div key={step.n} className="grid grid-cols-12 gap-5">
                    <div className="col-span-2 text-2xl font-light text-foreground/40">
                      {step.n}
                    </div>
                    <div className="col-span-10">
                      <h3 className="text-lg font-normal text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sammenligningskort */}
            <div className="lg:col-span-5">
              <div className="bg-secondary/50 p-7 rounded-sm">
                <p className="text-xs tracking-wide text-foreground/60 mb-6">
                  CMedical i tall
                </p>
                <dl className="divide-y divide-border/60">
                  {[
                    { k: "Klinikker", v: "Norges eldste" },
                    { k: "Ventetid", v: "Ingen" },
                    { k: "Henvisning nødvendig", v: "Nei" },
                    { k: "Vurdering", v: "4,7 ★" },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-baseline justify-between py-4"
                    >
                      <dt className="text-sm font-light text-muted-foreground">
                        {row.k}
                      </dt>
                      <dd className="text-base font-normal text-foreground">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. TESTIMONIAL — grønn smal banner
      ============================================================ */}
      <section className="bg-[hsl(150_22%_22%)] text-white py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-light leading-snug mb-6">
              «Vi følte oss trygge fra første møte. De tok seg virkelig tid til
              å bli kjent med oss og vårt utgangspunkt — og det betød alt.»
            </blockquote>
            <p className="text-sm font-light text-white/70">
              — Hilde, pasient gjennom IVF-forløp 2024
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. BLI KJENT MED MADELEINE — trygghet og person
      ============================================================ */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
                <img
                  src={madeleineEngen}
                  alt="Madeleine Engen — fagansvarlig kvinnehelse hos CMedical"
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Bli kjent med Madeleine
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
                «Ingen skal måtte gjette seg gjennom kroppen sin.»
              </h2>
              <p className="text-base md:text-lg font-light text-foreground/85 leading-relaxed mb-6">
                Det er ord Madeleine Engen lever etter. Hun er gynekolog,
                kirurg og fagansvarlig for kvinnehelse hos CMedical — og en
                tydelig stemme for kvinnehelse i Norge.
              </p>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-8">
                Med spesialkompetanse innen urogynekologi, hormoner og
                overgangsalder møter Madeleine pasientene sine med både
                medisinsk presisjon og en sjelden varme. Mange som vurderer
                fertilitetsbehandling starter med en samtale hos henne — for
                å få oversikt før den større reisen begynner.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="cta" size="lg" className="px-7">
                  <Link
                    to={buildBookingUrl({
                      kategori: "fertilitet",
                      spesialist: "madeleine-engen",
                    })}
                  >
                    Bestill time hos Madeleine
                  </Link>
                </Button>
                <Button asChild variant="cta-outline" size="lg" className="px-7">
                  <Link to="/spesialister/madeleine-engen">
                    Les mer om Madeleine
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. HVA VI TILBYR — tjeneste-grid
      ============================================================ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-5">
                <p className="text-xs tracking-wide text-foreground/60 mb-4">
                  Tjenester
                </p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  Hva vi tilbyr.
                </h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Fra første samtale til oppfølging — hele fertilitetstilbudet
                  vårt finner du her. Trenger du hjelp til å velge, kan du
                  alltid ringe oss for en uforpliktende prat.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-sm overflow-hidden">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="bg-background p-6 flex items-start justify-between gap-4 hover:bg-secondary/40 transition-colors"
                >
                  <div>
                    <h3 className="text-base font-normal text-foreground mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-snug">
                      {s.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. SPESIALISTER — menneskene bak
      ============================================================ */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <p className="text-xs tracking-wide text-foreground/60 mb-4">
                  Menneskene bak
                </p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  Spesialistene som følger deg.
                </h2>
              </div>
              <Link
                to="/spesialister?kategori=fertilitet"
                className="text-sm font-light text-foreground hover:text-accent-foreground transition-colors"
              >
                Se alle fertilitetsspesialister →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {fertilitySpecialists.map((sp) => (
                <Link
                  key={sp.slug}
                  to={`/spesialister/${sp.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-sm mb-4 bg-secondary">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-base font-normal text-foreground mb-0.5 group-hover:text-accent-foreground transition-colors">
                    {sp.name}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground">
                    {sp.subtitle || sp.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. MØRK SLUTT-CTA — "Usikker på hvor du skal begynne?"
      ============================================================ */}
      <section className="bg-brand-dark text-white py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">
                Usikker på hvor du skal begynne?
              </h2>
              <p className="text-base md:text-lg font-light text-white/70 leading-relaxed max-w-lg">
                Ring oss, så hjelper vi deg å finne riktig første steg. Vi tar
                oss tid — og det koster ingenting.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Button asChild variant="cta-dark" size="lg" className="px-8">
                <Link to={buildBookingUrl({ kategori: "fertilitet" })}>
                  Book konsultasjon
                </Link>
              </Button>
              <a
                href="tel:+4722000000"
                className="inline-flex items-center gap-2 text-sm font-light text-white/85 hover:text-white transition-colors px-2"
              >
                <Phone className="w-4 h-4" />
                Eller ring oss på 22 00 00 00
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. FORSIKRINGSAVTALER — strimmel
      ============================================================ */}
      <section className="bg-[hsl(var(--brand-dark))]/95 text-white border-t border-white/10 py-10">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <p className="text-xs tracking-wide text-white/60 flex-shrink-0">
              Forsikringsavtaler
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {insurance.map((name) => (
                <span
                  key={name}
                  className="text-sm font-light text-white/80"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ta det første steget — på deres premisser."
        subtitle="Den første samtalen er gratis og helt uforpliktende."
        primaryCTA="Bestill digital rådgiving"
        secondaryCTA="Snakk med en sykepleier"
        secondaryLink="/kontakt"
      />
    </PageLayout>
  );
};

export default Fertility;
