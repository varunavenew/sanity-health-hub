// Schema: Contact Page
import {ContactIcon} from './icons'
import {i18nSlugFieldFromTitle, pickNo, requiredNoEnSeo} from './i18n'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {contactPageEditorConfig} from '../sanity/page-editor/pages/contactSections'

const CONTACT_SHARED_SECTIONS = ['pageSectionBookingCta'] as const

const crI18n = (
  name: string,
  title: string,
  description?: string,
  type: 'internationalizedArrayString' | 'internationalizedArrayText' = 'internationalizedArrayString',
) => ({
  name,
  title,
  type,
  group: 'content',
  fieldset: 'advanced',
  description,
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
  fieldsets: [...singletonPageFieldsets],
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
      options: {hotspot: true},
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
              return {title: pickNo(title), subtitle: pickNo(subtitle)}
            },
          },
        },
      ],
    },
    {
      name: 'phone',
      title: 'Phone (legacy)',
      type: 'string',
      group: 'content',
      fieldset: 'legacy',
      description: 'Not shown on the Contact page — contact details come from clinic documents.',
    },
    {
      name: 'email',
      title: 'Email (legacy)',
      type: 'string',
      group: 'content',
      fieldset: 'legacy',
      description: 'Not shown on the Contact page today.',
    },
    {
      name: 'address',
      title: 'Address (legacy)',
      type: 'object',
      group: 'content',
      fieldset: 'legacy',
      fields: [
        {name: 'street', title: 'Street', type: 'string'},
        {name: 'city', title: 'City', type: 'string'},
        {name: 'zip', title: 'Postal code', type: 'string'},
      ],
    },
    {
      name: 'openingHours',
      title: 'Opening hours (legacy)',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
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
    crI18n('dialogTitle', 'Contact modal — title'),
    crI18n('dialogDescription', 'Contact modal — intro', undefined, 'internationalizedArrayText'),
    crI18n('nameLabel', 'Field — name (label)'),
    crI18n('namePlaceholder', 'Field — name (placeholder)'),
    crI18n('phoneLabel', 'Field — phone (label)'),
    crI18n('phonePlaceholder', 'Field — phone (placeholder)'),
    crI18n('clinicLabel', 'Field — clinic (label)'),
    crI18n('clinicPlaceholder', 'Field — clinic (placeholder)'),
    crI18n('categoryLabel', 'Field — specialty (label)'),
    crI18n('categoryPlaceholder', 'Field — specialty (placeholder)'),
    crI18n('categoryOtherLabel', 'Field — other / not sure'),
    crI18n('timingLabel', 'When to contact — heading'),
    crI18n('timingAsapLabel', 'Option — as soon as possible'),
    crI18n('timingSpecificLabel', 'Option — select day and time'),
    crI18n('dayLabel', 'Field — day'),
    crI18n('timeOfDayLabel', 'Field — time slot (label)'),
    crI18n('timeOfDayPlaceholder', 'Field — time slot (placeholder)'),
    crI18n('timeMorningLabel', 'Time — morning'),
    crI18n('timeAfternoonLabel', 'Time — afternoon'),
    crI18n('timeEveningLabel', 'Time — evening'),
    crI18n('detailsLabel', 'Field — details (label)'),
    crI18n('detailsOptionalSuffix', 'Field — details (optional suffix)', "E.g. '(optional)'"),
    crI18n('detailsPlaceholder', 'Field — details (placeholder)'),
    crI18n('cancelButton', 'Button — cancel'),
    crI18n('submitButton', 'Button — send'),
    crI18n('submittingButton', 'Button — sending'),
    crI18n('privacyNote', 'Privacy footnote', undefined, 'internationalizedArrayText'),
    crI18n('toastValidationTitle', 'Validation — toast title'),
    crI18n('toastValidationDescription', 'Validation — toast message (general)'),
    crI18n('validationNameRequired', 'Validation — name'),
    crI18n('validationPhoneRequired', 'Validation — phone'),
    crI18n('validationClinicRequired', 'Validation — clinic'),
    crI18n('validationCategoryRequired', 'Validation — specialty'),
    crI18n('toastSuccessTitle', 'Success — toast title'),
    crI18n('toastSuccessDescription', 'Success — toast message', undefined, 'internationalizedArrayText'),
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
      return {title: pickNo(title) || 'Contact'}
    },
  },
}
