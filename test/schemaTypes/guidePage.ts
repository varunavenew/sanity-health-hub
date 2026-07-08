// Schema: Guide page (/guide) — hero, category list, CTA (singleton)
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'guidePage',
  title: 'Guide page',
  type: 'document',
  icon: GenericIcon,
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero – title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL path without locale, e.g. /guide (NO and EN).',
    }),
    {
      name: 'heroSubtitle',
      title: 'Hero – undertittel',
      type: 'internationalizedArrayText',
    },
    {
      name: 'showCategorySections',
      title: 'Vis behandlingskategorier',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'featuredCategories',
      title: 'Categories (optional)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatmentCategory' }] }],
      description:
        'Select order. Leave blank to show all treatment categories sorted by sortOrder.',
      hidden: ({ parent }: { parent?: { showCategorySections?: boolean } }) =>
        parent?.showCategorySections === false,
    },
    {
      name: 'ctaTitle',
      title: 'CTA – title',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaSubtitle',
      title: 'CTA – undertittel',
      type: 'internationalizedArrayText',
    },
    {
      name: 'ctaButtonLabel',
      title: 'CTA – knappetekst',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaButtonPath',
      title: 'CTA – link',
      type: 'string',
      initialValue: '/booking',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    geoSummaryField,
    pageSectionsField,
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: { language?: string; _key?: string; value?: string }) => (t.language || t._key) === 'no')?.value ||
            (title[0] as { value?: string })?.value ||
            'Guide')
        : (title || 'Guide')
      return { title: titleStr }
    },
  },
}
