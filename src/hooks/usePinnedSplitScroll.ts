import { useEffect, useMemo } from "react";

type UsePinnedSplitScrollOptions = {
  /** The section that should be "pinned" while we route wheel scroll into the inner scroller */
  sectionEl: HTMLElement | null;
  /** The inner scroll container (right column) */
  scrollEl: HTMLElement | null;
  /** Enable/disable the behavior (e.g. only on desktop) */
  enabled?: boolean;
  /** Offset from top (e.g. sticky header height) before we consider the section "pinned" */
  topOffset?: number;
};

/**
 * When the user reaches the section, keep it visually fixed (via CSS sticky) and
 * route mouse-wheel scroll into the right-side container until it reaches top/bottom.
 * After that, normal page scroll resumes to the next section.
 */
export function usePinnedSplitScroll({
  sectionEl,
  scrollEl,
  enabled = true,
  topOffset = 0,
}: UsePinnedSplitScrollOptions) {
  const isEnabled = useMemo(
    () => enabled && !!sectionEl && !!scrollEl,
    [enabled, sectionEl, scrollEl]
  );

  useEffect(() => {
    if (!isEnabled || !sectionEl || !scrollEl) return;

    let ticking = false;

    const isPinnedInViewport = () => {
      const rect = sectionEl.getBoundingClientRect();
      // Consider the section "active" as long as its top has reached the sticky header offset
      // and the section is still on screen (so we keep routing wheel into the inner scroller).
      return rect.top <= topOffset && rect.bottom > topOffset + 1;
    };

    const canScrollInner = (deltaY: number) => {
      const atTop = scrollEl.scrollTop <= 0;
      const atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1;

      if (deltaY < 0) return !atTop;
      if (deltaY > 0) return !atBottom;
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinnedInViewport()) return;

      // If the inner container can consume this scroll, intercept page scroll.
      if (canScrollInner(e.deltaY)) {
        e.preventDefault();
        // Use deltaY directly; clamp is handled by scroll container.
        scrollEl.scrollTop += e.deltaY;
      }
    };

    const onResizeOrScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
      });
    };

    // Capture so we can preventDefault even if the wheel event originates over the left image.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("resize", onResizeOrScroll, { passive: true });
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any, { capture: true } as any);
      window.removeEventListener("resize", onResizeOrScroll as any);
      window.removeEventListener("scroll", onResizeOrScroll as any);
    };
  }, [isEnabled, sectionEl, scrollEl]);
}
