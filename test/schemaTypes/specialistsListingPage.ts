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
      description: 'F.eks. "Vårt team" / "Our team".',
    },
    {
      name: 'heroTitle',
      title: 'Hero – tittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL-sti uten locale, f.eks. /spesialister (NO) og /specialists (EN).',
    }),
    {
      name: 'heroDescription',
      title: 'Hero – beskrivelse',
      type: 'internationalizedArrayText',
    },
    {
      name: 'countLabel',
      title: 'Antall spesialister (etikett)',
      type: 'internationalizedArrayString',
      description:
        'Vises over rutenettet. Bruk {count} for antall (f.eks. "{count} spesialister").',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel (metaTitle) og meta-beskrivelse (metaDescription) for /spesialister',
    },
    geoSummaryField,
    {
      name: 'profileUi',
      title: 'Profilside – UI-tekster',
      type: 'object',
      description:
        'Felles tekster på enkeltspesialist-sider (/spesialister/[slug]). Bruk {firstName} der fornavn skal settes inn.',
      options: { collapsible: true, collapsed: true },
      fields: [
        profileUiStringField('loadingLabel', 'Laster-tekst', 'Vises mens profilen hentes.'),
        profileUiStringField('notFoundTitle', 'Ikke funnet – tittel'),
        profileUiStringField('notFoundBackLabel', 'Ikke funnet – tilbake-knapp'),
        profileUiStringField('breadcrumbHomeLabel', 'Brødsmule – hjem'),
        profileUiStringField('breadcrumbSpecialistsLabel', 'Brødsmule – spesialister'),
        profileUiStringField(
          'bookingCtaLabel',
          'Booking CTA',
          'F.eks. «Bestill time hos {firstName}».',
        ),
        profileUiStringField(
          'bookingSectionTitle',
          'Booking-seksjon – tittel',
          'F.eks. «Bestill time hos {firstName}».',
        ),
        profileUiTextField(
          'bookingSectionDescription',
          'Booking-seksjon – beskrivelse',
        ),
        profileUiStringField('heroCallUsLabel', 'Hero – ring oss'),
        profileUiStringField(
          'bioSectionTitle',
          'Bio – overskrift',
          'F.eks. «Om {firstName}».',
        ),
        profileUiStringField('reviewsSectionTitle', 'Anmeldelser – overskrift'),
        profileUiStringField('featuredServiceCtaLabel', 'Fremhevet tjeneste – lenketekst'),
        profileUiStringField('bookingLoadingLabel', 'Booking – laster tjenester'),
        profileUiTextField('bookingEmptyMessage', 'Booking – ingen tjenester'),
        profileUiStringField('bookingViewAllLabel', 'Booking – se alle tjenester'),
        profileUiStringField('anonymousReviewLabel', 'Anonym anmelder – navn'),
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
