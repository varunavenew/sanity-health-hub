// Schema: Specialists List Page (Om våre spesialister)
import { SpecialistIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'

export default {
  name: 'specialistsPage',
  title: 'Spesialister-side',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'subtitle',
      title: 'Undertekst',
      type: 'internationalizedArrayText',
      description: 'Kort beskrivelse under hovedtittelen',
    },
    {
      name: 'heroImage',
      title: 'Heltebilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Innhold',
      type: 'internationalizedArrayBlockContent',
      description: 'Hovedinnhold for "Om våre spesialister"-siden',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel (metaTitle) og meta-beskrivelse (metaDescription) for /om-spesialister',
    },
    pageSectionsField,
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Spesialister')
        : (title || 'Spesialister')
      return { title: titleStr }
    },
  },
}
