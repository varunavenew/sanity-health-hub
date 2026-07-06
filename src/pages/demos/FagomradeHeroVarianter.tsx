import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getCategoryEntryPrice } from "@/data/priceList";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import urologiImg from "@/assets/categories/urologi-real.jpg";

/**
 * Demo-visning under «Maler»: 5 hero-varianter for HOVEDFAGOMRÅDE-siden
 * (kategori-hero, f.eks. Gynekologi/Fertilitet/Urologi), stablet under
 * hverandre og merket Variant 1–5 så teamet kan sammenligne.
 * Bruker samme varme korn-gradient-retning som fertilitet-forslagene.
 * Publiserte sider er IKKE endret.
 */

interface Props {
  isChatOpen: boolean;
}

/* ─── Grain + gradient-tokens (matcher FertilitetVarmHeroForslag) ─── */
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

const grainMinimal: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, linear-gradient(115deg, hsl(20 65% 55%) 0%, hsl(24 55% 40%) 55%, hsl(22 40% 22%) 100%)`,
  backgroundBlendMode: "overlay, normal, normal",
};

/* ─── Delte hero-elementer ─── */

interface CategoryHeroContent {
  breadcrumb: string;
  title: string;
  titleItalic: string;
  description: string;
  categoryId: string;
  image: string;
  imageAlt: string;
}

const HeroBreadcrumb = ({
  label,
  tone,
  align = "left",
}: {
  label: string;
  tone: "dark" | "light";
  align?: "left" | "center";
}) => (
  <nav
    aria-label="breadcrumb"
    className={`text-xs font-light flex items-center gap-2 mb-8 lg:mb-10 ${
      align === "center" ? "justify-center" : ""
    } ${tone === "light" ? "text-white/70" : "text-foreground/60"}`}
  >
    <Link
      to="/"
      className={tone === "light" ? "hover:text-white" : "hover:text-foreground"}
    >
      Hjem
    </Link>
    <span aria-hidden="true">›</span>
    <span className={tone === "light" ? "text-white/90" : "text-foreground/80"}>
      {label}
    </span>
  </nav>
);

const HeroCopy = ({
  c,
  tone,
  align = "left",
}: {
  c: CategoryHeroContent;
  tone: "dark" | "light";
  align?: "left" | "center";
}) => {
  const entry = getCategoryEntryPrice(c.categoryId);
  const isLight = tone === "light";
  const centered = align === "center";
  return (
    <div
      className={`max-w-xl w-full relative ${
        centered ? "mx-auto text-center" : ""
      }`}
    >
      <HeroBreadcrumb label={c.breadcrumb} tone={tone} align={align} />
      <h2
        className={`text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[1.05] ${
          isLight ? "text-white" : "text-foreground"
        }`}
      >
        {c.title}{" "}
        <span className="block italic">{c.titleItalic}</span>
      </h2>
      <p
        className={`text-base md:text-lg font-light leading-relaxed mb-10 ${
          isLight ? "text-white/90" : "text-muted-foreground"
        } ${centered ? "mx-auto" : ""}`}
      >
        {c.description}
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
      <div
        className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10 ${
          centered ? "sm:justify-center" : ""
        }`}
      >
        <Button
          variant="cta"
          size="lg"
          className="px-8 w-full sm:w-auto"
          onClick={() =>
            (window.location.href = buildBookingUrl({ kategori: c.categoryId }))
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
        } ${centered ? "justify-center" : ""}`}
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

/* ─── Innhold per fagområde (eksempel) ─── */

const gynekologi: CategoryHeroContent = {
  breadcrumb: "Gynekologi",
  title: "Kvinnehelse med",
  titleItalic: "tid, trygghet og erfaring",
  description:
    "Gynekologi handler om mer enn kontroller. Hos oss møter du erfarne spesialister som tar seg tid — enten det gjelder plager, oppfølging eller en trygg samtale.",
  categoryId: "gynekologi",
  image: gynekologiImg,
  imageAlt: "Gynekologi hos CMedical",
};

const fertilitet: CategoryHeroContent = {
  breadcrumb: "Fertilitet",
  title: "Noen ganger trenger kroppen",
  titleItalic: "litt hjelp på veien",
  description:
    "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. Vi tilbyr utredning, oppfølging og behandling — i et rolig og profesjonelt forløp.",
  categoryId: "fertilitet",
  image: fertilitetImg,
  imageAlt: "Fertilitet hos CMedical",
};

const urologi: CategoryHeroContent = {
  breadcrumb: "Urologi",
  title: "Urologi for",
  titleItalic: "hele livet",
  description:
    "Fra vanlige plager til mer komplekse tilstander — våre urologer utreder og behandler i trygge omgivelser, uten lang ventetid.",
  categoryId: "urologi",
  image: urologiImg,
  imageAlt: "Urologi hos CMedical",
};

/* ─── Variant 1 — Varm split med korn-gradient-panel (som fertilitet-forslag 1) ─── */
const Variant1SplitGrain = ({ c }: { c: CategoryHeroContent }) => (
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
        className="relative flex items-center px-6 md:px-10 lg:px-16 py-16 lg:py-24 text-white overflow-hidden"
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
        <HeroCopy c={c} tone="light" />
      </div>
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={c.image}
          alt={c.imageAlt}
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

/* ─── Variant 2 — Full farge-/gradient-blokk med tekst oppå ─── */
const Variant2FullGradient = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white" style={grainFullBlock}>
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
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-32 lg:min-h-[560px] flex items-center">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 3 — Sentrert hero med stor korn-bakgrunn ─── */
const Variant3Centered = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white" style={grainFullBlock}>
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
    <div className="relative z-10 py-24 lg:py-36 lg:min-h-[620px] flex items-center justify-center">
      <div className="px-6 md:px-10 max-w-2xl w-full">
        <HeroCopy c={c} tone="light" align="center" />
      </div>
    </div>
  </header>
);

/* ─── Variant 4 — Asymmetrisk split: stort bilde venstre, gradient-panel høyre ─── */
const Variant4Asymmetric = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div
      aria-hidden="true"
      className="hidden lg:block absolute -top-24 right-1/3 w-72 h-72 rounded-full pointer-events-none opacity-60 z-10"
      style={grainAccentSoft}
    />
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-[1.35fr_1fr] lg:min-h-[640px]">
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={c.image}
          alt={c.imageAlt}
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
        <HeroCopy c={c} tone="light" />
      </div>
    </div>
  </header>
);

/* ─── Variant 5 — Ren/minimal: rolig gradient-flate + tekst, ingen bilde ─── */
const Variant5Minimal = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white" style={grainMinimal}>
    <div
      aria-hidden="true"
      className="absolute top-10 right-10 w-60 h-60 rounded-full pointer-events-none opacity-50"
      style={grainAccentSoft}
    />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 lg:min-h-[480px] flex items-center">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Section wrapper ─── */

const VariantSection = ({
  n,
  title,
  note,
  children,
}: {
  n: number;
  title: string;
  note: string;
  children: React.ReactNode;
}) => (
  <section className="border-b border-foreground/10">
    <div className="bg-brand-dark text-brand-light">
      <div className="container mx-auto px-6 md:px-16 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-3 text-sm font-light">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-light/40 text-xs">
            {n}
          </span>
          <span className="text-base">Variant {n} — {title}</span>
        </div>
        <p className="text-xs text-brand-light/70 font-light max-w-xl">{note}</p>
      </div>
    </div>
    {children}
  </section>
);

const FagomradeHeroVarianter = (_props: Props) => (
  <div className="bg-brand-light">
    <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
      <p className="text-xs font-light text-foreground/60 mb-3">
        Kun demo/visning — publiserte fagområde-sider er ikke endret.
      </p>
      <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">
        Hero-varianter for hovedfagområde-siden
      </h2>
      <p className="text-sm md:text-base font-light text-muted-foreground max-w-2xl">
        Fem forskjellige innganger for kategori-hero (Fagområde-malen),
        stablet under hverandre. Samme varme korn-gradient-retning, tokens,
        typografi, avrundede kanter og USP-stil som fertilitet-forslagene.
        Innholdet er ekte eksempler fra Gynekologi, Fertilitet og Urologi.
      </p>
    </div>

    <VariantSection
      n={1}
      title="Varm split med korn-gradient-panel"
      note="Bilde på én side, varmt korn-gradient-panel på andre. Rolig, men med farge og dybde."
    >
      <Variant1SplitGrain c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={2}
      title="Full farge-/gradient-blokk med tekst oppå"
      note="Ingen bilde — hele hero er en varm gradient-flate. Sterk merkevare-følelse."
    >
      <Variant2FullGradient c={fertilitet} />
    </VariantSection>

    <VariantSection
      n={3}
      title="Sentrert hero med stor korn-bakgrunn"
      note="Sentrert tekst mot stor korn-gradient. Fungerer godt for kategorier uten sterkt hero-bilde."
    >
      <Variant3Centered c={urologi} />
    </VariantSection>

    <VariantSection
      n={4}
      title="Asymmetrisk bilde + gradient-panel"
      note="Stort hero-bilde til venstre, smalere varmt gradient-panel til høyre. Redaksjonell, roligere balanse."
    >
      <Variant4Asymmetric c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={5}
      title="Ren og minimal — rolig gradient + tekst"
      note="Roligste varianten: kun én gradient-flate, ingen bilde, ingen aksentflater. Fungerer når teksten skal bære alt."
    >
      <Variant5Minimal c={fertilitet} />
    </VariantSection>
  </div>
);

export default FagomradeHeroVarianter;
