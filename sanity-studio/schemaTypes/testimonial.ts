import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Patient Name', type: 'string'}),
    defineField({name: 'quote', title: 'Quote', type: 'text'}),
    defineField({name: 'rating', title: 'Rating', type: 'number', validation: (Rule) => Rule.min(1).max(5)}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
  ],
})
