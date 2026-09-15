// Schema: Robot-assisted surgery page (/robotassistert-kirurgi) — singleton
import {ThemeIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnI18n, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {
  faqCollectionField,
  seoFieldsetProps,
  singletonPageFieldsets,
  singletonPageGroups,
} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {robotkirurgiPageEditorConfig} from '../sanity/page-editor/pages/robotkirurgiSections'
import {mediaDescription} from './mediaGuidelines'

const i18nString = {
  type: 'internationalizedArrayString',
}

const i18nText = {
  type: 'internationalizedArrayText',
}

export default {
  name: 'robotkirurgiPage',
  title: 'Robot-assisted surgery',
  type: 'document',
  icon: ThemeIcon,
  components: {
    input: createPageSectionDocumentInput(robotkirurgiPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: requiredNoEnI18n('Title'),
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        group: 'hero',
        description:
          'URL path without locale, e.g. /robotassistert-kirurgi (NO) and /robot-assisted-surgery (EN).',
      }),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayText',
      group: 'hero',
      description: 'Centered supporting line under the title.',
    },
    {
      name: 'heroMedia',
      title: 'Hero media',
      type: 'media',
      group: 'hero',
      description: mediaDescription(
        'hero',
        'Image shown under the yellow booking button.',
      ),
    },
    {
      name: 'heroImageAlt',
      title: 'Hero image alt text',
      group: 'hero',
      ...i18nString,
    },
    {
      name: 'primaryCtaLabel',
      title: 'Hero CTA — button text',
      group: 'hero',
      ...i18nString,
      description: 'Yellow button under the subtitle (e.g. Bestill time).',
    },
    {
      name: 'primaryCtaPath',
      title: 'Hero CTA — link',
      type: 'string',
      group: 'hero',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'introTexts',
      title: 'Intro paragraphs',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'introParagraph',
          title: 'Paragraph',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayText',
            },
          ],
          preview: {
            select: {title: 'text'},
            prepare({title}: {title?: unknown}) {
              return {title: pickStudioEn(title) || 'Paragraph'}
            },
          },
        },
      ],
      description: 'Opening paragraphs under the image.',
    },
    {
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'robotkirurgiContentSection',
          title: 'Content section',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'internationalizedArrayString',
            },
            {
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'sectionParagraph',
                  title: 'Paragraph',
                  fields: [
                    {
                      name: 'text',
                      title: 'Text',
                      type: 'internationalizedArrayText',
                      description: 'Use **text:** for a bold lead-in at the start of a paragraph.',
                    },
                  ],
                  preview: {
                    select: {title: 'text'},
                    prepare({title}: {title?: unknown}) {
                      return {title: pickStudioEn(title) || 'Paragraph'}
                    },
                  },
                },
              ],
            },
            {
              name: 'bulletPoints',
              title: 'Bullet list',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'sectionBullet',
                  title: 'Bullet',
                  fields: [
                    {
                      name: 'text',
                      title: 'Text',
                      type: 'internationalizedArrayString',
                    },
                  ],
                  preview: {
                    select: {title: 'text'},
                    prepare({title}: {title?: unknown}) {
                      return {title: pickStudioEn(title) || 'Bullet'}
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}: {title?: unknown}) {
              return {title: pickStudioEn(title) || 'Content section'}
            },
          },
        },
      ],
    },
    {
      name: 'quoteText',
      title: 'Quote',
      type: 'internationalizedArrayText',
      group: 'content',
    },
    {
      name: 'quoteAttribution',
      title: 'Quote attribution',
      group: 'content',
      ...i18nString,
      description: 'Name under the quote, e.g. Tom, 70 years old.',
    },
    {
      name: 'secondaryCtaLabel',
      title: 'About CTA — button text',
      group: 'content',
      ...i18nString,
      description: 'Yellow button under the quote (e.g. Bestill time).',
    },
    {
      name: 'secondaryCtaPath',
      title: 'About CTA — link',
      type: 'string',
      group: 'content',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ section title',
      group: 'content',
      ...i18nString,
    },
    faqCollectionField('content'),
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
      validation: requiredNoEnSeo,
    },
    {...geoSummaryField, ...seoFieldsetProps},
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: unknown}) {
      return {title: pickStudioEn(title) || 'Robot-assisted surgery'}
    },
  },
}
