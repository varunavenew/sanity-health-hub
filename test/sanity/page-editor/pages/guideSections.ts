/**
 * Guide — page editor config (Homepage framework).
 * WYSIWYG: Hero → Categories Intro → Guide Sections → Booking CTA → SEO.
 */
import {DocumentTextIcon, StackIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray} from '../documentMeta'
import {
  bookingCtaBandSection,
  heroSection,
  i18nPreview,
  seoSection,
} from '../sharedSectionBuilders'

const GUIDE_HERO_FIELDS = [
  'breadcrumbHome',
  'heroTitle',
  'slug',
  'heroSubtitle',
  'heroMedia',
  'primaryCtaLabel',
  'primaryCtaPath',
]

function guideSectionChips(count: number | undefined): string[] {
  if (count === undefined) return []
  if (count === 0) return ['No Sections']
  if (count === 1) return ['1 Section']
  return [`${count} Sections`]
}

export const guidePageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Guide',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      ...heroSection(GUIDE_HERO_FIELDS),
      description:
        'Optional page hero — title, subtitle, image/video, breadcrumb, and CTA. Same media model as Privacy Policy.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title = i18nPreview(document.heroTitle)
          const subtitle = i18nPreview(document.heroSubtitle)
          const heroMedia = document.heroMedia as
            | {image?: unknown; videoFile?: unknown; videoUrl?: string}
            | undefined
          const hasMedia = Boolean(
            heroMedia?.image ||
              heroMedia?.videoFile ||
              (typeof heroMedia?.videoUrl === 'string' && heroMedia.videoUrl.trim()),
          )
          if (title || subtitle || hasMedia) return ['Configured']
          return ['Empty']
        }),
    },
    {
      id: 'categoriesIntro',
      title: 'Categories Intro',
      description:
        'Page-owned title and description above Guide Sections.',
      icon: DocumentTextIcon,
      fields: ['categoriesIntroTitle', 'categoriesIntroDescription'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title = i18nPreview(document.categoriesIntroTitle)
          const description = i18nPreview(document.categoriesIntroDescription)
          return title || description ? ['Configured'] : ['Empty']
        }),
    },
    {
      id: 'guideSections',
      title: 'Guide Sections',
      description:
        'Repeatable, reorderable marketing sections rendered below Categories Intro.',
      icon: StackIcon,
      fields: ['guideSections'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.guideSections)
          return guideSectionChips(count)
        }),
      getPreview: (document) => {
        const count = countArray(document?.guideSections)
        if (count === undefined) return undefined
        if (count === 0) return 'No Sections'
        if (count === 1) return '1 Section'
        return `${count} Sections`
      },
    },
    {
      ...bookingCtaBandSection(),
      title: 'Booking CTA',
      description: 'Shared Booking CTA band sourced from CTA Collection.',
    },
    seoSection(),
  ],
})
