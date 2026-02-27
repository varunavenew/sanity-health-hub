// Schema: Pricing Page (Priser)

export default {
  name: 'pricingPage',
  title: 'Priser',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'text',
      rows: 3,
    },
    {
      name: 'priceCategories',
      title: 'Priskategorier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'categoryName', title: 'Kategorinavn', type: 'string' },
            {
              name: 'category',
              title: 'Behandlingskategori',
              type: 'reference',
              to: [{ type: 'treatmentCategory' }],
            },
            {
              name: 'items',
              title: 'Prislinjer',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Behandling', type: 'string' },
                    { name: 'price', title: 'Pris (NOK)', type: 'number' },
                    { name: 'priceLabel', title: 'Prisvisning', type: 'string', description: 'F.eks. "fra 2500,-" eller "1500,- per time"' },
                    { name: 'note', title: 'Merknad', type: 'string' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'insuranceNote',
      title: 'Forsikringsinformasjon',
      type: 'text',
      rows: 3,
    },
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
