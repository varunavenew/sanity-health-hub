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
      title: 'Produktnavn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    i18nSlugFieldFromString('name'),
    defineField({
      name: 'category',
      title: 'Kategori',
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
      title: 'Pris',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Vurdering',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Merkelapper',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'intent',
      title: 'Bruksområde',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'results',
      title: 'Resultater',
      type: 'text',
    }),
    defineField({
      name: 'howItWorks',
      title: 'Slik fungerer det',
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
      title: 'Sesong visningsrekkefølge',
      type: 'number',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number'
    }),
  ],
  orderings: [
    {
      title: 'Publisert rekkefølge (manuell → A–Å)',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Sesongrekkefølge',
      name: 'seasonalOrderAsc',
      by: [
        {field: 'seasonalOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Navn (A–Å)',
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
