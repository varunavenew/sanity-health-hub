/**
 * Home page — first consumer of the Page Editor Framework.
 * Maps live homepage bands onto existing `homepage` field names.
 * Card metadata is derived only from the real homepage document.
 */
import {
  ImagesIcon,
  HeartIcon,
  StackIcon,
  StarIcon,
  DocumentTextIcon,
  HelpCircleIcon,
  UsersIcon,
  BoltIcon,
  ComposeIcon,
  CogIcon,
  EarthGlobeIcon,
} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip, countReferenceArray} from '../documentMeta'

function i18nPreview(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined
  const no = value.find((entry: {language?: string; _key?: string}) => (entry.language || entry._key) === 'no')
  const en = value.find((entry: {language?: string; _key?: string}) => (entry.language || entry._key) === 'en')
  const text = (no as {value?: string} | undefined)?.value || (en as {value?: string} | undefined)?.value
  return typeof text === 'string' && text.trim() ? text.trim() : undefined
}

export const homepagePageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Homepage',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      id: 'hero',
      title: 'Hero',
      description: 'Homepage Hero Carousel',
      icon: ImagesIcon,
      fields: ['heroBanner'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const slides = (document.heroBanner as {slides?: unknown[]} | undefined)?.slides
          const count = countArray(slides)
          if (count === undefined) return []
          if (count === 0) return ['No slides']
          return [countChip(count, 'Slide', 'Slides')]
        }),
    },
    {
      id: 'trust',
      title: 'Trust',
      description: 'Patient trust banner under the hero',
      icon: HeartIcon,
      fields: ['patientTrustBanner'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const banner = document.patientTrustBanner as {value?: string; label?: unknown} | undefined
          const value = banner?.value?.trim() || i18nPreview(banner?.label)
          return value ? [value] : ['Not configured']
        }),
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Treatment categories on the homepage grid',
      icon: StackIcon,
      fields: ['serviceCategories'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countReferenceArray(document.serviceCategories)
          if (count === undefined) return []
          if (count === 0) return ['No categories', 'Manual']
          return [countChip(count, 'Category', 'Categories'), 'Manual']
        }),
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Patient reviews and ratings on the homepage',
      icon: StarIcon,
      fields: [
        'reviewsSubheading',
        'reviewsHeading',
        'reviewsGoogleRating',
        'reviewsLegelistenRating',
        'reviewsCtaTitle',
        'reviewsCtaSubtitle',
        'googleReviews',
      ],
      entityRefField: 'googleReviews',
      entityType: 'googleReview',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countReferenceArray(document.googleReviews)
          if (count === undefined) return []
          if (count === 0) return ['No reviews']
          return [countChip(count, 'Review', 'Reviews')]
        }),
    },
    {
      id: 'articlesIntro',
      title: 'Articles Intro',
      description: 'Left column copy for the homepage news/articles band',
      icon: DocumentTextIcon,
      fields: ['newsSplitSection'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.newsSplitSection as {heading?: unknown} | undefined
          return i18nPreview(section?.heading) ? ['Ready'] : ['Not configured']
        }),
    },
    {
      id: 'articles',
      title: 'Featured Articles',
      description: 'News and featured stories on the homepage',
      icon: DocumentTextIcon,
      // Keep newsSplitSection in Articles Intro — co-mounting it here dropped article rows.
      fields: ['featuredArticles'],
      entityRefField: 'featuredArticles',
      entityType: 'article',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countReferenceArray(document.featuredArticles)
          if (count === undefined) return []
          if (count === 0) return ['No articles']
          return [countChip(count, 'Article', 'Articles')]
        }),
    },
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Homepage FAQ Collection',
      icon: HelpCircleIcon,
      fields: ['faqSectionTitle', 'faqCollection'],
      collectionRefField: 'faqCollection',
      collectionType: 'faqCollection',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const collection = document.faqCollection as {_ref?: string} | undefined
          const hasCollection = typeof collection?._ref === 'string' && collection._ref.length > 0
          if (hasCollection) return ['Collection linked']
          return ['No Collection']
        }),
    },
    {
      id: 'specialists',
      title: 'Specialists',
      description: 'Configure how specialists appear on the Homepage.',
      icon: UsersIcon,
      fields: ['specialistsSection'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.specialistsSection as {
            displayMode?: string
            layout?: string
            maxItems?: number
          } | undefined
          const mode = section?.displayMode || 'all'
          const layout = section?.layout || 'carousel'
          const parts = [
            mode === 'all'
              ? 'All Specialists'
              : mode === 'manual'
                ? 'Manual Selection'
                : 'Filter by Category',
            layout === 'grid' ? 'Grid' : 'Carousel',
          ]
          if (typeof section?.maxItems === 'number') parts.push(`max ${section.maxItems}`)
          return parts
        }),
    },
    {
      id: 'results',
      title: 'Results',
      description: 'Homepage results and statistics',
      icon: BoltIcon,
      fields: ['resultsStatsSection'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.resultsStatsSection as {stats?: unknown[]} | undefined
          const count = countArray(section?.stats)
          if (count === undefined) return []
          if (count === 0) return ['No statistics']
          return [countChip(count, 'Statistic', 'Statistics')]
        }),
    },
    {
      id: 'bookingCta',
      title: 'Booking CTA',
      description: 'Booking call-to-action on the homepage',
      icon: ComposeIcon,
      fields: ['bookingCta'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const booking = document.bookingCta as {ctaCollection?: {_ref?: string}} | undefined
          const collectionRef = booking?.ctaCollection?._ref
          if (typeof collectionRef === 'string' && collectionRef.length > 0) {
            return ['Collection linked']
          }
          return ['Not configured']
        }),
    },
    {
      id: 'pageSettings',
      title: 'Page settings',
      description: 'Internal page title and Studio label',
      icon: CogIcon,
      fields: ['title', 'tagline'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) =>
          i18nPreview(document.title) ? ['Ready'] : ['Not configured'],
        ),
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Optional homepage bands not edited day to day',
      icon: CogIcon,
      fields: ['statsBar', 'valueBadges', 'promoBlocksTitle', 'promoBlocks'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const stats = countArray(document.statsBar)
          const badges = countArray(document.valueBadges)
          const promos = countArray(document.promoBlocks)
          if (stats === undefined && badges === undefined && promos === undefined) {
            return []
          }
          const parts: string[] = []
          if (stats && stats > 0) parts.push(countChip(stats, 'Stat', 'Stats'))
          if (badges && badges > 0) parts.push(countChip(badges, 'Badge', 'Badges'))
          if (promos && promos > 0) parts.push(countChip(promos, 'Promo', 'Promos'))
          return parts.length > 0 ? parts : ['Empty']
        }),
    },
    {
      id: 'seo',
      title: 'SEO',
      description: 'Search and AI summary settings',
      icon: EarthGlobeIcon,
      fields: ['seo', 'geoSummary'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const seo = document.seo as {metaTitle?: unknown} | undefined
          return i18nPreview(seo?.metaTitle) ? ['Ready'] : ['Not configured']
        }),
    },
  ],
})

