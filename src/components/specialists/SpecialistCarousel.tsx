import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";

export interface SpecialistLike {
  slug: string;
  name: string;
  image: string;
  title?: string;
  subtitle?: string;
  category?: string;
  clinics?: string[];
  expertise?: string[];
}

interface Props {
  /** Explicit list. When omitted, all specialists are used. */
  specialists?: SpecialistLike[];
  /** Category slug to filter on. Ignored when `specialists` is given. */
  category?: string;
  /** Custom predicate — overrides `category`. */
  filter?: (s: SpecialistLike) => boolean;
  /** Fallback category when the filter yields nothing. */
  fallbackCategory?: string;
  title?: string;
  description?: string;
  /** CTA link at the right of the navigation row. */
  seeAllHref?: string;
  seeAllLabel?: string;
  /** Section wrapper classes (background/padding). */
  className?: string;
  /** Render without the <section>/header wrapper. */
  bare?: boolean;
}

/**
 * SpecialistCarousel — ÉN felles spesialist-karusell for hele nettstedet.
 *
 * Kortdesign er identisk med forsidens spesialist-seksjon: bilde i 3/4,
 * klinikk-tag øverst til venstre, navn + rolle nederst på bildet.
 * Under karusellen ligger felles-navigasjonen til venstre og en CTA-lenke
 * til høyre på samme rad. Ingen «Sveip for å se flere»-tekst.
 *
 * Unntak: ved 1–3 spesialister vises et statisk grid (ingen scroll-rad).
 */
export const SpecialistCarousel = ({
  specialists: provided,
  category,
  filter,
  fallbackCategory,
  title = "Møt våre spesialister",
  description = "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
  seeAllHref = "/spesialister",
  seeAllLabel,
  className = "pt-10 md:pt-14 pb-14 md:pb-16 bg-secondary/30 overflow-hidden",
  bare = false,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const { sorted: allSpecialists } = useSpecialistsData();

  const items = useMemo(() => {
    if (provided) return provided as SpecialistLike[];
    let result = allSpecialists as SpecialistLike[];
    if (filter) result = result.filter(filter);
    else if (category && category !== "alle") result = result.filter((s) => s.category === category);
    if (result.length === 0 && fallbackCategory && fallbackCategory !== "alle") {
      result = (allSpecialists as SpecialistLike[]).filter((s) => s.category === fallbackCategory);
    }
    return result;
  }, [provided, allSpecialists, category, filter, fallbackCategory]);

  if (items.length === 0) return null;

  const ctaLabel = seeAllLabel ?? "Se alle spesialister";
  const isStatic = items.length <= 3;

  const ctaLink = (
    <Link
      to={seeAllHref}
      className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:opacity-70 transition-opacity"
    >
      {ctaLabel}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
  );

  const body = isStatic ? (
    <>
      <div className="page-shell">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((sp, i) => (
            <SpecialistCard
              key={sp.slug}
              sp={sp}
              hovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
      <div className="page-shell">
        <div className="carousel-nav flex items-center justify-end">{ctaLink}</div>
      </div>
    </>
  ) : (
    <>
      <div
        ref={scrollRef}
        className="flex gap-0 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory pl-[var(--gutter)]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((sp, i) => (
          <div key={sp.slug} className="flex-shrink-0 w-[260px] md:w-[300px] snap-start">
            <SpecialistCard
              sp={sp}
              hovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          </div>
        ))}
      </div>
      <ScrollArrows scrollRef={scrollRef} className="px-[var(--gutter)]" trailing={ctaLink} />
    </>
  );

  if (bare) return <>{body}</>;

  return (
    <section className={className}>
      {(title || description) && (
        <div className="page-shell">
          <div className="section-head max-w-xl">
            {title && (
              <h2 className="text-2xl md:text-3xl font-light text-foreground">{title}</h2>
            )}
            {description && (
              <p className="section-lead text-muted-foreground font-light">{description}</p>
            )}
          </div>
        </div>
      )}
      {body}
    </section>
  );
};

const SpecialistCard = ({
  sp,
  hovered,
  onEnter,
  onLeave,
}: {
  sp: SpecialistLike;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) => (
  <Link
    to={`/spesialister/${sp.slug}`}
    className="group block"
    aria-label={`Les mer om ${sp.name}`}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
      <img
        src={sp.image}
        alt={sp.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

      {sp.clinics && sp.clinics.length > 0 && (
        <div className="absolute top-4 left-4 flex items-center gap-1 text-white/80 text-sm font-light">
          <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {sp.clinics.join(" · ")}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-normal text-white text-lg leading-snug mb-0.5">{sp.name}</h3>
        <p className="text-sm text-white/70 font-light leading-snug">
          {sp.title}
          {sp.subtitle && sp.subtitle !== sp.title && ` · ${sp.subtitle}`}
        </p>
        <div
          className={`flex items-center gap-1.5 mt-3 text-sm font-light text-brand-yellow transition-all duration-500 ease-out ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span>Se profil</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      </div>
    </div>
  </Link>
);
