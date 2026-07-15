import type { PageSectionInsuranceConfig } from "@/lib/sanity/page-sections";

interface Props {
  config: PageSectionInsuranceConfig;
}

export function PageSectionInsuranceBlock({ config }: Props) {
  const eyebrow = config.eyebrow || "Forsikringspartnere";
  const title = config.title || "Vi har avtale med de største forsikringsselskapene i Norge.";
  const partners = config.partners || [];

  if (partners.length === 0) return null;

  return (
    <section className="bg-brand-light text-foreground py-14 md:py-16 border-t border-brand-dark/10">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-3 uppercase">
              {eyebrow}
            </p>
            <h3 className="text-xl md:text-2xl font-light leading-snug text-foreground">
              {title}
            </h3>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-brand-dark/10">
              {partners.map((partner) => (
                <li
                  key={partner.key}
                  className="border-b border-brand-dark/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-brand-dark/10 py-4 px-4 text-sm font-light text-foreground/85"
                >
                  {partner.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
