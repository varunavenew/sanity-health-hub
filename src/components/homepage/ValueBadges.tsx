import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

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
    <section className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {badges.map((badge: string, i: number) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-foreground/80">
              <span className="w-2 h-2 rounded-full bg-brand-dark" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
