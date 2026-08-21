"use client";

import { ArrowRight, ShieldCheck, FileX, Clock } from "lucide-react";
import { PartialStars } from "@/components/ui/partial-stars";
import { Link } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { googleRatingData } from "@/data/googleReviews";
import {
  GoogleReviewMark,
  LegelistenReviewMark,
} from "@/components/reviews/ReviewPlatformMarks";
import { GoldStarsReviewSlider } from "@/components/ReviewPixel/GoldStarsReviewSlider";

interface GoogleReviewsSectionProps {
  showTrustSection?: boolean;
}

export const GoogleReviewsSection = ({ showTrustSection = true }: GoogleReviewsSectionProps) => {
  const { t } = useTranslation();
  const { data: homepage } = useHomepage();
  const section = homepage?.reviewsSection;

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
              <GoogleReviewMark className="w-5 h-5 shrink-0" />
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
              <LegelistenReviewMark className="w-5 h-5 shrink-0" />
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

      <div className="relative mt-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-warm to-transparent z-10 pointer-events-none hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-warm to-transparent z-10 pointer-events-none hidden md:block" />
        <GoldStarsReviewSlider />
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
