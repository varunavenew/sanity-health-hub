/**
 * Pure URL-slug helpers (no Studio imports) so they can be unit-tested in Node.
 * Re-exported from `./i18n`.
 */

export const URL_SLUG_PATTERN = /^[a-z0-9-]+$/

export const URL_SLUG_PATTERN_MESSAGE =
  'URL-slug kan bare inneholde små bokstaver (a–z), tall (0–9) og bindestreker (-). Mellomrom, store bokstaver og æ, ø, å er ikke tillatt.'

export function isValidUrlSlug(slug: string): boolean {
  return URL_SLUG_PATTERN.test(slug)
}

/** Trimmed `current` for one language of an internationalizedArraySlug value. */
export function slugForLang(value: unknown, lang: string): string {
  if (!Array.isArray(value)) return ''
  const entry = value.find((x: any) => (x?.language || x?._key) === lang)
  const current = entry?.value?.current ?? entry?.value
  return typeof current === 'string' ? current.trim() : ''
}

/** `true` when NO + EN exist and every language slug matches URL_SLUG_PATTERN; otherwise the error message. */
export function validateNoEnUrlSlug(value: unknown): true | string {
  if (!slugForLang(value, 'no')) return 'URL slug (Norwegian) is required'
  if (!slugForLang(value, 'en')) return 'URL slug (English) is required'
  if (!Array.isArray(value)) return true
  for (const entry of value) {
    const current = entry?.value?.current ?? entry?.value
    if (typeof current !== 'string' || current === '') continue
    if (!isValidUrlSlug(current)) {
      const lang = entry?.language || entry?._key
      return lang ? `${URL_SLUG_PATTERN_MESSAGE} (${lang}: «${current}»)` : URL_SLUG_PATTERN_MESSAGE
    }
  }
  return true
}

/**
 * URL slugify used by Studio Generate (and matching migration scripts).
 * Examples: "Kne & Hofte" → "kne-hofte", "Women's Health" → "womens-health"
 */
export function slugifyForUrl(input: string, maxLength = 96): string {
  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Drop apostrophes so "Women's" → "womens" (not "women-s")
    .replace(/[''`´]/g, '')

  const slug = cleaned
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return slug.slice(0, maxLength)
}
