import {defineField, defineType} from 'sanity'
import {NewsFilterCategoriesInput} from '../sanity/components/NewsFilterCategoriesInput'
import {geoSummaryField} from './geoSummary'
import {
  NEWS_FILTER_ALLOWED_STORED_CATEGORIES,
  businessTitlesFromStoredCategories,
} from './newsFilterCategories'
import {
  i18nSlugFieldFromTitle,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
  requiredNoEnSlug,
} from './i18n'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {newsPageEditorConfig} from '../sanity/page-editor/pages/newsSections'

const NEWS_SHARED_SECTIONS = ['pageSectionBookingCta'] as const

export default defineType({
  name: 'newsPage',
  title: 'News page',
  type: 'document',
  components: {
    input: createPageSectionDocumentInput(newsPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Small label above the main title (e.g. "News & Articles")',
      group: 'hero',
      validation: requiredNoEnI18n('Label'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: requiredNoEnI18n('Title'),
    }),
    {
      ...i18nSlugFieldFromTitle('title', {group: 'hero'}),
      validation: requiredNoEnSlug(),
    },
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayText',
      group: 'hero',
      validation: requiredNoEnI18n('Subtitle'),
    }),
    defineField({
      name: 'breadcrumbHomeLabel',
      title: 'Breadcrumb – home',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: requiredNoEnI18n('Breadcrumb – home'),
    }),

    defineField({
      name: 'searchPlaceholder',
      title: 'Search placeholder',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Search placeholder'),
    }),
    defineField({
      name: 'filters',
      title: 'Article filters',
      description:
        "Chip order on the News page. First filter must be All (key: all) with an empty category list. Other filters need at least one article category.",
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'newsFilter',
          fields: [
            {
              name: 'key',
              title: 'Stable key',
              type: 'string',
              description: 'Technical id used by the site (e.g. all, patientStories). Not shown to visitors.',
              validation: (Rule: any) =>
                Rule.required().regex(/^[a-z][a-zA-Z0-9_-]*$/),
            },
            {
              name: 'label',
              title: 'Display name',
              type: 'internationalizedArrayString',
              validation: requiredNoEnI18n('Filter name'),
            },
            {
              name: 'acceptedArticleCategories',
              title: 'Allowed article categories',
              description:
                'Leave empty only for All. Pick business categories only — legacy article.category aliases are stored automatically.',
              type: 'array',
              of: [{type: 'string'}],
              components: {
                input: NewsFilterCategoriesInput,
              },
              validation: (Rule: any) =>
                Rule.unique().custom((value: unknown, context: any) => {
                  const parent = context.parent as {
                    key?: string
                    acceptedArticleCategories?: unknown
                  }
                  const cats = Array.isArray(value)
                    ? value.filter((v): v is string => typeof v === 'string')
                    : []
                  const key = typeof parent?.key === 'string' ? parent.key.trim().toLowerCase() : ''
                  const isAll = key === 'all'

                  if (isAll && cats.length > 0) {
                    return 'The All filter must not have any categories.'
                  }
                  if (!isAll && cats.length === 0) {
                    return 'Select at least one article category (or set key to all for the All chip).'
                  }
                  const invalid = cats.filter(
                    (c) => !NEWS_FILTER_ALLOWED_STORED_CATEGORIES.has(c),
                  )
                  if (invalid.length) {
                    return `Unknown categor${invalid.length === 1 ? 'y' : 'ies'}: ${invalid.join(', ')}`
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              label: 'label',
              key: 'key',
              cats: 'acceptedArticleCategories',
            },
            prepare({
              label,
              key,
              cats,
            }: {
              label?: unknown
              key?: string
              cats?: unknown
            }) {
              const title = pickNo(label)?.trim() || key || 'Filter'
              const businessTitles = businessTitlesFromStoredCategories(cats)
              const subtitle =
                key === 'all' || businessTitles.length === 0
                  ? 'All articles'
                  : businessTitles.join(', ')
              return {title, subtitle}
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((value: unknown) => {
            if (!Array.isArray(value) || value.length === 0) {
              return 'Add at least one filter (All first).'
            }

            const filters = value as Array<{
              key?: string
              acceptedArticleCategories?: unknown
            }>
            const first = filters[0]
            const firstKey =
              typeof first?.key === 'string' ? first.key.trim().toLowerCase() : ''
            const firstCats = Array.isArray(first?.acceptedArticleCategories)
              ? first.acceptedArticleCategories.filter(
                  (c): c is string => typeof c === 'string',
                )
              : []

            if (firstKey !== 'all') {
              return 'The first filter must use key "all".'
            }
            if (firstCats.length > 0) {
              return 'The first filter (All) must have an empty category list.'
            }

            const keys = filters
              .map((f) => (typeof f?.key === 'string' ? f.key.trim().toLowerCase() : ''))
              .filter(Boolean)
            if (new Set(keys).size !== keys.length) {
              return 'Filter keys must be unique.'
            }

            for (let i = 1; i < filters.length; i++) {
              const rawCats = filters[i]?.acceptedArticleCategories
              const cats = Array.isArray(rawCats)
                ? (rawCats as unknown[]).filter((c): c is string => typeof c === 'string')
                : []
              if (cats.length === 0) {
                return `Filter #${i + 1} needs at least one article category.`
              }
            }

            return true
          }),
    }),
    defineField({
      name: 'listSize',
      title: 'Articles per load',
      type: 'number',
      group: 'content',
      validation: (Rule) => Rule.required().integer().min(1).max(48),
    }),

    defineField({
      name: 'featuredArticles',
      title: 'Featured articles (top 4)',
      description: 'Displayed at the top of the News page (when filter = All).',
      type: 'array',
      group: 'content',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (Rule) => Rule.max(4),
    }),

    defineField({
      name: 'moreArticlesTitle',
      title: 'Title: More articles',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Title: More articles'),
    }),
    defineField({
      name: 'noArticlesText',
      title: 'Text: No articles',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Text: No articles'),
    }),
    defineField({
      name: 'readMoreLabel',
      title: 'Link text: Read more',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Link text: Read more'),
    }),

    defineField({
      name: 'specialistsEyebrowAll',
      title: 'Specialists-eyebrow (all)',
      type: 'internationalizedArrayString',
      description: 'E.g. "Meet the team"',
      group: 'content',
      validation: requiredNoEnI18n('Specialists-eyebrow (all)'),
    }),
    defineField({
      name: 'specialistsEyebrowWithin',
      title: 'Specialists-eyebrow (within category)',
      type: 'internationalizedArrayString',
      description: 'Use {{category}} as placeholder',
      group: 'content',
      validation: requiredNoEnI18n('Specialists-eyebrow (within category)'),
    }),
    defineField({
      name: 'specialistsTitle',
      title: 'Specialists section title',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Specialists section title'),
    }),
    defineField({
      name: 'specialistsSeeAllLabel',
      title: 'Specialists: See all',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Specialists: See all'),
    }),

    defineField({
      name: 'socialSectionTitle',
      title: 'Social media section title',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: requiredNoEnI18n('Social media section title'),
    }),
    defineField({
      name: 'socialMode',
      title: 'Source for social posts',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Sanity posts', value: 'cms'},
          {title: 'Instagram API', value: 'api'},
          {title: 'Hide section', value: 'hidden'},
        ],
        layout: 'radio',
      },
      validation: (Rule) =>
        Rule.required().custom((value: unknown) => {
          if (value === 'local') {
            return 'Local sample posts is no longer supported. Choose Sanity posts, Instagram API, or Hide section.'
          }
          if (value !== 'cms' && value !== 'api' && value !== 'hidden') {
            return 'Choose Sanity posts, Instagram API, or Hide section.'
          }
          return true
        }),
    }),
    defineField({
      name: 'socialPosts',
      title: 'Social media posts',
      description: "Images displayed in the 'Follow us on social media' section. The order here is the display order.",
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'newsSocialPost',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'imageUrl',
              title: 'Image URL (legacy)',
              type: 'url',
              description: 'Only for legacy posts — use the image field above.',
              hidden: true,
            },
            {name: 'alt', title: 'Alt text', type: 'string'},
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                ],
                layout: 'radio',
              },
              initialValue: 'instagram',
            },
            {name: 'caption', title: 'Caption', type: 'text', rows: 2},
            {name: 'postUrl', title: 'Link', type: 'url'},
          ],
          preview: {
            select: {title: 'caption', subtitle: 'platform'},
            prepare({title, subtitle}: {title?: string; subtitle?: string}) {
              return {
                title: title?.trim() || 'Social media post',
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
      hidden: ({parent}) => parent?.socialMode !== 'cms',
    }),
    defineField({
      name: 'socialPostLimit',
      title: 'Maximum number of social media posts',
      type: 'number',
      group: 'content',
      validation: (Rule) =>
        Rule.integer().min(1).max(12).custom((value: unknown, context: any) => {
          if (context.parent?.socialMode !== 'hidden' && typeof value !== 'number') {
            return 'Number of social media posts is required.'
          }
          return true
        }),
      hidden: ({parent}) => parent?.socialMode === 'hidden',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
      validation: requiredNoEnSeo,
    }),
    defineField({...geoSummaryField, ...seoFieldsetProps}),
    defineField(pageSectionsFieldForGroup('content', 'sharedSections', NEWS_SHARED_SECTIONS)),
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
