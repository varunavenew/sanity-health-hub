// Schema: Theme Page (e.g. Kvinnehelse, Robotkirurgi, Tverrfaglige)
// Master template — `sections[]` is the new flexible layout; legacy fields
// (introTexts, sections-with-paragraphs, lifePhases, ctaText) remain for
// backward compatibility until migrated.
import { ThemeIcon } from './icons'
import { allowedSectionsForTheme } from './sections'

export default {
  name: 'themePage',
  title: 'Temasider',
  type: 'document',
  icon: ThemeIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {
        source: (doc: any) => {
          const t = (doc?.title || []).find((e: any) => (e.language || e._key) === 'no')?.value
          return t || ''
        },
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
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
      name: 'pageSections',
      title: 'Sideoppbygging (mastermal)',
      description:
        'Bygg siden av seksjoner. Slå av/på, sorter med dra-og-slipp, eller legg til nye fra biblioteket. Erstatter etter hvert "Introduksjonstekster", "Innholdsseksjoner" og "Livsfaser".',
      type: 'array',
      of: allowedSectionsForTheme.map((t) => ({ type: t })),
      options: { sortable: true },
    },
    {
      name: 'sections',
      title: 'Innholdsseksjoner (legacy)',
      description: 'Beholdes for bakoverkompatibilitet — bruk "Sideoppbygging" for nytt innhold.',
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
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
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
