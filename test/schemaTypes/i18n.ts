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
      title: pickNo(title) || 'Uten tittel',
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
    title: overrides.title ?? 'URL-slug',
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
    validation: (Rule: any) => Rule.required(),
  }
}

/**
 * Localized URL slug sourced from a plain string field (e.g. specialist name).
 */
export function i18nSlugFieldFromString(sourceField: string, overrides: SlugFieldOverrides = {}) {
  return {
    name: 'slug',
    title: overrides.title ?? 'URL-slug',
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
    validation: (Rule: any) => Rule.required(),
  }
}
