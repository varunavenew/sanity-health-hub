// Schema: Careers listing page (Karriere)
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'

export default {
  name: 'careersPage',
  title: 'Karriere-side',
  type: 'document',
  icon: GenericIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title', {
      description: 'URL uten locale, f.eks. /karriere (NO) og /careers (EN).',
    }),
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      const t = Array.isArray(title)
        ? (title.find((x: any) => (x.language || x._key) === 'no')?.value || title[0]?.value)
        : title
      return { title: (t as string) || 'Karriere' }
    },
  },
}
