"use client";

import { AssetImg } from "@/components/AssetImg";
import { CmsMedia } from "@/components/media/CmsMedia";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import type { ImageRef } from "@/lib/media";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";
import { optimizeSanityImageUrl } from "@/lib/sanity/image-url";
import { GoldStarsReviewBadge } from "@/components/ReviewPixel/GoldStarsReviewBadge";

interface HeroSlide {
  id: string;
  image?: ImageRef;
  mobileImage?: ImageRef;
  videoUrl?: string;
  mobileVideoUrl?: string;
  desktopMediaType?: "image" | "video";
  mobileMediaType?: "image" | "video";
  media?: ResolvedCmsMedia | null;
  alt: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  objectPosition: string;
}

function posterUrl(image?: ImageRef): string | undefined {
  return typeof image === "string"
    ? optimizeSanityImageUrl(image, { width: 1920 })
    : undefined;
}

function HeroSlideVideo({
  src,
  poster,
  objectPosition,
  className,
}: {
  src: string;
  poster?: string;
  objectPosition: string;
  className: string;
}) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      style={{ objectPosition }}
    />
  );
}

const mediaClassName =
  "cm-media cm-media--hero w-full h-full transition-transform duration-700 group-hover:scale-[1.02]";

function HeroSlideBackground({
  slide,
  loading,
}: {
  slide: HeroSlide;
  loading: "eager" | "lazy";
}) {
  const useMobileVideo =
    slide.mobileMediaType === "video" && Boolean(slide.mobileVideoUrl);
  const useMobileImage =
    slide.mobileMediaType !== "video" && Boolean(slide.mobileImage);
  const hasMobileLayer = useMobileVideo || useMobileImage;
  const useDesktopVideo =
    slide.desktopMediaType === "video" && Boolean(slide.videoUrl);

  const desktop = useDesktopVideo ? (
    <HeroSlideVideo
      src={slide.videoUrl!}
      poster={posterUrl(slide.image)}
      objectPosition={slide.objectPosition}
      className={mediaClassName}
    />
  ) : slide.media ? (
    <CmsMedia
      media={slide.media}
      alt={slide.alt}
      variant="hero"
      objectPosition={slide.objectPosition}
      className="w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
      loading={loading}
      interactive={false}
    />
  ) : slide.image ? (
    <AssetImg
      src={slide.image}
      alt={slide.alt}
      preset="hero"
      className={mediaClassName}
      style={{ objectPosition: slide.objectPosition }}
      loading={loading}
    />
  ) : (
    <div className="w-full h-full bg-brand-dark/20" />
  );

  return (
    <>
      {hasMobileLayer ? (
        <div className="block md:hidden w-full h-full">
          {useMobileVideo ? (
            <HeroSlideVideo
              src={slide.mobileVideoUrl!}
              poster={posterUrl(slide.mobileImage) || posterUrl(slide.image)}
              objectPosition={slide.objectPosition}
              className={mediaClassName}
            />
          ) : (
            <AssetImg
              src={slide.mobileImage!}
              alt={slide.alt}
              preset="hero"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ objectPosition: slide.objectPosition }}
              loading={loading}
            />
          )}
        </div>
      ) : null}
      <div className={hasMobileLayer ? "hidden md:block w-full h-full" : "w-full h-full"}>
        {desktop}
      </div>
    </>
  );
}

export const HeroBanner = () => {
  const navigate = useNavigate();
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const heroSlides: HeroSlide[] = (homepage?.heroSlides || [])
    .filter(
      (s: any) =>
        (s?.image || s?.videoUrl || s?.mobileVideoUrl || s?.media) && s?.label,
    )
    .map((s: any, i: number) => ({
      id: s.id || `slide-${i}`,
      image: s.image,
      mobileImage: s.mobileImage,
      videoUrl: s.videoUrl,
      mobileVideoUrl: s.mobileVideoUrl,
      desktopMediaType: s.desktopMediaType || "image",
      mobileMediaType: s.mobileMediaType || "image",
      media: s.media,
      alt: s.label || "",
      label: s.label,
      subtitle: s.subtitle || "",
      cta: s.cta?.trim() || "",
      ctaPath: s.ctaPath?.trim() || "",
      objectPosition: s.objectPosition || "center center",
    }));

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prev = useCallback(() => {
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

  const crossfadeTransition = { duration: 0.55, ease: "easeInOut" as const };

  return (
    <section
      className="relative w-full h-[65vh] md:h-[70vh] min-h-[400px] overflow-hidden bg-brand-dark select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: "grab" }}
    >
      {/* Layer 1 — cross-fading slide media only */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfadeTransition}
            className="absolute inset-0"
          >
            <HeroSlideBackground
              slide={slide}
              loading={current === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layer 2 — fixed overlays (do not animate with slides) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-gradient-to-r from-black/45 via-black/10 to-transparent lg:w-1/2" />

      {/* Layer 3 — fixed review badge on the right (demo layout), never tied to slide key */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 flex w-full items-start justify-end pt-6 md:items-center md:pt-0">
        <div className="container mx-auto flex justify-end px-6 md:px-16">
          <GoldStarsReviewBadge className="pointer-events-auto md:mr-[2%] lg:mr-[4%]" />
        </div>
      </div>

      <button
        type="button"
        className="absolute inset-0 z-[5] cursor-pointer"
        aria-label={slide.ctaPath ? slide.cta : undefined}
        onClick={() => {
          if (!dragging.current && slide.ctaPath) navigate(slide.ctaPath);
        }}
      />

      {/* Layer 4 — slide copy cross-fades; controls stay fixed below */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence initial={false}>
          <motion.div
            key={`copy-${slide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={crossfadeTransition}
            className="absolute inset-0"
          >
            {/* Mobile — copy + controls in one bottom stack */}
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 px-6 pb-5 md:hidden">
              {slide.subtitle ? (
                <span className="mb-3 block text-xs font-light uppercase tracking-wider text-white/80">
                  {slide.subtitle}
                </span>
              ) : null}
              <p
                className="mb-4 max-w-[14ch] whitespace-pre-line text-3xl font-light leading-tight tracking-tight text-white"
                aria-live="polite"
              >
                {slide.label}
              </p>
              {slide.cta && slide.ctaPath ? (
                <span
                  className="inline-flex cursor-pointer items-center text-sm font-normal text-white underline-offset-4 transition-all hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(slide.ctaPath);
                  }}
                >
                  {slide.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform hover:translate-x-1" />
                </span>
              ) : null}

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(i);
                      }}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === current ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={t("hero.goToSlide", { num: i + 1 })}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 transition-colors hover:bg-white/10"
                    aria-label={t("hero.prevSlide")}
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 transition-colors hover:bg-white/10"
                    aria-label={t("hero.nextSlide")}
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop — text block clears the separate bottom control bar */}
            <div className="container mx-auto hidden h-full items-end px-6 pb-28 md:flex md:px-16">
              <div className="pointer-events-auto w-full max-w-xl lg:max-w-[45%]">
                {slide.subtitle ? (
                  <span className="mb-3 block text-xs font-light uppercase tracking-wider text-white/80">
                    {slide.subtitle}
                  </span>
                ) : null}
                <p
                  className="mb-6 max-w-[14ch] whitespace-pre-line text-3xl font-light leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
                  aria-live="polite"
                >
                  {slide.label}
                </p>
                {slide.cta && slide.ctaPath ? (
                  <span
                    className="inline-flex cursor-pointer items-center text-sm font-normal text-white underline-offset-4 transition-all hover:underline md:text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(slide.ctaPath);
                    }}
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform hover:translate-x-1" />
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-30 hidden md:block">
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
