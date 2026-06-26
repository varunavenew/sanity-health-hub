import { useEffect, useRef, useState } from "react";
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

const staticCategories = [
  { id: 'urologi', title: 'Urologi', image: urologiAsset.url, path: '/urologi', objectPosition: 'center top' },
  { id: 'fertilitet', title: 'Fertilitet', image: fertilitetHeroAsset.url, path: '/fertilitet', objectPosition: 'center' },
  { id: 'gynekologi', title: 'Gynekologi', image: gynekologiHeroAsset.url, path: '/gynekologi', objectPosition: 'center' },
  { id: 'graviditet', title: 'Graviditet', image: graviditetAsset.url, path: '/graviditet', objectPosition: 'center' },
  { id: 'ortopedi', title: 'Ortopedi', image: ortopediAsset.url, path: '/ortopedi', objectPosition: 'center' },
  { id: 'flere', title: 'Flere tjenester', image: flereImg, path: '/flere-fagomrader', objectPosition: 'center' },
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

  // Mobile swipe carousel — track active card via scroll position
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = swiperRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const center = el.scrollLeft + el.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const cardCenter = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(cardCenter - center);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        });
        setActiveIdx(bestIdx);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const card = cardRefs.current[i];
    const el = swiperRef.current;
    if (!card || !el) return;
    el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section className={`bg-background pb-4 md:pb-6 ${showHeader ? "pt-10 md:pt-14" : ""}`}>
      {showHeader && (
        <div className="page-shell mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground text-left">
            {t("services.title")}
          </h2>
        </div>
      )}

      {/* Mobile: horizontal snap carousel with peek + dots */}
      <div className="md:hidden">
        <div
          ref={swiperRef}
          className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label={t("services.title")}
        >
          {serviceCategories.map((category: any, index: number) => (
            <button
              key={category.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              onClick={() => navigate(category.path)}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer text-left snap-center shrink-0 w-[82vw] rounded-sm"
              aria-label={t("services.seeAllTreatments", { name: category.title })}
            >
              <img
                src={category.image}
                alt=""
                style={{ objectPosition: category.objectPosition ?? 'center' }}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-base font-light">{category.title}</h3>
                  <ArrowRight className="w-4 h-4 text-white/70" aria-hidden="true" />
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-3" role="tablist" aria-label="Kategori-indikator">
          {serviceCategories.map((c: any, i: number) => (
            <button
              key={c.id}
              onClick={() => goTo(i)}
              aria-label={`Gå til ${c.title}`}
              aria-selected={i === activeIdx}
              role="tab"
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-6 bg-brand-dark' : 'w-1.5 bg-brand-dark/25'
              }`}
            />
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
