// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader
import { CategoryIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'
import { categoryLandingPageField } from './categoryLanding'
import { pageSectionsField } from './pageSections'

export default {
  name: 'treatmentCategory',
  title: 'Behandlingskategori',
  type: 'document',
  icon: CategoryIcon,
  fields: [
    {
      name: 'title',
      title: 'Kategorinavn',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'categoryId',
      title: 'Kategori-key (slug)',
      type: 'string',
      description: 'Intern nøkkel brukt i app-ruting: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoryNumericId',
      title: 'Kategori-ID',
      type: 'number',
      description:
        'Numerisk booking-ID. Eksempel: 8=Gynekologi, 1=Fertilitet, 6=Urologi, 17=Ortopedi, 10=Graviditet, 23=Flere fagområder',
      validation: (Rule: any) => Rule.required().min(1).max(999),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroVideo',
      title: 'Hero-video (valgfritt)',
      type: 'file',
      options: { accept: 'video/*' },
    },
    {
      name: 'description',
      title: 'Kort beskrivelse',
      type: 'internationalizedArrayText',
    },
    {
      name: 'longDescription',
      title: 'Utvidet beskrivelse',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      description: 'Lucide icon name (f.eks. Heart, Baby, Bone)',
    },
    {
      name: 'color',
      title: 'Farge',
      type: 'string',
      description: 'Accent-farge for kategorien (HSL-verdi)',
    },
    {
      name: 'treatments',
      title: 'Behandlinger',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
        },
      ],
    },
    {
      name: 'stats',
      title: 'Statistikk',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'internationalizedArrayString' },
            { name: 'sub', title: 'Undertekst', type: 'internationalizedArrayString' },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først. La stå tom for alfabetisk.',
    },
    {
      name: 'quickInfoItems',
      title: 'Hurtiginfo (behandlingssider)',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
      description: 'F.eks. Ingen henvisning, Kort ventetid, Forsikring godkjent',
    },
    {
      name: 'linkedServicesSectionTitle',
      title: 'Overskrift: koblede tjenester',
      type: 'internationalizedArrayString',
    },
    {
      name: 'processSectionTitle',
      title: 'Overskrift: behandlingsprosess',
      type: 'internationalizedArrayString',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ-overskrift (behandlingssider)',
      type: 'internationalizedArrayString',
      description: 'Vises over FAQ-listen på enkeltbehandlinger i kategorien.',
    },
    {
      name: 'bottomCta',
      title: 'Bunn-CTA (behandlingssider)',
      type: 'object',
      description: 'Handlingsboks nederst på behandlingssider i denne kategorien.',
      fields: [
        { name: 'title', title: 'Overskrift', type: 'internationalizedArrayString' },
        { name: 'subtitle', title: 'Ingress', type: 'internationalizedArrayText' },
        { name: 'primaryLabel', title: 'Primærknapp', type: 'internationalizedArrayString' },
        { name: 'secondaryLabel', title: 'Sekundærknapp', type: 'internationalizedArrayString' },
        {
          name: 'primaryPath',
          title: 'Primær lenke',
          type: 'string',
          description: 'Valgfri. Tom = booking med kategori (f.eks. /booking?kategori=fertilitet).',
        },
        {
          name: 'secondaryPath',
          title: 'Sekundær lenke',
          type: 'string',
          initialValue: '/kontakt',
        },
      ],
    },
    categoryLandingPageField,
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        // title is internationalizedArray — sort by slug (derived from Kategorinavn)
        { field: 'categoryId', direction: 'asc' },
      ],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'categoryId', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'categoryId', numericId: 'categoryNumericId', media: 'heroImage' },
    prepare({ title, subtitle, numericId, media }: any) {
      const idPart = numericId != null ? `#${numericId}` : ''
      const keyPart = subtitle ? `${subtitle}` : ''
      const previewSubtitle = [idPart, keyPart].filter(Boolean).join(' • ')
      return { title: pickNo(title) || 'Kategori', subtitle: previewSubtitle, media }
    },
  },
}
