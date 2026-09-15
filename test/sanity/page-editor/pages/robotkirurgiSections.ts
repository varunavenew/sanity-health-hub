/**
 * Robot-assisted surgery — page editor config (Homepage framework).
 * WYSIWYG: Hero → Intro → Content → Quote → About CTA → FAQ → SEO.
 */
import {BlockquoteIcon, DocumentTextIcon, LaunchIcon, StackIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray} from '../documentMeta'
import {
  faqCollectionSection,
  heroSection,
  i18nPreview,
  seoSection,
} from '../sharedSectionBuilders'

const ROBOTKIRURGI_HERO_FIELDS = [
  'title',
  'slug',
  'subtitle',
  'heroMedia',
  'heroImageAlt',
  'primaryCtaLabel',
  'primaryCtaPath',
]

function sectionChips(count: number | undefined): string[] {
  if (count === undefined) return []
  if (count === 0) return ['Empty']
  if (count === 1) return ['1 Section']
  return [`${count} Sections`]
}

export const robotkirurgiPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Robot-assisted surgery',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      ...heroSection(ROBOTKIRURGI_HERO_FIELDS),
      description:
        'Centered page title, subtitle, yellow booking button, and the image below.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title = i18nPreview(document.title)
          const subtitle = i18nPreview(document.subtitle)
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
      id: 'intro',
      title: 'Intro',
      description: 'Opening paragraphs under the hero image.',
      icon: DocumentTextIcon,
      fields: ['introTexts'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.introTexts)
          if (count === undefined || count === 0) return ['Empty']
          return [count === 1 ? '1 Paragraph' : `${count} Paragraphs`]
        }),
    },
    {
      id: 'content',
      title: 'Content sections',
      description:
        'Bullet list, Rapid rehabilitation, Precision, and any extra article blocks.',
      icon: StackIcon,
      fields: ['sections'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) =>
          sectionChips(countArray(document.sections)),
        ),
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Attributed quote in the taupe box.',
      icon: BlockquoteIcon,
      fields: ['quoteText', 'quoteAttribution'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const quote = i18nPreview(document.quoteText)
          const attribution = i18nPreview(document.quoteAttribution)
          return quote || attribution ? ['Configured'] : ['Empty']
        }),
    },
    {
      id: 'aboutCta',
      title: 'About CTA',
      description: 'Yellow button under the quote (e.g. Book an appointment).',
      icon: LaunchIcon,
      fields: ['secondaryCtaLabel', 'secondaryCtaPath'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const label = i18nPreview(document.secondaryCtaLabel)
          const path =
            typeof document.secondaryCtaPath === 'string'
              ? document.secondaryCtaPath.trim()
              : ''
          return label || path ? ['Configured'] : ['Empty']
        }),
    },
    faqCollectionSection(),
    seoSection(),
  ],
})
