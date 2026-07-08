// Schema: Clinics listing page (/klinikker) — hero + SEO (singleton)
import { ClinicIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'clinicsPage',
  title: 'Clinics page',
  type: 'document',
  icon: ClinicIcon,
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      description:
        'Displayed above the main title. Use {count} for the number of clinics (e.g. "{count} clinics · No referral · Short waiting time").',
    },
    {
      name: 'heroTitle',
      title: 'Hero – title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL path without locale, e.g. /klinikker (NO) and /clinics (EN).',
    }),
    {
      name: 'heroDescription',
      title: 'Hero – description',
      type: 'internationalizedArrayText',
    },
    {
      name: 'heroImage',
      title: 'Hero – image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'primaryCtaLabel',
      title: 'Primary CTA – text',
      type: 'internationalizedArrayString',
    },
    {
      name: 'primaryCtaPath',
      title: 'Primary CTA – link',
      type: 'string',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA – text',
      type: 'internationalizedArrayString',
    },
    {
      name: 'secondaryCtaPath',
      title: 'Secondary CTA – link',
      type: 'string',
      description: 'Internal path without locale, e.g. /contact',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta title and meta description for the clinic list (/clinics)',
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
            'Clinics')
        : (title || 'Clinics')
      return { title: titleStr }
    },
  },
}
