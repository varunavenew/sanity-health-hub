/**
 * About Us — page editor config (Homepage framework).
 * Maps About fields onto section cards; does not change GROQ or frontend.
 */
import {DocumentTextIcon, PinIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  articlesBandSection,
  bookingCtaBandSection,
  heroSection,
  seoSection,
  specialistsBandSection,
} from '../sharedSectionBuilders'

export const aboutPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'About Us',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection([
      'title',
      'slug',
      'heroEyebrow',
      'subtitle',
      'heroImage',
      'heroImageAlt',
    ]),
    {
      id: 'introduction',
      title: 'Introduction',
      description: 'Main About story and body content.',
      icon: DocumentTextIcon,
      fields: ['body'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const body = document.body
          if (body === undefined || body === null) return ['Empty']
          if (Array.isArray(body) && body.length === 0) return ['Empty']
          return ['Configured']
        }),
    },
    {
      id: 'clinicOverview',
      title: 'Clinic Overview',
      description: 'Clinic grid shown on the About page.',
      icon: PinIcon,
      fields: ['clinicsSection'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.clinicsSection as
            | {showSection?: boolean; clinics?: unknown[]}
            | undefined
          if (!section) return ['Empty']
          if (section.showSection === false) return ['Hidden']
          const count = countArray(section.clinics)
          if (count === undefined || count === 0) return ['All clinics', 'Configured']
          return [countChip(count, 'Clinic', 'Clinics'), 'Configured']
        }),
    },
    specialistsBandSection(),
    articlesBandSection(),
    bookingCtaBandSection(),
    seoSection(),
  ],
})
