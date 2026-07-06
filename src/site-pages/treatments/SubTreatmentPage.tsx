"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { useTreatment } from "@/hooks/useSanity";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";
import { mapTreatmentToSubTreatmentContent } from "@/lib/sanity/map-sub-treatment-content";
import { useTreatmentSlug } from "@/lib/router";
import { useTranslation } from "react-i18next";
import NotFound from "@/site-pages/NotFound";

type Props = BehandlingerTreatmentPageProps & {
  categoryId: string;
};

/**
 * Sanity-driven sub-treatment pages (ortopedi, urologi, graviditet, …).
 * Uses `layout` + SubTreatmentLayout — no static treatmentContent fallback.
 */
const SubTreatmentPage = ({
  categoryId,
  isChatOpen,
  initialTreatment,
  sanityLang = "no",
}: Props) => {
  const treatmentSlug = useTreatmentSlug();
  const { t } = useTranslation();
  const { data: treatment, isPending } = useTreatment(categoryId, treatmentSlug);
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


  const content = mapTreatmentToSubTreatmentContent(resolved, {
    categoryId,
    treatmentSlug: treatmentSlug || resolved.canonicalSlug || "",
    lang,
  });

  return (
    <SubTreatmentLayout
      isChatOpen={isChatOpen}
      content={content}
      locale={lang}
      pageSections={resolved.pageSections}
    />
  );
};

export default SubTreatmentPage;
