import { useServiceCategoriesFromSanity } from "@/hooks/useSanity";
import { serviceCategories as staticCategories, type ServiceCategory } from "@/data/serviceCategories";

/**
 * Fetches service categories from Sanity CMS, falling back to static data.
 */
export const useServiceCategories = (): {
  categories: ServiceCategory[];
  isLoading: boolean;
} => {
  const { data: sanityCategories, isLoading } = useServiceCategoriesFromSanity();

  return {
    categories: sanityCategories && sanityCategories.length > 0
      ? sanityCategories as ServiceCategory[]
      : staticCategories,
    isLoading,
  };
};
