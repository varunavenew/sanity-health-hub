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
 * ResultsStatsSection – "Tall som forteller en historie"-mønsteret.
 * Styled with a solid warm background to match the style of the reviews section.
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
      className={`relative overflow-hidden text-foreground py-16 md:py-20 border-t border-brand-dark/5 bg-brand-warm ${className}`}
    >
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
