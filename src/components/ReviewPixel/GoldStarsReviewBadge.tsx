"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ReviewPixelScript } from "@/components/ReviewPixel/ReviewPixelScript";
import { setupGoldStarsBadgeCustomization } from "@/components/ReviewPixel/apply-gold-stars-badge-customization";
import { DEFAULT_GOLD_STARS_BADGE_WIDGET_ID } from "@/components/ReviewPixel/gold-stars-badge-config";
import { cn } from "@/lib/utils";

interface GoldStarsReviewBadgeProps {
  widgetId?: string;
  className?: string;
  /** Hero = white text on dark/photo backgrounds; light = warm-dark text. */
  variant?: "hero" | "light";
}

const variantClassName: Record<NonNullable<GoldStarsReviewBadgeProps["variant"]>, string> = {
  hero: "",
  light:
    "inline-flex rounded-sm border border-brand-dark/10 bg-white px-4 py-3.5 sm:px-5 sm:py-4 [&_emr-simple-badge]:bg-transparent",
};

const variantStyle: Record<NonNullable<GoldStarsReviewBadgeProps["variant"]>, CSSProperties> = {
  hero: {},
  light: {
    ["--cmgs-badge-text" as string]: "#42332A",
    ["--cmgs-badge-shadow" as string]: "none",
  },
};

export function GoldStarsReviewBadge({
  widgetId = DEFAULT_GOLD_STARS_BADGE_WIDGET_ID,
  className,
  variant = "hero",
}: GoldStarsReviewBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current?.querySelector("emr-simple-badge");
    if (!(el instanceof HTMLElement)) return undefined;
    return setupGoldStarsBadgeCustomization(el);
  }, [widgetId]);

  return (
    <>
      <ReviewPixelScript />
      <div
        ref={containerRef}
        className={cn(variantClassName[variant], className)}
        style={variantStyle[variant]}
        aria-label="Patient rating"
      >
        <emr-simple-badge widget-id={widgetId} />
      </div>
    </>
  );
}
