import { GenericIcon } from './icons'

export default {
  name: 'socialPost',
  title: 'Sosiale medier-innlegg',
  type: 'document',
  icon: GenericIcon,
  fields: [
    {
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Kort beskrivelse for tilgjengelighet',
    },
    {
      name: 'platform',
      title: 'Plattform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'YouTube', value: 'youtube' },
        ],
        layout: 'radio',
      },
      initialValue: 'instagram',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Bildetekst',
      type: 'text',
      rows: 3,
      description: 'Vises ved hover (valgfritt)',
    },
    {
      name: 'postUrl',
      title: 'Lenke til innlegg',
      type: 'url',
      description: 'F.eks. direktelenke til Instagram-innlegget',
    },
    {
      name: 'sortOrder',
      title: 'Sortering',
      type: 'number',
      description: 'Lavere tall vises først',
      initialValue: 0,
    },
    {
      name: 'published',
      title: 'Publisert',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Sortering',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      caption: 'caption',
      platform: 'platform',
      media: 'image',
      sortOrder: 'sortOrder',
    },
    prepare({ caption, platform, media, sortOrder }: any) {
      return {
        title: caption?.trim() || 'Sosialt innlegg',
        subtitle: [platform, typeof sortOrder === 'number' ? `#${sortOrder}` : null]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
}
