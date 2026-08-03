/**
 * Insurance — page editor config (Homepage framework).
 */
import {CheckmarkCircleIcon, HeartIcon, UsersIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  articlesBandSection,
  bookingCtaBandSection,
  heroSection,
  seoSection,
} from '../sharedSectionBuilders'

export const insurancePageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Insurance',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection(['title', 'slug', 'heroImage', 'introText']),
    {
      id: 'partners',
      title: 'Partners',
      description: 'Insurance partners shown on the page body.',
      icon: UsersIcon,
      fields: ['partnersLocalized'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.partnersLocalized)
          if (!count) return ['Empty']
          return [countChip(count, 'Partner', 'Partners')]
        }),
    },
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'Benefit cards on the Insurance page.',
      icon: HeartIcon,
      fields: ['benefits'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.benefits)
          if (!count) return ['Empty']
          return [countChip(count, 'Benefit', 'Benefits')]
        }),
    },
    {
      id: 'steps',
      title: 'Steps',
      description: 'How it works — step list.',
      icon: CheckmarkCircleIcon,
      fields: ['steps'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.steps)
          if (!count) return ['Empty']
          return [countChip(count, 'Step', 'Steps')]
        }),
    },
    articlesBandSection(),
    bookingCtaBandSection({
      pageOwnedNotice:
        'Optional shared Booking CTA. Insurance uses page-owned contact CTAs when this band is empty.',
    }),
    seoSection(),
  ],
})
