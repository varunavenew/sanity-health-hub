import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { CategoryDataProvider } from "@/components/providers/CategoryDataProvider";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import { fetchTreatmentCategoryData } from "@/lib/sanity/category-data";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";
import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";

export type CategoryLandingPageProps = {
  isChatOpen: boolean;
  initialCategory?: Awaited<ReturnType<typeof fetchTreatmentCategoryData>>;
  sanityLang?: "no" | "en";
};

type LandingComponent = ComponentType<CategoryLandingPageProps>;

/** Next.js `generateMetadata` for category landing routes (reads `seo` from Sanity). */
export function createSanityCategoryLandingMetadata(categoryId: string) {
  return createBehandlingerCategoryMetadata(categoryId);
}

/** Server page factory for Sanity-driven category landings (gynekologi, urologi, …). */
export function createSanityCategoryLandingPage(categoryId: string) {
  const Landing: LandingComponent = (props) => (
    <TreatmentCategoryLanding {...props} categoryId={categoryId} />
  );
  return createCategoryLandingPage(categoryId, Landing);
}

export function createCategoryLandingPage(
  categorySlug: string,
  LandingPage: LandingComponent,
) {
  return async function Page({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    const sanityLang = locale === "en" ? "en" : "no";

    const initialCategory = await fetchTreatmentCategoryData(
      categorySlug,
      sanityLang,
    );

    const queryClient = new QueryClient();
    queryClient.setQueryData(
      ["sanity", "treatmentCategory", categorySlug, sanityLang],
      initialCategory,
    );

    return (
      <TreatmentHydration state={dehydrate(queryClient)}>
        <CategoryDataProvider
          lang={sanityLang}
          categorySlug={categorySlug}
          data={initialCategory}
        >
          <LandingPage
            isChatOpen={false}
            initialCategory={initialCategory}
            sanityLang={sanityLang}
          />
        </CategoryDataProvider>
      </TreatmentHydration>
    );
  };
}
