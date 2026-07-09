// Schema: FAQ
// Standalone FAQ documents, optionally linked to a category/page
import { FAQIcon } from './icons'
import { pickNo, requiredNoEnI18n } from './i18n'

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: FAQIcon,
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Question'),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Answer'),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional grouping, e.g. "services", "general", "pricing"',
      options: {
        list: [
          { title: 'Services', value: 'tjenester' },
          { title: 'General', value: 'generelt' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'Urology', value: 'urologi' },
          { title: 'Finansiering', value: 'finansiering' },
          { title: 'Practical', value: 'praktisk' },
        ],
      },
    },
    {
      name: 'relatedTreatmentCategory',
      title: 'Related treatment category',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      description: 'Link FAQ to a specific treatment category',
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Sorting order',
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
