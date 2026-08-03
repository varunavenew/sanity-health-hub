/**
 * Studio-only preview labels.
 *
 * Localized strings follow the active Studio UI language
 * (EN → NO → first, or NO → EN → first). See resolveLocalizedPreview.
 * Does NOT affect website rendering (frontend GROQ / pickNo / $lang unchanged).
 */
import {
  localizedPreview,
  resolveLocalizedPreview,
  resolveLocalizedString,
} from './i18n'

/** Resolve internationalized (or plain) values for Studio list rows. */
export function pickStudioEn(value: unknown): string {
  // Name kept for call-site stability; resolution follows Studio UI language.
  return resolveLocalizedPreview(value)
}

/**
 * Primary Studio list / reference label.
 * internalName always wins when set (Content Library packs).
 */
export function pickStudioLabel(opts: {
  internalName?: string | null
  title?: unknown
  name?: string | null
  fallback?: string
}): string {
  const internal = opts.internalName?.trim()
  if (internal) return internal

  const localized = resolveLocalizedPreview(opts.title)
  if (localized) return localized

  const plainName = opts.name?.trim()
  if (plainName) return plainName

  return opts.fallback?.trim() || 'Untitled'
}

/** Content Library document preview (ctaCollection, insuranceCollection, …). */
export function studioCollectionDocumentPreview(opts: {
  internalName?: string | null
  title?: unknown
  typeLabel: string
  detail?: string
}) {
  const typeLabel = opts.typeLabel.trim()
  const detail = opts.detail?.trim()

  if (opts.internalName?.trim()) {
    return {
      title: opts.internalName.trim(),
      subtitle: detail ? `${typeLabel} · ${detail}` : typeLabel,
    }
  }

  const heading = pickStudioLabel({title: opts.title, fallback: typeLabel})
  return {
    title: heading,
    subtitle: detail || typeLabel,
  }
}

type CollectionPreviewSource = {
  internalName?: string | null
  title?: unknown
  name?: string | null
}

/**
 * Collapsed Shared Section band when it may reference a Content Library pack.
 * When linked: collection internalName → localized title → name → fallback.
 * When not linked: legacy inline title with the same rule.
 */
export function pageSectionCollectionBandPreviewFromCollection(opts: {
  collection?: CollectionPreviewSource | null
  legacyTitle?: unknown
  bandTypeLabel: string
  legacyFallback: string
}) {
  if (opts.collection) {
    return {
      title: pickStudioLabel({
        internalName: opts.collection.internalName,
        title: opts.collection.title,
        name: opts.collection.name,
        fallback: opts.legacyFallback,
      }),
      subtitle: opts.bandTypeLabel,
    }
  }

  return {
    title: pickStudioLabel({
      title: opts.legacyTitle,
      fallback: opts.legacyFallback,
    }),
    subtitle: opts.bandTypeLabel,
  }
}

/** @deprecated Use pageSectionCollectionBandPreviewFromCollection — kept for sync prepare paths. */
export function pageSectionCollectionBandPreview(opts: {
  collectionInternalName?: string | null
  collectionTitle?: unknown
  legacyTitle?: unknown
  bandTypeLabel: string
  legacyFallback: string
  detailSubtitle?: string
}) {
  const hasCollection = Boolean(
    opts.collectionInternalName?.trim() || opts.collectionTitle,
  )

  if (hasCollection) {
    return pageSectionCollectionBandPreviewFromCollection({
      collection: {
        internalName: opts.collectionInternalName,
        title: opts.collectionTitle,
      },
      legacyTitle: opts.legacyTitle,
      bandTypeLabel: opts.bandTypeLabel,
      legacyFallback: opts.legacyFallback,
    })
  }

  return pageSectionCollectionBandPreviewFromCollection({
    collection: null,
    legacyTitle: opts.legacyTitle,
    bandTypeLabel: opts.bandTypeLabel,
    legacyFallback: opts.legacyFallback,
  })
}

/** Truncate long subtitle text in Studio list previews. */
export function truncateStudio(text: string, max = 80): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

/** Studio list preview for FAQ rows (`question` + optional `answer`). */
export const studioFaqItemPreview = localizedPreview({
  titleField: 'question',
  subtitleField: 'answer',
  fallback: 'FAQ',
})

/** Studio list preview for objects with i18n `title` (+ optional `description`). */
export const studioTitleItemPreview = localizedPreview()

export {
  localizedPreview,
  resolveLocalizedPreview,
  resolveLocalizedString,
}
