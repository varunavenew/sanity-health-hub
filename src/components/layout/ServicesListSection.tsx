import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { servicesTileGridClass } from "@/lib/ui/grid-cols-for-count";

export interface ServiceListItem {
  title: string;
  desc?: string;
  href: string;
}

interface ServicesListSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ServiceListItem[];
  background?: "background" | "brand-light";
  /** Inline dark booking tile as the last grid cell (demo /tjenester). */
  bookingCtaTile?: boolean;
  /** Show a primary booking button below the grid. */
  bookingCta?: boolean;
}

export function ServicesListSection({
  eyebrow,
  title,
  description,
  items,
  background = "background",
  bookingCtaTile = false,
  bookingCta = false,
}: ServicesListSectionProps) {
  const { t } = useTranslation();
  const bgClass = background === "brand-light" ? "bg-brand-light" : "bg-background";
  const gridCount = items.length + (bookingCtaTile ? 1 : 0);

  return (
    <section className={`${bgClass} text-foreground py-20 md:py-28`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
            <div className="lg:col-span-6">
              {eyebrow?.trim() ? (
                <p className="text-xs tracking-wide text-foreground/60 mb-4">{eyebrow}</p>
              ) : null}
              <h2 className="text-3xl md:text-5xl font-light leading-tight">{title}</h2>
            </div>
            {description && (
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          <div className={`${servicesTileGridClass(gridCount)} gap-px bg-brand-dark/10 rounded-sm overflow-hidden`}>
            {items.map((s) => (
              <Link
                key={s.title}
                to={s.href}
                className="bg-background p-6 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
              >
                <div>
                  <h3 className="text-base font-normal text-foreground mb-1.5">
                    {s.title}
                  </h3>
                  {s.desc && (
                    <p className="text-sm font-light text-muted-foreground leading-snug">
                      {s.desc}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
              </Link>
            ))}
            {bookingCtaTile ? (
              <Link
                to="/booking"
                className="bg-brand-dark text-white p-6 flex flex-col justify-between gap-6 min-h-[88px] hover:bg-brand-dark/95 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-normal text-white">
                    {t("nav.bookAppointment")}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-white/70 mt-1 flex-shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-sm font-light text-white/70 leading-snug">
                  {t("services.moreServicesBookingHint", {
                    defaultValue: "Finn ledig tid hos våre spesialister.",
                  })}
                </p>
              </Link>
            ) : null}
          </div>

          {bookingCta && !bookingCtaTile ? (
            <div className="mt-10 md:mt-12">
              <Button variant="cta" size="lg" asChild>
                <Link to="/booking">{t("nav.bookAppointment")}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
