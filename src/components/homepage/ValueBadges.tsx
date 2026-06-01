import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Building2, Coins } from "lucide-react";

const icons = [ShieldCheck, Building2, Coins];

export const ValueBadges = () => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  const badges = (homepage?.valueBadges || []).filter(Boolean);
  if (badges.length === 0) return null;

  return (
    <section className="py-4 md:py-6 bg-background">
      <div className="container mx-auto px-4 md:px-8">
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
    </section>
  );
};
