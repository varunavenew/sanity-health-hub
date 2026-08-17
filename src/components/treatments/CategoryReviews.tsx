"use client";

import { useEffect, useMemo, useRef } from "react";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartialStars } from "@/components/ui/partial-stars";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import {
  GoogleReviewMark,
  LegelistenReviewMark,
  ReviewSourceBadge,
  normalizeReviewSource,
} from "@/components/reviews/ReviewPlatformMarks";
import { useGoogleReviews, useGoogleReviewSettings, useSiteSettings } from "@/hooks/useSanity";
import { resolveBusinessReputationRatings } from "@/lib/sanity/business-reputation-dual-read";

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ida", "siri", "eggfrys", "egg", "ivf", "osteopat", "ingvild"],
  fertilitet: ["fertil", "ivf", "eggfrys", "egg", "prøverør", "befruktning", "embryo", "jackson", "birgitte"],
  urologi: ["urolog", "prostata", "nicolai", "wessel", "robot"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "operasjon", "kirurg", "haugstvedt", "warholm", "kristian"],
  graviditet: ["gravid", "foster", "fødsel", "ultralyd", "nipt"],
};

/** Slow continuous drift — similar feel to former CSS marquee. */
const AUTO_SCROLL_PX_PER_SEC = 32;
const RESUME_AFTER_MS = 2200;

interface CategoryReviewsProps {
  categoryId: string;
  categoryTitle: string;
  /** Optional CMS heading override for this treatment. */
  sectionTitle?: string;
  /** When set (non-empty), use these instead of automatic category keyword matching. */
  curatedReviews?: Array<{
    id: string;
    name: string;
    rating: number;
    text: string;
    date?: string;
    source: "google" | "legelisten";
  }>;
}

/**
 * Treatment-page reviews: auto-running track + swipe / drag / progress / arrows.
 * Prefers CMS-selected Google + Legelisten reviews when present.
 */
export const CategoryReviews = ({
  categoryId,
  categoryTitle,
  sectionTitle,
  curatedReviews,
}: CategoryReviewsProps) => {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: allReviews = [] } = useGoogleReviews();
  const { data: settings } = useGoogleReviewSettings();
  const { data: siteSettings } = useSiteSettings();
  const isEn = (i18n.language || "no").toLowerCase().startsWith("en");

  const reviews = useMemo(() => {
    if (curatedReviews && curatedReviews.length > 0) {
      return curatedReviews.map((r) => ({
        id: r.id,
        name: r.name,
        rating: r.rating,
        text: r.text,
        date: r.date || "",
        source: normalizeReviewSource(r.source),
      }));
    }

    const keywords = categoryKeywords[categoryId] || [];
    const mapped = allReviews.map((r, i) => ({
      id: String(i),
      name: r.name,
      rating: r.rating,
      text: r.text,
      date: r.date,
      source: normalizeReviewSource(r.source),
    }));
    if (keywords.length === 0) return mapped.slice(0, 8);

    const matched = mapped.filter((r) =>
      keywords.some((kw) => r.text.toLowerCase().includes(kw) || r.name.toLowerCase().includes(kw)),
    );
    if (matched.length >= 6) return matched.slice(0, 8);
    const remaining = mapped.filter((r) => !matched.includes(r));
    return [...matched, ...remaining].slice(0, 8);
  }, [allReviews, categoryId, curatedReviews]);

  // Duplicate for seamless loop while auto-scrolling.
  const track = useMemo(
    () => (reviews.length > 1 ? [...reviews, ...reviews] : reviews),
    [reviews],
  );

  const pauseAuto = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const scheduleResume = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      if (!draggingRef.current) pausedRef.current = false;
    }, RESUME_AFTER_MS);
  };

  // Auto-scroll + pointer/touch drag (mobile cursor / finger).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reviews.length < 2) return;

    el.style.scrollBehavior = "auto";

    let raf = 0;
    let last = performance.now();
    let dragStartX = 0;
    let dragStartScroll = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!pausedRef.current && !draggingRef.current) {
        const loopAt = el.scrollWidth / 2;
        if (loopAt > 8) {
          el.scrollLeft += (AUTO_SCROLL_PX_PER_SEC * dt) / 1000;
          if (el.scrollLeft >= loopAt - 1) {
            el.scrollLeft -= loopAt;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      pauseAuto();
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartX;
      el.scrollLeft = dragStartScroll - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      el.classList.remove("cursor-grabbing");
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      scheduleResume();
    };

    const onWheel = () => {
      pauseAuto();
      scheduleResume();
    };

    const onEnter = () => {
      if (window.matchMedia("(hover: hover)").matches) pauseAuto();
    };
    const onLeave = () => {
      if (window.matchMedia("(hover: hover)").matches) scheduleResume();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reviews.length]);

  const ratings = resolveBusinessReputationRatings(
    siteSettings?.businessReputation,
    settings,
  );
  const googleRating = ratings.googleAverageRating;
  const legelistenRating = ratings.legelistenAverageRating;

  if (reviews.length === 0) return null;

  return (
    <section className="bg-brand-warm pt-10 md:pt-14 pb-10 md:pb-14 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
            <div className="max-w-xl">
              <p className="text-sm text-brand-dark/50 font-light mb-2">
                {t("reviews.categoryEyebrow")}
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                {sectionTitle?.trim() ||
                  t("reviews.categoryHeading", { category: categoryTitle.toLowerCase() })}
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
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide -mx-6 md:-mx-16 px-6 md:px-16 pb-2 cursor-grab touch-pan-x select-none"
            style={{
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "auto",
            }}
            onFocusCapture={pauseAuto}
            onBlurCapture={scheduleResume}
          >
            {track.map((review, index) => {
              const isAnonymous = review.name === "Anonym";
              const text =
                review.text.length > 120
                  ? `${review.text.slice(0, 120)}...`
                  : review.text;
              return (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 w-[78vw] sm:w-[360px] p-6 md:p-8 rounded-sm bg-white border border-brand-dark/10"
                >
                  <div className="mb-4">
                    <PartialStars rating={review.rating} />
                  </div>
                  <p className="text-brand-dark font-light leading-relaxed mb-6 text-sm md:text-base">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                    <div>
                      <p
                        className={`text-brand-dark text-sm ${
                          isAnonymous
                            ? "italic text-brand-dark/60 font-light"
                            : "font-normal"
                        } flex items-center gap-2`}
                      >
                        {isAnonymous ? <User className="w-3.5 h-3.5" /> : null}
                        {review.name}
                      </p>
                      <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
                    </div>
                    <ReviewSourceBadge source={review.source} />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            onPointerDown={pauseAuto}
            onPointerUp={scheduleResume}
            onMouseEnter={pauseAuto}
            onMouseLeave={scheduleResume}
          >
            <ScrollArrows
              scrollRef={scrollRef}
              visibility="all"
              className="mt-4"
              slideCount={reviews.length}
              progressLabel={isEn ? "Carousel progress" : "Fremdrift i karusell"}
              prevLabel={isEn ? "Previous" : "Forrige"}
              nextLabel={isEn ? "Next" : "Neste"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
