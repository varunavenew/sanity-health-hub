import { redirect } from "next/navigation";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import { fetchTreatmentData } from "@/lib/sanity/treatment-data";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { createBehandlingerTreatmentMetadata } from "@/lib/seo/behandlinger-metadata";

export type BehandlingerTreatmentPageProps = {
  isChatOpen: boolean;
  initialTreatment?: Awaited<ReturnType<typeof fetchTreatmentData>>;
  sanityLang?: "no" | "en";
};

type SubPageComponent = ComponentType<BehandlingerTreatmentPageProps>;

export function createBehandlingerTreatmentMetadataExport(categorySlug: string) {
  return createBehandlingerTreatmentMetadata(categorySlug);
}

export function createBehandlingerTreatmentPage(
  categorySlug: string,
  SubPage: SubPageComponent,
) {
  const Page = async ({
    params,
  }: {
    params: Promise<{ locale: string; subId: string }>;
  }) => {
    const { locale, subId } = await params;
    const appLocale: AppLocale = locale === "en" ? "en" : "no";
    const sanityLang = locale === "en" ? "en" : "no";

    const initialTreatment = await fetchTreatmentData(
      categorySlug,
      subId,
      sanityLang,
    );

    if (
      initialTreatment?.canonicalSlug &&
      subId !== initialTreatment.canonicalSlug
    ) {
      redirect(
        withLocalePath(
          appLocale,
          `/behandlinger/${categorySlug}/${initialTreatment.canonicalSlug}`,
        ),
      );
    }

    const queryClient = new QueryClient();
    queryClient.setQueryData(
      ["sanity", "treatment", categorySlug, subId, sanityLang],
      initialTreatment,
    );

    return (
      <TreatmentHydration state={dehydrate(queryClient)}>
        <SubPage
          isChatOpen={false}
          initialTreatment={initialTreatment}
          sanityLang={sanityLang}
        />
      </TreatmentHydration>
    );
  };

  return Page;
}
