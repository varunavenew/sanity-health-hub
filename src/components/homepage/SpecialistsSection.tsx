"use client";

import { useMemo } from "react";
import { SpecialistCarousel } from "@/components/SpecialistCarousel";
import { PageSectionSpecialistsBlock } from "@/components/page-sections/PageSectionSpecialistsBlock";
import { useHomepage } from "@/hooks/useSanity";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import {
  homepageSpecialistsAsPageSection,
  resolveHomepageSpecialists,
} from "@/lib/sanity/homepage-specialists";
import { useTranslation } from "react-i18next";

export const SpecialistsSection = () => {
  const { data: homepage } = useHomepage();
  const config = homepage?.specialistsSection;
  const { sorted: allSpecialists } = useSpecialistsData();
  const { t } = useTranslation();

  const specialists = useMemo(
    () => resolveHomepageSpecialists(config, allSpecialists),
    [config, allSpecialists],
  );

  const layout = config?.layout === "grid" ? "grid" : "carousel";
  const seeAllHref = config?.seeAllHref ?? "/spesialister";
  const seeAllLabel =
    config?.seeAllLabel?.replace("{count}", String(specialists.length)) ||
    t("specialists.seeAll", { count: specialists.length });
  const title = config?.heading?.trim() || t("specialists.title");
  const description = config?.intro?.trim() || t("specialists.description");

  if (specialists.length === 0) return null;

  if (layout === "grid" && config) {
    return (
      <PageSectionSpecialistsBlock
        config={homepageSpecialistsAsPageSection(config, specialists)}
      />
    );
  }

  return (
    <SpecialistCarousel
      specialists={specialists}
      title={title}
      description={description}
      seeAllHref={seeAllHref}
      seeAllLabel={seeAllLabel}
    />
  );
};
