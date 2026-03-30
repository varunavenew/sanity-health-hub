import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/hooks/useSanity";

// Static fallback images
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import fertilityHero from "@/assets/hero/fertility-hero.jpg";
import robotkirurgiHero from "@/assets/hero/robotkirurgi-hero.jpg";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";
import heroTreatment from "@/assets/hero/hero-treatment.jpg";
import heroTechnology from "@/assets/hero/hero-technology.jpg";
import heroLifestyle from "@/assets/hero/hero-lifestyle-1.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";

interface HeroSlide {
  id: string;
  images: string[]; // 3 images for triptych
  alt: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
}

const staticSlides: HeroSlide[] = [
  {
    id: "kvinnehelse",
    images: [kvinnehelseHero, heroPregnancy, heroFamily],
    alt: "Kvinnehelse for livet",
    label: "Kvinnehelse\nfor livet",
    subtitle: "Kvinnehelse",
    cta: "Les mer",
    ctaPath: "/kvinnehelse",
  },
  {
    id: "fertilitet",
    images: [fertilityHero, heroLifestyle, heroClinicLounge],
    alt: "Ledende miljø innen fertilitet",
    label: "Ledende miljø\ninnen fertilitet",
    subtitle: "Fertilitetsteamet",
    cta: "Les mer",
    ctaPath: "/fertilitet",
  },
  {
    id: "robotkirurgi",
    images: [robotkirurgiHero, heroTreatment, heroTechnology],
    alt: "Robotassistert kirurgi",
    label: "Robotassistert\nkirurgi",
    subtitle: "Teknologi",
    cta: "Les mer",
    ctaPath: "/robotassistert-kirurgi",
  },
];

export const HeroBanner = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const heroSlides: HeroSlide[] =
    homepage?.heroSlides && homepage.heroSlides.length > 0
      ? homepage.heroSlides.map((s: any) => ({
          ...s,
          images: s.images || [s.image, s.image, s.image],
          alt: s.label || "",
        }))
      : staticSlides;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

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

  const dragStart = useRef<number | null>(null);
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragging.current = false;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (
      dragStart.current !== null &&
      Math.abs(e.clientX - dragStart.current) > 10
    ) {
      dragging.current = true;
    }
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragStart.current === null) return;
      const diff = e.clientX - dragStart.current;
      dragStart.current = null;
      if (Math.abs(diff) > 50) {
        if (diff < 0) next();
        else prev();
      }
    },
    [next, prev]
  );

  const slide = heroSlides[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="relative w-full h-[65vh] md:h-[70vh] min-h-[400px] overflow-hidden bg-brand-dark select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: "grab" }}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 cursor-pointer group"
          onClick={() => {
            if (!dragging.current) navigate(slide.ctaPath);
          }}
        >
          {/* Triptych: 3 vertical image panels */}
          <div className="flex h-full w-full">
            {slide.images.map((img, i) => (
              <div key={i} className="relative h-full flex-1 overflow-hidden">
                <img
                  src={img}
                  alt={i === 0 ? slide.alt : ""}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] saturate-[0.8] brightness-[0.92] contrast-[1.05]"
                  loading={current === 0 && i === 0 ? "eager" : "lazy"}
                />
                {/* Subtle divider between panels */}
                {i < 2 && (
                  <div className="absolute top-0 right-0 w-[2px] h-full bg-black/20 z-10" />
                )}
              </div>
            ))}
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-brand-dark/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Text content – positioned over the left panel */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 pb-20 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="max-w-md"
            >
              <span className="block text-xs text-white/80 mb-3 font-light">
                {slide.subtitle}
              </span>
              <p
                className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white whitespace-pre-line mb-6"
                aria-live="polite"
              >
                {slide.label}
              </p>
              <span
                className="inline-flex items-center text-sm md:text-base text-white font-normal hover:underline underline-offset-4 transition-all cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(slide.ctaPath);
                }}
              >
                {slide.cta}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform hover:translate-x-1" />
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="container mx-auto px-6 md:px-16 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Gå til slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Forrige slide"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Neste slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
