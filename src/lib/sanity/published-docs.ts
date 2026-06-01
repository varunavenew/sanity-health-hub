/** Exclude draft document IDs and incomplete clinic rows from public lists. */
export function isPublishedSanityId(id: string | undefined): boolean {
  return Boolean(id && !id.startsWith("drafts."));
}

export function filterPublishedDocuments<T extends { _id?: string }>(docs: T[]): T[] {
  return docs.filter((d) => isPublishedSanityId(d._id));
}

/** Deduplicate by slug/id; prefer first published entry. */
export function dedupeBySlug<T extends { slug?: string; id?: string }>(docs: T[]): T[] {
  const map = new Map<string, T>();
  for (const doc of docs) {
    const key = (doc.slug || doc.id || "").trim();
    if (!key) continue;
    if (!map.has(key)) map.set(key, doc);
  }
  return [...map.values()];
}
