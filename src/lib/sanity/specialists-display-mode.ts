/**
 * Resolve Specialists band displayMode from stored Sanity data only.
 *
 * After migrate-treatment-restore-specialists-config.ts, every Treatment
 * pageSectionSpecialists must persist an explicit displayMode. This helper
 * never invents "all" for missing values — that caused Studio/FE desync.
 *
 * @returns The stored mode, or undefined when not configured / invalid.
 */
export type SpecialistsDisplayMode = "all" | "manual" | "category";

export function resolveSpecialistsDisplayMode(
  value: unknown,
): SpecialistsDisplayMode | undefined {
  if (value === "all" || value === "manual" || value === "category") {
    return value;
  }
  return undefined;
}

/** Studio summary chip labels — mirrors stored value only. */
export function specialistsDisplayModeChip(
  displayMode: unknown,
): string {
  const mode = resolveSpecialistsDisplayMode(displayMode);
  if (!mode) return "Not configured";
  if (mode === "all") return "All Specialists";
  if (mode === "category") return "Filter by category";
  return "Choose manually";
}

export type ArticlesDisplayMode = "latest" | "manual" | "category";

export function resolveArticlesDisplayMode(
  value: unknown,
): ArticlesDisplayMode | undefined {
  if (value === "latest" || value === "manual" || value === "category") {
    return value;
  }
  return undefined;
}

export function articlesDisplayModeChip(displayMode: unknown): string {
  const mode = resolveArticlesDisplayMode(displayMode);
  if (!mode) return "Not configured";
  if (mode === "latest") return "Latest articles";
  if (mode === "category") return "Filter by category";
  return "Choose manually";
}
