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

    const step = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!paused && el.scrollWidth > el.clientWidth + 1) {
        const next = el.scrollLeft + pxPerSecond * dt;
        if (seamless) {
          const half = el.scrollWidth / 2;
          el.scrollLeft = next >= half ? next - half : next;
        } else {
          const max = el.scrollWidth - el.clientWidth;
          el.scrollLeft = next >= max - 0.5 ? 0 : next;
        }
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
  }, [ref, pxPerSecond, enabled, resumeDelayMs, seamless]);
}
