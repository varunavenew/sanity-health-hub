// Schema: Specialist (Spesialist)
import { SpecialistIcon } from './icons'

export default {
  name: 'specialist',
  title: 'Spesialist',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'photo',
      title: 'Profilbilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'role',
      title: 'Tittel/rolle',
      type: 'string',
      description: 'F.eks. "Gynekolog", "Urolog", "Ortoped"',
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'string',
      description: 'F.eks. "Robotkirurg", "Spesialist", "Kirurg"',
    },
    {
      name: 'specialties',
      title: 'Spesialområder',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'categories',
      title: 'Tilknyttede kategorier',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    {
      name: 'clinics',
      title: 'Klinikker',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
      description: 'Klinikker spesialisten jobber ved – velg fra eksisterende klinikkdokumenter.',
    },
    {
      name: 'bio',
      title: 'Biografi',
      type: 'blockContent',
    },
    {
      name: 'shortBio',
      title: 'Kort biografi',
      type: 'text',
      rows: 3,
    },
    {
      name: 'education',
      title: 'Utdanning',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'languages',
      title: 'Språk',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'bookingEnabled',
      title: 'Booking aktivert',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først. La stå tom for alfabetisk.',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Navn (A–Å)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Rolle → Navn',
      name: 'roleName',
      by: [
        { field: 'role', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo', booking: 'bookingEnabled' },
    prepare({ title, subtitle, media, booking }: any) {
      return {
        title: `${booking === false ? '🚫 ' : ''}${title}`,
        subtitle: subtitle || 'Ingen rolle',
        media,
      }
    },
  },
}
