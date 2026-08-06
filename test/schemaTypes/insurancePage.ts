// Schema: Insurance Page (Forsikring)
import {InsuranceIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {insurancePageEditorConfig} from '../sanity/page-editor/pages/insuranceSections'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const INSURANCE_SHARED_SECTIONS = ['pageSectionArticles', 'pageSectionBookingCta'] as const

const i18nItemPreview = {
  select: {title: 'title', subtitle: 'description'},
  prepare({title, subtitle}: any) {
    return {
      title: pickStudioEn(title) || 'Unnamed',
      subtitle: pickStudioEn(subtitle) || undefined,
    }
  },
}

export default {
  name: 'insurancePage',
  title: 'Insurance',
  type: 'document',
  icon: InsuranceIcon,
  components: {
    input: createPageSectionDocumentInput(insurancePageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {...i18nSlugFieldFromTitle('title', {group: 'hero'})},
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: mediaImageOptions('hero'),
      description: mediaDescription('hero'),
      validation: softImageRules('hero'),
    },
    {
      name: 'introText',
      title: 'Subtitle / intro text',
      type: 'internationalizedArrayText',
      group: 'hero',
    },
    {
      name: 'partnersLocalized',
      title: 'Insurance partners',
      type: 'array',
      group: 'content',
      description: 'Partner names shown on the dedicated Insurance page body.',
      of: [
        {
          type: 'object',
          fields: [{name: 'name', title: 'Name', type: 'internationalizedArrayString'}],
          preview: {
            select: {name: 'name'},
            prepare({name}: any) {
              return {title: pickStudioEn(name) || 'Partner'}
            },
          },
        },
      ],
    },
    {
      name: 'steps',
      title: 'How it works — steps',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'internationalizedArrayString'},
            {name: 'description', title: 'Description', type: 'internationalizedArrayText'},
          ],
          preview: i18nItemPreview,
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'internationalizedArrayString'},
            {name: 'description', title: 'Description', type: 'internationalizedArrayText'},
          ],
          preview: i18nItemPreview,
        },
      ],
    },
    {
      name: 'partners',
      title: 'Insurance partners (plain text)',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      of: [{type: 'string'}],
      hidden: () => true,
    },
    pageSectionsFieldForGroup('content', 'sharedSections', INSURANCE_SHARED_SECTIONS),
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
    select: {title: 'title', media: 'heroImage'},
    prepare({title, media}: any) {
      return {title: pickStudioEn(title) || 'Insurance', media}
    },
  },
}
