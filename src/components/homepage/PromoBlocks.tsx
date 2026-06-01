import { ArrowRight } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { useHomepage } from "@/hooks/useSanity";

export const PromoBlocks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: homepage } = useHomepage();

  const sectionTitle =
    homepage?.promoBlocksTitle?.trim() || t("promoBlocks.title");

  const blocks = (homepage?.promoBlocks || []).filter((b: any) => b?.image && b?.title);
  if (blocks.length === 0) return null;

  return (
    <section className="bg-secondary/30 pt-10 md:pt-14 pb-4 md:pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section heading */}
        <div className="max-w-6xl mx-auto mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-6xl mx-auto">
          {blocks.map((block: any) => (
            <button
              key={block.id}
              onClick={() => navigate(block.path)}
              className="group relative overflow-hidden aspect-[16/9] text-left cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
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
