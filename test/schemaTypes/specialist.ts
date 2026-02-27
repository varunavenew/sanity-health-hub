// Schema: Specialist (Spesialist)

export default {
  name: 'specialist',
  title: 'Spesialist',
  type: 'document',
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
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
}
