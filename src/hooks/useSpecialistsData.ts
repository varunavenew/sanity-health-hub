import { useSpecialists, useSpecialist as useSanitySpecialist } from "@/hooks/useSanity";
import {
  specialists as staticSpecialists,
  getSpecialistsSortedByLastName as staticSorted,
  getSpecialistsByCategory as staticByCategory,
  getAllClinics as staticAllClinics,
  Specialist,
} from "@/data/specialists";

export type { Specialist };

/**
 * Fetches all specialists from Sanity, falls back to static data.
 * Returns the same shape regardless of source.
 */
export const useSpecialistsData = () => {
  const { data: sanityData, isLoading, isError } = useSpecialists();

  const specialists: Specialist[] =
    sanityData && sanityData.length > 0
      ? sanityData.map((s) => ({
          name: s.name,
          title: s.title,
          subtitle: s.subtitle,
          expertise: s.expertise,
          image: s.image,
          category: s.category as Specialist["category"],
          slug: s.slug,
          bio: s.bio,
          education: s.education,
          languages: s.languages,
          clinics: s.clinics,
        }))
      : staticSpecialists;

  const sorted = [...specialists].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "nb")
  );

  const byCategory = (category: Specialist["category"]) =>
    specialists
      .filter((s) => s.category === category)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "nb"));

  const allClinics = () => {
    const set = new Set<string>();
    specialists.forEach((s) => s.clinics?.forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "nb"));
  };

  const findBySlug = (slug: string) => specialists.find((s) => s.slug === slug);

  return {
    specialists,
    sorted,
    byCategory,
    allClinics,
    findBySlug,
    isLoading,
    isError,
    isSanity: !!(sanityData && sanityData.length > 0),
  };
};

/**
 * Single specialist by slug – Sanity first, static fallback.
 */
export const useSpecialistBySlug = (slug: string) => {
  const { data: sanityData, isLoading } = useSanitySpecialist(slug);

  if (sanityData) {
    return {
      specialist: {
        name: sanityData.name,
        title: sanityData.title,
        subtitle: sanityData.subtitle,
        expertise: sanityData.expertise,
        image: sanityData.image,
        category: sanityData.category as Specialist["category"],
        slug: sanityData.slug,
        bio: sanityData.bio,
        education: sanityData.education,
        languages: sanityData.languages,
        clinics: sanityData.clinics,
      } as Specialist,
      isLoading,
    };
  }

  // Fallback to static
  const staticMatch = staticSpecialists.find((s) => s.slug === slug);
  return { specialist: staticMatch || null, isLoading };
};
