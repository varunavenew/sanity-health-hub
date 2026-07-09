/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 */
import { i18nTitleItemPreview, requiredNoEnI18n } from './i18n'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

function hasActualContent(val: any): boolean {
  if (val === undefined || val === null || val === '') return false
  if (Array.isArray(val)) {
    return val.some((item) => hasActualContent(item))
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val).filter((k) => k !== '_type' && k !== '_key' && k !== '_ref')
    return keys.some((k) => hasActualContent(val[k]))
  }
  return true
}

const reqI18nIfActive = (fieldLabel: string) => (Rule: any) =>
  Rule.custom((value: any, context: any) => {
    const parent = context.parent
    if (!parent) return true
    const parentKeys = Object.keys(parent).filter((k) => k !== '_type' && k !== '_key')
    const parentHasValues = parentKeys.some((k) => hasActualContent(parent[k]))
    if (!parentHasValues) return true

    if (!value || !Array.isArray(value)) return `${fieldLabel} is required`
    const noVal = value.find((v: any) => (v.language ?? v._key) === 'no')?.value
    const enVal = value.find((v: any) => (v.language ?? v._key) === 'en')?.value
    if (!noVal?.trim()) return `${fieldLabel} (Norwegian) is required`
    if (!enVal?.trim()) return `${fieldLabel} (English) is required`
    return true
  })

const reqStrIfActive = (fieldLabel: string) => (Rule: any) =>
  Rule.custom((value: any, context: any) => {
    const parent = context.parent
    if (!parent) return true
    const parentKeys = Object.keys(parent).filter((k) => k !== '_type' && k !== '_key')
    const parentHasValues = parentKeys.some((k) => hasActualContent(parent[k]))
    if (!parentHasValues) return true
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return `${fieldLabel} is required`
    }
    return true
  })

const reqArrayIfActive = (fieldLabel: string, minCount = 1) => (Rule: any) =>
  Rule.custom((value: any, context: any) => {
    const parent = context.parent
    if (!parent) return true
    const parentKeys = Object.keys(parent).filter((k) => k !== '_type' && k !== '_key')
    const parentHasValues = parentKeys.some((k) => hasActualContent(parent[k]))
    if (!parentHasValues) return true
    if (!Array.isArray(value) || value.length < minCount) {
      return `Add at least ${minCount} item(s) to ${fieldLabel}`
    }
    return true
  })

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
    { name: 'id', title: 'ID (optional)', type: 'string' },
    { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
    { name: 'description', title: 'Text', ...i18nTxt, validation: reqI18n('Text') },
    {
      name: 'tags',
      title: 'Keywords (text only)',
      type: 'array',
      of: [i18nStr],
      description: 'Used if tagLinks is not filled out.',
    },
    {
      name: 'tagLinks',
      title: 'Keywords with links',
      type: 'array',
      of: [segmentTagLinkItem],
      description: 'Displayed as clickable links in accordion view.',
    },
    { name: 'ctaLabel', title: 'Link Text', ...i18nStr, validation: reqI18n('Link Text') },
    {
      name: 'href',
      title: 'Link (internal path)',
      type: 'string',
      description: 'E.g. /booking?category=fertility&service=fertility-check',
      validation: reqStr('Link'),
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
    { name: 'imageAlt', title: 'Image alt text', ...i18nStr, validation: reqI18n('Image alt text') },
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
    },
    { name: 'imageAlt', title: 'Image alt text', ...i18nStr, validation: reqI18n('Image alt text') },
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
  title: 'Landing page (category)',
  description: 'Content for the marketing landing page, e.g. /fertilitet. All fields are required in Norwegian and English.',
  type: 'object',
  validation: (Rule: any) => Rule.required().error('Landing page content is required'),
  fields: [
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Hero section is required'),
      fields: [
        {
          name: 'layout',
          title: 'Layout view',
          type: 'string',
          options: {
            list: [
              { title: 'Split (Text left, image right)', value: 'split' },
              { title: 'Full width banner (Title on image)', value: 'full' },
            ],
            layout: 'radio',
          },
          initialValue: 'split',
        },
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'heading', title: 'Heading', ...i18nStr, validation: reqI18n('Heading') },
        { name: 'headingEmphasis', title: 'Heading (italic part)', ...i18nStr },
        { name: 'body', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'bullets',
          title: 'Hurtigpunkter',
          type: 'array',
          of: [i18nStr],
        },
        { name: 'primaryCtaLabel', title: 'Primary button', ...i18nStr, validation: reqI18n('Primary button') },
        { name: 'secondaryCtaLabel', title: 'Secondary button (call)', ...i18nStr, validation: reqI18n('Secondary button') },
        { name: 'heroImageAlt', title: 'Hero image alt text', ...i18nStr, validation: reqI18n('Hero image alt text') },
        {
          name: 'primaryBookingService',
          title: 'Booking service (slug)',
          type: 'string',
          description: 'Optional service slug for primary button, e.g. general-examination',
        },
        { name: 'entryPriceLabel', title: 'Price — label', ...i18nStr },
        { name: 'entryPriceValue', title: 'Price — value', ...i18nStr },
      ],
    },
    {
      name: 'segmentsSection',
      title: 'Segments',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('The \'Segments\' section is required'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18n('Heading') },
        { name: 'titleLine2', title: 'Heading line 2', ...i18nStr },
        {
          name: 'layout',
          title: 'Visning',
          type: 'string',
          options: {
            list: [
              { title: 'Accordion', value: 'accordion' },
              { title: 'Card grid', value: 'grid' },
            ],
            layout: 'radio',
          },
          initialValue: 'accordion',
        },
        {
          name: 'segments',
          title: 'Cards',
          type: 'array',
          of: [segmentItem],
          validation: (Rule: any) => Rule.required().min(1).error('Add at least one segment'),
        },
      ],
    },
    {
      name: 'whySection',
      title: 'Why choose us',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('The \'Why choose us\' section is required'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18n('Heading') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [stepItem],
          validation: (Rule: any) => Rule.required().min(1).error('Add at least one step'),
        },
        {
          name: 'image',
          title: 'Sidebilde',
          type: 'image',
          options: { hotspot: true },
          description: 'Displayed to the right of the step list in the \'Why choose us\' section.',
          validation: (Rule: any) => Rule.required().error('Sidebar image is required'),
        },
        {
          name: 'imageAlt',
          title: 'Sidebar image alt text',
          ...i18nStr,
          validation: reqI18n('Sidebar image alt text'),
        },
        { name: 'footerLinkLabel', title: 'Footer link text', ...i18nStr, validation: reqI18n('Footer link text') },
        { name: 'footerLinkHref', title: 'Footer link URL', type: 'string', validation: reqStr('Footer link URL') },
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Target groups',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18nIfActive('Heading') },
        { name: 'titleAccent', title: 'Heading (accent)', ...i18nStr },
        {
          name: 'audiences',
          title: 'Cards',
          type: 'array',
          of: [audienceItem],
          validation: reqArrayIfActive('Target groups', 1),
        },
        { name: 'readMoreLabel', title: 'Read more text', ...i18nStr },
      ],
    },
    {
      name: 'expertAreasSection',
      title: 'Areas of expertise',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'readMoreLabel', title: 'Read more text', ...i18nStr },
        {
          name: 'layout',
          title: 'Visning',
          type: 'string',
          options: {
            list: [
              { title: 'Rutenett', value: 'grid' },
              { title: 'Horisontal karusell (mobil)', value: 'carousel' },
            ],
            layout: 'radio',
          },
          initialValue: 'carousel',
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
      name: 'symptomsSection',
      title: 'Symptomsjekk',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18nIfActive('Heading') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18nIfActive('Ingress') },
        {
          name: 'items',
          title: 'Rader',
          type: 'array',
          of: [symptomItem],
          validation: reqArrayIfActive('Symptom-rader', 1),
        },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Results',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18nIfActive('Heading') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18nIfActive('Ingress') },
        { name: 'categoryLabel', title: 'Category label', ...i18nStr },
        { name: 'footnote', title: 'Footnote', ...i18nStr },
      ],
    },
    {
      name: 'servicesSection',
      title: 'Services',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18nIfActive('Heading') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18nIfActive('Ingress') },
        {
          name: 'groups',
          title: 'Groups',
          description: 'Grouped services list in the desired display order.',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'categoryLandingServiceGroup',
              title: 'Service group',
              fields: [
                { name: 'label', title: 'Gruppetittel', ...i18nStr, validation: reqI18n('Gruppetittel') },
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
                        { name: 'title', title: 'Title', ...i18nStr, validation: reqI18n('Title') },
                        { name: 'description', title: 'Description', ...i18nStr },
                        { name: 'href', title: 'Link', type: 'string', validation: reqStr('Link') },
                      ],
                      preview: i18nTitleItemPreview,
                    },
                  ],
                },
              ],
              preview: i18nTitleItemPreview,
            },
          ],
          validation: reqArrayIfActive('Service groups', 1),
        },
      ],
    },
    {
      name: 'supportSection',
      title: 'Support / additional services',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'readMoreLabel', title: 'Read more text', ...i18nStr },
        {
          name: 'areas',
          title: 'Cards',
          type: 'array',
          of: [expertAreaCard],
        },
      ],
    },
    {
      name: 'reviewsSection',
      title: 'Reviews',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr, validation: reqI18nIfActive('Heading') },
        {
          name: 'reviews',
          title: 'Quotes',
          type: 'array',
          of: [reviewItem],
          validation: reqArrayIfActive('Reviews', 1),
        },
      ],
    },
    {
      name: 'spotlightSection',
      title: 'Spotlight (CTA-blokk)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'titleEmphasis', title: 'Heading (italic part)', ...i18nStr },
        { name: 'text', title: 'Text', ...i18nTxt },
        { name: 'ctaLabel', title: 'Button Text', ...i18nStr, validation: reqI18nIfActive('Button Text') },
        { name: 'ctaHref', title: 'Button link', type: 'string', validation: reqStrIfActive('Button link') },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        },
        { name: 'imageAlt', title: 'Image alt text', ...i18nStr, validation: reqI18nIfActive('Image alt text') },
      ],
    },
    {
      name: 'journeySection',
      title: 'Patient journey (optional, after reviews)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [stepItem],
        },
        { name: 'ctaLabel', title: 'Button Text', ...i18nStr, validation: reqI18nIfActive('Button Text') },
        { name: 'ctaHref', title: 'Button link', type: 'string' },
      ],
    },
    {
      name: 'sectionOrder',
      title: 'Section order',
      description:
        'Choose and sort which sections are shown on the page. Drag to reorder. The hero is always shown first and is not included here. Leave empty to use the default order.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Segments / life stages',   value: 'segments'    },
          { title: 'Why choose us (split)',    value: 'why'         },
          { title: 'Target groups (cards)',    value: 'audiences'   },
          { title: 'Areas of expertise',       value: 'expertAreas' },
          { title: 'Symptom checker',         value: 'symptoms'    },
          { title: 'What we offer',           value: 'services'    },
          { title: 'Support services',        value: 'support'     },
          { title: 'Results / statistics',    value: 'results'     },
          { title: 'Patient reviews',         value: 'reviews'     },
          { title: 'Spotlight / CTA-blokk',   value: 'spotlight'   },
          { title: 'Patient journey',         value: 'journey'     },
        ],
      },
    },
    {
      name: 'breadcrumbHomeLabel',
      title: 'Breadcrumb — home',
      type: 'internationalizedArrayString',
    },
    {
      name: 'srOnlyTitle',
      title: 'Hidden H1 (SEO)',
      type: 'internationalizedArrayString',
    },
  ],
}
