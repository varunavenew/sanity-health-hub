import { AnimatedStat } from "@/components/AnimatedStat";

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
 * «Tall som forteller en historie» — gjenbrukbar på hjemmesiden, temasider og spesialistsider.
 */
export const ResultsStatsSection = ({
  title,
  description,
  stats,
  footnote,
  className = "",
}: ResultsStatsSectionProps) => {
  if (stats.length === 0) return null;

  return (
    <section
      className={`bg-brand-light text-foreground py-12 md:py-16 border-t border-brand-dark/5 ${className}`}
    >
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-3xl font-light leading-tight">{title}</h2>
            </div>
            {description ? (
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  {description}
                </p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-brand-dark/5 py-8 md:py-10">
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
                  {row.sub ? (
                    <p className="text-xs font-light text-muted-foreground">{row.sub}</p>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>

          {footnote ? (
            <p className="text-xs font-light text-muted-foreground mt-8">{footnote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};
