// Schema: FAQ
// Standalone FAQ documents, optionally linked to a category/page

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Svar',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Valgfri gruppering, f.eks. "generelt", "gynekologi", "urologi"',
    },
    {
      name: 'relatedTreatmentCategory',
      title: 'Relatert behandlingskategori',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      description: 'Koble FAQ til en spesifikk behandlingskategori',
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Sorteringsrekkefølge',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
}
