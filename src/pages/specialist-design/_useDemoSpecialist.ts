import { useSpecialistsData } from "@/hooks/useSpecialistsData";

/**
 * Picks a specialist with rich data to drive the design demos.
 * Falls back to the first specialist if the preferred slug is missing.
 */
export const useDemoSpecialist = (preferredSlug = "anamika-choudhury") => {
  const { findBySlug, specialists, byCategory } = useSpecialistsData();
  const specialist = findBySlug(preferredSlug) || specialists[0];
  const related = specialist
    ? byCategory(specialist.category).filter((s) => s.slug !== specialist.slug).slice(0, 4)
    : [];
  return { specialist, related };
};
