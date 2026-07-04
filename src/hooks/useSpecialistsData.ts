"use client";

import { useSpecialists, useSpecialist as useSanitySpecialist } from "@/hooks/useSanity";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";

export type { Specialist };

/** Fetches all publishable specialists from Sanity CMS. */
export const useSpecialistsData = () => {
  const { data: specialists = [], isLoading, isError } = useSpecialists();

  const byCategory = (category: Specialist["category"]) =>
    specialists.filter((s) => specialistMatchesCategory(s, category));

  const allClinics = () => {
    const set = new Set<string>();
    specialists.forEach((s) => s.clinics?.forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "nb"));
  };

  const findBySlug = (slug: string) => specialists.find((s) => s.slug === slug);

  return {
    specialists,
    sorted: specialists,
    byCategory,
    allClinics,
    findBySlug,
    isLoading,
    isError,
    isSanity: true,
  };
};

/** Single publishable specialist by slug from Sanity CMS. */
export const useSpecialistBySlug = (slug: string) => {
  const { data: specialist, isLoading } = useSanitySpecialist(slug);

  return {
    specialist: specialist ?? null,
    isLoading,
  };
};
