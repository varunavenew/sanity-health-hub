import { AssetImg } from "@/components/AssetImg";
import { useEffect, useRef } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, Star, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { AnimatedStat } from "@/components/AnimatedStat";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { LeadPopup } from "@/components/LeadPopup";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

import ortopediHero from "@/assets/categories/ortopedi-real.jpg";

interface PageProps { isChatOpen: boolean }

/* ── DATA ───────────────────────────────────────────────── */

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
  {
    title: "Jeg har en idrettsskade",
    desc:
      "Enten du er topputøver eller hobbyspiller — vi har ortopeder med bred erfaring innen idrettsmedisin og rask rehabilitering etter skader.",
    cta: "Bestill time",
    href: "/booking?kategori=ortopedi",
  },
  {
    title: "Jeg sliter med langvarige leddsmerter",
    desc:
      "Slitasjegikt, revmatisme og kroniske leddsmerter krever spesialisert oppfølging. Vi vurderer alle behandlingsalternativer — fra injeksjoner til kirurgi.",
    cta: "Les mer",
    href: "/booking?kategori=ortopedi",
  },
];

const expertAreas = [
  {
    title: "Skulder",
    desc: "Inneklemming, kalkavleiringer, rotatormansjettskader og ustabil skulder. Vi behandler alt fra akutte skader til kroniske tilstander.",
    href: "/behandlinger/ortopedi/skulder",
    image: ortopediHero,
  },
  {
    title: "Kne",
    desc: "Korsbånd, menisk, bruskskader og slitasjegikt. Noen av landets fremste knekirurger jobber hos oss.",
    href: "/behandlinger/ortopedi/kne",
    image: ortopediHero,
  },
  {
    title: "Hofte",
    desc: "Hofteslitasje, labrumskader og fotballbrokk. Presis diagnostikk og moderne behandlingsmetoder.",
    href: "/behandlinger/ortopedi/hofte",
    image: ortopediHero,
  },
  {
    title: "Hånd og albue",
    desc: "Karpaltunnel, tennisalbue, Dupuytrens kontraktur og springfinger. Rask diagnose og effektiv behandling.",
    href: "/behandlinger/ortopedi/hand-albue",
    image: ortopediHero,
  },
];

const serviceGroups = [
  {
    label: "Skulder",
    items: [
      { title: "Inneklemming (impingement)", desc: "Diagnose og behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Kalkavleiringer", desc: "Ultralydveiledet behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Rotatormansjettskader", desc: "Konservativt og kirurgisk", href: "/behandlinger/ortopedi/skulder" },
      { title: "Ustabil skulder", desc: "Stabiliserende kirurgi", href: "/behandlinger/ortopedi/skulder" },
      { title: "Frossen skulder", desc: "Utredning og behandling", href: "/behandlinger/ortopedi/skulder" },
    ],
  },
  {
    label: "Kne og hofte",
    items: [
      { title: "Korsbåndruptur", desc: "Rekonstruksjon og rehabilitering", href: "/behandlinger/ortopedi/kne" },
      { title: "Meniskskader", desc: "Artroskopi og sutur", href: "/behandlinger/ortopedi/kne" },
      { title: "Kneslitasje", desc: "Injeksjoner og kirurgi", href: "/behandlinger/ortopedi/kne" },
      { title: "Hofteslitasje", desc: "Konservativt og protese", href: "/behandlinger/ortopedi/hofte" },
      { title: "Labrumskade", desc: "Artroskopisk behandling", href: "/behandlinger/ortopedi/hofte" },
    ],
  },
  {
    label: "Hånd, albue og fot",
    items: [
      { title: "Karpaltunnelsyndrom", desc: "Utredning og operasjon", href: "/behandlinger/ortopedi/hand-albue" },
      { title: "Tennisalbue og golfalbue", desc: "Injeksjoner og PRP", href: "/behandlinger/ortopedi/hand-albue" },
      { title: "Dupuytrens kontraktur", desc: "Kirurgisk behandling", href: "/behandlinger/ortopedi/hand-albue" },
      { title: "Hælspore og hælsmerter", desc: "Diagnose og behandling", href: "/behandlinger/ortopedi/fot-ankel" },
      { title: "Ankelbåndskader", desc: "Akutt og kronisk behandling", href: "/behandlinger/ortopedi/fot-ankel" },
    ],
  },
  {
    label: "Behandlingsformer",
    items: [
      { title: "Ortopedisk kirurgi", desc: "Åpen og artroskopisk", href: "/behandlinger/ortopedi/skulder" },
      { title: "Kortisoninjeksjoner", desc: "Rask smertelindring", href: "/behandlinger/ortopedi/skulder" },
      { title: "Blodspinningsteknikk (PRP)", desc: "Biologisk behandling", href: "/behandlinger/ortopedi/skulder" },
      { title: "Second opinion", desc: "Ny vurdering fra ekspert", href: "/booking?kategori=ortopedi&tjeneste=second-opinion" },
    ],
  },
];

const journey = [
  {
    n: "01",
    title: "Bestill når det passer deg",
    desc: "Online booking døgnet rundt. Velg kroppsdel og klinikk — vi matcher deg med riktig spesialist.",
  },
  {
    n: "02",
    title: "Samtalen som rekker",
    desc: "Du møter en ortoped som jobber med nettopp ditt område. Vi tar historikk, ser på bilder og gjør en grundig undersøkelse.",
  },
  {
    n: "03",
    title: "Diagnose og plan",
    desc: "Du forlater konsultasjonen med en klar diagnose og en konkret plan — hva som er galt, hva vi anbefaler, og hva som skjer videre.",
  },
  {
    n: "04",
    title: "Tverrfaglig oppfølging",
    desc: "Ved behov samarbeider ortopeden med fysioterapeut, manuellterapeut, osteopat og ernæringsfysiolog — alt under samme tak.",
  },
];

const reviews = [
  { text: "Hadde slitt med skulderen i to år. Kom til CMedical, fikk diagnose første dag og en plan som faktisk fungerte. Skulle gjort det mye tidligere.", author: "Martin", date: "Google · 2 måneder siden" },
  { text: "Etter kneskaden visste jeg ikke hva jeg skulle gjøre. Ortopeden her forklarte alt tydelig og la opp et løp jeg hadde tro på fra første stund.", author: "Silje", date: "Legelisten · 4 måneder siden" },
  { text: "Kom for second opinion etter å ha vært på sykehus uten å bli bra. Her fant de problemet med en gang og opererte meg uken etter.", author: "Jan Erik", date: "Google · 6 måneder siden" },
];

const insurance = ["Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika"];

/* ── PAGE ───────────────────────────────────────────────── */

const Ortopedi = ({ isChatOpen }: PageProps) => {
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Ortopedi | CMedical — Når det gjør vondt";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">Ortopedi hos CMedical — når det gjør vondt</h1>

      {/* ============================================================
          1. HERO — split screen 50/50
      ============================================================ */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="lg:hidden px-6 md:px-16 pb-4">
          <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
            <Link to="/" className="hover:text-foreground">Hjem</Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground/80">Ortopedi</span>
          </nav>
          <h2 className="text-4xl font-light text-foreground leading-[1.05]">
            Det gjør vondt. <span className="block italic">La oss finne ut hvorfor.</span>
          </h2>
        </div>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
                <Link to="/" className="hover:text-foreground">Hjem</Link>
                <span aria-hidden="true">›</span>
                <span className="text-foreground/80">Ortopedi</span>
              </nav>
              <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Det gjør vondt. <span className="block italic">La oss finne ut hvorfor.</span>
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground block">
                {`Våre ortopeder er eksperter på skader og sykdommer i muskler, bein, ledd og sener. Noen av landets fremste kirurger jobber hos oss — også med second opinion.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "ortopedi",
                    }))
                  }
                >
                  Bestill ortopedtime
                </Button>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
                {["Ingen henvisning", "Korte ventetider"].map((u) => (
                  <li key={u} className="flex items-center gap-2">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <AssetImg
              src={ortopediHero}
              alt="Ortopedi hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* ============================================================
          2. SEGMENT-SEKSJON — Inngangsporter
      ============================================================ */}
      <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Vi møter deg uansett hvorfor du tar kontakt.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
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

      {/* ============================================================
          3. EKSPERTER — Fagområder med scrollbare kort
      ============================================================ */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  Eksperter som jobber med det de kan aller best.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Hos oss møter du ortopeder som har spesialisert seg dypt
                  innenfor sitt fagfelt — fra skulder og kne til hånd og fot.
                </p>
              </div>
            </div>

            <div
              ref={expertAreasRef}
              className="flex md:grid md:grid-cols-2 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {expertAreas.map((a) => (
                <Link
                  key={a.title}
                  to={a.href}
                  className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[92%] md:w-auto snap-start"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                    <AssetImg
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-light text-foreground mb-3">
                      {a.title}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                      {a.desc}
                    </p>
                    <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                      Les mer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollArrows scrollRef={expertAreasRef} />
          </div>
        </div>
      </section>

      {/* ============================================================
          4. SYMPTOMSJEKK — fra symptom til tjeneste
      ============================================================ */}
      <SymptomServiceSection
        background="background"
        eyebrow="Finn din inngang"
        title="Hva kjenner du på?"
        description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
        items={[
          { symptom: "Smerter i skulderen ved løft", service: "Skulderutredning", href: "/behandlinger/ortopedi/skulder", imageAlt: "Skulderutredning" },
          { symptom: "Vondt eller ustabilt kne", service: "Kneutredning", href: "/behandlinger/ortopedi/kne", imageAlt: "Kneutredning" },
          { symptom: "Hofteslitasje eller liesmerter", service: "Hofteutredning", href: "/behandlinger/ortopedi/hofte", imageAlt: "Hofteutredning" },
          { symptom: "Nummenhet eller stikninger i hånden", service: "Karpaltunnel-utredning", href: "/behandlinger/ortopedi/hand-albue", imageAlt: "Karpaltunnel" },
          { symptom: "Vondt i albuen ved gripe-bevegelser", service: "Tennisalbue-utredning", href: "/behandlinger/ortopedi/hand-albue", imageAlt: "Tennisalbue" },
          { symptom: "Smerter eller skader i fot og ankel", service: "Fot- og ankelutredning", href: "/behandlinger/ortopedi/fot-ankel", imageAlt: "Fot og ankel" },
        ]}
      />

      {/* ============================================================
          5. RESULTATER — tall som forteller en historie
      ============================================================ */}
      <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-12 md:pb-16 border-t border-brand-dark/5">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-5">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Tall som forteller en historie.
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  Vi måler det vi gjør — fordi du fortjener åpenhet. Her er
                  resultatene våre innen ortopedi de siste årene.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-dark/5 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
                {[
                  { v: "6 800+", k: "Konsultasjoner", sub: "Per år" },
                  { v: "2 400", k: "Operasjoner", sub: "I 2024" },
                  { v: "96 %", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
                  { v: "< 7 dager", k: "Ventetid", sub: "Snitt til første time" },
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
                    <p className="text-xs font-light text-muted-foreground">
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
          6. HVA VI TILBYR — gruppert oversikt
      ============================================================ */}
      <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Hva vi tilbyr
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Dette er utredningene, behandlingene og inngrepene vi utfører.
                  Vet du allerede hva du trenger? Velg fra listen — eller les mer
                  om den enkelte tjenesten.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {serviceGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-light text-foreground/60 mb-4">
                    {group.label}
                  </p>
                  <ul className="border-t border-brand-dark/10">
                    {group.items.map((s) => (
                      <li key={s.title} className="border-b border-brand-dark/10">
                        <Link
                          to={s.href}
                          className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_auto] items-baseline gap-4 sm:gap-8 py-5 group"
                        >
                          <h3 className="text-base font-normal text-foreground group-hover:text-foreground/70 transition-colors">
                            {s.title}
                          </h3>
                          <p className="hidden sm:block text-sm font-light text-muted-foreground leading-snug">
                            {s.desc}
                          </p>
                          <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. PASIENTSITATER — sosial bevis
      ============================================================ */}
      <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                Tilbakemeldinger fra ekte pasienter
              </h2>
            </div>
            <div
              ref={reviewsRef}
              className="flex md:grid md:grid-cols-3 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300 shrink-0 w-[78vw] md:w-auto snap-center"
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
                        <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                        <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                        <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                        <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
                      </svg>
                      <span>Google</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollArrows scrollRef={reviewsRef} />
          </div>
        </div>
      </section>

      {/* ============================================================
          8. SPESIALISTER — menneskene bak
      ============================================================ */}
      <SpecialistsScroller
        category="ortopedi"
        title="Ortopedene som følger deg."
        seeAllHref="/spesialister?kategori=ortopedi"
        seeAllLabel="Se alle ortopeder"
      />

      {/* ============================================================
          9. PASIENTREISEN — Fra første kontakt til riktig behandling
      ============================================================ */}
      <section className="bg-background">
        <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
                Fra første kontakt til riktig behandling.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos
                oss, fra du booker time til du er ferdig behandlet.
              </p>
              <Button
                variant="cta"
                size="lg"
                className="px-8"
                onClick={() => (window.location.href = buildBookingUrl({ kategori: "ortopedi" }))}
              >
                Bestill time
              </Button>
            </div>

            <div className="lg:col-span-7">
              <div className="divide-y divide-border/60 border-t border-border/60">
                {journey.map((step) => (
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
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. FORSIKRINGSPARTNERE
      ============================================================ */}
      <section className="bg-brand-light text-foreground py-14 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-3">SAMARBEIDSPARTNERE</p>
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

      {/* UNIFIED PRE-FOOTER CTA */}
      <BookingCTA bookingCategoryId="ortopedi" />

      <LeadPopup />
    </PageLayout>
  );
};

export default Ortopedi;
