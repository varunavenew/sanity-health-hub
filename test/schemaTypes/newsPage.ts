import {defineField, defineType} from 'sanity'
import {i18nSlugFieldFromTitle} from './i18n'

export default defineType({
  name: 'newsPage',
  title: 'Aktuelt-side',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Liten etikett over hovedtittel (f.eks. "Nyheter & Fagartikler")',
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    i18nSlugFieldFromTitle('title'),
    defineField({
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Søk-placeholder',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'moreArticlesTitle',
      title: 'Tittel: Flere artikler',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'noArticlesText',
      title: 'Tekst: Ingen artikler',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'readMoreLabel',
      title: 'Lenketekst: Les mer',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'specialistsEyebrowAll',
      title: 'Spesialister-eyebrow (alle)',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Møt teamet"',
    }),
    defineField({
      name: 'specialistsEyebrowWithin',
      title: 'Spesialister-eyebrow (innen kategori)',
      type: 'internationalizedArrayString',
      description: 'Bruk {{category}} som placeholder',
    }),
    defineField({
      name: 'specialistsTitle',
      title: 'Spesialister-seksjon tittel',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'specialistsSeeAllLabel',
      title: 'Spesialister: Se alle',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'socialSectionTitle',
      title: 'SoMe-seksjon tittel',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'showSocialSection',
      title: 'Vis sosiale medier-seksjon',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'socialPosts',
      title: 'SoMe-innlegg',
      description: 'Bilder som vises i «Følg oss på sosiale medier»-seksjonen. Rekkefølgen her er visningsrekkefølgen.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'newsSocialPost',
          fields: [
            {
              name: 'imageUrl',
              title: 'Bilde-URL',
              type: 'url',
              description: 'Last opp bilde under Media og lim inn URL, eller bruk migreringsscript.',
              validation: (Rule: any) => Rule.required(),
            },
            { name: 'alt', title: 'Alt-tekst', type: 'string' },
            {
              name: 'platform',
              title: 'Plattform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                ],
                layout: 'radio',
              },
              initialValue: 'instagram',
            },
            { name: 'caption', title: 'Bildetekst', type: 'text', rows: 2 },
            { name: 'postUrl', title: 'Lenke', type: 'url' },
          ],
          preview: {
            select: { title: 'caption', subtitle: 'platform' },
            prepare({ title, subtitle }: any) {
              return {
                title: title?.trim() || 'SoMe-innlegg',
                subtitle: subtitle || 'instagram',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
      hidden: ({ parent }) => parent?.showSocialSection === false,
    }),
    defineField({
      name: 'socialPostLimit',
      title: 'Maks antall SoMe-innlegg',
      type: 'number',
      initialValue: 4,
      validation: (Rule) => Rule.min(1).max(12),
      hidden: ({ parent }) => parent?.showSocialSection === false,
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Fremhevede artikler (top 4)',
      description: 'Vises øverst på Aktuelt-siden (når filter = Alle).',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'filterAllLabel',
      title: 'Filter: Alle',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'filterPatientStoriesLabel',
      title: 'Filter: Pasienthistorier',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'filterMediaLabel',
      title: 'Filter: Oss i media',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'filterArticlesLabel',
      title: 'Filter: Fagartikler',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'filterUpdatesLabel',
      title: 'Filter: Nytt fra oss',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      const titleValue = Array.isArray(title)
        ? title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value
        : title
      return {
        title: titleValue || 'Aktuelt-side',
      }
    },
  },
})
