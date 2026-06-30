import { RefObject, useEffect } from "react";

/**
 * Slow continuous horizontal auto-scroll for marquee-style mobile carousels.
 * Pauses while user interacts (touch / pointer down / wheel) and resumes after a
 * short idle delay. Loops back to the start when reaching the end.
 *
 * pxPerSecond defaults to ~25 — same calm pace as the desktop marquee.
 */
export function useAutoScroll(
  ref: RefObject<HTMLElement>,
  options: { pxPerSecond?: number; enabled?: boolean; resumeDelayMs?: number } = {},
) {
  const { pxPerSecond = 25, enabled = true, resumeDelayMs = 2500 } = options;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    // Respect reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer: number | null = null;

    const step = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!paused && el.scrollWidth > el.clientWidth + 1) {
        const next = el.scrollLeft + pxPerSecond * dt;
        const max = el.scrollWidth - el.clientWidth;
        if (next >= max - 0.5) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(step);
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, resumeDelayMs);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [ref, pxPerSecond, enabled, resumeDelayMs]);
}
