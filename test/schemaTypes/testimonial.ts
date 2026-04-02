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
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'age',
      title: 'Alder',
      type: 'number',
    },
    {
      name: 'rating',
      title: 'Vurdering (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Tekst',
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
      title: 'Behandling',
      type: 'string',
      options: {
        list: [
          { title: 'Gynekologi', value: 'Gynekologi' },
          { title: 'Urologi', value: 'Urologi' },
          { title: 'Fertilitet', value: 'Fertilitet' },
        ],
      },
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'treatment' },
  },
}
