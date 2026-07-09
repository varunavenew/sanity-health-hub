// Schema: Testimonial
import { ReviewIcon } from './icons'

export default {
  name: 'testimonial',
  title: 'Tilbakemelding',
  type: 'document',
  icon: ReviewIcon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'age',
      title: 'Age',
      type: 'number',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Sted',
      type: 'string',
    },
    {
      name: 'treatment',
      title: 'Treatment',
      type: 'string',
      options: {
        list: [
          { title: 'Gynecology', value: 'Gynecology' },
          { title: 'Urology', value: 'Urology' },
          { title: 'Fertility', value: 'Fertility' },
        ],
      },
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number'    },
  ],
  orderings: [
    {
      title: 'Published order (manual → A–Z)',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Rating (highest first)',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'treatment', rating: 'rating' },
    prepare({ title, subtitle, rating }: any) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(Math.max(0, 5 - (rating || 0)))
      return {
        title,
        subtitle: `${stars}  ${subtitle || ''}`.trim(),
      }
    },
  },
}
