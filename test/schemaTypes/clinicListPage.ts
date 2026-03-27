// Schema: Clinic List Page (singleton)
export default {
  name: 'clinicListPage',
  title: 'Klinikkoversikt',
  type: 'document',
  icon: () => '📋',
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      hidden: true,
    },
    {
      name: 'menuTitle',
      title: 'Menytittel',
      type: 'string',
      description: 'Tittel i menyer og lister',
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
          title: 'Verdiforslag 2',
          type: 'string',
        },
        {
          name: 'socialProof',
          title: 'Sosialt bevis',
          type: 'string',
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
