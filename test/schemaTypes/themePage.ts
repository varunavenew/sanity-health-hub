// Schema: Theme Page (e.g. Kvinnehelse, Robotkirurgi, Tverrfaglige)
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
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introTexts',
      title: 'Introduksjonstekster',
      type: 'array',
      of: [{ type: 'internationalizedArrayText' }],
    },
    {
      name: 'sections',
      title: 'Innholdsseksjoner',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
            {
              name: 'paragraphs',
              title: 'Avsnitt',
              type: 'array',
              of: [{ type: 'internationalizedArrayText' }],
            },
            {
              name: 'bulletPoints',
              title: 'Punktliste (valgfritt)',
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
      description: 'Brukes på Kvinnehelse-siden for å vise ulike livsfaser',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Fasens tittel', type: 'internationalizedArrayString' },
            { name: 'text', title: 'Beskrivelse', type: 'internationalizedArrayText' },
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
      title: 'CTA-lenke',
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
