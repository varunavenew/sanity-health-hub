import type { TFunction } from "i18next";
import {
  NAV_ROUTE_PATHS,
  PATH_TO_NAV_ID,
  type NavRouteId,
} from "@/lib/i18n/nav-paths";
import {
  resolveNavPath,
  type NavLinkLike,
} from "@/lib/navigation/nav-path-utils";

export type { NavLinkLike };

function navIdForItem(item: NavLinkLike): NavRouteId | undefined {
  if (item.navId?.trim()) {
    const id = item.navId.trim() as NavRouteId;
    return id in NAV_ROUTE_PATHS ? id : undefined;
  }
  const path = item.path?.split("?")[0]?.split("#")[0];
  return path ? PATH_TO_NAV_ID[path] : undefined;
}

/**
 * Prefer Sanity label; fall back to locale JSON (`nav.*`) when navId is set.
 */
export function resolveNavLabel(
  item: NavLinkLike,
  t: TFunction,
  lng?: "nb" | "en",
): string {
  const cms = typeof item.label === "string" ? item.label.trim() : "";
  if (cms) return cms;

  const id = navIdForItem(item);
  if (id) {
    const key = `nav.${id}`;
    const translated = lng ? t(key, { lng }) : t(key);
    if (translated !== key) return translated;
  }

  return item.path || "";
}

export { resolveNavPath };
