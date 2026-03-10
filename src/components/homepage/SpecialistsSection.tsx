import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";

export const SpecialistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();

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
    <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-white/70 font-light mb-3">Våre eksperter</p>
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">
              Møt våre spesialister
            </h2>
            <p className="text-white/70 font-light">
              Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Navigation arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Button 
              className="rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/spesialister">
                Se alle {specialists.length} spesialister
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-16 snap-x snap-mandatory"
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
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-3 bg-brand-dark">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.7] brightness-[0.95] contrast-[1.05]"
              />
              {/* Warm tone overlay for visual consistency */}
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
                <p className="text-sm text-white/70 font-light">{specialist.title}</p>
              </div>
            </div>

            <p className="text-sm text-white/60 font-normal px-1">{specialist.expertise.join(', ')}</p>
          </Link>
        ))}
        
        {/* "See all" card at end */}
        <div className="flex-shrink-0 w-[280px] snap-start">
          <div className="aspect-[3/4] rounded-sm bg-white/10 border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-normal mb-1">Se alle</p>
            <p className="text-white/60 text-sm font-light">{specialists.length} spesialister</p>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden flex justify-center mt-4 gap-1">
        <span className="text-xs text-white/60">Sveip for å se flere →</span>
      </div>
    </section>
  );
};
