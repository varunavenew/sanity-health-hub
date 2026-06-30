import { ChevronLeft, ChevronRight } from "lucide-react";
import { RefObject, useEffect, useState } from "react";

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLElement>;
  /** Where the arrows are visible. Default: mobile only. */
  visibility?: "mobile" | "all" | "desktop";
  className?: string;
  /** Justify-end (default), center, or start. */
  align?: "end" | "center" | "start";
  /** Visual size. compact = smaller, used inline with headings. */
  size?: "default" | "compact";
}

/**
 * Touch-friendly left/right scroll arrows for any horizontal scroller.
 * Disables at start/end of scroll, scrolls by ~one card width per tap.
 */
export const ScrollArrows = ({
  scrollRef,
  visibility = "mobile",
  className = "",
  align = "end",
  size = "default",
}: ScrollArrowsProps) => {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
  const justify =
    align === "center" ? "justify-center" : align === "start" ? "justify-start" : "justify-end";

  const btn =
    size === "compact"
      ? "h-9 w-9"
      : "h-12 w-12";
  const icon = size === "compact" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className={`${vis} items-center ${justify} gap-2 ${className}`}>
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
    </div>
  );
};
