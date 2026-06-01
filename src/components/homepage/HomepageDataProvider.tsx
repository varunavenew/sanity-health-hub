"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { HomepageData } from "@/lib/sanity/homepage-data";

type HomepageInitial = {
  lang: "no" | "en";
  data: HomepageData | null;
};

const HomepageDataContext = createContext<HomepageInitial | null>(null);

export function HomepageDataProvider({
  lang,
  data,
  children,
}: {
  lang: "no" | "en";
  data: HomepageData | null;
  children: ReactNode;
}) {
  return (
    <HomepageDataContext.Provider value={{ lang, data: data ?? null }}>
      {children}
    </HomepageDataContext.Provider>
  );
}

export function useHomepageInitialData(): HomepageInitial | null {
  return useContext(HomepageDataContext);
}
