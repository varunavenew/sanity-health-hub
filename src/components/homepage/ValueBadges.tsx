import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Building2, Coins } from "lucide-react";

const icons = [ShieldCheck, Building2, Coins];

export const ValueBadges = () => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  const staticBadges = [
    t("valueBadges.tech"),
    t("valueBadges.comfort"),
    t("valueBadges.price"),
  ];

  const badges = homepage?.valueBadges && homepage.valueBadges.length > 0
    ? homepage.valueBadges
    : staticBadges;

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 md:px-8 space-y-12">

        {/* ── Variant A: Ren tekst med separator ── */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 text-center font-light tracking-wide">Variant A – Tekst med separator</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            {badges.map((badge: string, i: number) => (
              <span key={i} className="flex items-center gap-x-6">
                <span className="text-sm text-foreground/70 font-light">{badge}</span>
                {i < badges.length - 1 && (
                  <span className="w-px h-4 bg-border" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ── Variant B: Ikon + tekst (uten bakgrunn) ── */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 text-center font-light tracking-wide">Variant B – Ikon + tekst uten bakgrunn</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {badges.map((badge: string, i: number) => {
              const Icon = icons[i] || icons[0];
              return (
                <span key={i} className="inline-flex items-center gap-2 text-sm text-foreground/70 font-light">
                  <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  {badge}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── Variant C: Checkmark-liste ── */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 text-center font-light tracking-wide">Variant C – Checkmark</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {badges.map((badge: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm text-foreground/70 font-light">
                <span className="text-accent-foreground">✓</span>
                {badge}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
