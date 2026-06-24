import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import urologiHeroAsset from "@/assets/services/urologi-hero.jpg.asset.json";
const urologiImg = urologiHeroAsset.url;
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import ortopediImg from "@/assets/categories/ortopedi-real.jpg";
import graviditetImg from "@/assets/hero/hero-pregnancy.jpg";
import flereImg from "@/assets/categories/flere-fagomrader.jpg";

export const demoCategories = [
  { id: "urologi", title: "Urologi", image: urologiImg, path: "/urologi" },
  { id: "fertilitet", title: "Fertilitet", image: fertilitetImg, path: "/fertilitet" },
  { id: "gynekologi", title: "Gynekologi", image: gynekologiImg, path: "/gynekologi" },
  { id: "graviditet", title: "Graviditet", image: graviditetImg, path: "/graviditet" },
  { id: "ortopedi", title: "Ortopedi", image: ortopediImg, path: "/ortopedi" },
  { id: "flere", title: "Flere tjenester", image: flereImg, path: "/flere-fagomrader" },
];

/** Cards used by the overlap variant — light cards with title only */
export function LightCardGrid({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-brand-dark/10 ${className}`}>
      {demoCategories.map((c) => (
        <button
          key={c.id}
          onClick={() => navigate(c.path)}
          className="group relative bg-background aspect-[3/4] overflow-hidden text-left"
        >
          <img
            src={c.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-center justify-between">
            <h3 className="text-brand-light text-sm md:text-base font-light">{c.title}</h3>
            <ArrowRight className="w-4 h-4 text-brand-light/70 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
}
