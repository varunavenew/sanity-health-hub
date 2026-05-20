import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Calendar, Clock, Share2, MapPin, Quote,
  ChevronDown, Mail, Tag, Play, Stethoscope, HeartPulse, Sparkles,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import heroClinic from "@/assets/hero/hero-clinic-lounge.jpg";

/**
 * NewsItemMaster — mastermal for NYHETER / pasienthistorier.
 *
 * Layouten her er bevisst lettere og mer journalistisk enn fagartikkel-malen:
 * split-screen hero (tekst + bilde kant-i-kant), kort ingress og en strammere
 * brødtekst-spalte. Tenkes brukt til klinikknyheter, pasienthistorier,
 * stillingsannonser, presse og kortere stykker.
 */

const NewsItemMaster = ({ isChatOpen }: { isChatOpen: boolean }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Mastermal: Nyhet | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">Mastermal for nyhet og pasienthistorie</h1>

      {/* ───────────── HERO – split screen ───────────── */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[520px] lg:min-h-[640px]">
          {/* Left — meta + tittel + ingress */}
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-14 lg:py-20">
            <div className="max-w-xl w-full">
              <Link
                to="/aktuelt"
                className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-light transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake til Aktuelt
              </Link>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-foreground/60 mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-dark" />
                  Pasienthistorie
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  19. mai 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  4 min lesetid
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-foreground mb-6">
                «Etter operasjonen kunne jeg gå tur med barnebarna igjen»
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                Atten måneder etter hofteoperasjonen hos CMedical forteller Kari (68) hva
                inngrepet har betydd for hverdagen — og hvorfor hun valgte å gjøre det
                privat.
              </p>
            </div>
          </div>

          {/* Right — coverbilde, fyller hele halvdelen */}
          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src={heroClinic}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* ───────────── BRØDTEKST – stram en-spaltet ───────────── */}
      <article className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            {/* Forfatter-byline */}
            <div className="flex items-center gap-3 pb-8 mb-10 border-b border-border/60">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-light text-foreground/70">
                MA
              </div>
              <div>
                <p className="text-sm font-normal text-foreground">Maria Andersen</p>
                <p className="text-xs font-light text-foreground/60">Redaksjonen, CMedical</p>
              </div>
              <button className="ml-auto inline-flex items-center gap-1.5 text-xs font-light text-foreground/60 hover:text-foreground transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Del
              </button>
            </div>

            <p className="text-lg font-light leading-relaxed text-foreground mb-6">
              Kari Hansen hadde levd med smerter i hoften i flere år. Etter et halvt år på
              venteliste i det offentlige bestemte hun seg for å ta saken i egne hender.
            </p>

            <p className="text-foreground/80 font-light leading-relaxed mb-6">
              «Jeg fikk en time hos en spesialist på CMedical innen ti dager. Vi gikk
              grundig gjennom historikken, bildene og alternativene — og jeg følte for
              første gang at noen virkelig lyttet,» forteller hun.
            </p>

            <p className="text-foreground/80 font-light leading-relaxed mb-10">
              Operasjonen ble gjennomført i Sandvika i januar 2025. I dag, 18 måneder
              senere, går hun tur med barnebarna hver dag.
            </p>

            <h2 className="text-xl md:text-2xl font-light text-foreground mt-12 mb-4">
              Et raskt forløp
            </h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-6">
              Fra første konsultasjon til operasjon tok det fire uker. Etter inngrepet
              fulgte fysioterapeutene Kari tett opp i tre måneder, med ukentlige
              kontroller og et tilpasset treningsopplegg.
            </p>

            <p className="text-foreground/80 font-light leading-relaxed mb-10">
              «Det som overrasket meg mest var hvor godt informert jeg ble underveis. Jeg
              visste alltid hva som skulle skje neste uke,» sier hun.
            </p>

            {/* Faktaboks */}
            <aside className="bg-secondary/40 rounded-sm p-6 md:p-8 my-10">
              <p className="text-[11px] tracking-wider uppercase text-brand-dark mb-3">
                Fakta
              </p>
              <h3 className="text-base font-normal text-foreground mb-3">
                Hofteprotese hos CMedical
              </h3>
              <ul className="space-y-2 text-sm font-light text-foreground/80">
                <li>· Operasjon utføres ved CMedical Sandvika</li>
                <li>· Tid fra konsultasjon til operasjon: typisk 3–6 uker</li>
                <li>· Fysioterapeut-oppfølging inkludert i forløpet</li>
                <li>· Ingen henvisning nødvendig</li>
              </ul>
            </aside>

            <h2 className="text-xl md:text-2xl font-light text-foreground mt-12 mb-4">
              Tilbake til hverdagen
            </h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-6">
              I dag bruker Kari ikke smertestillende i det hele tatt. Hun har begynt å
              danse igjen, og planlegger sin første lange tur til fots i sommer.
            </p>

            <p className="text-foreground/80 font-light leading-relaxed mb-10">
              «Hadde jeg visst hvor godt det skulle gå, hadde jeg gjort det for lenge
              siden,» avslutter hun med et smil.
            </p>

            {/* Sted/sluttmeta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-foreground/60 pt-8 mt-10 border-t border-border/60">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                CMedical Sandvika
              </span>
              <span>·</span>
              <span>Publisert 19. mai 2026</span>
            </div>
          </div>
        </div>
      </article>

      {/* ───────────── RELATERTE NYHETER ───────────── */}
      <section className="bg-secondary/30 border-t border-border py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <h2 className="text-lg font-normal text-foreground mb-8">Flere nyheter</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Ny gynekolog på plass i Sandvika", c: "Klinikknytt" },
              { t: "Hva ventelistene gjør med oss", c: "Kommentar" },
              { t: "Slik bygget vi det nye operasjonsrommet", c: "Bak kulissene" },
            ].map((n) => (
              <Link
                key={n.t}
                to="#"
                className="group block"
              >
                <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
                  <img
                    src={heroClinic}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
                      {n.c}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <Calendar className="w-3 h-3" />
                  12. mai 2026
                </div>
                <h3 className="text-sm font-normal text-foreground group-hover:text-foreground/70 transition-colors leading-snug">
                  {n.t}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </PageLayout>
  );
};

export default NewsItemMaster;
