import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PromoBlock {
  title: string;
  description?: string;
  image: string;
  cta: string;
  path: string;
}

interface EmotionalPromoSectionProps {
  blocks: PromoBlock[];
}

export const EmotionalPromoSection = ({ blocks }: EmotionalPromoSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-6xl mx-auto">
          {blocks.map((block, idx) => (
            <button
              key={idx}
              onClick={() => navigate(block.path)}
              className="group relative overflow-hidden rounded-sm aspect-[16/9] text-left cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={block.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <h3 className="text-white text-lg md:text-xl font-light mb-1.5 leading-snug">
                  {block.title}
                </h3>
                {block.description && (
                  <p className="text-white/60 text-sm font-light mb-3 max-w-[85%]">
                    {block.description}
                  </p>
                )}
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
