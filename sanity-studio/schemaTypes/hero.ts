import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text'}),
    defineField({name: 'ctaText', title: 'CTA Button Text', type: 'string'}),
    defineField({name: 'ctaLink', title: 'CTA Link', type: 'string'}),
    defineField({name: 'image', title: 'Hero Image', type: 'image', options: {hotspot: true}}),
  ],
})
