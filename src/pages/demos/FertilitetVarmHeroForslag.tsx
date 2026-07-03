import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getCategoryEntryPrice } from "@/data/priceList";
import fertilityHeroAsset from "@/assets/hero-fertilitet.jpg.asset.json";
import fertilityHeroVideo from "@/assets/fertilitet-hero-v2.mp4.asset.json";

const fertilityHeroImg = fertilityHeroAsset.url;

/**
 * Sammenligning — Fertilitet-hero.
 *
 * KUN visning under «Maler»-fanen. Publisert Fertilitet-side er IKKE endret.
 * Viser dagens hero + tre forslag med varmere korn-gradient-behandling,
 * så teamet kan sammenligne dem side ved side.
 */

// SVG-basert korn-tekstur — mykt, subtilt, matcher øvrig profil
const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

const grainPanel: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(120% 90% at 15% 20%, hsl(14 78% 68% / 0.85), transparent 60%), radial-gradient(90% 80% at 90% 85%, hsl(28 82% 62% / 0.9), transparent 65%), linear-gradient(135deg, hsl(18 70% 58%) 0%, hsl(22 65% 48%) 55%, hsl(24 45% 28%) 100%)`,
  backgroundBlendMode: "overlay, normal, normal, normal",
};

const grainFullBlock: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(80% 70% at 20% 30%, hsl(20 90% 72% / 0.9), transparent 60%), radial-gradient(70% 80% at 85% 75%, hsl(12 70% 45% / 0.85), transparent 60%), linear-gradient(120deg, hsl(22 75% 55%) 0%, hsl(18 60% 38%) 60%, hsl(24 40% 22%) 100%)`,
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

/* ─────────────────────────── Shared UI ─────────────────────────── */

const HeroBreadcrumb = ({ tone = "dark" }: { tone?: "dark" | "light" }) => (
  <nav
    aria-label="breadcrumb"
    className={`text-xs font-light flex items-center gap-2 mb-8 lg:mb-10 ${
      tone === "light" ? "text-white/70" : "text-foreground/60"
    }`}
  >
    <Link
      to="/"
      className={tone === "light" ? "hover:text-white" : "hover:text-foreground"}
    >
      Hjem
    </Link>
    <span aria-hidden="true">›</span>
    <span className={tone === "light" ? "text-white/90" : "text-foreground/80"}>
      Fertilitet
    </span>
  </nav>
);

const HeroCopy = ({ tone = "dark" }: { tone?: "dark" | "light" }) => {
  const entry = getCategoryEntryPrice("fertilitet");
  const isLight = tone === "light";
  return (
    <div className="max-w-xl w-full relative">
      <HeroBreadcrumb tone={tone} />
      <h2
        className={`text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[1.05] ${
          isLight ? "text-white" : "text-foreground"
        }`}
      >
        Noen ganger trenger kroppen{" "}
        <span className="block italic">litt hjelp på veien</span>
      </h2>
      <p
        className={`text-base md:text-lg font-light leading-relaxed mb-10 ${
          isLight ? "text-white/90" : "text-muted-foreground"
        }`}
      >
        Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For
        mange går det av seg selv. For andre tar det litt lenger tid — og noen
        trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar.
      </p>
      {entry && (
        <div
          className={`mb-4 text-sm font-light ${
            isLight ? "text-white/85" : "text-foreground/80"
          }`}
        >
          <span
            className={`block text-base ${isLight ? "text-white" : "text-foreground"}`}
          >
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
            (window.location.href = buildBookingUrl({ kategori: "fertilitet" }))
          }
        >
          Bestill time
        </Button>
        <CallUsClinicPicker
          variant={isLight ? "dark" : "light"}
          label="Ring oss"
        />
      </div>
      <ul
        className={`flex flex-wrap gap-x-6 gap-y-2 text-sm font-light ${
          isLight ? "text-white/95" : "text-brand-dark"
        }`}
      >
        {["Ingen henvisning", "Korte ventetider"].map((u) => (
          <li key={u} className="flex items-center gap-2">
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>{u}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ─────────────────────────── Hero variants ─────────────────────────── */

// NÅVÆRENDE — 1:1 kopi av publisert Fertilitet-hero (video høyre, tekst venstre)
const HeroCurrent = () => (
  <header className="bg-brand-light pt-8 lg:pt-0">
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div className="flex items-center page-edge-text-left py-16 lg:py-24">
        <HeroCopy tone="dark" />
      </div>
      <div className="relative min-h-[420px] lg:min-h-full">
        <video
          src={fertilityHeroVideo.url}
          poster={fertilityHeroImg}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

// FORSLAG 1 — split med varmt korn-gradient-panel ved siden av bildet
const HeroSplitGrain = () => (
  <header className="relative bg-brand-light overflow-hidden">
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
    <div className="relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div
        className="relative flex items-center page-edge-text-left py-16 lg:py-24 text-white overflow-hidden"
        style={grainPanel}
      >
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
        <HeroCopy tone="light" />
      </div>
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={fertilityHeroImg}
          alt="Fertilitet hos CMedical"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
          style={{ backgroundImage: GRAIN_URL }}
        />
      </div>
    </div>
  </header>
);

// FORSLAG 2 — full farge-/gradient-blokk med tekst oppå (ingen bilde)
const HeroFullGradient = () => (
  <header
    className="relative overflow-hidden text-white"
    style={grainFullBlock}
  >
    <div
      aria-hidden="true"
      className="absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full pointer-events-none opacity-70"
      style={grainAccentSoft}
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none opacity-70"
      style={grainAccentDeep}
    />
    <div
      aria-hidden="true"
      className="absolute top-1/3 left-1/2 w-56 h-56 rounded-full pointer-events-none opacity-50"
      style={grainAccentSoft}
    />
    <div className="relative z-10 page-edge-text-left py-20 lg:py-32 lg:min-h-[560px] flex items-center">
      <HeroCopy tone="light" />
    </div>
  </header>
);

// FORSLAG 3 — bilde med korn-aksentflater rundt for dybde
const HeroImageWithAccents = () => (
  <header className="relative bg-brand-light overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute -top-20 -left-16 w-72 h-72 rounded-full pointer-events-none opacity-80 z-10"
      style={grainAccentSoft}
    />
    <div
      aria-hidden="true"
      className="absolute top-1/2 -right-16 w-64 h-64 rounded-full pointer-events-none opacity-70 z-10"
      style={grainAccentDeep}
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-60 z-10"
      style={grainAccentSoft}
    />
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div className="flex items-center page-edge-text-left py-16 lg:py-24">
        <HeroCopy tone="dark" />
      </div>
      <div className="relative min-h-[420px] lg:min-h-full p-6 lg:p-10">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
          <img
            src={fertilityHeroImg}
            alt="Fertilitet hos CMedical"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{ backgroundImage: GRAIN_URL }}
          />
        </div>
      </div>
    </div>
  </header>
);

// FORSLAG 4 — sentrert hero med stor korn-gradient-bakgrunn og tekst i midten
const HeroCenteredGrain = () => (
  <header
    className="relative overflow-hidden text-white"
    style={grainFullBlock}
  >
    <div
      aria-hidden="true"
      className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full pointer-events-none opacity-60"
      style={grainAccentSoft}
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none opacity-70"
      style={grainAccentDeep}
    />
    <div
      aria-hidden="true"
      className="absolute -bottom-24 -right-20 w-[380px] h-[380px] rounded-full pointer-events-none opacity-60"
      style={grainAccentSoft}
    />
    <div className="relative z-10 py-24 lg:py-36 lg:min-h-[620px] flex items-center justify-center text-center">
      <div className="max-w-2xl px-6 md:px-10">
        <nav
          aria-label="breadcrumb"
          className="text-xs font-light flex items-center justify-center gap-2 mb-8 text-white/70"
        >
          <Link to="/" className="hover:text-white">Hjem</Link>
          <span aria-hidden="true">›</span>
          <span className="text-white/90">Fertilitet</span>
        </nav>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[1.05] text-white">
          Noen ganger trenger kroppen{" "}
          <span className="block italic">litt hjelp på veien</span>
        </h2>
        <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-white/90 max-w-xl mx-auto">
          Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For
          mange går det av seg selv. For andre tar det litt lenger tid — og
          noen trenger hjelp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
          <Button
            variant="cta"
            size="lg"
            className="px-8 w-full sm:w-auto"
            onClick={() =>
              (window.location.href = buildBookingUrl({ kategori: "fertilitet" }))
            }
          >
            Bestill time
          </Button>
          <CallUsClinicPicker variant="dark" label="Ring oss" />
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-white/95 justify-center">
          {["Ingen henvisning", "Korte ventetider"].map((u) => (
            <li key={u} className="flex items-center gap-2">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </header>
);

// FORSLAG 5 — asymmetrisk split: bilde venstre (større), varm gradient-blokk høyre
const HeroAsymmetricSplit = () => (
  <header className="relative bg-brand-light overflow-hidden">
    <div
      aria-hidden="true"
      className="hidden lg:block absolute -top-24 right-1/3 w-72 h-72 rounded-full pointer-events-none opacity-60 z-10"
      style={grainAccentSoft}
    />
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-[1.35fr_1fr] lg:min-h-[640px]">
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={fertilityHeroImg}
          alt="Fertilitet hos CMedical"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        className="relative flex items-center px-6 md:px-10 lg:px-14 py-16 lg:py-24 text-white overflow-hidden"
        style={grainPanel}
      >
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-70"
          style={grainAccentSoft}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full pointer-events-none opacity-60"
          style={grainAccentDeep}
        />
        <HeroCopy tone="light" />
      </div>
    </div>
  </header>
);

// FORSLAG 6 — rundt/organisk bilde-utsnitt med korn-aksentflater rundt
const HeroOrganicImage = () => (
  <header className="relative bg-brand-light overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute -top-24 -left-16 w-80 h-80 rounded-full pointer-events-none opacity-70 z-10"
      style={grainAccentSoft}
    />
    <div
      aria-hidden="true"
      className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full pointer-events-none opacity-60 z-10"
      style={grainAccentDeep}
    />
    <div
      aria-hidden="true"
      className="absolute -top-10 right-1/4 w-52 h-52 rounded-full pointer-events-none opacity-60 z-10"
      style={grainAccentSoft}
    />
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div className="flex items-center page-edge-text-left py-16 lg:py-24">
        <HeroCopy tone="dark" />
      </div>
      <div className="relative min-h-[460px] lg:min-h-full flex items-center justify-center p-6 lg:p-12">
        <div
          aria-hidden="true"
          className="absolute top-6 right-6 w-40 h-40 rounded-full pointer-events-none opacity-70"
          style={grainAccentDeep}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-4 w-48 h-48 rounded-full pointer-events-none opacity-60"
          style={grainAccentSoft}
        />
        <div
          className="relative w-full max-w-md aspect-square overflow-hidden shadow-2xl"
          style={{ borderRadius: "48% 52% 42% 58% / 52% 44% 56% 48%" }}
        >
          <img
            src={fertilityHeroImg}
            alt="Fertilitet hos CMedical"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{ backgroundImage: GRAIN_URL }}
          />
        </div>
      </div>
    </div>
  </header>
);

// FORSLAG 7 (minimal) — kun varm gradient + tekst, uten foto, roligere komposisjon
const HeroMinimalGradient = () => (
  <header
    className="relative overflow-hidden text-white"
    style={{
      backgroundImage: `${GRAIN_URL}, linear-gradient(115deg, hsl(20 65% 55%) 0%, hsl(24 55% 40%) 55%, hsl(22 40% 22%) 100%)`,
      backgroundBlendMode: "overlay, normal, normal",
    }}
  >
    <div
      aria-hidden="true"
      className="absolute top-10 right-10 w-60 h-60 rounded-full pointer-events-none opacity-50"
      style={grainAccentSoft}
    />
    <div className="relative z-10 page-edge-text-left py-20 lg:py-28 lg:min-h-[480px] flex items-center">
      <HeroCopy tone="light" />
    </div>
  </header>
);

/* ─────────────────────────── Section wrapper ─────────────────────────── */

interface VariantSectionProps {
  status: "Nåværende" | "Forslag";
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const VariantSection = ({
  status,
  label,
  title,
  description,
  children,
}: VariantSectionProps) => {
  const isCurrent = status === "Nåværende";
  return (
    <section className="py-10 md:py-16 border-t border-foreground/10">
      <div className="page-shell max-w-5xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-flex items-center text-[11px] font-light px-3 py-1 rounded-full ${
              isCurrent
                ? "bg-foreground/10 text-foreground/80"
                : "bg-brand-dark text-brand-light"
            }`}
          >
            {status}
          </span>
          <span className="text-xs font-light text-foreground/50">{label}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">
          {title}
        </h2>
        <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
};

/* ─────────────────────────── Page ─────────────────────────── */

export default function FertilitetVarmHeroForslag({ isChatOpen }: Props) {
  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Sammenligning: Fertilitet-hero varianter | CMedical"
        description="Sammenligning av nåværende Fertilitet-hero og tre varmere forslag."
        canonical="/maler/fertilitetVarmHeroForslag"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Godkjenning", path: "/godkjenning" },
        ]}
      />
      <h1 className="sr-only">
        Sammenligning — Fertilitet-hero, nåværende vs forslag
      </h1>

      {/* Intro */}
      <section className="bg-brand-light pt-24 pb-10 md:pb-14">
        <div className="page-shell max-w-3xl">
          <p className="text-xs uppercase text-foreground/50 mb-3">
            Designforslag — kun visning
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 leading-[1.1]">
            Hero-varianter for tjenestesider
          </h2>
          <p className="text-base font-light leading-relaxed text-muted-foreground">
            Under ser du dagens Fertilitet-hero øverst, og tre forslag med
            varmere korn-gradient-behandling. Alle bruker samme tokens,
            typografi, radius og USP-stil som resten av siden. Den publiserte
            Fertilitet-siden er ikke endret — sammenlign gjerne med{" "}
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

      <VariantSection
        status="Nåværende"
        label="Publisert i dag"
        title="Split — video høyre, tekst venstre"
        description="Dagens Fertilitet-hero: autoplay-video kant-i-kant til høyre, tekst og CTA på lys bakgrunn til venstre. Balansert og rolig, men lite farge-varme."
      >
        <HeroCurrent />
      </VariantSection>

      <VariantSection
        status="Forslag"
        label="Variant 1"
        title="Varm split med korn-gradient-panel"
        description="Hero-bildet ligger til høyre, mens venstre halvdel er et kornete gradient-panel i korall, oransje og varm brun. Små korn-flater rundt hero gir ekstra dybde."
      >
        <HeroSplitGrain />
      </VariantSection>

      <VariantSection
        status="Forslag"
        label="Variant 2"
        title="Full farge-/gradient-blokk med tekst oppå"
        description="Ingen bilde — hele hero er en varm korn-gradient-flate med tekst og CTA plassert direkte oppå. Roligere komposisjon, sterkere farge-signal."
      >
        <HeroFullGradient />
      </VariantSection>

      <VariantSection
        status="Forslag"
        label="Variant 3"
        title="Bilde med korn-aksentflater rundt for dybde"
        description="Hero-bildet får avrundede kanter og ligger som en 'card' i komposisjonen, omkranset av mykt uskarpe korn-gradient-flater som løfter bildet og skaper dybde."
      >
        <HeroImageWithAccents />
      </VariantSection>

      <div className="h-16" aria-hidden="true" />
    </PageLayout>
  );
}
