/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 * Phase 11B.1: Studio fieldsets match website sections (JSON paths unchanged).
 * Phase 14G: Studio labels, descriptions, hides, defaults, grouping only.
 * Fertility page-editor: CategoryLandingPageInput filters nested bands by section.
 */
import { i18nTitleItemPreview, requiredNoEnI18n } from './i18n'
import { CategoryLandingPageInput } from '../sanity/page-editor/components/CategoryLandingPageInput'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

/** Match Treatment editor: all landing bands collapsed by default. */
const sectionCollapsed = { collapsible: true, collapsed: true } as const

/** Default NO + EN values for new documents / new array items. */
const i18nDefault = (no: string, en: string) => [
  { _key: 'no', language: 'no', value: no },
  { _key: 'en', language: 'en', value: en },
]

const segmentTagLinkItem = {
  type: 'object',
  name: 'categoryLandingSegmentTagLink',
  title: 'Keyword link',
  fields: [
    { name: 'label', title: 'Text', ...i18nStr, validation: reqI18n('Text') },
    {
      name: 'href',
      title: 'Link (internal path)',
      type: 'string',
      validation: reqStr('Link'),
    },
  ],
  preview: i18nTitleItemPreview,
}

const segmentItem = {
  type: 'object',
  name: 'categoryLandingSegment',
  title: 'Segment',
  fields: [
    {
      name: 'id',
      title: 'ID (optional)',
      type: 'string',
      // Accordion key only — website auto-falls back. Not editor content.
      hidden: true,
    },
    { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
    { name: 'description', title: 'Text', ...i18nTxt, validation: reqI18n('Text') },
    {
      name: 'tagLinks',
      title: 'Keywords with links',
      type: 'array',
      of: [segmentTagLinkItem],
      description: 'Preferred. Clickable keywords under each card.',
    },
    {
      name: 'href',
      title: 'Card link',
      type: 'string',
      description: '“Read more” link for this card (e.g. /booking?…).',
      validation: reqStr('Link'),
    },
    {
      name: 'ctaLabel',
      title: 'Link text',
      ...i18nStr,
      description: 'Defaults to “Les mer” / “Read more” on the website if empty.',
      initialValue: i18nDefault('Les mer', 'Read more'),
    },
    {
      name: 'tags',
      title: 'Keywords (text only)',
      type: 'array',
      of: [i18nStr],
      description:
        'Legacy fallback. Prefer Keywords with links above. Used only when that list is empty.',
    },
  ],
  preview: i18nTitleItemPreview,
}

const stepItem = {
  type: 'object',
  name: 'categoryLandingStep',
  title: 'Step',
  fields: [
    { name: 'number', title: 'Number', type: 'string', validation: reqStr('Number') },
    { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
    { name: 'description', title: 'Text', ...i18nTxt, validation: reqI18n('Text') },
  ],
  preview: i18nTitleItemPreview,
}

const audienceItem = {
  type: 'object',
  name: 'categoryLandingAudience',
  title: 'Target group',
  fields: [
    { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
    { name: 'description', title: 'Text', ...i18nTxt, validation: reqI18n('Text') },
    { name: 'href', title: 'Link', type: 'string', validation: reqStr('Link') },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Couple', value: 'couple' },
          { title: 'Horizon', value: 'horizon' },
          { title: 'Arch', value: 'arch' },
          { title: 'Person', value: 'user' },
          { title: 'People', value: 'users' },
          { title: 'Clock', value: 'clock' },
        ],
      },
      validation: reqStr('Icon'),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional. When set, shown instead of the icon on the audience card.',
    },
  ],
  preview: i18nTitleItemPreview,
}

const expertAreaCard = {
  type: 'object',
  name: 'categoryLandingExpertArea',
  title: 'Card',
  fields: [
    { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
    { name: 'description', title: 'Text', ...i18nTxt, validation: reqI18n('Text') },
    { name: 'href', title: 'Link', type: 'string', validation: reqStr('Link') },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    },
    { name: 'imageAlt', title: 'Image alt text', ...i18nStr },
  ],
  preview: i18nTitleItemPreview,
}

const symptomItem = {
  type: 'object',
  name: 'categoryLandingSymptom',
  title: 'Symptom → service',
  fields: [
    { name: 'symptom', title: 'Symptom', ...i18nStr, validation: reqI18n('Symptom') },
    { name: 'service', title: 'Service', ...i18nStr, validation: reqI18n('Service') },
    { name: 'href', title: 'Link', type: 'string', validation: reqStr('Link') },
    {
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
      // Queried/mapped but not rendered by SymptomServiceSection.
      hidden: true,
    },
    {
      name: 'imageAlt',
      title: 'Image alt text',
      ...i18nStr,
      // Queried/mapped but not rendered by SymptomServiceSection.
      hidden: true,
    },
  ],
  preview: {
    select: { title: 'symptom', subtitle: 'service' },
    prepare: i18nTitleItemPreview.prepare,
  },
}

const reviewItem = {
  type: 'object',
  name: 'categoryLandingReview',
  title: 'Review',
  fields: [
    { name: 'text', title: 'Quote', ...i18nTxt, validation: reqI18n('Quote') },
    { name: 'author', title: 'Name', type: 'string', validation: reqStr('Name') },
    { name: 'date', title: 'Date / context', ...i18nStr, validation: reqI18n('Date / context') },
  ],
  preview: i18nTitleItemPreview,
}

export const categoryLandingPageField = {
  name: 'landingPage',
  title: 'Website sections',
  description:
    'Open only the section you need. Optional sections: leave empty to hide them on the website.',
  type: 'object',
  validation: (Rule: any) => Rule.required().error('Landing page content is required'),
  options: sectionCollapsed,
  components: {
    input: CategoryLandingPageInput,
  },
  fieldsets: [
    {
      name: 'hero',
      title: 'Hero — headline & buttons',
      description:
        'Headline and buttons. Media is above under Hero media (or the Hero section card).',
      options: sectionCollapsed,
    },
    {
      name: 'introduction',
      title: 'Tell us where you are',
      description: 'Life stages / segments under the hero.',
      options: sectionCollapsed,
    },
    {
      name: 'why',
      title: 'Why choose us',
      description: 'Leave empty to hide this section on the website.',
      options: sectionCollapsed,
    },
    {
      name: 'audience',
      title: 'Audience (Optional)',
      description: 'Leave empty to hide this section on the website.',
      options: sectionCollapsed,
    },
    {
      name: 'expertAreas',
      title: 'Expert Areas',
      description: 'Specialty cards with images. Different from Support (optional related cards).',
      options: sectionCollapsed,
    },
    {
      name: 'symptoms',
      title: 'What do you feel?',
      description: 'Leave empty to hide this section on the website.',
      options: sectionCollapsed,
    },
    {
      name: 'services',
      title: 'What we offer',
      description: 'These services are shown on this landing page.',
      options: sectionCollapsed,
    },
    {
      name: 'support',
      title: 'Support (Optional)',
      description: 'Leave empty to hide this section on the website.',
      options: sectionCollapsed,
    },
    {
      name: 'statistics',
      title: 'Numbers that tell a story — headings',
      description:
        'Titles for the results band. KPI numbers are under Statistics — numbers (or the Numbers section card).',
      options: sectionCollapsed,
    },
    {
      name: 'reviews',
      title: 'Reviews',
      description: 'Patient quotes on this page.',
      options: sectionCollapsed,
    },
    {
      name: 'spotlight',
      title: 'Spotlight',
      description: 'Optional mid-page highlight. Separate from the Hero button.',
      options: sectionCollapsed,
    },
    {
      name: 'journey',
      title: 'Journey (Optional)',
      description: 'Leave empty to hide this section on the website.',
      options: sectionCollapsed,
    },
    {
      name: 'advanced',
      title: 'Advanced',
      description: 'Rarely needed. Leave empty unless you know you need these.',
      options: sectionCollapsed,
    },
  ],
  fields: [
    {
      name: 'hero',
      title: 'Hero — headline & buttons',
      type: 'object',
      fieldset: 'hero',
      options: {collapsible: true, collapsed: false},
      fieldsets: [
        {
          name: 'content',
          title: 'Content',
          options: { collapsible: true, collapsed: false },
        },
        {
          name: 'buttons',
          title: 'Buttons',
          options: { collapsible: true, collapsed: false },
        },
        {
          name: 'advancedHero',
          title: 'Advanced hero settings',
          description: 'Technical booking slug and optional entry price.',
          options: sectionCollapsed,
        },
      ],
      fields: [
        {
          name: 'layout',
          title: 'Layout',
          type: 'string',
          fieldset: 'content',
          options: {
            list: [
              { title: 'Split (Text left, image right)', value: 'split' },
              { title: 'Full width banner (Title on image)', value: 'full' },
            ],
            layout: 'radio',
          },
          initialValue: 'split',
        },
        {
          name: 'eyebrow',
          title: 'Eyebrow',
          ...i18nStr,
          fieldset: 'content',
          // Queried/mapped but not rendered on TreatmentCategoryLanding today.
          hidden: true,
        },
        { name: 'heading', title: 'Heading', fieldset: 'content', ...i18nStr },
        {
          name: 'headingEmphasis',
          title: 'Heading (italic part)',
          fieldset: 'content',
          ...i18nStr,
        },
        { name: 'body', title: 'Ingress', fieldset: 'content', ...i18nTxt },
        {
          name: 'bullets',
          title: 'Quick points',
          fieldset: 'content',
          description: 'Short checkmark chips below the buttons.',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'heroBulletItem',
              title: 'Bullet',
              fields: [{ name: 'title', title: 'Label', ...i18nStr }],
              preview: i18nTitleItemPreview,
            },
          ],
        },
        {
          name: 'primaryCtaLabel',
          title: 'Primary button',
          fieldset: 'buttons',
          ...i18nStr,
          initialValue: i18nDefault('Bestill time', 'Book appointment'),
        },
        {
          name: 'secondaryCtaLabel',
          title: 'Secondary button (call)',
          fieldset: 'buttons',
          ...i18nStr,
          initialValue: i18nDefault('Ring oss', 'Call us'),
        },
        {
          name: 'heroImageAlt',
          title: 'Hero image alt text',
          fieldset: 'content',
          ...i18nStr,
        },
        {
          name: 'primaryBookingService',
          title: 'Booking service (slug)',
          type: 'string',
          fieldset: 'advancedHero',
          description:
            'Technical. Optional service slug for the booking URL. Leave empty for category-only booking.',
        },
        {
          name: 'entryPriceLabel',
          title: 'Price — label',
          fieldset: 'advancedHero',
          ...i18nStr,
        },
        {
          name: 'entryPriceValue',
          title: 'Price — value',
          fieldset: 'advancedHero',
          ...i18nStr,
        },
      ],
    },
    {
      name: 'segmentsSection',
      title: 'Tell us where you are',
      type: 'object',
      fieldset: 'introduction',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow',
          ...i18nStr,
          // Queried/mapped but not rendered on TreatmentCategoryLanding today.
          hidden: true,
        },
        { name: 'title', title: 'Heading', ...i18nStr },
        {
          name: 'titleLine2',
          title: 'Heading line 2',
          description: 'Optional second line under the heading.',
          ...i18nStr,
        },
        {
          name: 'layout',
          title: 'Display',
          type: 'string',
          options: {
            list: [
              { title: 'Accordion', value: 'accordion' },
              { title: 'Card grid', value: 'grid' },
            ],
            layout: 'radio',
          },
          initialValue: 'accordion',
          // Website always uses LifePhasesCarousel today — keep for future / migration.
          hidden: true,
        },
        {
          name: 'segments',
          title: 'Cards',
          type: 'array',
          of: [segmentItem],
        },
      ],
    },
    {
      name: 'whySection',
      title: 'Why choose us',
      type: 'object',
      fieldset: 'why',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [stepItem],
        },
        {
          name: 'image',
          title: 'Side image',
          type: 'image',
          options: { hotspot: true },
          description: 'Shown to the right of the steps.',
        },
        {
          name: 'imageAlt',
          title: 'Side image alt text',
          ...i18nStr,
        },
        {
          name: 'footerLinkLabel',
          title: 'Footer link text',
          ...i18nStr,
          description: 'E.g. “Se alle tjenester” / “See all services”.',
        },
        {
          name: 'footerLinkHref',
          title: 'Footer link URL',
          type: 'string',
          description: 'E.g. /tjenester or /priser.',
        },
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Audience',
      type: 'object',
      fieldset: 'audience',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'titleAccent', title: 'Heading (accent)', ...i18nStr },
        {
          name: 'audiences',
          title: 'Cards',
          type: 'array',
          of: [audienceItem],
        },
        {
          name: 'readMoreLabel',
          title: 'Read more text',
          ...i18nStr,
          initialValue: i18nDefault('Les mer', 'Read more'),
        },
      ],
    },
    {
      name: 'expertAreasSection',
      title: 'Expert Areas',
      type: 'object',
      fieldset: 'expertAreas',
      options: {collapsible: true, collapsed: false},
      fieldsets: [
        {
          name: 'display',
          title: 'Display',
          options: sectionCollapsed,
        },
      ],
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'readMoreLabel',
          title: 'Read more text',
          ...i18nStr,
          initialValue: i18nDefault('Les mer', 'Read more'),
        },
        {
          name: 'areas',
          title: 'Cards',
          type: 'array',
          of: [expertAreaCard],
        },
        {
          name: 'layout',
          title: 'Display',
          type: 'string',
          fieldset: 'display',
          options: {
            list: [
              { title: 'Grid', value: 'grid' },
              { title: 'Horizontal carousel (mobile)', value: 'carousel' },
            ],
            layout: 'radio',
          },
          initialValue: 'carousel',
          description: 'Carousel = swipe on mobile. Grid = same layout on all screens.',
        },
      ],
    },
    {
      name: 'symptomsSection',
      title: 'What do you feel?',
      type: 'object',
      fieldset: 'symptoms',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow',
          ...i18nStr,
          // Passed to SymptomServiceSection but not rendered.
          hidden: true,
        },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'background',
          title: 'Background',
          type: 'string',
          options: {
            list: [
              {title: 'Page background', value: 'background'},
              {title: 'Secondary tint', value: 'secondary'},
              {title: 'Brand light', value: 'brand-light'},
            ],
            layout: 'radio',
          },
          initialValue: 'background',
          description:
            'Section surface. Urology reference uses Secondary tint; Fertility uses Page background.',
        },
        {
          name: 'items',
          title: 'Symptom → service pairs',
          type: 'array',
          of: [symptomItem],
        },
      ],
    },
    {
      name: 'servicesSection',
      title: 'What we offer',
      type: 'object',
      fieldset: 'services',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow',
          ...i18nStr,
          // Queried/mapped but not rendered on TreatmentCategoryLanding today.
          hidden: true,
        },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'groups',
          title: 'Groups',
          description: 'Not the same as General → Linked treatments (hub list only).',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'categoryLandingServiceGroup',
              title: 'Service group',
              fields: [
                {
                  name: 'label',
                  title: 'Group title',
                  ...i18nStr,
                  validation: reqI18n('Group title'),
                },
                {
                  name: 'items',
                  title: 'Services',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      name: 'categoryLandingServiceItem',
                      title: 'Service',
                      fields: [
                        {
                          name: 'title',
                          title: 'Title',
                          ...i18nStr,
                          validation: reqI18n('Title'),
                        },
                        { name: 'description', title: 'Description', ...i18nStr },
                        {
                          name: 'href',
                          title: 'Link',
                          type: 'string',
                          validation: reqStr('Link'),
                        },
                      ],
                      preview: i18nTitleItemPreview,
                    },
                  ],
                },
              ],
              preview: i18nTitleItemPreview,
            },
          ],
        },
      ],
    },
    {
      name: 'supportSection',
      title: 'Support',
      type: 'object',
      fieldset: 'support',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'readMoreLabel',
          title: 'Read more text',
          ...i18nStr,
          initialValue: i18nDefault('Les mer', 'Read more'),
        },
        {
          name: 'areas',
          title: 'Cards',
          type: 'array',
          of: [expertAreaCard],
        },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Numbers that tell a story — headings',
      type: 'object',
      fieldset: 'statistics',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'categoryLabel', title: 'Category label', ...i18nStr },
        { name: 'footnote', title: 'Footnote', ...i18nStr },
      ],
    },
    {
      name: 'reviewsSection',
      title: 'Reviews',
      type: 'object',
      fieldset: 'reviews',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        {
          name: 'reviews',
          title: 'Quotes',
          type: 'array',
          of: [reviewItem],
        },
      ],
    },
    {
      name: 'spotlightSection',
      title: 'Spotlight',
      type: 'object',
      fieldset: 'spotlight',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'titleEmphasis', title: 'Heading (italic part)', ...i18nStr },
        { name: 'text', title: 'Text', ...i18nTxt },
        {
          name: 'ctaLabel',
          title: 'Button text',
          ...i18nStr,
          initialValue: i18nDefault('Bestill time', 'Book appointment'),
        },
        { name: 'ctaHref', title: 'Button link', type: 'string' },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        },
        { name: 'imageAlt', title: 'Image alt text', ...i18nStr },
      ],
    },
    {
      name: 'journeySection',
      title: 'Journey',
      type: 'object',
      fieldset: 'journey',
      options: {collapsible: true, collapsed: false},
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [stepItem],
        },
        {
          name: 'ctaLabel',
          title: 'Button text',
          ...i18nStr,
          initialValue: i18nDefault('Bestill time', 'Book appointment'),
        },
        { name: 'ctaHref', title: 'Button link', type: 'string' },
      ],
    },
    {
      name: 'sectionOrder',
      title: 'Section order',
      fieldset: 'advanced',
      description:
        'Reserved. Website uses a default order today. Leave empty. Do not edit unless Engineering asks.',
      type: 'array',
      of: [{ type: 'string' }],
      // Not projected by CATEGORY_LANDING_GROQ yet — editing has no frontend effect.
      hidden: true,
      options: {
        list: [
          { title: 'Life stages / segments', value: 'segments' },
          { title: 'Why choose us', value: 'why' },
          { title: 'Audience', value: 'audiences' },
          { title: 'Areas of expertise', value: 'expertAreas' },
          { title: 'Symptoms', value: 'symptoms' },
          { title: 'Services on this page', value: 'services' },
          { title: 'Support', value: 'support' },
          { title: 'Statistics', value: 'results' },
          { title: 'Reviews', value: 'reviews' },
          { title: 'Spotlight', value: 'spotlight' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Journey', value: 'journey' },
        ],
      },
    },
    {
      name: 'breadcrumbHomeLabel',
      title: 'Breadcrumb — home',
      fieldset: 'advanced',
      type: 'internationalizedArrayString',
      description:
        'Optional override. Website falls back to translated Home / Hjem when empty — leave blank.',
      // Prefer i18n common.breadcrumbHome; keep field for rare overrides / migration.
      hidden: true,
    },
    {
      name: 'srOnlyTitle',
      title: 'Hidden H1 (SEO)',
      fieldset: 'advanced',
      description: 'Screen-reader / SEO H1. Meta tags and GEO summary are under the SEO tab.',
      type: 'internationalizedArrayString',
    },
  ],
}
