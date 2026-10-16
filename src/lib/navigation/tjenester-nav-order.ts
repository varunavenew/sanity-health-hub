/**
 * Tjenester megamenu membership and order come from Sanity:
 * - Drag order on **Tjenester menu & list order** (categories + per-category treatments).
 * - Column 3: **Settings → Column 3** children list (membership + drag order).
 * - Column 1/2: items not in a drag list are appended last (by created date).
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

function normalizeDocId(id: string): string {
  return id.replace(/^drafts\./, "");
}

function createdAtMs(item: { _createdAt?: string | null }): number {
  const raw = item._createdAt;
  if (!raw) return 0;
  const ms = new Date(raw).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

/**
 * Order items by an explicit id list (drag order). Items not in the list are
 * appended at the end, oldest → newest so new pages appear last.
 */
export function orderNavItemsByIdList<T extends { _id: string; _createdAt?: string | null }>(
  items: T[],
  orderedIds: Array<string | null | undefined> | undefined | null,
): T[] {
  if (!items.length) return items;

  const byId = new Map(items.map((row) => [normalizeDocId(row._id), row]));
  const result: T[] = [];
  const seen = new Set<string>();

  for (const rawId of orderedIds || []) {
    if (!rawId) continue;
    const id = normalizeDocId(rawId);
    const match = byId.get(id);
    if (!match || seen.has(id)) continue;
    seen.add(id);
    result.push(match);
  }

  const rest = items.filter((row) => !seen.has(normalizeDocId(row._id)));
  rest.sort((a, b) => createdAtMs(a) - createdAtMs(b));
  return [...result, ...rest];
}

/**
 * Only items listed in `orderedIds` (Settings column 3). Unlisted linked
 * treatments are excluded from the megamenu.
 */
export function pickNavItemsByIdList<T extends { _id: string }>(
  items: T[],
  orderedIds: Array<string | null | undefined> | undefined | null,
): T[] {
  if (!items.length || !orderedIds?.length) return [];

  const byId = new Map(items.map((row) => [normalizeDocId(row._id), row]));
  const result: T[] = [];
  const seen = new Set<string>();

  for (const rawId of orderedIds) {
    if (!rawId) continue;
    const id = normalizeDocId(rawId);
    const match = byId.get(id);
    if (!match || seen.has(id)) continue;
    seen.add(id);
    result.push(match);
  }

  return result;
}
