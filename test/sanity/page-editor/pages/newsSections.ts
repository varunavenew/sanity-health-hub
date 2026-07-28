/**
 * News — page editor config (Homepage framework).
 */
import {
  DocumentTextIcon,
  FilterIcon,
  ImagesIcon,
  SearchIcon,
  UsersIcon,
} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip, countReferenceArray} from '../documentMeta'
import {
  bookingCtaBandSection,
  heroSection,
  i18nPreview,
  seoSection,
} from '../sharedSectionBuilders'

export const newsPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'News',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection(['label', 'title', 'slug', 'subtitle', 'breadcrumbHomeLabel']),
    {
      id: 'featured',
      title: 'Featured Articles',
      description: 'Top articles when filter = All.',
      icon: DocumentTextIcon,
      fields: ['featuredArticles'],
      entityRefField: 'featuredArticles',
      entityType: 'article',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countReferenceArray(document.featuredArticles)
          if (!count) return ['Empty']
          return [countChip(count, 'Article', 'Articles')]
        }),
    },
    {
      id: 'filters',
      title: 'Filters',
      description: 'Article filter chips on the News page.',
      icon: FilterIcon,
      fields: ['filters'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.filters)
          if (!count) return ['Empty']
          return [countChip(count, 'Filter', 'Filters')]
        }),
    },
    {
      id: 'newsList',
      title: 'News List',
      description: 'List size and empty / read-more copy.',
      icon: SearchIcon,
      fields: [
        'searchPlaceholder',
        'listSize',
        'moreArticlesTitle',
        'noArticlesText',
        'readMoreLabel',
      ],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const size = document.listSize
          if (typeof size === 'number') return [`${size} per load`, 'Configured']
          return i18nPreview(document.searchPlaceholder) ? ['Configured'] : ['Empty']
        }),
    },
    {
      id: 'specialistsCopy',
      title: 'Specialists Copy',
      description: 'Labels for the specialists block on News (page-owned UI).',
      icon: UsersIcon,
      fields: [
        'specialistsEyebrowAll',
        'specialistsEyebrowWithin',
        'specialistsTitle',
        'specialistsSeeAllLabel',
      ],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.specialistsTitle) ||
            i18nPreview(document.specialistsEyebrowAll)
            ? ['Page-owned', 'Configured']
            : ['Empty']
        }),
    },
    {
      id: 'social',
      title: 'Social Media',
      description: 'Follow-us social posts section.',
      icon: ImagesIcon,
      fields: ['socialSectionTitle', 'socialMode', 'socialPosts', 'socialPostLimit'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const mode = document.socialMode
          if (mode === 'hidden') return ['Hidden']
          if (mode === 'api') return ['Instagram API', 'Configured']
          const count = countArray(document.socialPosts)
          if (mode === 'cms' && count) return [countChip(count, 'Post', 'Posts')]
          return mode ? ['Configured'] : ['Empty']
        }),
    },
    bookingCtaBandSection({
      pageOwnedNotice:
        'Optional shared Booking CTA. News has no page-owned booking CTA today — Empty means unused, not missing content.',
    }),
    seoSection(),
  ],
})
