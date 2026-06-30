import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

// Static fallback images
import kvinnehelseHeroAsset from "@/assets/hero/kvinnehelse-hero-v2.jpg.asset.json";
import fertilityHeroAsset from "@/assets/hero-fertilitet.jpg.asset.json";
import tverrfagligTeamAsset from "@/assets/hero/tverrfaglig-team-hero-v2.jpg.asset.json";
import mobilGynekologiAsset from "@/assets/services/mobil-gynekologi-hero-v2.jpg.asset.json";
import mobilFertilitetAsset from "@/assets/services/mobil-fertilitet-hero.jpg.asset.json";
import mobilFlereAsset from "@/assets/services/mobil-flere-hero.jpg.asset.json";

const kvinnehelseHero = kvinnehelseHeroAsset.url;
const fertilityHero = fertilityHeroAsset.url;
const robotkirurgiHero = tverrfagligTeamAsset.url;
const mobilKvinnehelse = mobilGynekologiAsset.url;
const mobilFertilitet = mobilFertilitetAsset.url;
const mobilTverrfaglig = mobilFlereAsset.url;

interface HeroSlide {
  id: string;
  image: string;
  mobileImage?: string;
  video?: string;
  alt: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  objectPosition: string;
}

export const HeroBanner = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const staticSlides: HeroSlide[] = [
    {
      id: "kvinnehelse",
      image: kvinnehelseHero,
      mobileImage: mobilKvinnehelse,
      alt: t("hero.kvinnehelse.label"),
      label: t("hero.kvinnehelse.label"),
      subtitle: t("hero.kvinnehelse.subtitle"),
      cta: t("hero.readMore"),
      ctaPath: "/gynekologi",
      objectPosition: "center 20%",
    },
    {
      id: "fertilitet",
      image: fertilityHero,
      mobileImage: mobilFertilitet,
      alt: t("hero.fertilitet.label"),
      label: t("hero.fertilitet.label"),
      subtitle: t("hero.fertilitet.subtitle"),
      cta: t("hero.readMore"),
      ctaPath: "/fertilitet",
      objectPosition: "center 40%",
    },
    {
      id: "tverrfaglig",
      image: robotkirurgiHero,
      mobileImage: mobilTverrfaglig,
      alt: t("hero.tverrfaglig.label"),
      label: t("hero.tverrfaglig.label"),
      subtitle: t("hero.tverrfaglig.subtitle"),
      cta: t("hero.readMore"),
      ctaPath: "/behandlinger/gynekologi/tverrfaglig",
      objectPosition: "center 40%",
    },
  ];

  const heroSlides: HeroSlide[] =
    homepage?.heroSlides && homepage.heroSlides.length > 0
      ? homepage.heroSlides.map((s: any) => ({
          ...s,
          alt: s.label || "",
        }))
      : staticSlides;

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section
      className="relative w-full h-[65vh] md:h-[70vh] min-h-[400px] overflow-hidden bg-brand-light select-none"
    >
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 cursor-pointer group"
          onClick={() => navigate(slide.ctaPath)}
        >
          {slide.video ? (
            <video
              src={slide.video}
              poster={slide.image}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ objectPosition: slide.objectPosition }}
            />
          ) : (
            <>
              {slide.mobileImage && (
                <img
                  src={slide.mobileImage}
                  alt={slide.alt}
                  className="md:hidden w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: "center" }}
                  loading={current === 0 ? "eager" : "lazy"}
                />
              )}
              <img
                src={slide.image}
                alt={slide.alt}
                className={`${slide.mobileImage ? "hidden md:block" : ""} w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]`}
                style={{ objectPosition: slide.objectPosition }}
                loading={current === 0 ? "eager" : "lazy"}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 pb-20 md:pb-24">
            <div className="page-shell">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="max-w-xl"
              >
                <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white whitespace-pre-line mb-6" aria-live="polite">
                  {slide.label}
                </p>
                <span
                  className="inline-flex items-center text-sm md:text-base text-white font-normal hover:underline underline-offset-4 transition-all cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(slide.ctaPath); }}
                >
                  {slide.cta}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform hover:translate-x-1" />
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="page-shell pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={t("hero.goToSlide", { num: i + 1 })}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label={t("hero.prevSlide")}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label={t("hero.nextSlide")}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
