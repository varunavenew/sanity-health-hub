// Schema: Specialists directory (/spesialister) — hero + SEO (singleton)
import { SpecialistIcon } from './icons'
import { i18nSlugFieldFromTitle, requiredNoEnI18n } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

const profileUiStringField = (
  name: string,
  title: string,
  description?: string,
) => ({
  name,
  title,
  type: 'internationalizedArrayString' as const,
  ...(description ? { description } : {}),
  validation: requiredNoEnI18n(title),
})

const profileUiTextField = (name: string, title: string, description?: string) => ({
  name,
  title,
  type: 'internationalizedArrayText' as const,
  ...(description ? { description } : {}),
  validation: requiredNoEnI18n(title),
})

export default {
  name: 'specialistsListingPage',
  title: 'Spesialistoversikt',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      description: 'E.g. "Our team".',
    },
    {
      name: 'heroTitle',
      title: 'Hero – title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL path without locale, e.g. /spesialister (NO) and /specialists (EN).',
    }),
    {
      name: 'heroDescription',
      title: 'Hero – description',
      type: 'internationalizedArrayText',
    },
    {
      name: 'countLabel',
      title: 'Number of specialists (label)',
      type: 'internationalizedArrayString',
      description:
        'Displayed above the grid. Use {count} for the count (e.g. "{count} specialists").',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta title (metaTitle) and meta description (metaDescription) for /specialists',
    },
    geoSummaryField,
    {
      name: 'profileUi',
      title: 'Profilside – UI-tekster',
      type: 'object',
      description:
        'Common texts on individual specialist pages (/specialists/[slug]). Use {firstName} where first name should be inserted.',
      options: { collapsible: true, collapsed: true },
      fields: [
        profileUiStringField('loadingLabel', 'Loading Text', 'Displayed while the profile is fetched.'),
        profileUiStringField('notFoundTitle', 'Not found – title'),
        profileUiStringField('notFoundBackLabel', 'Not found – back button'),
        profileUiStringField('breadcrumbHomeLabel', 'Breadcrumb – home'),
        profileUiStringField('breadcrumbSpecialistsLabel', 'Breadcrumb – specialists'),
        profileUiStringField(
          'bookingCtaLabel',
          'Booking CTA',
          'E.g. \'Book appointment with {firstName}\'.',
        ),
        profileUiStringField(
          'bookingSectionTitle',
          'Booking section – title',
          'E.g. \'Book appointment with {firstName}\'.',
        ),
        profileUiTextField(
          'bookingSectionDescription',
          'Booking section – description',
        ),
        profileUiStringField('heroCallUsLabel', 'Hero – call us'),
        profileUiStringField(
          'bioSectionTitle',
          'Biography – heading',
          'E.g. \'About {firstName}\'.',
        ),
        profileUiStringField('reviewsSectionTitle', 'Reviews - Headline'),
        profileUiStringField('featuredServiceCtaLabel', 'Featured service – link text'),
        profileUiStringField('bookingLoadingLabel', 'Booking - loading services'),
        profileUiTextField('bookingEmptyMessage', 'Booking - no services'),
        profileUiStringField('bookingViewAllLabel', 'Booking - view all services'),
        profileUiStringField('anonymousReviewLabel', 'Anonymous reviewer – name'),
      ],
    },
    pageSectionsField,
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: { language?: string; _key?: string; value?: string }) => (t.language || t._key) === 'no')?.value ||
            (title[0] as { value?: string })?.value ||
            'Spesialistoversikt')
        : (title || 'Spesialistoversikt')
      return { title: titleStr }
    },
  },
}
