import {defineField, defineType} from 'sanity'
import { ArticleIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

export default defineType({
  name: 'article',
  title: 'Artikkel / Side',
  type: 'document',
  icon: ArticleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
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
          title: 'Alt-tekst',
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
      title: 'Innhold',
      type: 'internationalizedArrayBlockContent',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Fagartikkel', value: 'fagartikkel'},
          {title: 'Nytt fra oss', value: 'nyheter'},
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
      description: 'Påkrevd for publisering. Settes automatisk på nye artikler.',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) =>
        Rule.required().error('Publiseringsdato mangler — velg dato før du publiserer'),
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
      title: 'Publiseringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Publiseringsdato (eldste først)',
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
        nyheter: 'Nytt fra oss',
        prisliste: 'Prisliste',
        stillingsutlysning: 'Stillingsutlysning',
      }
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('nb-NO') : 'Ingen dato'
      const cat = categoryLabels[category] || category || 'Ingen kategori'
      // title is now an internationalizedArray — pull NO entry first, fallback to first
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Uten tittel')
        : (title || 'Uten tittel')
      return {
        title: titleStr,
        subtitle: `${cat} · ${date}`,
        media,
      }
    },
  },
})
