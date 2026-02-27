// Schema: About Page (Om oss)
// Aligned with migration data: title, subtitle, body (blockContent), seo

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
      name: 'subtitle',
      title: 'Undertittel',
      type: 'string',
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
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
