/**
 * Studio-only preview labels — English-first for editors.
 *
 * Priority: internalName → English title → English name → Norwegian title → fallback.
 * Does NOT affect website rendering (frontend GROQ / pickNo / $lang unchanged).
 */
import {pickForLang, pickNo} from './i18n'

/** English i18n value, then Norwegian, then plain string. */
export function pickStudioEn(value: unknown): string {
  const en = pickForLang(value, 'en')?.trim()
  if (en) return en
  return pickNo(value)?.trim() || (typeof value === 'string' ? value.trim() : '')
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

  const enTitle = pickStudioEn(opts.title)
  if (enTitle) return enTitle

  const plainName = opts.name?.trim()
  if (plainName) return plainName

  const noTitle = pickNo(opts.title)?.trim()
  if (noTitle) return noTitle

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
 * When linked: collection internalName → EN title → name → NO title → fallback.
 * When not linked: legacy inline title with the same English-first rule.
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
export const studioFaqItemPreview = {
  select: {title: 'question', subtitle: 'answer'},
  prepare({title, subtitle}: {title?: unknown; subtitle?: unknown}) {
    const answer = pickStudioEn(subtitle)
    return {
      title: pickStudioLabel({title, fallback: 'FAQ'}),
      subtitle: answer ? truncateStudio(answer) : undefined,
    }
  },
}

/** Studio list preview for objects with i18n `title` (+ optional `description`). */
export const studioTitleItemPreview = {
  select: {title: 'title', subtitle: 'description'},
  prepare({title, subtitle}: {title?: unknown; subtitle?: unknown}) {
    const desc = pickStudioEn(subtitle)
    return {
      title: pickStudioLabel({title, fallback: 'Untitled'}),
      subtitle: desc ? truncateStudio(desc) : undefined,
    }
  },
}
