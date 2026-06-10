import type { TFunction } from "i18next";
import type { NavRouteId } from "@/lib/i18n/nav-paths";
import {
  resolveNavPath,
  type NavLinkLike,
} from "@/lib/navigation/nav-path-utils";
import type { SlugLocaleMap } from "@/lib/routing/slug-locale-map";

export type { NavLinkLike };

function navIdForItem(
  item: NavLinkLike,
  cmsMap?: SlugLocaleMap,
): NavRouteId | undefined {
  if (item.navId?.trim()) {
    return item.navId.trim() as NavRouteId;
  }

  const path = item.path?.split("?")[0]?.split("#")[0];
  if (path && cmsMap?.pathToNavId) {
    return cmsMap.pathToNavId[normalizeNavPath(path)];
  }
  return undefined;
}

function normalizeNavPath(path: string): string {
  const base = path.split("?")[0]?.split("#")[0]?.trim() || "/";
  return base.startsWith("/") ? base : `/${base}`;
}

/**
 * Prefer Sanity label; fall back to locale JSON (`nav.*`) when navId is set.
 */
export function resolveNavLabel(
  item: NavLinkLike,
  t: TFunction,
  lng?: "nb" | "en",
  cmsMap?: SlugLocaleMap,
): string {
  const cms = typeof item.label === "string" ? item.label.trim() : "";
  if (cms) return cms;

  const id = navIdForItem(item, cmsMap);
  if (id) {
    const key = `nav.${id}`;
    const translated = lng ? t(key, { lng }) : t(key);
    if (translated !== key) return translated;
  }

  return item.path || "";
}

export { resolveNavPath };
