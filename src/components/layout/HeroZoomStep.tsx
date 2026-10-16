"use client";

import { useEffect } from "react";
import { resolveHeroZoomStep } from "@/lib/media/hero-zoom-step";

const MAX_STEP = 4;
const LG_MIN_WIDTH = 1024;

/**
 * Adds cumulative `hero-zoom-step-1…4` classes to <html> so the hero photo
 * step-down in index.css also applies when a smaller screen is zoomed out.
 */
export function HeroZoomStep() {
  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const step =
        window.innerWidth >= LG_MIN_WIDTH
          ? resolveHeroZoomStep({
              innerWidth: window.innerWidth,
              outerWidth: window.outerWidth,
            })
          : 0;
      for (let i = 1; i <= MAX_STEP; i += 1) {
        root.classList.toggle(`hero-zoom-step-${i}`, i <= step);
      }
    };

    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      for (let i = 1; i <= MAX_STEP; i += 1) root.classList.remove(`hero-zoom-step-${i}`);
    };
  }, []);

  return null;
}
