/**
 * Shared helpers for sanity-plugin-internationalized-array fields.
 */
import {LocalizedObjectPreview} from '../sanity/components/LocalizedObjectPreview'

export function pickNo(value: unknown): string {
  if (Array.isArray(value)) {
    return (
      (value.find((x: any) => (x.language || x._key) === 'no')?.value as string) ||
      (value[0]?.value as string) ||
      ''
    )
  }
  return typeof value === 'string' ? value : ''
}

export function pickSpecialtyLabel(entry: unknown): string {
  return pickSpecialtyLabelForLang(entry, getStudioContentLanguage())
}

export function pickSpecialtyLabelForLang(entry: unknown, lang: string): string {
  if (entry && typeof entry === 'object' && 'label' in entry) {
    return pickForLang((entry as { label?: unknown }).label, lang)
  }
  return pickForLang(entry, lang)
}

export function hasSpecialtyWithLangText(items: unknown, lang: string): boolean {
  if (!Array.isArray(items) || items.length === 0) return false
  return items.some((entry) => Boolean(pickSpecialtyLabelForLang(entry, lang)?.trim()))
}

export function hasSpecialtyWithNoText(items: unknown): boolean {
  return hasSpecialtyWithLangText(items, 'no')
}

export function hasSpecialtyWithEnText(items: unknown): boolean {
  return hasSpecialtyWithLangText(items, 'en')
}

/** Sanity validation: internationalized field must have Norwegian text. */
export function requiredNoI18n(message: string) {
  return (Rule: any) =>
    Rule.custom((value: unknown) => {
      if (!pickNo(value)?.trim()) return message
      return true
    })
}

/**
 * Sanity validation: internationalized field must have Norwegian and English text.
 * Use Rule.custom only — Rule.required() on internationalizedArray* fields can
 * cause infinite re-render loops in Studio (sanity-plugin-internationalized-array).
 */
export function requiredNoEnI18n(label: string) {
  return (Rule: any) =>
    Rule.custom((value: unknown) => {
      if (!pickNo(value)?.trim()) return `${label} (Norwegian) is required`
      if (!pickForLang(value, 'en')?.trim()) return `${label} (English) is required`
      return true
    })
}

function slugForLang(value: unknown, lang: string): string {
  if (!Array.isArray(value)) return ''
  const entry = value.find((x: any) => (x.language || x._key) === lang)
  const current = entry?.value?.current ?? entry?.value
  return typeof current === 'string' ? current.trim() : ''
}

/** Sanity validation: localized slug must exist for NO and EN. */
export function requiredNoEnSlug() {
  return (Rule: any) =>
    Rule.custom((value: unknown) => {
      if (!slugForLang(value, 'no')) return 'URL slug (Norwegian) is required'
      if (!slugForLang(value, 'en')) return 'URL slug (English) is required'
      return true
    })
}

function hasLangBlockContent(value: unknown, lang: string): boolean {
  if (!Array.isArray(value)) return false
  const entry = value.find((x: any) => (x.language || x._key) === lang)
  if (!entry) return false
  const v = entry.value
  if (typeof v === 'string') return Boolean(v.trim())
  if (Array.isArray(v)) return v.length > 0
  return Boolean(v)
}

/** Sanity validation: block content must exist for NO and EN. */
export function requiredNoEnBlockContent(label: string) {
  return (Rule: any) =>
    Rule.custom((value: unknown) => {
      if (!hasLangBlockContent(value, 'no')) return `${label} (Norwegian) is required`
      if (!hasLangBlockContent(value, 'en')) return `${label} (English) is required`
      return true
    })
}

/** Document-level check: block content exists in both NO and EN. */
export function hasNoEnBlockContent(value: unknown): boolean {
  return hasLangBlockContent(value, 'no') && hasLangBlockContent(value, 'en')
}

/** Sanity validation: SEO object with Norwegian meta title and description. */
export function requiredNoSeo(Rule: any) {
  return Rule.required().custom((seo: unknown) => {
    if (!seo || typeof seo !== 'object') return 'SEO settings are required'
    const s = seo as Record<string, unknown>
    if (!pickNo(s.metaTitle)?.trim()) return 'Meta title (Norwegian) is required'
    if (!pickNo(s.metaDescription)?.trim()) return 'Meta description (Norwegian) is required'
    return true
  })
}

/** Sanity validation: SEO object with NO + EN meta title and description. */
export function requiredNoEnSeo(Rule: any) {
  return Rule.required().custom((seo: unknown) => {
    if (!seo || typeof seo !== 'object') return 'SEO settings are required'
    const s = seo as Record<string, unknown>
    if (!pickNo(s.metaTitle)?.trim()) return 'Meta title (Norwegian) is required'
    if (!pickForLang(s.metaTitle, 'en')?.trim()) return 'Meta title (English) is required'
    if (!pickNo(s.metaDescription)?.trim()) return 'Meta description (Norwegian) is required'
    if (!pickForLang(s.metaDescription, 'en')?.trim()) {
      return 'Meta description (English) is required'
    }
    return true
  })
}

export function pickForLang(value: unknown, lang: string): string {
  if (!Array.isArray(value)) return typeof value === 'string' ? value : ''
  const entry = value.find((x: any) => (x.language || x._key) === lang)
  return (entry?.value as string) || ''
}

/** Content languages used in internationalized arrays. */
export type StudioContentLang = 'no' | 'en'

/**
 * Map Sanity Studio UI locale id (e.g. `en-US`, `nb-NO`) → content language.
 */
export function studioLocaleToContentLang(localeId: string | undefined | null): StudioContentLang {
  if (!localeId) return 'en'
  const id = localeId.toLowerCase()
  if (id === 'no' || id.startsWith('no-') || id.startsWith('nb') || id.startsWith('nn')) {
    return 'no'
  }
  if (id.startsWith('en')) return 'en'
  // Studio default chrome is English in this project.
  return 'en'
}

/**
 * Active Studio UI language → content lang for previews.
 * Reads `sanity-locale:{projectId}:{source}` from localStorage (same as Sanity i18n).
 * Defaults to English when unset (matches Studio UI default).
 */
export function getStudioContentLanguage(): StudioContentLang {
  if (typeof window === 'undefined') return 'en'
  try {
    const projectId =
      process.env.SANITY_STUDIO_API_PROJECT_ID?.trim() ||
      process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
      process.env.SANITY_PROJECT_ID?.trim()
    const sourceName = 'default'
    if (projectId) {
      const stored = window.localStorage.getItem(`sanity-locale:${projectId}:${sourceName}`)
      if (stored) return studioLocaleToContentLang(stored)
    }
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key?.startsWith('sanity-locale:')) {
        const stored = window.localStorage.getItem(key)
        if (stored) return studioLocaleToContentLang(stored)
      }
    }
  } catch {
    // ignore storage access errors
  }
  return 'en'
}

/**
 * Studio-only preview string from internationalized-array (or plain string).
 *
 * Preferred order follows the active Studio UI language:
 * - EN Studio → EN → NO → first available
 * - NO Studio → NO → EN → first available
 *
 * Does not affect website / GROQ.
 */
export function resolveLocalizedPreview(
  value: unknown,
  preferred: StudioContentLang = getStudioContentLanguage(),
): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''

  const primary = preferred
  const secondary: StudioContentLang = preferred === 'en' ? 'no' : 'en'

  const first = pickForLang(value, primary)?.trim()
  if (first) return first

  const second = pickForLang(value, secondary)?.trim()
  if (second) return second

  for (const entry of value) {
    const raw = (entry as {value?: unknown})?.value
    if (typeof raw === 'string' && raw.trim()) return raw.trim()
  }
  return ''
}

/**
 * @deprecated Prefer {@link resolveLocalizedPreview} — same Studio-locale-aware behavior.
 */
export function resolveLocalizedString(value: unknown): string {
  return resolveLocalizedPreview(value)
}

export function truncatePreview(text: string, max = 80): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function truncate(text: string, max = 80): string {
  return truncatePreview(text, max)
}

export type LocalizedPreviewOptions = {
  /** Schema field used as the list title (default: `title`). */
  titleField?: string
  /**
   * Schema field used as subtitle.
   * Pass `null` to omit. Default: `description`.
   */
  subtitleField?: string | null
  /** Shown only when every localized title value is empty. */
  fallback?: string
}

/**
 * Reusable Studio array-item preview for internationalized fields.
 * Uses {@link resolveLocalizedPreview} + a React preview component that
 * re-resolves when the Studio UI language changes.
 */
export function localizedPreview(options: LocalizedPreviewOptions = {}) {
  const titleField = options.titleField ?? 'title'
  const subtitleField =
    options.subtitleField === null ? null : (options.subtitleField ?? 'description')
  const fallback = options.fallback ?? 'Untitled'

  const select: Record<string, string> = {title: titleField}
  if (subtitleField) select.subtitle = subtitleField

  return {
    select,
    prepare({title, subtitle}: {title?: unknown; subtitle?: unknown}) {
      const lang = getStudioContentLanguage()
      const heading = resolveLocalizedPreview(title, lang)
      const sub = resolveLocalizedPreview(subtitle, lang)
      return {
        title: heading || fallback,
        subtitle: sub ? truncate(sub) : undefined,
        i18nTitle: title,
        i18nSubtitle: subtitle,
        i18nFallback: fallback,
      }
    },
    component: LocalizedObjectPreview,
  }
}

/** Studio list preview for FAQ rows (`question` + optional `answer`). */
export const i18nFaqItemPreview = localizedPreview({
  titleField: 'question',
  subtitleField: 'answer',
  fallback: 'FAQ',
})

/** Studio list preview for objects with i18n `title` (+ optional `description`). */
export const i18nTitleItemPreview = localizedPreview()

/** Objects whose primary label field is `label` (e.g. keyword links, service groups). */
export const i18nLabelItemPreview = localizedPreview({
  titleField: 'label',
  subtitleField: 'href',
  fallback: 'Untitled',
})

/** Review / quote rows: prefer author name, fall back to quote text. */
export const i18nReviewItemPreview = {
  select: {author: 'author', text: 'text', date: 'date'},
  prepare({
    author,
    text,
    date,
  }: {
    author?: unknown
    text?: unknown
    date?: unknown
  }) {
    const lang = getStudioContentLanguage()
    const name = resolveLocalizedPreview(author, lang)
    const quote = resolveLocalizedPreview(text, lang)
    const when = resolveLocalizedPreview(date, lang)
    const titleSource = name ? author : text
    return {
      title: name || quote || 'Review',
      subtitle: [name && quote ? truncate(quote) : undefined, when]
        .filter(Boolean)
        .join(' · ') || undefined,
      i18nTitle: titleSource,
      i18nSubtitle: name ? text : when,
      i18nFallback: 'Review',
    }
  },
  component: LocalizedObjectPreview,
}

type SlugFieldOverrides = {
  title?: string
  group?: string
  description?: string
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

/**
 * Localized URL slug (NO + EN) sourced from an internationalizedArrayString title field.
 * Studio: Generate fills from the matching language title when empty / when Generate is clicked.
 * Manual slug edits are kept until the editor clicks Generate again.
 */
export function i18nSlugFieldFromTitle(titleField = 'title', overrides: SlugFieldOverrides = {}) {
  return {
    name: 'slug',
    title: overrides.title ?? 'URL Slug',
    type: 'internationalizedArraySlug',
    description:
      overrides.description ??
      'One slug per language (NO + EN). Fills from the document title when empty. Manual edits are kept unless you Generate again.',
    group: overrides.group,
    options: {
      source: (doc: any, context: any) => {
        const lang = context?.parent?.language || context?.parent?._key || 'no'
        const titles = doc?.[titleField]
        if (typeof titles === 'string') return titles
        if (!Array.isArray(titles)) return ''
        return pickForLang(titles, lang) || pickNo(titles)
      },
      slugify: (input: string) => slugifyForUrl(input, 96),
      maxLength: 96,
    },
    validation: requiredNoEnSlug(),
  }
}

/**
 * Localized URL slug sourced from a plain string field (e.g. specialist name).
 */
export function i18nSlugFieldFromString(sourceField: string, overrides: SlugFieldOverrides = {}) {
  return {
    name: 'slug',
    title: overrides.title ?? 'URL Slug',
    type: 'internationalizedArraySlug',
    description:
      overrides.description ??
      'One slug per language. Use Generate to fill from the source when empty. Manual edits are kept unless you Generate again.',
    group: overrides.group,
    options: {
      source: (doc: any) => {
        const v = doc?.[sourceField]
        return typeof v === 'string' ? v : ''
      },
      slugify: (input: string) => slugifyForUrl(input, 96),
      maxLength: 96,
    },
    validation: requiredNoEnSlug(),
  }
}
