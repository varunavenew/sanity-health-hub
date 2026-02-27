// Schema: Google Review

export default {
  name: 'googleReview',
  title: 'Google-anmeldelse',
  type: 'document',
  fields: [
    {
      name: 'author',
      title: 'Forfatter',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Vurdering (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Anmeldelsestekst',
      type: 'text',
      rows: 3,
    },
    {
      name: 'date',
      title: 'Dato',
      type: 'date',
    },
    {
      name: 'avatar',
      title: 'Profilbilde',
      type: 'image',
    },
  ],
  preview: {
    select: { title: 'author', subtitle: 'rating' },
  },
}
