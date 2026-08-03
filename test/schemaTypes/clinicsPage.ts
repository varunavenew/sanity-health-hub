// Schema: Clinics listing page (/klinikker) — hero + SEO (singleton)
import {ClinicIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo, resolveLocalizedString} from './i18n'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {clinicsPageEditorConfig} from '../sanity/page-editor/pages/clinicsSections'

const CLINICS_SHARED_SECTIONS = ['pageSectionArticles', 'pageSectionBookingCta'] as const

export default {
  name: 'clinicsPage',
  title: 'Clinics page',
  type: 'document',
  icon: ClinicIcon,
  components: {
    input: createPageSectionDocumentInput(clinicsPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      group: 'hero',
      description:
        'Use {count} for the number of clinics (e.g. "{count} clinics · No referral").',
    },
    {
      name: 'heroTitle',
      title: 'Hero – title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {
      ...i18nSlugFieldFromTitle('heroTitle', {
        group: 'hero',
        description: 'URL path without locale, e.g. /klinikker (NO) and /clinics (EN).',
      }),
    },
    {
      name: 'heroDescription',
      title: 'Hero – subtitle',
      type: 'internationalizedArrayText',
      group: 'hero',
    },
    {
      name: 'heroImage',
      title: 'Hero – image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    },
    {
      name: 'primaryCtaLabel',
      title: 'Hero CTA – primary text',
      type: 'internationalizedArrayString',
      group: 'hero',
      description:
        'Optional hero booking button. For page-bottom CTAs, use Shared Sections → Booking CTA band.',
    },
    {
      name: 'primaryCtaPath',
      title: 'Hero CTA – primary link',
      type: 'string',
      group: 'hero',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'secondaryCtaLabel',
      title: 'Hero CTA – secondary text',
      type: 'internationalizedArrayString',
      group: 'hero',
    },
    {
      name: 'secondaryCtaPath',
      title: 'Hero CTA – secondary link',
      type: 'string',
      group: 'hero',
      description: 'Internal path without locale, e.g. /contact',
    },
    pageSectionsFieldForGroup('content', 'sharedSections', CLINICS_SHARED_SECTIONS),
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
      description: 'Meta title and description for the clinic list',
      validation: requiredNoEnSeo,
    },
    {...geoSummaryField, ...seoFieldsetProps},
  ],
  preview: {
    select: {title: 'heroTitle'},
    prepare({title}: {title?: unknown}) {
      return {title: resolveLocalizedString(title) || 'Clinics'}
    },
  },
}
