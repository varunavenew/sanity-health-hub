/**
 * Reusable page sections (specialists, articles, booking CTA, insurance).
 * Phase 15A: Studio labels, descriptions, Appearance/Advanced grouping, hides only.
 * Phase V3-2: additive ctaCollection / insuranceCollection refs (legacy inline kept).
 * JSON paths and frontend behaviour unchanged until dual-read phase.
 */
import { defineField } from 'sanity'
import { pickStudioLabel } from './studioPreview'
import { createPageSectionCollectionBandPreview } from './pageSectionCollectionBandPreview'
import {
  bookingCtaContentFields,
  bookingCtaReservedBandFields,
  insuranceContentFields,
} from './bookingCtaFields'
import {PageSectionsArrayInput} from '../sanity/page-editor/components/PageSectionsArrayInput'

const appearanceCollapsed = { collapsible: true, collapsed: true } as const

const displayModeSpecialists = {
  name: 'displayMode',
  type: 'string',
  title: 'Display',
  description:
    'For Treatment Category pages, use Filter by category and select this category.',
  options: {
    list: [
      { title: 'All specialists', value: 'all' },
      { title: 'Choose manually', value: 'manual' },
      { title: 'Filter by category', value: 'category' },
    ],
    layout: 'radio',
  },
  initialValue: 'all',
}

const displayModeArticles = {
  name: 'displayMode',
  type: 'string',
  title: 'Display',
  options: {
    list: [
      { title: 'Latest articles', value: 'latest' },
      { title: 'Choose manually', value: 'manual' },
      { title: 'Filter by category', value: 'category' },
    ],
    layout: 'radio',
  },
  initialValue: 'latest',
}

export const pageSectionSpecialists = {
  name: 'pageSectionSpecialists',
  title: 'Specialists Band',
  type: 'object',
  fieldsets: [
    {
      name: 'appearance',
      title: 'Appearance',
      options: appearanceCollapsed,
    },
  ],
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow / label',
      type: 'internationalizedArrayString',
      description: 'Optional small text above the heading',
    },
    {
      name: 'title',
      title: 'Heading',
      type: 'internationalizedArrayString',
    },
    {
      name: 'description',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    displayModeSpecialists,
    {
      name: 'specialists',
      title: 'Specialists (manual selection)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'treatmentCategory',
      title: 'Treatment category',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      description: 'Preferred on Treatment Category pages.',
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'categorySlug',
      title: 'Category slug (alternative)',
      type: 'string',
      description: 'Only if no category reference is set. E.g. gynekologi, fertilitet.',
      hidden: ({
        parent,
      }: {
        parent?: { displayMode?: string; treatmentCategory?: unknown }
      }) =>
        parent?.displayMode !== 'category' || Boolean(parent?.treatmentCategory),
    },
    {
      name: 'seeAllLabel',
      title: 'See all text',
      type: 'internationalizedArrayString',
      description: 'E.g. “See all specialists – Gynecology”',
    },
    {
      name: 'seeAllHref',
      title: 'See all link',
      type: 'string',
      initialValue: '/spesialister',
    },
    {
      name: 'variant',
      title: 'Layout',
      type: 'string',
      fieldset: 'appearance',
      options: {
        list: [
          { title: 'Horizontal carousel', value: 'carousel' },
          { title: 'Dark grid', value: 'gridDark' },
          { title: 'Light grid', value: 'gridLight' },
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
    },
    {
      name: 'limit',
      title: 'Max items',
      type: 'number',
      fieldset: 'appearance',
      initialValue: 8,
      validation: (Rule: any) => Rule.min(1).max(24),
    },
  ],
  preview: {
    select: { title: 'title', variant: 'variant', displayMode: 'displayMode' },
    prepare({
      title,
      variant,
      displayMode,
    }: {
      title?: unknown
      variant?: string
      displayMode?: string
    }) {
      return {
        title: pickStudioLabel({title, fallback: 'Specialists Band'}),
        subtitle: displayMode
          ? `${displayMode} · ${variant === 'carousel' || variant === 'gridDark' || variant === 'gridLight' ? variant : 'layout unset'}`
          : 'Not configured',
      }
    },
  },
}

export const pageSectionArticles = {
  name: 'pageSectionArticles',
  title: 'Latest Articles',
  type: 'object',
  fieldsets: [
    {
      name: 'appearance',
      title: 'Appearance',
      options: appearanceCollapsed,
    },
  ],
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow / label',
      type: 'internationalizedArrayString',
    },
    {
      name: 'title',
      title: 'Heading',
      type: 'internationalizedArrayString',
    },
    {
      name: 'description',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    displayModeArticles,
    {
      name: 'articles',
      title: 'Articles (manual selection)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'articleCategory',
      title: 'Article category',
      type: 'string',
      description: 'Must match the category stored on articles (e.g. news / nyheter).',
      options: {
        list: [
          { title: 'Professional article', value: 'fagartikkel' },
          { title: 'News from us (schema)', value: 'news' },
          { title: 'News from us (legacy)', value: 'nyheter' },
          { title: 'Price list', value: 'prisliste' },
          { title: 'Job posting', value: 'stillingsutlysning' },
        ],
      },
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'ctaLabel',
      title: 'See all link text',
      type: 'internationalizedArrayString',
      description: 'Button text linking to the news listing.',
    },
    {
      name: 'ctaPath',
      title: 'See all link',
      type: 'string',
      initialValue: '/aktuelt',
      description: 'Usually /aktuelt',
    },
    {
      name: 'variant',
      title: 'Layout',
      type: 'string',
      fieldset: 'appearance',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Featured + grid', value: 'featured' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    },
    {
      name: 'limit',
      title: 'Max items',
      type: 'number',
      fieldset: 'appearance',
      initialValue: 6,
      validation: (Rule: any) => Rule.min(1).max(12),
    },
  ],
  preview: {
    select: { title: 'title', displayMode: 'displayMode' },
    prepare({ title, displayMode }: { title?: unknown; displayMode?: string }) {
      return {
        title: pickStudioLabel({title, fallback: 'Latest Articles'}),
        subtitle: displayMode || 'Not configured',
      }
    },
  },
}

export const pageSectionBookingCta = {
  name: 'pageSectionBookingCta',
  title: 'Booking Call To Action',
  type: 'object',
  fields: [
    {
      name: 'ctaCollection',
      title: 'CTA Collection',
      type: 'reference',
      to: [{type: 'ctaCollection'}],
      description:
        'Select, replace, clear, or create a CTA Collection from the Content Library.',
      options: {
        disableNew: false,
      },
    },
    // Reserved / legacy inline fields kept in the document for FE dual-read,
    // but hidden from Studio now that collection UX is the source of truth.
    ...bookingCtaReservedBandFields,
    ...bookingCtaContentFields.map((field) => ({
      ...field,
      hidden: () => true,
    })),
  ],
  preview: createPageSectionCollectionBandPreview({
    refField: 'ctaCollection',
    bandTypeLabel: 'CTA Collection',
    legacyFallback: 'Booking Call To Action',
  }),
}

export const pageSectionInsurance = {
  name: 'pageSectionInsurance',
  title: 'Insurance Partners',
  type: 'object',
  fields: [
    {
      name: 'insuranceCollection',
      title: 'Insurance Collection',
      type: 'reference',
      to: [{type: 'insuranceCollection'}],
      description:
        'Select, replace, clear, or create an Insurance Collection from the Content Library.',
      options: {
        disableNew: false,
      },
    },
    // Legacy inline partners/title kept for FE dual-read; hidden in Studio.
    ...insuranceContentFields.map((field) => ({
      ...field,
      hidden: () => true,
    })),
  ],
  preview: createPageSectionCollectionBandPreview({
    refField: 'insuranceCollection',
    bandTypeLabel: 'Insurance Collection',
    legacyFallback: 'Insurance Partners',
  }),
}

/** All shared band types (default insert menu). */
export const ALL_PAGE_SECTION_TYPES = [
  'pageSectionSpecialists',
  'pageSectionArticles',
  'pageSectionInsurance',
  'pageSectionBookingCta',
] as const

export type PageSectionBandType = (typeof ALL_PAGE_SECTION_TYPES)[number]

/** Reusable page-builder field — add to any document schema `fields` array. */
export const pageSectionsField = defineField({
  name: 'pageSections',
  title: 'Website bands',
  description:
    'Reusable website bands from Content Library. Fixed render order: Specialists → Insurance → Articles → Booking CTA.',
  type: 'array',
  of: [
    {type: 'pageSectionSpecialists'},
    {type: 'pageSectionArticles'},
    {type: 'pageSectionInsurance'},
    {type: 'pageSectionBookingCta'},
  ],
  components: {
    input: PageSectionsArrayInput,
  },
  options: {
    insertMenu: {
      filter: true,
      views: [{name: 'list'}],
    },
  },
})

/**
 * Assign page bands to a document group + collapsed Shared Sections fieldset.
 * Pass `allowedTypes` to restrict the insert menu (page-specific allowlist).
 * Pass `[]` to hide the field (page has no shared bands; existing data kept valid).
 */
export function pageSectionsFieldForGroup(
  group: string = 'content',
  fieldset: string = 'sharedSections',
  allowedTypes?: readonly PageSectionBandType[],
) {
  // undefined → all band types; [] → none (hidden); non-empty → allowlist
  if (allowedTypes !== undefined && allowedTypes.length === 0) {
    return {
      ...pageSectionsField,
      group,
      fieldset: 'legacy',
      title: 'Website bands',
      hidden: true,
      of: ALL_PAGE_SECTION_TYPES.map((type) => ({type})),
    }
  }

  const types = allowedTypes ?? ALL_PAGE_SECTION_TYPES
  return {
    ...pageSectionsField,
    group,
    fieldset,
    of: types.map((type) => ({type})),
    components: {
      input: PageSectionsArrayInput,
    },
  }
}
