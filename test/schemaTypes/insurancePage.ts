// Schema: Insurance Page (Forsikring)

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
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    },
    {
      name: 'insurancePartners',
      title: 'Forsikringspartnere',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Navn', type: 'string' },
            { name: 'logo', title: 'Logo', type: 'image' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
            { name: 'website', title: 'Nettside', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'faqs',
      title: 'Vanlige spørsmål',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'string' },
            { name: 'answer', title: 'Svar', type: 'text', rows: 3 },
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
