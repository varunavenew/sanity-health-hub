/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 */
import { i18nTitleItemPreview, requiredNoEnI18n } from './i18n'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

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
    },
    { name: 'imageAlt', title: 'Image alt text', ...i18nStr },
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
  description: 'Content for the marketing landing page, e.g. /fertilitet. Segments and Why choose us are required; other sections are optional.',
  type: 'object',
  validation: (Rule: any) => Rule.required().error('Landing page content is required'),
  fields: [
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
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
        { name: 'heading', title: 'Heading', ...i18nStr },
        { name: 'headingEmphasis', title: 'Heading (italic part)', ...i18nStr },
        { name: 'body', title: 'Ingress', ...i18nTxt },
        {
          name: 'bullets',
          title: 'Hurtigpunkter',
          description: 'Short checkmark chips shown below the hero CTA buttons.',
          type: 'array',
          of: [{
            type: 'object',
            name: 'heroBulletItem',
            title: 'Bullet',
            fields: [
              { name: 'title', title: 'Label', ...i18nStr },
            ],
            preview: i18nTitleItemPreview,
          }],
        },
        { name: 'primaryCtaLabel', title: 'Primary button', ...i18nStr },
        { name: 'secondaryCtaLabel', title: 'Secondary button (call)', ...i18nStr },
        { name: 'heroImageAlt', title: 'Hero image alt text', ...i18nStr },
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
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
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
        },
      ],
    },
    {
      name: 'whySection',
      title: 'Why choose us',
      type: 'object',
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
          title: 'Sidebilde',
          type: 'image',
          options: { hotspot: true },
          description: 'Displayed to the right of the step list in the \'Why choose us\' section.',
        },
        {
          name: 'imageAlt',
          title: 'Sidebar image alt text',
          ...i18nStr,
        },
        {
          name: 'footerLinkLabel',
          title: 'Footer link text',
          ...i18nStr,
          description: 'Example: NO "Se alle tjenester" / EN "See all services".',
        },
        {
          name: 'footerLinkHref',
          title: 'Footer link URL',
          type: 'string',
          description: 'Internal link example: /tjenester or /priser. External link example: https://www.cmedical.no.',
        },
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Target groups',
      type: 'object',
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
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'items',
          title: 'Rader',
          type: 'array',
          of: [symptomItem],
        },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Results',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
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
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
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
      title: 'Spotlight (CTA-blokk)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', ...i18nStr },
        { name: 'titleEmphasis', title: 'Heading (italic part)', ...i18nStr },
        { name: 'text', title: 'Text', ...i18nTxt },
        { name: 'ctaLabel', title: 'Button Text', ...i18nStr },
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
        { name: 'ctaLabel', title: 'Button Text', ...i18nStr },
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
          { title: 'Segments / life stages', value: 'segments' },
          { title: 'Why choose us (split)', value: 'why' },
          { title: 'Target groups (cards)', value: 'audiences' },
          { title: 'Areas of expertise', value: 'expertAreas' },
          { title: 'Symptom checker', value: 'symptoms' },
          { title: 'What we offer', value: 'services' },
          { title: 'Support services', value: 'support' },
          { title: 'Results / statistics', value: 'results' },
          { title: 'Patient reviews', value: 'reviews' },
          { title: 'Spotlight / CTA-blokk', value: 'spotlight' },
          { title: 'Patient journey', value: 'journey' },
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
