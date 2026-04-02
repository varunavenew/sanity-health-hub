import {defineField, defineType} from 'sanity'
import { ArticleIcon } from './icons'

export default defineType({
  name: 'article',
  title: 'Artikkel / Side',
  type: 'document',
  icon: ArticleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Prisliste', value: 'prisliste'},
          {title: 'Fagartikkel', value: 'fagartikkel'},
          {title: 'Nyheter', value: 'nyheter'},
          {title: 'Stillingsutlysning', value: 'stillingsutlysning'},
        ],
      },
    }),
    defineField({
      name: 'pinned',
      title: 'Festet (fremhevet øverst)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
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
      media: 'primaryImage',
      category: 'category',
    },
    prepare({title, media, category}) {
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },
})
