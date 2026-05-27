// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader
import { CategoryIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'
import { pageSectionsField } from './pageSections'

export default {
  name: 'treatmentCategory',
  title: 'Behandlingskategori',
  type: 'document',
  icon: CategoryIcon,
  fields: [
    {
      name: 'title',
      title: 'Kategorinavn',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
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
      type: 'internationalizedArrayText',
    },
    {
      name: 'longDescription',
      title: 'Utvidet beskrivelse',
      type: 'internationalizedArrayBlockContent',
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
    {
      name: 'stats',
      title: 'Statistikk',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'internationalizedArrayString' },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først. La stå tom for alfabetisk.',
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        // title is internationalizedArray — sort by slug (derived from Kategorinavn)
        { field: 'categoryId', direction: 'asc' },
      ],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'categoryId', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'categoryId', media: 'heroImage' },
    prepare({ title, subtitle, media }: any) {
      return { title: pickNo(title) || 'Kategori', subtitle: subtitle || '', media }
    },
  },
}
