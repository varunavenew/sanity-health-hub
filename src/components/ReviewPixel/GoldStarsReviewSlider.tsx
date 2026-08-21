"use client";

import { useEffect, useRef } from "react";
import { ReviewPixelScript } from "@/components/ReviewPixel/ReviewPixelScript";
import { setupGoldStarsSliderCustomization } from "@/components/ReviewPixel/apply-gold-stars-slider-customization";
import { DEFAULT_GOLD_STARS_WIDGET_ID } from "@/components/ReviewPixel/gold-stars-slider-config";

interface GoldStarsReviewSliderProps {
  widgetId?: string;
  className?: string;
}

export function GoldStarsReviewSlider({
  widgetId = DEFAULT_GOLD_STARS_WIDGET_ID,
  className,
}: GoldStarsReviewSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current?.querySelector("emr-simple-slider");
    if (!(el instanceof HTMLElement)) return undefined;
    return setupGoldStarsSliderCustomization(el);
  }, [widgetId]);

  return (
    <>
      <ReviewPixelScript />
      <div ref={containerRef} className={className}>
        <emr-simple-slider widget-id={widgetId} aria-label="Patient reviews" />
      </div>
    </>
  );
}
