// Schema: Site Settings
// Global settings like social media links, contact info, etc.

export default {
  name: 'siteSettings',
  title: 'Nettstedsinnstillinger',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nettstedsnavn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description: 'Kort adressetekst for footer (f.eks. "Oslo · Bekkestua · Moss · Moelv")',
    },
    {
      name: 'socialMedia',
      title: 'Sosiale medier',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'twitter',
          title: 'Twitter / X URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
