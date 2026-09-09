import { stripLocaleFromPathname } from "@/lib/i18n/routing";
import { resolveCmsRoute } from "@/lib/routing/resolve-route";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";

function normalize(path: string | undefined): string {
  const base = path?.split("?")[0]?.split("#")[0]?.trim();
  if (!base) return "";
  const stripped = stripLocaleFromPathname(base);
  return stripped.length > 1 && stripped.endsWith("/")
    ? stripped.slice(0, -1)
    : stripped;
}

/**
 * True on the services landing, any service category landing, and any treatment
 * page beneath one.
 *
 * The category/treatment part is answered by the CMS route resolver rather than
 * a list of URLs, so it follows Norwegian and English slugs and stays correct
 * when editors rename things. The route index is server-rendered, so the active
 * state is right on first paint instead of appearing once a query resolves.
 */
export function isServicesSectionActive(
  pathname: string,
  locale: "no" | "en",
  index: CmsRouteIndex | undefined,
  servicesPath?: string,
): boolean {
  const current = normalize(pathname);
  if (!current || current === "/") return false;

  const services = normalize(servicesPath);
  if (services && services !== "/") {
    if (current === services || current.startsWith(`${services}/`)) return true;
  }

  if (!index) return false;

  const route = resolveCmsRoute(current.split("/").filter(Boolean), locale, index);
  return route?.kind === "category" || route?.kind === "treatment";
}
