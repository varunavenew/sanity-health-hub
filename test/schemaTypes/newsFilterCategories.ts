/**
 * News Page filter categories — editor-facing labels vs stored article.category values.
 *
 * Studio shows only the four business options. On save, each option expands to every
 * known alias so the existing frontend `.includes(article.category)` match keeps
 * working without frontend or article migrations.
 */

export type NewsFilterBusinessId =
  | 'patientStories'
  | 'media'
  | 'professional'
  | 'newsFromUs'

export type NewsFilterBusinessCategory = {
  id: NewsFilterBusinessId
  title: string
  /** Stored on newsPage.filters[].acceptedArticleCategories for frontend matching. */
  matchValues: readonly string[]
}

export const NEWS_FILTER_BUSINESS_CATEGORIES: readonly NewsFilterBusinessCategory[] = [
  {
    id: 'patientStories',
    title: 'Patient Stories',
    matchValues: ['Pasienthistorier'],
  },
  {
    id: 'media',
    title: 'Media',
    matchValues: ['Oss i media'],
  },
  {
    id: 'professional',
    title: 'Professional Articles',
    // Schema enum + Norwegian label + typo variant found in content
    matchValues: ['Fagartikler', 'fagartikkel', 'Fagartiklar'],
  },
  {
    id: 'newsFromUs',
    title: 'News from us',
    // Schema `news` + legacy spellings; frontend also maps "Nyheter" → "Nytt fra oss"
    matchValues: ['Nytt fra oss', 'Nyheter', 'nyheter', 'news'],
  },
]

/** Every string the frontend may see in acceptedArticleCategories after expansion. */
export const NEWS_FILTER_STORED_CATEGORY_VALUES: readonly string[] =
  NEWS_FILTER_BUSINESS_CATEGORIES.flatMap((c) => [...c.matchValues])

export const NEWS_FILTER_ALLOWED_STORED_CATEGORIES: Set<string> = new Set(
  NEWS_FILTER_STORED_CATEGORY_VALUES,
)

/** Which business options are selected given a stored alias array. */
export function businessIdsFromStoredCategories(
  stored: unknown,
): NewsFilterBusinessId[] {
  const values = Array.isArray(stored)
    ? stored.filter((v): v is string => typeof v === 'string')
    : []
  if (values.length === 0) return []

  const selected = new Set(values)
  return NEWS_FILTER_BUSINESS_CATEGORIES.filter((cat) =>
    cat.matchValues.some((alias) => selected.has(alias)),
  ).map((cat) => cat.id)
}

/** Expand editor selections into the full alias list for storage. */
export function expandBusinessCategoriesToStored(
  ids: readonly NewsFilterBusinessId[],
): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const id of ids) {
    const cat = NEWS_FILTER_BUSINESS_CATEGORIES.find((c) => c.id === id)
    if (!cat) continue
    for (const value of cat.matchValues) {
      if (seen.has(value)) continue
      seen.add(value)
      out.push(value)
    }
  }
  return out
}

/** Studio list / preview labels for stored values (never shows raw aliases). */
export function businessTitlesFromStoredCategories(stored: unknown): string[] {
  const ids = businessIdsFromStoredCategories(stored)
  return ids.map(
    (id) => NEWS_FILTER_BUSINESS_CATEGORIES.find((c) => c.id === id)?.title || id,
  )
}
