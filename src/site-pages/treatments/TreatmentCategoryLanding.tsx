"use client";

import { AssetImg } from "@/components/AssetImg";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star, User, Users, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { FaqSection } from "@/components/layout/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { combineGeoJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TreatmentCtaButtons } from "@/components/treatments/TreatmentCtaButtons";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import {
  useGoogleReviewSettings,
  useSiteSettings,
  useTreatmentCategory,
} from "@/hooks/useSanity";
import {
  GoogleReviewMark,
  LegelistenReviewMark,
  ReviewSourceBadge,
} from "@/components/reviews/ReviewPlatformMarks";
import { PartialStars } from "@/components/ui/partial-stars";
import { resolveBusinessReputationRatings } from "@/lib/sanity/business-reputation-dual-read";
import type {
  CategoryLandingAudience,
  CategoryLandingExpertArea,
  CategoryLandingReview,
  CategoryLandingSegment,
  CategoryLandingSpotlight,
  CategoryLandingStep,
} from "@/lib/sanity/category-data";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";
import {
  statsGridClass,
  threeCardGridClass,
} from "@/lib/ui/grid-cols-for-count";
import { mergeSectionOrder } from "@/lib/ui/merge-section-order";
import { AnimatedStat } from "@/components/AnimatedStat";
import {
  resolveCmsMedia,
  type ResolvedCmsMedia,
} from "@/lib/sanity/media-dual-read";
import { assetSrc } from "@/lib/media";
import blurSkinMid from "@/assets/blur-skin-mid.jpg";
import { optimizeBackgroundImageUrl } from "@/lib/sanity/image-url";

export type TreatmentCategoryLandingProps = CategoryLandingPageProps & {
  categoryId: string;
};

type HeroMediaKind = "image" | "video";

/** Resolve hero media from shared Media object + legacy fields. */
function resolveCategoryHeroMedia(
  heroMedia: unknown,
  mediaType: HeroMediaKind | undefined,
  heroImage?: string,
  heroVideo?: string,
): ResolvedCmsMedia | null {
  return resolveCmsMedia(heroMedia, {
    mediaType,
    imageUrl: heroImage,
    videoUrl: heroVideo,
  });
}

const SegmentCoupleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <circle cx="32" cy="40" r="13" />
    <circle cx="48" cy="40" r="13" />
  </svg>
);

const SegmentHorizonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="48" x2="68" y2="48" />
    <path d="M20 48 A20 20 0 0 1 60 48" />
    <line x1="40" y1="30" x2="40" y2="24" />
  </svg>
);

const SegmentArchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <circle cx="40" cy="48" r="10" />
    <path d="M18 40 Q40 14 62 40" />
  </svg>
);

const AUDIENCE_ICONS: Record<
  Exclude<CategoryLandingAudience["icon"], "">,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  couple: SegmentCoupleIcon,
  horizon: SegmentHorizonIcon,
  arch: SegmentArchIcon,
  user: User,
  users: Users,
  clock: Clock,
};

/** Shared section head: title + ingress stacked (reference never splits left/right). */
function CategorySectionHead({
  eyebrow,
  title,
  titleAccent,
  description,
  className = "mb-8 md:mb-10",
  titleClassName = "text-3xl md:text-5xl font-light heading-display text-foreground",
  descriptionClassName = "text-base font-light text-muted-foreground leading-relaxed max-w-2xl",
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="text-xs tracking-wide text-foreground/60 mb-4">{eyebrow}</p>
      ) : null}
      <div className="grid gap-y-3 md:gap-y-4">
        <h2 className={titleClassName}>
          {title}
          {titleAccent ? (
            <>
              <br />
              <span className="text-foreground/70">{titleAccent}</span>
            </>
          ) : null}
        </h2>
        {description ? <p className={descriptionClassName}>{description}</p> : null}
      </div>
    </div>
  );
}

/** Reference carousel: edge-bleed cards, progress bar, prev/next (avenewdemo category landings). */
function CategoryReviewsCarousel({
  eyebrow,
  title,
  reviews,
  prevLabel,
  nextLabel,
  progressLabel,
  googleRating,
  legelistenRating,
}: {
  eyebrow?: string;
  title: string;
  reviews: CategoryLandingReview[];
  prevLabel: string;
  nextLabel: string;
  progressLabel: string;
  googleRating: number;
  legelistenRating: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const uniqueCount = reviews.length;

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el || uniqueCount === 0) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const minPct = 100 / (uniqueCount * (uniqueCount + 1));
    const pct =
      maxScroll <= 0 ? 100 : minPct + (el.scrollLeft / maxScroll) * (100 - minPct);
    setProgressPct(Math.min(100, Math.max(minPct, pct)));

    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    const step = firstCard
      ? firstCard.offsetWidth +
        (parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 24)
      : 384;
    const rawIndex = Math.round(el.scrollLeft / Math.max(step, 1));
    setActiveIndex(Math.min(uniqueCount, Math.max(1, rawIndex + 1)));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, [uniqueCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState, uniqueCount]);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    const gap =
      parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 24;
    const step = (firstCard?.offsetWidth || 360) + gap;
    el.scrollBy({ left: dir === "prev" ? -step : step, behavior: "smooth" });
  };

  if (uniqueCount === 0) return null;

  return (
    <section className="bg-brand-warm pt-10 lg:pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
            <div className="max-w-xl">
              {eyebrow ? (
                <p className="text-sm text-brand-dark/60 font-light mb-3">{eyebrow}</p>
              ) : null}
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                {title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
                <GoogleReviewMark className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-dark/60 font-light">Google Reviews</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-normal text-brand-dark">{googleRating}</span>
                    <PartialStars rating={googleRating} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
                <LegelistenReviewMark className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-dark/60 font-light">Legelisten</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-normal text-brand-dark">{legelistenRating}</span>
                    <PartialStars rating={legelistenRating} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide -mx-6 md:-mx-16 px-6 md:px-16 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {reviews.map((r, i) => (
              <div
                key={`${r.author}-${r.date}-${i}`}
                className="flex-shrink-0 w-[78vw] sm:w-[360px] p-6 md:p-8 rounded-sm bg-white border border-brand-dark/10"
              >
                <div className="flex mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-[#FFC107] text-[#FFC107]"
                    />
                  ))}
                </div>
                <p className="text-brand-dark font-light leading-relaxed mb-6 text-sm md:text-base">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                  <div>
                    <p className="text-brand-dark font-normal text-sm">{r.author}</p>
                    <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
                  </div>
                  <ReviewSourceBadge source={r.source || "google"} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 w-full max-w-full overflow-x-clip carousel-nav mt-4">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 w-full">
              <div
                className="relative h-px flex-1 min-w-[48px] bg-brand-dark/15"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={uniqueCount}
                aria-valuenow={activeIndex}
                aria-label={progressLabel}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-brand-dark transition-[width] duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label={prevLabel}
                  disabled={!canPrev}
                  onClick={() => scrollByCard("prev")}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label={nextLabel}
                  disabled={!canNext}
                  onClick={() => scrollByCard("next")}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FertilityExpertRow({
  areas,
  readMoreLabel,
  imageAspect = "16/9",
  seeAllHref,
  seeAllLabel,
}: {
  areas: CategoryLandingExpertArea[];
  readMoreLabel: string;
  imageAspect?: "3/2" | "16/9";
  seeAllHref?: string;
  seeAllLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  progressLabel?: string;
  fillDesktop?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = areas.length;

  if (count === 0) return null;

  return (
    <div className="min-w-0 w-full">
      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-2 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {areas.map((a, index) => (
          <Link
            key={`${a.title || "area"}-${index}`}
            to={a.href}
            className="shrink-0 w-[92%] md:w-auto snap-start flex flex-col group bg-background rounded-2xl overflow-hidden"
          >
            <div
              className={`relative w-full overflow-hidden bg-secondary ${
                imageAspect === "16/9" ? "aspect-[16/9]" : "aspect-[3/2]"
              }`}
            >
              {a.image ? (
                <AssetImg
                  src={a.image}
                  alt={a.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="flex flex-col flex-1 p-7 md:p-8">
              <h3 className="text-lg md:text-xl font-normal text-foreground mb-2.5">
                {a.title}
              </h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-5 flex-1 max-w-md">
                {a.desc}
              </p>
              <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                {readMoreLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="carousel-nav flex flex-col items-start gap-3">
        {count > 1 ? <ScrollArrows scrollRef={scrollRef} className="mt-0" /> : null}
        {seeAllHref && seeAllLabel ? (
          <Link
            to={seeAllHref}
            className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
          >
            {seeAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ExpertAreaCards({
  areas,
  layout,
  readMoreLabel,
  scrollRef,
  /** Fertilitet reference uses ~16/9 flat cards; other categories keep 3/2. */
  imageAspect = "3/2",
  imageRadiusClass = "rounded-t-2xl",
  /** Fertilitet reference: cream rounded cards with soft shadow. */
  cardChrome = "plain",
  /** Fertility: single horizontal row (~5 visible @1440) matching reference strip. */
  fertilityRow = false,
  /** Optional footer link shown below progress nav (Fertilitet). */
  seeAllHref,
  seeAllLabel,
  prevLabel = "Forrige",
  nextLabel = "Neste",
  progressLabel = "Fremdrift i karusell",
  fillDesktop = true,
}: {
  areas: CategoryLandingExpertArea[];
  layout: "grid" | "carousel" | "slides";
  readMoreLabel: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  imageAspect?: "3/2" | "16/9";
  imageRadiusClass?: string;
  cardChrome?: "plain" | "whiteCard";
  fertilityRow?: boolean;
  seeAllHref?: string;
  seeAllLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  progressLabel?: string;
  fillDesktop?: boolean;
}) {
  if (fertilityRow) {
    return (
      <FertilityExpertRow
        areas={areas}
        readMoreLabel={readMoreLabel}
        imageAspect={imageAspect}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        progressLabel={progressLabel}
        fillDesktop={fillDesktop}
      />
    );
  }

  if (layout === "slides") {
    return (
      <div className="w-full">
        {areas.map((a, index) => {
          const imageRight = index % 2 === 0;
          return (
            <article
              key={`${a.title || "area"}-${index}`}
              className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-section bg-secondary/40"
            >
                <div
                  className={`flex items-center px-6 md:px-16 lg:px-20 py-14 lg:py-20 ${
                    imageRight ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="max-w-xl w-full">
                    <h3 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
                      {a.title}
                    </h3>
                    {a.desc ? (
                      <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed mb-8">
                        {a.desc}
                      </p>
                    ) : null}
                    {a.href ? (
                      <Link
                        to={a.href}
                        className="inline-flex items-center text-sm font-light text-foreground gap-2 hover:gap-2.5 transition-all"
                      >
                        {readMoreLabel}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div
                  className={`split-media ${
                    imageRight ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {a.image ? (
                    <AssetImg
                      src={a.image}
                      alt={a.imageAlt || a.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary" />
                  )}
                </div>
            </article>
          );
        })}
      </div>
    );
  }

  const isCarousel = layout === "carousel";
  const isWhiteCard = cardChrome === "whiteCard";

  return (
    <>
      <div
        ref={scrollRef}
        className={
          isCarousel
            ? "flex md:grid md:grid-cols-2 gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
            : "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
        }
        style={{ scrollbarWidth: "none" }}
      >
        {areas.map((a, index) => (
          <Link
            key={`${a.title || "area"}-${index}`}
            to={a.href}
            className={`flex flex-col group ${
              isCarousel
                ? "shrink-0 w-[92%] md:w-auto snap-start"
                : ""
            } ${
              isWhiteCard
                ? "bg-background rounded-2xl overflow-hidden"
                : ""
            }`}
          >
            <div
              className={`relative w-full overflow-hidden bg-secondary ${
                isWhiteCard ? "" : imageRadiusClass
              } ${imageAspect === "16/9" ? "aspect-[16/9]" : "aspect-[3/2]"}`}
            >
              {a.image ? (
                <AssetImg
                  src={a.image}
                  alt={a.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div
              className={`flex flex-col flex-1 ${
                isWhiteCard
                  ? "p-7 md:p-8"
                  : imageAspect === "16/9"
                    ? "pt-6 md:pt-7 pb-1"
                    : "pt-5 md:pt-6"
              }`}
            >
              <h3 className="text-lg md:text-xl font-normal text-foreground mb-2.5">{a.title}</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-5 flex-1 max-w-md">
                {a.desc}
              </p>
              <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                {readMoreLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {isCarousel && scrollRef ? <ScrollArrows scrollRef={scrollRef} /> : null}
    </>
  );
}

type LifePhase = {
  title: string;
  desc: string;
  tags?: { label: string; href?: string }[];
  href?: string;
  cta?: string;
  n?: string;
};

function LifePhasesCarousel({
  phases,
  variant: _variant = "default",
  layout: _layout = "grid",
  showReadMore = true,
}: {
  phases: LifePhase[];
  variant?: "default" | "fertility";
  /**
   * Kept for CMS compat. Demo always uses mobile snap cards + md+ accordion
   * (avenewdemo `pd` LifePhases), so layout no longer forces accordion-only.
   */
  layout?: "grid" | "accordion";
  /** CMS toggle: hide Les mer under each card when false. */
  showReadMore?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const accordion = (
    <Accordion type="single" collapsible className="w-full">
      {phases.map((phase, index) => (
        <AccordionItem
          key={`${phase.title}-${index}`}
          value={phase.n || phase.title}
          className="border-b border-border/30"
        >
          <AccordionTrigger className="text-left text-base md:text-lg font-normal py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <span className="pr-4">{phase.title}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-2">
              <p className="text-sm font-light leading-relaxed mb-5 text-muted-foreground">
                {phase.desc}
              </p>
              {phase.tags && phase.tags.length > 0 ? (
                <div className="mb-5">
                  {phase.tags.map((tag, tagIndex) =>
                    tag.href ? (
                      <Link
                        key={`${tag.label}-${tag.href}-${tagIndex}`}
                        to={tag.href}
                        className="group flex items-center justify-between py-2.5 text-sm font-light text-foreground hover:text-foreground/60 transition-colors border-b border-border/30 last:border-b-0"
                      >
                        <span>{tag.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-muted-foreground" />
                      </Link>
                    ) : (
                      <div
                        key={`${tag.label}-${tagIndex}`}
                        className="py-2.5 text-sm font-light text-foreground border-b border-border/30 last:border-b-0"
                      >
                        {tag.label}
                      </div>
                    ),
                  )}
                </div>
              ) : null}
              {showReadMore && phase.href && phase.cta ? (
                <Link
                  to={phase.href}
                  className="inline-flex items-center text-sm font-normal text-foreground hover:gap-2.5 gap-2 transition-all pb-2"
                >
                  {phase.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  // Demo: mobile horizontal snap cards (w-[92%], next card peeks) → md+ accordion
  return (
    <>
      <div className="md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {phases.map((phase, index) => (
            <article
              key={`${phase.title}-${index}`}
              className="shrink-0 w-[92%] snap-start bg-background rounded-sm border border-border/40 flex flex-col p-6"
            >
              <h3 className="text-base font-normal text-foreground mb-3 leading-snug">
                {phase.title}
              </h3>
              {phase.desc ? (
                <p className="text-sm font-light text-muted-foreground leading-relaxed mb-4">
                  {phase.desc}
                </p>
              ) : null}
              {phase.tags && phase.tags.length > 0 ? (
                <div className="mb-4">
                  {phase.tags.map((tag, tagIndex) =>
                    tag.href ? (
                      <Link
                        key={`${tag.label}-${tag.href}-${tagIndex}`}
                        to={tag.href}
                        className="flex items-center justify-between py-2 text-sm font-light text-foreground border-b border-border/30 last:border-b-0"
                      >
                        <span>{tag.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    ) : (
                      <div
                        key={`${tag.label}-${tagIndex}`}
                        className="py-2 text-sm font-light text-foreground border-b border-border/30 last:border-b-0"
                      >
                        {tag.label}
                      </div>
                    ),
                  )}
                </div>
              ) : null}
              {showReadMore && phase.href && phase.cta ? (
                <Link
                  to={phase.href}
                  className="inline-flex items-center text-sm font-light text-foreground gap-2 mt-auto pt-2"
                >
                  {phase.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        <ScrollArrows scrollRef={scrollRef} />
      </div>

      <div className="hidden md:block">{accordion}</div>
    </>
  );
}

/** Fertility hero title: explicit 3-line break matching avenewdemo (NO). */
function FertilityHeroHeading({
  heading,
  emphasis,
  className,
}: {
  heading: string;
  emphasis?: string;
  className?: string;
}) {
  const normalized = heading.replace(/\s+/g, " ").trim();
  const knownBreaks: Record<string, [string, string]> = {
    "Noen ganger trenger kroppen": ["Noen ganger", "trenger kroppen"],
  };
  const lines = knownBreaks[normalized];
  if (lines) {
    return (
      <h2 className={className}>
        <span className="block">{lines[0]}</span>
        <span className="block">{lines[1]}</span>
        {emphasis ? (
          <span className="block whitespace-pre-line">{emphasis}</span>
        ) : null}
      </h2>
    );
  }
  return (
    <h2 className={className}>
      {heading}
      {emphasis ? (
        <>
          {" "}
          <span className="block whitespace-pre-line">{emphasis}</span>
        </>
      ) : null}
    </h2>
  );
}

function segmentToLifePhase(segment: CategoryLandingSegment): LifePhase {
  const tags =
    segment.tagLinks.length > 0
      ? segment.tagLinks
      : segment.tags.map((label) => ({ label, href: segment.href }));

  return {
    title: segment.title,
    desc: segment.desc,
    tags,
    href: segment.href,
    cta: segment.cta,
    n: segment.id,
  };
}

/**
 * Live avenewdemo `/fertilitet` expert-card order (2-col grid).
 * CMS-sourced titles only — reorders existing areas, does not invent cards.
 */
function orderFertilityExpertAreas(
  areas: CategoryLandingExpertArea[],
): CategoryLandingExpertArea[] {
  const preferred = [
    /^infertilitet$/,
    /^assistert befruktning$/,
    /^fertilitetsutredning$/,
    /^(nedfrysning|nedfrysing) av egg$|^eggfrysing$/,
    /^donorbehandling$/,
    /^sædanalyse$/,
    /^mannlig infertilitet$/,
  ];
  const rank = (title: string) => {
    const t = title.trim().toLowerCase();
    const idx = preferred.findIndex((re) => re.test(t));
    return idx === -1 ? 1000 : idx;
  };
  return [...areas].sort((a, b) => rank(a.title) - rank(b.title));
}

function PatientJourneySection({
  title,
  description,
  steps,
  ctaLabel,
  ctaHref,
  bookingParams,
}: {
  title: string;
  description: string;
  steps: CategoryLandingStep[];
  ctaLabel: string;
  ctaHref: string;
  bookingParams: { kategori: string; tjeneste?: string };
}) {
  if (steps.length === 0) return null;

  const ctaTarget =
    ctaHref ||
    buildBookingUrl(bookingParams);

  const ctaButton = ctaLabel ? (
    <Button
      variant="cta"
      size="lg"
      className="h-12 min-h-12 px-8 rounded-2xl w-full sm:w-auto"
      onClick={() => {
        window.location.href = ctaTarget;
      }}
    >
      {ctaLabel}
    </Button>
  ) : null;

  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-24">
          <div className="lg:col-span-5">
            {title ? (
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                {description}
              </p>
            ) : null}
            {/* Desktop: CTA under intro (demo). Mobile: after steps below. */}
            {ctaButton ? <div className="hidden lg:block">{ctaButton}</div> : null}
          </div>
          <div className="lg:col-span-7">
            <div className="divide-y divide-border/60 border-t border-border/60">
              {steps.map((step, index) => (
                <div key={`${step.n || "step"}-${step.title || ""}-${index}`} className="grid grid-cols-12 gap-4 py-6">
                  <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                    {step.n}
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {ctaButton ? (
          <div className="max-w-6xl mx-auto mt-12 lg:hidden">{ctaButton}</div>
        ) : null}
      </div>
    </section>
  );
}

function SpotlightSection({
  spotlight,
  /** Fertilitet reference: full viewport only at lg+; mobile uses compact media height. */
  matchFertilityReference = false,
}: {
  spotlight: CategoryLandingSpotlight;
  matchFertilityReference?: boolean;
}) {
  if (!spotlight.title && !spotlight.text) return null;

  const title = (
    <>
      {spotlight.title}
      {spotlight.titleEmphasis ? (
        <span className={matchFertilityReference ? "" : "italic"}>
          {" "}
          {spotlight.titleEmphasis}
        </span>
      ) : null}
    </>
  );

  const copy = (
    <div className="px-6 md:px-12 lg:px-20 flex items-center py-10 md:py-14 lg:py-20">
      <div className="max-w-lg">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] text-foreground mb-8">
          {title}
        </h2>
        {spotlight.text ? (
          <p className="text-base font-light text-muted-foreground leading-relaxed mb-10">
            {spotlight.text}
          </p>
        ) : null}
        {spotlight.ctaHref ? (
          <Link
            to={spotlight.ctaHref}
            className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 transition-all"
          >
            {spotlight.ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );

  const media = (
    <div className="split-media bg-secondary/40">
      {spotlight.image ? (
        <AssetImg
          src={spotlight.image}
          alt={spotlight.imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
    </div>
  );

  return (
    <section className="bg-brand-light text-foreground">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-section">
        {copy}
        {media}
      </div>
    </section>
  );
}


const TreatmentCategoryLanding = ({
  isChatOpen,
  categoryId,
  sanityLang = "no",
}: TreatmentCategoryLandingProps) => {
  const { t } = useTranslation();
  const { data: category, isPending } = useTreatmentCategory(categoryId);
  const { data: reviewSettings } = useGoogleReviewSettings();
  const { data: siteSettings } = useSiteSettings();
  const reputation = resolveBusinessReputationRatings(
    siteSettings?.businessReputation,
    reviewSettings,
  );
  const landing = category?.landingPage;
  const heroMedia = resolveCategoryHeroMedia(
    category?.heroMedia,
    category?.heroMediaType,
    category?.heroImage,
    category?.heroVideo,
  );
  const loadingLabel = sanityLang === "en" ? "Loading..." : "Laster...";
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const breadcrumbHomeLabel =
    landing?.breadcrumbHomeLabel?.trim() || t("common.breadcrumbHome");

  if (isPending) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light" aria-live="polite">
            {loadingLabel}
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!landing) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center px-6 text-center">
          <p className="text-muted-foreground font-light max-w-md" aria-live="polite">
            {category?.missingLandingMessage}
          </p>
        </div>
      </PageLayout>
    );
  }

  const {
    hero,
    segmentsSection,
    whySection,
    expertAreasSection,
    supportSection,
    journeySection,
    spotlightSection,
    audiencesSection,
    symptomsSection,
    servicesSection,
    resultsSection,
    reviewsSection,
    sectionOrder,
  } = landing;

  const serviceGroups = servicesSection.groups;
  const stats = category?.stats?.length ? category.stats : [];

  const locale = sanityLang === "en" ? "en" : "nb";
  const categoryPath = category?.slug ? `/${category.slug}` : "";
  const categoryTitle = category?.title || "";
  /** Reference: SEO h1 (sr-only) + visible split-hero h2. */
  const seoTitle =
    landing.srOnlyTitle?.trim() ||
    [hero.heading, hero.headingEmphasis].filter(Boolean).join(" ").trim() ||
    categoryTitle;
  const summaryText = category?.geoSummary?.trim() || "";
  const geoJsonLd = combineGeoJsonLd(
    medicalWebPageJsonLd({
      name: seoTitle || hero.heading,
      description: summaryText.slice(0, 320),
      url: categoryPath,
      inLanguage: locale === "en" ? "en" : "nb-NO",
    }),
  );

  const hasHeroMedia = Boolean(heroMedia);
  const bookingParams = {
    kategori: categoryId,
    ...(hero.primaryBookingService ? { tjeneste: hero.primaryBookingService } : {}),
  };

  const isFullWidthHero = hero.layout === "full";

  const isPregnancy =
    categoryId === "graviditet" || categoryId === "pregnancy";
  const isFertility =
    categoryId === "fertilitet" || categoryId === "fertility";

  /**
   * Lovable Media band uses the ultralyd image — not the hero portrait.
   * When Pregnancy spotlight was incorrectly pointed at the hero asset,
   * reuse the CMS “Tidlig ultralyd” expert-area image (same source as Lovable).
   */
  const pregnancySpotlight: CategoryLandingSpotlight | null = (() => {
    if (!spotlightSection) return null;
    if (!isPregnancy) return spotlightSection;
    const heroCandidate =
      (heroMedia && "src" in heroMedia && typeof (heroMedia as {src?: string}).src === "string"
        ? (heroMedia as {src: string}).src
        : "") ||
      category?.heroImage ||
      "";
    const assetKey = (url: string) => {
      const match = url.match(/\/([a-f0-9]{40,})-/i) || url.match(/images\/[^/]+\/[^/]+\/([^.?/]+)/);
      return (match?.[1] || url.split("?")[0]).toLowerCase();
    };
    const spotUrl = spotlightSection.image || "";
    const sameAsHero =
      Boolean(heroCandidate) &&
      Boolean(spotUrl) &&
      assetKey(heroCandidate) === assetKey(spotUrl);
    if (!sameAsHero) return spotlightSection;
    const ultralyd = expertAreasSection.areas.find((area) =>
      (area.href || "").includes("ultralyd"),
    );
    if (!ultralyd?.image) return spotlightSection;
    return {
      ...spotlightSection,
      image: ultralyd.image,
      imageAlt: ultralyd.imageAlt || spotlightSection.imageAlt,
    };
  })();

  /** Baseline order for non-Pregnancy categories (reference: no FAQ on category landings). */
  const DEFAULT_ORDER = [
    "segments", "why", "audiences", "expertAreas",
    "symptoms", "services", "support", "results",
    "reviews", "spotlight", "journey",
  ];
  /**
   * Fertility reference (avenewdemo `/behandlinger/fertilitet`):
   * specialists band sits after spotlight / before booking CTA.
   */
  const FERTILITY_ORDER = [
    "segments",
    "why",
    "audiences",
    "expertAreas",
    "symptoms",
    "services",
    "support",
    "results",
    "reviews",
    "spotlight",
    "specialists",
    "journey",
  ];
  /**
   * Lovable Pregnancy order: FAQ mid-page, Media (spotlight) -> Specialists -> Journey.
   * Applied only for graviditet/pregnancy when CMS sectionOrder is empty.
   */
  /**
   * Pregnancy reference: "Det du lurer på…" mid-page (CMS FAQ collection),
   * then why → slides → … → specialists → journey. Other categories omit FAQ.
   */
  const PREGNANCY_ORDER = [
    "segments",
    "faq",
    "why",
    "expertAreas",
    "services",
    "results",
    "reviews",
    "spotlight",
    "specialists",
    "journey",
  ];
  /**
   * Prefer Sanity sectionOrder when present, but never drop known sections.
   * Partial CMS orders keep unlisted keys at their template positions
   * (avoids Fertility audiences/expertAreas sliding below symptoms/services).
   */
  const order = mergeSectionOrder(
    sectionOrder,
    isPregnancy
      ? PREGNANCY_ORDER
      : isFertility
        ? FERTILITY_ORDER
        : DEFAULT_ORDER,
    ["specialists", "faq"],
  );
  const orderIncludesFaq = order.includes("faq");
  const orderIncludesSpecialists = order.includes("specialists");
  /**
   * When specialists are mid-page via sectionOrder, keep journey in the loop.
   * Otherwise park journey after the shared specialists band (main behaviour).
   */
  const orderForLoop = orderIncludesSpecialists
    ? order
    : order.filter((key) => key !== "journey");

  const faqItems = (category?.faqs ?? []).map((faq, i) => ({
    id: `category-faq-${i}`,
    question: faq.question,
    answer: faq.answer,
  }));

  const renderFaq = () => (
    <FaqSection
      faqs={faqItems}
      title={category?.faqSectionTitle?.trim() || undefined}
      description={category?.faqSectionDescription?.trim() || undefined}
      defaultOpenFirst={Boolean(category?.faqOpenFirst)}
      sectionClassName="py-10 md:py-14"
    />
  );

  const specialistSections = (category?.pageSections || []).filter(
    (section) => section._type === "pageSectionSpecialists",
  );

  /* ├ó”Γé¼├ó”Γé¼ Section registry ├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼
     Each key matches a value in the Sanity `sectionOrder` array.
     Sections whose data is empty return null automatically.
     Optional keys `faq` and `specialists` let CMS place those mid-page
     (used by Pregnancy); other categories omit them and keep legacy placement.
  ├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼├ó”Γé¼ */
  const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
    segments: () =>
      segmentsSection.segments.length > 0 ? (
        <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-10">
          <div className="page-shell">
            <div className="max-w-3xl mx-auto">
              <div className="max-w-2xl mb-8">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  {segmentsSection.title}
                  {segmentsSection.titleLine2 ? <span className="block">{segmentsSection.titleLine2}</span> : null}
                </h2>
              </div>
              <LifePhasesCarousel
                phases={segmentsSection.segments.map(segmentToLifePhase)}
                variant={isFertility ? "fertility" : "default"}
                layout={segmentsSection.layout}
                showReadMore={segmentsSection.showReadMore}
              />
            </div>
          </div>
        </section>
      ) : null,

    why: () =>
      whySection.steps.length > 0 ? (
        <section className="section-flush bg-background">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 split-section">
            <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20 flex items-center">
              <div className="max-w-xl">
                {whySection.eyebrow ? <p className="text-xs tracking-wide text-foreground/60 mb-5">{whySection.eyebrow}</p> : null}
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">{whySection.title}</h2>
                {whySection.description ? (
                  <div className="space-y-5 mb-12">
                    {whySection.description
                      .split(/\n+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="text-base font-light text-muted-foreground leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                ) : null}
                <div className="divide-y divide-border/60 border-t border-border/60">
                  {whySection.steps.map((step, index) => (
                    <div key={`${step.n || "step"}-${index}`} className="grid grid-cols-12 gap-4 py-6">
                      <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
                      <div className="col-span-10 md:col-span-11">
                        <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {whySection.footerLinkHref ? (
                  <Link to={whySection.footerLinkHref} className="inline-flex items-center gap-2 mt-8 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all">
                    {whySection.footerLinkLabel}<ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="lg:col-span-5 split-media bg-secondary/40">
              {whySection.image ? (
                <AssetImg
                  src={whySection.image}
                  alt={whySection.imageAlt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null,

    audiences: () =>
      audiencesSection.audiences.length > 0 ? (
        <section className="bg-secondary/40 py-10">
          <div className="page-shell">
            <div className="max-w-6xl mx-auto">
              {(() => {
                const rawTitle = audiencesSection.title;
                const rawAccent = audiencesSection.titleAccent;
                const dashParts =
                  isFertility && !rawAccent && /—/.test(rawTitle)
                    ? rawTitle.split(/\s*—\s*/)
                    : null;
                return (
              <CategorySectionHead
                eyebrow={audiencesSection.eyebrow}
                title={dashParts ? `${dashParts[0]} —` : rawTitle}
                titleAccent={dashParts ? dashParts.slice(1).join(" — ") : rawAccent}
                className="mb-8 md:mb-10"
              />
                );
              })()}
              <div className={`${threeCardGridClass(audiencesSection.audiences.length)} gap-4 md:gap-6`}>
                {audiencesSection.audiences.map((a) => {
                  const Icon = a.icon ? AUDIENCE_ICONS[a.icon] : null;
                  return (
                    <div
                      key={a.title}
                      className="bg-background rounded-sm border border-border/40 flex flex-col overflow-hidden"
                    >
                      {a.image ? (
                        <div
                          className={`relative overflow-hidden bg-secondary ${
                            isFertility ? "aspect-[16/9]" : "aspect-[3/2]"
                          }`}
                        >
                          <AssetImg
                            src={a.image}
                            alt={a.title}
                            preset="card"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="pt-7 px-7 text-foreground/80">
                          {Icon ? <Icon className="w-6 h-6" strokeWidth={1.25} aria-hidden="true" /> : null}
                        </div>
                      )}
                      <div className="p-7 md:p-8 flex flex-col flex-1">
                        <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1 max-w-md">{a.desc}</p>
                        {a.href ? (
                          <Link to={a.href} className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all self-start">
                            {a.ctaLabel.trim() ||
                              audiencesSection.readMoreLabel.trim() ||
                              t("hero.readMore")}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null,

    expertAreas: () =>
      expertAreasSection.areas.length > 0 ? (
        expertAreasSection.layout === "slides" ? (
          <section className="bg-secondary/40">
            <div className="container mx-auto px-6 md:px-16 pt-10 md:pt-14 pb-5">
              <div className="max-w-6xl mx-auto">
                <CategorySectionHead
                  eyebrow={expertAreasSection.eyebrow}
                  title={expertAreasSection.title}
                  description={expertAreasSection.description}
                  className="mb-0"
                />
              </div>
            </div>
            <ExpertAreaCards
              areas={expertAreasSection.areas}
              layout="slides"
              readMoreLabel={
                expertAreasSection.readMoreLabel.trim() || t("hero.readMore")
              }
            />
          </section>
        ) : (
          <section className="bg-secondary/40 py-10 overflow-x-clip">
            <div className="page-shell min-w-0">
              <div className="max-w-6xl mx-auto min-w-0">
                {(() => {
                  const rawTitle = expertAreasSection.title;
                  const dashParts =
                    isFertility && /—/.test(rawTitle)
                      ? rawTitle.split(/\s*—\s*/)
                      : null;
                  return (
                <CategorySectionHead
                  eyebrow={expertAreasSection.eyebrow}
                  title={dashParts ? dashParts[0] : rawTitle}
                  titleAccent={
                    dashParts ? `— ${dashParts.slice(1).join(" — ")}` : undefined
                  }
                  description={expertAreasSection.description}
                />
                  );
                })()}
                <ExpertAreaCards
                  areas={
                    isFertility
                      ? orderFertilityExpertAreas(expertAreasSection.areas)
                      : expertAreasSection.areas
                  }
                  layout="grid"
                  fertilityRow
                  readMoreLabel={
                    expertAreasSection.readMoreLabel.trim() || t("hero.readMore")
                  }
                  scrollRef={expertAreasRef}
                  imageAspect={isFertility ? "16/9" : "3/2"}
                  imageRadiusClass="rounded-t-2xl"
                  cardChrome="whiteCard"
                  seeAllHref={isFertility ? `/behandlinger/${categoryId}` : undefined}
                  seeAllLabel={isFertility ? "Se alle behandlinger" : undefined}
                />
              </div>
            </div>
          </section>
        )
      ) : null,

    symptoms: () =>
      symptomsSection.items.length > 0 ? (
        <SymptomServiceSection
          background={symptomsSection.background || "background"}
          eyebrow={symptomsSection.eyebrow}
          title={symptomsSection.title}
          description={symptomsSection.description}
          layoutVariant={isFertility ? "fertility" : "default"}
          items={symptomsSection.items.map((item) => ({
            symptom: item.symptom,
            service: item.service,
            href: item.href,
            image: item.image,
            imageAlt: item.imageAlt,
          }))}
        />
      ) : null,

    services: () =>
      serviceGroups.length > 0 ? (
        <section className="bg-brand-light text-foreground py-10">
          <div className="page-shell">
            <div className="max-w-6xl mx-auto">
              <CategorySectionHead
                title={servicesSection.title}
                description={servicesSection.description}
                className="mb-6 md:mb-8"
                descriptionClassName={
                  isFertility
                    ? "text-base font-light text-muted-foreground leading-relaxed max-w-none"
                    : undefined
                }
              />
              <div className="space-y-8">
                {serviceGroups.map((group, index) => (
                  <div key={`${group.label || "group"}-${index}`}>
                    {group.label ? (
                      <p className="text-sm font-light text-muted-foreground mb-3">
                        {group.label}
                      </p>
                    ) : null}
                    <ul className="border-t border-brand-dark/10">
                      {group.items.map((s, idx) => (
                        <li key={`${s.title || "service"}-${idx}`} className="border-b border-brand-dark/10">
                          <Link
                            to={s.href}
                            className={`grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] items-center gap-4 sm:gap-10 group ${
                              isFertility ? "py-4" : "py-5"
                            }`}
                          >
                            <h3 className="text-base font-normal text-foreground group-hover:text-foreground/70 transition-colors">{s.title}</h3>
                            {s.desc ? <p className="hidden sm:block text-sm font-light text-muted-foreground leading-snug">{s.desc}</p> : <span className="hidden sm:block" />}
                            <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors justify-self-end" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null,

    support: () =>
      supportSection.areas.length > 0 ? (
        <section className="bg-brand-light overflow-x-clip pt-8 md:pt-10 pb-10">
          <div className="page-shell min-w-0">
            <div className="max-w-6xl mx-auto min-w-0">
              <div className="max-w-2xl mb-8 md:mb-10 grid gap-y-3 md:gap-y-4">
                {supportSection.title ? (
                  <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">{supportSection.title}</h2>
                ) : null}
                {supportSection.description ? (
                  <p className="text-base font-light text-muted-foreground leading-relaxed">{supportSection.description}</p>
                ) : null}
              </div>
              <ExpertAreaCards
                areas={supportSection.areas}
                layout="grid"
                fertilityRow
                readMoreLabel={supportSection.readMoreLabel.trim() || t("hero.readMore")}
                imageAspect={isFertility ? "16/9" : "3/2"}
                imageRadiusClass="rounded-t-2xl"
                cardChrome="whiteCard"
              />
            </div>
          </div>
        </section>
      ) : null,

    results: () =>
      stats.length > 0 ? (
        <section className="relative overflow-hidden text-brand-beige pt-10 lg:pt-20 pb-10 md:pb-12">
          {/* Shared stats band: raw blur-skin texture (same for all categories). */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute inset-x-0 -top-24 -bottom-24 bg-cover bg-center"
              style={{
                backgroundImage: `url(${optimizeBackgroundImageUrl(assetSrc(blurSkinMid))})`,
              }}
            />
          </div>
          <div className="container mx-auto px-6 md:px-16 relative">
            <div className="max-w-6xl mx-auto">
              {isFertility ? (
                <div className="mb-10 md:mb-12 max-w-4xl">
                  {resultsSection.eyebrow ? (
                    <p className="text-xs tracking-wide text-brand-beige/70 mb-4 uppercase">
                      {resultsSection.eyebrow}
                    </p>
                  ) : null}
                  <div className="grid gap-y-3 md:gap-y-4">
                    <h2 className="text-3xl md:text-5xl font-light leading-tight text-brand-beige">
                      {resultsSection.title}
                    </h2>
                    {resultsSection.description ? (
                      <p className="text-base font-light text-brand-beige/85 leading-relaxed max-w-xl">
                        {resultsSection.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-10 md:mb-12">
                  <div className="lg:col-span-5">
                    {resultsSection.eyebrow ? (
                      <p className="text-xs tracking-wide text-brand-beige/70 mb-4 uppercase">
                        {resultsSection.eyebrow}
                      </p>
                    ) : null}
                    <h2 className="text-3xl md:text-5xl font-light leading-tight text-brand-beige">
                      {resultsSection.title}
                    </h2>
                  </div>
                  <div className="lg:col-span-7 lg:flex lg:items-end">
                    {resultsSection.description ? (
                      <p className="text-base font-light text-brand-beige/85 leading-relaxed max-w-xl">
                        {resultsSection.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="border-t border-brand-beige/20 py-8 md:py-10">
                {resultsSection.categoryLabel ? (
                  <p className="text-[11px] tracking-[0.18em] text-brand-beige/80 mb-6 uppercase">
                    {resultsSection.categoryLabel}
                  </p>
                ) : null}
                <dl
                  className={`${statsGridClass(stats.length)} gap-y-8 md:gap-y-0 md:divide-x divide-brand-beige/25`}
                >
                  {stats.map((row, i) => (
                    <div
                      key={row.label}
                      className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === stats.length - 1 ? "md:pr-0" : ""}`}
                    >
                      <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3 text-brand-beige">
                        <AnimatedStat value={row.value} />
                      </dd>
                      <dt className="text-sm font-normal text-brand-beige mb-1">
                        {row.label}
                      </dt>
                      {row.sub ? (
                        <p className="text-xs font-light text-brand-beige/75">{row.sub}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
              {resultsSection.footnote ? (
                <p className="text-xs font-light text-brand-beige/70 mt-8">
                  {resultsSection.footnote}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null,

    reviews: () =>
      reviewsSection.reviews.length > 0 ? (
        <CategoryReviewsCarousel
          eyebrow={reviewsSection.eyebrow}
          title={reviewsSection.title}
          reviews={reviewsSection.reviews}
          prevLabel={sanityLang === "en" ? "Previous" : "Forrige"}
          nextLabel={sanityLang === "en" ? "Next" : "Neste"}
          progressLabel={
            sanityLang === "en" ? "Carousel progress" : "Fremdrift i karusell"
          }
          googleRating={reputation.googleAverageRating}
          legelistenRating={reputation.legelistenAverageRating}
        />
      ) : null,

    spotlight: () =>
      pregnancySpotlight ? (
        <SpotlightSection
          spotlight={pregnancySpotlight}
          matchFertilityReference={isFertility}
        />
      ) : null,

    journey: () =>
      journeySection.steps.length > 0 ? (
        <PatientJourneySection
          title={journeySection.title}
          description={journeySection.description}
          steps={journeySection.steps}
          ctaLabel={journeySection.ctaLabel}
          ctaHref={journeySection.ctaHref}
          bookingParams={bookingParams}
        />
      ) : null,

    faq: () => renderFaq(),

    specialists: () =>
      specialistSections.length > 0 ? (
        <PageSectionsRenderer
          sections={specialistSections}
          specialistsLayoutVariant="category"
        />
      ) : null,
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <JsonLd data={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd} />

      {/* Hero ├óΓé¼” always first, not part of sectionOrder */}
      {isFullWidthHero ? (
        <header className="relative">
          <div className="relative split-hero overflow-hidden flex items-end pb-12 lg:pb-16 px-6 md:px-16 lg:px-20 text-white pt-32">
            <div className="absolute inset-0 z-0 overflow-hidden bg-secondary/40">
              {heroMedia ? (
                <SplitHeroMedia
                  className="absolute inset-0"
                  media={heroMedia}
                  alt={hero.heroImageAlt}
                  loading="eager"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/45" aria-hidden="true" />
            </div>
            <div className="relative z-10 max-w-4xl w-full">
              <nav aria-label="breadcrumb" className="text-xs font-light text-white/70 flex items-center gap-2 mb-6">
                <Link to="/" className="hover:text-white transition-colors">{breadcrumbHomeLabel}</Link>
                <span aria-hidden="true">›</span>
                <span className="text-white/90">{categoryTitle}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
                {hero.heading}
                {hero.headingEmphasis ? (
                  <>
                    {" "}
                    <span className="block whitespace-pre-line">{hero.headingEmphasis}</span>
                  </>
                ) : null}
              </h1>
            </div>
          </div>
          <div className="bg-brand-light py-12 lg:py-16 border-b border-brand-dark/10">
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7">
                  {hero.body ? <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground whitespace-pre-line">{hero.body}</p> : null}
                </div>
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {hero.entryPriceLabel && hero.entryPriceValue ? (
                    <div className="text-sm font-light text-foreground/80 mb-2">
                      <span className="block text-base text-foreground font-normal">{hero.entryPriceLabel}</span>
                      <span className="block text-muted-foreground font-light">{hero.entryPriceValue}</span>
                    </div>
                  ) : null}
                  <TreatmentCtaButtons
                    primaryLabel={hero.primaryCtaLabel}
                    callLabel={hero.secondaryCtaLabel}
                    onPrimary={() => {
                      window.location.href = buildBookingUrl(bookingParams);
                    }}
                    className="w-full"
                  />
                  {hero.helpText ? (
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      {hero.helpText}
                    </p>
                  ) : null}
                </div>
              </div>
              {hero.bullets && hero.bullets.length > 0 ? (
                <div className="mt-10 pt-8 border-t border-brand-dark/10">
                  <ul className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm font-light text-foreground">
                    {hero.bullets.map((u, index) => (
                      <li key={`${u}-${index}`} className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-foreground" aria-hidden="true" /><span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </header>
      ) : (
        <header className="bg-brand-light pt-[4.5rem] lg:pt-0">
          <h1 className="sr-only">{seoTitle || categoryTitle || hero.heading}</h1>
          <div className="lg:hidden page-edge-text-left pb-4">
            <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
              <Link to="/" className="hover:text-foreground">{breadcrumbHomeLabel}</Link>
              <span aria-hidden="true">›</span>
              <span className="text-foreground/80">{categoryTitle}</span>
            </nav>
            {isFertility ? (
              <FertilityHeroHeading
                heading={hero.heading}
                emphasis={hero.headingEmphasis}
                className="text-4xl font-light text-foreground leading-[1.05]"
              />
            ) : (
              <h2 className="text-4xl font-light text-foreground leading-[1.05]">
                {hero.heading}
                {hero.headingEmphasis ? (
                  <>
                    {" "}
                    <span className="block whitespace-pre-line">{hero.headingEmphasis}</span>
                  </>
                ) : null}
              </h2>
            )}
          </div>
          <div
            className={`flex flex-col-reverse ${
              hasHeroMedia ? "lg:grid lg:grid-cols-2 split-hero" : ""
            }`}
          >
            <div className="flex items-center page-edge-text-left py-16">
              <div className="w-full max-w-xl">
                <nav aria-label="breadcrumb" className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
                  <Link to="/" className="hover:text-foreground">{breadcrumbHomeLabel}</Link>
                  <span aria-hidden="true">›</span>
                  <span className="text-foreground/80">{categoryTitle}</span>
                </nav>
                {isFertility ? (
                  <FertilityHeroHeading
                    heading={hero.heading}
                    emphasis={hero.headingEmphasis}
                    className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]"
                  />
                ) : (
                  <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                    {hero.heading}
                    {hero.headingEmphasis ? (
                      <>
                        {" "}
                        <span className="block whitespace-pre-line">{hero.headingEmphasis}</span>
                      </>
                    ) : null}
                  </h2>
                )}
                {hero.body ? (
                  <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground whitespace-pre-line">
                    {hero.body}
                  </p>
                ) : null}
                {hero.entryPriceLabel && hero.entryPriceValue ? (
                  <div className="mb-4 text-sm font-light text-foreground/80">
                    <span className="block text-base text-foreground">{hero.entryPriceLabel}</span>
                    <span className="block">{hero.entryPriceValue}</span>
                  </div>
                ) : null}
                <TreatmentCtaButtons
                  primaryLabel={hero.primaryCtaLabel}
                  callLabel={hero.secondaryCtaLabel}
                  onPrimary={() => {
                    window.location.href = buildBookingUrl(bookingParams);
                  }}
                  className={`w-full ${hero.helpText ? "mb-4" : "mb-10"}`}
                />
                {hero.helpText ? (
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-10">
                    {hero.helpText}
                  </p>
                ) : null}
                {hero.bullets.length > 0 ? (
                  <ul className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm font-light text-foreground">
                    {hero.bullets.map((u, index) => (
                      <li key={`${u}-${index}`} className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-foreground" aria-hidden="true" /><span>{u}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
            {hasHeroMedia && heroMedia ? (
              <SplitHeroMedia
                className="split-media bg-secondary/40 order-1 lg:order-none"
                media={heroMedia}
                alt={hero.heroImageAlt}
                loading="eager"
              />
            ) : null}
          </div>
          <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
        </header>
      )}

      {/* Dynamic section loop — CMS sectionOrder (+ Pregnancy defaults / merge). */}
      {orderForLoop.map((key) => {
        const render = SECTION_RENDERERS[key];
        return render ? <Fragment key={key}>{render()}</Fragment> : null;
      })}

      {/* FAQ is only rendered via SECTION_RENDERERS when present in sectionOrder. */}

      {/* Shared bands: Specialists → Journey (when not mid-page) → Insurance → Booking CTA */}
      <PageSectionsRenderer
        sections={category?.pageSections}
        specialistsLayoutVariant="category"
        excludeTypes={
          orderIncludesSpecialists ? ["pageSectionSpecialists"] : undefined
        }
        afterSpecialists={
          orderIncludesSpecialists
            ? undefined
            : (SECTION_RENDERERS.journey?.() ?? null)
        }
      />
    </PageLayout>
  );
};

export default TreatmentCategoryLanding;

