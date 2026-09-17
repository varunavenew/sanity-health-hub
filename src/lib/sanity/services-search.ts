/**
 * Strict, content-driven service search for /tjenester.
 * Matches only when the query is a prefix of, or contained in, a searchable term.
 * No fuzzy / Fuse fallback — unrelated services must not appear.
 */

export type ServicesSearchItem = {
  label: string;
  path: string;
  /** Optional secondary label (e.g. parent category). */
  category?: string;
  searchKeywords?: string[];
};

/** Lowercase, trim, and normalize Norwegian letters for consistent matching. */
export function normalizeServiceSearchText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Text inside parentheses, e.g. "Overvektskirurgi (slankeoperasjon)" → ["slankeoperasjon"]. */
export function extractParentheticalTerms(label: string): string[] {
  const terms: string[] = [];
  const re = /\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(label)) !== null) {
    const inner = match[1]?.trim();
    if (inner) terms.push(inner);
  }
  return terms;
}

/**
 * Build searchable terms from the visible label, parenthetical text, and CMS synonyms.
 */
export function buildServiceSearchTerms(
  label: string,
  searchKeywords: string[] = [],
): string[] {
  const raw = [
    label,
    ...extractParentheticalTerms(label),
    ...searchKeywords.filter((k) => typeof k === "string" && k.trim()),
  ];

  const seen = new Set<string>();
  const terms: string[] = [];
  for (const part of raw) {
    const normalized = normalizeServiceSearchText(part);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    terms.push(normalized);
  }
  return terms;
}

function termMatchesQuery(term: string, query: string): boolean {
  return term.includes(query) || term.startsWith(query);
}

/**
 * Strict service search: query must be contained in or prefix a searchable term.
 */
export function searchServicesStrict(
  items: ServicesSearchItem[],
  query: string,
  limit = 8,
): ServicesSearchItem[] {
  const normalizedQuery = normalizeServiceSearchText(query);
  if (!normalizedQuery) return [];

  const scored: { item: ServicesSearchItem; score: number }[] = [];

  for (const item of items) {
    if (!item.label?.trim() || !item.path?.trim()) continue;

    const terms = buildServiceSearchTerms(item.label, item.searchKeywords || []);
    if (!terms.some((term) => termMatchesQuery(term, normalizedQuery))) continue;

    const labelNorm = normalizeServiceSearchText(item.label);
    let score = 0;
    if (labelNorm.startsWith(normalizedQuery)) score += 100;
    else if (labelNorm.includes(normalizedQuery)) score += 70;
    else score += 40;

    scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label, "nb"))
    .slice(0, limit)
    .map((r) => r.item);
}
