import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'doctor',
  title: 'Doctor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'specialty', title: 'Specialty', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text'}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
})
