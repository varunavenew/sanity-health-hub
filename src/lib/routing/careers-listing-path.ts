"use client";

import { useTranslation } from "react-i18next";
import { useCmsRouteContext } from "@/components/providers/CmsRouteIndexProvider";
import { slugForLocale } from "@/lib/routing/cms-route-types";
import { listingSlugPair } from "@/lib/routing/listing-default-slugs";

export function useCareersListingPath(): string {
  const { index } = useCmsRouteContext();
  const { i18n } = useTranslation();
  const pair = listingSlugPair(index?.listings ?? {}, "careersPage");
  const slug = slugForLocale(pair ?? undefined, i18n.language === "en" ? "en" : "no");
  return slug ? `/${slug}` : "";
}
