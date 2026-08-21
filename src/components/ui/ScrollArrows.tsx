"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type ScrollArrowsProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  className?: string;
  /** Show on mobile only (default), desktop only, or always. */
  visibility?: "mobile" | "desktop" | "all";
  /** Optional slide count override for aria progress. */
  slideCount?: number;
  /** Optional trailing link/content under the nav row. */
  trailing?: ReactNode;
  /** Progress / button labels */
  progressLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
};

/**
 * Demo-parity carousel nav (avenewdemo `Xt`):
 * progress bar + circular prev/next, updates on scroll.
 */
export function ScrollArrows({
  scrollRef,
  className = "",
  visibility = "mobile",
  slideCount,
  trailing,
  progressLabel = "Fremdrift i karusell",
  prevLabel = "Scroll venstre",
  nextLabel = "Scroll høyre",
}: ScrollArrowsProps) {
  const [childCount, setChildCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [needsNav, setNeedsNav] = useState(false);
  const rafRef = useRef(0);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(
      maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollLeft / maxScroll)) : 0,
    );
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < maxScroll - 2);
    setNeedsNav(maxScroll > 4);

    const children = Array.from(el.children) as HTMLElement[];
    setChildCount(children.length);
    const left = el.scrollLeft;
    let index = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i].offsetLeft + children[i].offsetWidth > left + 8) {
        index = i;
        break;
      }
    }
    setActiveIndex(index);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        sync();
      });
    };

    sync();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    const mo = new MutationObserver(sync);
    mo.observe(el, { childList: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef, sync]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const gap =
      parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) ||
      8;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!needsNav || childCount <= 1) {
    if (!trailing) return null;
    return (
      <div className={`flex items-center justify-start w-full max-w-full carousel-nav ${className}`}>
        {trailing}
      </div>
    );
  }

  const total =
    slideCount && slideCount > 0 ? Math.min(slideCount, childCount) : childCount;
  const current = total > 0 ? (activeIndex % total) + 1 : 1;

  const visibilityClass =
    visibility === "mobile"
      ? "flex md:hidden"
      : visibility === "desktop"
        ? "hidden md:flex"
        : "flex";

  const btnClass =
    "w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      className={`${visibilityClass} flex-col items-start gap-4 w-full max-w-full overflow-x-clip carousel-nav ${className}`}
    >
      <div className="flex items-center gap-3 md:gap-4 min-w-0 w-full">
        <div
          className="relative h-px flex-1 min-w-[48px] bg-brand-dark/15"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
          aria-label={progressLabel}
        >
          <div
            className="absolute inset-y-0 left-0 bg-brand-dark transition-[width] duration-200"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label={prevLabel}
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className={btnClass}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className={btnClass}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      {trailing ? <div className="w-full">{trailing}</div> : null}
    </div>
  );
}
