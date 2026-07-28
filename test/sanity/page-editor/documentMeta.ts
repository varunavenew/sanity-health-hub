/**
 * Safe metadata helpers for section cards.
 * Counts and labels must come from real document values — never fabricated.
 */

export type RefLike = {_ref?: unknown} | null | undefined

/** Count array entries that have a non-empty `_ref` (real references only). */
export function countReferenceArray(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) return undefined
  return value.filter((item) => {
    if (!item || typeof item !== 'object') return false
    const ref = (item as {_ref?: unknown})._ref
    return typeof ref === 'string' && ref.trim().length > 0
  }).length
}

export function countArray(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) return undefined
  return value.length
}

export function countChip(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/**
 * Build chips from a loaded document. If the document is not ready, return Unknown
 * instead of inventing metadata.
 */
export function chipsFromDocument(
  document: Record<string, unknown> | undefined,
  ready: boolean,
  compute: (doc: Record<string, unknown>) => string[],
): string[] {
  if (!ready || !document) return ['Unknown']
  const chips = compute(document)
    .map((chip) => (typeof chip === 'string' ? chip.trim() : ''))
    .filter(Boolean)
  return chips.length > 0 ? chips : ['Unknown']
}

