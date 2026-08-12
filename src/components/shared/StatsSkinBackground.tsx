import { useEffect, useRef, useState } from "react";
import bgAsset from "@/assets/blur-skin-mid.jpg.asset.json";
import { useReducedMotion } from "@/components/ui/ParallaxImage";

interface StatsSkinBackgroundProps {
  /** Parallax strength. 0 disables. Same setup as the split heroes. */
  speed?: number;
}

/**
 * Shared background for the "Tall som forteller en historie"-section AND the
 * shared list-page hero (ListPageHero), so the two always match:
 * darker warm brown skin texture, grainy, light text on top.
 *
 * Includes the same subtle scroll parallax as the split heroes
 * (SplitHeroMedia), and respects prefers-reduced-motion.
 *
 * Usage: place as first child of a `relative overflow-hidden stats-band-dark`
 * container. All text inside becomes light (brand-beige) via the
 * `.stats-band-dark` utility in index.css.
 */
export const StatsSkinBackground = ({ speed = 0.14 }: StatsSkinBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !speed) {
      setOffset(0);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      if (rect.bottom < -200 || rect.top > viewport + 200) return;
      const delta = rect.top + rect.height / 2 - viewport / 2;
      setOffset(-delta * speed);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, reduced]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-x-0 -top-24 -bottom-24 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${bgAsset.url})`,
          transform: reduced ? undefined : `translate3d(0, ${offset}px, 0)`,
        }}
      />
    </div>
  );
};
