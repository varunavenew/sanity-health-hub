// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader

export default {
  name: 'treatmentCategory',
  title: 'Behandlingskategori',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Kategorinavn',
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
      name: 'categoryId',
      title: 'Kategori-ID',
      type: 'string',
      description: 'Intern ID: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroVideo',
      title: 'Hero-video (valgfritt)',
      type: 'file',
      options: { accept: 'video/*' },
    },
    {
      name: 'description',
      title: 'Kort beskrivelse',
      type: 'text',
      rows: 3,
    },
    {
      name: 'longDescription',
      title: 'Utvidet beskrivelse',
      type: 'blockContent',
    },
    {
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      description: 'Lucide icon name (f.eks. Heart, Baby, Bone)',
    },
    {
      name: 'color',
      title: 'Farge',
      type: 'string',
      description: 'Accent-farge for kategorien (HSL-verdi)',
    },
    // Treatments within this category
    {
      name: 'treatments',
      title: 'Behandlinger',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
        },
      ],
    },
    // Stats
    {
      name: 'stats',
      title: 'Statistikk',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'string' },
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
