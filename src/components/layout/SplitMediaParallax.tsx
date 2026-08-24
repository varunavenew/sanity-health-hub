"use client";

import { useEffect } from "react";
import { useLocation } from "@/lib/router";

/** Matches the approved demo: zoomed crop plus a slow vertical drift. */
const SCALE = 1.14;
const Y_RANGE = 80;

function applyLayer(box: HTMLElement, reduced: boolean) {
  const layer = box.firstElementChild as HTMLElement | null;
  if (!layer) return;

  if (reduced) {
    layer.style.transform = "";
    layer.style.willChange = "";
    return;
  }

  const vh = window.innerHeight || 1;
  const rect = box.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > vh) return;

  const y = Math.max(-48, Math.min(48, (0.5 - rect.top / vh) * Y_RANGE));
  layer.style.transformOrigin = "center center";
  layer.style.willChange = "transform";
  layer.style.transform = `translate3d(0px, ${y.toFixed(3)}px, 0px) scale(${SCALE})`;
}

/**
 * Subtle Ken Burns / parallax on split-hero (and marked) media columns.
 * Targets `.split-media` used by treatment, category, specialist, and SplitHero pages.
 */
export function SplitMediaParallax() {
  const location = useLocation();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const boxes = () =>
      document.querySelectorAll<HTMLElement>(".split-media, [data-split-parallax]");

    const update = () => {
      const reduced = motion.matches;
      boxes().forEach((box) => applyLayer(box, reduced));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);

    const observer = new MutationObserver(onScroll);
    observer.observe(document.getElementById("main-content") ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", onScroll);
    };
  }, [location.pathname]);

  return null;
}
