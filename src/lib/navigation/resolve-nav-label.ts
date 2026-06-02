import type { TFunction } from "i18next";
import type { AppLocale } from "@/lib/i18n/routing";
import {
  NAV_ROUTE_PATHS,
  PATH_TO_NAV_ID,
  localizeInternalPath,
  type NavRouteId,
} from "@/lib/i18n/nav-paths";

export type NavLinkLike = {
  label?: string;
  path?: string;
  navId?: string;
};

function navIdForItem(item: NavLinkLike): NavRouteId | undefined {
  if (item.navId?.trim()) {
    const id = item.navId.trim() as NavRouteId;
    return id in NAV_ROUTE_PATHS ? id : undefined;
  }
  const path = item.path?.split("?")[0]?.split("#")[0];
  return path ? PATH_TO_NAV_ID[path] : undefined;
}

/**
 * Standard menu items use locale JSON (`nav.*`) so EN/NO switch instantly.
 * Custom CMS-only links use the Sanity label for the active locale.
 */
export function resolveNavLabel(
  item: NavLinkLike,
  t: TFunction,
  lng?: "nb" | "en",
): string {
  const id = navIdForItem(item);
  if (id) {
    const key = `nav.${id}`;
    const translated = lng ? t(key, { lng }) : t(key);
    if (translated !== key) return translated;
  }

  const cms = typeof item.label === "string" ? item.label.trim() : "";
  if (cms) return cms;

  return item.path || "";
}

/** Resolve locale-specific internal path from CMS navId/path or static fallback. */
export function resolveNavPath(item: NavLinkLike, locale: string): string {
  const id = navIdForItem(item);
  if (id) {
    return NAV_ROUTE_PATHS[id][locale === "en" ? "en" : "nb"];
  }
  const path = typeof item.path === "string" ? item.path.trim() : "";
  if (!path) return path;
  return localizeInternalPath(path, locale === "en" ? "en" : "nb");
}
