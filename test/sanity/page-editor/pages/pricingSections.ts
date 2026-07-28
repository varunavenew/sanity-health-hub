/**
 * Pricing — page editor config (Homepage framework).
 */
import {BoltIcon, CogIcon, StarIcon} from '@sanity/icons'
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
      notice:
        'Prices on the website are loaded from the booking API. Legacy price lists are rollback-only under Legacy.',
      getChips: () => ['API driven', 'Configured'],
    },
    faqCollectionSection({titleField: 'faqTitle', collectionField: 'faqCollection'}),
    specialistsBandSection({
      getPageOwnedChips: () => ['Page-owned'],
      pageOwnedNotice:
        'This page already renders specialists via its own Pricing UI (not a shared Specialists band). Adding a shared band would duplicate the frontend until Phase 3 cleanup.',
    }),
    articlesBandSection({
      pageOwnedNotice:
        'Optional shared Articles band. Empty means unused — Pricing has no page-owned articles UI.',
    }),
    bookingCtaBandSection(),
    seoSection(),
    {
      id: 'legacy',
      title: 'Legacy',
      description: 'Rollback-only price lists, insurance note, and FAQ list.',
      icon: CogIcon,
      fields: ['faqs', 'priceCategories', 'insuranceNote'],
      notice: 'Not used on the live Pricing page. Prefer modern sections above.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const cats = countArray(document.priceCategories) || 0
          const faqs = countArray(document.faqs) || 0
          if (!cats && !faqs && !document.insuranceNote) return ['Empty']
          const chips: string[] = ['Legacy']
          if (cats) chips.unshift(countChip(cats, 'Category', 'Categories'))
          return chips
        }),
    },
  ],
})
