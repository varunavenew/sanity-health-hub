/**
 * Services — page editor config (Homepage framework).
 */
import {SearchIcon, StackIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip, countReferenceArray} from '../documentMeta'
import {
  articlesBandSection,
  bookingCtaBandSection,
  faqCollectionSection,
  heroSection,
  seoSection,
  specialistsBandSection,
} from '../sharedSectionBuilders'

export const servicesPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Services',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection([
      'breadcrumbHome',
      'title',
      'slug',
      'eyebrow',
      'heroImage',
      'introText',
    ]),
    {
      id: 'badges',
      title: 'Badges',
      description: 'Trust / highlight badges shown with the Services hero.',
      icon: StackIcon,
      fields: ['badges'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.badges)
          if (!count) return ['Empty']
          return [countChip(count, 'Badge', 'Badges')]
        }),
    },
    {
      id: 'search',
      title: 'Search',
      description: 'Search field copy on the Services page.',
      icon: SearchIcon,
      fields: ['searchPlaceholder'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const value = document.searchPlaceholder
          if (value === undefined || value === null) return ['Empty']
          if (Array.isArray(value) && value.length === 0) return ['Empty']
          return ['Configured']
        }),
    },
    {
      id: 'featured',
      title: 'Featured Categories',
      description: 'Featured and more-services category grids.',
      icon: StackIcon,
      fields: [
        'featuredSectionTitle',
        'featuredCategories',
        'moreServicesSection',
        'moreServicesCategories',
        'emptyCategoriesMessage',
      ],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const featured = countReferenceArray(document.featuredCategories)
          const more = countArray(document.moreServicesCategories)
          const chips: string[] = []
          if (featured) chips.push(countChip(featured, 'Featured', 'Featured'))
          if (more) chips.push(countChip(more, 'More', 'More'))
          return chips.length ? chips : ['Empty']
        }),
    },
    faqCollectionSection({titleField: 'faqSectionTitle', collectionField: 'faqCollection'}),
    specialistsBandSection(),
    articlesBandSection(),
    bookingCtaBandSection(),
    seoSection(),
  ],
})
