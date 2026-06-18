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
      name: 'socialDisplayMode',
      title: 'SoMe-innlegg: visning',
      type: 'string',
      options: {
        list: [
          { title: 'Nyeste publiserte', value: 'latest' },
          { title: 'Velg manuelt', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
      hidden: ({ parent }) => parent?.showSocialSection === false,
    }),
    defineField({
      name: 'socialPosts',
      title: 'SoMe-innlegg (manuelt valg)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'socialPost' }] }],
      description: 'Velg rekkefølge. Brukes når visning er «Velg manuelt».',
      hidden: ({ parent }) =>
        parent?.showSocialSection === false || parent?.socialDisplayMode !== 'manual',
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
