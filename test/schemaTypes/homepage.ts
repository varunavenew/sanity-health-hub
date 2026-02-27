// Schema: Homepage
// Sanity document type for the main landing page

export default {
  name: 'homepage',
  title: 'Forside',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    // Hero Banner
    {
      name: 'heroBanner',
      title: 'Hero Banner',
      type: 'object',
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
    },
    // Service Categories (Fagområder)
    {
      name: 'serviceCategories',
      title: 'Fagområder',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    // Value Badges
    {
      name: 'valueBadges',
      title: 'Verdibadges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Ikon', type: 'string', description: 'Lucide icon name' },
            { name: 'label', title: 'Tekst', type: 'string' },
          ],
        },
      ],
    },
    // Promo Blocks
    {
      name: 'promoBlocks',
      title: 'Promosjonsblokker',
      type: 'array',
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
        },
      ],
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
