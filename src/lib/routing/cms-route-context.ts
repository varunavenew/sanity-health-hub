"use client";

import { createContext, useContext } from "react";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import {
  buildSlugLocaleMap,
  type SlugLocaleMap,
} from "@/lib/routing/slug-locale-map";

export type CmsRouteContextValue = {
  index: CmsRouteIndex | undefined;
  localeMap: SlugLocaleMap;
};

export const CmsRouteContext = createContext<CmsRouteContextValue>({
  index: undefined,
  localeMap: buildSlugLocaleMap(null),
});

export function useCmsRouteContext() {
  return useContext(CmsRouteContext);
}
