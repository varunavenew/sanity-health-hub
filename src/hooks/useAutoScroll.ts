"use client";

import { useEffect, type RefObject } from "react";

type UseAutoScrollOptions = {
  enabled?: boolean;
  /** Loop by jumping back when scroll passes half of duplicated content. */
  seamless?: boolean;
  /** Pixels advanced per animation frame. */
  speed?: number;
  /** Pause duration after user interaction (ms). */
  resumeDelayMs?: number;
};

/**
 * Continuous horizontal auto-scroll for marquee-style carousels.
 * Pauses on touch / pointer hover and resumes after a short delay.
 */
export function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  {
    enabled = true,
    seamless = false,
    speed = 0.6,
    resumeDelayMs = 2500,
  }: UseAutoScrollOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    let paused = false;
    let resumeTimer = 0;

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };

    const scheduleResume = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, resumeDelayMs);
    };

    const onTouchStart = () => pause();
    const onTouchEnd = () => scheduleResume();
    const onMouseEnter = () => pause();
    const onMouseLeave = () => {
      paused = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      if (!paused) {
        el.scrollLeft += speed;

        if (seamless) {
          const loopPoint = el.scrollWidth / 2;
          if (loopPoint > 0 && el.scrollLeft >= loopPoint) {
            el.scrollLeft -= loopPoint;
          }
        } else {
          const maxScroll = el.scrollWidth - el.clientWidth;
          if (maxScroll > 0 && el.scrollLeft >= maxScroll) {
            el.scrollLeft = 0;
          }
        }
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [ref, enabled, seamless, speed, resumeDelayMs]);
}
