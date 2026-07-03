import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getCategoryEntryPrice } from "@/data/priceList";
import fertilityHeroAsset from "@/assets/hero-fertilitet.jpg.asset.json";

const fertilityHeroImg = fertilityHeroAsset.url;

/**
 * Demo/forslag – Fertilitet-hero med varm korn-gradient-panel ved siden av bildet.
 *
 * KUN visning under «Maler»-fanen på /godkjenning. Publisert Fertilitet-side er
 * IKKE endret. Formålet er å vise mer varme og dybde via kornete gradient-flater
 * i korall/oransje/fersken/varm brun, ved siden av og som aksenter rundt hero.
 *
 * Design-prinsipper, tokens, typografi, radius og USP-stil er identiske med
 * resten av siden — kun bakgrunn-behandling er ny.
 */

// SVG-basert korn-tekstur (base64) — mykt, subtilt, matcher øvrig grafisk profil
const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

const grainPanel: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(120% 90% at 15% 20%, hsl(14 78% 68% / 0.85), transparent 60%), radial-gradient(90% 80% at 90% 85%, hsl(28 82% 62% / 0.9), transparent 65%), linear-gradient(135deg, hsl(18 70% 58%) 0%, hsl(22 65% 48%) 55%, hsl(24 45% 28%) 100%)`,
  backgroundBlendMode: "overlay, normal, normal, normal",
};

const grainAccentSoft: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(circle at 30% 30%, hsl(20 85% 72% / 0.95), hsl(28 60% 60% / 0.6) 60%, transparent 80%)`,
  backgroundBlendMode: "overlay, normal",
  filter: "blur(2px)",
};

const grainAccentDeep: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(circle at 60% 40%, hsl(14 75% 55% / 0.9), hsl(20 60% 35% / 0.7) 55%, transparent 80%)`,
  backgroundBlendMode: "overlay, normal",
  filter: "blur(3px)",
};

interface Props {
  isChatOpen: boolean;
}

export default function FertilitetVarmHeroForslag({ isChatOpen }: Props) {
  const entry = getCategoryEntryPrice("fertilitet");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Forslag: Fertilitet-hero med varm gradient | CMedical"
        description="Designforslag — Fertilitet-landing med korn-gradient-panel i korall/oransje for mer varme."
        canonical="/maler/fertilitetVarmHeroForslag"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Godkjenning", path: "/godkjenning" },
        ]}
      />
      <h1 className="sr-only">
        Forslag — Fertilitet-hero med varm korn-gradient
      </h1>

      {/* HERO — split screen: bilde + varmt korn-gradient-panel */}
      <header className="relative bg-brand-light pt-24 lg:pt-0 overflow-hidden">
        {/* Dekorative korn-gradient-aksenter for ekstra dybde */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute -top-16 -left-24 w-80 h-80 rounded-full pointer-events-none opacity-70"
          style={grainAccentSoft}
        />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute -bottom-24 left-1/3 w-72 h-72 rounded-full pointer-events-none opacity-60"
          style={grainAccentDeep}
        />

        <div className="lg:hidden page-edge-text-left pb-4 relative z-10">
          <nav
            aria-label="breadcrumb"
            className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4"
          >
            <Link to="/" className="hover:text-foreground">
              Hjem
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground/80">Fertilitet</span>
          </nav>
          <h2 className="text-4xl font-light text-foreground leading-[1.05]">
            Noen ganger trenger kroppen{" "}
            <span className="block italic">litt hjelp på veien</span>
          </h2>
        </div>

        <div className="relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
          {/* Venstre — varmt korn-gradient-panel med copy og CTA */}
          <div
            className="relative flex items-center page-edge-text-left py-16 lg:py-24 text-white overflow-hidden"
            style={grainPanel}
          >
            {/* Ekstra små aksent-flater inne i panelet */}
            <div
              aria-hidden="true"
              className="absolute top-8 right-10 w-40 h-40 rounded-full opacity-70 pointer-events-none"
              style={grainAccentSoft}
            />
            <div
              aria-hidden="true"
              className="absolute bottom-6 -left-10 w-48 h-48 rounded-full opacity-60 pointer-events-none"
              style={grainAccentDeep}
            />

            <div className="max-w-xl w-full relative">
              <nav
                aria-label="breadcrumb"
                className="hidden lg:flex text-xs font-light text-white/70 items-center gap-2 mb-8 lg:mb-10"
              >
                <Link to="/" className="hover:text-white">
                  Hjem
                </Link>
                <span aria-hidden="true">›</span>
                <span className="text-white/90">Fertilitet</span>
              </nav>
              <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[1.05]">
                Noen ganger trenger kroppen{" "}
                <span className="block italic">litt hjelp på veien</span>
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-white/90">
                Å ville bli foreldre er noe av det sterkeste man kan kjenne på.
                For mange går det av seg selv. For andre tar det litt lenger
                tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og
                det finnes svar.
              </p>

              {entry && (
                <div className="mb-4 text-sm font-light text-white/85">
                  <span className="block text-base text-white">
                    {entry.label}
                  </span>
                  <span className="block">{entry.price}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "fertilitet",
                    }))
                  }
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="dark" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-white/95">
                {["Ingen henvisning", "Korte ventetider"].map((u) => (
                  <li key={u} className="flex items-center gap-2">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Høyre — hero-bilde */}
          <div className="relative min-h-[420px] lg:min-h-full">
            <img
              src={fertilityHeroImg}
              alt="Fertilitet hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtil korn-overlay for å binde bildet til gradient-panelet */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
              style={{ backgroundImage: GRAIN_URL }}
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* Kort forklaring — dette er kun et forslag */}
      <section className="bg-brand-light py-14 md:py-20">
        <div className="page-shell max-w-3xl">
          <p className="text-xs uppercase tracking-normal text-foreground/50 mb-3">
            Designforslag — kun visning
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
            Varm korn-gradient som gir hero mer dybde
          </h2>
          <p className="text-base font-light leading-relaxed text-muted-foreground mb-6">
            Denne malen viser hvordan Fertilitet-heroen kan få mer varme og
            farge ved å legge et kornete gradient-panel i korall/oransje/fersken
            og varm brun ved siden av hero-bildet. Små korn-gradient-flater
            rundt hero skaper ekstra dybde. Alle tokens, typografi, radius og
            USP-stil er identiske med resten av siden — kun bakgrunns­behandling
            er ny.
          </p>
          <p className="text-sm font-light text-muted-foreground">
            Den publiserte Fertilitet-siden er ikke endret. Sammenlign gjerne
            med{" "}
            <Link
              to="/behandlinger/fertilitet"
              className="underline underline-offset-4 hover:text-foreground"
            >
              dagens Fertilitet-side
            </Link>
            .
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
