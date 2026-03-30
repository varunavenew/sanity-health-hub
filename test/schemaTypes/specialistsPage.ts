// Schema: Specialists List Page (Om våre spesialister)
import { SpecialistIcon } from './icons'

export default {
  name: 'specialistsPage',
  title: 'Spesialister-side',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Undertekst',
      type: 'text',
      rows: 3,
      description: 'Kort beskrivelse under hovedtittelen',
    },
    {
      name: 'heroImage',
      title: 'Heltebilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
      description: 'Hovedinnhold for "Om våre spesialister"-siden',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
