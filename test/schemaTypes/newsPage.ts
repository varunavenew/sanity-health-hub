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
      title: 'Link text: Read more',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Link text: Read more'),
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
      name: 'socialPosts',
      title: 'Social media posts',
      description: "Images displayed in the 'Follow us on social media' section. The order here is the display order.",
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
                title: title?.trim() || 'Social media post',
                subtitle: subtitle || 'instagram',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),


    defineField({
      name: 'featuredArticles',
      title: 'Featured articles (top 4)',
      description: 'Displayed at the top of the News page (when filter = All).',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (Rule) => Rule.max(4),
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
