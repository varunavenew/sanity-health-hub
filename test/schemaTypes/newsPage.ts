import {defineField, defineType} from 'sanity'
import { geoSummaryField } from './geoSummary'
import {
  i18nSlugFieldFromTitle,
  requiredNoEnI18n,
  requiredNoEnSeo,
  requiredNoEnSlug,
} from './i18n'
import { pageSectionsField } from './pageSections'

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
      validation: requiredNoEnI18n('Label'),
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Tittel'),
    }),
    {
      ...i18nSlugFieldFromTitle('title'),
      validation: requiredNoEnSlug(),
    },
    defineField({
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Undertittel'),
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Søk-placeholder',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Søk-placeholder'),
    }),
    defineField({
      name: 'moreArticlesTitle',
      title: 'Tittel: Flere artikler',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Tittel: Flere artikler'),
    }),
    defineField({
      name: 'noArticlesText',
      title: 'Tekst: Ingen artikler',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Tekst: Ingen artikler'),
    }),
    defineField({
      name: 'readMoreLabel',
      title: 'Lenketekst: Les mer',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Lenketekst: Les mer'),
    }),
    defineField({
      name: 'specialistsEyebrowAll',
      title: 'Spesialister-eyebrow (alle)',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Møt teamet"',
      validation: requiredNoEnI18n('Spesialister-eyebrow (alle)'),
    }),
    defineField({
      name: 'specialistsEyebrowWithin',
      title: 'Spesialister-eyebrow (innen kategori)',
      type: 'internationalizedArrayString',
      description: 'Bruk {{category}} som placeholder',
      validation: requiredNoEnI18n('Spesialister-eyebrow (innen kategori)'),
    }),
    defineField({
      name: 'specialistsTitle',
      title: 'Spesialister-seksjon tittel',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Spesialister-seksjon tittel'),
    }),
    defineField({
      name: 'specialistsSeeAllLabel',
      title: 'Spesialister: Se alle',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Spesialister: Se alle'),
    }),
    defineField({
      name: 'socialSectionTitle',
      title: 'SoMe-seksjon tittel',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('SoMe-seksjon tittel'),
    }),
    defineField({
      name: 'breadcrumbHomeLabel',
      title: 'Brødsmule – hjem',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Brødsmule – hjem'),
    }),
    defineField({
      name: 'socialMode',
      title: 'Kilde for sosiale innlegg',
      type: 'string',
      options: {
        list: [
          {title: 'Sanity-innlegg', value: 'cms'},
          {title: 'Instagram API', value: 'api'},
          {title: 'Lokale eksempelinnlegg', value: 'local'},
          {title: 'Skjul seksjonen', value: 'hidden'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
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
              name: 'image',
              title: 'Bilde',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'imageUrl',
              title: 'Bilde-URL (legacy)',
              type: 'url',
              description: 'Kun for eldre innlegg — bruk bildefeltet over.',
              hidden: true,
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
      validation: (Rule) =>
        Rule.max(12).custom((value: unknown, context: any) => {
          if (context.parent?.socialMode === 'cms' && (!Array.isArray(value) || value.length === 0)) {
            return 'Velg minst ett Sanity-innlegg når kilden er Sanity.'
          }
          return true
        }),
      hidden: ({ parent }) => parent?.socialMode !== 'cms',
    }),
    defineField({
      name: 'socialPostLimit',
      title: 'Maks antall SoMe-innlegg',
      type: 'number',
      validation: (Rule) =>
        Rule.integer().min(1).max(12).custom((value: unknown, context: any) => {
          if (context.parent?.socialMode !== 'hidden' && typeof value !== 'number') {
            return 'Antall SoMe-innlegg er påkrevd.'
          }
          return true
        }),
      hidden: ({ parent }) => parent?.socialMode === 'hidden',
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
      name: 'filters',
      title: 'Artikkelfiltre',
      description: 'Første filter bør være «Alle» og ha tom kategoriliste.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'newsFilter',
        fields: [
          {
            name: 'key',
            title: 'Stabil nøkkel',
            type: 'string',
            validation: (Rule: any) => Rule.required().regex(/^[a-z][a-zA-Z0-9_-]*$/),
          },
          {
            name: 'label',
            title: 'Visningsnavn',
            type: 'internationalizedArrayString',
            validation: requiredNoEnI18n('Filternavn'),
          },
          {
            name: 'acceptedArticleCategories',
            title: 'Godkjente artikkelkategorier',
            type: 'array',
            of: [{type: 'string'}],
            validation: (Rule: any) => Rule.unique(),
          },
        ],
        preview: {
          select: {title: 'label', subtitle: 'key'},
        },
      }],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'listSize',
      title: 'Antall artikler per innlasting',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(48),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: requiredNoEnSeo,
    }),
    defineField({ ...geoSummaryField }),
    defineField(pageSectionsField),
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
