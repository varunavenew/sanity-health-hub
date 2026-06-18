import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTranslation } from "react-i18next";

export const SpecialistsSectionElegant = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-10 md:pt-14 pb-10 md:pb-14 bg-secondary/30 overflow-hidden">
      <div className="page-shell">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-muted-foreground font-light mb-3">{t("specialists.subtitle")}</p>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
              {t("specialists.title")}
            </h2>
            <p className="text-muted-foreground font-light">
              {t("specialists.description")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label={t("specialists.scrollLeft")}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label={t("specialists.scrollRight")}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/spesialister"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-foreground/20 rounded-full text-foreground font-light hover:bg-secondary transition-colors"
            >
              {t("specialists.seeAll", { count: specialists.length })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal scroll — cards flush with left edge, larger gap */}
      <div
        ref={scrollContainerRef}
        className="flex gap-0 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory pl-[var(--gutter)]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {specialists.map((specialist, index) => (
          <Link
            to={`/spesialister/${specialist.slug}`}
            key={specialist.name}
            className="group flex-shrink-0 w-[260px] md:w-[300px] snap-start"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              {/* Original color image — no filters per design principles */}
              <img
                src={specialist.image}
                alt={specialist.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />

              {/* Bottom gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent" />

              {/* Top gradient for clinic label readability */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

              {/* Clinic label */}
              {specialist.clinics && specialist.clinics.length > 0 && (
                <div className="absolute top-4 left-4 flex items-center gap-1 text-white/80 text-sm font-light">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {specialist.clinics.join(' · ')}
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-normal text-white text-lg leading-snug mb-0.5">{specialist.name}</h3>
                <p className="text-sm text-white/70 font-light leading-snug">
                  {specialist.title}
                  {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                </p>

                {/* Hover reveal: "Se profil" */}
                <div
                  className={`flex items-center gap-1.5 mt-3 text-sm font-light text-brand-yellow transition-all duration-500 ease-out ${
                    hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span>Se profil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* "See all" end card */}
        <div className="flex-shrink-0 w-[260px] md:w-[300px] snap-start pr-[var(--gutter)]">
          <Link
            to="/spesialister"
            className="relative block aspect-[3/4] bg-secondary border border-border overflow-hidden group hover:bg-secondary/80 transition-colors"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-full border border-foreground/20 flex items-center justify-center mb-5 group-hover:bg-foreground/5 transition-colors">
                <ArrowRight className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-foreground font-normal mb-1">{t("specialists.seeAllShort")}</p>
              <p className="text-muted-foreground text-sm font-light">{t("specialists.count", { count: specialists.length })}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden flex justify-center mt-4">
        <span className="text-xs text-muted-foreground">{t("specialists.swipeHint")}</span>
      </div>
    </section>
  );
};
