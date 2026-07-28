/**
 * CTA Module — DEPRECATED generic Call-To-Action library document.
 *
 * Soft-hidden from Content Library desk (same pattern as Hero Module).
 * Kept registered temporarily until V3 cleanup after CTA Collection dual-read,
 * migration, and QA. Do not use for new content — use `ctaCollection` instead.
 *
 * Zero documents expected on developer; production Booking CTA uses
 * `pageSectionBookingCta` (+ future `ctaCollection` ref).
 */
import {CtaIcon} from './icons'
import {pickStudioEn} from './studioPreview'
import type {ReactNode} from 'react'

/** Shared button fields used by primary / secondary CTAs. */
const ctaButtonFields = [
  {
    name: 'enabled',
    title: 'Enabled',
    type: 'boolean',
    initialValue: true,
  },
  {
    name: 'label',
    title: 'Label',
    type: 'internationalizedArrayString',
  },
  {
    name: 'href',
    title: 'Link',
    type: 'string',
    description:
      'Internal path (e.g. /booking, /contact) or full URL. Ignored when action is phone-only.',
  },
  {
    name: 'actionType',
    title: 'Action type',
    type: 'string',
    options: {
      list: [
        {title: 'Navigate / link', value: 'link'},
        {title: 'Booking', value: 'booking'},
        {title: 'Phone', value: 'phone'},
        {title: 'Open contact dialog', value: 'openContactDialog'},
      ],
      layout: 'radio',
    },
    initialValue: 'link',
  },
  {
    name: 'style',
    title: 'Button style',
    type: 'string',
    options: {
      list: [
        {title: 'Primary (CTA)', value: 'primary'},
        {title: 'Secondary / outline', value: 'secondary'},
        {title: 'Contact', value: 'contact'},
        {title: 'Link / text', value: 'link'},
      ],
      layout: 'radio',
    },
    initialValue: 'primary',
  },
  {
    name: 'bookingCategory',
    title: 'Booking category (optional)',
    type: 'reference',
    to: [{type: 'treatmentCategory'}],
    description:
      'When action is Booking and link is /booking, appends ?category= from this category.',
    hidden: ({parent}: {parent?: {actionType?: string}}) =>
      parent?.actionType !== 'booking',
  },
  {
    name: 'bookingService',
    title: 'Booking service slug (optional)',
    type: 'string',
    description: 'Optional service slug for booking deep-links.',
    hidden: ({parent}: {parent?: {actionType?: string}}) =>
      parent?.actionType !== 'booking',
  },
]

export default {
  name: 'ctaModule',
  title: 'CTA Module (deprecated)',
  type: 'document',
  icon: CtaIcon,
  description:
    'Deprecated. Use CTA Collection for Booking CTA packs. This type is hidden from the Content Library and will be removed in a later cleanup phase.',
  fields: [
    {
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description:
        'Editor-only label (e.g. Homepage Booking CTA, Guide closing CTA). Not shown on the site.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      description: 'Public heading for the CTA band.',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      description: 'Supporting copy under the title.',
    },
    {
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: ctaButtonFields.map((field) =>
        field.name === 'style'
          ? {...field, initialValue: 'primary'}
          : field.name === 'actionType'
            ? {...field, initialValue: 'booking'}
            : field.name === 'href'
              ? {...field, initialValue: '/booking'}
              : field,
      ),
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      description: 'Optional second button (often “Call us” or a quieter link).',
      fields: ctaButtonFields.map((field) =>
        field.name === 'enabled'
          ? {...field, initialValue: false}
          : field.name === 'style'
            ? {...field, initialValue: 'secondary'}
            : field.name === 'actionType'
              ? {...field, initialValue: 'link'}
              : field,
      ),
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'phoneCta',
      title: 'Phone CTA (optional)',
      type: 'object',
      description:
        'Dedicated phone action. Use when Call should stay separate from Secondary CTA.',
      fields: [
        {
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'label',
          title: 'Label',
          type: 'internationalizedArrayString',
        },
        {
          name: 'phoneNumber',
          title: 'Phone number',
          type: 'string',
          description:
            'E.164 or display number. Leave empty to use clinic picker on the frontend later.',
        },
        {
          name: 'useClinicPicker',
          title: 'Use clinic phone picker',
          type: 'boolean',
          initialValue: true,
          description:
            'When true (and no fixed number), frontend may show a clinic selector.',
        },
      ],
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'backgroundStyle',
      title: 'Background style',
      type: 'string',
      options: {
        list: [
          {title: 'Dark (default)', value: 'dark'},
          {title: 'Warm', value: 'warm'},
          {title: 'Light', value: 'light'},
          {title: 'With image', value: 'withImage'},
          {title: 'Brand / accent', value: 'brand'},
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
      description: 'Maps to existing Booking CTA variants plus future light/brand options.',
    },
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Accent', value: 'accent'},
          {title: 'Muted', value: 'muted'},
          {title: 'Inverse', value: 'inverse'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description: 'Color/emphasis theme independent of background layout.',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full-width band', value: 'band'},
          {title: 'Split (text + image)', value: 'split'},
          {title: 'Centered compact', value: 'centered'},
          {title: 'Card row', value: 'cards'},
        ],
        layout: 'radio',
      },
      initialValue: 'band',
      description: 'Reserved for future renderer variants. No frontend wiring yet.',
    },
    {
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: {hotspot: true},
      description: 'Used when background is “With image” or layout is split.',
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'badges',
      title: 'Badges (optional)',
      type: 'array',
      description: 'Trust chips / quick-info under the buttons (e.g. “Same-week appointments”).',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Clock', value: 'clock'},
                  {title: 'Shield', value: 'shield'},
                  {title: 'Check', value: 'check'},
                  {title: 'Star', value: 'star'},
                  {title: 'Phone', value: 'phone'},
                  {title: 'None', value: 'none'},
                ],
              },
              initialValue: 'check',
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
                title: pickStudioEn(text) || 'Badge',
                subtitle: icon || undefined,
              }
            },
          },
        },
      ],
    },
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          {title: 'Visible (ready for use)', value: 'visible'},
          {title: 'Hidden / draft', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'visible',
      description:
        'Studio/editorial flag only until pages reference this module. Does not affect the live site today.',
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      description: 'Optional order when listing modules in Studio.',
      initialValue: 0,
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      rows: 3,
      description: 'Editor-only notes. Not shown on the website.',
    },
  ],
  orderings: [
    {
      title: 'Sorting order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Internal name',
      name: 'internalNameAsc',
      by: [{field: 'internalName', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      internalName: 'internalName',
      title: 'title',
      backgroundStyle: 'backgroundStyle',
      visibility: 'visibility',
      media: 'image',
    },
    prepare({
      internalName,
      title,
      backgroundStyle,
      visibility,
      media,
    }: {
      internalName?: string
      title?: unknown
      backgroundStyle?: string
      visibility?: string
      media?: string | number | boolean | ReactNode
    }) {
      const headline = pickStudioEn(title)
      const meta = [
        !internalName?.trim() ? headline || undefined : undefined,
        backgroundStyle || undefined,
        visibility === 'hidden' ? 'hidden' : undefined,
      ].filter(Boolean)
      return {
        title: internalName?.trim() || headline || 'CTA Module',
        subtitle: meta.join(' · ') || 'CTA Module',
        media,
      }
    },
  },
}
