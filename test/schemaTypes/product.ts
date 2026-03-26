import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Tørr hud', value: 'tørr_hud'},
          {title: 'Fet hud', value: 'fet_hud'},
          {title: 'Anti-aging', value: 'anti_aging'},
          {title: 'Akne', value: 'akne'},
          {title: 'Universal', value: 'universal'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'intent',
      title: 'Intent',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'text',
    }),
    defineField({
      name: 'howItWorks',
      title: 'How It Works',
      type: 'text',
    }),
    defineField({
      name: 'isSeasonal',
      title: 'Seasonal Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seasonalOrder',
      title: 'Seasonal Display Order',
      type: 'number',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
