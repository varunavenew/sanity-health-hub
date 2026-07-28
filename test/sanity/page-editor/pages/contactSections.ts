/**
 * Contact — page editor config (Homepage framework).
 */
import {CogIcon, ComposeIcon, EnvelopeIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  bookingCtaBandSection,
  heroSection,
  seoSection,
} from '../sharedSectionBuilders'

const CONTACT_FORM_FIELDS = [
  'dialogTitle',
  'dialogDescription',
  'nameLabel',
  'namePlaceholder',
  'phoneLabel',
  'phonePlaceholder',
  'clinicLabel',
  'clinicPlaceholder',
  'categoryLabel',
  'categoryPlaceholder',
  'categoryOtherLabel',
  'timingLabel',
  'timingAsapLabel',
  'timingSpecificLabel',
  'dayLabel',
  'timeOfDayLabel',
  'timeOfDayPlaceholder',
  'timeMorningLabel',
  'timeAfternoonLabel',
  'timeEveningLabel',
  'detailsLabel',
  'detailsOptionalSuffix',
  'detailsPlaceholder',
  'cancelButton',
  'submitButton',
  'submittingButton',
  'privacyNote',
  'toastValidationTitle',
  'toastValidationDescription',
  'validationNameRequired',
  'validationPhoneRequired',
  'validationClinicRequired',
  'validationCategoryRequired',
  'toastSuccessTitle',
  'toastSuccessDescription',
]

export const contactPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Contact',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    heroSection(['title', 'slug', 'heroImage', 'introText']),
    {
      id: 'contactCards',
      title: 'Contact Cards',
      description: 'Help cards under the clinic list.',
      icon: EnvelopeIcon,
      fields: ['ctaCards'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const count = countArray(document.ctaCards)
          if (!count) return ['Empty']
          return [countChip(count, 'Card', 'Cards')]
        }),
    },
    {
      id: 'contactForm',
      title: 'Contact Form Copy',
      description: 'Modal and form labels (advanced copy).',
      icon: ComposeIcon,
      fields: CONTACT_FORM_FIELDS,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const configured = CONTACT_FORM_FIELDS.some((name) => {
            const value = document[name]
            if (value === undefined || value === null) return false
            if (Array.isArray(value)) return value.length > 0
            return typeof value === 'string' ? value.trim().length > 0 : true
          })
          return configured ? ['Configured'] : ['Empty']
        }),
    },
    bookingCtaBandSection(),
    seoSection(),
    {
      id: 'legacy',
      title: 'Legacy',
      description: 'Legacy contact details — clinics supply live contact info.',
      icon: CogIcon,
      fields: ['phone', 'email', 'address', 'openingHours'],
      notice: 'Not shown on the Contact page today. Rollback only.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          if (document.phone || document.email || document.address) return ['Legacy']
          return ['Empty']
        }),
    },
  ],
})
