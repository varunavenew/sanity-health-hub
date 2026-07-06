import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Parses a stat string like "42%", "3 800+", "11 200", "< 7 dager"
 * into prefix, numeric target, and suffix. Animates the number from 0
 * to target when the element enters the viewport.
 */
const parseValue = (raw: string) => {
  const match = raw.match(/^(\D*?)([\d\s.,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: raw, formatted: raw };
  const [, prefix, numStr, suffix] = match;
  const cleaned = numStr.replace(/\s/g, "").replace(",", ".");
  const target = parseFloat(cleaned);
  if (Number.isNaN(target)) {
    return { prefix: "", target: 0, suffix: raw, formatted: raw };
  }
  return { prefix, target, suffix, formatted: numStr.trim() };
};

const formatNumber = (n: number, target: number) => {
  const isInt = Number.isInteger(target);
  const rounded = isInt ? Math.round(n) : Math.round(n * 10) / 10;
  // Use Norwegian space as thousands separator for values >= 1000
  if (target >= 1000) {
    return rounded.toLocaleString("nb-NO").replace(/\u00A0/g, " ");
  }
  // Localize decimals too (nb-NO uses comma), e.g. 4.8 -> "4,8"
  if (!isInt) {
    return rounded.toLocaleString("nb-NO", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return String(rounded);
};

export const AnimatedStat = ({
  value,
  duration = 3000,
  className,
}: AnimatedStatProps) => {
  const { prefix, target, suffix } = parseValue(value);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || started) return;
    const el = ref.current;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    if (prefersReduced) {
      setStarted(true);
      setDisplay(target);
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, [started, target]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(display, target)}
      {suffix}
    </span>
  );
};

export default AnimatedStat;
