import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";




// Static fallback images — use the same hero images as the corresponding subpages
// (portrait-friendly crops; object-position tuned per card so the subject stays visible).
import urologiAsset from "@/assets/services/urologi-hero.jpg.asset.json";
import fertilitetHeroAsset from "@/assets/services/fertilitet-hero.jpg.asset.json";
import gynekologiHeroAsset from "@/assets/services/gynekologi-hero.jpg.asset.json";
import ortopediAsset from "@/assets/services/ortopedi-hero.jpg.asset.json";
import graviditetAsset from "@/assets/services/graviditet-hero.jpg.asset.json";
import flereImg from "@/assets/hero/cmedical-family.jpg";
import mobilGynekologiAsset from "@/assets/services/mobil-gynekologi-hero-v2.jpg.asset.json";
import mobilFertilitetAsset from "@/assets/services/mobil-fertilitet-hero.jpg.asset.json";
import mobilFlereAsset from "@/assets/services/mobil-flere-hero.jpg.asset.json";

const staticCategories = [
  { id: 'urologi', title: 'Urologi', image: urologiAsset.url, mobileImage: urologiAsset.url, path: '/urologi', objectPosition: 'center top' },
  { id: 'fertilitet', title: 'Fertilitet', image: fertilitetHeroAsset.url, mobileImage: mobilFertilitetAsset.url, path: '/fertilitet', objectPosition: 'center' },
  { id: 'gynekologi', title: 'Gynekologi', image: gynekologiHeroAsset.url, mobileImage: mobilGynekologiAsset.url, path: '/gynekologi', objectPosition: 'center' },
  { id: 'graviditet', title: 'Graviditet', image: graviditetAsset.url, mobileImage: graviditetAsset.url, path: '/graviditet', objectPosition: 'center' },
  { id: 'ortopedi', title: 'Ortopedi', image: ortopediAsset.url, mobileImage: ortopediAsset.url, path: '/ortopedi', objectPosition: 'center' },
  { id: 'flere', title: 'Flere tjenester', image: flereImg, mobileImage: mobilFlereAsset.url, path: '/flere-fagomrader', objectPosition: 'center' },
];

interface HeroCompactProps {
  showHeader?: boolean;
}

export const HeroCompact = ({ showHeader = true }: HeroCompactProps) => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  const overrideById = new Map<string, any>(
    (homepage?.categoryCards || []).map((c: any) => [c.id, c])
  );
  const serviceCategories = staticCategories.map((c) => {
    const o = overrideById.get(c.id);
    return o ? { ...c, title: o.title || c.title, path: o.path || c.path } : c;
  });

  return (
    <section className={`bg-background pb-4 md:pb-6 ${showHeader ? "pt-10 md:pt-14" : ""}`}>
      {showHeader && (
        <div className="page-shell mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground text-left">
            {t("services.title")}
          </h2>
        </div>
      )}

      {/* Mobile: compact 2-per-row grid with small images + title */}
      <div className="md:hidden page-shell">
        <div className="grid grid-cols-2 gap-3" role="list" aria-label={t("services.title")}>
          {serviceCategories.map((category: any, index: number) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="group text-left flex flex-col gap-2"
              aria-label={t("services.seeAllTreatments", { name: category.title })}
            >
              <div className="relative overflow-hidden aspect-[5/4] rounded-md bg-secondary/40">
                <img
                  src={category.mobileImage ?? category.image}
                  alt=""
                  className="w-full h-full object-contain"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-0.5">
                <h3 className="text-sm font-light text-foreground leading-tight">
                  {category.title}
                </h3>
                <ArrowRight className="w-3.5 h-3.5 text-foreground/60 shrink-0" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>




      {/* Desktop/tablet: original grid (unchanged) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-0 w-full"
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
