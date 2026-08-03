/**
 * Treatment Category landing - shared page editor config.
 *
 * Studio UX only: section cards map onto existing treatmentCategory fields.
 * Document JSON, queries, and frontend are unchanged.
 *
 * Same architecture as the Fertility prototype - one config factory for all categories.
 */
import {
  BoltIcon,
  ComposeIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  HeartIcon,
  HelpCircleIcon,
  ImagesIcon,
  StarIcon,
  UsersIcon,
  UlistIcon,
  BlockElementIcon,
  CommentIcon,
  TrendUpwardIcon,
  UserIcon,
  ClockIcon,
} from '@sanity/icons'
import type {PageEditorConfig, PageSectionDefinition} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  bookingCtaBandSection,
  i18nPreview,
  insuranceBandSection,
  specialistsBandSection,
} from '../sharedSectionBuilders'

function landingPreview(
  document: Record<string, unknown> | undefined,
  sectionKey: string,
  titleField = 'title',
): string[] {
  return chipsFromDocument(document, Boolean(document), (doc) => {
    const landing = doc.landingPage as Record<string, unknown> | undefined
    const band = landing?.[sectionKey] as Record<string, unknown> | undefined
    if (!band) return []
    const title = i18nPreview(band[titleField]) || i18nPreview(band.heading)
    return title ? ['Configured'] : []
  })
}

function landingArrayChips(
  sectionKey: string,
  arrayField: string,
  singular: string,
  plural: string,
): (doc: Record<string, unknown> | undefined) => string[] | undefined {
  return (doc) =>
    chipsFromDocument(doc, Boolean(doc), (document) => {
      const landing = document.landingPage as Record<string, unknown> | undefined
      const band = landing?.[sectionKey] as Record<string, unknown> | undefined
      const count = countArray(band?.[arrayField])
      // No items yet — omit subtitle (never "Unknown"). Card stays visible.
      if (count === undefined || count === 0) return []
      return [countChip(count, singular, plural)]
    })
}

/** Shared section list - identical field mappings for every treatment category. */
function treatmentCategorySections(): PageSectionDefinition[] {
  return [
    {
      id: 'hero',
      title: 'Hero',
      description: 'Hero media, headline, ingress, and buttons.',
      icon: ImagesIcon,
      fields: ['heroMedia', 'heroMediaType', 'heroImage', 'heroVideo', 'landingPage'],
      landingPageFields: ['hero'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const landing = document.landingPage as {hero?: {heading?: unknown}} | undefined
          const heading = i18nPreview(landing?.hero?.heading)
          const hasMedia = Boolean(document.heroMedia || document.heroImage || document.heroVideo)
          if (heading || hasMedia) return ['Configured']
          return ['Empty']
        }),
    },
    {
      id: 'segments',
      title: 'Tell us where you are',
      description: 'Life-stage / segment cards under the hero.',
      icon: UserIcon,
      fields: ['landingPage'],
      landingPageFields: ['segmentsSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('segmentsSection', 'segments', 'Card', 'Cards'),
    },
    {
      id: 'why',
      title: 'Why choose us',
      description: 'Why section - heading, steps, and side image.',
      icon: HeartIcon,
      fields: ['landingPage'],
      landingPageFields: ['whySection'],
      hideWhenEmpty: true,
      getChips: (doc) => landingPreview(doc, 'whySection'),
    },
    {
      id: 'audiences',
      title: 'Audience',
      description: 'Optional audience cards. Leave empty to hide on the website.',
      icon: UsersIcon,
      fields: ['landingPage'],
      landingPageFields: ['audiencesSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('audiencesSection', 'audiences', 'Card', 'Cards'),
    },
    {
      id: 'expertAreas',
      title: 'Expert Areas',
      description: 'Specialty cards with images.',
      icon: BlockElementIcon,
      fields: ['landingPage'],
      landingPageFields: ['expertAreasSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('expertAreasSection', 'areas', 'Card', 'Cards'),
    },
    {
      id: 'symptoms',
      title: 'What do you feel?',
      description: 'Symptom → service cards and background colour.',
      icon: BoltIcon,
      fields: ['landingPage'],
      landingPageFields: ['symptomsSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('symptomsSection', 'items', 'Card', 'Cards'),
    },
    {
      id: 'services',
      title: 'What we offer',
      description: 'Service groups and links on this landing page.',
      icon: UlistIcon,
      fields: ['landingPage'],
      landingPageFields: ['servicesSection'],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const landing = document.landingPage as {
            servicesSection?: {groups?: {items?: unknown[]}[]}
          } | undefined
          const groups = landing?.servicesSection?.groups
          if (!Array.isArray(groups)) return []
          const items = groups.reduce(
            (n, g) => n + (Array.isArray(g?.items) ? g.items.length : 0),
            0,
          )
          if (items === 0) return []
          return [countChip(items, 'Service', 'Services')]
        }),
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Optional support cards. Leave empty to hide on the website.',
      icon: HeartIcon,
      fields: ['landingPage'],
      landingPageFields: ['supportSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('supportSection', 'areas', 'Card', 'Cards'),
    },
    {
      id: 'results',
      title: 'Numbers that tell a story',
      description: 'Statistics headings and KPI numbers.',
      icon: TrendUpwardIcon,
      fields: ['stats', 'landingPage'],
      landingPageFields: ['resultsSection'],
      hideWhenEmpty: true,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.stats)
          if (!count) return []
          return [countChip(count, 'Stat', 'Stats')]
        }),
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Patient quotes on this page.',
      icon: CommentIcon,
      fields: ['landingPage'],
      landingPageFields: ['reviewsSection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('reviewsSection', 'reviews', 'Quote', 'Quotes'),
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'FAQ heading, description, and FAQ Collection from Content Library.',
      icon: HelpCircleIcon,
      fields: ['faqSectionTitle', 'faqCollection'],
      collectionRefField: 'faqCollection',
      collectionType: 'faqCollection',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const collection = document.faqCollection as {_ref?: string} | undefined
          if (typeof collection?._ref === 'string' && collection._ref.length > 0) {
            return ['Collection linked']
          }
          return ['Empty']
        }),
    },
    {
      id: 'spotlight',
      title: 'Spotlight',
      description: 'Mid-page highlight - copy, CTA, and image.',
      icon: StarIcon,
      fields: ['landingPage'],
      landingPageFields: ['spotlightSection'],
      hideWhenEmpty: true,
      getChips: (doc) => landingPreview(doc, 'spotlightSection'),
    },
    {
      id: 'journey',
      title: 'Journey',
      description: 'Patient journey steps. Leave empty to hide on the website.',
      icon: ClockIcon,
      fields: ['landingPage'],
      landingPageFields: ['journeySection'],
      hideWhenEmpty: true,
      getChips: landingArrayChips('journeySection', 'steps', 'Step', 'Steps'),
    },
    {
      ...specialistsBandSection({
        pageOwnedNotice:
          'Only the Specialists band for this category. Insurance and Booking CTA have their own cards.',
      }),
      hideWhenEmpty: true,
    },
    {
      ...insuranceBandSection(),
      hideWhenEmpty: true,
    },
    {
      ...bookingCtaBandSection(),
      hideWhenEmpty: true,
    },
    {
      id: 'general',
      title: 'General',
      description: 'Category name, URL slugs, and linked treatments.',
      icon: DocumentTextIcon,
      fields: ['title', 'slug', 'treatments'],
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
      description: 'Routing keys and list order. Ask engineering before changing.',
      icon: ComposeIcon,
      fields: ['sortOrder', 'categoryId', 'categoryNumericId'],
      getChips: () => ['Technical'],
    },
  ]
}

export type TreatmentCategoryEditorOptions = {
  /** Desk / section-list title (e.g. Fertility, Pregnancy). */
  title: string
}

/** Shared page-editor config - same sections & field paths for every category. */
export function createTreatmentCategoryPageEditorConfig(
  options: TreatmentCategoryEditorOptions,
): PageEditorConfig {
  return definePageEditorConfig({
    title: options.title,
    subtitle: 'Edit the page section by section - same order as the website.',
    defaultSectionId: 'hero',
    sections: treatmentCategorySections(),
  })
}

/** Fixed document IDs for Treatment Category section editors (existing published docs). */
export const TREATMENT_CATEGORY_EDITORS = [
  {documentId: 'category-fertilitet', title: 'Fertility', categoryId: 'fertilitet'},
  {documentId: 'category-graviditet', title: 'Pregnancy', categoryId: 'graviditet'},
  {documentId: 'category-gynekologi', title: 'Gynecology', categoryId: 'gynekologi'},
  {documentId: 'category-urologi', title: 'Urology', categoryId: 'urologi'},
  {documentId: 'category-ortopedi', title: 'Orthopedics', categoryId: 'ortopedi'},
  {
    documentId: 'category-flere-fagomrader',
    title: 'Other Specialties',
    categoryId: 'flere-fagomrader',
  },
] as const

export const fertilitetPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Fertility',
})
export const graviditetPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Pregnancy',
})
export const gynekologiPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Gynecology',
})
export const urologiPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Urology',
})
export const ortopediPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Orthopedics',
})
export const flereFagomraderPageEditorConfig = createTreatmentCategoryPageEditorConfig({
  title: 'Other Specialties',
})

/** Shared config used by TreatmentCategoryDocumentInput (section ids identical across categories). */
export const treatmentCategoryPageEditorConfig = fertilitetPageEditorConfig
