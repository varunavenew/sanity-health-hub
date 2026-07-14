// Schema: Clinic Page
import { ClinicIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { pageSectionsFieldForGroup } from './pageSections'
import { geoSummaryField } from './geoSummary'

const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

/** Avoid Studio GroupSelect crashes: skip validation when booking method does not apply. */
function whenBookingMethod(method: string, validate: (rule: any) => any) {
  return (rule: any, context: { parent?: { method?: string }; hidden?: boolean }) => {
    if (context?.hidden || context?.parent?.method !== method) return rule.skip()
    return validate(rule)
  }
}

export default {
  name: 'clinicPage',
  title: 'Clinic',
  type: 'document',
  icon: ClinicIcon,
  groups: [
    { name: 'main', title: 'Content', default: true },
    { name: 'booking', title: 'Booking' },
    { name: 'extras', title: 'FAQ & sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Name'),
      group: 'main',
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        title: 'Slug',
        group: 'main',
      }),
    },
    {
      name: 'primaryImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      validation: reqStr('Main image'),
      group: 'main',
    },
    {
  name: 'gallery',
  title: 'Interior gallery',
  description: 'Extra images shown as the "Fra klinikken" strip on the clinic page.',
  type: 'array',
  group: 'main',
  of: [
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    },
  ],
},

    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Description'),
      group: 'main',
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      description: 'Lower numbers are shown first in the clinic list.',
      initialValue: 0,
      validation: (Rule: any) => Rule.integer().min(0).error('Must be 0 or higher'),
      group: 'main',
    },
    {
      name: 'valueProposition',
      title: 'Value propositions',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      fields: [
        { name: 'valueProposition1', title: 'Value proposition 1', type: 'internationalizedArrayString' },
        { name: 'valueProposition2', title: 'Opening hours', type: 'string', placeholder: '08:00–16:00' },
        { name: 'socialProof', title: 'Social proof', type: 'internationalizedArrayString' },
      ],
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: reqStr('Address'),
      group: 'main',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: reqStr('Phone'),
      group: 'main',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.email().error('Must be a valid email address'),
      group: 'main',
    },
    {
      name: 'hours',
      title: 'Opening hours',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Opening hours'),
      group: 'main',
    },
    {
      name: 'contactDescription',
      title: 'Contact description',
      type: 'internationalizedArrayText',
      group: 'main',
    },
    {
      name: 'locationSearch',
      title: 'Coordinates',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      validation: (Rule: any) =>
        Rule.required().custom((value: { lat?: number; lng?: number } | undefined) => {
          if (value?.lat == null || value?.lng == null) {
            return 'Latitude and longitude are required'
          }
          return true
        }),
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: reqStr('Latitude'),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: reqStr('Longitude'),
        },
      ],
    },
    {
      name: 'treatments',
      title: 'Treatments',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
      group: 'main',
    },
    {
      name: 'specialists',
      title: 'Specialists',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
      group: 'main',
    },
    {
      name: 'services',
      title: 'Service IDs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Category IDs that this clinic offers',
      validation: (Rule: any) => Rule.required().min(1).error('Add at least one service ID'),
      group: 'main',
    },
    {
      name: 'detail',
      title: 'Practical information',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      fields: [
        {
          name: 'parking',
          title: 'Parking',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Parking'),
        },
        {
          name: 'publicTransport',
          title: 'Public transport',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Public transport'),
        },
        {
          name: 'accessibility',
          title: 'Accessibility',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Accessibility'),
        },
      ],
    },
    {
      name: 'booking',
      title: 'Booking',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      group: 'booking',
      fields: [
        {
          name: 'method',
          title: 'Method',
          type: 'string',
          options: {
            layout: 'radio',
            list: [
              { title: 'Show screen with contact info', value: 'info' },
              { title: 'Show PatientSky form', value: 'pasientsky' },
              { title: 'Show Metodika form', value: 'metodika' },
              { title: 'Closed for booking', value: 'closed' },
            ],
          },
          initialValue: 'info',
          validation: reqStr('Method'),
        },
        {
          name: 'serviceProviderId',
          title: 'Service Provider Id',
          description: 'Patientsky Service Provider ID (only when Method = Patientsky)',
          type: 'string',
          validation: whenBookingMethod('pasientsky', (rule) =>
            rule.custom((value: string | undefined) =>
              value?.trim() ? true : 'PatientSky Service Provider ID is required',
            ),
          ),
        },
        {
          name: 'metodikaLocationId',
          title: 'Metodika location ID',
          description:
            'Metodika `location-id` for this clinic (only when Method = Metodika). Recommended for correct linking in booking step 2.',
          type: 'number',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'metodika',
        },
        {
          name: 'externalBookingUrl',
          title: 'External booking URL',
          type: 'url',
          description:
            'Only when Method = contact info and booking goes via external partner.',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'info',
        },
        {
          name: 'closedMessage',
          title: 'Message when closed',
          type: 'internationalizedArrayText',
          description: 'Only when Method = Closed for booking',
          validation: whenBookingMethod('closed', (rule) =>
            rule.custom((value: unknown) => {
              if (!pickNo(value)?.trim()) return 'Message when closed (Norwegian) is required'
              if (!pickForLang(value, 'en')?.trim()) return 'Message when closed (English) is required'
              return true
            }),
          ),
        },
      ],
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      group: 'extras',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faq' }],
        },
        {
          type: 'object',
          name: 'clinicFaq',
          title: 'FAQ',
          fields: [
            { name: 'question', title: 'Question', type: 'internationalizedArrayString', validation: requiredNoEnI18n('Question') },
            { name: 'answer', title: 'Answer', type: 'internationalizedArrayText', validation: requiredNoEnI18n('Answer') },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta title and meta description for the clinic profile page (NO/EN).',
      options: { collapsible: true, collapsed: false },
      validation: requiredNoEnSeo,
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
    pageSectionsFieldForGroup('extras'),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Name (A–Z)',
      name: 'titleAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'address', media: 'primaryImage' },
    prepare({ title, subtitle, media }: any) {
      return { title: pickNo(title) || 'Clinic', subtitle: subtitle || '', media }
    },
  },
}
