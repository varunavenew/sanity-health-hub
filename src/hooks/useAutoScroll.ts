import { RefObject, useEffect } from "react";

/**
 * Continuous horizontal auto-scroll for mobile marquee-style carousels.
 *
 * - `seamless: true` expects the caller to render items TWICE in the DOM.
 *   The scroll position wraps at half the scrollWidth for a truly seamless loop.
 * - Pauses briefly on user interaction (touch / pointer / wheel) then resumes.
 * - Respects `prefers-reduced-motion`.
 */
export function useAutoScroll(
  ref: RefObject<HTMLElement>,
  options: {
    pxPerSecond?: number;
    enabled?: boolean;
    resumeDelayMs?: number;
    seamless?: boolean;
  } = {},
) {
  const {
    pxPerSecond = 25,
    enabled = true,
    resumeDelayMs = 2500,
    seamless = false,
  } = options;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer: number | null = null;

    // Track the position in a float — reading back `scrollLeft` can round
    // sub-pixel increments away, which stalls slow marquee scrolling.
    let pos = el.scrollLeft;

    const step = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;
      if (!paused && el.scrollWidth > el.clientWidth + 1) {
        // Re-sync if the user (or arrows) moved the scroller.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
        pos += pxPerSecond * dt;
        if (seamless) {
          const half = el.scrollWidth / 2;
          if (pos >= half) pos -= half;
        } else {
          const max = el.scrollWidth - el.clientWidth;
          if (pos >= max - 0.5) pos = 0;
        }
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };


    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
        last = performance.now();
      }, resumeDelayMs);
    };

    const hoverPause = () => { paused = true; if (resumeTimer) window.clearTimeout(resumeTimer); };
    const hoverResume = () => { paused = false; last = performance.now(); };

    el.addEventListener("mouseenter", hoverPause);
    el.addEventListener("mouseleave", hoverResume);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener("mouseenter", hoverPause);
      el.removeEventListener("mouseleave", hoverResume);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [ref, pxPerSecond, enabled, resumeDelayMs, seamless]);
}
