// Schema: Clinic Page
export default {
  name: 'clinicPage',
  title: 'Klinikk',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
    },
    {
      name: 'valueProposition',
      title: 'Verdiforslag',
      type: 'object',
      options: { collapsible: true },
      fields: [
        {
          name: 'valueProposition1',
          title: 'Verdiforslag 1',
          type: 'string',
        },
        {
          name: 'valueProposition2',
          title: 'Åpningstider',
          type: 'string',
          placeholder: '08:00–16:00',
        },
        {
          name: 'socialProof',
          title: 'Sosialt bevis',
          type: 'string',
        },
      ],
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
    },
    {
      name: 'hours',
      title: 'Åpningstider',
      type: 'string',
    },
    {
      name: 'contactDescription',
      title: 'Kontaktbeskrivelse',
      type: 'text',
      rows: 3,
    },
    {
      name: 'locationSearch',
      title: 'Koordinater',
      type: 'object',
      options: { collapsible: true },
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
    },
    {
      name: 'specialists',
      title: 'Spesialister',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
    },
    {
      name: 'services',
      title: 'Tjeneste-IDer',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Kategori-IDer som denne klinikken tilbyr',
    },
    {
      name: 'booking',
      title: 'Booking',
      type: 'object',
      options: { collapsible: true },
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
          type: 'text',
          rows: 2,
          hidden: ({ parent }: any) => parent?.method !== 'closed',
        },
      ],
    },
    {
      name: 'detail',
      title: 'Praktisk informasjon',
      type: 'object',
      options: { collapsible: true },
      fields: [
        { name: 'parking', title: 'Parkering', type: 'text', rows: 2 },
        { name: 'publicTransport', title: 'Kollektivtransport', type: 'text', rows: 2 },
        { name: 'accessibility', title: 'Tilgjengelighet', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'answer', title: 'Svar', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      options: { collapsible: true, collapsed: true },
    },
  ],
}
