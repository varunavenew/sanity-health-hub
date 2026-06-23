import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

// Static fallback images — use the same hero images as the corresponding subpages
// (portrait-friendly crops; object-position tuned per card so the subject stays visible).
import urologiAsset from "@/assets/services/urologi-hero.jpg.asset.json";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import ortopediAsset from "@/assets/services/ortopedi-hero.jpg.asset.json";
import graviditetAsset from "@/assets/services/graviditet-hero.jpg.asset.json";
import flereImg from "@/assets/hero/cmedical-family.jpg";

const staticCategories = [
  // Urologi: portrait of male patient (man with glasses) – hero of /urologi
  { id: 'urologi', title: 'Urologi', image: urologiAsset.url, path: '/urologi', objectPosition: 'center top' },
  // Fertilitet: confirmed correct by clinic – keep current image
  { id: 'fertilitet', title: 'Fertilitet', image: fertilitetImg, path: '/fertilitet', objectPosition: 'center' },
  // Gynekologi: confirmed correct by clinic – keep current image
  { id: 'gynekologi', title: 'Gynekologi', image: gynekologiImg, path: '/gynekologi', objectPosition: 'center' },
  // Graviditet: pregnant belly visible (matches Figma) – hero of /graviditet
  { id: 'graviditet', title: 'Graviditet', image: graviditetAsset.url, path: '/graviditet', objectPosition: 'center' },
  // Ortopedi: x-ray motif (matches Figma) – hero of /ortopedi
  { id: 'ortopedi', title: 'Ortopedi', image: ortopediAsset.url, path: '/ortopedi', objectPosition: 'center' },
  // Flere tjenester: family/par together (closest available match in project)
  { id: 'flere', title: 'Flere tjenester', image: flereImg, path: '/flere-fagomrader', objectPosition: 'center' },
];

interface HeroCompactProps {
  showHeader?: boolean;
}

export const HeroCompact = ({ showHeader = true }: HeroCompactProps) => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  const serviceCategories =
    homepage?.categoryCards && homepage.categoryCards.length > 0
      ? homepage.categoryCards
      : staticCategories;

  return (
    <section className={`bg-background pb-4 md:pb-6 ${showHeader ? "pt-10 md:pt-14" : ""}`}>
      {showHeader && (
        <div className="page-shell mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground text-left">
            {t("services.title")}
          </h2>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 w-full"
      >
          {serviceCategories.map((category: any, index: number) => (
            <motion.button
              key={category.id}
              onClick={() => navigate(category.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer text-left"
              aria-label={t("services.seeAllTreatments", { name: category.title })}
            >
              <img
                src={category.image}
                alt=""
                style={{ objectPosition: category.objectPosition ?? 'center' }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent opacity-80 transition-opacity duration-300" aria-hidden="true" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm md:text-base font-light">
                    {category.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
    </section>
  );
};
