import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";

interface Specialist {
  category: string;
  title?: string;
  subtitle?: string;
  expertise?: string[];
}

interface Props {
  /** Category slug to filter on. Omit/'alle' to show everyone. */
  category?: string;
  /** Custom predicate. Overrides `category` when provided. */
  filter?: (s: Specialist) => boolean;
  /** Fallback category used when `filter`/`category` returns no matches.
   *  Useful when a per-page whitelist of slugs doesn't match the active
   *  data source — we still want the section to render. */
  fallbackCategory?: string;
  title?: string;
  description?: string;
  /** Link target for "Se alle". */
  seeAllHref?: string;
  seeAllLabel?: string;
}

/**
 * Unified specialists scroller. Matches the home SpecialistsSection layout
 * exactly (clinic tag top-left, name + role overlaid on image, expertise
 * line under each card, identical header + arrow controls + see-all button)
 * so every page renders specialists in the same way.
 */
export const SpecialistsScroller = ({
  category,
  filter,
  fallbackCategory,
  title = "Møt våre spesialister",
  description = "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
  seeAllHref = "/spesialister",
  seeAllLabel,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();

  const filtered = useMemo(() => {
    let result = specialists;
    if (filter) result = specialists.filter(filter);
    else if (category && category !== "alle") result = specialists.filter((s) => s.category === category);
    if (result.length === 0 && fallbackCategory && fallbackCategory !== "alle") {
      result = specialists.filter((s) => s.category === fallbackCategory);
    }
    return result;
  }, [specialists, category, filter, fallbackCategory]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (filtered.length === 0) return null;

  const computedSeeAllLabel = seeAllLabel ?? `Se alle ${filtered.length} spesialister`;
  const showSeeAllButton = filtered.length > 1;
  const useScroller = filtered.length >= 4;

  const gridClass =
    filtered.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto";

  return (
    <section className="pt-14 md:pt-20 pb-10 md:pb-14 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header — identical to home */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground font-light">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {useScroller && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  aria-label="Scroll venstre"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  aria-label="Scroll høyre"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            {showSeeAllButton && (
              <Button variant="cta-outline" asChild>
                <Link to={seeAllHref}>
                  {computedSeeAllLabel}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 1 ? (
        <div className="container mx-auto px-6 md:px-16">
          <SpecialistFeature sp={filtered[0]} />
        </div>
      ) : useScroller ? (
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filtered.map((sp) => (
            <div key={sp.slug} className="flex-shrink-0 w-[280px] snap-start">
              <SpecialistCard sp={sp} />
            </div>
          ))}
          <Link
            to={seeAllHref}
            className="flex-shrink-0 w-[280px] snap-start"
            aria-label={computedSeeAllLabel}
          >
            <div className="aspect-[3/4] bg-secondary border border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
              <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-foreground font-normal mb-1">Se alle</p>
              <p className="text-muted-foreground text-sm font-light">{filtered.length} spesialister</p>
            </div>
          </Link>
        </div>

      ) : (
        <div className="container mx-auto px-6 md:px-16">
          <div className={`grid gap-6 ${gridClass}`}>
            {filtered.map((sp) => (
              <SpecialistCard key={sp.slug} sp={sp} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/** Editorial split layout when there is exactly one specialist for a service. */
const SpecialistFeature = ({ sp }: { sp: any }) => {
  const shortBio = sp.bio
    ? sp.bio.split("\n\n")[0].slice(0, 280)
    : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
      <Link
        to={`/spesialister/${sp.slug}`}
        aria-label={`Les mer om ${sp.name}`}
        className="group md:col-span-5 md:col-start-1 block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={sp.image}
            alt={sp.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {sp.clinics && sp.clinics.length > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 text-white/90 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              {sp.clinics.join(" · ")}
            </div>
          )}
        </div>
      </Link>

      <div className="md:col-span-6 md:col-start-7 flex flex-col justify-between border-t border-brand-dark/15 pt-8 md:pt-0 md:border-t-0">
          <div>
          <h3 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] mb-4">
            {sp.name}
          </h3>
          <p className="text-base md:text-lg text-muted-foreground font-light mb-6 max-w-md">
            {sp.title}
            {sp.subtitle && sp.subtitle !== sp.title && ` · ${sp.subtitle}`}
          </p>

          {shortBio && (
            <p className="text-sm font-light text-foreground/80 mb-8 max-w-md leading-relaxed">
              {shortBio}
              {sp.bio.length > 280 && " …"}
            </p>
          )}

          {sp.expertise && sp.expertise.length > 0 && (
            <div className="border-t border-brand-dark/15">
              <ul className="divide-y divide-brand-dark/10">
                {sp.expertise.slice(0, 6).map((item: string) => (
                  <li
                    key={item}
                    className="py-3 text-sm font-light text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10">
          <Button variant="cta" asChild>
            <Link to="/booking">
              Finn ledig tid hos {sp.name.split(" ")[0]}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

/** Card used in the static grid (few specialists). Mirrors the scroller card. */
const SpecialistCard = ({ sp }: { sp: any }) => (
  <Link
    to={`/spesialister/${sp.slug}`}
    aria-label={`Les mer om ${sp.name}`}
    className="group block"
  >
    <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-secondary">
      <img
        src={sp.image}
        alt={sp.name}
        loading="lazy"
        className="w-full h-full object-cover saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

      {sp.clinics && sp.clinics.length > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1 text-white/70 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          {sp.clinics.join(" · ")}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-normal text-white mb-0.5">{sp.name}</h3>
        <p className="text-sm text-white/70 font-light">
          {sp.title}
          {sp.subtitle && sp.subtitle !== sp.title && ` · ${sp.subtitle}`}
        </p>
      </div>
    </div>

    {sp.expertise && sp.expertise.length > 0 && (
      <p className="text-sm text-muted-foreground font-normal pl-1 pr-6">
        {sp.expertise.join(", ")}
      </p>
    )}
  </Link>
);
