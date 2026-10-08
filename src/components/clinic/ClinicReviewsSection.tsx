"use client";

import type { ReactNode } from "react";
import { GoldStarsReviewSlider } from "@/components/ReviewPixel/GoldStarsReviewSlider";
import { GoldStarsReviewBadge } from "@/components/ReviewPixel/GoldStarsReviewBadge";
import { DEFAULT_GOLD_STARS_BADGE_WIDGET_ID } from "@/components/ReviewPixel/gold-stars-badge-config";
import { DEFAULT_GOLD_STARS_WIDGET_ID } from "@/components/ReviewPixel/gold-stars-slider-config";
import { useGoldStarsLocationReviews } from "@/components/ReviewPixel/useGoldStarsLocationReviews";

export type ClinicReviews = {
  heading?: string;
  sliderWidgetId?: string;
  badgeWidgetId?: string;
  /** Gold Stars `location_id` — filters the site-wide feed to this clinic. */
  locationId?: number;
};

interface ClinicReviewsSectionProps {
  reviews?: ClinicReviews;
  heading: string;
}

/**
 * Gold Stars band on clinic pages, in priority order:
 * 1. Clinic-specific widget IDs (Clinic → Patient reviews) — shown as-is.
 * 2. Gold Stars location ID — site-wide feed filtered to this clinic's `location_id`.
 *    Hidden if the clinic has none (never falls back to other clinics' reviews).
 *    No average is computed from that feed: the slider widget only returns 4–5 star
 *    reviews, so it would overstate the rating. The badge shows only when the clinic
 *    has its own badge widget ID (correct numbers from Gold Stars).
 * 3. Neither set — the same site-wide slider/badge as the homepage.
 */
export function ClinicReviewsSection({ reviews, heading }: ClinicReviewsSectionProps) {
  const useLocationFilter = !reviews?.sliderWidgetId && typeof reviews?.locationId === "number";
  const locationQuery = useGoldStarsLocationReviews(useLocationFilter ? reviews?.locationId : undefined);
  const title = reviews?.heading || heading;

  if (useLocationFilter) {
    const locationReviews = locationQuery.data;
    if (!locationReviews || locationReviews.length === 0) return null;
    return (
      <ReviewsBand
        title={title}
        badge={
          reviews?.badgeWidgetId ? (
            <GoldStarsReviewBadge widgetId={reviews.badgeWidgetId} variant="light" className="w-fit" />
          ) : null
        }
        slider={<GoldStarsReviewSlider reviews={locationReviews} />}
      />
    );
  }

  const sliderWidgetId = reviews?.sliderWidgetId || DEFAULT_GOLD_STARS_WIDGET_ID;
  const badgeWidgetId = reviews?.badgeWidgetId || DEFAULT_GOLD_STARS_BADGE_WIDGET_ID;

  return (
    <ReviewsBand
      title={title}
      badge={<GoldStarsReviewBadge widgetId={badgeWidgetId} variant="light" className="w-fit" />}
      slider={<GoldStarsReviewSlider widgetId={sliderWidgetId} />}
    />
  );
}

function ReviewsBand({ title, badge, slider }: { title: string; badge: ReactNode; slider: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand-warm py-10 md:py-14">
      <div className="container relative mx-auto px-6 md:px-16">
        <div className="flex flex-col items-start">
          {badge ? (
            <div className="order-1 mb-4 flex w-full items-end justify-start md:order-2 md:mb-4 md:mt-8 md:justify-end">
              {badge}
            </div>
          ) : null}
          <h2 className="order-2 max-w-xl text-2xl font-light leading-tight text-brand-dark md:order-1 md:text-3xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative mt-6 md:mt-0">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-24 bg-gradient-to-r from-brand-warm to-transparent md:block" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-24 bg-gradient-to-l from-brand-warm to-transparent md:block" />
        {slider}
      </div>
    </section>
  );
}
