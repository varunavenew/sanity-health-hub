"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { useTreatment } from "@/hooks/useSanity";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { mapTreatmentToSubTreatmentContent } from "@/lib/sanity/map-sub-treatment-content";
import { normalizeCategoryRouteKey } from "@/lib/sanity/category-keys";
import { useTreatmentSlug } from "@/lib/router";
import { useTranslation } from "react-i18next";

/** Fertilitet sub-treatments — Sanity `layout` + SubTreatmentLayout design. */
const FertilitetSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang = "no",
  categoryId = "fertilitet",
}: BehandlingerTreatmentPageProps) => {
  const urlSlug = useTreatmentSlug();
  const treatmentSlug = resolveFertilitetTreatmentSlug(urlSlug);
  const { t } = useTranslation();
  const categoryKey = normalizeCategoryRouteKey(categoryId) || "fertilitet";
  // Always fetch under canonical categoryId so EN `/fertility/...` shares the
  // same React Query key as server hydration (`fertilitet`, not `fertility`).
  const { data: treatment, isPending } = useTreatment("fertilitet", treatmentSlug);
  const resolved = treatment ?? initialTreatment ?? null;
  const lang = sanityLang;

  if (isPending && !resolved) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">{t("common.loading")}</p>
        </div>
      </PageLayout>
    );
  }

  if (!resolved) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center px-6 text-center">
          <h1 className="sr-only">
            {t("common.notFound", { defaultValue: lang === "en" ? "Page not found" : "Siden ble ikke funnet" })}
          </h1>
          <p className="text-muted-foreground font-light" aria-live="polite">
            {t("common.notFound", { defaultValue: lang === "en" ? "Page not found" : "Siden ble ikke funnet" })}
          </p>
        </div>
      </PageLayout>
    );
  }

  const content = mapTreatmentToSubTreatmentContent(resolved, {
    categoryId: categoryKey,
    treatmentSlug: treatmentSlug || resolved.canonicalSlug || "",
    lang,
  });

  return (
    <SubTreatmentLayout
      isChatOpen={isChatOpen}
      content={content}
      locale={lang}
      pageSections={resolved.pageSections}
      faqSectionTitle={resolved.faqSectionTitle}
      faqs={resolved.faqs}
    />
  );
};

export default FertilitetSubPage;
