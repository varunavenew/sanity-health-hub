// Schema: FAQ
// Standalone FAQ documents, optionally linked to a category/page
import { FAQIcon } from './icons'
import { pickNo } from './i18n'

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: FAQIcon,
  fields: [
    {
      name: 'question',
      title: 'Spørsmål',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Svar',
      type: 'internationalizedArrayText',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Valgfri gruppering, f.eks. "tjenester", "generelt", "priser"',
      options: {
        list: [
          { title: 'Tjenester', value: 'tjenester' },
          { title: 'Generelt', value: 'generelt' },
          { title: 'Priser', value: 'priser' },
          { title: 'Urologi', value: 'urologi' },
          { title: 'Finansiering', value: 'finansiering' },
          { title: 'Praktisk', value: 'praktisk' },
        ],
      },
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
    prepare({ title, subtitle }: { title?: unknown; subtitle?: string }) {
      return {
        title: pickNo(title) || 'FAQ',
        subtitle,
      }
    },
  },
}
