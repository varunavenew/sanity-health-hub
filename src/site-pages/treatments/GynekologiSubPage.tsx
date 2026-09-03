"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { useTreatment } from "@/hooks/useSanity";
import type { BehandlingerTreatmentPageProps } from "@/lib/behandlinger/create-treatment-page";
import { mapTreatmentToSubTreatmentContent } from "@/lib/sanity/map-sub-treatment-content";
import { resolveGynekologiTreatmentSlug } from "@/lib/sanity/gynekologi-slug-aliases";
import { useTreatmentSlug } from "@/lib/router";
import { useTranslation } from "react-i18next";

/** Gynekologi sub-treatments — Sanity `layout` + SubTreatmentLayout design. */
const GynekologiSubPage = ({
  isChatOpen,
  initialTreatment,
  sanityLang = "no",
}: BehandlingerTreatmentPageProps) => {
  const urlSlug = useTreatmentSlug();
  const treatmentSlug = resolveGynekologiTreatmentSlug(urlSlug);
  const { t } = useTranslation();
  const { data: treatment, isPending } = useTreatment("gynekologi", treatmentSlug);
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
            {t("common.notFound", {
              defaultValue: lang === "en" ? "Page not found" : "Siden ble ikke funnet",
            })}
          </h1>
          <p className="text-muted-foreground font-light" aria-live="polite">
            {t("common.notFound", {
              defaultValue: lang === "en" ? "Page not found" : "Siden ble ikke funnet",
            })}
          </p>
        </div>
      </PageLayout>
    );
  }

  const content = mapTreatmentToSubTreatmentContent(resolved, {
    categoryId: "gynekologi",
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

export default GynekologiSubPage;
