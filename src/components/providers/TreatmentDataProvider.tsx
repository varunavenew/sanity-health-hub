"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TreatmentData } from "@/lib/sanity/treatment-data";

type TreatmentInitial = {
  lang: "no" | "en";
  categorySlug: string;
  treatmentSlug: string;
  /** Norwegian slug key for static sub-page content (gynekologiSubPages, etc.). */
  contentSlug?: string;
  data: TreatmentData | null;
};

const TreatmentDataContext = createContext<TreatmentInitial | null>(null);

export function TreatmentDataProvider({
  lang,
  categorySlug,
  treatmentSlug,
  contentSlug,
  data,
  children,
}: {
  lang: "no" | "en";
  categorySlug: string;
  treatmentSlug: string;
  contentSlug?: string;
  data: TreatmentData | null;
  children: ReactNode;
}) {
  return (
    <TreatmentDataContext.Provider
      value={{
        lang,
        categorySlug,
        treatmentSlug,
        contentSlug: contentSlug || treatmentSlug,
        data: data ?? null,
      }}
    >
      {children}
    </TreatmentDataContext.Provider>
  );
}

export function useTreatmentInitialData(): TreatmentInitial | null {
  return useContext(TreatmentDataContext);
}
