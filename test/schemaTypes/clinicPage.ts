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

const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

export default {
  name: 'clinicPage',
  title: 'Klinikk',
  type: 'document',
  icon: ClinicIcon,
  groups: [
    { name: 'overview', title: 'Oversikt', default: true },
    { name: 'contact', title: 'Kontakt & adresse' },
    { name: 'practical', title: 'Praktisk info' },
    { name: 'related', title: 'Behandlinger & spesialister' },
    { name: 'booking', title: 'Booking' },
    { name: 'faq', title: 'FAQ' },
    { name: 'pageBuilder', title: 'Modulære seksjoner' },
    { name: 'seo', title: 'SEO & meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Navn',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Navn'),
      group: 'overview',
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        title: 'Slug',
        group: 'overview',
      }),
    },
    {
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      validation: reqStr('Hovedbilde'),
      group: 'overview',
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Beskrivelse'),
      group: 'overview',
    },
    {
      name: 'valueProposition',
      title: 'Verdiforslag',
      type: 'object',
      options: { collapsible: true },
      group: 'overview',
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
      group: 'contact',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      validation: reqStr('Telefon'),
      group: 'contact',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      validation: (Rule: any) => Rule.required().email().error('Gyldig e-post er påkrevd'),
      group: 'contact',
    },
    {
      name: 'hours',
      title: 'Åpningstider',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Åpningstider'),
      group: 'contact',
    },
    {
      name: 'contactDescription',
      title: 'Kontaktbeskrivelse',
      type: 'internationalizedArrayText',
      group: 'contact',
    },
    {
      name: 'locationSearch',
      title: 'Koordinater',
      type: 'object',
      options: { collapsible: true },
      group: 'contact',
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
      group: 'related',
    },
    {
      name: 'specialists',
      title: 'Spesialister',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
      group: 'related',
    },
    {
      name: 'services',
      title: 'Tjeneste-IDer',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Kategori-IDer som denne klinikken tilbyr',
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én tjeneste-ID'),
      group: 'related',
    },
    {
      name: 'booking',
      title: 'Booking',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      group: 'booking',
      validation: reqStr('Booking'),
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
          description: 'Pasientsky Service Provider ID',
          type: 'string',
          hidden: ({ parent }: any) => parent?.method !== 'pasientsky',
          validation: (Rule: any) =>
            Rule.custom((value: string | undefined, context: { parent?: { method?: string } }) => {
              if (context.parent?.method === 'pasientsky' && !value?.trim()) {
                return 'Pasientsky Service Provider ID is required'
              }
              return true
            }),
        },
        {
          name: 'externalBookingUrl',
          title: 'External booking URL',
          type: 'url',
          description: 'Used with "Show screen with contact info" when booking is via an external partner.',
          hidden: ({ parent }: any) => parent?.method !== 'info',
        },
        {
          name: 'closedMessage',
          title: 'Message when closed',
          type: 'internationalizedArrayText',
          hidden: ({ parent }: any) => parent?.method !== 'closed',
          validation: (Rule: any) =>
            Rule.custom((value: unknown, context: { parent?: { method?: string } }) => {
              if (context.parent?.method !== 'closed') return true
              if (!pickNo(value)?.trim()) return 'Message when closed (Norwegian) is required'
              if (!pickForLang(value, 'en')?.trim()) return 'Message when closed (English) is required'
              return true
            }),
        },
      ],
    },
    {
      name: 'detail',
      title: 'Praktisk informasjon',
      type: 'object',
      options: { collapsible: true },
      group: 'practical',
      validation: reqStr('Praktisk informasjon'),
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
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      group: 'faq',
      of: [
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
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først i klinikkoversikten.',
      validation: reqStr('Sorteringsrekkefølge'),
      group: 'overview',
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
    pageSectionsFieldForGroup('pageBuilder'),
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        // title is internationalizedArray — sort by slug (derived from Navn)
        { field: 'sortOrder', direction: 'asc' },
      ],
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
