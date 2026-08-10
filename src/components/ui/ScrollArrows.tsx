import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollArrowsProps {
  scrollRef: RefObject<HTMLElement>;
  /** Where the indicator is visible. Default: all breakpoints. */
  visibility?: "mobile" | "all" | "desktop";
  className?: string;
  /**
   * For seamless/looping carousels that duplicate children, pass the
   * original slide count so the counter shows N (not 2N).
   */
  slideCount?: number;
  /**
   * Valgfri tekstlenke («Se alle behandlinger» o.l.). Navigasjonen ligger til
   * venstre, lenken til høyre på samme rad — de skal aldri overlappe.
   */
  trailing?: ReactNode;
  /** Legacy props — kept for backwards compat, no longer used. */
  align?: "end" | "center" | "start";
  size?: "default" | "compact";
  placement?: "above" | "inline" | "below";
}


/**
 * CarouselNav — én felles navigasjon for alle horisontale karuseller.
 *
 * Design: tynn fremdriftslinje (venstrejustert) + teller «X av Y», med
 * venstre/høyre-piler til høyre. Ingen prikke-rader (de ble både rotete
 * og bredere enn viewporten på mobil).
 *
 * Komponentnavnet beholdes (ScrollArrows) slik at alle eksisterende
 * call sites (`<ScrollArrows scrollRef={ref} />`) får den nye navigasjonen
 * automatisk. Touch-swipe i selve scrolleren påvirkes ikke.
 */
export const ScrollArrows = ({
  scrollRef,
  visibility = "all",
  className = "",
  slideCount,
  trailing,
}: ScrollArrowsProps) => {
  const [count, setCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const compute = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);

      // Første kort som er (nesten) helt synlig fra venstre
      const kids = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft;
      let idx = 0;
      for (let i = 0; i < kids.length; i++) {
        if (kids[i].offsetLeft + kids[i].offsetWidth > left + 8) {
          idx = i;
          break;
        }
      }
      setActiveIdx(idx);
    };

    const update = () => {
      setCount(el.children.length);
      setOverflowing(el.scrollWidth - el.clientWidth > 4);
      compute();
    };

    update();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        compute();
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

  const step = useCallback(
    (dir: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      const first = el.children[0] as HTMLElement | undefined;
      const amount = first ? first.offsetWidth + 16 : el.clientWidth * 0.8;
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    },
    [scrollRef],
  );

  if (!overflowing || count <= 1) {
    // Ingen scroll å navigere i — men en eventuell tekstlenke skal fortsatt vises.
    if (!trailing) return null;
    return (
      <div className="flex items-center justify-end w-full max-w-full mt-5 md:mt-6">
        {trailing}
      </div>
    );
  }

  const total = slideCount && slideCount > 0 ? Math.min(slideCount, count) : count;
  const current = total > 0 ? (activeIdx % total) + 1 : 1;

  const vis =
    visibility === "mobile"
      ? "flex md:hidden"
      : visibility === "desktop"
      ? "hidden md:flex"
      : "flex";

  const btn =
    "w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      className={`${vis} items-center gap-4 w-full max-w-full overflow-x-clip mt-5 md:mt-6 ${className}`}
    >
      {/* Fremdriftslinje + teller (venstrejustert) */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <div
          className="relative h-px flex-1 min-w-0 bg-brand-dark/15"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
        >
          <div
            className="absolute inset-y-0 left-0 bg-brand-dark transition-[width] duration-200"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
        <span className="text-sm font-light text-muted-foreground whitespace-nowrap tabular-nums">
          {current} av {total}
        </span>
      </div>

      {/* Piler til høyre */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Forrige"
          className={btn}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Neste"
          className={btn}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tekstlenke helt til høyre — egen kolonne, aldri overlapp */}
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
};
