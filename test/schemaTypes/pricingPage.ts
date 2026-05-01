// Schema: Pricing Page (Priser)
// Aligned with migration data: title, introText, priceCategories[], insuranceNote, seo
import { PricingIcon } from './icons'

export default {
  name: 'pricingPage',
  title: 'Priser',
  type: 'document',
  icon: PricingIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
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
      type: 'internationalizedArrayText',
    },
    {
      name: 'priceCategories',
      title: 'Priskategorier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'categoryName', title: 'Kategorinavn', type: 'internationalizedArrayString' },
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
                    { name: 'name', title: 'Behandling', type: 'internationalizedArrayString' },
                    { name: 'price', title: 'Pris (NOK)', type: 'number' },
                    { name: 'priceLabel', title: 'Prisvisning', type: 'internationalizedArrayString', description: 'F.eks. "fra 2500,-" eller "1500,- per time"' },
                    { name: 'note', title: 'Merknad', type: 'internationalizedArrayString' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      title: 'Tilbakemeldinger',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Velg tilbakemeldinger som skal vises på prissiden',
    },
    {
      name: 'insuranceNote',
      title: 'Forsikringsinformasjon',
      type: 'internationalizedArrayText',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Priser')
        : (title || 'Priser')
      return { title: titleStr }
    },
  },
}
