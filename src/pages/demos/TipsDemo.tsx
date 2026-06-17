import { Link } from "react-router-dom";
import { ArrowRight, Play, Mic, FileText, BarChart3, Clock } from "lucide-react";
import gynecologyHero from "@/assets/hero/gynecology-hero.jpg";
import fertilityHero from "@/assets/hero/fertility-hero.jpg";
import clinicHero from "@/assets/hero/cmedical-clinic.jpg";
import familyHero from "@/assets/hero/hero-family.jpg";

/**
 * Tips / "Vill du veta mer?" – demo av tre seksjons-varianter.
 * Sanity-editor velger variant + legger inn items (manuelt eller via
 * referanse til artikkel/podcast/video-dokument).
 *
 * Brukes på: spesialistside, temaside, artikkelside, fagområdeside,
 * underbehandlingsside.
 */

type Format = "video" | "podcast" | "article" | "stats";

const FORMAT_META: Record<Format, { label: string; Icon: typeof Play }> = {
  video: { label: "Video", Icon: Play },
  podcast: { label: "Podcast", Icon: Mic },
  article: { label: "Artikkel", Icon: FileText },
  stats: { label: "Statistikk", Icon: BarChart3 },
};

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT A — Kort-grid (4 kort, thumbnail + format-ikon-overlay)
// ─────────────────────────────────────────────────────────────────────────────

type CardItem = {
  format: Format;
  meta: string;
  title: string;
  source: string;
  image: string;
  href: string;
};

const CARD_ITEMS: CardItem[] = [
  {
    format: "video",
    meta: "Video · 12 min",
    title: "Hva skjer i kroppen under overgangsalder?",
    source: "Dr. Lene Holm, gynekolog",
    image: gynecologyHero,
    href: "#",
  },
  {
    format: "podcast",
    meta: "Podcast · 34 min",
    title: "Hormoner, humør og hverdagsliv",
    source: "CMedical Podkast, ep. 7",
    image: fertilityHero,
    href: "#",
  },
  {
    format: "article",
    meta: "Artikkel · 5 min",
    title: "Endometriose – tegn du ikke bør ignorere",
    source: "CMedical Helseguide",
    image: clinicHero,
    href: "#",
  },
  {
    format: "stats",
    meta: "Statistikk · Rapport",
    title: "Norske kvinner og helsesystemet 2024",
    source: "CMedical Forskningsrapport",
    image: familyHero,
    href: "#",
  },
];

const TipsCardsVariant = () => (
  <section className="bg-brand-light py-20 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-10 md:mb-14">
          Vill du veta mer?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CARD_ITEMS.map((item, i) => {
            const { Icon, label } = FORMAT_META[item.format];
            const dark = item.format === "podcast";
            return (
              <Link
                key={i}
                to={item.href}
                className="group flex flex-col rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div
                  className={`relative aspect-[4/3] flex items-center justify-center ${
                    dark ? "bg-brand-dark" : "bg-background"
                  }`}
                >
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="relative z-10 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-brand-dark"
                      strokeWidth={1.5}
                      fill={item.format === "video" ? "currentColor" : "none"}
                    />
                  </div>
                  <span
                    className={`absolute bottom-3 left-3 text-xs font-light ${
                      dark ? "text-brand-light/80" : "text-foreground/70"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                <div className="bg-background p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-normal text-foreground leading-snug mb-2 group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-xs font-light text-foreground/60 mt-auto">
                    {item.source}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT B — Stor "tjeneste"-stil (bilde + tekst, play-overlay)
// ─────────────────────────────────────────────────────────────────────────────

type FeatureItem = {
  format: Format;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  href: string;
  cta: string;
};

const FEATURE_ITEMS: FeatureItem[] = [
  {
    format: "podcast",
    eyebrow: "Podcast i denne saken",
    title: "Hormoner, humør og hverdagsliv",
    description:
      "Spesialist Lene Holm snakker om hva som skjer i kroppen under overgangsalder, og hva som faktisk hjelper.",
    bullets: ["34 min", "CMedical Podkast, ep. 7", "Spotify, Apple Podcasts"],
    image: gynecologyHero,
    href: "#",
    cta: "Hør hele episoden",
  },
  {
    format: "video",
    eyebrow: "Video i denne saken",
    title: "Slik forbereder du deg til en gynekologisk undersøkelse",
    description:
      "En kort film hvor spesialisten forklarer steg for steg hva som skjer — slik at du vet hva du kan forvente.",
    bullets: ["8 min", "Spilt inn i Sandvika 2025", "Tekstet på norsk"],
    image: clinicHero,
    href: "#",
    cta: "Se filmen",
  },
];

const TipsFeatureVariant = () => (
  <section className="bg-brand-light py-20 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-10 md:mb-14">
          Vill du veta mer?
        </h2>
        <div className="divide-y divide-foreground/10">
          {FEATURE_ITEMS.map((item, i) => {
            const { Icon } = FORMAT_META[item.format];
            return (
              <div
                key={i}
                className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center py-10 md:py-14 first:pt-0 last:pb-0"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-foreground leading-[1.15] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-base font-light text-foreground/80 leading-relaxed mb-5 max-w-md">
                    {item.description}
                  </p>
                  <ul className="space-y-1.5 mb-7">
                    {item.bullets.map((b) => (
                      <li key={b} className="text-sm font-light text-foreground/70">
                        · {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-2 text-sm font-normal text-foreground border-b border-foreground pb-1 hover:gap-3 transition-all"
                  >
                    {item.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <Link to={item.href} className="group relative block aspect-[4/3] overflow-hidden rounded-sm">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/90 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon
                        className="w-7 h-7 text-brand-dark"
                        strokeWidth={1.5}
                        fill={item.format === "video" ? "currentColor" : "none"}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT C — Kompakt lenkeliste (2-kolonners, ikon-bokser)
// ─────────────────────────────────────────────────────────────────────────────

type CompactItem = {
  format: Format;
  title: string;
  description: string;
  href: string;
};

const COMPACT_ITEMS: CompactItem[] = [
  {
    format: "podcast",
    title: "Hormoner, humør og hverdagsliv",
    description: "CMedical Podkast, ep. 7 — 34 min med Dr. Lene Holm.",
    href: "#",
  },
  {
    format: "video",
    title: "Hva skjer i kroppen under overgangsalder?",
    description: "12 min film med spesialist Lene Holm.",
    href: "#",
  },
  {
    format: "article",
    title: "Endometriose – tegn du ikke bør ignorere",
    description: "5 min lesetid i CMedical Helseguide.",
    href: "#",
  },
  {
    format: "stats",
    title: "Norske kvinner og helsesystemet 2024",
    description: "Forskningsrapport om tilgang og ventetid.",
    href: "#",
  },
];

const TipsCompactVariant = () => (
  <section className="bg-brand-light py-20 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-10 md:mb-14">
          Vill du veta mer?
        </h2>
        <div className="grid sm:grid-cols-2 gap-px bg-foreground/10 rounded-sm overflow-hidden">
          {COMPACT_ITEMS.map((item, i) => {
            const { Icon, label } = FORMAT_META[item.format];
            return (
              <Link
                key={i}
                to={item.href}
                className="group bg-background p-5 md:p-6 flex items-start gap-4 hover:bg-background/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Icon
                    className="w-5 h-5 text-brand-dark"
                    strokeWidth={1.5}
                    fill={item.format === "video" ? "currentColor" : "none"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-normal text-foreground mb-1 group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-foreground/65 leading-snug">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/40 mt-2 shrink-0 group-hover:text-foreground transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT D — Editorial split (1 stor + 3 små i sidekolonne)
// ─────────────────────────────────────────────────────────────────────────────

const TipsEditorialVariant = () => {
  const [lead, ...rest] = CARD_ITEMS;
  const { Icon: LeadIcon, label: leadLabel } = FORMAT_META[lead.format];
  return (
    <section className="bg-brand-light py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14 gap-6">
            <h2 className="text-3xl md:text-5xl font-light text-foreground">
              Vill du veta mer?
            </h2>
            <Link to="/aktuelt" className="text-sm font-light text-foreground/70 hover:text-foreground inline-flex items-center gap-1 shrink-0">
              Se alt i Aktuelt <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
            <Link to={lead.href} className="group lg:col-span-7 block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4">
                <img src={lead.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-brand-light/95 px-3 py-1.5 rounded-full text-xs font-light text-foreground">
                  <LeadIcon className="w-3.5 h-3.5" strokeWidth={1.5} fill={lead.format === "video" ? "currentColor" : "none"} />
                  {leadLabel}
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-foreground leading-[1.15] mb-2 group-hover:underline">
                {lead.title}
              </h3>
              <p className="text-sm font-light text-foreground/65">{lead.source}</p>
            </Link>
            <div className="lg:col-span-5 flex flex-col divide-y divide-foreground/10">
              {rest.map((item, i) => {
                const { Icon, label } = FORMAT_META[item.format];
                return (
                  <Link key={i} to={item.href} className="group py-5 first:pt-0 last:pb-0 flex gap-4 items-start">
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm bg-background">
                      <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1.5 text-xs font-light text-foreground/55 mb-1.5">
                        <Icon className="w-3 h-3" strokeWidth={1.5} fill={item.format === "video" ? "currentColor" : "none"} />
                        {label}
                      </div>
                      <h3 className="text-sm font-normal text-foreground leading-snug mb-1 group-hover:underline">
                        {item.title}
                      </h3>
                      <p className="text-xs font-light text-foreground/55 line-clamp-1">{item.source}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT E — Horisontal scroller (skannbar tidslinje)
// ─────────────────────────────────────────────────────────────────────────────

const TipsScrollerVariant = () => (
  <section className="bg-brand-dark py-20 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-brand-light">
              Vill du veta mer?
            </h2>
          </div>
          <Link to="/aktuelt" className="text-sm font-light text-brand-light/70 hover:text-brand-light inline-flex items-center gap-1 shrink-0">
            Se alt <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="-mx-6 md:-mx-16 px-6 md:px-16 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 md:gap-5 min-w-max pb-2">
          {[...CARD_ITEMS, ...CARD_ITEMS].map((item, i) => {
            const { Icon, label } = FORMAT_META[item.format];
            return (
              <Link key={i} to={item.href} className="group w-[280px] md:w-[320px] shrink-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-3">
                  <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-brand-light/95 px-2.5 py-1 rounded-full text-xs font-light text-foreground">
                    <Icon className="w-3 h-3" strokeWidth={1.5} fill={item.format === "video" ? "currentColor" : "none"} />
                    {label}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm md:text-base font-normal text-brand-light leading-snug line-clamp-3">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs font-light text-brand-light/55">{item.meta}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT F — Tidslinje-liste (datert, redaksjonell)
// ─────────────────────────────────────────────────────────────────────────────

type TimelineItem = CompactItem & { date: string; readTime: string };

const TIMELINE_ITEMS: TimelineItem[] = [
  { format: "article", date: "28. mai 2026", readTime: "5 min", title: "Endometriose – tegn du ikke bør ignorere", description: "Hva forskningen sier i 2026, og når du bør oppsøke spesialist.", href: "#" },
  { format: "podcast", date: "21. mai 2026", readTime: "34 min", title: "Hormoner, humør og hverdagsliv", description: "Dr. Lene Holm om overgangsalder — episode 7 av CMedical Podkast.", href: "#" },
  { format: "video", date: "14. mai 2026", readTime: "12 min", title: "Hva skjer i kroppen under overgangsalder?", description: "Kort, klinisk forklart av spesialist i gynekologi.", href: "#" },
  { format: "stats", date: "02. mai 2026", readTime: "Rapport", title: "Norske kvinner og helsesystemet 2024", description: "CMedical Forskningsrapport om tilgang, ventetid og opplevd kvalitet.", href: "#" },
];

const TipsTimelineVariant = () => (
  <section className="bg-brand-light py-20 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-10 md:mb-14">
          Vill du veta mer?
        </h2>
        <ol className="relative border-l border-foreground/15">
          {TIMELINE_ITEMS.map((item, i) => {
            const { Icon, label } = FORMAT_META[item.format];
            return (
              <li key={i} className="pl-8 pb-10 last:pb-0 relative">
                <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-brand-light border border-foreground/20 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-foreground" strokeWidth={1.5} fill={item.format === "video" ? "currentColor" : "none"} />
                </span>
                <div className="flex items-center gap-3 text-xs font-light text-foreground/55 mb-2">
                  <span>{item.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{label}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.readTime}</span>
                </div>
                <Link to={item.href} className="group block">
                  <h3 className="text-lg md:text-xl font-normal text-foreground leading-snug mb-1.5 group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Side
// ─────────────────────────────────────────────────────────────────────────────



const VariantBlock = ({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="bg-background border-y border-foreground/10">
      <div className="container mx-auto px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-normal text-foreground mb-2">
            {title}
          </h2>
          <p className="text-sm font-light text-foreground/70 max-w-2xl">
            {description}
          </p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export default function TipsDemo() {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* Demo-banner */}
      <div className="bg-brand-dark text-brand-light sticky top-0 z-50">
        <div className="container mx-auto px-6 md:px-16 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-light min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-light/10 text-xs shrink-0">
              Seksjons-demo
            </span>
            <span className="truncate">
              "Vill du veta mer?" / Tips — 3 varianter
            </span>
          </div>
          <Link
            to="/godkjenning"
            className="text-xs font-light hover:underline shrink-0"
          >
            ← Tilbake
          </Link>
        </div>
      </div>

      {/* Intro */}
      <div className="container mx-auto px-6 md:px-16 py-14 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] mb-5">
            Tips til relatert innhold
          </h1>
          <p className="text-base font-light text-foreground/80 leading-relaxed mb-4">
            En gjenbrukbar seksjon for å tipse om podcaster, videoer, artikler
            og rapporter spesialisten eller klinikken har medvirket i.
            Seksjonen kan plugges inn på spesialistside, temaside, artikkelside,
            fagområdeside og underbehandlingsside.
          </p>
          <p className="text-sm font-light text-foreground/65">
            Under ser du seks varianter — samme datamodell, ulik visning.
            Editor velger variant i Sanity.
          </p>
        </div>
      </div>

      <VariantBlock
        label="A"
        title="Kort-grid (4 kort)"
        description="Thumbnail med format-ikon, kort meta-tekst og tittel. Best for å vise 4–8 tips med visuell tyngde."
      >
        <TipsCardsVariant />
      </VariantBlock>

      <VariantBlock
        label="B"
        title="Stor stil med bilde og play-overlay"
        description="Bilde + tekst i to kolonner, med tydelig format-ikon over bildet. Best for 1–3 fremhevede tips."
      >
        <TipsFeatureVariant />
      </VariantBlock>

      <VariantBlock
        label="C"
        title="Kompakt lenkeliste"
        description="Tett 2-kolonners liste med ikon-boks og kort beskrivelse. Best når tipsene er mange og skal være lett å skanne."
      >
        <TipsCompactVariant />
      </VariantBlock>

      <VariantBlock
        label="D"
        title="Editorial split (1 stor + 3 små)"
        description="Redaksjonell layout som prioriterer ett hovedtips og lister de neste tre ved siden av. Best på spesialist- og temasider hvor ett innhold er klart viktigst."
      >
        <TipsEditorialVariant />
      </VariantBlock>

      <VariantBlock
        label="E"
        title="Horisontal scroller (mørk seksjon)"
        description="Skannbar karusell med overlay-titler på mørk bakgrunn. Best når det finnes mange tips og seksjonen ligger mellom to lyse seksjoner — gir visuelt pust."
      >
        <TipsScrollerVariant />
      </VariantBlock>

      <VariantBlock
        label="F"
        title="Tidslinje-liste (datert)"
        description="Vertikal tidslinje med dato, format og lesetid. Best på 'siste fra Aktuelt' og blogg/oversiktsbruk hvor kronologi betyr noe."
      >
        <TipsTimelineVariant />
      </VariantBlock>
    </div>
  );
}
