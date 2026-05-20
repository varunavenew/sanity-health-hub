import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Quote, Share2, ChevronRight,
  ChevronDown, CheckCircle2, Mail, Tag, Play, Stethoscope, HeartPulse, Sparkles, History,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import heroClinic from "@/assets/hero/hero-clinic-lounge.jpg";

/**
 * ArticleMaster — mastermal for FAGARTIKLER.
 *
 * Layouten her er redaksjonell og «long-form»: sentrert hero, fagforfatter
 * med faglig validering, innholdsfortegnelse, lengre brødtekst med
 * pull-quotes, sitater, kommentar fra spesialist, faktaboks og kildeliste.
 * Tenkes brukt til redaksjonelle stykker hvor faglig dybde og referanser er
 * viktig.
 */

const sections = [
  { id: "innledning", label: "Innledning" },
  { id: "hva-er-overgangsalder", label: "Hva er overgangsalder?" },
  { id: "symptomer", label: "Symptomene som overrasker" },
  { id: "behandling", label: "Trygg, oppdatert behandling" },
  { id: "konklusjon", label: "Konklusjon" },
];

const ArticleMaster = ({ isChatOpen }: { isChatOpen: boolean }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Mastermal: Fagartikkel | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">Mastermal for fagartikkel</h1>

      {/* ───────────── HERO – sentrert, redaksjonelt ───────────── */}
      <header className="bg-brand-light pt-28 md:pt-32 pb-14 md:pb-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <Link
              to="/aktuelt"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-light transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til Aktuelt
            </Link>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-foreground/60 mb-6">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Fagartikkel
              </span>
              <span>·</span>
              <span>Kvinnehelse</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                9 min lesetid
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Sist oppdatert 19. mai 2026
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.05] text-foreground mb-8">
              Overgangsalderen er en ny fase — ikke slutten på noe
            </h2>

            <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-10">
              Hetetokter, søvnproblemer og hjernetåke kan oppleves som tap av kontroll. Men
              dagens kunnskap om hormoner og kvinnehelse gjør at få trenger å «tåle seg
              gjennom» perioden lenger.
            </p>

            {/* Forfatter + faglig validering */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-sm font-light text-foreground/70">
                  IB
                </div>
                <div>
                  <p className="text-sm font-normal text-foreground">Ida Bjørntvedt</p>
                  <p className="text-xs font-light text-foreground/60">
                    Spesialist i gynekologi
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="text-xs font-light text-foreground/60 leading-relaxed">
                Faglig kvalitetssikret av
                <br />
                <span className="text-foreground/80">
                  Dr. Hannah Russell, fertilitetslege
                </span>
              </div>
              <button className="sm:ml-auto inline-flex items-center gap-1.5 text-xs font-light text-foreground/60 hover:text-foreground transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Del artikkelen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ───────────── BRØDTEKST + SIDEBAR (innholdsfortegnelse) ───────────── */}
      <article className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Sidebar — innholdsfortegnelse (sticky) */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-4">
                  I denne artikkelen
                </p>
                <nav>
                  <ul className="space-y-2.5 border-l border-border">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="block pl-4 text-sm font-light text-foreground/70 hover:text-foreground hover:border-brand-dark border-l-2 border-transparent -ml-px transition-colors"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Brødtekst */}
            <div className="lg:col-span-9 order-1 lg:order-2 max-w-2xl">
              {/* Ingress / lead */}
              <p
                id="innledning"
                className="text-lg font-light leading-relaxed text-foreground mb-8 scroll-mt-28"
              >
                I generasjoner har overgangsalderen vært et tema kvinner har båret i
                stillhet. Det trenger den ikke være lenger. Med moderne hormonbehandling og
                en helhetlig tilnærming kan plagene reduseres betydelig — for de fleste.
              </p>

              {/* TL;DR – hovedpunkter (valgfri) */}
              <aside className="bg-brand-light rounded-sm p-6 md:p-7 my-8 border border-border/60">
                <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-4">
                  Kort oppsummert
                </p>
                <ul className="space-y-2.5 text-sm font-light text-foreground/85">
                  {[
                    "Overgangsalderen er en flerårig prosess i tre faser — ikke én hendelse.",
                    "Symptomene er mer enn hetetokter: hjernetåke, leddsmerter og søvnvansker er vanlige.",
                    "Moderne hormonbehandling (MHT) er trygg for de fleste og gir betydelig lindring.",
                    "Du trenger ikke tåle deg gjennom det — behandling kan tilpasses individuelt.",
                  ].map((p) => (
                    <li key={p} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Denne artikkelen går gjennom hva som faktisk skjer i kroppen, hvilke
                symptomer som er vanlige, og hvilke behandlingsalternativer som finnes i
                dag. Den er skrevet for deg som vil forstå mer — og for deg som vurderer å
                ta kontakt med en spesialist.
              </p>

              {/* Featured bilde i brødtekst */}
              <figure className="my-10 -mx-6 md:mx-0">
                <img
                  src={heroClinic}
                  alt=""
                  loading="lazy"
                  className="w-full rounded-sm"
                />
                <figcaption className="text-xs font-light text-muted-foreground mt-3 px-6 md:px-0">
                  Foto: CMedical Sandvika
                </figcaption>
              </figure>

              <h2
                id="hva-er-overgangsalder"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Hva er overgangsalder?
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Overgangsalderen er ikke én hendelse, men en periode som typisk strekker
                seg over flere år. Den deles vanligvis inn i tre faser: perimenopause,
                menopause og postmenopause<sup className="text-brand-dark">1</sup>.
              </p>

              {/* Pull quote */}
              <blockquote className="my-10 border-l-2 border-brand-dark pl-6 md:pl-8">
                <Quote className="w-6 h-6 text-brand-dark/40 mb-3" />
                <p className="text-xl md:text-2xl font-light leading-snug text-foreground italic">
                  «De fleste vet at hetetokter er et symptom. Færre vet at hjernetåke,
                  leddsmerter og angst også kan høre med.»
                </p>
                <footer className="mt-4 text-sm font-light text-foreground/60">
                  — Ida Bjørntvedt, spesialist i gynekologi
                </footer>
              </blockquote>

              <h2
                id="symptomer"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Symptomene som overrasker
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-4">
                Mens hetetokter og uregelmessig menstruasjon er kjente symptomer, er det
                mange andre plager som ofte ikke blir koblet til hormonelle endringer:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-foreground/80 font-light leading-relaxed">
                <li>Hjernetåke og redusert konsentrasjon</li>
                <li>Leddsmerter og stivhet</li>
                <li>Endret søvnmønster, særlig nattevåkning kl. 03–04</li>
                <li>Økt angst, irritabilitet eller nedstemthet</li>
                <li>Endret hudtekstur og hårtap</li>
              </ul>

              {/* Spesialist-kommentar (kommentarstil) */}
              <aside className="bg-secondary/40 rounded-sm p-6 md:p-8 my-10 border-l-2 border-brand-dark">
                <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-4">
                  Kommentar fra spesialisten
                </p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-background flex-shrink-0 flex items-center justify-center text-sm font-light text-foreground/70">
                    HR
                  </div>
                  <div>
                    <p className="text-base font-light leading-relaxed text-foreground/90 mb-3 italic">
                      «I praksis ser vi at mange kvinner kommer til oss etter at de har
                      blitt avfeid flere ganger. Det første vi gjør er å lytte — og deretter
                      kartlegge hele bildet, ikke bare ett symptom.»
                    </p>
                    <p className="text-xs font-normal text-foreground">Dr. Hannah Russell</p>
                    <p className="text-xs font-light text-foreground/60">
                      Fertilitetslege og gynekolog, CMedical
                    </p>
                  </div>
                </div>
              </aside>

              <h2
                id="behandling"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Trygg, oppdatert behandling
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Moderne hormonbehandling (MHT) er trygg for de fleste, og kan gi betydelig
                lindring av plagene<sup className="text-brand-dark">2</sup>. Behandlingen
                tilpasses individuelt — det finnes ikke én løsning som passer alle.
              </p>

              {/* Faktaboks */}
              <aside className="bg-brand-light rounded-sm p-6 md:p-8 my-10">
                <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-3">
                  Fakta
                </p>
                <h3 className="text-base font-normal text-foreground mb-3">
                  Tre typer behandling
                </h3>
                <dl className="space-y-3 text-sm font-light text-foreground/80">
                  <div>
                    <dt className="font-normal text-foreground">Systemisk hormonbehandling</dt>
                    <dd>Tabletter, plaster eller gel som påvirker hele kroppen.</dd>
                  </div>
                  <div>
                    <dt className="font-normal text-foreground">Lokal østrogenbehandling</dt>
                    <dd>Krem eller stikkpiller for vaginal tørrhet og urinplager.</dd>
                  </div>
                  <div>
                    <dt className="font-normal text-foreground">Ikke-hormonelle alternativer</dt>
                    <dd>Livsstil, CBT og enkelte medisiner — for de som ikke kan bruke MHT.</dd>
                  </div>
                </dl>
              </aside>

              <h2
                id="konklusjon"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Konklusjon
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Overgangsalderen er en biologisk overgang, ikke en sykdom — men plagene er
                reelle og kan behandles. Den viktigste meldingen er enkel: du trenger ikke
                tåle deg gjennom det.
              </p>

              {/* CTA-boks i artikkelen */}
              <div className="my-12 rounded-sm border border-border bg-brand-light p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex-1">
                  <p className="text-sm font-normal text-foreground mb-1">
                    Vil du snakke med en spesialist?
                  </p>
                  <p className="text-sm font-light text-foreground/70">
                    Bestill en time hos en av våre gynekologer — ingen henvisning nødvendig.
                  </p>
                </div>
                <Link
                  to="/booking?kategori=gynekologi&tjeneste=overgangsalder"
                  className="inline-flex items-center gap-2 text-sm font-light text-foreground border-b border-foreground pb-0.5 hover:gap-2.5 transition-all w-fit"
                >
                  Bestill konsultasjon
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Kildeliste */}
              <section className="mt-14 pt-8 border-t border-border/60">
                <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-4">
                  Kilder og referanser
                </p>
                <ol className="space-y-3 text-xs font-light text-foreground/70 leading-relaxed list-decimal pl-5">
                  <li>
                    NICE Guidelines (2024). <em>Menopause: diagnosis and management</em>.
                    NG23. National Institute for Health and Care Excellence.
                  </li>
                  <li>
                    Helsedirektoratet (2023). <em>Nasjonal faglig retningslinje for
                    behandling av plager i overgangsalderen</em>.
                  </li>
                  <li>
                    The Lancet (2024). <em>Menopause Series</em>. Vol. 403.
                  </li>
                </ol>
              </section>

              {/* Ansvarsfraskrivelse */}
              <p className="mt-8 text-xs font-light text-foreground/50 leading-relaxed">
                Denne artikkelen erstatter ikke individuell medisinsk rådgivning. Snakk med
                en spesialist før du gjør endringer i behandling.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* ───────────── RELATERTE FAGARTIKLER ───────────── */}
      <section className="bg-secondary/30 border-t border-border py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-8">Flere fagartikler</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { t: "Endometriose: hva forskningen sier i 2026", c: "Kvinnehelse" },
                { t: "Når bør du sjekke fruktbarheten?", c: "Fertilitet" },
                { t: "Hormonbehandling — hva er trygt?", c: "Kvinnehelse" },
              ].map((a) => (
                <Link key={a.t} to="#" className="group block">
                  <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
                    <img
                      src={heroClinic}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" />
                        {a.c}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <Clock className="w-3 h-3" />
                    7 min lesetid
                  </div>
                  <h3 className="text-sm font-normal text-foreground group-hover:text-foreground/70 transition-colors leading-snug">
                    {a.t}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BookingCTA />
    </PageLayout>
  );
};

export default ArticleMaster;
