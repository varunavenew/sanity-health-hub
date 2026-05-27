// Schema: Services Page (Tjenester)
// Aligned with migration data: title, introText, categories (references), seo
import { TreatmentIcon } from './icons'
import { pageSectionsField } from './pageSections'

export default {
  name: 'servicesPage',
  title: 'Tjenester',
  type: 'document',
  icon: TreatmentIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
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
      type: 'internationalizedArrayText',
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
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Tjenester')
        : (title || 'Tjenester')
      return { title: titleStr }
    },
  },
}
