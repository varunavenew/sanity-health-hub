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
      name: 'loadingLabel',
      title: 'Laster-tekst',
      type: 'internationalizedArrayString',
      description: 'Vises mens personvernerklæringen lastes.',
    },
    {
      name: 'emptyMessage',
      title: 'Melding når innhold mangler',
      type: 'internationalizedArrayText',
      description: 'Vises når personvernerklæringen ikke har innhold på valgt språk.',
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
