// Schema: Theme Page (e.g. Kvinnehelse, Robotkirurgi, Tverrfaglige)
// Reusable schema for thematic focus area pages
import { ThemeIcon } from './icons'

export default {
  name: 'themePage',
  title: 'Temasider',
  type: 'document',
  icon: ThemeIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
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
      of: [{ type: 'text', rows: 4 }],
    },
    {
      name: 'sections',
      title: 'Innholdsseksjoner',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Overskrift', type: 'string' },
            {
              name: 'paragraphs',
              title: 'Avsnitt',
              type: 'array',
              of: [{ type: 'text', rows: 4 }],
            },
            {
              name: 'bulletPoints',
              title: 'Punktliste (valgfritt)',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: { title: 'heading' },
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
            { name: 'title', title: 'Fasens tittel', type: 'string' },
            { name: 'text', title: 'Beskrivelse', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    },
    {
      name: 'ctaText',
      title: 'CTA-knappetekst',
      type: 'string',
      initialValue: 'Bestill time',
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
  },
}
