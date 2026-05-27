import { PrivacyIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'

export default {
  name: 'privacyPolicyPage',
  title: 'Privacy Policy',
  type: 'document',
  icon: PrivacyIcon,
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title', { title: 'Slug' }),
    {
      name: 'body',
      title: 'Innhold',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'cookiebotKey',
      title: 'Cookiebot Key',
      type: 'string',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = pickNo(title) || 'Privacy Policy'
      return { title: titleStr }
    },
  },
}
