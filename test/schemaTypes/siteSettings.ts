// Schema: Site Settings
// Global settings: navigation menu, contact info, social media, 404 page
import { SettingsIcon } from './icons'
import { pickNo, requiredNoEnI18n } from './i18n'

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: SettingsIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'navigation', title: 'Navigasjon' },
    { name: 'footer', title: 'Footer' },
    { name: 'social', title: 'Social media' },
    { name: 'notFound', title: '404 page' },
    { name: 'treatment', title: 'Treatment page' },
  ],
  fields: [
    // ── General ──
    {
      name: 'treatmentPageUi',
      title: 'Generic treatment page',
      type: 'object',
      group: 'treatment',
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'notFoundTitle',
          title: 'Not found — title',
          type: 'internationalizedArrayString',
        },
        {
          name: 'notFoundBody',
          title: 'Not found — text',
          type: 'internationalizedArrayText',
        },
        {
          name: 'backLabel',
          title: 'Back link',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'title',
      title: 'Site name',
      type: 'string',
      group: 'general',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'general',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'general',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'general',
      description: 'Short address text for footer (e.g. "Oslo · Bekkestua · Moss · Moelv")',
    },

    // ── Navigation ──
    {
      name: 'mainNavigation',
      title: 'Main menu',
      type: 'array',
      group: 'navigation',
      description: 'Menu items displayed in the header. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Menyelement',
          fields: [
            {
              name: 'label',
              title: 'Text',
              type: 'internationalizedArrayString',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'navId',
              title: 'Meny-ID (fallback)',
              type: 'string',
              description:
                'Optional. Used for automatic translation when English text is missing (e.g. services, pricing).',
              options: {
                list: [
                  { title: 'Services', value: 'services' },
                  { title: 'Pricing', value: 'pricing' },
                  { title: 'Insurance', value: 'insurance' },
                  { title: 'News', value: 'news' },
                  { title: 'About us', value: 'about' },
                  { title: 'Clinics', value: 'clinics' },
                  { title: 'Contact', value: 'contact' },
                  { title: 'Specialists', value: 'specialists' },
                ],
              },
            },
            {
              name: 'path',
              title: 'Link',
              type: 'internationalizedArrayString',
              description:
                'Automatically synchronized from the page\'s URL slug when you publish (e.g. Services, Prices, Contact). You can still edit manually; the next publication of the page overwrites the link again.',
              validation: (Rule: any) => Rule.required(),
              readOnly: ({ parent }: { parent?: { navId?: string } }) =>
                Boolean(
                  parent?.navId &&
                    [
                      'services',
                      'pricing',
                      'insurance',
                      'news',
                      'about',
                      'clinics',
                      'contact',
                      'specialists',
                    ].includes(parent.navId),
                ),
            },
            {
              name: 'isServicesDropdown',
              title: 'Is services menu?',
              type: 'boolean',
              description: 'Enable to show services dropdown instead of regular link',
              initialValue: false,
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'path' },
            prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
              const pathStr =
                typeof subtitle === 'string'
                  ? subtitle
                  : pickNo(subtitle)
              return { title: pickNo(title) || 'Menyelement', subtitle: pathStr }
            },
          },
        },
      ],
    },
    {
      name: 'ctaButton',
      title: 'CTA button',
      type: 'object',
      group: 'navigation',
      description: 'Action button in the header (e.g. "Book appointment")',
      fields: [
        {
          name: 'label',
          title: 'Text',
          type: 'internationalizedArrayString',
        },
        {
          name: 'path',
          title: 'Link',
          type: 'internationalizedArrayString',
          description: 'Internal path per language, e.g. NO: /booking · EN: /book-appointment',
          initialValue: undefined,
        },
      ],
    },

    // ── Footer ──
    {
      name: 'footerAboutLinks',
      title: 'About CMedical links (footer)',
      type: 'array',
      group: 'footer',
      description: 'Links displayed in the \'About CMedical\' column in the footer. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'footerLink',
          title: 'Footer link',
          fields: [
            {
              name: 'label',
              title: 'Text',
              type: 'internationalizedArrayString',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'navId',
              title: 'Meny-ID (fallback)',
              type: 'string',
              options: {
                list: [
                  { title: 'About us', value: 'about' },
                  { title: 'Specialists', value: 'specialists' },
                  { title: 'Pricing', value: 'pricing' },
                  { title: 'Insurance', value: 'insurance' },
                  { title: 'News', value: 'news' },
                ],
              },
            },
            {
              name: 'path',
              title: 'Link',
              type: 'internationalizedArrayString',
              description:
                'Automatically synchronized from the page\'s URL slug upon publishing when Menu ID is set.',
              validation: (Rule: any) => Rule.required(),
              readOnly: ({ parent }: { parent?: { navId?: string } }) =>
                Boolean(
                  parent?.navId &&
                    ['about', 'specialists', 'pricing', 'insurance', 'news'].includes(
                      parent.navId,
                    ),
                ),
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'path' },
            prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
              const pathStr =
                typeof subtitle === 'string'
                  ? subtitle
                  : pickNo(subtitle)
              return { title: pickNo(title) || 'Footer link', subtitle: pathStr }
            },
          },
        },
      ],
    },

    // ── Social Media ──
    {
      name: 'socialMedia',
      title: 'Social media',
      type: 'object',
      group: 'social',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'twitter',
          title: 'Twitter / X URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
      ],
    },

    // ── 404 Not Found Page ──
    {
      name: 'notFoundTitle',
      title: 'Heading',
      type: 'string',
      group: 'notFound',
      description: 'Heading on the 404 page',
      initialValue: 'Siden ble ikke funnet',
    },
    {
      name: 'notFoundText',
      title: 'Body text',
      type: 'text',
      group: 'notFound',
      description: 'Explanatory text on the 404 page',
      initialValue: 'Sorry, we cannot find the page you are looking for. It may have been moved or deleted.',
    },
    {
      name: 'notFoundImage',
      title: 'Image',
      type: 'image',
      group: 'notFound',
      description: 'Optional image displayed on the 404 page',
      options: { hotspot: true },
    },
    {
      name: 'notFoundCtaLabel',
      title: 'Button Text',
      type: 'string',
      group: 'notFound',
      initialValue: 'Back to homepage',
    },
    {
      name: 'notFoundCtaPath',
      title: 'Button link',
      type: 'string',
      group: 'notFound',
      initialValue: '/',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
