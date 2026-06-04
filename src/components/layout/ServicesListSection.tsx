import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceListItem {
  title: string;
  desc?: string;
  href: string;
  icon?: LucideIcon;
}

interface ServicesListSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ServiceListItem[];
  background?: "background" | "brand-light";
  columns?: 2 | 3 | 4;
}

export function ServicesListSection({
  title,
  description,
  items,
  background = "background",
  columns = 3,
}: ServicesListSectionProps) {
  const bgClass = background === "brand-light" ? "bg-brand-light" : "bg-background";
  const colsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={`${bgClass} text-foreground py-20 md:py-28`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
            <div className="lg:col-span-6">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                {title}
              </h2>
            </div>
            {description && (
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          <div className={`grid ${colsClass} gap-px bg-brand-dark/10 rounded-sm overflow-hidden`}>
            {items.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.title}
                  to={s.href}
                  className="bg-background p-6 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {Icon && (
                      <Icon className="w-5 h-5 text-foreground/70 mt-0.5 flex-shrink-0" strokeWidth={1.25} />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base font-normal text-foreground mb-1.5">
                        {s.title}
                      </h3>
                      {s.desc && (
                        <p className="text-sm font-light text-muted-foreground leading-snug">
                          {s.desc}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
