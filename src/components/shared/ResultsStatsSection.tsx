import { useEffect, useRef, useState } from "react";
import { AnimatedStat } from "@/components/AnimatedStat";
import skinBg from "@/assets/blur-belly.jpg.asset.json";

export type ResultStat = {
  v: string;
  k: string;
  sub?: string;
};

interface ResultsStatsSectionProps {
  title: string;
  description?: string;
  category?: string;
  stats: ResultStat[];
  footnote?: string;
  className?: string;
}

/**
 * ResultsStatsSection – "Tall som forteller en historie"-mønsteret.
 * Warm skin-toned parallax background with a subtle dark overlay
 * to keep numbers and copy comfortably readable.
 */
export const ResultsStatsSection = ({
  title,
  description,
  stats,
  footnote,
  className = "",
}: ResultsStatsSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (section below viewport) → 1 (above). 0 when centered.
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffset(clamped * 60); // px range
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden text-foreground py-16 md:py-20 border-t border-brand-dark/5 ${className}`}
    >
      {/* Parallax skin-toned background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-16 -bottom-16 will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <img
          src={skinBg.url}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Warm/dark overlay for readability while keeping copy dark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-light/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-light/40 via-brand-light/20 to-brand-light/60"
      />

      <div className="relative container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-4 md:gap-6 lg:gap-24 mb-10 md:mb-14">
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-3xl font-light leading-tight">{title}</h2>
            </div>
            {description && (
              <div className="lg:col-span-7 lg:flex lg:items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  {description}
                </p>
              </div>
            )}
          </div>


          <div className="border-t border-brand-dark/10 py-8 md:py-10">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
              {stats.map((row, i) => (
                <div
                  key={row.k}
                  className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === stats.length - 1 ? "md:pr-0" : ""}`}
                >
                  <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
                    <AnimatedStat value={row.v} />
                  </dd>
                  <dt className="text-sm font-normal text-foreground mb-1">{row.k}</dt>
                  {row.sub && (
                    <p className="text-xs font-light text-muted-foreground">{row.sub}</p>
                  )}
                </div>
              ))}
            </dl>
          </div>

          {footnote && (
            <p className="text-xs font-light text-muted-foreground mt-8">{footnote}</p>
          )}
        </div>
      </div>
    </section>
  );
};
