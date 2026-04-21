import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { specialists } from "@/data/specialists";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";
import gynHero from "@/assets/hero/gynecology-hero.jpg";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";

interface PageProps { isChatOpen: boolean }

const tags = [
  "Rutineundersøkelse",
  "Celleprøve & HPV",
  "Ultralyd",
  "Prevensjon",
  "P-stav",
  "Endometriose",
  "PCOS",
  "Underlivsinfeksjoner",
  "Blødningsforstyrrelser",
  "Overgangsalder",
  "Hormonbehandling",
  "Fertilitetsutredning",
  "Bekkenhelse",
  "Urogynekologi",
];

const galleryRow1 = [gynHero, kvinnehelseHero, heroPregnancy];
const galleryRow2 = [heroFamily, heroPregnancy, gynHero];

const AtelierVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Gynekologi · Atelier | CMedical";
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 6),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO – Full bleed image with caption underneath */}
      <section className="bg-brand-warm pt-10 md:pt-12 pb-6 md:pb-8">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
            <img
              src={heroPregnancy}
              alt="Gynekologi hos CMedical"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 40%" }}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-warm pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12 mt-6 md:mt-8">
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light">
                Gynekologi
              </p>
              <p className="text-xs text-muted-foreground font-light mt-2">
                CMedical · 2026
              </p>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.02] tracking-tight">
                Et rom for kroppen, samtalen og det som ikke alltid sies.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                Privat gynekologisk klinikk i Oslo. Time innen 1–3 dager. Ingen henvisning.
              </p>
              <Button
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light h-11 w-full md:w-auto"
                onClick={() => (window.location.href = "/booking")}
              >
                Bestill time
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tjenester som tags */}
      <section className="bg-background py-20 md:py-28 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12">
            <div className="col-span-12 md:col-span-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Tjenester
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-6">
                Hele bredden – samlet på ett sted
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Fra rutineundersøkelse til avansert utredning. Ett team, samme journal,
                kontinuerlig oppfølging.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="flex flex-wrap gap-2.5">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="text-sm font-light text-foreground px-4 py-2.5 rounded-full border border-border hover:bg-muted transition-colors cursor-default"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / atelier strips */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {galleryRow1.map((img, i) => (
              <div
                key={`r1-${i}`}
                className={`overflow-hidden rounded-2xl bg-muted ${
                  i === 1 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-5 mt-3 md:mt-5">
            {galleryRow2.map((img, i) => (
              <div
                key={`r2-${i}`}
                className={`overflow-hidden rounded-2xl bg-muted ${
                  i === 0 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists – portrait wall */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Portrettveggen
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Spesialistene
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {gynSpecialists.map((s) => (
              <Link
                key={s.slug}
                to={`/spesialister/${s.slug}`}
                className="group block"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted rounded-2xl mb-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <p className="text-sm font-light text-foreground leading-tight">{s.name}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pasienthistorie – sitat-blokk */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-10">
            Pasienthistorie
          </p>
          <p className="text-2xl md:text-4xl font-light text-foreground leading-[1.25] tracking-tight">
            Det føltes ikke som en klinikk. Det føltes som et rom hvor jeg endelig fikk lov til å
            være pasient – og menneske – samtidig.
          </p>
          <p className="text-sm text-muted-foreground font-light mt-8">— Thea, 28</p>
        </div>
      </section>

      {/* Final CTA – minimal */}
      <section className="bg-brand-warm py-20 md:py-28 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Bestill din time.
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-4 max-w-md">
              Kort ventetid. Ingen henvisning. Et helsetilbud som henger sammen.
            </p>
          </div>
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Til booking
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default AtelierVariant;
