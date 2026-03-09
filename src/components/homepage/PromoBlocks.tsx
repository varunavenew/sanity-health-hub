import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import robotkirurgiHero from "@/assets/hero/robotkirurgi-hero.jpg";
import tverrfagligTeam from "@/assets/hero/tverrfaglig-team.jpg";

const blocks = [
  {
    id: "overvektskirurgi",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    image: robotkirurgiHero,
    cta: "Les mer",
    path: "/robotassistert-kirurgi",
  },
  {
    id: "livio",
    title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
    image: tverrfagligTeam,
    cta: "Les mer",
    path: "/tverrfaglige-team",
  },
];

export const PromoBlocks = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-background pt-2 md:pt-4 pb-4 md:pb-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-6xl mx-auto">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => navigate(block.path)}
              className="group relative overflow-hidden rounded-sm aspect-[16/9] text-left cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={block.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-white text-base md:text-lg font-light mb-2">
                  {block.title}
                </h3>
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
