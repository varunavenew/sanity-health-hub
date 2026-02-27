import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/hooks/useSanity";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images
import pdf1Treatment1 from "@/assets/hero/pdf1-treatment1.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";
import pdf1Man from "@/assets/hero/pdf1-man.jpg";
import pdf1Woman2 from "@/assets/hero/pdf1-woman2.jpg";

interface HeroSlide {
  id: string;
  image: string;
  alt?: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  objectPosition: string;
}

const fallbackSlides: HeroSlide[] = [
  { id: "kvinnehelse", image: heroFamily, label: "Styrket kvinnehelse\n– i hele livsløpet", subtitle: "Kvinnehelse", cta: "Les mer", ctaPath: "/gynekologi", objectPosition: "center 15%" },
  { id: "urologi", image: pdf1Man, label: "Mannshelse\nog urologi", subtitle: "Urologi", cta: "Les mer", ctaPath: "/urologi", objectPosition: "center 30%" },
  { id: "robotkirurgi", image: pdf1Treatment1, label: "Landets første private\nmed robotkirurgi", subtitle: "Teknologi", cta: "Les mer", ctaPath: "/tjenester", objectPosition: "center 40%" },
  { id: "fertilitet", image: pdf1Woman2, label: "Din reise til\nforeldreskap", subtitle: "Fertilitet", cta: "Les mer", ctaPath: "/fertilitet", objectPosition: "center 30%" },
];

export const HeroBanner = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const heroSlides: HeroSlide[] = homepage?.heroSlides?.length ? homepage.heroSlides : fallbackSlides;

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

  const dragStart = useRef<number | null>(null);
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragging.current = false;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStart.current !== null && Math.abs(e.clientX - dragStart.current) > 10) {
      dragging.current = true;
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const diff = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next();
      else prev();
    }
  }, [next, prev]);

  const slide = heroSlides[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="relative w-full h-[70vh] md:h-[75vh] min-h-[450px] overflow-hidden bg-brand-dark select-none touch-pan-y"
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
          className="absolute inset-0 group cursor-pointer"
          onClick={() => { if (!dragging.current) navigate(slide.ctaPath); }}
        >
          <img
            src={slide.image}
            alt={slide.label}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            style={{ objectPosition: slide.objectPosition }}
            loading={current === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="max-w-2xl"
            >
              <span className="block text-[10px] md:text-xs tracking-[0.15em] text-white/60 mb-2 font-light">
                {slide.subtitle}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-white whitespace-pre-line mb-4">
                {slide.label}
              </h2>
              <span className="inline-flex items-center text-sm md:text-base text-accent font-normal group-hover:underline underline-offset-4 transition-all">
                {slide.cta}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="container mx-auto px-6 md:px-16 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Gå til slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Forrige slide">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-sm border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Neste slide">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
