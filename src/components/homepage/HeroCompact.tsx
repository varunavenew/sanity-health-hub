import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left, behavior: 'smooth' });
  };

  const scrollByDir = (dir: 1 | -1) => {
    const el = swiperRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className={`bg-background pb-4 md:pb-6 ${showHeader ? "pt-10 md:pt-14" : ""}`}>
      {showHeader && (
        <div className="page-shell mb-4 md:mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground text-left">
            {t("services.title")}
          </h2>
          {/* Mobile-only arrows on header row */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              aria-label="Scroll venstre"
              className="h-9 w-9 rounded-full bg-brand-dark text-background flex items-center justify-center shadow-md active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              aria-label="Scroll høyre"
              className="h-9 w-9 rounded-full bg-brand-dark text-background flex items-center justify-center shadow-md active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile: full-bleed, flush horizontal strip — no gap, no rounded corners */}
      <div className="md:hidden">
        <div
          ref={swiperRef}
          className="flex gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label={t("services.title")}
        >
          {serviceCategories.map((category: any, index: number) => (
            <button
              key={category.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              onClick={() => navigate(category.path)}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer text-left snap-center shrink-0 w-[85vw]"
              aria-label={t("services.seeAllTreatments", { name: category.title })}
            >
              <img
                src={category.mobileImage ?? category.image}
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
        {/* Dots indicator (no arrows here — they are at top) */}
        <div className="flex items-center justify-center mt-3 px-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Kategori-indikator">
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
