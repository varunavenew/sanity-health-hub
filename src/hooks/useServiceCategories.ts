import { useServiceCategoriesFromSanity } from "@/hooks/useSanity";
import { serviceCategories as staticCategories, type ServiceCategory } from "@/data/serviceCategories";
import { sortBySlug } from "@/lib/sortAlphabetical";
import { useTranslation } from "react-i18next";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";

/**
 * Fetches service categories from Sanity CMS, falling back to static data.
 */
export const useServiceCategories = (): {
  categories: ServiceCategory[];
  isLoading: boolean;
} => {
  const { i18n } = useTranslation();
  const contentLang = sanityContentLangFromLocale(i18n.language);
  const { data: sanityCategories, isLoading } = useServiceCategoriesFromSanity();

  return {
    categories:
      sanityCategories && sanityCategories.length > 0
        ? sanityCategories
        : sortBySlug(staticCategories, (c) => c.id || c.label, contentLang),
    isLoading,
  };
};
