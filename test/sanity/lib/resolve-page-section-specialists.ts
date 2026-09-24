/**
 * Studio copy of src/lib/sanity/resolve-page-section-specialists.ts
 * Keep algorithms in sync — Sanity package cannot use @/ aliases.
 */
import {resolveSpecialistsDisplayMode, type SpecialistsDisplayMode} from '../page-editor/specialistsDisplayMode'

export type SpecialistListSource = 'individual' | 'category' | 'all' | 'both'

export type StudioSpecialist = {
  _id?: string
  name: string
  slug?: string
  categoryIds?: string[]
}

export type EffectiveSpecialistRow = {
  specialist: StudioSpecialist
  source: SpecialistListSource
  visible: boolean
}

export type EffectiveSpecialistsResult = {
  mode: SpecialistsDisplayMode | undefined
  visible: StudioSpecialist[]
  rows: EffectiveSpecialistRow[]
  extrasExceedLimit: boolean
  truncatedBaseCount: number
  /** Rule matches hidden on this page via excludedSpecialists. */
  excluded: StudioSpecialist[]
}

const CATEGORY_ALIASES: Record<string, string> = {
  fertility: 'fertilitet',
  gynecology: 'gynekologi',
  gynaecology: 'gynekologi',
  urology: 'urologi',
  orthopedics: 'ortopedi',
  pregnancy: 'graviditet',
  ovrige: 'annet',
  'flere-fagomrader': 'annet',
}

export function publishedDocumentId(id: string): string {
  return id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')
}

export function specialistListIdentity(specialist: {
  slug?: string
  _id?: string
  name?: string
}): string {
  const slug = specialist.slug?.trim()
  if (slug) return `slug:${slug}`
  const id = specialist._id ? publishedDocumentId(specialist._id) : ''
  if (id) return `id:${id}`
  const name = specialist.name?.trim().toLowerCase()
  return name ? `name:${name}` : ''
}

export function normalizeCategoryKey(slugOrId: string): string {
  const key = slugOrId.trim().toLowerCase()
  if (!key) return ''
  return CATEGORY_ALIASES[key] ?? key
}

export function specialistMatchesCategoryKey(
  specialist: StudioSpecialist,
  categoryKey: string,
): boolean {
  const key = normalizeCategoryKey(categoryKey)
  if (!key || key === 'alle') return true
  return (specialist.categoryIds ?? []).some((id) => normalizeCategoryKey(id) === key)
}

function uniqueInOrder<T>(items: T[], identity: (item: T) => string): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of items) {
    const k = identity(item)
    if (!k || seen.has(k)) continue
    seen.add(k)
    out.push(item)
  }
  return out
}

export type SpecialistExclusion = {_id?: string; _ref?: string; slug?: string}

/** True when the specialist is listed in the band's "Hidden from this page" refs. */
export function isSpecialistExcluded(
  specialist: {_id?: string; slug?: string},
  excluded: SpecialistExclusion[] | undefined,
): boolean {
  if (!excluded?.length) return false
  const id = specialist._id?.replace(/^drafts\./, '').trim()
  const slug = specialist.slug?.trim()
  return excluded.some((row) => {
    const rowId = (row._id || row._ref || '').replace(/^drafts\./, '').trim()
    if (id && rowId && rowId === id) return true
    const rowSlug = row.slug?.trim()
    return Boolean(slug && rowSlug && rowSlug === slug)
  })
}

function sourceFor(
  mode: SpecialistsDisplayMode,
  inBase: boolean,
  inExplicit: boolean,
): SpecialistListSource {
  if (inBase && inExplicit) return 'both'
  if (inExplicit) return 'individual'
  return mode === 'all' ? 'all' : 'category'
}

export function resolvePageSectionSpecialists(input: {
  displayMode: unknown
  explicit: StudioSpecialist[]
  allSpecialists: StudioSpecialist[]
  categoryKey?: string
  limit?: number
  /** Rule matches to hide on this page. Individually selected people still show. */
  excluded?: SpecialistExclusion[]
  /**
   * Filter by category only: also show the individually selected specialists.
   * Off by default — the category list alone, as before.
   */
  includeExplicitInCategory?: boolean
}): EffectiveSpecialistsResult {
  const mode = resolveSpecialistsDisplayMode(input.displayMode)
  if (!mode) {
    return {
      mode,
      visible: [],
      rows: [],
      extrasExceedLimit: false,
      truncatedBaseCount: 0,
      excluded: [],
    }
  }

  const identityOf = (item: StudioSpecialist) => specialistListIdentity(item)
  const explicitInput =
    mode === 'category' && !input.includeExplicitInCategory ? [] : input.explicit
  const explicit = uniqueInOrder(
    explicitInput.filter((item) => identityOf(item)),
    identityOf,
  )
  const explicitIds = new Set(explicit.map(identityOf))

  if (mode === 'manual') {
    const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : undefined
    return {
      mode,
      visible: explicit,
      rows: explicit.map((specialist) => ({
        specialist,
        source: 'individual' as const,
        visible: true,
      })),
      extrasExceedLimit: Boolean(limit && explicit.length > limit),
      truncatedBaseCount: 0,
      excluded: [],
    }
  }

  const categoryKey = input.categoryKey?.trim() || ''
  let base: StudioSpecialist[] = []
  if (mode === 'category') {
    if (categoryKey) {
      base = input.allSpecialists
        .filter((specialist) => specialistMatchesCategoryKey(specialist, categoryKey))
        .sort((a, b) => a.name.localeCompare(b.name, 'nb'))
    }
  } else {
    base = [...input.allSpecialists]
  }
  base = uniqueInOrder(base, identityOf)
  const excluded = base.filter(
    (specialist) =>
      !explicitIds.has(identityOf(specialist)) && isSpecialistExcluded(specialist, input.excluded),
  )
  if (excluded.length) {
    const excludedIds = new Set(excluded.map(identityOf))
    base = base.filter((specialist) => !excludedIds.has(identityOf(specialist)))
  }
  const baseIds = new Set(base.map(identityOf))

  const extrasOnly = explicit.filter((specialist) => !baseIds.has(identityOf(specialist)))
  const baseOnly = base.filter((specialist) => !explicitIds.has(identityOf(specialist)))

  const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : undefined
  const reserved = explicit.length
  const remaining = typeof limit === 'number' ? Math.max(0, limit - reserved) : baseOnly.length
  const visibleBaseOnly = baseOnly.slice(0, remaining)
  const hiddenBaseOnly = baseOnly.slice(remaining)
  const visibleBaseOnlyIds = new Set(visibleBaseOnly.map(identityOf))

  const visible: StudioSpecialist[] = [
    ...base.filter(
      (specialist) =>
        explicitIds.has(identityOf(specialist)) || visibleBaseOnlyIds.has(identityOf(specialist)),
    ),
    ...extrasOnly,
  ]

  const rows: EffectiveSpecialistRow[] = [
    ...base.map((specialist) => {
      const inExplicit = explicitIds.has(identityOf(specialist))
      return {
        specialist,
        source: sourceFor(mode, true, inExplicit),
        visible: inExplicit || visibleBaseOnlyIds.has(identityOf(specialist)),
      }
    }),
    ...extrasOnly.map((specialist) => ({
      specialist,
      source: 'individual' as const,
      visible: true,
    })),
  ]

  return {
    mode,
    visible,
    rows,
    extrasExceedLimit: Boolean(limit && explicit.length > limit),
    truncatedBaseCount: hiddenBaseOnly.length,
    excluded,
  }
}

export function pageSectionCategoryKey(config: {
  categorySlug?: string
  treatmentCategory?: {categoryId?: string; slug?: string; _ref?: string}
}): string | undefined {
  const key =
    config.treatmentCategory?.categoryId ||
    config.treatmentCategory?.slug ||
    config.categorySlug
  return key?.trim() || undefined
}

export function sourceLabel(
  source: SpecialistListSource,
  mode?: SpecialistsDisplayMode,
): string {
  if (source === 'individual') return 'Added individually'
  if (source === 'category') return 'Included by category'
  if (source === 'all') return 'Included by All'
  return mode === 'all'
    ? 'Added individually · Included by All'
    : 'Added individually · Included by category'
}

export function newArrayKey(prefix = 'item'): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(16).slice(2, 14)
  return `${prefix}-${rand}`
}
