import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";

export interface SymptomItem {
  symptom: string;
  service: string;
  href: string;
  image?: string;
  imageAlt: string;
}

interface SymptomServiceSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: SymptomItem[];
  background?: "background" | "brand-light" | "secondary";
}

export function SymptomServiceSection({
  title,
  description,
  items,
  background = "secondary",
}: SymptomServiceSectionProps) {
  const bgClass =
    background === "brand-light"
      ? "bg-brand-light"
      : background === "secondary"
      ? "bg-secondary/40"
      : "bg-background";

  return (
    <section className={`${bgClass} text-foreground py-14 md:py-20`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((item) => (
              <Link
                key={item.symptom}
                to={item.href}
                className="bg-background border border-foreground/10 rounded-sm overflow-hidden flex flex-col hover:border-foreground/30 transition-colors group"
              >
                <div className="p-6 md:p-7 flex flex-col justify-between gap-5 flex-1">
                  <h3 className="text-lg md:text-xl font-light leading-snug text-foreground">
                    {item.symptom}
                  </h3>
                  <div className="flex items-end justify-between gap-3 pt-4 border-t border-foreground/10">
                    <p className="text-sm font-normal text-foreground">{item.service}</p>
                    <ArrowRight className="w-4 h-4 text-foreground/40 flex-shrink-0 mb-1 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
