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
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Undertekst',
      type: 'internationalizedArrayText',
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
      type: 'internationalizedArrayBlockContent',
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
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Spesialister')
        : (title || 'Spesialister')
      return { title: titleStr }
    },
  },
}
