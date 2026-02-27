import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHomepage } from "@/hooks/useSanity";
import cmedicalClinic from "@/assets/hero/cmedical-clinic.jpg";
import cmedicalFamily from "@/assets/hero/cmedical-family.jpg";

const fallbackBlocks = [
  { id: "seminar", title: "Velkommen på fastlegeseminar", description: "Lær mer om våre tjenester og hvordan vi kan hjelpe deg og dine pasienter.", image: cmedicalClinic, cta: "Les mer og boka", path: "/kontakt" },
  { id: "aktuelt", title: "Velkommen på fastlegeseminar", description: "Hold deg oppdatert på nyheter, arrangementer og faglig innhold fra CMedical.", image: cmedicalFamily, cta: "Les mer og boka", path: "/kontakt" },
];

export const PromoBlocks = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();

  const blocks = homepage?.promoBlocks?.length ? homepage.promoBlocks : fallbackBlocks;

  return (
    <section className="bg-background pt-2 md:pt-4 pb-4 md:pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-6xl mx-auto">
          {blocks.map((block: any) => (
            <button
              key={block.id}
              onClick={() => navigate(block.path)}
              className="group relative overflow-hidden rounded-sm aspect-[16/9] text-left cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img src={block.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-white text-base md:text-lg font-light mb-2">{block.title}</h3>
                <div className="flex items-center gap-1 text-white/80 text-sm font-light group-hover:text-white group-hover:gap-2 transition-all duration-300">
                  {block.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
