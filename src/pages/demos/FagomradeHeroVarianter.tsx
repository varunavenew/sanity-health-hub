import { Link } from "react-router-dom";
import { Check, Clock, Users, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { getCategoryEntryPrice } from "@/data/priceList";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import urologiImg from "@/assets/categories/urologi-real.jpg";
import cmedicalSkinTexture from "@/assets/hero/cmedical-skin-texture.jpg";
import skinTextureHero from "@/assets/hero/skin-texture-hero.webp";
import cmedicalFamily from "@/assets/hero/cmedical-family.jpg";
import cmedicalFamilyHands from "@/assets/hero/cmedical-family-hands.jpg";
import cmedicalHands from "@/assets/hero/cmedical-hands.jpg";
import cmedicalHero3 from "@/assets/hero/cmedical-hero-3.jpg";
import blurSkinAsset from "@/assets/blur-skin-mid.jpg.asset.json";
import fertilitetHeroVideo from "@/assets/fertilitet-hero.mp4.asset.json";

/**
 * Demo-visning under «Maler»: 10 hero-varianter for HOVEDFAGOMRÅDE-siden
 * (kategori-hero, f.eks. Gynekologi/Fertilitet/Urologi). Alle varianter
 * bruker reelle merkevare-bilder eller -video og har subtil mørk scrim
 * bak tekst for tydelig lesbarhet. Publiserte sider er IKKE endret.
 */

interface Props {
  isChatOpen: boolean;
}

/* ─── Kornstruktur som tokens ─── */
const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0 0.15 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

const grainOverlay: React.CSSProperties = {
  backgroundImage: GRAIN_URL,
  mixBlendMode: "overlay",
  opacity: 0.35,
};

const grainPanel: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(120% 90% at 15% 20%, hsl(14 78% 68% / 0.85), transparent 60%), radial-gradient(90% 80% at 90% 85%, hsl(28 82% 62% / 0.9), transparent 65%), linear-gradient(135deg, hsl(18 70% 58%) 0%, hsl(22 65% 48%) 55%, hsl(24 45% 28%) 100%)`,
  backgroundBlendMode: "overlay, normal, normal, normal",
};

const grainFullBlock: React.CSSProperties = {
  backgroundImage: `${GRAIN_URL}, radial-gradient(80% 70% at 20% 30%, hsl(20 90% 72% / 0.9), transparent 60%), radial-gradient(70% 80% at 85% 75%, hsl(12 70% 45% / 0.85), transparent 60%), linear-gradient(120deg, hsl(22 75% 55%) 0%, hsl(18 60% 38%) 60%, hsl(24 40% 22%) 100%)`,
  backgroundBlendMode: "overlay, normal, normal, normal",
};

/* ─── Delte typer ─── */

interface CategoryHeroContent {
  breadcrumb: string;
  title: string;
  titleItalic: string;
  description: string;
  categoryId: string;
  image: string;
  imageAlt: string;
}

/* ─── Delte hero-elementer ─── */

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
    <Link to="/" className={tone === "light" ? "hover:text-white" : "hover:text-foreground"}>
      Hjem
    </Link>
    <span aria-hidden="true">›</span>
    <span className={tone === "light" ? "text-white/95" : "text-foreground/80"}>{label}</span>
  </nav>
);

const HeroCopy = ({
  c,
  tone,
  align = "left",
  titleSize = "default",
}: {
  c: CategoryHeroContent;
  tone: "dark" | "light";
  align?: "left" | "center";
  titleSize?: "default" | "huge";
}) => {
  const entry = getCategoryEntryPrice(c.categoryId);
  const isLight = tone === "light";
  const centered = align === "center";
  const titleClass =
    titleSize === "huge"
      ? "text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95]"
      : "text-4xl md:text-5xl lg:text-6xl leading-[1.05]";
  return (
    <div className={`max-w-xl w-full relative ${centered ? "mx-auto text-center" : ""}`}>
      <HeroBreadcrumb label={c.breadcrumb} tone={tone} align={align} />
      <h2 className={`${titleClass} font-light mb-8 ${isLight ? "text-white" : "text-foreground"}`}>
        {c.title} <span className="block italic">{c.titleItalic}</span>
      </h2>
      <p
        className={`text-base md:text-lg font-light leading-relaxed mb-10 ${
          isLight ? "text-white/90" : "text-muted-foreground"
        } ${centered ? "mx-auto" : ""}`}
      >
        {c.description}
      </p>
      {entry && (
        <div className={`mb-4 text-sm font-light ${isLight ? "text-white/85" : "text-foreground/80"}`}>
          <span className={`block text-base ${isLight ? "text-white" : "text-foreground"}`}>
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
          onClick={() => (window.location.href = buildBookingUrl({ kategori: c.categoryId }))}
        >
          Bestill time
        </Button>
        <CallUsClinicPicker variant={isLight ? "dark" : "light"} label="Ring oss" />
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

/* ─── Gjenbrukbare scrim-elementer ─── */

type ScrimDirection = "left" | "right" | "center" | "bottom" | "none";

const scrimClass = (dir: ScrimDirection) => {
  switch (dir) {
    case "left":
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
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div aria-hidden="true" className={`absolute inset-0 ${baseClass}`} />
      {scrim !== "none" && (
        <div aria-hidden="true" className={`absolute inset-0 ${scrimClass(scrim)}`} />
      )}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
    </>
  );
};

/* ─── Variant 1 — Varm split med kornet gradient-panel ─── */
const V1SplitGrain = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div className="relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[640px]">
      <div
        className="relative flex items-center px-6 md:px-10 lg:px-16 py-16 lg:py-24 text-white overflow-hidden"
        style={grainPanel}
      >
        <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("left")}`} />
        <div className="relative z-10 w-full">
          <HeroCopy c={c} tone="light" />
        </div>
      </div>
      <div className="relative min-h-[420px] lg:min-h-full">
        <img src={c.image} alt={c.imageAlt} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

/* ─── Variant 2 — Full-bleed hudtonet bilde med mørk overlay ─── */
const V2FullBleed = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[560px] lg:min-h-[640px] flex items-center">
    <ImagePanel src={blurSkinAsset.url} alt="Varm hudtone" scrim="left" baseTint="warm" />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 w-full">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 3 — KUN video i bakgrunn med tekst oppå ─── */
const V3VideoOnly = ({ c }: { c: CategoryHeroContent }) => (
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
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(135deg,hsl(20_45%_12%/0.55),hsl(18_55%_18%/0.55))]"
    />
    <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("left")}`} />
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 w-full">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 4 — Sentrert hero med stor kornet bakgrunn ─── */
const V4CenteredGrain = ({ c }: { c: CategoryHeroContent }) => (
  <header
    className="relative overflow-hidden text-white min-h-[620px] flex items-center justify-center"
    style={grainFullBlock}
  >
    <img
      src={cmedicalSkinTexture}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
    />
    <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("center")}`} />
    <div className="relative z-10 py-24 lg:py-32 w-full">
      <div className="px-6 md:px-10 max-w-2xl w-full mx-auto">
        <HeroCopy c={c} tone="light" align="center" />
      </div>
    </div>
  </header>
);

/* ─── Variant 5 — Asymmetrisk bilde + fargeblokk ─── */
const V5Asymmetric = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div className="relative z-20 flex flex-col-reverse lg:grid lg:grid-cols-[1.35fr_1fr] lg:min-h-[640px]">
      <div className="relative min-h-[420px] lg:min-h-full">
        <img src={c.image} alt={c.imageAlt} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div
        className="relative flex items-center px-6 md:px-10 lg:px-14 py-16 lg:py-24 text-white overflow-hidden"
        style={grainPanel}
      >
        <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("left")}`} />
        <div className="relative z-10 w-full">
          <HeroCopy c={c} tone="light" />
        </div>
      </div>
    </div>
  </header>
);

/* ─── Variant 6 — Redaksjonell / magasin med stor typografi ─── */
const V6Editorial = ({ c }: { c: CategoryHeroContent }) => {
  const entry = getCategoryEntryPrice(c.categoryId);
  return (
    <header className="relative bg-brand-light overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-end">
          <div>
            <p className="text-xs font-light text-foreground/60 mb-8 uppercase">
              Fagområde · {c.breadcrumb}
            </p>
            <h2 className="text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] font-light leading-[0.9] text-foreground mb-10">
              {c.title}
              <span className="block italic text-[hsl(18_65%_45%)]">{c.titleItalic}</span>
            </h2>
            <div className="max-w-md">
              <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
                {c.description}
              </p>
              {entry && (
                <div className="mb-6 pb-6 border-b border-foreground/15 text-sm font-light text-foreground/80">
                  <span className="block text-base text-foreground">{entry.label}</span>
                  <span className="block">{entry.price}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = buildBookingUrl({ kategori: c.categoryId }))}
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
                {["Ingen henvisning", "Korte ventetider"].map((u) => (
                  <li key={u} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
            <img src={c.image} alt={c.imageAlt} className="absolute inset-0 w-full h-full object-cover" />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={grainOverlay}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

/* ─── Variant 7 — Bilde med flytende stat/USP-badges ─── */
const V7FloatingBadges = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[620px] lg:min-h-[680px] flex items-center">
    <ImagePanel src={cmedicalFamily} alt="CMedical" scrim="left" baseTint="warm" />
    <div className="relative z-10 container mx-auto px-6 md:px-16 py-20 lg:py-28 w-full">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <HeroCopy c={c} tone="light" />
        <div className="hidden lg:flex flex-col gap-4 items-end">
          {[
            { icon: Star, label: "4,8 / 5", sub: "Google-vurdering" },
            { icon: Users, label: "60 000+", sub: "Pasientbesøk / år" },
            { icon: Clock, label: "Kort ventetid", sub: "Time innen få dager" },
            { icon: Award, label: "Erfarne", sub: "spesialister" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-3 bg-white/12 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-4 max-w-xs w-full"
            >
              <b.icon className="w-5 h-5 text-white shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-normal text-white">{b.label}</div>
                <div className="text-xs font-light text-white/75">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </header>
);

/* ─── Variant 8 — Duotone / monokrom varm tone ─── */
const V8Duotone = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative overflow-hidden text-white min-h-[560px] lg:min-h-[620px] flex items-center bg-[hsl(20_35%_15%)]">
    <img
      src={skinTextureHero}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 mix-blend-multiply bg-[linear-gradient(135deg,hsl(18_75%_45%/0.6),hsl(20_45%_20%/0.85))]"
    />
    <div aria-hidden="true" className={`absolute inset-0 ${scrimClass("left")}`} />
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
    <div className="relative z-10 px-6 md:px-10 lg:px-16 py-20 lg:py-28 w-full">
      <HeroCopy c={c} tone="light" />
    </div>
  </header>
);

/* ─── Variant 9 — Collage / grid av flere bilder ─── */
const V9Collage = ({ c }: { c: CategoryHeroContent }) => (
  <header className="relative bg-brand-light overflow-hidden">
    <div className="container mx-auto px-6 md:px-16 py-16 lg:py-20">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <HeroCopy c={c} tone="dark" />
        </div>
        <div className="grid grid-cols-6 grid-rows-6 gap-3 min-h-[440px] lg:min-h-[560px]">
          <div className="col-span-4 row-span-4 relative rounded-3xl overflow-hidden">
            <img src={c.image} alt={c.imageAlt} className="absolute inset-0 w-full h-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={grainOverlay} />
          </div>
          <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden">
            <img src={cmedicalFamilyHands} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden">
            <img src={cmedicalHands} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="col-span-3 row-span-2 relative rounded-3xl overflow-hidden">
            <img src={cmedicalHero3} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="col-span-3 row-span-2 relative rounded-3xl overflow-hidden">
            <img src={cmedicalSkinTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

/* ─── Variant 10 — Minimal typografisk, uten foto ─── */
const V10Typographic = ({ c }: { c: CategoryHeroContent }) => {
  const entry = getCategoryEntryPrice(c.categoryId);
  return (
    <header className="relative bg-brand-light overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 py-24 lg:py-32">
        <div className="max-w-4xl">
          <p className="text-xs font-light text-foreground/50 mb-10 uppercase">
            {c.breadcrumb}
          </p>
          <h2 className="text-6xl md:text-8xl lg:text-[9rem] xl:text-[10rem] font-light leading-[0.9] text-foreground mb-16">
            {c.title}
            <span className="block italic text-foreground/70">{c.titleItalic}</span>
          </h2>
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-end pt-10 border-t border-foreground/15">
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground max-w-lg">
              {c.description}
            </p>
            <div>
              {entry && (
                <div className="mb-6 text-sm font-light text-foreground/80">
                  <span className="block text-base text-foreground">{entry.label}</span>
                  <span className="block">{entry.price}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = buildBookingUrl({ kategori: c.categoryId }))}
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
                {["Ingen henvisning", "Korte ventetider"].map((u) => (
                  <li key={u} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

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
        Ti visuelt distinkte innganger for kategori-hero (Fagområde-malen),
        stablet under hverandre. Alle bruker reelle merkevare-bilder/-video
        og reell CMedical-data — samme tokens, typografi, avrundede kanter
        og USP-stil som resten av siden. Der teksten ligger over bilde er
        det lagt på en subtil mørk scrim for tydelig lesbarhet.
      </p>
    </div>

    <VariantSection n={1} title="Varm split med kornet gradient-panel" note="Ekte kategori-bilde til høyre, varmt kornet gradient-panel med tekst til venstre.">
      <V1SplitGrain c={gynekologi} />
    </VariantSection>

    <VariantSection n={2} title="Full-bleed hudtonet bilde med mørk overlay" note="Hudtonet merkevare-bilde dekker hele hero, mørk scrim bak tekst.">
      <V2FullBleed c={gynekologi} />
    </VariantSection>

    <VariantSection n={3} title="KUN video i bakgrunnen" note="Gjenbruker eksisterende hero-video som full-flate bakgrunn.">
      <V3VideoOnly c={gynekologi} />
    </VariantSection>

    <VariantSection n={4} title="Sentrert hero med stor kornet bakgrunn" note="Sentrert tekst mot varm kornet flate — rolig og fokusert.">
      <V4CenteredGrain c={gynekologi} />
    </VariantSection>

    <VariantSection n={5} title="Asymmetrisk bilde + fargeblokk" note="Stort kategori-bilde til venstre, smalere kornet fargeblokk med tekst til høyre.">
      <V5Asymmetric c={gynekologi} />
    </VariantSection>

    <VariantSection n={6} title="Redaksjonell / magasin, stor typografi" note="Magasinstil: overdimensjonert typografi + portrettbilde. Rolig og editorial.">
      <V6Editorial c={gynekologi} />
    </VariantSection>

    <VariantSection n={7} title="Bilde med flytende stat/USP-badges" note="Hudtonet bilde bak tekst, flytende badges viser tall og tillit ved siden av.">
      <V7FloatingBadges c={gynekologi} />
    </VariantSection>

    <VariantSection n={8} title="Duotone / monokrom varm tone" note="Bildet gjøres monokromt og fargelegges i varm brun/oransje merkevaretone.">
      <V8Duotone c={gynekologi} />
    </VariantSection>

    <VariantSection n={9} title="Collage / grid av flere bilder" note="Flere ekte merkevare-bilder satt sammen i asymmetrisk grid, tekst på lys side.">
      <V9Collage c={gynekologi} />
    </VariantSection>

    <VariantSection n={10} title="Minimal typografisk, uten foto" note="Kun typografi og tekst på lys bakgrunn — mest minimalistisk variant.">
      <V10Typographic c={gynekologi} />
    </VariantSection>
  </div>
);

export default FagomradeHeroVarianter;

// Marker uused imports for demo-flexibilitet (så andre kategorier kan tas i bruk senere)
void fertilitetImg;
void urologiImg;
