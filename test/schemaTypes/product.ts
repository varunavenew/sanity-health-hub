import {defineField, defineType} from 'sanity'
import { ProductIcon } from './icons'
import { i18nSlugFieldFromString } from './i18n'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: ProductIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    i18nSlugFieldFromString('name'),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Dry skin', value: 'dry_skin'},
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
      title: 'Area of use',
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
      title: 'How it works',
      type: 'text',
    }),
    defineField({
      name: 'isSeasonal',
      title: 'Sesongfremhevet',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seasonalOrder',
      title: 'Seasonal display order',
      type: 'number',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number'
    }),
  ],
  orderings: [
    {
      title: 'Published order (manual → A–Z)',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Seasonal order',
      name: 'seasonalOrderAsc',
      by: [
        {field: 'seasonalOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Name (A–Z)',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
      seasonal: 'isSeasonal',
    },
    prepare({title, subtitle, media, seasonal}) {
      return {
        title: `${seasonal ? '🌟 ' : ''}${title}`,
        subtitle,
        media,
      }
    },
  },
})
