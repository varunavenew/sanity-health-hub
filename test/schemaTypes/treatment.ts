// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category

export default {
  name: 'treatment',
  title: 'Behandling',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Behandlingsnavn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'parentCategoryLabel',
      title: 'Overordnet kategori (visningsnavn)',
      type: 'string',
      description: 'F.eks. "Gynekologi" — vises som breadcrumb',
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Introduksjonstekst',
      type: 'text',
      rows: 6,
    },
    // Benefits
    {
      name: 'benefitsTitle',
      title: 'Fordeler-tittel',
      type: 'string',
      initialValue: 'Hvorfor velge oss',
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [{ type: 'string' }],
    },
    // Treatment Process
    {
      name: 'process',
      title: 'Behandlingsprosess',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Steg-tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    // FAQs
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
    select: {
      title: 'title',
      subtitle: 'parentCategoryLabel',
      media: 'heroImage',
    },
  },
}
