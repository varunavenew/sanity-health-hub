import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialists } from "@/hooks/useSanity";
import { getSpecialistsSortedByLastName } from "@/data/specialists";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecialistsProps {
  isChatOpen: boolean;
}

const categoryLabels: Record<string, string> = {
  alle: "Alle",
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Flere fagområder",
};

const Specialists = ({ isChatOpen }: SpecialistsProps) => {
  const [activeFilter, setActiveFilter] = useState("alle");
  const { data: sanitySpecialists, isLoading } = useSpecialists();
  
  const staticSpecialists = getSpecialistsSortedByLastName();
  const specialists = sanitySpecialists?.length ? sanitySpecialists : staticSpecialists;

  useEffect(() => {
    document.title = "Våre spesialister | CMedical";
  }, []);

  const filtered = activeFilter === "alle"
    ? specialists
    : specialists.filter((s: any) => s.category === activeFilter);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl">
            <p className="text-white/50 text-xs tracking-[0.15em] mb-2">Vårt team</p>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">Våre spesialister</h1>
            <p className="text-white/60 font-light text-sm">Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-1.5 rounded-sm text-sm font-light transition-colors ${
                  activeFilter === key ? "bg-white text-brand-dark" : "border border-white/30 text-white/70 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] rounded-sm mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filtered.map((specialist: any) => (
                <Link key={specialist.slug} to={`/spesialister/${specialist.slug}`} className="group">
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-2 bg-secondary">
                    <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{specialist.name}</h3>
                  <p className="text-xs text-muted-foreground font-light">{specialist.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Specialists;
