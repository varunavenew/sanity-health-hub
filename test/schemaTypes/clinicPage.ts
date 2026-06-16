// Schema: Clinic Page
import { ClinicIcon } from './icons'
import { i18nFaqItemPreview, i18nSlugFieldFromTitle, pickNo } from './i18n'

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
    { name: 'seo', title: 'SEO & meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Navn',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
      group: 'overview',
    },
    { ...i18nSlugFieldFromTitle('title', { title: 'Slug', group: 'overview' }) },
    {
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      group: 'overview',
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'internationalizedArrayText',
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
      validation: (Rule: any) => Rule.required(),
      group: 'contact',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'hours',
      title: 'Åpningstider',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
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
      fields: [
        { name: 'lat', title: 'Breddegrad', type: 'number' },
        { name: 'lng', title: 'Lengdegrad', type: 'number' },
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
      group: 'related',
    },
    {
      name: 'booking',
      title: 'Booking',
      type: 'object',
      options: { collapsible: true },
      group: 'booking',
      fields: [
        {
          name: 'method',
          title: 'Bookingmetode',
          type: 'string',
          options: {
            layout: 'radio',
            list: [
              { title: 'Vis kontaktinfo', value: 'info' },
              { title: 'Pasientsky-skjema', value: 'pasientsky' },
              { title: 'Stengt for booking', value: 'closed' },
            ],
          },
          initialValue: 'info',
        },
        {
          name: 'serviceProviderId',
          title: 'Pasientsky Service Provider ID',
          type: 'string',
          hidden: ({ parent }: any) => parent?.method !== 'pasientsky',
        },
        {
          name: 'externalBookingUrl',
          title: 'Ekstern bookinglenke',
          type: 'url',
          hidden: ({ parent }: any) => parent?.method !== 'info',
        },
        {
          name: 'closedMessage',
          title: 'Melding når stengt',
          type: 'internationalizedArrayText',
          hidden: ({ parent }: any) => parent?.method !== 'closed',
        },
      ],
    },
    {
      name: 'detail',
      title: 'Praktisk informasjon',
      type: 'object',
      options: { collapsible: true },
      group: 'practical',
      fields: [
        { name: 'parking', title: 'Parkering', type: 'internationalizedArrayText' },
        { name: 'publicTransport', title: 'Kollektivtransport', type: 'internationalizedArrayText' },
        { name: 'accessibility', title: 'Tilgjengelighet', type: 'internationalizedArrayText' },
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
            { name: 'question', title: 'Spørsmål', type: 'internationalizedArrayString', validation: (Rule: any) => Rule.required() },
            { name: 'answer', title: 'Svar', type: 'internationalizedArrayText', validation: (Rule: any) => Rule.required() },
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
      group: 'overview',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel og meta-beskrivelse for klinikkens profilside (NO/EN).',
      options: { collapsible: true, collapsed: false },
      group: 'seo',
    },
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
