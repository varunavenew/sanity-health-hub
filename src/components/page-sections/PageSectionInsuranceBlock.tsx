import type { PageSectionInsuranceConfig } from "@/lib/sanity/page-sections";

interface Props {
  config: PageSectionInsuranceConfig;
  /** Treatment pages: py-10 + text-xl/md:text-2xl. Category landings keep the larger band. */
  compact?: boolean;
}

export function PageSectionInsuranceBlock({ config, compact = false }: Props) {
  const eyebrow = config.eyebrow?.trim() || "";
  const title = config.title || "Vi har avtale med de største forsikringsselskapene i Norge.";
  const partners = config.partners || [];

  if (partners.length === 0) return null;

  return (
    <section
      className={
        compact
          ? "bg-brand-light text-foreground py-10 border-t border-brand-dark/10"
          : "bg-brand-light text-foreground py-14 md:py-16 border-t border-brand-dark/10"
      }
    >
      <div className="container mx-auto px-6 md:px-16">
        {/* Reference: title stacked above a full-width partner grid (not split columns). */}
        <div className="max-w-6xl mx-auto">
          {eyebrow ? (
            <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-3 uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h3
            className={
              compact
                ? "text-xl md:text-2xl font-light leading-snug text-foreground mb-10 md:mb-12 max-w-3xl"
                : "text-2xl md:text-3xl font-light leading-snug text-foreground mb-10 md:mb-12 max-w-3xl"
            }
          >
            {title}
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-brand-dark/10">
            {partners.map((partner) => (
              <li
                key={partner.key}
                className="border-b border-brand-dark/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-brand-dark/10 py-4 px-4 text-sm font-light text-foreground"
              >
                {partner.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
