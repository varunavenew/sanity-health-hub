import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

export const TaglineBanner = () => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();
  const tagline = homepage?.tagline || t("tagline");

  return (
    <div className="w-full py-3 md:py-4 bg-accent">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-sm md:text-base lg:text-lg text-accent-foreground font-light">
          {tagline}
        </p>
      </div>
    </div>
  );
};
