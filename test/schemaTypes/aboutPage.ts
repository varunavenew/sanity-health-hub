// Schema: About Page (Om oss)
// Aligned with migration data: title, subtitle, body (blockContent), seo
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  icon: GenericIcon,
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroImageAlt',
      title: 'Hero image – alt text',
      type: 'internationalizedArrayString',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'values',
      title: 'Our values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'clinicsSection',
      title: 'Section — clinics',
      description:
        'Displayed on About us (and Contact). Empty clinic list = all published clinics.',
      type: 'object',
      fields: [
        {
          name: 'showSection',
          title: 'Vis seksjonen',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Heading',
          type: 'internationalizedArrayString',
          description: 'F.eks. «Våre klinikker»',
        },
        {
          name: 'clinics',
          title: 'Clinics (optional)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
          description:
            'Velg rekkefølge. La stå tom for å liste alle publiserte klinikker automatisk.',
        },
      ],
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    geoSummaryField,
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
    prepare({ title, media }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'About us')
        : (title || 'About us')
      return { title: titleStr, media }
    },
  },
}
