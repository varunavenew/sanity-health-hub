import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";

import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import fertilityHeroImg from "@/assets/categories/fertilitet-real.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
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
      <header className="bg-brand-dark pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          {/* Left — copy + CTA */}
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <p className="text-xs tracking-wide text-white/60 mb-8">
                Fertilitet — CMedical
              </p>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white leading-[1.05]">
                Noen ganger trenger kroppen <span className="underline decoration-accent decoration-[2px] underline-offset-[6px]">litt hjelp</span> på veien
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-white/70">
                Å ville bli foreldre er noe av det sterkeste man kan kjenne på.
                For mange går det av seg selv. For andre tar det litt lenger
                tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og
                det finnes svar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta-dark"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "fertilitet",
                    }))
                  }
                >
                  Bestill konsultasjon
                </Button>
                <Link
                  to="/kontakt"
                  className="text-sm font-light text-white/85 hover:text-white border-b border-white/40 hover:border-white pb-0.5 transition-colors"
                >
                  Gratis prat med sykepleier
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm font-light text-white/70">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span>4,7 av 5 — Norges eldste private fertilitetsklinikk</span>
              </div>
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
      </header>



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
                Alle er velkomne
                <br />
                <span className="text-foreground/70">— uansett utgangspunkt.</span>
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
                    className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
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
          4. HVORFOR CMEDICAL — split screen: tekst venstre, bilde + flytende stat-kort høyre
      ============================================================ */}
      <section className="bg-background">
        <div className="grid lg:grid-cols-12 lg:min-h-[640px]">
          {/* Left — copy + numbered steps (wide) */}
          <div className="lg:col-span-9 px-6 md:px-16 lg:px-20 py-20 lg:py-24 flex flex-col">
            <div className="w-full max-w-5xl flex-1">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Heading + intro */}
                <div className="lg:col-span-7">
                  <p className="text-xs tracking-wide text-foreground/60 mb-5">
                    Hvorfor CMedical
                  </p>
                  <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                    Det beste fra to klinikker — samlet på ett sted.
                  </h2>
                  <p className="text-base font-light text-muted-foreground leading-relaxed max-w-md">
                    Livio og CMedical Sandvika har slått seg sammen. Det betyr
                    mer erfaring, samme team — og et tilbud som dekker hele
                    veien.
                  </p>
                </div>

                {/* Numbered steps */}
                <div className="lg:col-span-5 space-y-8">
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
                    <div key={step.n} className="grid grid-cols-12 gap-4">
                      <div className="col-span-2 text-sm font-light text-foreground/40 tracking-wider pt-1">
                        {step.n}
                      </div>
                      <div className="col-span-10">
                        <h3 className="text-base font-normal text-foreground mb-1.5">
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
            </div>
          </div>

          {/* Right — image (narrow) */}
          <div className="lg:col-span-3 relative bg-secondary/40 min-h-[320px] lg:min-h-full overflow-hidden">
            <img
              src={heroClinicLounge}
              alt="CMedical fertilitetsklinikk i Sandvika"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-dark/15" />
          </div>
        </div>

        {/* Stat stripe — full bredde, men løftet opp slik at den bryter inn i bildet/seksjonen over */}
        <div className="px-6 md:px-16 lg:px-20 -mt-16 lg:-mt-20 relative z-10 pb-20 lg:pb-24">
          <div className="bg-background border border-border/60 shadow-[0_24px_60px_-30px_hsl(var(--brand-dark)/0.25)] px-6 md:px-10 py-8 md:py-10">
            <div className="flex items-end justify-between mb-6">
              <p className="text-xs tracking-wide text-foreground/60">
                CMedical i tall
              </p>
              <p className="text-xs font-light text-muted-foreground/80 hidden md:block">
                Norges eldste private fertilitetsklinikk
              </p>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 divide-y divide-x-0 md:divide-y-0 md:divide-x divide-border/60">
              {[
                { k: "Klinikker", v: "Norges eldste", sub: "Etablert 1989" },
                { k: "Ventetid", v: "Ingen", sub: "Time samme uke" },
                { k: "Henvisning", v: "Nei", sub: "Book direkte" },
                { k: "Vurdering", v: "4,7", sub: "1 200+ pasienter", star: true },
              ].map((row) => (
                <div
                  key={row.k}
                  className="py-6 md:py-2 md:px-6 first:md:pl-0 last:md:pr-0"
                >
                  <dt className="text-xs font-light text-muted-foreground mb-3 tracking-wide">
                    {row.k}
                  </dt>
                  <dd className="text-2xl md:text-3xl lg:text-[2rem] font-light text-foreground tracking-tight leading-none mb-2 flex items-baseline gap-1.5">
                    {row.v}
                    {row.star && (
                      <Star className="w-4 h-4 fill-brand-dark text-brand-dark translate-y-[-3px]" />
                    )}
                  </dd>
                  <p className="text-xs font-light text-muted-foreground/70">
                    {row.sub}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>





      {/* ============================================================
          5. TESTIMONIAL — grønn smal banner
      ============================================================ */}
      <section className="bg-brand-dark text-white py-16 md:py-20 border-t border-white/10">
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
          6. HVA VI TILBYR — tjeneste-grid
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
          7. SPESIALISTER — overskrift + promo (10s rotasjon) + grid
      ============================================================ */}
      <section className="bg-secondary/40">
        {/* Overskrift over forhåndsvisningen */}
        <div className="container mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-10 md:pb-14">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Menneskene bak
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground whitespace-nowrap">
                Spesialistene som følger deg.
              </h2>
            </div>
            <Link
              to="/spesialister?kategori=fertilitet"
              className="text-sm font-light text-foreground hover:text-foreground/70 transition-colors"
            >
              Se alle fertilitetsspesialister →
            </Link>
          </div>
        </div>

        {/* Promo — forhåndsvisning */}
        <div className="grid lg:grid-cols-12 lg:min-h-[640px]">
          <div className="lg:col-span-5 relative bg-secondary min-h-[420px] lg:min-h-full overflow-hidden">
            <img
              key={activeSpecialist.slug}
              src={activeSpecialist.image}
              alt={`${activeSpecialist.name} — ${activeSpecialist.title} hos CMedical`}
              loading="lazy"
              width={1024}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            />
          </div>

          <div className="lg:col-span-7 flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-20">
            <div key={activeSpecialist.slug} className="w-full max-w-2xl animate-fade-in">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Bli kjent med {activeSpecialist.name.split(" ")[0]}
              </p>
              <h3 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
                {activeSpecialist.title}
                {activeSpecialist.subtitle ? ` — ${activeSpecialist.subtitle}` : ""}.
              </h3>
              {activeSpecialist.bio && (
                <p className="text-base md:text-lg font-light text-foreground/85 leading-relaxed mb-8 line-clamp-6">
                  {activeSpecialist.bio.split("\n\n")[0]}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button asChild variant="cta" size="lg" className="px-7">
                  <Link
                    to={buildBookingUrl({
                      kategori: "fertilitet",
                      spesialist: activeSpecialist.slug,
                    })}
                  >
                    Bestill time hos {activeSpecialist.name.split(" ")[0]}
                  </Link>
                </Button>
                <Button asChild variant="cta-outline" size="lg" className="px-7">
                  <Link to={`/spesialister/${activeSpecialist.slug}`}>
                    Les mer om {activeSpecialist.name.split(" ")[0]}
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {promoSpecialists.map((sp, i) => (
                  <button
                    key={sp.slug}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Vis ${sp.name}`}
                    className={`h-[2px] transition-all duration-300 ${
                      i === activeIndex
                        ? "w-10 bg-foreground"
                        : "w-6 bg-foreground/25 hover:bg-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Kant-i-kant grid — synkronisert med promo-seksjonen over */}
        <div className={`grid grid-cols-2 gap-0 ${promoSpecialists.length === 5 ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
          {promoSpecialists.map((sp, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={sp.slug}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Vis ${sp.name} i promo`}
                aria-pressed={isActive}
                className="group relative block text-left focus:outline-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <img
                    src={sp.image}
                    alt={sp.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] ${
                      isActive ? "scale-[1.03]" : ""
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-brand-dark/40 via-brand-dark/0 to-transparent"
                        : "bg-gradient-to-t from-brand-dark/85 via-brand-dark/30 to-brand-dark/10"
                    }`}
                  />

                  {/* Aktiv-indikator */}
                  {isActive && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-2 bg-brand-yellow text-brand-dark text-[11px] font-normal px-2.5 py-1 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dark animate-pulse" />
                      Vises nå
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="text-base md:text-lg font-normal text-white mb-0.5">
                      {sp.name}
                    </h3>
                    <p className="text-sm font-light text-white/75">
                      {sp.subtitle || sp.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          9. MØRK SLUTT-CTA — "Usikker på hvor du skal begynne?"
      ============================================================ */}
      <section className="bg-brand-light text-brand-dark py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">
                Usikker på hvor du skal begynne?
              </h2>
              <p className="text-base md:text-lg font-light text-brand-dark/70 leading-relaxed max-w-lg">
                Ring oss, så hjelper vi deg å finne riktig første steg. Vi tar
                oss tid — og det koster ingenting.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Button asChild variant="cta" size="lg" className="px-8">
                <Link to={buildBookingUrl({ kategori: "fertilitet" })}>
                  Book konsultasjon
                </Link>
              </Button>
              <a
                href="tel:+4722000000"
                className="inline-flex items-center gap-2 text-sm font-light text-brand-dark/85 hover:text-brand-dark transition-colors px-2"
              >
                <Phone className="w-4 h-4" />
                Eller ring oss på 22 00 00 00
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. FORSIKRINGSAVTALER — egen mørkere stripe (matcher footer)
      ============================================================ */}
      <section className="bg-[#180404] text-white py-14 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-[0.18em] text-brand-yellow/90 mb-3">
                SAMARBEIDSPARTNERE
              </p>
              <h3 className="text-xl md:text-2xl font-light leading-snug text-white">
                Vi har avtale med de største forsikringsselskapene i Norge.
              </h3>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-white/10">
                {insurance.map((name) => (
                  <li
                    key={name}
                    className="border-b border-white/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-white/10 py-4 px-4 text-sm font-light text-white/85"
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

export default Fertility;
