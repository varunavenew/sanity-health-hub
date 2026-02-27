// Schema: Services Page (Tjenester)

export default {
  name: 'servicesPage',
  title: 'Tjenester',
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
      name: 'categories',
      title: 'Tjenestekategorier',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
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
    select: { title: 'title' },
  },
}
