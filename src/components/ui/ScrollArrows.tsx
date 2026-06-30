import { ChevronLeft, ChevronRight } from "lucide-react";
import { RefObject, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLElement>;
  /** Where the arrows are visible. Default: mobile only. */
  visibility?: "mobile" | "all" | "desktop";
  className?: string;
  /** Justify-end (default), center, or start. (Used in inline mode only.) */
  align?: "end" | "center" | "start";
  /** Visual size. compact = smaller. */
  size?: "default" | "compact";
  /**
   * Placement strategy:
   *  - "above" (default): portaled to <body> and positioned absolutely just above
   *    the scroll container's top-right corner, following it on scroll/resize.
   *    Lets every existing call site automatically render arrows above the
   *    carousel without restructuring the page.
   *  - "inline": render in place (legacy behavior).
   */
  placement?: "above" | "inline";
}

/**
 * Touch-friendly left/right scroll arrows for any horizontal scroller.
 * Default: floats above the scroller's top-right on mobile so the arrows sit
 * next to the section heading instead of below the cards.
 */
export const ScrollArrows = ({
  scrollRef,
  visibility = "mobile",
  className = "",
  align = "end",
  size = "compact",
  placement = "above",
}: ScrollArrowsProps) => {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef]);

  // Track scroller position for "above" placement
  useLayoutEffect(() => {
    if (placement !== "above") return;
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setPos({
        top: r.top + window.scrollY - 44, // 44px above the scroller
        left: r.left + window.scrollX,
        width: r.width,
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [scrollRef, placement]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!canPrev && !canNext) return null;

  const vis =
    visibility === "mobile"
      ? "flex md:hidden"
      : visibility === "desktop"
      ? "hidden md:flex"
      : "flex";

  const btn = size === "compact" ? "h-9 w-9" : "h-12 w-12";
  const icon = size === "compact" ? "w-4 h-4" : "w-6 h-6";

  const buttons = (
    <>
      <button
        type="button"
        aria-label="Scroll venstre"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        className={`${btn} rounded-full bg-brand-dark text-background flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition-opacity active:scale-95 shadow-md`}
      >
        <ChevronLeft className={icon} />
      </button>
      <button
        type="button"
        aria-label="Scroll høyre"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        className={`${btn} rounded-full bg-brand-dark text-background flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition-opacity active:scale-95 shadow-md`}
      >
        <ChevronRight className={icon} />
      </button>
    </>
  );

  if (placement === "above") {
    if (!pos || typeof document === "undefined") return null;
    return createPortal(
      <div
        className={`${vis} items-center justify-end gap-2 absolute z-30 pointer-events-none`}
        style={{
          top: pos.top,
          left: pos.left,
          width: pos.width,
          paddingRight: 16,
        }}
      >
        <div className="flex gap-2 pointer-events-auto">{buttons}</div>
      </div>,
      document.body,
    );
  }

  const justify =
    align === "center" ? "justify-center" : align === "start" ? "justify-start" : "justify-end";
  return (
    <div className={`${vis} items-center ${justify} gap-2 ${className}`}>
      {buttons}
    </div>
  );
};
