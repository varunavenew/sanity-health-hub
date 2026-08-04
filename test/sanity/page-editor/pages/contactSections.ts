/**
 * Contact — page editor config (Homepage framework).
 */
import {ComposeIcon, EnvelopeIcon, PinIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {
  bookingCtaBandSection,
  heroSection,
  seoSection,
} from '../sharedSectionBuilders'

/** Page form (“Send us a message”) — nested contactForm object. */
const CONTACT_FORM_FIELDS = ['contactForm']

/**
 * Contact request modal copy (CTA card → openContactDialog).
 * Flat field names preserved for existing documents + GROQ.
 */
const CONTACT_MODAL_PRIMARY_FIELDS = [
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
]

const CONTACT_MODAL_VALIDATION_FIELDS = [
  'toastValidationTitle',
  'toastValidationDescription',
  'validationNameRequired',
  'validationPhoneRequired',
  'validationClinicRequired',
  'validationCategoryRequired',
  'toastSuccessTitle',
  'toastSuccessDescription',
]

const CONTACT_MODAL_FIELDS = [
  ...CONTACT_MODAL_PRIMARY_FIELDS,
  ...CONTACT_MODAL_VALIDATION_FIELDS,
]

function hasConfiguredValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(hasConfiguredValue)
  }
  return true
}

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
      id: 'clinics',
      title: 'Clinics',
      description:
        'Clinic list on the Contact page. Keep this filled so Studio matches the website (empty = all clinics on the site).',
      icon: PinIcon,
      fields: ['clinicsSection'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const section = document.clinicsSection as
            | {showSection?: boolean; clinics?: unknown[]}
            | undefined
          if (!section) return ['All clinics', 'Default']
          if (section.showSection === false) return ['Hidden']
          const count = countArray(section.clinics)
          if (count === undefined || count === 0) return ['Empty → all clinics on site']
          return [countChip(count, 'Clinic', 'Clinics'), 'Configured']
        }),
    },
    {
      id: 'contactForm',
      title: 'Contact Form',
      description: 'Page form labels, placeholders, and success/error messages.',
      icon: ComposeIcon,
      fields: CONTACT_FORM_FIELDS,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return hasConfiguredValue(document.contactForm) ? ['Configured'] : ['Defaults']
        }),
    },
    {
      id: 'contactRequestModal',
      title: 'Contact Request Modal',
      description:
        'Callback modal copy (opened from Contact Cards). Validation messages are collapsed under “Modal validation & toasts”.',
      icon: EnvelopeIcon,
      fields: CONTACT_MODAL_FIELDS,
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const configured = CONTACT_MODAL_FIELDS.some((name) =>
            hasConfiguredValue(document[name]),
          )
          return configured ? ['Configured'] : ['Empty']
        }),
    },
    bookingCtaBandSection(),
    seoSection(),
  ],
})
