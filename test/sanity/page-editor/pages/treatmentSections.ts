/**
 * Treatment page editor — Studio UX only.
 *
 * Section cards map onto existing `treatment` field paths.
 * Card order matches SubTreatmentLayout render order (website body).
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

/**
 * Website body order (SubTreatmentLayout):
 * Hero → Related (when asIntro) → Symptoms → Process → Expert areas → Benefits →
 * Text → FAQ → Articles → Mid CTA → Specialists → Insurance → Related → Booking CTA
 *
 * Related is one card (placement controlled by “Show right after hero”).
 */
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
      id: 'related',
      title: 'Related',
      description:
        'Related treatments. On the website: after Hero when “Show right after hero” is on; otherwise after Insurance.',
      icon: UlistIcon,
      fields: ['relatedSection'],
      getChips: nestedArrayChips('relatedSection', 'items', 'Item', 'Items'),
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
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          // Align with FE isMeaningfulReasonItem: item needs a non-empty description.
          const reasons = Array.isArray(document.reasons) ? document.reasons : []
          const count = reasons.filter((row: {desc?: unknown}) => {
            if (typeof row?.desc === 'string') return row.desc.trim().length > 0
            return Boolean(row?.desc)
          }).length
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
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.flow)
          if (!count) return []
          return [countChip(count, 'Step', 'Steps')]
        }),
    },
    {
      id: 'expertAreas',
      title: 'Expert areas',
      description: 'Linked service cards. Leave empty to hide on the website.',
      icon: UsersIcon,
      fields: ['expertAreas'],
      getChips: nestedArrayChips('expertAreas', 'items', 'Card', 'Cards'),
    },
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'Promises / advantages. Leave empty to hide on the website.',
      icon: BlockElementIcon,
      fields: ['promises'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.promises)
          if (!count) return []
          return [countChip(count, 'Benefit', 'Benefits')]
        }),
    },
    {
      id: 'textSection',
      title: 'Text section',
      description: 'Optional text + points band. Leave empty to hide on the website.',
      icon: DocumentTextIcon,
      fields: ['textSection'],
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
      ...faqCollectionSection({
        titleField: 'faqSectionTitle',
        collectionField: 'faqCollection',
      }),
      fields: ['faqSectionTitle', 'faqCollection'],
      description:
        'FAQ Collection from Content Library. Leave empty to hide on the website.',
    },
    {
      ...articlesBandSection({
        pageOwnedNotice:
          'Only the Articles band for this treatment. Other shared bands have their own cards.',
      }),
    },
    {
      id: 'midCta',
      title: 'Mid-page CTA',
      description:
        'Optional mid-page conversion band. Leave titles empty to hide on the website.',
      icon: ComposeIcon,
      fields: ['conversationCtaTitle', 'ctaTitle', 'ctaDescription'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const has =
            Boolean(i18nPreview(document.conversationCtaTitle)) ||
            Boolean(i18nPreview(document.ctaTitle))
          return has ? ['Configured'] : []
        }),
    },
    {
      ...specialistsBandSection({
        pageOwnedNotice:
          'Only the Specialists band for this treatment. Insurance and Booking CTA have their own cards.',
      }),
    },
    {
      ...insuranceBandSection({
        pageOwnedNotice:
          'Only the Insurance band for this treatment. Other shared bands have their own cards.',
      }),
    },
    {
      ...bookingCtaBandSection({
        pageOwnedNotice:
          'Add a Booking CTA band (prefer CTA Collection). If no usable band exists, the website still shows a default Booking CTA until remaining pages are seeded.',
        emptyBandChip: 'Website fallback',
      }),
    },
    {
      id: 'general',
      title: 'General',
      description: 'Treatment name, URL slugs, and Treatment Categories.',
      icon: DocumentTextIcon,
      fields: ['title', 'slug', 'categories', 'pageRole'],
      notice:
        'Assign one or more Treatment Categories. The first entry is primary for breadcrumbs, booking, and URLs.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const cats = document.categories as {_ref?: string}[] | undefined
          const catCount =
            Array.isArray(cats) ? cats.filter((row) => Boolean(row?._ref)).length : 0
          if (catCount > 0) {
            return [countChip(catCount, 'Category', 'Categories')]
          }
          return ['No category']
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
        'sortOrder',
        'parentCategoryLabel',
        'subItems',
        'expertReadMoreLabel',
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
        'specialistTitle',
        'specialistDescription',
        'specialistCtaLabel',
        'specialistCtaHref',
      ],
      getChips: () => ['Technical'],
    },
  ]
}

/** Shared page-editor config for every treatment document. */
export const treatmentPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Treatment',
  subtitle: 'Sections follow the same order as the website.',
  defaultSectionId: 'hero',
  sections: treatmentSections(),
})
