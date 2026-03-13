import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article / Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'category',
      title: 'Category',
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
      title: 'Pinned (featured at top)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
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
