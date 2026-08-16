"use client";

import { useState } from "react";
import { Quote, ArrowRight, User } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import type { HomepageReview } from "@/lib/sanity/homepage-data";
import {
  GoogleReviewMark,
  LegelistenReviewMark,
  ReviewSourceBadge,
} from "@/components/reviews/ReviewPlatformMarks";

const ReviewCard = ({ review }: { review: HomepageReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const maxLength = 120;
  const isLongText = review.text.length > maxLength;
  const displayText = isExpanded ? review.text : review.text.slice(0, maxLength);
  const isAnonymous = review.name === "Anonym";

  return (
    <div className="group relative flex-shrink-0 w-[380px] p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
      <div className="mb-4">
        <PartialStars rating={review.rating || 5} />
      </div>
      <p className="text-brand-dark font-light leading-relaxed mb-2 text-base">
        "{displayText}{isLongText && !isExpanded && '...'}"
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-brand-dark/60 hover:text-brand-dark underline mb-4"
        >
          {isExpanded ? t("reviews.readLess") : t("reviews.readMore")}
        </button>
      )}
      {!isLongText && <div className="mb-4" />}
      <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
        <div>
          <p className={`text-brand-dark ${isAnonymous ? 'italic text-brand-dark/60 font-light' : 'font-normal'} flex items-center gap-2`}>
            {isAnonymous && <User className="w-3.5 h-3.5" />}
            {review.name}
          </p>
          <p className="text-xs text-brand-dark/60 font-light">{review.date}</p>
        </div>
        <ReviewSourceBadge source={review.source} />
      </div>
    </div>
  );
};

export const GoogleReviewsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: homepage } = useHomepage();
  const section = homepage?.reviewsSection;

  if (!section?.reviews.length) return null;

  const duplicatedReviews = [...section.reviews, ...section.reviews];

  return (
    <section className="py-24 md:py-32 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-xl">
            {section.subheading ? (
              <p className="text-sm text-brand-dark/60 font-light mb-3">{section.subheading}</p>
            ) : null}
            {section.heading ? (
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">{section.heading}</h2>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
              <GoogleReviewMark className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">Google Reviews</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-normal text-brand-dark">{section.googleAverageRating}</span>
                  <div className="flex"><PartialStars rating={section.googleAverageRating} /></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-sm bg-white border border-brand-dark/10">
              <LegelistenReviewMark className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs text-brand-dark/60 font-light">{t("reviews.legelistenLabel")}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-normal text-brand-dark">{section.legelistenAverageRating}</span>
                  <div className="flex"><PartialStars rating={section.legelistenAverageRating} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none" />
        <div className="flex w-max gap-6 animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      {(section.ctaTitle || section.ctaSubtitle) && (
        <div className="container mx-auto px-6 md:px-16 mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-sm bg-brand-dark">
            <div className="text-center sm:text-left">
              {section.ctaTitle ? (
                <p className="text-white font-normal mb-1">{section.ctaTitle}</p>
              ) : null}
              {section.ctaSubtitle ? (
                <p className="text-white/70 text-sm font-light">{section.ctaSubtitle}</p>
              ) : null}
            </div>
            <Button
              variant="cta-dark"
              size="lg"
              onClick={() => navigate('/booking')}
            >
              {t("nav.bookAppointment")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
