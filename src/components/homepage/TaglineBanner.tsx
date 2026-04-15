import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

export const TaglineBanner = () => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();
  const tagline = homepage?.tagline || t("tagline");

  // Split tagline into two balanced lines
  const words = tagline.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(' ');
  const line2 = words.slice(midpoint).join(' ');

  return (
    <div className="w-full py-3 md:py-4 bg-accent">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-sm md:text-base lg:text-lg text-accent-foreground font-light leading-relaxed">
          <span className="block">{line1}</span>
          <span className="block">{line2}</span>
        </p>
      </div>
    </div>
  );
};
