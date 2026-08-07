/**
 * Treatment page editor — Studio UX only.
 *
 * Section cards map onto existing `treatment` field paths.
 * Document JSON, GROQ, and frontend mapping are unchanged.
 */
import {
  BoltIcon,
  BlockElementIcon,
  ComposeIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  HelpCircleIcon,
  ImagesIcon,
  UlistIcon,
  UsersIcon,
} from '@sanity/icons'
import type {PageEditorConfig, PageSectionDefinition} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  articlesBandSection,
  bookingCtaBandSection,
  faqCollectionSection,
  i18nPreview,
  insuranceBandSection,
  specialistsBandSection,
} from '../sharedSectionBuilders'

function nestedArrayChips(
  objectField: string,
  arrayField: string,
  singular: string,
  plural: string,
): PageSectionDefinition['getChips'] {
  return (doc) =>
    chipsFromDocument(doc, Boolean(doc), (document) => {
      const nested = document[objectField] as Record<string, unknown> | undefined
      const count = countArray(nested?.[arrayField])
      if (count === undefined || count === 0) return []
      return [countChip(count, singular, plural)]
    })
}

function treatmentSections(): PageSectionDefinition[] {
  return [
    {
      id: 'hero',
      title: 'Hero',
      description: 'Hero media, titles, intro, points, and primary buttons.',
      icon: ImagesIcon,
      fields: [
        'heroMedia',
        'heroImage',
        'heroVideo',
        'heroImageAlt',
        'heroTitle',
        'description',
        'heroDescription',
        'rating',
        'heroPrice',
        'hideSeePriser',
        'heroAvailability',
        'heroThemes',
        'heroPoints',
        'primaryCtaLabel',
        'seePricesLabel',
        'seePricesHref',
        'callCtaLabel',
      ],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title =
            i18nPreview(document.heroTitle) || i18nPreview(document.description)
          const hasMedia = Boolean(
            document.heroMedia || document.heroImage || document.heroVideo,
          )
          if (title || hasMedia) return ['Configured']
          return ['Empty']
        }),
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      description: 'Reasons / symptoms band. Leave empty to hide on the website.',
      icon: BoltIcon,
      fields: [
        'reasonsTitle',
        'reasonsLead',
        'reasonsLead2',
        'reasonsLayout',
        'reasons',
      ],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.reasons)
          if (!count) return []
          return [countChip(count, 'Item', 'Items')]
        }),
    },
    {
      id: 'process',
      title: 'Treatment process',
      description: 'How it works — steps and optional image. Empty = hidden.',
      icon: UlistIcon,
      fields: [
        'flowTitle',
        'flowImage',
        'flowImageAlt',
        'flowLinkLabel',
        'flowLinkHref',
        'flow',
      ],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.flow)
          if (!count) return []
          return [countChip(count, 'Step', 'Steps')]
        }),
    },
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'Promises / advantages. Leave empty to hide on the website.',
      icon: BlockElementIcon,
      fields: ['promises'],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.promises)
          if (!count) return []
          return [countChip(count, 'Benefit', 'Benefits')]
        }),
    },
    {
      id: 'expertAreas',
      title: 'Expert areas',
      description: 'Linked service cards. Leave empty to hide on the website.',
      icon: UsersIcon,
      fields: ['expertAreas'],
      hideWhenEmpty: true,
      getChips: nestedArrayChips('expertAreas', 'items', 'Card', 'Cards'),
    },
    {
      id: 'textSection',
      title: 'Text section',
      description: 'Optional text + points band. Leave empty to hide on the website.',
      icon: DocumentTextIcon,
      fields: ['textSection'],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const band = document.textSection as Record<string, unknown> | undefined
          if (!band) return []
          const has =
            Boolean(i18nPreview(band.title)) ||
            Boolean(i18nPreview(band.lead)) ||
            (countArray(band.points) ?? 0) > 0 ||
            Boolean(band.image)
          return has ? ['Configured'] : []
        }),
    },
    {
      id: 'related',
      title: 'Related',
      description: 'Related treatments carousel. Leave empty to hide on the website.',
      icon: UlistIcon,
      fields: ['relatedSection'],
      hideWhenEmpty: true,
      getChips: nestedArrayChips('relatedSection', 'items', 'Item', 'Items'),
    },
    {
      ...faqCollectionSection({
        titleField: 'faqSectionTitle',
        collectionField: 'faqCollection',
      }),
      fields: [
        'faqSectionTitle',
        'faqCollection',
      ],
      hideWhenEmpty: true,
      description:
        'FAQ Collection from Content Library. Leave empty to hide on the website.',
    },
    {
      ...articlesBandSection({
        pageOwnedNotice:
          'Only the Articles band for this treatment. Other shared bands have their own cards.',
      }),
      hideWhenEmpty: true,
    },
    {
      ...specialistsBandSection({
        pageOwnedNotice:
          'Only the Specialists band for this treatment. Insurance and Booking CTA have their own cards.',
      }),
      hideWhenEmpty: true,
    },
    {
      ...insuranceBandSection({
        pageOwnedNotice:
          'Only the Insurance band for this treatment. Other shared bands have their own cards.',
      }),
      hideWhenEmpty: true,
    },
    {
      ...bookingCtaBandSection({
        pageOwnedNotice:
          'Add a Booking CTA band (prefer CTA Collection). If no usable band exists, the website still shows a default Booking CTA until remaining pages are seeded.',
      }),
      hideWhenEmpty: true,
    },
    {
      id: 'midCta',
      title: 'Mid-page CTA',
      description:
        'Optional mid-page conversion band. Leave titles empty to hide on the website.',
      icon: ComposeIcon,
      fields: ['conversationCtaTitle', 'ctaTitle', 'ctaDescription'],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const has =
            Boolean(i18nPreview(document.conversationCtaTitle)) ||
            Boolean(i18nPreview(document.ctaTitle))
          return has ? ['Configured'] : []
        }),
    },
    {
      id: 'general',
      title: 'General',
      description: 'Treatment name, URL slugs, and categories.',
      icon: DocumentTextIcon,
      fields: ['title', 'slug', 'categories', 'pageRole'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.title) ? ['Configured'] : ['Empty']
        }),
    },
    {
      id: 'seo',
      title: 'SEO',
      description: 'Search meta and AI summary.',
      icon: EarthGlobeIcon,
      fields: ['seo', 'geoSummary'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const seo = document.seo as {metaTitle?: unknown} | undefined
          return i18nPreview(seo?.metaTitle) ? ['Ready'] : ['Empty']
        }),
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Legacy and technical fields. Ask engineering before changing.',
      icon: ComposeIcon,
      fields: [
        'category',
        'homeBreadcrumbLabel',
        'srOnlyTitle',
        'themesAriaLabel',
        'scrollLeftLabel',
        'scrollRightLabel',
        'bookingService',
        'subtitle',
        'eyebrow',
        'reasonsEyebrow',
        'flowEyebrow',
        'benefitsTitle',
        'processSectionTitle',
        'linkedServicesSectionTitle',
        'process',
        'sections',
        'linkedServices',
        'quickInfoItems',
        'bottomCta',
        'relatedSpecialists',
        'specialistTitle',
        'specialistDescription',
        'specialistCtaLabel',
        'specialistCtaHref',
        'insuranceEyebrow',
        'insuranceTitle',
        'insurancePartners',
        'faqs',
        'layout',
      ],
      getChips: () => ['Technical'],
    },
  ]
}

/** Shared page-editor config for every treatment document. */
export const treatmentPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Treatment',
  subtitle: 'Edit the page section by section — same fields as before.',
  defaultSectionId: 'hero',
  sections: treatmentSections(),
})

export function createTreatmentPageEditorConfig(options?: {
  title?: string
}): PageEditorConfig {
  return definePageEditorConfig({
    title: options?.title || 'Treatment',
    subtitle: 'Edit the page section by section — same fields as before.',
    defaultSectionId: 'hero',
    sections: treatmentSections(),
  })
}
