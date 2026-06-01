import { useHomepage } from "@/hooks/useSanity";
import { useEffect, useRef, useState } from "react";

/**
 * Parse a stat value like "15 000+" into { number: 15000, prefix: "", suffix: "+" }
 */
function parseStatValue(value: string) {
  const cleaned = value.replace(/\s/g, "");
  const match = cleaned.match(/^([^\d]*)(\d+)([^\d]*)$/);
  if (!match) return null;
  return { prefix: match[1], number: parseInt(match[2], 10), suffix: match[3] };
}

function formatNumber(n: number, original: string) {
  // If original had spaces (e.g. "15 000"), format with spaces
  if (/\d\s\d/.test(original)) {
    return n.toLocaleString("nb-NO").replace(/,/g, " ");
  }
  return n.toString();
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const parsed = parseStatValue(value);
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!parsed || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();
          const target = parsed.number;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplayValue(`${parsed.prefix}${formatNumber(current, value)}${parsed.suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [parsed, value]);

  return (
    <div ref={ref} className="space-y-1">
      <p className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
        {displayValue}
      </p>
      <p className="text-sm text-muted-foreground font-light">
        {label}
      </p>
    </div>
  );
}

export const StatsBar = () => {
  const { data: homepage } = useHomepage();

  const stats = (homepage?.statsBar || []).filter((s: any) => s?.value && s?.label);
  if (stats.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto text-center">
          {stats.map((stat: any, i: number) => (
            <AnimatedStat key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};
