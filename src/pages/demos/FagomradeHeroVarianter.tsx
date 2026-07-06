import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getCategoryEntryPrice } from "@/data/priceList";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import urologiImg from "@/assets/categories/urologi-real.jpg";
import cmedicalSkinTexture from "@/assets/hero/cmedical-skin-texture.jpg";
import skinTextureHero from "@/assets/hero/skin-texture-hero.webp";
import blurSkinAsset from "@/assets/blur-skin-mid.jpg.asset.json";
import fertilitetHeroVideo from "@/assets/fertilitet-hero.mp4.asset.json";

/**
 * Demo-visning under «Maler»: 6 hero-varianter for HOVEDFAGOMRÅDE-siden
 * (kategori-hero, f.eks. Gynekologi/Fertilitet/Urologi). Alle varianter
 * bruker REELLE merkevare-bilder/-video fra prosjektets assets — ingen
 * flate gradient-flater. Én av variantene har KUN hero-video som bakgrunn.
 * Publiserte sider er IKKE endret.
 */

interface Props {
  isChatOpen: boolean;
}

/* ─── Diskret kornstruktur som legges over bilder for varme og dybde ─── */
const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

const grainOverlay: React.CSSProperties = {
  backgroundImage: GRAIN_URL,
  mixBlendMode: "overlay",
  opacity: 0.35,
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
    } ${tone === "light" ? "text-white/75" : "text-foreground/60"}`}
  >
    <Link
      to="/"
      className={tone === "light" ? "hover:text-white" : "hover:text-foreground"}
    >
      Hjem
    </Link>
    <span aria-hidden="true">›</span>
    <span className={tone === "light" ? "text-white/95" : "text-foreground/80"}>
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

/* ─── Innhold per fagområde (ekte eksempel-innhold) ─── */

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

/* ─── Gjenbrukbare bilde/overlay-elementer ─── */

type ScrimDirection = "left" | "right" | "center" | "bottom" | "none";

const scrimClass = (dir: ScrimDirection) => {
  switch (dir) {
    case "left":
      // Sterk dybde bak venstrestilt tekst, letter mot høyre for å la bildet puste
      return "bg-[linear-gradient(90deg,hsl(20_40%_10%/0.78)_0%,hsl(20_40%_10%/0.55)_35%,hsl(20_40%_10%/0.15)_75%,transparent_100%)]";
    case "right":
      return "bg-[linear-gradient(270deg,hsl(20_40%_10%/0.78)_0%,hsl(20_40%_10%/0.55)_35%,hsl(20_40%_10%/0.15)_75%,transparent_100%)]";
    case "center":
      return "bg-[radial-gradient(ellipse_at_center,hsl(20_40%_10%/0.7)_0%,hsl(20_40%_10%/0.45)_45%,hsl(20_40%_10%/0.25)_75%,transparent_100%)]";
    case "bottom":
      return "bg-[linear-gradient(0deg,hsl(20_40%_10%/0.78)_0%,hsl(20_40%_10%/0.45)_45%,transparent_100%)]";
    case "none":
    default:
      return "";
  }
};

const ImagePanel = ({
  src,
  alt,
  scrim = "left",
  baseTint = "warm",
}: {
  src: string;
  alt: string;
  scrim?: ScrimDirection;
  /** Grunntone som legges over hele bildet for varme + basis-kontrast */
  baseTint?: "warm" | "soft" | "deep";
}) => {
  const baseClass =
    baseTint === "soft"
      ? "bg-[linear-gradient(135deg,hsl(20_35%_15%/0.28),hsl(18_45%_18%/0.35))]"
      : baseTint === "deep"
        ? "bg-[linear-gradient(135deg,hsl(20_45%_12%/0.55),hsl(18_50%_15%/0.6))]"
        : "bg-[linear-gradient(135deg,hsl(20_40%_14%/0.4),hsl(18_50%_18%/0.5))]";
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Varm grunntone — sikrer WCAG-kontrast før den retningsstyrte scrimen */}
      <div aria-hidden="true" className={`absolute inset-0 ${baseClass}`} />
      {/* Retningsstyrt scrim bak tekst-området */}
      {scrim !== "none" && (
        <div aria-hidden="true" className={`absolute inset-0 ${scrimClass(scrim)}`} />
      )}
      {/* Diskret korn for merkevare-følelse */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
    </>
  );
};

/* ─── Variant 1 — Split: skin-tone merkevare-panel med tekst + kategori-bilde ─── */
const Variant1SplitImage = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div className="relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div className="relative flex items-center px-6 md:px-10 lg:px-16 py-16 lg:py-24 text-white overflow-hidden">
        <ImagePanel src={skinTextureHero} alt="Varm hudtone" scrim="left" baseTint="warm" />
        <div className="relative z-10 w-full">
          <HeroCopy c={c} tone="light" />
        </div>
      </div>
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={c.image}
          alt={c.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

/* ─── Variant 2 — Full-bleed hudtonet merkevare-bilde med tekst oppå ─── */
const Variant2FullBleed = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[560px] lg:min-h-[640px] flex items-center">
    <ImagePanel src={blurSkinAsset.url} alt="Varm hudtone" scrim="left" baseTint="warm" />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 w-full">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 3 — Sentrert hero med varm hudtone-bakgrunn ─── */
const Variant3Centered = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[620px] flex items-center justify-center">
    <ImagePanel src={cmedicalSkinTexture} alt="" scrim="center" baseTint="warm" />
    <div className="relative z-10 py-24 lg:py-32 w-full">
      <div className="px-6 md:px-10 max-w-2xl w-full mx-auto">
        <HeroCopy c={c} tone="light" align="center" />
      </div>
    </div>
  </header>
);

/* ─── Variant 4 — Asymmetrisk: stort kategori-bilde + hudtone-panel med tekst ─── */
const Variant4Asymmetric = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-[1.35fr_1fr] lg:min-h-[640px]">
      <div className="relative min-h-[420px] lg:min-h-full">
        <img
          src={c.image}
          alt={c.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="relative flex items-center px-6 md:px-10 lg:px-14 py-16 lg:py-24 text-white overflow-hidden">
        <ImagePanel src={skinTextureHero} alt="Varm hudtone" scrim="left" baseTint="deep" />
        <div className="relative z-10 w-full">
          <HeroCopy c={c} tone="light" />
        </div>
      </div>
    </div>
  </header>
);

/* ─── Variant 5 — KUN video i bakgrunnen, tekst oppå ─── */
const Variant5VideoOnly = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[620px] lg:min-h-[680px] flex items-center">
    <video
      src={fertilitetHeroVideo.url}
      poster={c.image}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Varm grunntone for kontrast også når videoen er lys */}
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(135deg,hsl(20_45%_12%/0.55),hsl(18_55%_18%/0.55))]"
    />
    {/* Sterkere scrim bak tekst */}
    <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("left")}`} />
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 w-full">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 6 — Ren og minimal: kategori-bilde med varm scrim bak tekst ─── */
const Variant6Minimal = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[520px] lg:min-h-[560px] flex items-center">
    <ImagePanel src={c.image} alt={c.imageAlt} scrim="left" baseTint="soft" />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-24 w-full">
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
        Seks forskjellige innganger for kategori-hero (Fagområde-malen),
        stablet under hverandre. Alle bruker REELLE merkevare-bilder eller
        -video fra prosjektets assets — samme tokens, typografi, avrundede
        kanter og USP-stil som resten av siden. Én variant er hero med kun
        video i bakgrunnen. Innholdet er ekte eksempler fra Gynekologi,
        Fertilitet og Urologi.
      </p>
    </div>

    <VariantSection
      n={1}
      title="Split med merkevare-bilde-panel"
      note="Ekte klinikk-/merkevare-bilde bak teksten på én side, kategori-bilde på andre. Rolig og varm."
    >
      <Variant1SplitImage c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={2}
      title="Full-bleed merkevare-bilde med tekst oppå"
      note="Ett stort ekte hero-bilde dekker hele hero, med tekst plassert over. Sterk merkevare-følelse."
    >
      <Variant2FullBleed c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={3}
      title="Sentrert hero — varm skin-blur som bakgrunn"
      note="Sentrert tekst mot den samme varme, blurrede skin-bakgrunnen som brukes i trust-seksjonen. Redaksjonell og fokusert."
    >
      <Variant3Centered c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={4}
      title="Asymmetrisk — stort bilde + merkevare-panel"
      note="Stort kategori-bilde til venstre, smalere merkevare-bilde-panel med tekst til høyre. Redaksjonell balanse."
    >
      <Variant4Asymmetric c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={5}
      title="KUN video i bakgrunnen"
      note="Gjenbruker eksisterende hero-video som fullflate-bakgrunn med tekst oppå. Levende og filmatisk."
    >
      <Variant5VideoOnly c={gynekologi} />
    </VariantSection>

    <VariantSection
      n={6}
      title="Ren og minimal — kategori-bilde med lett overlay"
      note="Roligste varianten: bare kategori-bildet og en lett overlay for lesbarhet. Lar bildet bære det visuelle."
    >
      <Variant6Minimal c={gynekologi} />
    </VariantSection>
  </div>
);

export default FagomradeHeroVarianter;
