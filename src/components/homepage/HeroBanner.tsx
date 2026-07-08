"use client";

import { AssetImg } from "@/components/AssetImg";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import type { ImageRef } from "@/lib/media";

interface HeroSlide {
  id: string;
  image?: ImageRef;
  imageRight?: ImageRef;
  videoUrl?: string;
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

  const heroSlides: HeroSlide[] = (homepage?.heroSlides || [])
    .filter((s: any) => (s?.image || s?.videoUrl) && s?.label)
    .map((s: any, i: number) => ({
      id: s.id || `slide-${i}`,
      image: s.image,
      imageRight: s.imageRight,
      videoUrl: s.videoUrl,
      alt: s.label || "",
      label: s.label,
      subtitle: s.subtitle || "",
      cta: s.cta?.trim() || "",
      ctaPath: s.ctaPath?.trim() || "",
      objectPosition: s.objectPosition || "center center",
    }));

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
    if (heroSlides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, next]);

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

  if (heroSlides.length === 0) return null;

  const slide = heroSlides[current];

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <section
      className="relative w-full h-[65vh] md:h-[70vh] min-h-[400px] overflow-hidden bg-brand-light select-none touch-pan-y"
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
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 cursor-pointer group"
          onClick={() => {
            if (!dragging.current && slide.ctaPath) navigate(slide.ctaPath);
          }}
        >
          {slide.imageRight ? (
            <div className="absolute inset-0 w-full h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column (Image or Video) */}
              <div className="relative w-full h-full">
                {slide.videoUrl ? (
                  <video
                    src={slide.videoUrl}
                    poster={typeof slide.image === "string" ? slide.image : undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: slide.objectPosition }}
                  />
                ) : slide.image ? (
                  <AssetImg
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: slide.objectPosition }}
                    loading={current === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-dark/20" />
                )}
              </div>

              {/* Right Column (Second Image - Desktop only) */}
              <div className="relative w-full h-full hidden lg:block overflow-hidden">
                <AssetImg
                  src={slide.imageRight}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: slide.objectPosition }}
                  loading={current === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ) : (
            // Full Width Background Image/Video
            <>
              {slide.videoUrl ? (
                <video
                  src={slide.videoUrl}
                  poster={typeof slide.image === "string" ? slide.image : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: slide.objectPosition }}
                />
              ) : slide.image ? (
                <AssetImg
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: slide.objectPosition }}
                  loading={current === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="w-full h-full bg-brand-dark/20" />
              )}
            </>
          )}

          {/* Overlays for readability and style */}
          {/* A bottom-to-top gradient overlay to ensure contrast for indicators and text at the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />
          
          {/* A soft left-to-right gradient overlay to make the text on the left readable, without blocking the image */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-black/45 via-black/10 to-transparent z-10" />

          {/* Slide Content */}
          <div className="absolute inset-0 z-20">
            <div className="container mx-auto h-full px-6 md:px-16 flex items-center">
              <div className="max-w-xl lg:max-w-[45%] w-full">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <span className="block text-xs text-white/80 mb-3 font-light tracking-wider uppercase">
                    {slide.subtitle}
                  </span>
                  <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white whitespace-pre-line mb-6" aria-live="polite">
                    {slide.label}
                  </p>
                  {slide.cta && slide.ctaPath ? (
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
                  ) : null}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 z-30">
        <div className="container mx-auto px-6 md:px-16 pb-6 flex items-center justify-between">
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
