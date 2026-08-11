import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { SpecialistCarousel } from "@/components/specialists/SpecialistCarousel";

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
  /** Fallback category used when `filter`/`category` returns no matches. */
  fallbackCategory?: string;
  title?: string;
  description?: string;
  /** Link target for "Se alle". */
  seeAllHref?: string;
  seeAllLabel?: string;
}

/**
 * SpecialistsScroller — tynn wrapper rundt den felles SpecialistCarousel,
 * beholdt for eksisterende call sites. Ved nøyaktig én spesialist beholdes
 * den redaksjonelle split-layouten.
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
  const { sorted: specialists } = useSpecialistsData();

  const filtered = useMemo(() => {
    let result = specialists;
    if (filter) result = specialists.filter(filter as any);
    else if (category && category !== "alle") result = specialists.filter((s) => s.category === category);
    if (result.length === 0 && fallbackCategory && fallbackCategory !== "alle") {
      result = specialists.filter((s) => s.category === fallbackCategory);
    }
    return result;
  }, [specialists, category, filter, fallbackCategory]);

  if (filtered.length === 0) return null;

  if (filtered.length === 1) {
    return (
      <section className="pt-10 md:pt-14 pb-14 md:pb-16 bg-secondary/30 overflow-hidden">
        <div className="page-shell">
          <div className="section-head max-w-xl max-md:!mb-4">
            <h2 className="text-2xl md:text-3xl font-light text-foreground">{title}</h2>
            {description && (
              <p className="section-lead text-muted-foreground font-light">{description}</p>
            )}
          </div>
          <SpecialistFeature sp={filtered[0]} />
        </div>
      </section>
    );
  }

  return (
    <SpecialistCarousel
      specialists={filtered as any}
      title={title}
      description={description}
      seeAllHref={seeAllHref}
      seeAllLabel={seeAllLabel}
    />
  );
};

/** Editorial split layout when there is exactly one specialist for a service. */
const SpecialistFeature = ({ sp }: { sp: any }) => {
  const shortBio = sp.bio ? sp.bio.split("\n\n")[0].slice(0, 280) : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-stretch">
      <Link
        to={`/spesialister/${sp.slug}`}
        aria-label={`Les mer om ${sp.name}`}
        className="group md:col-span-5 md:col-start-1 block mt-0"
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
                  <li key={item} className="py-3 text-sm font-light text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-10">
          <Button variant="cta" asChild className="max-sm:w-full">
            <Link to="/booking">Finn ledig tid hos {sp.name.split(" ")[0]}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
