"use client";

import { AssetImg } from "@/components/AssetImg";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTranslation } from "react-i18next";

export const SpecialistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();
  const { t } = useTranslation();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-14 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
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
            {/* Navigation arrows */}
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
            <Button 
              variant="cta-outline"
              asChild
            >
              <Link to="/spesialister">
                {t("specialists.seeAll", { count: specialists.length })}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-0 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {specialists.map((specialist) => (
          <Link
            to={`/spesialister/${specialist.slug}`}
            key={specialist.name}
            className="group flex-shrink-0 w-[280px] snap-start"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-secondary">
              <AssetImg
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

              {/* Clinic label - top left */}
              {specialist.clinics && specialist.clinics.length > 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 text-white/70 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  {specialist.clinics.join(' · ')}
                </div>
              )}
              
              {/* Info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white mb-0.5">{specialist.name}</h3>
                <p className="text-sm text-white/70 font-light">
                  {specialist.title}
                  {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-normal pl-1 pr-6">{specialist.expertise.join(', ')}</p>
          </Link>
        ))}
        
        {/* "See all" card at end */}
        <div className="flex-shrink-0 w-[280px] snap-start">
          <div className="aspect-[3/4] bg-secondary border border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
            <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-foreground" />
            </div>
            <p className="text-foreground font-normal mb-1">{t("specialists.seeAllShort")}</p>
            <p className="text-muted-foreground text-sm font-light">{t("specialists.count", { count: specialists.length })}</p>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden flex justify-center mt-4 gap-1">
        <span className="text-xs text-muted-foreground">{t("specialists.swipeHint")}</span>
      </div>
    </section>
  );
};
