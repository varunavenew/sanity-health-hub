export default {
  name: 'privacyPolicyPage',
  title: 'Privacy Policy',
  type: 'document',
  icon: () => '🔒',
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    },
    {
      name: 'cookiebotKey',
      title: 'Cookiebot Key',
      type: 'string',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
