import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useSpecialists } from "@/hooks/useSanity";
import { getSpecialistsSortedByLastName } from "@/data/specialists";

export const SpecialistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: sanitySpecialists } = useSpecialists();

  // Use Sanity data if available, fallback to static
  const staticSpecialists = getSpecialistsSortedByLastName();
  const specialists = sanitySpecialists?.length ? sanitySpecialists : staticSpecialists;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-sm text-white/70 font-light mb-3">Våre eksperter</p>
            <h2 className="text-3xl md:text-4xl font-normal text-white mb-4">Møt våre spesialister</h2>
            <p className="text-white/70 font-light">Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Button className="rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/spesialister">
                Se alle {specialists.length} spesialister
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-16 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {specialists.map((specialist: any) => (
          <Link to={`/spesialister/${specialist.slug}`} key={specialist.slug || specialist.name} className="group flex-shrink-0 w-[280px] snap-start">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-3 bg-secondary">
              <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white mb-1">{specialist.name}</h3>
                <p className="text-sm text-accent font-light">{specialist.title}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 font-normal px-1">{(specialist.expertise || []).join(', ')}</p>
          </Link>
        ))}
        
        <div className="flex-shrink-0 w-[280px] snap-start">
          <div className="aspect-[3/4] rounded-sm bg-white/10 border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-accent" />
            </div>
            <p className="text-white font-normal mb-1">Se alle</p>
            <p className="text-white/60 text-sm font-light">{specialists.length} spesialister</p>
          </div>
        </div>
      </div>

      <div className="md:hidden flex justify-center mt-4 gap-1">
        <span className="text-xs text-white/60">Sveip for å se flere →</span>
      </div>
    </section>
  );
};
