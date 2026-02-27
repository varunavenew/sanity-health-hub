// Schema: About Page (Om oss)

export default {
  name: 'aboutPage',
  title: 'Om oss',
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
      name: 'heroSubtitle',
      title: 'Hero-undertekst',
      type: 'text',
      rows: 2,
    },
    {
      name: 'mission',
      title: 'Vår misjon',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Overskrift', type: 'string' },
        { name: 'body', title: 'Tekst', type: 'blockContent' },
      ],
    },
    {
      name: 'values',
      title: 'Våre verdier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Ikon', type: 'string' },
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'history',
      title: 'Vår historie',
      type: 'blockContent',
    },
    {
      name: 'clinicImages',
      title: 'Klinikkbilder',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Bildetekst', type: 'string' },
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
