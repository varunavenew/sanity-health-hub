// Schema: Insurance Page (Forsikring)
// Aligned with migration data: title, introText, partners[], steps[], benefits[], seo
import { InsuranceIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

const pickNo = (v: any) =>
  Array.isArray(v)
    ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
    : (v || '')

const i18nItemPreview = {
  select: { title: 'title', subtitle: 'description' },
  prepare({ title, subtitle }: any) {
    return {
      title: pickNo(title) || 'Unnamed',
      subtitle: pickNo(subtitle) || undefined,
    }
  },
}

export default {
  name: 'insurancePage',
  title: 'Insurance',
  type: 'document',
  icon: InsuranceIcon,
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
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
    },
    {
      name: 'partners',
      title: 'Forsikringspartnere',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Name of insurance partners (do not translate)',
    },
    {
      name: 'partnersLocalized',
      title: 'Forsikringspartnere (oversatt)',
      type: 'array',
      description: 'Used for language-controlled partner names (NO/EN).',
      of: [
        {
          type: 'object',
          fields: [{ name: 'name', title: 'Name', type: 'internationalizedArrayString' }],
          preview: {
            select: { name: 'name' },
            prepare({name}: any) {
              return {title: pickNo(name) || 'Partner'}
            },
          },
        },
      ],
    },
    {
      name: 'steps',
      title: 'Steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: i18nItemPreview,
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: i18nItemPreview,
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
      return { title: pickNo(title) || 'Insurance', media }
    },
  },
}
