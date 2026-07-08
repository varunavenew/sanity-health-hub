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
  title: 'News page',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Small label above the main title (e.g. "News & Articles")',
      validation: requiredNoEnI18n('Label'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Title'),
    }),
    {
      ...i18nSlugFieldFromTitle('title'),
      validation: requiredNoEnSlug(),
    },
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Subtitle'),
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search placeholder',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Search placeholder'),
    }),
    defineField({
      name: 'moreArticlesTitle',
      title: 'Title: More articles',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Title: More articles'),
    }),
    defineField({
      name: 'noArticlesText',
      title: 'Text: No articles',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Text: No articles'),
    }),
    defineField({
      name: 'readMoreLabel',
      title: 'Lenketekst: Les mer',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Lenketekst: Les mer'),
    }),
    defineField({
      name: 'specialistsEyebrowAll',
      title: 'Specialists-eyebrow (all)',
      type: 'internationalizedArrayString',
      description: 'E.g. "Meet the team"',
      validation: requiredNoEnI18n('Specialists-eyebrow (all)'),
    }),
    defineField({
      name: 'specialistsEyebrowWithin',
      title: 'Specialists-eyebrow (within category)',
      type: 'internationalizedArrayString',
      description: 'Use {{category}} as placeholder',
      validation: requiredNoEnI18n('Specialists-eyebrow (within category)'),
    }),
    defineField({
      name: 'specialistsTitle',
      title: 'Specialists section title',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Specialists section title'),
    }),
    defineField({
      name: 'specialistsSeeAllLabel',
      title: 'Specialists: See all',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Specialists: See all'),
    }),
    defineField({
      name: 'socialSectionTitle',
      title: 'Social media section title',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Social media section title'),
    }),
    defineField({
      name: 'breadcrumbHomeLabel',
      title: 'Breadcrumb – home',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Breadcrumb – home'),
    }),
    defineField({
      name: 'socialMode',
      title: 'Source for social posts',
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
      description: 'Images displayed in the \'Follow us on social media\' section. The order here is the display order.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'newsSocialPost',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'imageUrl',
              title: 'Image URL (legacy)',
              type: 'url',
              description: 'Only for legacy posts — use the image field above.',
              hidden: true,
            },
            { name: 'alt', title: 'Alt text', type: 'string' },
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
            { name: 'caption', title: 'Caption', type: 'text', rows: 2 },
            { name: 'postUrl', title: 'Link', type: 'url' },
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
            return 'Select at least one Sanity post when the source is Sanity.'
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
            return 'Number of social media posts is required.'
          }
          return true
        }),
      hidden: ({ parent }) => parent?.socialMode === 'hidden',
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Fremhevede artikler (top 4)',
      description: 'Displayed at the top of the News page (when filter = All).',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'filters',
      title: 'Artikkelfiltre',
      description: 'First filter should be \'All\' and have an empty category list.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'newsFilter',
        fields: [
          {
            name: 'key',
            title: 'Stable key',
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
        title: titleValue || 'News page',
      }
    },
  },
})
