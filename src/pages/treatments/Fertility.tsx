import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { RelatedServices, allServices } from "@/components/layout/RelatedServices";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";

import fertilityHero from "@/assets/hero/fertility-hero.jpg";
import fertilityVideo from "@/assets/hero/fertilitet-video.mp4";
import clinicMajorstuen from "@/assets/clinics/majorstuen.jpg";
import clinicBekkestua from "@/assets/clinics/bekkestua.jpg";
import familyHero from "@/assets/hero/cmedical-family.jpg";
import handsHero from "@/assets/hero/cmedical-hands.jpg";
import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import journeyLab from "@/assets/fertility/journey-02-lab.jpg";
import journeyResult from "@/assets/fertility/journey-03-result.jpg";
import madeleineEngen from "@/assets/specialists/madeleine-engen.jpg";

interface PageProps {
  isChatOpen: boolean;
}

type SegmentId = "single" | "samekjonn" | "tokjonn";

interface Segment {
  id: SegmentId;
  label: string;
  headline: string;
  intro: string;
  next: string; // first recommended next step
  recommended: string[]; // 3 quick bullets
  bookingService?: string; // service slug for prefill
}

const segments: Segment[] = [
  {
    id: "single",
    label: "Jeg er aleneforelder",
    headline: "Du har bestemt deg — vi gjør det trygt og verdig.",
    intro:
      "For deg som ønsker barn på egen hånd. Vi følger deg hele veien, fra første samtale til graviditetstest, med varme, åpenhet og medisinsk trygghet.",
    next: "Start med en gratis digital rådgiving",
    recommended: [
      "Inseminasjon (IUI) med donorsæd",
      "IVF med donorsæd",
      "Fertilitetsutredning og hormonprofil",
    ],
    bookingService: "digital-radgiving",
  },
  {
    id: "samekjonn",
    label: "Vi er et likekjønnet par",
    headline: "Familien deres begynner her.",
    intro:
      "Vi har lang erfaring med å hjelpe likekjønnede par på veien til foreldreskap — med tydelig veiledning rundt donorsæd, ringemulighet, juridiske spørsmål og praktisk gjennomføring.",
    next: "Book en samtale sammen",
    recommended: [
      "IUI eller IVF med donorsæd",
      "Delt morskap (ROPA)",
      "Hormonell synkronisering",
    ],
    bookingService: "digital-radgiving",
  },
  {
    id: "tokjonn",
    label: "Vi er et par",
    headline: "Når det tar lenger tid enn dere håpet.",
    intro:
      "Har dere prøvd i 6–12 måneder uten å lykkes? Da er det smart å starte med utredning. Vi finner årsaken og legger en plan dere begge kan stå i — med eller uten behandling.",
    next: "Bestill fertilitetsutredning",
    recommended: [
      "Komplett utredning av begge",
      "IVF / ICSI",
      "Time-lapse embryoovervåkning",
    ],
    bookingService: "fertilitetsutredning",
  },
];

const Fertility = ({ isChatOpen }: PageProps) => {
  const [active, setActive] = useState<SegmentId>("tokjonn");
  const segment = useMemo(
    () => segments.find((s) => s.id === active) ?? segments[0],
    [active]
  );

  const fertilitySpecialists = useMemo(
    () => specialists.filter((s) => s.category === "fertilitet").slice(0, 4),
    []
  );

  useEffect(() => {
    document.title =
      "Fertilitet | CMedical – fertilitetsbehandling for alle veier til foreldreskap";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* sr-only H1 (single H1 rule, real visual title is in hero) */}
      <h1 className="sr-only">
        Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning
      </h1>

      {/* ============================================================
          1. HERO — varm, emosjonell, video bak
      ============================================================ */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-brand-dark">
        <video
          src={fertilityVideo}
          poster={fertilityHero}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/20" />

        <div className="relative container mx-auto px-6 md:px-16 pb-16 md:pb-24 pt-32">
          <div className="max-w-3xl text-white">
            <p className="text-sm tracking-wide text-accent mb-4">
              Fertilitet hos CMedical
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-6">
              Veien til foreldreskap er
              <br />
              <span className="italic font-extralight">deres egen.</span>
            </h2>
            <p className="text-base md:text-lg font-light text-white/80 max-w-xl mb-8 leading-relaxed">
              Klinikk og laboratorium under samme tak. Erfarne spesialister.
              Tett oppfølging og åpen dør for spørsmålene som ingen andre tør å
              svare på.
            </p>

            {/* Segment chooser */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 inline-flex flex-wrap gap-1 border border-white/15">
              {segments.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`px-4 md:px-5 py-2.5 rounded-xl text-sm font-light transition-all ${
                    active === s.id
                      ? "bg-accent text-accent-foreground"
                      : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. SEGMENTERT INNHOLD — endrer seg med valget
      ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                For deg
              </p>
              <h2
                key={segment.id}
                className="text-3xl md:text-5xl font-light leading-tight mb-6 text-foreground animate-fade-in"
              >
                {segment.headline}
              </h2>
              <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed mb-10 max-w-xl">
                {segment.intro}
              </p>

              <ul className="space-y-3 mb-10">
                {segment.recommended.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-7 font-light"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "fertilitet",
                      tjeneste: segment.bookingService,
                    }))
                  }
                >
                  {segment.next}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-light text-foreground hover:text-accent transition-colors"
                >
                  Snakk med en sykepleier først →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={familyHero}
                  alt="Foreldre og barn — varm hverdagsscene"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. DATASTRIMMEL — store tall, prominent
      ============================================================ */}
      <section className="py-16 md:py-20 bg-brand-dark text-white border-y border-white/10">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {[
              { value: "42%", label: "Suksessrate IVF, kvinner < 35 år" },
              { value: "1500+", label: "Vellykkede behandlinger" },
              { value: "20+", label: "År med samlet IVF-erfaring" },
              { value: "95%", label: "Pasienter anbefaler oss videre" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl md:text-6xl font-extralight text-accent mb-3 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-sm font-light text-white/65 leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. STEG FOR STEG — pasientreisen med ekte bilder
      ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Steg for steg
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-5">
                Fra første samtale til to streker.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed">
                Det meste av frykten ligger i det ukjente. Her ser du hvordan
                et typisk forløp ser ut hos oss — fra dere går inn døra første
                gang, til dagen dere får svar.
              </p>
            </div>

            <div className="space-y-20 md:space-y-28">
              {[
                {
                  n: "01",
                  kicker: "Første møte",
                  title: "En samtale uten forpliktelser.",
                  desc:
                    "Dere møter en spesialist som tar seg tid. Vi går gjennom historikken deres, hva dere har prøvd, hva dere lurer på — og legger en plan sammen. Ingen henvisning, ingen ventetid.",
                  img: journeyConsultation,
                  alt: "Par i samtale med spesialist hos CMedical",
                  reverse: false,
                },
                {
                  n: "02",
                  kicker: "Utredning og lab",
                  title: "Klinikk og laboratorium under samme tak.",
                  desc:
                    "Hormonprofil, ultralyd, sædanalyse — alt hos oss. Embryologene jobber i samme bygg som spesialistene, så svar og beslutninger går raskere. Eggene dine forlater aldri huset.",
                  img: journeyLab,
                  alt: "Embryolog i CMedicals fertilitetslaboratorium",
                  reverse: true,
                },
                {
                  n: "03",
                  kicker: "Behandling og svar",
                  title: "Tett oppfølging — også etter testen.",
                  desc:
                    "Vi følger dere hele veien — fra stimulering og embryooverføring, gjennom ventetiden, til svaret kommer. Og vi er der etter også, uansett utfall.",
                  img: journeyResult,
                  alt: "To hender holder positiv graviditetstest og ultralydbilde",
                  reverse: false,
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                    step.reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="lg:col-span-7">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                      <img
                        src={step.img}
                        alt={step.alt}
                        loading="lazy"
                        width={1280}
                        height={960}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="text-xs tracking-wide text-foreground/60 mb-3">
                      Steg {step.n} · {step.kicker}
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-tight mb-5">
                      {step.title}
                    </h3>
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-light"
                onClick={() =>
                  (window.location.href = buildBookingUrl({
                    kategori: "fertilitet",
                  }))
                }
              >
                Bestill første samtale
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4b. BLI KJENT MED MADELEINE — trygghet og person
      ============================================================ */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
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
              <p className="text-base md:text-lg font-light text-foreground/85 leading-relaxed mb-6 italic">
                Madeleine Engen er gynekolog, kirurg og fagansvarlig for
                kvinnehelse hos CMedical. Hun jobber tett med
                fertilitetsteamet og er en tydelig stemme for kvinnehelse —
                både i klinikken, i media og på internasjonale fagarenaer.
              </p>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-8">
                Med spesialkompetanse innen urogynekologi, hormoner og
                overgangsalder møter Madeleine pasientene sine med både
                medisinsk presisjon og en sjelden varme. Mange av våre
                fertilitetspasienter starter med en samtale hos henne — for
                å få oversikt før den større reisen begynner.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-7 font-light"
                >
                  <Link to="/spesialister/madeleine-engen">
                    Les mer om Madeleine
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7 font-light"
                >
                  <Link
                    to={buildBookingUrl({
                      kategori: "fertilitet",
                      spesialist: "madeleine-engen",
                    })}
                  >
                    Bestill time hos Madeleine
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. HVORFOR CMEDICAL — USP-strimmel
      ============================================================ */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs tracking-wide text-foreground/60 mb-4">
                  Hvorfor velge oss
                </p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
                  Det som skiller oss fra andre fertilitetsklinikker.
                </h2>
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  Hos CMedical sitter alt — fra første konsultasjon til
                  embryolaboratoriet — under samme tak. Det betyr færre
                  ledd, raskere svar og en behandling som faktisk er
                  personlig.
                </p>
              </div>

              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
                {[
                  {
                    title: "Klinikk og lab under samme tak",
                    desc: "Eggene dine forlater aldri bygget — kortere transport, høyere overlevelse.",
                  },
                  {
                    title: "Time-lapse embryoovervåkning",
                    desc: "Embryoene observeres kontinuerlig — vi velger det beste på et tryggere grunnlag.",
                  },
                  {
                    title: "Erfarne spesialister",
                    desc: "Teamet har samlet over 20 års IVF-erfaring fra Rikshospitalet, Livio og internasjonalt.",
                  },
                  {
                    title: "Egguttak i narkose",
                    desc: "Ønsker du å sove gjennom egguttaket? Det får du — på samme dag, samme sted.",
                  },
                ].map((u) => (
                  <div key={u.title} className="bg-background p-7">
                    <h3 className="text-lg font-light mb-2 text-foreground">
                      {u.title}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      {u.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. SPESIALIST-PROFILER — personlige, ikke grid-celler
      ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
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
                className="text-sm font-light text-foreground hover:text-accent transition-colors"
              >
                Se alle fertilitetsspesialister →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-16">
              {fertilitySpecialists.map((sp) => (
                <Link
                  key={sp.slug}
                  to={`/spesialister/${sp.slug}`}
                  className="group block"
                >
                  <div className="aspect-[5/6] overflow-hidden rounded-xl mb-5 bg-secondary">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-2xl font-light text-foreground mb-1 group-hover:text-accent transition-colors">
                    {sp.name}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground mb-3">
                    {sp.title}
                    {sp.subtitle ? ` · ${sp.subtitle}` : ""}
                  </p>
                  {sp.bio && (
                    <p className="text-sm font-light text-foreground/80 leading-relaxed line-clamp-3">
                      {sp.bio.split("\n")[0]}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. TV2-SERIEN — placeholder for redaksjonell prioritet
      ============================================================ */}
      <section className="py-20 md:py-28 bg-brand-dark text-white">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Som sett på TV2
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6">
                Ekte historier. Ekte mennesker.
              </h2>
              <p className="text-base font-light text-white/70 leading-relaxed mb-8">
                Vi åpnet dørene for TV2 og lot kameraene følge pasienter,
                spesialister og embryologer gjennom et helt behandlingsløp.
                Resultatet er en serie som viser det vi ser hver dag — at
                veien til foreldreskap kan være kronglete, men at den ikke
                trenger å være ensom.
              </p>
              <Link
                to="/aktuelt"
                className="inline-flex items-center text-sm font-light text-accent hover:gap-3 gap-2 transition-all"
              >
                Les mer om serien
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={handsHero}
                  alt="Behind the scenes — fra TV2-opptak hos CMedical"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. VÅRT FERTILITETS-TILBUD — tjenestelisten kommer NED hit
      ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Vårt tilbud
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-4">
                Hele veien — fra første spørsmål til hjem med barn.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {[
                "Komplett fertilitetsutredning for par og single",
                "IVF (in vitro fertilisering) og ICSI",
                "Inseminasjon (IUI)",
                "Eggdonasjon og sæddonasjon",
                "Nedfrysing av egg, sæd og embryo",
                "Genetisk testing (PGT)",
                "Mikro-TESE og mannlig infertilitet",
                "Psykologisk støtte gjennom hele forløpet",
              ].map((service) => (
                <div
                  key={service}
                  className="flex items-start gap-3 py-4 border-b border-border"
                >
                  <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="font-light text-foreground">{service}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-light"
                onClick={() =>
                  (window.location.href = buildBookingUrl({
                    kategori: "fertilitet",
                  }))
                }
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-light text-foreground border border-border hover:bg-secondary transition-colors"
              >
                Se prisliste
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. KLINIKKBILDER — varme, mer plass enn før
      ============================================================ */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Klinikkene våre
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Et sted å puste mellom prøvene.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  src: clinicMajorstuen,
                  city: "Majorstuen",
                  desc: "Vårt fertilitetssenter — klinikk og IVF-lab i samme bygg.",
                },
                {
                  src: clinicBekkestua,
                  city: "Bekkestua",
                  desc: "Konsultasjoner, oppfølging og utredning i rolige omgivelser.",
                },
              ].map((c) => (
                <Link
                  key={c.city}
                  to={`/klinikker/${c.city.toLowerCase()}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                    <img
                      src={c.src}
                      alt={`CMedical ${c.city}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-xl font-light text-foreground mb-1 group-hover:text-accent transition-colors">
                    {c.city}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground">
                    {c.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. FAQ
      ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <p className="text-xs tracking-wide text-foreground/60 mb-4">
                Vanlige spørsmål
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Det vi får mest spørsmål om.
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-light">
                  Hva er sannsynligheten for å lykkes med IVF?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light">
                  For kvinner under 35 år ligger sannsynligheten på rundt
                  40–45 % per syklus. Vi gir deg en individuell vurdering
                  basert på historikk, hormonprofil og utredning.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-light">
                  Hvor lang tid tar et IVF-forløp?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light">
                  En komplett IVF-syklus tar vanligvis 4–6 uker fra oppstart
                  til graviditetstest.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-light">
                  Tilbyr dere behandling til single og likekjønnede par?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light">
                  Ja. Vi tilbyr inseminasjon og IVF med donorsæd til single
                  kvinner og likekjønnede par, og veileder også gjennom det
                  juridiske rundt foreldreskap.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-light">
                  Kan jeg sove gjennom egguttaket?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light">
                  Ja — vi tilbyr egguttak i narkose ved Majorstuen for de
                  som ønsker det.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-light">
                  Får vi psykologisk støtte underveis?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light">
                  Ja. Vi har egne fertilitetsrådgivere og psykologer som
                  følger dere gjennom hele forløpet — også ved tap.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <RelatedServices services={allServices} currentPath="/fertility" />

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
