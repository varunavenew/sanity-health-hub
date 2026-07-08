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
    { name: 'value', title: 'Value', type: 'string', validation: reqStr('Value') },
    {
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: reqI18n('Label'),
    },
    {
      name: 'sub',
      title: 'Subheading',
      type: 'internationalizedArrayString',
      validation: reqI18n('Subheading'),
    },
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare({ value, label }: { value?: string; label?: unknown }) {
      return { title: value || 'Statistics', subtitle: pickNo(label) || undefined }
    },
  },
}

export default {
  name: 'treatmentCategory',
  title: 'Behandlingskategori',
  type: 'document',
  icon: CategoryIcon,
  groups: [
    { name: 'general', title: 'General' },
    { name: 'hero', title: 'Hero' },
    { name: 'landingPage', title: 'Landingsside' },
    { name: 'pageSections', title: 'Sidestruktur' },
    { name: 'seo', title: 'SEO / Synlighet' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Kategorinavn',
      type: 'internationalizedArrayString',
      group: 'general',
      validation: reqI18n('Kategorinavn'),
    },
    {
      ...i18nSlugFieldFromTitle('title'),
      group: 'general',
    },
    {
      name: 'categoryId',
      title: 'Category key (slug)',
      type: 'string',
      group: 'general',
      description:
        'Internal key used in app routing: gynecology, fertility, urology, orthopedics, pregnancy, other-specialties',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoryNumericId',
      title: 'Category ID',
      type: 'number',
      group: 'general',
      description:
        'Numeric booking ID. Example: 8=Gynecology, 1=Fertility, 6=Urology, 17=Orthopedics, 10=Pregnancy, 23=Other specialties',
      validation: (Rule: any) => Rule.required().min(1).max(999),
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Used when hero video is not set.',
    },
    {
      name: 'heroVideo',
      title: 'Hero-video',
      type: 'file',
      group: 'hero',
      options: { accept: 'video/*' },
      description: 'Optional background video in hero (overrides image when set).',
    },
    {
      name: 'treatments',
      title: 'Treatments',
      group: 'general',
      description:
        'Treatments displayed on the category landing page (e.g. \'All under one roof\'). Only treatments with Category = this category can be selected. The order here controls display.',
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
      title: 'Statistics',
      group: 'general',
      type: 'array',
      of: [statItem],
      validation: (Rule: any) => Rule.required().min(1).error('Add at least one statistics row'),
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      group: 'general',
      description: 'Lower numbers are shown first.',
    },
    {
      ...categoryLandingPageField,
      group: 'landingPage',
    },
    {
      ...pageSectionsField,
      group: 'pageSections',
    },

    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      validation: reqI18n('GEO-sammendrag'),
    },
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'categoryId', direction: 'asc' },
      ],
    },
    {
      title: 'Title (A–Z)',
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
      return { title: pickNo(title) || 'Category', subtitle: previewSubtitle, media }
    },
  },
}
