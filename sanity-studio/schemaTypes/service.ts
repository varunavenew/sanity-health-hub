import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'icon', title: 'Icon Name', type: 'string', description: 'Lucide icon name (e.g. Stethoscope, Heart, Baby, Bone, Sparkles, Brain)'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
})
