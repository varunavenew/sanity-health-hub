/**
 * Pricing — page editor config (Homepage framework).
 */
import {BoltIcon, StarIcon, UsersIcon, ComposeIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countChip, countReferenceArray} from '../documentMeta'
import {specialistsDisplayModeChip} from '../specialistsDisplayMode'
import {
  articlesBandSection,
  faqCollectionSection,
  heroSection,
  i18nPreview,
  insuranceBandSection,
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
      description:
        'CMS price list (categories, subcategories, prices). Optional Metodika activity ID controls “Bestill time”.',
      icon: BoltIcon,
      fields: ['priceCategories'],
      notice:
        'Sanity is the source of truth for the Pricing list. Metodika apiActivityId is optional booking identity only — lines without an ID still appear, without a booking button.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const cats = Array.isArray(document.priceCategories)
            ? document.priceCategories.length
            : 0
          if (!cats) return ['Empty']
          return [countChip(cats, 'Category', 'Categories'), 'CMS driven']
        }),
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
    insuranceBandSection(),
    articlesBandSection(),
    {
      id: 'pricingCta',
      title: 'Pricing CTA',
      description:
        'Pricing-only booking CTA — heading, buttons, and Content Library collection. Not shared with other pages.',
      icon: ComposeIcon,
      fields: ['pricingCta'],
      notice:
        'Page-owned. Uses the Pricing CTA Collection. Website Shared Sections Booking CTA is not used on Pricing.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const cta = document.pricingCta as
            | {
                ctaCollection?: {_ref?: string}
                title?: unknown
                primaryLabel?: unknown
              }
            | undefined
          if (!cta) return ['Empty']
          if (cta.ctaCollection?._ref) return ['Collection linked', 'Page-owned']
          const title = i18nPreview(cta.title) || i18nPreview(cta.primaryLabel)
          return title ? [title, 'Page-owned'] : ['Empty']
        }),
    },
    seoSection(),
  ],
})
