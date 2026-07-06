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

const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

/** Avoid Studio GroupSelect crashes: skip validation when booking method does not apply. */
function whenBookingMethod(method: string, validate: (rule: any) => any) {
  return (rule: any, context: { parent?: { method?: string }; hidden?: boolean }) => {
    if (context?.hidden || context?.parent?.method !== method) return rule.skip()
    return validate(rule)
  }
}

export default {
  name: 'clinicPage',
  title: 'Klinikk',
  type: 'document',
  icon: ClinicIcon,
  groups: [
    { name: 'main', title: 'Innhold', default: true },
    { name: 'booking', title: 'Booking' },
    { name: 'extras', title: 'FAQ & seksjoner' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Navn',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Navn'),
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
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      validation: reqStr('Hovedbilde'),
      group: 'main',
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Beskrivelse'),
      group: 'main',
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først i klinikkoversikten.',
      initialValue: 0,
      validation: (Rule: any) => Rule.integer().min(0).error('Må være 0 eller høyere'),
      group: 'main',
    },
    {
      name: 'valueProposition',
      title: 'Verdiforslag',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      fields: [
        { name: 'valueProposition1', title: 'Verdiforslag 1', type: 'internationalizedArrayString' },
        { name: 'valueProposition2', title: 'Åpningstider', type: 'string', placeholder: '08:00–16:00' },
        { name: 'socialProof', title: 'Sosialt bevis', type: 'internationalizedArrayString' },
      ],
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
      validation: reqStr('Adresse'),
      group: 'main',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: reqStr('Telefon'),
      group: 'main',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      validation: (Rule: any) => Rule.required().email().error('Gyldig e-post er påkrevd'),
      group: 'main',
    },
    {
      name: 'hours',
      title: 'Åpningstider',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Åpningstider'),
      group: 'main',
    },
    {
      name: 'contactDescription',
      title: 'Kontaktbeskrivelse',
      type: 'internationalizedArrayText',
      group: 'main',
    },
    {
      name: 'locationSearch',
      title: 'Koordinater',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      validation: (Rule: any) =>
        Rule.required().custom((value: { lat?: number; lng?: number } | undefined) => {
          if (value?.lat == null || value?.lng == null) {
            return 'Breddegrad og lengdegrad er påkrevd'
          }
          return true
        }),
      fields: [
        {
          name: 'lat',
          title: 'Breddegrad',
          type: 'number',
          validation: reqStr('Breddegrad'),
        },
        {
          name: 'lng',
          title: 'Lengdegrad',
          type: 'number',
          validation: reqStr('Lengdegrad'),
        },
      ],
    },
    {
      name: 'treatments',
      title: 'Behandlinger',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
      group: 'main',
    },
    {
      name: 'specialists',
      title: 'Spesialister',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
      group: 'main',
    },
    {
      name: 'services',
      title: 'Tjeneste-IDer',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Kategori-IDer som denne klinikken tilbyr',
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én tjeneste-ID'),
      group: 'main',
    },
    {
      name: 'detail',
      title: 'Praktisk informasjon',
      type: 'object',
      options: { collapsible: true },
      group: 'main',
      fields: [
        {
          name: 'parking',
          title: 'Parkering',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Parkering'),
        },
        {
          name: 'publicTransport',
          title: 'Kollektivtransport',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Kollektivtransport'),
        },
        {
          name: 'accessibility',
          title: 'Tilgjengelighet',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Tilgjengelighet'),
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
              { title: 'Show Pasientsky form', value: 'pasientsky' },
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
          description: 'Pasientsky Service Provider ID (kun når Method = Pasientsky)',
          type: 'string',
          validation: whenBookingMethod('pasientsky', (rule) =>
            rule.custom((value: string | undefined) =>
              value?.trim() ? true : 'Pasientsky Service Provider ID is required',
            ),
          ),
        },
        {
          name: 'metodikaLocationId',
          title: 'Metodika location ID',
          description:
            'Metodika `location-id` for denne klinikken (kun når Method = Metodika). Anbefales for korrekt kobling i booking steg 2.',
          type: 'number',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'metodika',
        },
        {
          name: 'externalBookingUrl',
          title: 'External booking URL',
          type: 'url',
          description:
            'Kun når Method = contact info og booking går via ekstern partner.',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'info',
        },
        {
          name: 'closedMessage',
          title: 'Message when closed',
          type: 'internationalizedArrayText',
          description: 'Kun når Method = Closed for booking',
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
            { name: 'question', title: 'Spørsmål', type: 'internationalizedArrayString', validation: requiredNoEnI18n('Spørsmål') },
            { name: 'answer', title: 'Svar', type: 'internationalizedArrayText', validation: requiredNoEnI18n('Svar') },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel og meta-beskrivelse for klinikkens profilside (NO/EN).',
      options: { collapsible: true, collapsed: false },
      validation: requiredNoEnSeo,
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
    pageSectionsFieldForGroup('extras'),
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Navn (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'address', media: 'primaryImage' },
    prepare({ title, subtitle, media }: any) {
      return { title: pickNo(title) || 'Klinikk', subtitle: subtitle || '', media }
    },
  },
}
