/**
 * Hero Module — reusable first-viewport hero for the Content Library.
 *
 * Additive only (Phase 5): not referenced by page schemas or frontend yet.
 * Existing homepage slides, treatment heroes, and SplitHero pages stay unchanged.
 *
 * See docs/HERO_MODULE_ANALYSIS.md for the audit behind this shape.
 */
import {HeroIcon} from './icons'
import {pickStudioEn} from './studioPreview'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
  softVideoRules,
  videoDescription,
  VIDEO_GUIDELINE,
} from './mediaGuidelines'

/** Shared button fields (aligned with ctaModule action model). */
const heroCtaButtonFields = [
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
    description: 'Internal path (e.g. /booking) or full URL.',
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
    description: 'When action is Booking, can append ?category= on /booking links.',
    hidden: ({parent}: {parent?: {actionType?: string}}) =>
      parent?.actionType !== 'booking',
  },
  {
    name: 'bookingService',
    title: 'Booking service slug (optional)',
    type: 'string',
    hidden: ({parent}: {parent?: {actionType?: string}}) =>
      parent?.actionType !== 'booking',
  },
]

export default {
  name: 'heroModule',
  title: 'Hero Module',
  type: 'document',
  icon: HeroIcon,
  fieldsets: [
    {
      name: 'general',
      title: 'General',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'content',
      title: 'Content',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'media',
      title: 'Media',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'buttons',
      title: 'Buttons',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'appearance',
      title: 'Appearance',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'extras',
      title: 'Extras',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'advanced',
      title: 'Advanced',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    // ── General ────────────────────────────────────────────────────────────
    {
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      fieldset: 'general',
      description:
        'Editor-only label (e.g. About split hero, Guide text hero). Not shown on the site.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'general',
      description:
        'Short studio label or purpose summary. Prefer Heading for the public H1.',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      fieldset: 'general',
      description: 'When / where this module should be reused. Editor-only.',
    },

    // ── Content ────────────────────────────────────────────────────────────
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
      fieldset: 'content',
      description: 'Small label above the heading.',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      fieldset: 'content',
      description: 'Main hero headline (H1 when used as page open).',
      validation: (Rule: any) =>
        Rule.custom((value: unknown) => {
          if (!Array.isArray(value) || value.length === 0) {
            return 'Add at least one language for Heading (recommended).'
          }
          return true
        }).warning(),
    },
    {
      name: 'headingEmphasis',
      title: 'Heading emphasis',
      type: 'internationalizedArrayString',
      fieldset: 'content',
      description:
        'Optional italic / emphasized fragment (category landing pattern). Future-ready.',
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'internationalizedArrayString',
      fieldset: 'content',
      description: 'Short line under the heading when a full rich description is not needed.',
    },
    {
      name: 'richDescription',
      title: 'Rich description',
      type: 'internationalizedArrayText',
      fieldset: 'content',
      description: 'Longer supporting copy (ingress / intro).',
    },

    // ── Media ──────────────────────────────────────────────────────────────
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      fieldset: 'media',
      options: mediaImageOptions('hero'),
      description: mediaDescription('hero', 'Primary desktop / default hero image.'),
      validation: softImageRules('hero'),
    },
    {
      name: 'mobileImage',
      title: 'Mobile image',
      type: 'image',
      fieldset: 'media',
      options: mediaImageOptions('heroMobile'),
      description: mediaDescription(
        'heroMobile',
        'Optional. Used on small screens instead of Image (homepage slide pattern).',
      ),
      validation: softImageRules('heroMobile'),
    },
    {
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'internationalizedArrayString',
      fieldset: 'media',
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      fieldset: 'media',
      description:
        'Optional remote video URL (treatment / category pattern). Future-ready.',
    },
    {
      name: 'videoFile',
      title: 'Video file',
      type: 'file',
      fieldset: 'media',
      options: {accept: VIDEO_GUIDELINE.accept},
      description: videoDescription(
        'Optional uploaded background video (homepage slide pattern). Future-ready.',
      ),
      validation: softVideoRules(),
    },

    // ── Buttons ────────────────────────────────────────────────────────────
    {
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fieldset: 'buttons',
      fields: heroCtaButtonFields.map((field) =>
        field.name === 'actionType'
          ? {...field, initialValue: 'booking'}
          : field.name === 'href'
            ? {...field, initialValue: '/booking'}
            : field.name === 'style'
              ? {...field, initialValue: 'primary'}
              : field,
      ),
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fieldset: 'buttons',
      description: 'Optional second button (often Call us).',
      fields: heroCtaButtonFields.map((field) =>
        field.name === 'enabled'
          ? {...field, initialValue: false}
          : field.name === 'style'
            ? {...field, initialValue: 'secondary'}
            : field.name === 'actionType'
              ? {...field, initialValue: 'phone'}
              : field,
      ),
      options: {collapsible: true, collapsed: true},
    },

    // ── Appearance ─────────────────────────────────────────────────────────
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      fieldset: 'appearance',
      options: {
        list: [
          {title: 'Warm (brand)', value: 'warm'},
          {title: 'Dark', value: 'dark'},
          {title: 'Light', value: 'light'},
          {title: 'Default / page', value: 'default'},
        ],
        layout: 'radio',
      },
      initialValue: 'warm',
      description: 'Color treatment for the hero surface.',
    },
    {
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      fieldset: 'appearance',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    },
    {
      name: 'layoutVariant',
      title: 'Layout variant',
      type: 'string',
      fieldset: 'appearance',
      options: {
        list: [
          {title: 'Split (text + media)', value: 'split'},
          {title: 'Full-bleed / overlay', value: 'full'},
          {title: 'Centered text', value: 'centered'},
          {title: 'Text only', value: 'text'},
          {
            title: 'Slider-ready (single frame)',
            value: 'slider',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
      description:
        'Renderer hint for a future HeroModule component. Slider-ready is one frame — homepage multi-slide stays page-owned until later.',
    },

    // ── Extras ─────────────────────────────────────────────────────────────
    {
      name: 'badges',
      title: 'Badges / chips',
      type: 'array',
      fieldset: 'extras',
      description:
        'Optional chips under CTAs (Services badges / category bullets pattern).',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayString',
            },
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}: {text?: unknown}) {
              return {title: pickStudioEn(text) || 'Badge'}
            },
          },
        },
      ],
    },

    // ── Advanced ───────────────────────────────────────────────────────────
    {
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      fieldset: 'advanced',
      options: {
        list: [
          {title: 'Visible (ready for use)', value: 'visible'},
          {title: 'Hidden / draft', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'visible',
      description:
        'Editorial flag only until pages reference this module. Does not affect the live site today.',
    },
    {
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      fieldset: 'advanced',
      initialValue: 0,
      description: 'Optional order when listing modules in Studio.',
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      rows: 3,
      fieldset: 'advanced',
      description: 'Editor-only notes. Not shown on the website.',
    },
  ],
  orderings: [
    {
      title: 'Sort order',
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
      heading: 'heading',
      layoutVariant: 'layoutVariant',
      theme: 'theme',
      visibility: 'visibility',
      media: 'image',
    },
    prepare({
      internalName,
      heading,
      layoutVariant,
      theme,
      visibility,
      media,
    }: {
      internalName?: string
      heading?: unknown
      layoutVariant?: string
      theme?: string
      visibility?: string
      media?: unknown
    }) {
      const headline = pickStudioEn(heading)
      const meta = [
        !internalName?.trim() ? headline || undefined : undefined,
        layoutVariant || undefined,
        theme || undefined,
        visibility === 'hidden' ? 'hidden' : undefined,
      ].filter(Boolean)
      return {
        title: internalName?.trim() || headline || 'Hero Module',
        subtitle: meta.join(' · ') || 'Hero Module',
        media,
      }
    },
  },
}
