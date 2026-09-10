import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import type { SingletonPageType } from "@/lib/routing/cms-route-types";
import { prefetchSingletonPage } from "@/lib/sanity/singleton-page-data.server";

/** Prefetch a CMS singleton and hydrate React Query for a Server Component tree. */
export async function renderHydratedSingleton(
  documentType: SingletonPageType,
  locale: string,
  children: ReactNode,
): Promise<ReactNode> {
  const sanityLang = locale === "en" ? "en" : "no";
  const queryClient = new QueryClient();
  await prefetchSingletonPage(queryClient, documentType, sanityLang);
  return (
    <TreatmentHydration state={dehydrate(queryClient)}>
      {children}
    </TreatmentHydration>
  );
}
