"use client";

import { useServiceCategoriesFromSanity } from "@/hooks/useSanity";
import type { ServiceCategory } from "@/lib/sanity/service-category-types";

/** Fetches service categories from Sanity CMS (`treatmentCategory`). */
export const useServiceCategories = (): {
  categories: ServiceCategory[];
  isLoading: boolean;
} => {
  const { data: sanityCategories, isLoading } = useServiceCategoriesFromSanity();

  return {
    categories: sanityCategories || [],
    isLoading,
  };
};
