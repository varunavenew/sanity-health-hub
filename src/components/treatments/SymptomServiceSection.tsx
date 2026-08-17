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
  /**
   * Fertility reference uses cream rounded cards; other categories keep flatter cards.
   * Title + ingress are always stacked (reference).
   */
  layoutVariant?: "default" | "fertility";
}

export function SymptomServiceSection({
  title,
  description,
  items,
  background = "secondary",
  layoutVariant = "default",
}: SymptomServiceSectionProps) {
  const isFertility = layoutVariant === "fertility";
  const bgClass =
    background === "brand-light"
      ? "bg-brand-light"
      : background === "secondary"
      ? "bg-secondary/40"
      : "bg-background";

  return (
    <section className={`${bgClass} text-foreground pt-8 md:pt-10 pb-10`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-8 md:mb-10 grid gap-y-3 md:gap-y-4">
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="text-base font-light text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((item) => (
              <Link
                key={item.symptom}
                to={item.href}
                className={
                  isFertility
                    ? "bg-background border border-foreground/10 rounded-xl overflow-hidden flex flex-col hover:border-foreground/25 transition-colors group"
                    : "bg-background border border-foreground/10 rounded-sm overflow-hidden flex flex-col hover:border-foreground/30 transition-colors group"
                }
              >
                <div
                  className={
                    isFertility
                      ? "p-6 md:p-7 flex flex-col justify-between gap-6 flex-1 min-h-[168px]"
                      : "p-6 md:p-7 flex flex-col justify-between gap-5 flex-1"
                  }
                >
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
