// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader
import { CategoryIcon } from './icons'
import {
  i18nSlugFieldFromTitle,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { categoryLandingPageField } from './categoryLanding'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

/** Reference picker: only treatments whose Kategori points at this category document. */
function treatmentRefsForCategoryFilter({
  document,
}: {
  document?: { _id?: string; categoryId?: string }
}) {
  if (document?._id) {
    const publishedId = document._id.replace(/^drafts\./, '')
    const draftId = document._id.startsWith('drafts.')
      ? document._id
      : `drafts.${publishedId}`
    return {
      filter: '_type == "treatment" && category._ref in $categoryIds',
      params: { categoryIds: [publishedId, draftId] },
    }
  }
  if (document?.categoryId) {
    return {
      filter: '_type == "treatment" && category->categoryId == $categoryId',
      params: { categoryId: document.categoryId },
    }
  }
  // Unsaved new category — show nothing until categoryId / _id exists
  return {
    filter: '_type == "treatment" && category._ref in $categoryIds',
    params: { categoryIds: ['__no_category__'] },
  }
}

const statItem = {
  type: 'object',
  fields: [
    { name: 'value', title: 'Verdi', type: 'string', validation: reqStr('Verdi') },
    {
      name: 'label',
      title: 'Etikett',
      type: 'internationalizedArrayString',
      validation: reqI18n('Etikett'),
    },
    {
      name: 'sub',
      title: 'Undertekst',
      type: 'internationalizedArrayString',
      validation: reqI18n('Undertekst'),
    },
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare({ value, label }: { value?: string; label?: unknown }) {
      return { title: value || 'Statistikk', subtitle: pickNo(label) || undefined }
    },
  },
}

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
      validation: reqI18n('Kategorinavn'),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'categoryId',
      title: 'Kategori-key (slug)',
      type: 'string',
      description:
        'Intern nøkkel brukt i app-ruting: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader',
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
      description: 'Brukes når hero-video ikke er satt.',
    },
    {
      name: 'heroVideo',
      title: 'Hero-video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Valgfri bakgrunnsvideo i hero (overstyrer stillbilde når satt).',
    },
    {
      name: 'treatments',
      title: 'Behandlinger',
      description:
        'Behandlinger som vises på kategori-landingssiden (f.eks. «Alt under samme tak»). Kun behandlinger med Kategori = denne kategorien kan velges. Rekkefølgen her styrer visningen.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
          options: {
            filter: treatmentRefsForCategoryFilter,
          },
        },
      ],
    },
    {
      name: 'stats',
      title: 'Statistikk',
      type: 'array',
      of: [statItem],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én statistikk-rad'),
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først.',
      validation: (Rule: any) => Rule.required().error('Sorteringsrekkefølge er påkrevd'),
    },
    categoryLandingPageField,
    {
      name: 'loadingLabel',
      title: 'Laster-tekst',
      type: 'internationalizedArrayString',
      validation: reqI18n('Laster-tekst'),
    },
    {
      name: 'missingLandingMessage',
      title: 'Melding når landingsinnhold mangler',
      type: 'internationalizedArrayText',
      validation: reqI18n('Melding når landingsinnhold mangler'),
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      validation: reqI18n('GEO-sammendrag'),
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
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
