// Schema: SEO object (reusable across all pages)

export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta-tittel',
      type: 'string',
      description: 'Maks 60 tegn',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'metaDescription',
      title: 'Meta-beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Maks 160 tegn',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'ogImage',
      title: 'OG-bilde (deling)',
      type: 'image',
    },
    {
      name: 'noIndex',
      title: 'Skjul fra søkemotorer',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
