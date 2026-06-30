// Schema: Homepage
// Sanity document type for the main landing page
import { HomeIcon } from './icons'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'homepage',
  title: 'Hjemmeside',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero & tagline', default: true },
    { name: 'sections', title: 'Seksjoner' },
    { name: 'reviews', title: 'Pasientanmeldelser' },
    { name: 'seo', title: 'SEO & meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
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
                { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
                { name: 'subheading', title: 'Undertekst', type: 'internationalizedArrayString' },
                { name: 'ctaText', title: 'CTA-tekst', type: 'internationalizedArrayString' },
                {
                  name: 'ctaLink',
                  title: 'CTA-lenke',
                  type: 'internationalizedArrayString',
                  description:
                    'Intern sti uten locale. NO: f.eks. /gynekologi — EN: f.eks. /gynecology',
                },
              ],
              preview: {
                select: { title: 'heading', subtitle: 'subheading', media: 'image' },
                prepare({ title, subtitle, media }: any) {
                  const pick = (v: any) =>
                    Array.isArray(v)
                      ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                      : (v || '')
                  return { title: pick(title), subtitle: pick(subtitle), media }
                },
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
      type: 'internationalizedArrayString',
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
            { name: 'label', title: 'Etikett', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: title || '', subtitle: pick(subtitle) }
            },
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
            { name: 'label', title: 'Tekst', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'icon' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: subtitle || '' }
            },
          },
        },
      ],
    },
    {
      name: 'promoBlocksTitle',
      title: 'Overskrift – promoseksjon',
      description: 'Tittel over promoblokkene (f.eks. «Nyheter og artikler»)',
      type: 'internationalizedArrayString',
      group: 'sections',
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
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'CTA-tekst', type: 'internationalizedArrayString' },
            { name: 'ctaLink', title: 'CTA-lenke', type: 'string' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: pick(subtitle), media }
            },
          },
        },
      ],
    },
    {
      ...pageSectionsField,
      group: 'sections',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ-overskrift',
      description: 'Overskrift over FAQ-seksjonen (f.eks. «Ofte stilte spørsmål»)',
      type: 'internationalizedArrayString',
      group: 'sections',
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      description:
        'FAQ-elementer som vises på forsiden. Velg og sorter spørsmål fra FAQ-dokumenter i Sanity.',
      group: 'sections',
    },
    {
      name: 'reviewsSubheading',
      title: 'Anmeldelser – undertekst',
      description: 'F.eks. «Våre pasienter forteller»',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsHeading',
      title: 'Anmeldelser – overskrift',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsGoogleRating',
      title: 'Google gjennomsnittsvurdering',
      type: 'number',
      group: 'reviews',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.6,
    },
    {
      name: 'reviewsLegelistenRating',
      title: 'Legelisten gjennomsnittsvurdering',
      type: 'number',
      group: 'reviews',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.8,
    },
    {
      name: 'reviewsCtaTitle',
      title: 'Anmeldelser – CTA tittel',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsCtaSubtitle',
      title: 'Anmeldelser – CTA undertekst',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'googleReviews',
      title: 'Google-anmeldelser på forsiden',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description: 'Velg og sorter anmeldelser som vises i karusellen på forsiden.',
      group: 'reviews',
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Hjemmeside')
        : (title || 'Hjemmeside')
      return { title: titleStr }
    },
  },
}
