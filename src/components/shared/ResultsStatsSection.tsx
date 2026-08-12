import { AnimatedStat } from "@/components/AnimatedStat";
import { StatsSkinBackground } from "@/components/shared/StatsSkinBackground";

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
  /**
   * Visual variant:
   * - "warm" (default): light skin-toned parallax bg with overlay + dark text.
   * - "plain": flat brand-light bg, no image.
   */
  variant?: "plain" | "warm";
}

/**
 * ResultsStatsSection – "Tall som forteller en historie"-mønsteret.
 *
 * Default is the light skin-toned background with dark text, used site-wide.
 */
export const ResultsStatsSection = ({
  title,
  description,
  stats,
  footnote,
  className = "",
  variant = "warm",
}: ResultsStatsSectionProps) => {
  return (
    <section
      className={`stats-band-dark relative overflow-hidden py-16 md:py-20 ${className}`}
    >
      {/* Same background asset/toning/parallax as the list-page hero */}
      <StatsSkinBackground speed={variant === "warm" ? 0.14 : 0} />


      <div className="relative container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="section-head">
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
