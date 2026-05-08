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
  eyebrow?: string;
  title?: string;
  /** Link target for "Se alle". */
  seeAllHref?: string;
  seeAllLabel?: string;
}

/**
 * Unified specialists scroller used on every fagområde-page.
 * Mirrors the homepage SpecialistsSection layout, but pre-filtered.
 */
export const SpecialistsScroller = ({
  category,
  filter,
  eyebrow = "Menneskene bak",
  title = "Spesialistene som følger deg.",
  seeAllHref = "/spesialister",
  seeAllLabel = "Se alle spesialister",
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();

  const filtered = useMemo(() => {
    if (filter) return specialists.filter(filter);
    if (!category || category === "alle") return specialists;
    return specialists.filter((s) => s.category === category);
  }, [specialists, category, filter]);


  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (filtered.length === 0) return null;

  return (
    <section className="pt-20 md:pt-28 pb-10 md:pb-14 bg-brand-warm overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-xl">
            <p className="text-xs tracking-wide text-foreground/60 mb-3 uppercase">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll venstre"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-background transition-colors text-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll høyre"
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-background transition-colors text-foreground"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Button variant="cta-outline" asChild>
              <Link to={seeAllHref}>
                {seeAllLabel}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

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
          <Link
            key={sp.slug}
            to={`/spesialister/${sp.slug}`}
            aria-label={`Les mer om ${sp.name}`}
            className="group flex-shrink-0 w-[280px] snap-start"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <img
                src={sp.image}
                alt={sp.name}
                loading="lazy"
                className="w-full h-full object-cover saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />

              {sp.clinics && sp.clinics.length > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white/80 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  {sp.clinics.join(" · ")}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-base md:text-lg font-normal text-white mb-0.5">
                  {sp.name}
                </h3>
                <p className="text-sm font-light text-white/75">
                  {sp.subtitle || sp.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length > 4 && (
        <p className="md:hidden text-center text-xs text-foreground/50 mt-3">
          Sveip for å se flere →
        </p>
      )}
    </section>
  );
};
