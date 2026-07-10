"use client";

import { useEffect } from "react";
import { useNavigate, useParams, useLocation, useTreatmentSlug } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import {
  useTreatment,
  useTreatmentCategory,
  useSiteSettings,
} from "@/hooks/useSanity";
import { TreatmentDataProvider } from "@/components/providers/TreatmentDataProvider";
import type { TreatmentData } from "@/lib/sanity/treatment-data";
import { mapTreatmentToSubTreatmentContent } from "@/lib/sanity/map-sub-treatment-content";

interface TreatmentPageProps {
  categoryId: string;
  isChatOpen: boolean;
  initialTreatment?: TreatmentData | null;
  sanityLang?: "no" | "en";
}

type TreatmentPageContentProps = {
  categoryId: string;
  isChatOpen: boolean;
};

const TreatmentPageContent = ({ categoryId, isChatOpen }: TreatmentPageContentProps) => {
  const params = useParams();
  const treatmentSlug = useTreatmentSlug();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: treatment, isLoading } = useTreatment(categoryId, treatmentSlug);
  const { data: category } = useTreatmentCategory(categoryId);
  const { data: siteSettings } = useSiteSettings();
  const treatmentPageUi = siteSettings?.treatmentPageUi;

  const locale = params.locale === "en" ? "en" : "nb";
  const loadingLabel = locale === "en" ? "Loading..." : "Laster...";
  const categoryPath = treatment?.parentSlug
    ? `/${treatment.parentSlug}`
    : category?.slug
      ? `/${category.slug}`
      : "";

  useEffect(() => {
    if (treatment?.title) {
      document.title = `${treatment.title} | CMedical`;
    }
  }, [treatment?.title]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, [location.hash, treatment]);

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">
            {loadingLabel}
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!treatment) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-foreground mb-4">
              {treatmentPageUi?.notFoundTitle}
            </h1>
            <p className="text-muted-foreground font-light mb-8">
              {treatmentPageUi?.notFoundBody}
            </p>
            <Button onClick={() => navigate(categoryPath)} className="rounded-md">
              {treatmentPageUi?.backLabel}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const content = mapTreatmentToSubTreatmentContent(treatment, {
    categoryId,
    treatmentSlug: treatmentSlug || treatment.canonicalSlug || "",
    lang: locale === "en" ? "en" : "no",
  });

  return (
    <SubTreatmentLayout
      isChatOpen={isChatOpen}
      content={content}
      locale={locale === "en" ? "en" : "no"}
      pageSections={treatment.pageSections}
    />
  );
};

const TreatmentPage = ({
  categoryId,
  isChatOpen,
  initialTreatment = null,
  sanityLang = "no",
}: TreatmentPageProps) => {
  const treatmentSlug = useTreatmentSlug();

  return (
    <TreatmentDataProvider
      lang={sanityLang}
      categorySlug={categoryId}
      treatmentSlug={treatmentSlug}
      data={initialTreatment}
    >
      <TreatmentPageContent categoryId={categoryId} isChatOpen={isChatOpen} />
    </TreatmentDataProvider>
  );
};

export default TreatmentPage;
