// Schema: Contact Page
import {ContactIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {contactPageEditorConfig} from '../sanity/page-editor/pages/contactSections'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const CONTACT_SHARED_SECTIONS = ['pageSectionBookingCta'] as const

/** Primary labels for the Contact Request modal (opened from CTA cards). */
const MODAL_PRIMARY_FIELDS: Array<{
  name: string
  title: string
  description?: string
  type?: 'internationalizedArrayString' | 'internationalizedArrayText'
}> = [
  {name: 'dialogTitle', title: 'Title'},
  {name: 'dialogDescription', title: 'Intro', type: 'internationalizedArrayText'},
  {name: 'nameLabel', title: 'Name — label'},
  {name: 'namePlaceholder', title: 'Name — placeholder'},
  {name: 'phoneLabel', title: 'Phone — label'},
  {name: 'phonePlaceholder', title: 'Phone — placeholder'},
  {name: 'clinicLabel', title: 'Clinic — label'},
  {name: 'clinicPlaceholder', title: 'Clinic — placeholder'},
  {name: 'categoryLabel', title: 'Specialty — label'},
  {name: 'categoryPlaceholder', title: 'Specialty — placeholder'},
  {name: 'categoryOtherLabel', title: 'Specialty — other / not sure'},
  {name: 'timingLabel', title: 'When to contact — heading'},
  {name: 'timingAsapLabel', title: 'Option — as soon as possible'},
  {name: 'timingSpecificLabel', title: 'Option — select day'},
  {name: 'dayLabel', title: 'Day — label'},
  {name: 'timeOfDayLabel', title: 'Time slot — label'},
  {name: 'timeOfDayPlaceholder', title: 'Time slot — placeholder'},
  {name: 'timeMorningLabel', title: 'Time — morning'},
  {name: 'timeAfternoonLabel', title: 'Time — afternoon'},
  {name: 'timeEveningLabel', title: 'Time — evening'},
  {name: 'detailsLabel', title: 'Details — label'},
  {
    name: 'detailsOptionalSuffix',
    title: 'Details — optional suffix',
    description: "E.g. '(optional)'",
  },
  {name: 'detailsPlaceholder', title: 'Details — placeholder'},
  {name: 'cancelButton', title: 'Button — cancel'},
  {name: 'submitButton', title: 'Button — send'},
  {name: 'submittingButton', title: 'Button — sending'},
  {name: 'privacyNote', title: 'Privacy footnote', type: 'internationalizedArrayText'},
]

/** Validation / toast copy for the Contact Request modal — collapsed by default. */
const MODAL_VALIDATION_FIELDS: Array<{
  name: string
  title: string
  type?: 'internationalizedArrayString' | 'internationalizedArrayText'
}> = [
  {name: 'toastValidationTitle', title: 'Validation — toast title'},
  {name: 'toastValidationDescription', title: 'Validation — toast message'},
  {name: 'validationNameRequired', title: 'Validation — name required'},
  {name: 'validationPhoneRequired', title: 'Validation — phone required'},
  {name: 'validationClinicRequired', title: 'Validation — clinic required'},
  {name: 'validationCategoryRequired', title: 'Validation — specialty required'},
  {name: 'toastSuccessTitle', title: 'Success — toast title'},
  {
    name: 'toastSuccessDescription',
    title: 'Success — toast message',
    type: 'internationalizedArrayText',
  },
]

const modalField = (
  def: {
    name: string
    title: string
    description?: string
    type?: 'internationalizedArrayString' | 'internationalizedArrayText'
  },
  fieldset: 'contactModal' | 'contactModalValidation',
) => ({
  name: def.name,
  title: def.title,
  type: def.type ?? 'internationalizedArrayString',
  group: 'content' as const,
  fieldset,
  description: def.description,
})

export default {
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: ContactIcon,
  components: {
    input: createPageSectionDocumentInput(contactPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [
    ...singletonPageFieldsets,
    {
      name: 'contactModal',
      title: 'Contact request modal',
      description:
        'Labels for the callback modal opened from Contact Cards (not the page form).',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'contactModalValidation',
      title: 'Modal validation & toasts',
      description: 'Validation and success messages for the contact request modal.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {...i18nSlugFieldFromTitle('title', {group: 'hero'})},
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: mediaImageOptions('hero'),
      description: mediaDescription('hero'),
      validation: softImageRules('hero'),
    },
    {
      name: 'introText',
      title: 'Subtitle / intro text',
      type: 'internationalizedArrayText',
      group: 'hero',
    },
    {
      name: 'ctaCards',
      title: 'Help cards (CTA section)',
      type: 'array',
      group: 'content',
      description: 'Three cards displayed under the clinic list on the Contact page.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (Calendar, Shield, Phone, Mail, MessageCircle)',
            },
            {name: 'title', title: 'Title', type: 'internationalizedArrayString'},
            {name: 'description', title: 'Description', type: 'internationalizedArrayText'},
            {name: 'ctaText', title: 'Button Text', type: 'internationalizedArrayString'},
            {
              name: 'ctaAction',
              title: 'Action',
              type: 'string',
              options: {
                list: [
                  {title: 'Open contact modal', value: 'openContactDialog'},
                  {title: 'Navigate to link', value: 'navigate'},
                ],
                layout: 'radio',
              },
              initialValue: 'navigate',
            },
            {name: 'ctaLink', title: 'CTA link (if navigate)', type: 'string'},
            {
              name: 'variant',
              title: 'Button variant',
              type: 'string',
              options: {
                list: [
                  {title: 'Solid', value: 'solid'},
                  {title: 'Outline', value: 'outline'},
                ],
                layout: 'radio',
              },
              initialValue: 'solid',
            },
          ],
          preview: {
            select: {title: 'title', subtitle: 'ctaText'},
            prepare({title, subtitle}: any) {
              return {title: pickStudioEn(title), subtitle: pickStudioEn(subtitle)}
            },
          },
        },
      ],
    },
    {
      name: 'clinicsSection',
      title: 'Section — clinics',
      description:
        'Clinic list on Contact. Empty clinic list = all published clinics (same pattern as About).',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'showSection',
          title: 'Show section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Heading',
          type: 'internationalizedArrayString',
          description: 'For example: "Our clinics" / "Våre klinikker"',
        },
        {
          name: 'clinics',
          title: 'Clinics',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'clinicPage'}]}],
          description:
            'Clinics shown on the Contact page, in list order. Populate with every clinic you want listed. An empty list falls back to all published clinics on the website — keep this filled so Studio matches the live page.',
        },
      ],
    },
    {
      name: 'contactForm',
      title: 'Contact form',
      description:
        'Page form (“Send us a message”). Leave empty to use default website copy.',
      type: 'object',
      group: 'content',
      options: {collapsible: true, collapsed: false},
      fields: [
        {name: 'title', title: 'Title', type: 'internationalizedArrayString'},
        {name: 'subtitle', title: 'Subtitle', type: 'internationalizedArrayText'},
        {name: 'nameLabel', title: 'Name — label', type: 'internationalizedArrayString'},
        {
          name: 'namePlaceholder',
          title: 'Name — placeholder',
          type: 'internationalizedArrayString',
        },
        {name: 'phoneLabel', title: 'Phone — label', type: 'internationalizedArrayString'},
        {
          name: 'phonePlaceholder',
          title: 'Phone — placeholder',
          type: 'internationalizedArrayString',
        },
        {name: 'emailLabel', title: 'Email — label', type: 'internationalizedArrayString'},
        {
          name: 'emailPlaceholder',
          title: 'Email — placeholder',
          type: 'internationalizedArrayString',
        },
        {name: 'clinicLabel', title: 'Clinic — label', type: 'internationalizedArrayString'},
        {
          name: 'clinicPlaceholder',
          title: 'Clinic — placeholder',
          type: 'internationalizedArrayString',
        },
        {name: 'subjectLabel', title: 'Subject — label', type: 'internationalizedArrayString'},
        {
          name: 'subjectPlaceholder',
          title: 'Subject — placeholder',
          type: 'internationalizedArrayString',
        },
        {name: 'messageLabel', title: 'Message — label', type: 'internationalizedArrayString'},
        {
          name: 'messagePlaceholder',
          title: 'Message — placeholder',
          type: 'internationalizedArrayText',
        },
        {name: 'submitButton', title: 'Submit button', type: 'internationalizedArrayString'},
        {
          name: 'successTitle',
          title: 'Success message — title',
          type: 'internationalizedArrayString',
        },
        {
          name: 'successDescription',
          title: 'Success message — body',
          type: 'internationalizedArrayText',
        },
        {
          name: 'errorTitle',
          title: 'Error message — title',
          type: 'internationalizedArrayString',
        },
        {
          name: 'errorDescription',
          title: 'Error message — body',
          type: 'internationalizedArrayText',
        },
      ],
    },
    // Legacy phone/email/address kept hidden for backward compatibility.
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'content',
      fieldset: 'legacy',
      hidden: () => true,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'content',
      fieldset: 'legacy',
      hidden: () => true,
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'content',
      fieldset: 'legacy',
      hidden: () => true,
      fields: [
        {name: 'street', title: 'Street', type: 'string'},
        {name: 'city', title: 'City', type: 'string'},
        {name: 'zip', title: 'Postal code', type: 'string'},
      ],
    },
    {
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      hidden: () => true,
      of: [
        {
          type: 'object',
          fields: [
            {name: 'days', title: 'Days', type: 'internationalizedArrayString'},
            {name: 'hours', title: 'Hours', type: 'string'},
          ],
        },
      ],
    },
    // Contact request modal — flat field names preserved for existing GROQ + data
    ...MODAL_PRIMARY_FIELDS.map((f) => modalField(f, 'contactModal')),
    ...MODAL_VALIDATION_FIELDS.map((f) => modalField(f, 'contactModalValidation')),
    pageSectionsFieldForGroup('content', 'sharedSections', CONTACT_SHARED_SECTIONS),
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
      validation: requiredNoEnSeo,
    },
    {...geoSummaryField, ...seoFieldsetProps},
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: any) {
      return {title: pickStudioEn(title) || 'Contact'}
    },
  },
}
