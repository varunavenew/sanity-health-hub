// Schema: Homepage
// Sanity document type for the main landing page
import { HomeIcon } from './icons'

export default {
  name: 'homepage',
  title: 'Forside',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero & tagline', default: true },
    { name: 'sections', title: 'Seksjoner' },
    { name: 'seo', title: 'SEO & meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'hero',
    },
    // Hero Banner
    {
      name: 'heroBanner',
      title: 'Hero Banner',
      type: 'object',
      group: 'hero',
      fields: [
        {
          name: 'slides',
          title: 'Slides',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
                { name: 'heading', title: 'Overskrift', type: 'string' },
                { name: 'subheading', title: 'Undertekst', type: 'string' },
                { name: 'ctaText', title: 'CTA-tekst', type: 'string' },
                { name: 'ctaLink', title: 'CTA-lenke', type: 'string' },
              ],
              preview: {
                select: { title: 'heading', subtitle: 'subheading', media: 'image' },
              },
            },
          ],
        },
      ],
    },
    // Tagline
    {
      name: 'tagline',
      title: 'Tagline Banner',
      type: 'string',
      group: 'hero',
    },
    // Service Categories (Tjenester)
    {
      name: 'serviceCategories',
      title: 'Tjenester (kategorier)',
      description: 'Kategoriene som vises i tjeneste-griden på forsiden',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    // Stats Bar
    {
      name: 'statsBar',
      title: 'Statistikkbar',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'string' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    },
    // Value Badges
    {
      name: 'valueBadges',
      title: 'Verdibadges',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Ikon', type: 'string', description: 'Lucide icon name' },
            { name: 'label', title: 'Tekst', type: 'string' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'icon' },
          },
        },
      ],
    },
    // Promo Blocks
    {
      name: 'promoBlocks',
      title: 'Promosjonsblokker',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text' },
            { name: 'ctaText', title: 'CTA-tekst', type: 'string' },
            { name: 'ctaLink', title: 'CTA-lenke', type: 'string' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
          },
        },
      ],
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
