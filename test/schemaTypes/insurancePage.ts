// Schema: Insurance Page (Forsikring)
// Aligned with migration data structure

export default {
  name: 'insurancePage',
  title: 'Forsikring',
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
      name: 'partners',
      title: 'Forsikringspartnere',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'steps',
      title: 'Steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
}
