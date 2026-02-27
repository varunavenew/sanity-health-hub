// Schema: Contact Page (Kontakt)

export default {
  name: 'contactPage',
  title: 'Kontakt',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'text',
      rows: 3,
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
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        { name: 'street', title: 'Gateadresse', type: 'string' },
        { name: 'city', title: 'By', type: 'string' },
        { name: 'zip', title: 'Postnummer', type: 'string' },
      ],
    },
    {
      name: 'openingHours',
      title: 'Åpningstider',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', title: 'Dager', type: 'string' },
            { name: 'hours', title: 'Timer', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'mapLocation',
      title: 'Kartposisjon',
      type: 'geopoint',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
