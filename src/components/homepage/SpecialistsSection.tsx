import { SpecialistCarousel } from "@/components/specialists/SpecialistCarousel";
import { useTranslation } from "react-i18next";

export const SpecialistsSection = () => {
  const { t } = useTranslation();

  return (
    <SpecialistCarousel
      title={t("specialists.title")}
      description={t("specialists.description")}
      seeAllHref="/spesialister"
      seeAllLabel={t("specialists.seeAllShort")}
    />
  );
};
