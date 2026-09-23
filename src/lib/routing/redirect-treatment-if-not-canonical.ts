import { permanentRedirect } from "next/navigation";
import type { ResolvedCmsRoute } from "@/lib/routing/cms-route-types";
import { pathsForTreatment } from "@/lib/routing/singleton-slug-paths";

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

/**
 * Treatment URLs that resolve via slug aliases (e.g. NO `/gynekologi/pcos` →
 * CMS slug `pmos`) used to 200 with a canonical tag pointing at the real URL.
 * Send a permanent redirect to the locale-canonical path instead.
 */
export async function redirectTreatmentIfNotCanonical(
  locale: string,
  segments: string[],
  route: ResolvedCmsRoute,
): Promise<void> {
  if (route.kind !== "treatment") return;

  const categorySlug = route.categorySlug || route.categoryId || "";
  const treatmentSlug = route.slug;
  if (!categorySlug || !treatmentSlug) return;

  const sanityLang = locale === "en" ? "en" : "no";
  const { nbPath, enPath } = await pathsForTreatment(
    categorySlug,
    treatmentSlug,
    sanityLang,
  );
  const canonicalPath = sanityLang === "en" ? enPath : nbPath;
  const expectedPrefix = sanityLang === "en" ? "/en/" : "/no/";
  if (
    !canonicalPath ||
    !canonicalPath.startsWith(expectedPrefix) ||
    canonicalPath.includes("//")
  ) {
    return;
  }

  // App locale may be `nb` while canonical paths are built under `/no/`.
  const target =
    locale === "nb" ? canonicalPath.replace(/^\/no\//, "/nb/") : canonicalPath;

  const current = normalizePath(
    `/${locale}/${segments.filter(Boolean).join("/")}`,
  );
  if (normalizePath(target) !== current) {
    permanentRedirect(target);
  }
}
