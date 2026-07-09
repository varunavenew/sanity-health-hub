// Schema: Theme Page
// Reusable schema for thematic focus area pages
import { ThemeIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

export default {
  name: 'themePage',
  title: 'Homepage Carousel',
  type: 'document',
  icon: ThemeIcon,
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introTexts',
      title: 'Intro texts',
      type: 'array',
      of: [{ type: 'internationalizedArrayText' }],
    },
    {
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'internationalizedArrayString' },
            {
              name: 'paragraphs',
              title: 'Paragraph',
              type: 'array',
              of: [{ type: 'internationalizedArrayText' }],
            },
            {
              name: 'bulletPoints',
              title: 'Bullet list (optional)',
              type: 'array',
              of: [{ type: 'internationalizedArrayString' }],
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title) }
            },
          },
        },
      ],
    },
    {
      name: 'lifePhases',
      title: 'Livsfaser',
      description: 'Used on the Women\'s Health page to show different life phases',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Phase title', type: 'internationalizedArrayString' },
            { name: 'text', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title) }
            },
          },
        },
      ],
    },
    {
      name: 'ctaText',
      title: 'CTA-knappetekst',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaLink',
      title: 'CTA link',
      type: 'string',
      initialValue: '/booking',
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
    select: {
      title: 'title',
      media: 'heroImage',
    },
    prepare({ title, media }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Temaside')
        : (title || 'Temaside')
      return { title: titleStr, media }
    },
  },
}
