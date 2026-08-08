/**
 * Pricing — page editor config (Homepage framework).
 */
import {BoltIcon, StarIcon, UsersIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countChip, countReferenceArray} from '../documentMeta'
import {specialistsDisplayModeChip} from '../specialistsDisplayMode'
import {
  articlesBandSection,
  bookingCtaBandSection,
  faqCollectionSection,
  heroSection,
  seoSection,
} from '../sharedSectionBuilders'

export const pricingPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Pricing',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection(['title', 'slug', 'heroImage', 'introText']),
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Patient quotes used only on Pricing (not Google Reviews).',
      icon: StarIcon,
      fields: ['testimonialsTitle', 'testimonials'],
      entityRefField: 'testimonials',
      entityType: 'testimonial',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countReferenceArray(document.testimonials)
          if (!count) return ['Empty']
          return [countChip(count, 'Testimonial', 'Testimonials')]
        }),
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Live prices come from the booking API.',
      icon: BoltIcon,
      fields: [],
      notice: 'Prices on the website are loaded from the booking API.',
      getChips: () => ['API driven', 'Configured'],
    },
    faqCollectionSection({titleField: 'faqTitle', collectionField: 'faqCollection'}),
    {
      id: 'specialists',
      title: 'Specialists',
      description:
        'Pricing specialists dark grid — heading, intro, display mode, and max items. Layout is fixed on the website.',
      icon: UsersIcon,
      fields: ['specialistsSection'],
      notice:
        'This section is page-owned. It is not controlled by Shared Sections / Website bands. Website layout is always a fixed dark grid (Layout is not editable here).',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.specialistsSection as
            | {displayMode?: string; maxItems?: number}
            | undefined
          if (!section) return ['Not configured']
          const parts = [specialistsDisplayModeChip(section.displayMode), 'Fixed grid']
          if (typeof section.maxItems === 'number') parts.push(`max ${section.maxItems}`)
          return parts
        }),
    },
    articlesBandSection(),
    bookingCtaBandSection(),
    seoSection(),
  ],
})
