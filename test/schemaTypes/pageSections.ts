/**
 * Reusable page sections (specialists, articles, booking CTA) for any singleton or document page.
 */
import { defineField } from 'sanity'
import { pickNo } from './i18n'

const displayModeSpecialists = {
  name: 'displayMode',
  type: 'string',
  title: 'Visning',
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
  title: 'Visning',
  options: {
    list: [
      { title: 'Nyeste artikler', value: 'latest' },
      { title: 'Choose manually', value: 'manual' },
      { title: 'Filter by category', value: 'category' },
    ],
    layout: 'radio',
  },
  initialValue: 'latest',
}

export const pageSectionSpecialists = {
  name: 'pageSectionSpecialists',
  title: 'Specialists',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow / label',
      type: 'internationalizedArrayString',
      description: 'Optional small text above heading',
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
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'categorySlug',
      title: 'Category slug (alternative)',
      type: 'string',
      description:
        'E.g. gynecology, fertility — used if category reference is not set',
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'seeAllLabel',
      title: 'See all text',
      type: 'internationalizedArrayString',
      description: 'E.g. \'See all specialists – Gynecology\'',
    },
    {
      name: 'seeAllHref',
      title: 'See all link',
      type: 'string',
      initialValue: '/spesialister',
    },
    {
      name: 'limit',
      title: 'Maks antall',
      type: 'number',
      initialValue: 8,
      validation: (Rule: any) => Rule.min(1).max(24),
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Horisontal karusell', value: 'carousel' },
          { title: 'Dark grid', value: 'gridDark' },
          { title: 'Lyst rutenett', value: 'gridLight' },
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
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
        title: pickNo(title) || 'Specialists',
        subtitle: `${displayMode || 'all'} · ${variant || 'carousel'}`,
      }
    },
  },
}

export const pageSectionArticles = {
  name: 'pageSectionArticles',
  title: 'Articles',
  type: 'object',
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
      title: 'Artikler (manuelt valg)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'articleCategory',
      title: 'Article category',
      type: 'string',
      options: {
        list: [
          { title: 'Professional article', value: 'fagartikkel' },
          { title: 'News from us', value: 'news' },
          { title: 'Price list', value: 'prisliste' },
          { title: 'Job posting', value: 'stillingsutlysning' },
        ],
      },
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'limit',
      title: 'Maks antall',
      type: 'number',
      initialValue: 6,
      validation: (Rule: any) => Rule.min(1).max(12),
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Rutenett', value: 'grid' },
          { title: 'Fremhevet + rutenett', value: 'featured' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    },
    {
      name: 'ctaLabel',
      title: 'Link text to News',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaPath',
      title: 'Link to News',
      type: 'string',
      initialValue: '/aktuelt',
    },
  ],
  preview: {
    select: { title: 'title', displayMode: 'displayMode' },
    prepare({ title, displayMode }: { title?: unknown; displayMode?: string }) {
      return {
        title: pickNo(title) || 'Articles',
        subtitle: displayMode || 'latest',
      }
    },
  },
}

const quickInfoIconOptions = {
  list: [
    { title: 'Klokke', value: 'clock' },
    { title: 'Skjold', value: 'shield' },
  ],
  layout: 'radio' as const,
}

export const pageSectionBookingCta = {
  name: 'pageSectionBookingCta',
  title: 'Book appointment (CTA)',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Heading',
      type: 'internationalizedArrayString',
      description: 'E.g. \'Book appointment with specialist\'',
    },
    {
      name: 'subtitle',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    {
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Displayed next to the text when the \'With image\' variant is selected',
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (default)', value: 'dark' },
          { title: 'Varm bakgrunn', value: 'warm' },
          { title: 'With image', value: 'withImage' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    },
    {
      name: 'primaryLabel',
      title: 'Primary button',
      type: 'internationalizedArrayString',
      initialValue: [{ _key: 'no', language: 'no', value: 'Book appointment now' }],
    },
    {
      name: 'primaryPath',
      title: 'Primary link',
      type: 'string',
      initialValue: '/booking',
      description: 'Internal path (e.g. /booking) or full URL',
    },
    {
      name: 'bookingCategory',
      title: 'Booking category (optional)',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      description: 'Adds ?category= to the booking link when the primary link is /booking',
    },
    {
      name: 'showSecondaryButton',
      title: 'Show \'Call us\' button',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'secondaryLabel',
      title: 'Secondary button text',
      type: 'internationalizedArrayString',
      hidden: ({ parent }: { parent?: { showSecondaryButton?: boolean } }) =>
        parent?.showSecondaryButton === false,
    },
    {
      name: 'secondaryPath',
      title: 'Secondary link (optional)',
      type: 'string',
      description:
        'Internal path (e.g. /contact). When set, a link button is used instead of the \'Call us\' selector.',
      hidden: ({ parent }: { parent?: { showSecondaryButton?: boolean } }) =>
        parent?.showSecondaryButton === false,
    },
    {
      name: 'quickInfoItems',
      title: 'Hurtiginfo',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: quickInfoIconOptions,
              initialValue: 'clock',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayString',
            },
          ],
          preview: {
            select: { text: 'text', icon: 'icon' },
            prepare({ text, icon }: { text?: unknown; icon?: string }) {
              return {
                title: pickNo(text) || 'Hurtiginfo',
                subtitle: icon === 'shield' ? 'Skjold' : 'Klokke',
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      return {
        title: pickNo(title) || 'Book appointment (CTA)',
        subtitle: 'Booking section',
      }
    },
  },
}

/** Reusable page-builder field — add to any document schema `fields` array. */
export const pageSectionsField = defineField({
  name: 'pageSections',
  title: 'Modular sections',
  description:
    'Page builder: add, remove and sort specialist, article and booking CTA blocks. Displayed after the page\'s main content.',
  type: 'array',
  of: [
    { type: 'pageSectionSpecialists' },
    { type: 'pageSectionArticles' },
    { type: 'pageSectionBookingCta' },
  ],
  options: {
    insertMenu: {
      filter: true,
      views: [
        { name: 'list' },
      ],
    },
  },
})

/** Same as pageSectionsField with an optional Sanity field group. */
export function pageSectionsFieldForGroup(group?: string) {
  return group ? { ...pageSectionsField, group } : pageSectionsField
}
