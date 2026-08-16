"use client";

import { useRef, useState } from "react";
import { ArrowRight, User, ShieldCheck, FileX, Clock } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { Link } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useTranslation } from "react-i18next";
import {
  googleReviews as staticReviews,
  googleRatingData,
  type GoogleReview,
} from "@/data/googleReviews";
import type { HomepageReview } from "@/lib/sanity/homepage-data";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

const LegelistenIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0A7E8C"/>
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2z" fill="white"/>
    <path d="M12 13c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z" fill="white"/>
  </svg>
);

const SourceBadge = ({ source }: { source: "google" | "legelisten" }) => (
  <div className="flex items-center gap-1.5 text-xs text-brand-dark/75">
    {source === "google" ? <GoogleIcon /> : <LegelistenIcon />}
    <span>{source === "google" ? "Google" : "Legelisten"}</span>
  </div>
);

const getSource = (review: HomepageReview): "google" | "legelisten" =>
  (review as { source?: "google" | "legelisten" }).source === "legelisten"
    ? "legelisten"
    : "google";

function toGoogleReview(review: HomepageReview, index: number): GoogleReview {
  return {
    id: Number.parseInt(review.id, 10) || index,
    name: review.name,
    rating: review.rating,
    text: review.text,
    date: review.date,
    source: getSource(review),
  };
}

const ReviewCard = ({ review }: { review: GoogleReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const maxLength = 120;
  const isLongText = review.text.length > maxLength;
  const displayText = isExpanded ? review.text : review.text.slice(0, maxLength);
  const isAnonymous = review.name === "Anonym";

  return (
    <div className="group relative flex-shrink-0 w-[380px] p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        <PartialStars rating={review.rating || 5} />
      </div>
      <p className="text-brand-dark font-light leading-relaxed mb-2 text-base">
        "{displayText}{isLongText && !isExpanded && "..."}"
      </p>
      {isLongText ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-brand-dark/60 hover:text-brand-dark underline mb-4"
        >
          {isExpanded ? t("reviews.readLess") : t("reviews.readMore")}
        </button>
      ) : (
        <div className="mb-4" />
      )}
      <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
        <div>
          <p
            className={`text-brand-dark ${isAnonymous ? "italic text-brand-dark/60 font-light" : "font-normal"} flex items-center gap-2`}
          >
            {isAnonymous && <User className="w-3.5 h-3.5" />}
            {review.name}
          </p>
          <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
        </div>
        <SourceBadge source={review.source} />
      </div>
    </div>
  );
};

interface GoogleReviewsSectionProps {
  showTrustSection?: boolean;
}

export const GoogleReviewsSection = ({ showTrustSection = true }: GoogleReviewsSectionProps) => {
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { data: homepage } = useHomepage();
  const section = homepage?.reviewsSection;

  const googleReviewsList =
    section?.reviews.length
      ? section.reviews.map(toGoogleReview)
      : staticReviews;

  const duplicatedReviews = [...googleReviewsList, ...googleReviewsList];
  const mobileLoop = googleReviewsList.length > 1;
  const mobileList = mobileLoop ? duplicatedReviews : googleReviewsList;

  useAutoScroll(mobileScrollRef, { enabled: mobileLoop, seamless: true });

  if (googleReviewsList.length === 0) return null;

  const averageRating = section?.googleAverageRating ?? googleRatingData.averageRating;
  const legelistenRating = section?.legelistenAverageRating ?? 4.8;
  const heading = section?.heading || t("reviews.heading");
  const ctaTitle = section?.ctaTitle || t("reviews.ctaTitle");

  const trustHeading =
    ctaTitle.replace(/Over\s*(150|60)\s*000\+?\s*/i, "").replace(/^[a-zæøå]/, (c) => c.toUpperCase()) ||
    "Pasientbesøk i året.";

  return (
    <section className="py-10 md:py-14 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">{heading}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-sm bg-white border border-brand-dark/10 min-w-0">
              <GoogleIcon />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">Google Reviews</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-normal text-brand-dark">{averageRating}</span>
                  <div className="flex">
                    <PartialStars rating={averageRating} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-sm bg-white border border-brand-dark/10 min-w-0">
              <LegelistenIcon />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">{t("reviews.legelistenLabel")}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-normal text-brand-dark">{legelistenRating}</span>
                  <div className="flex">
                    <PartialStars rating={legelistenRating} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: infinite marquee */}
      <div className="relative mt-8 hidden md:block">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Mobile: seamless auto-scroll marquee, still manually swipeable */}
      <div className="md:hidden mt-4">
        <div
          ref={mobileScrollRef}
          className={`flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 ${mobileLoop ? "" : "snap-x snap-proximity"}`}
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
        >
          {mobileList.map((review, idx) => {
            const isAnonymous = review.name === "Anonym";
            return (
              <div
                key={`${review.id}-${idx}`}
                className={`flex-shrink-0 w-[78vw] p-6 rounded-sm bg-white border border-brand-dark/10 ${mobileLoop ? "" : "snap-center"}`}
              >
                <div className="mb-3">
                  <PartialStars rating={review.rating || 5} />
                </div>
                <p className="text-brand-dark font-light leading-relaxed text-sm mb-3">
                  "{review.text.length > 140 ? `${review.text.slice(0, 140)}...` : review.text}"
                </p>
                <div className="pt-3 border-t border-brand-dark/10 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm text-brand-dark ${isAnonymous ? "italic text-brand-dark/60 font-light" : "font-normal"} flex items-center gap-2`}
                    >
                      {isAnonymous && <User className="w-3.5 h-3.5" />}
                      {review.name}
                    </p>
                    <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
                  </div>
                  <SourceBadge source={review.source} />
                </div>
              </div>
            );
          })}
        </div>
        <ScrollArrows
          scrollRef={mobileScrollRef}
          slideCount={googleReviewsList.length}
          className="px-6 md:px-16 mt-4"
          progressLabel={t("reviews.progressLabel")}
          prevLabel={t("reviews.scrollLeft")}
          nextLabel={t("reviews.scrollRight")}
        />
      </div>

      {showTrustSection ? (
        <div className="container mx-auto px-6 md:px-16 mt-10 md:mt-14">
          <div className="max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8 mb-8 md:mb-12">
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-7xl font-light leading-none tracking-tight text-brand-dark">
                    150&thinsp;000<span className="text-brand-mid font-extralight ml-1">+</span>
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                  {trustHeading}
                </h2>
              </div>

              <div className="pb-1">
                <Link
                  to="/tjenester"
                  className="group inline-flex items-center gap-3 text-sm font-light border-b border-brand-mid pb-2 hover:border-brand-dark transition-colors"
                >
                  Se våre tjenester
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-dark/10 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">
                  {t("valueBadges.tech")}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FileX className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">
                  Ingen henvisninger
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-brand-dark/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm leading-snug font-light text-brand-dark/70">Kort ventetid</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
