/**
 * Tjenester megamenu membership and order come from Sanity:
 * - A treatment appears under each category in its `categories[]` field.
 * - Manual order follows the category's `treatments[]` array, then remaining
 *   linked treatments. Listing Sort Settings can override that.
 *
 * URL slug aliases stay in `src/lib/sanity/*-slug-aliases.ts` (routing only).
 */

export type TjenesterNavItem = {
  id: string;
  label: string;
  path: string;
  items?: Array<{ label: string; anchor?: string; path?: string }>;
};

/** Keep category `treatments[]` drag order, then append other linked treatments. */
export function mergeCategoryNavTreatments<T extends { _id: string }>(
  referenced: T[],
  categoryTreatmentsOrder: Array<T | null | undefined>,
): T[] {
  const byId = new Map(referenced.map((row) => [row._id, row]));
  const seen = new Set<string>();
  const ordered: T[] = [];

  for (const row of categoryTreatmentsOrder) {
    const id = row?._id;
    if (!id) continue;
    const match = byId.get(id);
    if (!match || seen.has(id)) continue;
    seen.add(id);
    ordered.push(match);
  }

  for (const row of referenced) {
    if (seen.has(row._id)) continue;
    seen.add(row._id);
    ordered.push(row);
  }

  return ordered;
}
