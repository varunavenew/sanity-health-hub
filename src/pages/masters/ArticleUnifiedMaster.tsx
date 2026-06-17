import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Calendar, Clock, Quote, Share2, ChevronRight,
  Tag, Play, Stethoscope, HeartPulse, Sparkles, CheckCircle2,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FaqSection } from "@/components/layout/FaqSection";
import { SpecialistComment } from "@/components/article/SpecialistComment";

import heroKvinnehelse from "@/assets/hero/kvinnehelse-hero.jpg";
import heroClinic from "@/assets/hero/hero-clinic-lounge.jpg";
import heroGyn from "@/assets/hero/gynecology-hero.jpg";
import heroFertility from "@/assets/hero/fertility-hero.jpg";
import categoryGyn from "@/assets/categories/gynekologi-real.jpg";
import idaProfile from "@/assets/ida-profile.jpg";
import articleGyn from "@/assets/articles/gynekologi.jpg";

/**
 * ArticleUnifiedMaster — felles mastermal for Aktuelt-innhold.
 *
 * Erstatter de to tidligere malene (NewsItem + Fagartikkel) med én felles
 * mal. Forskjellen mellom kategori-typene (pasienthistorie / fagartikkel /
 * nyhet / klinikknytt) skjer kun via badge basert på filteret i "Aktuelt".
 *
 * Designvalg basert på kundefeedback 3. juni:
 *  • Topp-meta: dato + område (variant fra Nyhet).
 *  • Forfatter + del: variant fra Fagartikkel, plassert i header.
 *  • Faktaruta: variant med strek til venstre.
 *  • Sitat: venstrestilt blockquote (ikke sentrert).
 *  • Bilder: rake hjørner overalt (rounded-none).
 *  • CTA-boks: mørkebrun bakgrunn med hvit knapp, plassert nederst.
 *  • Én sammenslått "fagforfatter / fremhevet tjeneste"-seksjon.
 *  • Kun én "Andre tjenester"-seksjon (duplikat fjernet).
 */

const KATEGORI = "Kvinnehelse"; // byttes per artikkel (Pasienthistorie, Fagartikkel, Nyhet, Klinikknytt …)

const sections = [
  { id: "innledning", label: "Innledning" },
  { id: "hva-er-overgangsalder", label: "Hva er overgangsalder?" },
  { id: "symptomer", label: "Symptomene som overrasker" },
  { id: "behandling", label: "Trygg, oppdatert behandling" },
  { id: "konklusjon", label: "Konklusjon" },
];

const ArticleUnifiedMaster = ({ isChatOpen }: { isChatOpen: boolean }) => {
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  useEffect(() => {
    document.title = "Mastermal: Artikkel (felles) | CMedical";
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">Felles mastermal for artikler i Aktuelt</h1>

      {/* ───────────── HERO – split screen ─────────────
          Topp-meta = dato + område (fra Nyhet).
          Forfatter + del er flyttet INN i headeren (fra Fagartikkel). */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[680px]">
          {/* Venstre – meta + tittel + ingress + forfatter */}
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-14 lg:py-20">
            <div className="max-w-xl w-full">
              <Link
                to="/aktuelt"
                className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-light transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake til Aktuelt
              </Link>

              {/* Meta: dato + område (denne varianten foretrukket) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-foreground/60 mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-dark" />
                  {KATEGORI}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Sist oppdatert 19. mai 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  7 min lesetid
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.05] text-foreground mb-6">
                Overgangsalderen er en ny fase — ikke slutten på noe
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
                Hetetokter, søvnproblemer og hjernetåke kan oppleves som tap av kontroll. Men
                dagens kunnskap om hormoner og kvinnehelse gjør at få trenger å «tåle seg
                gjennom» perioden lenger.
              </p>

              {/* Forfatter + faglig validering + del (variant fra Fagartikkel) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-6 border-t border-border/60">
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
                  Del
                </button>
              </div>
            </div>
          </div>

          {/* Høyre – coverbilde, fyller hele halvdelen (raka hjørner) */}
          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src={heroKvinnehelse}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* ───────────── BRØDTEKST + STICKY INNHOLDSFORTEGNELSE ───────────── */}
      <article className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Sidebar — sticky scroll-spy, skjult under lg */}
            <aside className="hidden lg:block lg:col-span-3 lg:order-1 lg:self-start lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <div>
                <p className="text-sm font-normal text-foreground mb-4">
                  I denne artikkelen
                </p>
                <nav>
                  <ul className="space-y-2.5 border-l border-border">
                    {sections.map((s) => {
                      const isActive = activeId === s.id;
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            aria-current={isActive ? "true" : undefined}
                            className={`block pl-4 text-sm font-light -ml-px border-l-2 transition-colors ${
                              isActive
                                ? "text-foreground border-brand-dark"
                                : "text-foreground/60 border-transparent hover:text-foreground hover:border-brand-dark/40"
                            }`}
                          >
                            {s.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Brødtekst */}
            <div className="lg:col-span-9 order-1 lg:order-2 max-w-2xl">
              <p
                id="innledning"
                className="text-lg font-light leading-relaxed text-foreground mb-8 scroll-mt-28"
              >
                I generasjoner har overgangsalderen vært et tema kvinner har båret i
                stillhet. Det trenger den ikke være lenger. Med moderne hormonbehandling og
                en helhetlig tilnærming kan plagene reduseres betydelig — for de fleste.
              </p>

              {/* Kort oppsummert — faktaruta med STREK TIL VENSTRE (foretrukket variant) */}
              <aside className="bg-secondary/40 p-6 md:p-7 my-8 border-l-2 border-brand-dark">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Kort oppsummert
                </h3>
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
                dag.
              </p>

              {/* Featured bilde – RAKA HJØRNER */}
              <figure className="my-10 -mx-6 md:mx-0">
                <img
                  src={heroClinic}
                  alt=""
                  loading="lazy"
                  className="w-full"
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

              {/* Pull quote – VENSTRESTILT (penere) */}
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

              {/* Spesialist-kommentar — felles komponent */}
              <SpecialistComment
                initials="HR"
                quote="I praksis ser vi at mange kvinner kommer til oss etter at de har blitt avfeid flere ganger. Det første vi gjør er å lytte — og deretter kartlegge hele bildet, ikke bare ett symptom."
                name="Dr. Hannah Russell"
                role="Fertilitetslege og gynekolog, CMedical"
              />


              <h2
                id="behandling"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Trygg, oppdatert behandling
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Moderne hormonbehandling (MHT) er trygg for de fleste, og kan gi betydelig
                lindring av plagene<sup className="text-brand-dark">2</sup>.
              </p>

              <h2
                id="konklusjon"
                className="text-2xl md:text-3xl font-light text-foreground mt-12 mb-4 scroll-mt-28"
              >
                Konklusjon
              </h2>
              <p className="text-foreground/80 font-light leading-relaxed mb-6">
                Overgangsalderen er en biologisk overgang, ikke en sykdom — men plagene er
                reelle og kan behandles. Du trenger ikke tåle deg gjennom det.
              </p>

              {/* Kildeliste */}
              <section className="mt-14 pt-8 border-t border-border/60">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Kilder og referanser
                </h3>
                <ol className="space-y-3 text-xs font-light text-foreground/70 leading-relaxed list-decimal pl-5">
                  <li>NICE Guidelines (2024). <em>Menopause: diagnosis and management</em>. NG23.</li>
                  <li>Helsedirektoratet (2023). <em>Nasjonal faglig retningslinje for behandling av plager i overgangsalderen</em>.</li>
                  <li>The Lancet (2024). <em>Menopause Series</em>. Vol. 403.</li>
                </ol>
              </section>

              {/* Ansvarsfraskrivelse */}
              <p className="mt-8 text-xs font-light text-foreground/50 leading-relaxed">
                Denne artikkelen erstatter ikke individuell medisinsk rådgivning. Snakk med
                en spesialist før du gjør endringer i behandling.
              </p>

              {/* Tags + Del — rett etter selve innlegget */}
              <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap items-center gap-3">
                <Tag className="w-4 h-4 text-foreground/50" />
                {["Overgangsalder", "Hormonbehandling", "Kvinnehelse", "Gynekologi"].map((t) => (
                  <Link
                    key={t}
                    to={`/aktuelt?tag=${encodeURIComponent(t)}`}
                    className="text-xs font-light px-3 py-1 rounded-full border border-border text-foreground/70 hover:border-brand-dark hover:text-foreground transition-colors"
                  >
                    {t}
                  </Link>
                ))}
                <button className="ml-auto inline-flex items-center gap-1.5 text-xs font-light text-foreground/60 hover:text-foreground transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Del artikkelen
                </button>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* ───────────── SAMMENSLÅTT SEKSJON:
           Fagforfatter + fremhevet tjeneste — venstre/høyrestilt bilde, raka hjørner.
           Erstatter "Fagforfatter"-kortet og "Overgangsalder-konsultasjon"-kortet
           som tidligere lå hver for seg. ───────────── */}
      <section className="bg-brand-light border-y border-border/60">
        <div className="grid md:grid-cols-2 md:min-h-[520px] md:max-h-screen">
          {/* Image — fills its half edge-to-edge, capped at one viewport */}
          <div className="relative order-1 min-h-[320px] md:min-h-0 md:h-full bg-secondary overflow-hidden">
            <img
              src={idaProfile}
              alt="Ida Bjørntvedt"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {/* Content — vertically centered in its half */}
          <div className="order-2 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              Ida Bjørntvedt
            </h2>
            <p className="text-sm font-light text-foreground/70 mb-5">
              Spesialist i gynekologi · CMedical Sandvika
            </p>
            <p className="text-base font-light leading-relaxed text-foreground/80 mb-6 max-w-md">
              Bjørntvedt har spesialisert seg på hormonelle plager og overgangsalder, og
              jobber med kvinner i alle livsfaser. Hun underviser jevnlig kollegaer og
              fastleger om moderne hormonbehandling.
            </p>
            <ul className="space-y-2 mb-8 text-sm font-light text-foreground/80">
              <li>· Overgangsalder-konsultasjon — fra 2 490 kr</li>
              <li>· 45 minutter, ingen henvisning nødvendig</li>
              <li>· Time innen 10 dager</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link to="/spesialister/ida-bjorntvedt" className="inline-flex items-center gap-2 text-sm font-light text-foreground border-b border-foreground pb-0.5 hover:gap-2.5 transition-all">
                Les hele profilen <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/behandlinger/gynekologi/overgangsalder" className="inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground transition-colors">
                Se hele tjenesten
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ───────────── ANDRE SPESIALISTER (scroller) ───────────── */}
      <SpecialistsScroller
        category="gynekologi"
        title="Andre gynekologer hos oss"
        description="Møt teamet av spesialister som jobber med kvinnehelse."
        seeAllHref="/spesialister?kategori=gynekologi"
      />

      {/* ───────────── ANDRE TJENESTER – kun ÉN seksjon (duplikat fjernet) ───────────── */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              Andre tjenester innen kvinnehelse
            </h2>
            <p className="text-muted-foreground font-light mb-10">
              Et komplett tilbud for kvinner i alle livsfaser.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { Icon: Stethoscope, t: "Gynekologisk undersøkelse", d: "Grundig og trygg helsesjekk.", l: "/behandlinger/gynekologi/undersokelse" },
                { Icon: HeartPulse, t: "Fertilitetssjekk", d: "Få oversikt over fruktbarheten din.", l: "/behandlinger/fertilitet/fertilitetssjekk" },
                { Icon: Sparkles, t: "Hormonbehandling", d: "Individuelt tilpasset MHT.", l: "/behandlinger/gynekologi/hormonbehandling" },
              ].map((s) => (
                <Link key={s.t} to={s.l} className="group block p-6 border border-border bg-background hover:border-brand-dark/40 transition-all">
                  <s.Icon className="w-6 h-6 text-brand-dark mb-4" strokeWidth={1.5} />
                  <h3 className="text-base font-medium text-foreground mb-1.5">{s.t}</h3>
                  <p className="text-sm font-light text-foreground/70 mb-4">{s.d}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-light text-foreground group-hover:gap-2 transition-all">
                    Les mer <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── WEBINAR / VIDEO (valgfri) – raka hjørner ───────────── */}
      <section className="bg-background py-14 md:py-20 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Webinar — spesialisten svarer om overgangsalder
            </h2>
            <div className="relative aspect-video overflow-hidden bg-secondary group cursor-pointer">
              <img src={heroGyn} alt="" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-dark/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-light/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-brand-dark ml-1" />
                </div>
              </div>
            </div>
            <p className="text-xs font-light text-muted-foreground mt-3">
              Webinar · 38 min · Spilt inn april 2026
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <FaqSection
        background="bg-secondary/30"
        faqs={[
          { id: "1", question: "Når begynner overgangsalderen?", answer: "Perimenopausen starter ofte i 40-årene, men varierer mye fra person til person." },
          { id: "2", question: "Er hormonbehandling trygt?", answer: "For de fleste er moderne MHT trygt når behandlingen tilpasses individuelt." },
          { id: "3", question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte hos en av gynekologene." },
          { id: "4", question: "Hvor lang tid tar konsultasjonen?", answer: "Det settes av 45 minutter til første samtale." },
        ]}
      />




      {/* ───────────── RELATERTE ARTIKLER – raka hjørner ───────────── */}
      <section className="bg-secondary/30 border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          <h2 className="text-lg font-medium text-foreground mb-8">Relaterte artikler</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Endometriose: hva forskningen sier i 2026", e: "En oppdatert gjennomgang av diagnostikk og behandling.", c: "Kvinnehelse", img: heroKvinnehelse },
              { t: "Når bør du sjekke fruktbarheten?", e: "Slik tenker spesialistene rundt timing og test.", c: "Fertilitet", img: heroFertility },
              { t: "Hormonbehandling — hva er trygt?", e: "Myter og fakta om moderne MHT, forklart.", c: "Kvinnehelse", img: articleGyn },
            ].map((a) => (
              <Link key={a.t} to="#" className="group">
                <div className="relative aspect-[16/10] overflow-hidden mb-3 bg-secondary">
                  <img
                    src={a.img}
                    alt={a.t}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
                      {a.c}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <Clock className="w-3 h-3" />
                  7 min lesetid
                </div>
                <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors leading-snug mb-1">
                  {a.t}
                </h3>
                <p className="text-xs text-muted-foreground font-light line-clamp-2">
                  {a.e}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── MØRK CTA-BOKS NEDERST (foretrukket variant) ───────────── */}
      <section className="bg-brand-dark py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light text-brand-light mb-3">
              Vil du snakke med en spesialist?
            </h2>
            <p className="text-brand-light/70 font-light mb-8">
              Bestill en time hos en av våre gynekologer — ingen henvisning nødvendig.
            </p>
            <Link
              to="/booking?kategori=gynekologi&tjeneste=overgangsalder"
              className="inline-flex items-center gap-2 bg-brand-light text-brand-dark px-6 py-3 text-sm font-normal hover:bg-white transition-colors"
            >
              Bestill konsultasjon
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <BookingCTA />
    </PageLayout>
  );
};

export default ArticleUnifiedMaster;
