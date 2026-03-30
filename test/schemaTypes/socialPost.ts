// Schema: Social Media Post
import { SocialIcon } from './icons'

export default {
  name: 'socialPost',
  title: 'Sosiale medier-innlegg',
  type: 'document',
  icon: SocialIcon,
  fields: [
    {
      name: 'platform',
      title: 'Plattform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'YouTube', value: 'youtube' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Bildetekst',
      type: 'text',
      rows: 3,
    },
    {
      name: 'postUrl',
      title: 'Lenke til innlegg',
      type: 'url',
      description: 'Direkte lenke til det originale innlegget',
    },
    {
      name: 'date',
      title: 'Dato',
      type: 'date',
    },
    {
      name: 'likes',
      title: 'Antall likes',
      type: 'number',
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    { title: 'Sortering', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Dato', name: 'date', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'platform', media: 'image' },
    prepare: ({ title, subtitle, media }: any) => ({
      title: title ? (title.length > 50 ? title.slice(0, 50) + '…' : title) : 'Uten tekst',
      subtitle: subtitle?.charAt(0).toUpperCase() + subtitle?.slice(1),
      media,
    }),
  },
}
