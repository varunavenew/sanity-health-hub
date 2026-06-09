// Schema: Pricing Page (Priser)
// Aligned with migration data: title, introText, priceCategories[], insuranceNote, seo
import { PricingIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'

const pickNo = (v: any) =>
  Array.isArray(v)
    ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
    : (v || '')

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
    i18nSlugFieldFromTitle('title'),
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
                  preview: {
                    select: { title: 'name', subtitle: 'price', priceLabel: 'priceLabel' },
                    prepare({ title, subtitle, priceLabel }: any) {
                      const label = pickNo(priceLabel)
                      return {
                        title: pickNo(title) || 'Uten navn',
                        subtitle: label || (subtitle != null ? `${subtitle} kr` : ''),
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'categoryName' },
            prepare({ title }: any) {
              return { title: pickNo(title) || 'Uten navn' }
            },
          },
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
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      return { title: pickNo(title) || 'Priser' }
    },
  },
}
