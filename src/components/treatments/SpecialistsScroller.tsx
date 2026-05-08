import { useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";

const categoryLabels: Record<string, string> = {
  alle: "Alle",
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Flere tjenester",
};

interface Props {
  defaultCategory?: string;
  eyebrow?: string;
  title?: string;
}

export const SpecialistsScroller = ({
  defaultCategory = "alle",
  eyebrow = "Møt teamet",
  title = "Spesialistene som følger deg",
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();
  const [activeFilter, setActiveFilter] = useState(defaultCategory);

  const filtered = useMemo(
    () =>
      activeFilter === "alle"
        ? specialists
        : specialists.filter((s) => s.category === activeFilter),
    [specialists, activeFilter]
  );

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-brand-warm pt-16 md:pt-20 pb-16 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-light mb-4">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
              {title}
            </h2>
          </div>
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
            <Button variant="cta-outline" asChild className="ml-2">
              <Link to="/spesialister">
                Se alle <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-1.5 rounded-sm text-sm font-light transition-colors ${
                activeFilter === key
                  ? "bg-foreground text-background"
                  : "border border-foreground/30 text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-6 md:px-16"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filtered.map((s) => (
          <Link
            key={s.slug}
            to={`/spesialister/${s.slug}`}
            className="group flex-shrink-0 w-[260px] snap-start"
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-muted">
              <img
                src={s.image}
                alt={s.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {s.clinics && s.clinics.length > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  <MapPin className="w-2.5 h-2.5" />
                  {s.clinics.join(" · ")}
                </div>
              )}
            </div>
            <h3 className="text-base font-light text-foreground mb-1">{s.name}</h3>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-light mb-2">
              {s.title}
            </p>
            {s.expertise?.length > 0 && (
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {s.expertise.slice(0, 3).join(", ")}
              </p>
            )}
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground font-light py-12">
            Ingen spesialister i denne kategorien.
          </div>
        )}
      </div>
    </section>
  );
};
