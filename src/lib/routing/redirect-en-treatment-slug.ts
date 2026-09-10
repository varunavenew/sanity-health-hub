import { permanentRedirect } from "next/navigation";
import type { ResolvedCmsRoute } from "@/lib/routing/cms-route-types";
import { pathsForTreatment } from "@/lib/routing/singleton-slug-paths";

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

/**
 * EN treatment URLs that used the Norwegian slug still 200'd (canonical pointed
 * at the English slug). Send a permanent redirect to that canonical path.
 */
export async function redirectEnTreatmentIfNotCanonical(
  locale: string,
  segments: string[],
  route: ResolvedCmsRoute,
): Promise<void> {
  if (locale !== "en" || route.kind !== "treatment") return;

  const categorySlug = route.categorySlug || route.categoryId || "";
  const treatmentSlug = route.slug;
  if (!categorySlug || !treatmentSlug) return;

  const { enPath } = await pathsForTreatment(categorySlug, treatmentSlug, "en");
  if (!enPath || !enPath.startsWith("/en/") || enPath.includes("//")) return;

  const current = normalizePath(`/${locale}/${segments.filter(Boolean).join("/")}`);
  if (normalizePath(enPath) !== current) {
    permanentRedirect(enPath);
  }
}
