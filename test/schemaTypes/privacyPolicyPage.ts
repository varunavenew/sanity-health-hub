import { PrivacyIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'privacyPolicyPage',
  title: 'Privacy Policy',
  type: 'document',
  icon: PrivacyIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title', { title: 'Slug' }),
    {
      name: 'body',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'loadingLabel',
      title: 'Loading Text',
      type: 'internationalizedArrayString',
      description: 'Displayed while the privacy policy is loading.',
    },
    {
      name: 'emptyMessage',
      title: 'Message when content is missing',
      type: 'internationalizedArrayText',
      description: 'Displayed when the privacy policy has no content in the selected language.',
    },
    {
      name: 'cookiebotKey',
      title: 'Cookiebot Key',
      type: 'string',
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    geoSummaryField,
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = pickNo(title) || 'Privacy Policy'
      return { title: titleStr }
    },
  },
}
