import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { specialists } from "@/data/specialists";
import gynHero from "@/assets/hero/gynecology-hero.jpg";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";

interface PageProps { isChatOpen: boolean }

const chapters = [
  {
    no: "01",
    title: "Den vanlige timen",
    body: "Rutineundersøkelse, celleprøve, prevensjonsveiledning og gynekologisk ultralyd. Alt på samme sted, med tid til samtalen som faktisk betyr noe.",
    services: ["Rutineundersøkelse", "Celleprøve & HPV", "Prevensjon & P-stav", "Ultralyd"],
  },
  {
    no: "02",
    title: "Når noe ikke kjennes riktig",
    body: "Smerter, uregelmessige blødninger, gjentatte infeksjoner. Vi tar symptomene på alvor – og bruker den tiden som trengs for å finne ut av det.",
    services: ["Endometriose", "PCOS", "Underlivsinfeksjoner", "Blødningsforstyrrelser"],
  },
  {
    no: "03",
    title: "Livet skifter form",
    body: "Perimenopause, overgangsalder og hormonelle endringer er ikke noe man bare skal komme seg gjennom. Det er en fase som fortjener faglig følge.",
    services: ["Hormonbehandling", "Overgangsalder", "Beinhelse", "Søvn & energi"],
  },
];

const EditorialVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Gynekologi · Editorial | CMedical";
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 3),
    []
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back link */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO – editorial split */}
      <section className="bg-brand-warm pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-8">
                Gynekologi
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] tracking-tight">
                Et fag som <em className="italic font-light">lytter</em> – og en time som rekker.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                Hos CMedical møter du gynekologer som tar seg tid. 30 minutter er ikke et unntak –
                det er normalen. Ingen henvisning. Time innen 1–3 dager.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Bestill time
                  <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link
                  to="/priser"
                  className="text-sm font-light text-foreground/70 hover:text-foreground underline underline-offset-4"
                >
                  Se priser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wide image */}
      <section className="bg-brand-warm">
        <div className="w-full h-[55vh] min-h-[420px] overflow-hidden">
          <img
            src={gynHero}
            alt="Gynekologisk konsultasjon hos CMedical"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-brand-warm py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl">
          <p className="text-2xl md:text-4xl font-light text-foreground leading-[1.25] tracking-tight">
            «Jeg ble hørt på en måte jeg ikke har opplevd før. Det var første gang jeg gikk fra en
            gynekolog og følte at jeg faktisk forsto min egen kropp.»
          </p>
          <p className="text-sm text-muted-foreground font-light mt-8">
            — Pasient, 34, Oslo
          </p>
        </div>
      </section>

      {/* Chapters – tjenester som kapitler */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
              Hva vi behandler
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
              Tre kapitler i et kvinneliv
            </h2>
          </div>

          <div className="space-y-20 md:space-y-28">
            {chapters.map((c, i) => (
              <article
                key={c.no}
                className={`grid grid-cols-12 gap-6 md:gap-12 items-start ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="col-span-12 md:col-span-5 [direction:ltr]">
                  <p className="text-7xl md:text-8xl font-light text-foreground/10 leading-none mb-2">
                    {c.no}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-foreground leading-tight mb-5">
                    {c.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                    {c.body}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {c.services.map((s) => (
                      <li
                        key={s}
                        className="text-xs font-light text-foreground/70 px-3 py-1.5 rounded-full border border-border/70"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-12 md:col-span-7 [direction:ltr]">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={i === 0 ? gynHero : i === 1 ? heroFamily : heroPregnancy}
                      alt={c.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spesialister – minimal rad */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Spesialistene
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Mennesker, ikke titler
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle gynekologer
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {gynSpecialists.map((s) => (
              <Link
                key={s.slug}
                to={`/spesialister/${s.slug}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted mb-5 rounded-sm">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-2">
                  {s.subtitle || s.title}
                </p>
                <h3 className="text-xl font-light text-foreground mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {s.expertise.slice(0, 2).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Time innen 1–3 dager. Ingen henvisning.
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Vi tror på faglig trygghet, tid til samtalen og en oppfølging som faktisk henger sammen.
          </p>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Bestill gynekologtime
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default EditorialVariant;
