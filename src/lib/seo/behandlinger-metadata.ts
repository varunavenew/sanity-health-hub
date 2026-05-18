import type { Metadata } from "next";
import {
  buildTreatmentCategoryMetadata,
  buildTreatmentMetadata,
} from "@/lib/seo/dynamic-route-metadata";

type PageParams = { params: Promise<{ locale: string; subId?: string }> };

export function createBehandlingerCategoryMetadata(
  categorySlug: string,
): (props: PageParams) => Promise<Metadata> {
  return async ({ params }) => {
    const { locale } = await params;
    return buildTreatmentCategoryMetadata(locale, categorySlug);
  };
}

export function createBehandlingerTreatmentMetadata(
  categorySlug: string,
): (props: PageParams) => Promise<Metadata> {
  return async ({ params }) => {
    const { locale, subId } = await params;
    if (!subId) {
      return buildTreatmentCategoryMetadata(locale, categorySlug);
    }
    return buildTreatmentMetadata(locale, categorySlug, subId);
  };
}
