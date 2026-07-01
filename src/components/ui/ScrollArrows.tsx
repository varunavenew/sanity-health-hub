import { RefObject, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLElement>;
  /** Where the indicator is visible. Default: mobile only. */
  visibility?: "mobile" | "all" | "desktop";
  className?: string;
  /**
   * For seamless/looping carousels that duplicate children, pass the
   * original slide count so the dot bar shows N dots (not 2N) and
   * active index wraps via modulo.
   */
  slideCount?: number;
  /** Legacy props — kept for backwards compat, no longer used. */
  align?: "end" | "center" | "start";
  size?: "default" | "compact";
  placement?: "above" | "inline" | "below";
}

/**
 * Mobile pagination dots for any horizontal scroller.
 *
 * Kunde-ønske: dots i stedet for prev/next-piler på kort-karuseller —
 * samme stil som under hero/«tjenester»-seksjonen. Komponentnavnet beholdes
 * (ScrollArrows) for å unngå brede refactors; alle eksisterende
 * `<ScrollArrows scrollRef={ref} />` rendrer nå dots automatisk.
 *
 * Hvordan det fungerer:
 *  - Hver direkte child i scroll-containeren regnes som ett "kort"/slide.
 *  - Aktiv prikk = kortet hvis senter er nærmest viewportens senter.
 *  - Klikk på en prikk scroller til tilsvarende kort (snap-friendly).
 *  - Plasseres i en portal rett under scrolleren, sentrert, så
 *    eksisterende call sites ikke trenger layout-endringer.
 */
export const ScrollArrows = ({
  scrollRef,
  visibility = "mobile",
  className = "",
}: ScrollArrowsProps) => {
  const [count, setCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [overflowing, setOverflowing] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Observe scroller: child count, active slide, overflow state
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const computeActive = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const kids = Array.from(el.children) as HTMLElement[];
      let bestIdx = 0;
      let bestDist = Infinity;
      kids.forEach((c, i) => {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      setActiveIdx(bestIdx);
    };

    const update = () => {
      setCount(el.children.length);
      setOverflowing(el.scrollWidth - el.clientWidth > 4);
      computeActive();
    };

    update();

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        computeActive();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));

    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [scrollRef]);

  // Track scroller position for portal placement (just below the carousel)
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 8, // 8px below scroller
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
  }, [scrollRef]);

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (!card) return;
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  };

  if (!overflowing || count <= 1 || !pos || typeof document === "undefined") return null;

  const vis =
    visibility === "mobile"
      ? "flex md:hidden"
      : visibility === "desktop"
      ? "hidden md:flex"
      : "flex";

  return createPortal(
    <div
      className={`${vis} items-center justify-center absolute z-20 pointer-events-none ${className}`}
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width,
      }}
    >
      <div
        className="flex items-center gap-2 pointer-events-auto"
        role="tablist"
        aria-label="Karusell-indikator"
      >
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Gå til kort ${i + 1}`}
            aria-selected={i === activeIdx}
            role="tab"
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? "w-6 bg-brand-dark" : "w-1.5 bg-brand-dark/25"
            }`}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
};
