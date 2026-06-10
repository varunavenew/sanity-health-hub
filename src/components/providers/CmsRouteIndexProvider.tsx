"use client";

import { useMemo, type ReactNode } from "react";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { buildSlugLocaleMap } from "@/lib/routing/slug-locale-map";
import { CmsRouteContext } from "@/lib/routing/cms-route-context";
import { useCmsRouteIndex } from "@/hooks/useSanity";

export { useCmsRouteContext } from "@/lib/routing/cms-route-context";

export function CmsRouteIndexProvider({
  children,
  initialIndex,
}: {
  children: ReactNode;
  initialIndex?: CmsRouteIndex;
}) {
  const { data } = useCmsRouteIndex(initialIndex);
  const index = data ?? initialIndex;
  const localeMap = useMemo(() => buildSlugLocaleMap(index), [index]);

  return (
    <CmsRouteContext.Provider value={{ index, localeMap }}>
      {children}
    </CmsRouteContext.Provider>
  );
}
