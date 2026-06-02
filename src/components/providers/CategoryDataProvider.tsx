"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TreatmentCategoryData } from "@/lib/sanity/category-data";

type CategoryInitial = {
  lang: "no" | "en";
  categorySlug: string;
  data: TreatmentCategoryData | null;
};

const CategoryDataContext = createContext<CategoryInitial | null>(null);

export function CategoryDataProvider({
  lang,
  categorySlug,
  data,
  children,
}: {
  lang: "no" | "en";
  categorySlug: string;
  data: TreatmentCategoryData | null;
  children: ReactNode;
}) {
  return (
    <CategoryDataContext.Provider
      value={{ lang, categorySlug, data: data ?? null }}
    >
      {children}
    </CategoryDataContext.Provider>
  );
}

export function useCategoryInitialData(): CategoryInitial | null {
  return useContext(CategoryDataContext);
}
