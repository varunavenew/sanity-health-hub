"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Matches the #419 large-screen shell. Laptop (1440) is unchanged. */
export const LARGE_SCREEN_MQ = "(min-width: 1920px)";

/**
 * At 1920px+, centre the carousel track when every card fits in the shell,
 * otherwise left-align so the first card shares the heading's left edge.
 * Uses measured scrollWidth vs clientWidth — not a hardcoded card count.
 */
export function useCarouselFitAlign(
  ref: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia(LARGE_SCREEN_MQ);

    const sync = () => {
      const wasCentered = el.classList.contains("carousel-track--center");
      el.classList.remove("carousel-track--center");
      if (mq.matches) {
        const overflowing = el.scrollWidth > el.clientWidth + 1;
        if (!overflowing) {
          el.classList.add("carousel-track--center");
          if (el.scrollLeft !== 0) el.scrollLeft = 0;
        }
      }
      if (wasCentered !== el.classList.contains("carousel-track--center")) {
        el.dispatchEvent(new Event("scroll"));
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    for (const child of Array.from(el.children)) {
      if (child instanceof Element) ro.observe(child);
    }
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      el.classList.remove("carousel-track--center");
    };
  }, [ref, itemCount]);
}
