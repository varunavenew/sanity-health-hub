// Schema: Specialists List Page
import { SpecialistIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'specialistsPage',
  title: 'Specialists page',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero label',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'subtitle',
      title: 'Subheading',
      type: 'internationalizedArrayText',
      description: 'Short description under the main title',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
      description: 'Main content for "About our specialists" page',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta title (metaTitle) and meta description (metaDescription) for /about-specialists',
      validation: (Rule: any) => Rule.required(),
    },
    geoSummaryField,
    pageSectionsField,
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Specialists')
        : (title || 'Specialists')
      return { title: titleStr }
    },
  },
}
