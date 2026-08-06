// Schema: Services Page
import {TreatmentIcon} from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {
  faqCollectionField,
  seoFieldsetProps,
  singletonPageFieldsets,
  singletonPageGroups,
} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {servicesPageEditorConfig} from '../sanity/page-editor/pages/servicesSections'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const SERVICES_SHARED_SECTIONS = [
  'pageSectionSpecialists',
  'pageSectionArticles',
  'pageSectionBookingCta',
] as const

const i18nString = {
  type: 'internationalizedArrayString',
}

const i18nText = {
  type: 'internationalizedArrayText',
}

export default {
  name: 'servicesPage',
  title: 'Services',
  type: 'document',
  icon: TreatmentIcon,
  components: {
    input: createPageSectionDocumentInput(servicesPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'breadcrumbHome',
      title: 'Breadcrumb — home',
      group: 'hero',
      ...i18nString,
      validation: requiredNoEnI18n('Breadcrumb — home'),
    },
    {
      name: 'title',
      title: 'Page title (H1)',
      group: 'hero',
      ...i18nString,
      validation: requiredNoEnI18n('Page Title'),
    },
    {...i18nSlugFieldFromTitle('title', {group: 'hero'})},
    {
      name: 'eyebrow',
      title: 'Eyebrow above title',
      description: 'Small label above the main heading',
      group: 'hero',
      ...i18nString,
      validation: requiredNoEnI18n('Eyebrow'),
    },
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
      group: 'hero',
      ...i18nText,
      validation: requiredNoEnI18n('Intro text'),
    },
    {
      name: 'badges',
      title: 'Hero badges',
      description: 'Badges shown with the Services hero (dedicated Badges section).',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Text',
              ...i18nString,
              validation: requiredNoEnI18n('Badge text'),
            },
          ],
          preview: {
            select: {label: 'label'},
            prepare({label}: {label?: unknown}) {
              return {title: pickStudioEn(label) || 'Badge'}
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'searchPlaceholder',
      title: 'Search field placeholder',
      group: 'content',
      ...i18nString,
      validation: requiredNoEnI18n('Search field placeholder'),
    },
    {
      name: 'featuredSectionTitle',
      title: 'Featured services heading',
      group: 'content',
      ...i18nString,
      validation: requiredNoEnI18n('Selected services heading'),
    },
    {
      name: 'featuredCategories',
      title: 'Featured categories (image cards)',
      type: 'array',
      group: 'content',
      of: [{type: 'reference', to: [{type: 'treatmentCategory'}]}],
      validation: (Rule: any) => Rule.required().min(1).unique(),
    },
    {
      name: 'moreServicesSection',
      title: 'More services section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow',
          ...i18nString,
          validation: requiredNoEnI18n('More services — eyebrow'),
        },
        {
          name: 'title',
          title: 'Title',
          ...i18nString,
          validation: requiredNoEnI18n('More services — title'),
        },
        {
          name: 'description',
          title: 'Description',
          ...i18nText,
          validation: requiredNoEnI18n('More services — description'),
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'moreServicesCategories',
      title: 'More services — categories',
      description:
        "Select categories under 'More services'. Use 'Treatment list' to show all treatments in a category.",
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'moreServicesCategory',
          title: 'Category',
          fields: [
            {
              name: 'category',
              title: 'Category',
              type: 'reference',
              to: [{type: 'treatmentCategory'}],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'displayMode',
              title: 'Display mode',
              type: 'string',
              options: {
                list: [
                  {title: 'Link to category', value: 'categoryLink'},
                  {title: 'List treatments', value: 'treatmentsList'},
                ],
                layout: 'radio',
              },
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              categoryId: 'category.categoryId',
              categoryTitle: 'category.title',
              displayMode: 'displayMode',
            },
            prepare({
              categoryId,
              categoryTitle,
              displayMode,
            }: {
              categoryId?: string
              categoryTitle?: unknown
              displayMode?: string
            }) {
              const mode =
                displayMode === 'treatmentsList' ? 'Treatment list' : 'Category link'
              const label = pickStudioEn(categoryTitle) || categoryId || 'Select category'
              return {title: label, subtitle: mode}
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'emptyCategoriesMessage',
      title: 'Message when categories are missing',
      group: 'content',
      ...i18nText,
      validation: requiredNoEnI18n('Message when categories are missing'),
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ — section title',
      group: 'content',
      ...i18nString,
      validation: requiredNoEnI18n('FAQ — section title'),
    },
    faqCollectionField('content'),
    {
      name: 'faqs',
      title: 'Previous FAQ list',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      of: [
        {type: 'reference', to: [{type: 'faq'}]},
        {
          type: 'object',
          name: 'servicesFaq',
          title: 'Inline FAQ',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'internationalizedArrayString',
              validation: requiredNoEnI18n('FAQ Question'),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'internationalizedArrayText',
              validation: requiredNoEnI18n('FAQ answer'),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
      hidden: () => true,
    },
    pageSectionsFieldForGroup('content', 'sharedSections', SERVICES_SHARED_SECTIONS),
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
      return {title: pickStudioEn(title) || 'Services'}
    },
  },
}
