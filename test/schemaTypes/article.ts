import {defineField, defineType} from 'sanity'
import { ArticleIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

export default defineType({
  name: 'article',
  title: 'Article / Page',
  type: 'document',
  icon: ArticleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    i18nSlugFieldFromTitle('title'),
    defineField({
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fagartikkel', value: 'fagartikkel'},
          {title: 'News from us', value: 'news'},
          {title: 'Prisliste', value: 'prisliste'},
          {title: 'Stillingsutlysning', value: 'stillingsutlysning'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
      description: 'Required for publishing. Automatically set on new articles.',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) =>
        Rule.required().error('Publishing date is missing — select date before publishing'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({ ...geoSummaryField }),
    defineField(pageSectionsField),
  ],
  orderings: [
    {
      title: 'Publishing date (newest first)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Publishing date (oldest first)',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'primaryImage',
      category: 'category',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, category, publishedAt}) {
      const categoryLabels: Record<string, string> = {
        fagartikkel: 'Fagartikkel',
        nyheter: 'News from us',
        prisliste: 'Prisliste',
        stillingsutlysning: 'Stillingsutlysning',
      }
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('nb-NO') : 'Ingen dato'
      const cat = categoryLabels[category] || category || 'No category'
      // title is now an internationalizedArray — pull NO entry first, fallback to first
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Untitled')
        : (title || 'Untitled')
      return {
        title: titleStr,
        subtitle: `${cat} · ${date}`,
        media,
      }
    },
  },
})
