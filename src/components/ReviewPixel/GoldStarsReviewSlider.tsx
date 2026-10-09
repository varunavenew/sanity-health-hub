"use client";

import { useEffect, useRef } from "react";
import { ReviewPixelScript } from "@/components/ReviewPixel/ReviewPixelScript";
import { setupGoldStarsSliderCustomization } from "@/components/ReviewPixel/apply-gold-stars-slider-customization";
import { DEFAULT_GOLD_STARS_WIDGET_ID } from "@/components/ReviewPixel/gold-stars-slider-config";
import type { GoldStarsReview } from "@/components/ReviewPixel/gold-stars-reviews-api";

interface GoldStarsReviewSliderProps {
  widgetId?: string;
  className?: string;
  /** Show only these reviews (e.g. filtered by clinic `location_id`) instead of the widget's full feed. */
  reviews?: GoldStarsReview[];
}

export function GoldStarsReviewSlider({
  widgetId = DEFAULT_GOLD_STARS_WIDGET_ID,
  className,
  reviews,
}: GoldStarsReviewSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Fresh widget element whenever the review set changes — the customization mutates its DOM.
  const elementKey = reviews ? `${widgetId}:${reviews.map((review) => review.id).join(",")}` : widgetId;

  useEffect(() => {
    const el = containerRef.current?.querySelector("emr-simple-slider");
    if (!(el instanceof HTMLElement)) return undefined;
    return setupGoldStarsSliderCustomization(el, { reviews });
  }, [widgetId, reviews]);

  return (
    <>
      <ReviewPixelScript />
      <div ref={containerRef} className={className}>
        <emr-simple-slider key={elementKey} widget-id={widgetId} aria-label="Patient reviews" />
      </div>
    </>
  );
}
