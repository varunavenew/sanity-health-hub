import {defineField, defineType} from 'sanity'
import { ArticleIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import {pickStudioEn} from './studioPreview'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'
import {ARTICLE_CATEGORY_OPTIONS} from './articleCategories'

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
      title: 'Main image',
      type: 'image',
      options: mediaImageOptions('article'),
      description: mediaDescription('article'),
      validation: softImageRules('article'),
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
      title: 'Excerpt',
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
      description:
        'Shown on the article page and used for News page filters. Values match the four Aktuelt chips.',
      options: {
        list: [...ARTICLE_CATEGORY_OPTIONS],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
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
        Pasienthistorier: 'Pasienthistorier',
        'Oss i media': 'Oss i media',
        Fagartikler: 'Fagartikler',
        'Nytt fra oss': 'Nytt fra oss',
        fagartikkel: 'Fagartikler',
        Fagartiklar: 'Fagartikler',
        news: 'Nytt fra oss',
        nyheter: 'Nytt fra oss',
        Nyheter: 'Nytt fra oss',
        prisliste: 'Price list',
        stillingsutlysning: 'Job posting',
      }
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-GB') : 'No date'
      const cat = categoryLabels[category] || category || 'No category'
      const titleStr = pickStudioEn(title) || 'Untitled'
      return {
        title: titleStr,
        subtitle: `${cat} · ${date}`,
        media,
      }
    },
  },
})
