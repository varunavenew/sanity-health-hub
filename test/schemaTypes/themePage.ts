// Schema: Theme Page
// Reusable schema for thematic focus area pages
import { ThemeIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'
import {pickStudioEn} from './studioPreview'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

export default {
  name: 'themePage',
  title: 'Homepage Carousel',
  type: 'document',
  icon: ThemeIcon,
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: mediaImageOptions('hero'),
      description: mediaDescription('hero'),
      validation: softImageRules('hero'),
    },
    {
      name: 'introTexts',
      title: 'Intro texts',
      type: 'array',
      of: [{ type: 'internationalizedArrayText' }],
    },
    {
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'internationalizedArrayString' },
            {
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [{ type: 'text' }],
            },
            {
              name: 'bulletPoints',
              title: 'Bullet list (optional)',
              type: 'array',
              of: [{ type: 'internationalizedArrayString' }],
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: any) {
              return { title: pickStudioEn(title) }
            },
          },
        },
      ],
    },
    {
      name: 'lifePhases',
      title: 'Life phases',
      description: "Used on the Women's Health page to show different life phases",
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Phase title', type: 'internationalizedArrayString' },
            { name: 'text', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: any) {
              return { title: pickStudioEn(title) }
            },
          },
        },
      ],
    },
    {
      name: 'ctaText',
      title: 'CTA button text',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaLink',
      title: 'CTA link',
      type: 'string',
      initialValue: '/booking',
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    geoSummaryField,
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
    prepare({ title, media }: any) {
      return { title: pickStudioEn(title) || 'Theme page', media }
    },
  },
}
