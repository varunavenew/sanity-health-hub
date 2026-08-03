// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader
// Phase 11B / 11B.1: Studio IA (JSON paths unchanged)
// Phase 12UX: Medical Content UX sprint — Advanced group, clearer Shared Sections
import { CategoryIcon } from './icons'
import {
  i18nSlugFieldFromTitle,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import {pickStudioEn} from './studioPreview'
import { categoryLandingPageField } from './categoryLanding'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'
import { TreatmentCategoryDocumentInput } from '../sanity/components/TreatmentCategoryDocumentInput'

const reqI18n = requiredNoEnI18n

/** Match Treatment editor: all page/shared fieldsets collapsed by default. */
const sectionCollapsed = { collapsible: true, collapsed: true } as const

/** Reference picker: treatments whose categories[] (or legacy category) points here. */
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
      filter:
        '_type == "treatment" && (category._ref in $categoryIds || count((categories[]._ref)[@ in $categoryIds]) > 0)',
      params: { categoryIds: [publishedId, draftId] },
    }
  }
  if (document?.categoryId) {
    return {
      filter:
        '_type == "treatment" && (category->categoryId == $categoryId || count(categories[@->categoryId == $categoryId]) > 0)',
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
    { name: 'value', title: 'Value', type: 'string' },
    {
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
    },
    {
      name: 'sub',
      title: 'Subheading',
      type: 'internationalizedArrayString',
    },
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare({ value, label }: { value?: string; label?: unknown }) {
      return { title: value || 'Statistics', subtitle: pickStudioEn(label) || undefined }
    },
  },
}

export default {
  name: 'treatmentCategory',
  title: 'Treatment category',
  type: 'document',
  icon: CategoryIcon,
  components: {
    input: TreatmentCategoryDocumentInput,
  },
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'pageContent', title: 'Page Content' },
    { name: 'sharedSections', title: 'Shared Sections' },
    { name: 'seo', title: 'SEO' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fieldsets: [
    {
      name: 'pcHero',
      title: 'Hero — media',
      description:
        'Pick Media type, then upload image or video. Headline & buttons are under Website sections → Hero.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcStats',
      title: 'Numbers that tell a story — numbers',
      description:
        'KPI numbers (e.g. “98%”). Headings are under Website sections → Numbers that tell a story.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcWebsiteSections',
      title: 'Website sections',
      description:
        'Page bands. Open only what you need. Leave optional sections empty to hide them.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'ssFaq',
      title: 'Frequently Asked Questions',
      description:
        'Select, replace, clear, or create an FAQ Collection from the Content Library.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'faqAdvanced',
      title: 'Previous FAQ list',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'ssAssemblers',
      title: 'Specialists · Insurance · Articles · Booking CTA',
      description:
        'Website order is fixed: Specialists → Insurance → Articles → Booking CTA. Dragging only changes Studio order.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'seoFields',
      title: 'Search & AI',
      description: 'Meta tags and AI summary for this page.',
      options: sectionCollapsed,
      group: 'seo',
    },
    {
      name: 'advancedIds',
      title: 'Routing, booking & list order',
      description:
        'Technical keys. Ask engineering before changing. Rarely edited after setup.',
      options: sectionCollapsed,
      group: 'advanced',
    },
  ],
  fields: [
    // ── General (Business Entity) ─────────────────────────────────────────────
    {
      name: 'title',
      title: 'Category name',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'Official category name. Page copy lives under Page Content.',
      validation: reqI18n('Category name'),
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        description:
          'URL Slug (NO) and URL Slug (EN). Fills from Category name while typing when empty or still auto-synced. Manual edits are kept — later name changes will not overwrite them.',
      }),
      group: 'general',
    },
    {
      name: 'treatments',
      title: 'Linked treatments',
      group: 'general',
      description:
        'Used for the category overview page. Does NOT create the Services section below.',
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
      name: 'sortOrder',
      title: 'List order',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedIds',
      description: 'Order in the Services hub. Lower numbers appear first.',
    },
    {
      name: 'categoryId',
      title: 'Routing key',
      type: 'string',
      group: 'advanced',
      fieldset: 'advancedIds',
      description:
        'Internal key for URLs and booking. Not the Category name. Do not change lightly.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoryNumericId',
      title: 'Booking category number',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedIds',
      description:
        'Booking ID. E.g. 8=Gynecology, 1=Fertility, 6=Urology, 17=Orthopedics, 10=Pregnancy, 23=Other.',
      validation: (Rule: any) => Rule.required().min(1).max(999),
    },
    // ── Page Content (page-owned presentation) ────────────────────────────────
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'media',
      group: 'pageContent',
      fieldset: 'pcHero',
      description:
        'Preferred hero media (Image or Video). Upload Video takes priority over Video URL. Legacy fields below are kept until migration is verified.',
    },
    {
      name: 'heroMediaType',
      title: 'Media type (legacy)',
      type: 'string',
      group: 'pageContent',
      fieldset: 'pcHero',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      description: 'Legacy. Prefer Hero Media. Website dual-reads both.',
      hidden: ({ document }: { document?: { heroMedia?: unknown } }) =>
        Boolean(document?.heroMedia),
    },
    {
      name: 'heroImage',
      title: 'Hero image (legacy)',
      type: 'image',
      group: 'pageContent',
      fieldset: 'pcHero',
      options: { hotspot: true },
      description: 'Legacy. Prefer Hero Media → Image. Also used as video poster.',
      hidden: ({ document }: { document?: { heroMedia?: unknown; heroMediaType?: string } }) =>
        Boolean(document?.heroMedia) || document?.heroMediaType === 'video',
    },
    {
      name: 'heroVideo',
      title: 'Hero video (legacy)',
      type: 'file',
      group: 'pageContent',
      fieldset: 'pcHero',
      options: { accept: 'video/*' },
      description: 'Legacy uploaded video. Prefer Hero Media → Upload Video.',
      hidden: ({ document }: { document?: { heroMedia?: unknown; heroMediaType?: string } }) =>
        Boolean(document?.heroMedia) || (document?.heroMediaType ?? 'image') !== 'video',
    },
    {
      name: 'stats',
      title: 'Statistic rows',
      group: 'pageContent',
      fieldset: 'pcStats',
      type: 'array',
      of: [statItem],
      description:
        'KPI numbers only. Headings are under Website sections → Statistics — headings.',
    },
    {
      ...categoryLandingPageField,
      group: 'pageContent',
      fieldset: 'pcWebsiteSections',
    },
    // ── Shared Sections (assemblers — content from elsewhere) ───────────────
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      description: 'Heading above the FAQ. Questions live in the Collection.',
      type: 'internationalizedArrayString',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      initialValue: [
        { _key: 'no', language: 'no', value: 'Ofte stilte spørsmål' },
        { _key: 'en', language: 'en', value: 'Frequently asked questions' },
      ],
    },
    {
      name: 'faqSectionDescription',
      title: 'FAQ description',
      description:
        'Optional supporting copy under the heading. Use a blank line between paragraphs. When set, the website uses the split FAQ layout.',
      type: 'internationalizedArrayText',
      group: 'sharedSections',
      fieldset: 'ssFaq',
    },
    {
      name: 'faqOpenFirst',
      title: 'Open first question by default',
      description: 'When on, the first FAQ item starts expanded (reference category behaviour).',
      type: 'boolean',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      initialValue: false,
    },
    {
      name: 'faqCollection',
      title: 'Category FAQ',
      type: 'reference',
      to: [{ type: 'faqCollection' }],
      description:
        'Select, replace, clear, or create an FAQ Collection from the Content Library.',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      options: {
        disableNew: false,
      },
    },
    {
      name: 'faqs',
      title: 'Previous FAQ list',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'sharedSections',
      fieldset: 'faqAdvanced',
      hidden: () => true,
    },
    {
      ...pageSectionsField,
      group: 'sharedSections',
      fieldset: 'ssAssemblers',
      title: 'Website bands',
      description:
        'Website order is fixed: Specialists → Insurance → Articles → Booking CTA. Dragging sections only changes Studio order.',
    },
    // ── SEO ─────────────────────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      fieldset: 'seoFields',
      description: 'Search title, description, and social previews.',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      fieldset: 'seoFields',
      title: 'AI / GEO summary',
      description: 'Short summary for search and AI. Not the same as the Hero heading.',
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
      return { title: pickStudioEn(title) || 'Category', subtitle: previewSubtitle, media }
    },
  },
}
