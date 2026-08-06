/**
 * Shared Booking CTA content fields — used by:
 * - pageSectionBookingCta (page-owned band + legacy inline)
 * - ctaCollection (Content Library pack)
 *
 * Keep names/types identical so dual-read needs no permanent mapping layer.
 */
import {pickStudioEn} from './studioPreview'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const quickInfoIconOptions = {
  list: [
    {title: 'Clock', value: 'clock'},
    {title: 'Shield', value: 'shield'},
  ],
  layout: 'radio' as const,
}

/** Public body fields shared by band and CTA Collection (excludes reserved hidden image/variant). */
export const bookingCtaContentFields = [
  {
    name: 'title',
    title: 'Heading',
    type: 'internationalizedArrayString',
    description: 'E.g. “Book appointment with a specialist”',
  },
  {
    name: 'subtitle',
    title: 'Ingress',
    type: 'internationalizedArrayText',
  },
  {
    name: 'primaryLabel',
    title: 'Primary button',
    type: 'internationalizedArrayString',
    initialValue: [
      {_key: 'no', language: 'no', value: 'Bestill time'},
      {_key: 'en', language: 'en', value: 'Book appointment'},
    ],
  },
  {
    name: 'showSecondaryButton',
    title: 'Show “Call us” button',
    type: 'boolean',
    initialValue: true,
  },
  {
    name: 'secondaryLabel',
    title: 'Secondary button text',
    type: 'internationalizedArrayString',
    hidden: ({parent}: {parent?: {showSecondaryButton?: boolean}}) =>
      parent?.showSecondaryButton === false,
  },
  {
    name: 'quickInfoItems',
    title: 'Quick info',
    type: 'array',
    description: 'Short facts under the buttons (e.g. waiting time, no referral).',
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
          select: {text: 'text', icon: 'icon'},
          prepare({text, icon}: {text?: unknown; icon?: string}) {
            return {
              title: pickStudioEn(text) || 'Quick info',
              subtitle: icon === 'shield' ? 'Shield' : 'Clock',
            }
          },
        },
      },
    ],
  },
  {
    name: 'primaryPath',
    title: 'Primary link',
    type: 'string',
    initialValue: '/booking',
    description:
      'Internal path (e.g. /booking) or full URL. Leave /booking to use booking category below.',
  },
  {
    name: 'bookingCategory',
    title: 'Booking category (optional)',
    type: 'reference',
    to: [{type: 'treatmentCategory'}],
    description:
      'When the primary link is /booking (or empty), pre-selects this category with ?kategori= in the booking URL.',
  },
  {
    name: 'secondaryPath',
    title: 'Secondary link (optional)',
    type: 'string',
    description:
      'Internal path (e.g. /kontakt). When set, uses a normal link instead of the Call us clinic picker.',
    hidden: ({parent}: {parent?: {showSecondaryButton?: boolean}}) =>
      parent?.showSecondaryButton === false,
  },
  {
    name: 'backgroundColor',
    title: 'Background color',
    type: 'string',
    description:
      'Optional CSS color for the Booking CTA band (e.g. #1a2332 or rgb(26, 35, 50)). Leave empty to use the default dark background.',
    validation: (Rule: any) =>
      Rule.custom((value: unknown) => {
        if (value == null || value === '') return true
        if (typeof value !== 'string') return 'Use a CSS color string'
        const v = value.trim()
        if (!v) return true
        // Allow hex, rgb/rgba, hsl/hsla, and named colors (light validation).
        if (
          /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v) ||
          /^(rgb|rgba|hsl|hsla)\(/i.test(v) ||
          /^[a-zA-Z]+$/.test(v)
        ) {
          return true
        }
        return 'Use a CSS color (hex, rgb/rgba, hsl/hsla, or named color)'
      }),
  },
  {
    name: 'textColor',
    title: 'Text color',
    type: 'string',
    description:
      'Optional CSS color for heading, ingress, and quick info. Leave empty for default contrast on the chosen background.',
    validation: (Rule: any) =>
      Rule.custom((value: unknown) => {
        if (value == null || value === '') return true
        if (typeof value !== 'string') return 'Use a CSS color string'
        const v = value.trim()
        if (!v) return true
        if (
          /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v) ||
          /^(rgb|rgba|hsl|hsla)\(/i.test(v) ||
          /^[a-zA-Z]+$/.test(v)
        ) {
          return true
        }
        return 'Use a CSS color (hex, rgb/rgba, hsl/hsla, or named color)'
      }),
  },
]

/** Reserved / unused-on-site fields kept on the page band only (legacy parity). */
export const bookingCtaReservedBandFields = [
  {
    name: 'image',
    title: 'Image (optional)',
    type: 'image',
    options: mediaImageOptions('card'),
    description: mediaDescription(
      'card',
      'Reserved. Not shown on the website via Shared Sections today.',
    ),
    validation: softImageRules('card'),
    hidden: true,
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
    title: 'Appearance',
    type: 'string',
    options: {
      list: [
        {title: 'Dark (default)', value: 'dark'},
        {title: 'Warm background', value: 'warm'},
        {title: 'With image', value: 'withImage'},
      ],
      layout: 'radio',
    },
    initialValue: 'dark',
    description: 'Reserved. Website always shows the dark style via Shared Sections today.',
    hidden: true,
  },
]

/** Shared insurance partner list body — band + Insurance Collection. */
export const insuranceContentFields = [
  {
    name: 'eyebrow',
    title: 'Eyebrow',
    type: 'internationalizedArrayString',
    initialValue: [{_key: 'no', language: 'no', value: 'Forsikringspartnere'}],
  },
  {
    name: 'title',
    title: 'Heading',
    type: 'internationalizedArrayString',
    initialValue: [
      {
        _key: 'no',
        language: 'no',
        value: 'Vi har avtale med de største forsikringsselskapene i Norge.',
      },
      {
        _key: 'en',
        language: 'en',
        value: 'We have agreements with the largest insurance companies in Norway.',
      },
    ],
  },
  {
    name: 'partners',
    title: 'Partners',
    description: 'Leave empty to hide this band on the website.',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'key',
            type: 'string',
            title: 'Partner key',
            description:
              'Internal identifier (not shown on the website). Short code, e.g. if, tryg, storebrand.',
          },
          {
            name: 'label',
            type: 'internationalizedArrayString',
            title: 'Display name',
            description: 'Name shown on the website.',
          },
        ],
        preview: {
          select: {title: 'label', subtitle: 'key'},
          prepare({title, subtitle}: {title?: unknown; subtitle?: string}) {
            return {
              title: pickStudioEn(title) || 'Partner',
              subtitle: subtitle || undefined,
            }
          },
        },
      },
    ],
  },
]
