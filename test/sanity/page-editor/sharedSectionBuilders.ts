/**
 * Shared section-card builders for singleton pages.
 * Reuses Homepage page-editor primitives — no second framework.
 *
 * Chip vocabulary (editor-facing):
 * - Configured / Collection linked / Page-owned / All Specialists / counts / Ready / Empty
 * "Not configured" is avoided when page-owned equivalents exist or when the
 * shared band is simply unused (prefer Empty).
 */
import {
  ComposeIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  HelpCircleIcon,
  ImagesIcon,
  UsersIcon,
  CheckmarkCircleIcon,
} from '@sanity/icons'
import type {PageSectionDefinition} from './types'
import {chipsFromDocument, countArray, countChip, countReferenceArray} from './documentMeta'

export function i18nPreview(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (!Array.isArray(value)) return undefined
  const no = value.find(
    (entry: {language?: string; _key?: string}) => (entry.language || entry._key) === 'no',
  )
  const en = value.find(
    (entry: {language?: string; _key?: string}) => (entry.language || entry._key) === 'en',
  )
  const text =
    (no as {value?: string} | undefined)?.value ||
    (en as {value?: string} | undefined)?.value
  return typeof text === 'string' && text.trim() ? text.trim() : undefined
}

export function countPageSectionType(
  document: Record<string, unknown> | undefined,
  typeName: string,
): number | undefined {
  if (!document) return undefined
  const sections = document.pageSections
  if (sections === undefined || sections === null) return undefined
  if (!Array.isArray(sections)) return undefined
  return sections.filter((row) => {
    if (!row || typeof row !== 'object') return false
    return (row as {_type?: string})._type === typeName
  }).length
}

export type SharedBandOptions = {
  /**
   * When the shared band is missing, return chips describing page-owned
   * equivalent functionality (e.g. `['Page-owned']`). Return undefined when
   * there is no page-owned equivalent (chip becomes Empty).
   */
  getPageOwnedChips?: (document: Record<string, unknown>) => string[] | undefined
  /** Extra notice when the page uses a page-owned equivalent instead of the shared band. */
  pageOwnedNotice?: string
}

export function heroSection(fields: string[]): PageSectionDefinition {
  return {
    id: 'hero',
    title: 'Hero',
    description: 'Page title, subtitle, media, breadcrumb, and optional hero CTA.',
    icon: ImagesIcon,
    fields,
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const title =
          i18nPreview(document.title) ||
          i18nPreview(document.heroTitle) ||
          i18nPreview(document.heroEyebrow) ||
          i18nPreview(document.subtitle) ||
          i18nPreview(document.introText) ||
          i18nPreview(document.heroSubtitle)
        return title || document.heroImage ? ['Configured'] : ['Empty']
      }),
  }
}

export function faqCollectionSection(options?: {
  titleField?: string
  collectionField?: string
}): PageSectionDefinition {
  const titleField = options?.titleField || 'faqSectionTitle'
  const collectionField = options?.collectionField || 'faqCollection'
  return {
    id: 'faq',
    title: 'FAQ',
    description: 'FAQ Collection from Content Library.',
    icon: HelpCircleIcon,
    fields: [titleField, collectionField],
    collectionRefField: collectionField,
    collectionType: 'faqCollection',
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const collection = document[collectionField] as {_ref?: string} | undefined
        const hasCollection =
          typeof collection?._ref === 'string' && collection._ref.length > 0
        if (hasCollection) return ['Collection linked']
        return ['Empty']
      }),
  }
}

export function specialistsBandSection(options?: SharedBandOptions): PageSectionDefinition {
  return {
    id: 'specialists',
    title: 'Specialists',
    description: 'Specialists carousel — title, filter, limit, and see-all link.',
    icon: UsersIcon,
    fields: ['pageSections'],
    pageSectionsItemTypes: ['pageSectionSpecialists'],
    notice:
      options?.pageOwnedNotice ||
      'Only Specialists bands. Other shared bands are edited from their own cards.',
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const sections = document.pageSections
        if (sections === undefined || sections === null) return ['Unknown']
        if (!Array.isArray(sections)) return ['Unknown']
        const band = sections.find(
          (row: {_type?: string}) => row?._type === 'pageSectionSpecialists',
        ) as
          | {
              _type?: string
              displayMode?: string
              specialists?: unknown[]
            }
          | undefined
        if (!band) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const mode = band.displayMode || 'all'
        if (mode === 'all') return ['All Specialists']
        if (mode === 'category') return ['Filtered by category']
        const count = countArray(band.specialists)
        if (!count) return ['Empty']
        return [countChip(count, 'Specialist', 'Specialists')]
      }),
  }
}

export function articlesBandSection(options?: SharedBandOptions): PageSectionDefinition {
  return {
    id: 'articles',
    title: 'Articles',
    description: 'Articles band from Shared Sections.',
    icon: DocumentTextIcon,
    fields: ['pageSections'],
    pageSectionsItemTypes: ['pageSectionArticles'],
    notice:
      options?.pageOwnedNotice ||
      'Only Articles bands. Other shared bands are edited from their own cards.',
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const sections = document.pageSections
        if (sections === undefined || sections === null) return ['Unknown']
        if (!Array.isArray(sections)) return ['Unknown']
        const band = sections.find(
          (row: {_type?: string}) => row?._type === 'pageSectionArticles',
        ) as
          | {
              _type?: string
              displayMode?: string
              articles?: unknown[]
              limit?: number
            }
          | undefined
        if (!band) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const mode = band.displayMode || 'latest'
        if (mode === 'manual') {
          const count = countReferenceArray(band.articles)
          if (!count) return ['Empty']
          return [countChip(count, 'Article', 'Articles')]
        }
        if (mode === 'category') return ['Filtered by category']
        const limit = typeof band.limit === 'number' ? band.limit : 6
        return [`Latest ${limit}`, 'Configured']
      }),
  }
}

export function bookingCtaBandSection(options?: SharedBandOptions): PageSectionDefinition {
  return {
    id: 'bookingCta',
    title: 'Booking CTA',
    description: 'Booking call-to-action from a CTA Collection.',
    icon: ComposeIcon,
    fields: ['pageSections'],
    pageSectionsItemTypes: ['pageSectionBookingCta'],
    notice: options?.pageOwnedNotice,
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const sections = document.pageSections
        if (!Array.isArray(sections)) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const band = sections.find(
          (row: {
            _type?: string
            ctaCollection?: {_ref?: string}
            title?: unknown
            primaryLabel?: unknown
          }) => row?._type === 'pageSectionBookingCta',
        ) as
          | {
              _type?: string
              ctaCollection?: {_ref?: string}
              title?: unknown
              primaryLabel?: unknown
            }
          | undefined
        if (!band) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const ref = band.ctaCollection?._ref
        if (typeof ref === 'string' && ref.length > 0) return ['Collection linked']
        if (i18nPreview(band.title) || i18nPreview(band.primaryLabel)) return ['Configured']
        return ['Configured']
      }),
  }
}

export function insuranceBandSection(options?: SharedBandOptions): PageSectionDefinition {
  return {
    id: 'insurance',
    title: 'Insurance',
    description: 'Insurance partners from an Insurance Collection.',
    icon: CheckmarkCircleIcon,
    fields: ['pageSections'],
    pageSectionsItemTypes: ['pageSectionInsurance'],
    notice:
      options?.pageOwnedNotice ||
      'Only Insurance bands. Other shared bands are edited from their own cards.',
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const sections = document.pageSections
        if (!Array.isArray(sections)) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const band = sections.find(
          (row: {_type?: string; insuranceCollection?: {_ref?: string}}) =>
            row?._type === 'pageSectionInsurance',
        ) as {_type?: string; insuranceCollection?: {_ref?: string}} | undefined
        if (!band) {
          const owned = options?.getPageOwnedChips?.(document)
          return owned?.length ? owned : ['Empty']
        }
        const ref = band.insuranceCollection?._ref
        if (typeof ref === 'string' && ref.length > 0) return ['Collection linked']
        return ['Configured']
      }),
  }
}

export function seoSection(fields: string[] = ['seo', 'geoSummary']): PageSectionDefinition {
  return {
    id: 'seo',
    title: 'SEO',
    description: 'Search and AI summary settings.',
    icon: EarthGlobeIcon,
    fields,
    getChips: (doc) =>
      chipsFromDocument(doc, Boolean(doc), (document) => {
        const seo = document.seo as {metaTitle?: unknown} | undefined
        return i18nPreview(seo?.metaTitle) ? ['Ready'] : ['Empty']
      }),
  }
}

export function arrayCountChips(
  fieldName: string,
  singular: string,
  plural: string,
): PageSectionDefinition['getChips'] {
  return (doc) =>
    chipsFromDocument(doc, Boolean(doc), (document) => {
      const count = countArray(document[fieldName])
      if (count === undefined) return ['Unknown']
      if (count === 0) return ['Empty']
      return [countChip(count, singular, plural)]
    })
}

export function referenceArrayCountChips(
  fieldName: string,
  singular: string,
  plural: string,
): PageSectionDefinition['getChips'] {
  return (doc) =>
    chipsFromDocument(doc, Boolean(doc), (document) => {
      const count = countReferenceArray(document[fieldName])
      if (count === undefined) return ['Unknown']
      if (count === 0) return ['Empty']
      return [countChip(count, singular, plural)]
    })
}
