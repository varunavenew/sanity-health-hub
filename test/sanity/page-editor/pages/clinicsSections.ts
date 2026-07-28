/**
 * Clinics — page editor config (Homepage framework).
 */
import {PinIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {
  articlesBandSection,
  bookingCtaBandSection,
  heroSection,
  seoSection,
} from '../sharedSectionBuilders'

export const clinicsPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Clinics',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection([
      'heroEyebrow',
      'heroTitle',
      'slug',
      'heroDescription',
      'heroImage',
      'primaryCtaLabel',
      'primaryCtaPath',
      'secondaryCtaLabel',
      'secondaryCtaPath',
    ]),
    {
      id: 'clinicListing',
      title: 'Clinic Listing',
      description: 'Clinic cards are sourced from individual Clinic pages.',
      icon: PinIcon,
      fields: [],
      getChips: () => ['Configured'],
      notice:
        'Clinic cards on this page are loaded automatically from individual Clinic documents (page-owned listing behaviour). Edit clinic details under Pages → Clinics.',
    },
    articlesBandSection({
      pageOwnedNotice:
        'Optional shared Articles band. Empty means unused. Clinic listing is page-owned above.',
    }),
    bookingCtaBandSection(),
    seoSection(),
  ],
})
