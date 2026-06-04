import { useSpecialists, useSpecialist as useSanitySpecialist } from "@/hooks/useSanity";
import { Specialist } from "@/data/specialists";
import { resolveSpecialistBookingCategoryIds } from "@/lib/booking/specialist-booking";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";

export type { Specialist };

/** Fetches all specialists from Sanity CMS. */
export const useSpecialistsData = () => {
  const { data: sanityData, isLoading, isError } = useSpecialists();

  const specialists: Specialist[] = (sanityData || []).map((s) => ({
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
    sanityCategories: s.sanityCategories,
    bookingCategoryIds: s.bookingCategoryIds,
  }));

  const sorted = [...specialists].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "nb")
  );

  const byCategory = (category: Specialist["category"]) =>
    specialists
      .filter((s) => specialistMatchesCategory(s, category))
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
    isSanity: true,
  };
};

/** Single specialist by slug from Sanity CMS. */
export const useSpecialistBySlug = (slug: string) => {
  const { data: sanityData, isLoading } = useSanitySpecialist(slug);

  if (!sanityData) return { specialist: null, isLoading };

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
      sanityCategories: sanityData.sanityCategories,
      bookingCategoryIds: resolveSpecialistBookingCategoryIds({
        bookingCategoryIds: sanityData.bookingCategoryIds,
        category: sanityData.category as Specialist["category"],
      }),
      seo: sanityData.seo,
    } as Specialist,
    isLoading,
  };
};
