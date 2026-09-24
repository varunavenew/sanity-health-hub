/**
 * Effective specialist list for a pageSectionSpecialists band.
 *
 * Single source of truth: the section's displayMode + specialists[] refs.
 * Manual = the explicit list only.
 * Category / All = base-rule matches ∪ explicit specialists (deduped).
 *
 * Limit never hides an individually selected specialist. It only trims
 * remaining base-rule matches after those reserved slots.
 */
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import { resolveSpecialistsDisplayMode, type SpecialistsDisplayMode } from "@/lib/sanity/specialists-display-mode";
import type { Specialist } from "@/lib/sanity/specialist-types";

export type SpecialistListSource = "individual" | "category" | "all" | "both";

export type EffectiveSpecialistRow = {
  specialist: Specialist;
  source: SpecialistListSource;
  /** False when a base-rule match is omitted because Max items is already filled. */
  visible: boolean;
};

export type EffectiveSpecialistsResult = {
  mode: SpecialistsDisplayMode | undefined;
  visible: Specialist[];
  rows: EffectiveSpecialistRow[];
  extrasExceedLimit: boolean;
  truncatedBaseCount: number;
  /** Rule matches hidden on this page via excludedSpecialists. */
  excluded: Specialist[];
};

export function specialistListIdentity(specialist: {
  slug?: string;
  _id?: string;
  name?: string;
}): string {
  const slug = specialist.slug?.trim();
  if (slug) return `slug:${slug}`;
  const id = specialist._id?.replace(/^drafts\./, "").trim();
  if (id) return `id:${id}`;
  const name = specialist.name?.trim().toLowerCase();
  return name ? `name:${name}` : "";
}

function uniqueInOrder<T>(items: T[], identity: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = identity(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export type SpecialistExclusion = { _id?: string; _ref?: string; slug?: string };

/** True when the specialist is listed in the band's "Hidden from this page" refs. */
export function isSpecialistExcluded(
  specialist: { _id?: string; slug?: string; },
  excluded: SpecialistExclusion[] | undefined,
): boolean {
  if (!excluded?.length) return false;
  const id = specialist._id?.replace(/^drafts\./, "").trim();
  const slug = specialist.slug?.trim();
  return excluded.some((row) => {
    const rowId = (row._id || row._ref || "").replace(/^drafts\./, "").trim();
    if (id && rowId && rowId === id) return true;
    const rowSlug = row.slug?.trim();
    return Boolean(slug && rowSlug && rowSlug === slug);
  });
}

function sourceFor(
  mode: SpecialistsDisplayMode,
  inBase: boolean,
  inExplicit: boolean,
): SpecialistListSource {
  if (inBase && inExplicit) return "both";
  if (inExplicit) return "individual";
  return mode === "all" ? "all" : "category";
}

export function resolvePageSectionSpecialists(input: {
  displayMode: unknown;
  /** Individually selected specialists, stored array order. */
  explicit: Specialist[];
  /** Full catalog, already in listing / "All" order. */
  allSpecialists: Specialist[];
  categoryKey?: string;
  limit?: number;
  /** Rule matches to hide on this page. Individually selected people still show. */
  excluded?: SpecialistExclusion[];
  /**
   * Filter by category only: also show the individually selected specialists.
   * Off by default — the category list alone, as before.
   */
  includeExplicitInCategory?: boolean;
}): EffectiveSpecialistsResult {
  const mode = resolveSpecialistsDisplayMode(input.displayMode);
  if (!mode) {
    return {
      mode,
      visible: [],
      rows: [],
      extrasExceedLimit: false,
      truncatedBaseCount: 0,
      excluded: [],
    };
  }

  const identity = specialistListIdentity;
  const explicitInput =
    mode === "category" && !input.includeExplicitInCategory ? [] : input.explicit;
  const explicit = uniqueInOrder(
    explicitInput.filter((item) => identity(item)),
    identity,
  );
  const explicitIds = new Set(explicit.map(identity));

  if (mode === "manual") {
    const limit =
      typeof input.limit === "number" && input.limit > 0 ? input.limit : undefined;
    return {
      mode,
      visible: explicit,
      rows: explicit.map((specialist) => ({
        specialist,
        source: "individual",
        visible: true,
      })),
      extrasExceedLimit: Boolean(limit && explicit.length > limit),
      truncatedBaseCount: 0,
      excluded: [],
    };
  }

  const categoryKey = input.categoryKey?.trim() || "";
  let base: Specialist[] = [];
  if (mode === "category") {
    if (categoryKey) {
      base = input.allSpecialists
        .filter((specialist) => specialistMatchesCategory(specialist, categoryKey))
        .sort((a, b) => a.name.localeCompare(b.name, "nb"));
    }
  } else {
    base = [...input.allSpecialists];
  }
  base = uniqueInOrder(base, identity);
  const excluded = base.filter(
    (specialist) =>
      !explicitIds.has(identity(specialist)) && isSpecialistExcluded(specialist, input.excluded),
  );
  if (excluded.length) {
    const excludedIds = new Set(excluded.map(identity));
    base = base.filter((specialist) => !excludedIds.has(identity(specialist)));
  }
  const baseIds = new Set(base.map(identity));

  const extrasOnly = explicit.filter((specialist) => !baseIds.has(identity(specialist)));
  const baseOnly = base.filter((specialist) => !explicitIds.has(identity(specialist)));

  const limit =
    typeof input.limit === "number" && input.limit > 0 ? input.limit : undefined;
  const reserved = explicit.length;
  const remaining =
    typeof limit === "number" ? Math.max(0, limit - reserved) : baseOnly.length;
  const visibleBaseOnly = baseOnly.slice(0, remaining);
  const hiddenBaseOnly = baseOnly.slice(remaining);
  const visibleBaseOnlyIds = new Set(visibleBaseOnly.map(identity));

  const visible: Specialist[] = [
    ...base.filter(
      (specialist) =>
        explicitIds.has(identity(specialist)) ||
        visibleBaseOnlyIds.has(identity(specialist)),
    ),
    ...extrasOnly,
  ];

  const rows: EffectiveSpecialistRow[] = [
    ...base.map((specialist) => {
      const inExplicit = explicitIds.has(identity(specialist));
      return {
        specialist,
        source: sourceFor(mode, true, inExplicit),
        visible: inExplicit || visibleBaseOnlyIds.has(identity(specialist)),
      };
    }),
    ...extrasOnly.map((specialist) => ({
      specialist,
      source: "individual" as const,
      visible: true,
    })),
  ];

  return {
    mode,
    visible,
    rows,
    extrasExceedLimit: Boolean(limit && explicit.length > limit),
    truncatedBaseCount: hiddenBaseOnly.length,
    excluded,
  };
}

export function pageSectionCategoryKey(config: {
  categorySlug?: string;
  treatmentCategory?: { categoryId?: string; slug?: string };
}): string | undefined {
  const key =
    config.treatmentCategory?.categoryId ||
    config.treatmentCategory?.slug ||
    config.categorySlug;
  return key?.trim() || undefined;
}
