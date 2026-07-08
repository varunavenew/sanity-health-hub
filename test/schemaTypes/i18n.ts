/**
 * Shared helpers for sanity-plugin-internationalized-array fields.
 */

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
  return pickSpecialtyLabelForLang(entry, 'no')
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

function truncate(text: string, max = 80): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

/** Studio list preview for FAQ rows (`question` + optional `answer`). */
export const i18nFaqItemPreview = {
  select: { title: 'question', subtitle: 'answer' },
  prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
    const answer = pickNo(subtitle)
    return {
      title: pickNo(title) || 'FAQ',
      subtitle: answer ? truncate(answer) : undefined,
    }
  },
}

/** Studio list preview for objects with i18n `title` (+ optional `description`). */
export const i18nTitleItemPreview = {
  select: { title: 'title', subtitle: 'description' },
  prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
    const desc = pickNo(subtitle)
    return {
      title: pickNo(title) || 'Untitled',
      subtitle: desc ? truncate(desc) : undefined,
    }
  },
}

type SlugFieldOverrides = {
  title?: string
  group?: string
  description?: string
}

/**
 * Localized URL slug (NO + EN) sourced from an internationalizedArrayString title field.
 */
export function i18nSlugFieldFromTitle(titleField = 'title', overrides: SlugFieldOverrides = {}) {
  return {
    name: 'slug',
    title: overrides.title ?? 'URL Slug',
    type: 'internationalizedArraySlug',
    description:
      overrides.description ??
      'Én slug per språk. Genereres fra tittel; kan redigeres for engelske URL-er.',
    group: overrides.group,
    options: {
      source: (doc: any, context: any) => {
        const lang = context?.parent?.language || context?.parent?._key || 'no'
        const titles = doc?.[titleField]
        if (typeof titles === 'string') return titles
        if (!Array.isArray(titles)) return ''
        return pickForLang(titles, lang) || pickNo(titles)
      },
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
      'Én slug per språk. Genereres fra kildefeltet; kan redigeres manuelt.',
    group: overrides.group,
    options: {
      source: (doc: any) => {
        const v = doc?.[sourceField]
        return typeof v === 'string' ? v : ''
      },
      maxLength: 96,
    },
    validation: requiredNoEnSlug(),
  }
}
