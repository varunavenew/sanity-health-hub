// Schema: Guide page (/guide) — curated landing (singleton)
import {GenericIcon} from './icons'
import {
  i18nSlugFieldFromTitle,
  pickNo,
  requiredNoEnBlockContent,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {guidePageEditorConfig} from '../sanity/page-editor/pages/guideSections'

const GUIDE_SHARED_SECTIONS = ['pageSectionBookingCta'] as const

const i18nString = {
  type: 'internationalizedArrayString',
}

const i18nText = {
  type: 'internationalizedArrayText',
}

export default {
  name: 'guidePage',
  title: 'Guide page',
  type: 'document',
  icon: GenericIcon,
  components: {
    input: createPageSectionDocumentInput(guidePageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'breadcrumbHome',
      title: 'Breadcrumb — home',
      group: 'hero',
      ...i18nString,
      description: 'Optional. Shown in the hero breadcrumb (e.g. “Home”).',
    },
    {
      name: 'heroTitle',
      title: 'Hero – title',
      type: 'internationalizedArrayString',
      group: 'hero',
      description: 'Optional page hero title. Categories Intro is separate.',
    },
    {
      ...i18nSlugFieldFromTitle('heroTitle', {
        group: 'hero',
        description: 'URL path without locale, e.g. /guide (NO and EN).',
      }),
    },
    {
      name: 'heroSubtitle',
      title: 'Hero – subtitle',
      type: 'internationalizedArrayText',
      group: 'hero',
    },
    {
      name: 'heroMedia',
      title: 'Hero media',
      type: 'media',
      group: 'hero',
      description:
        'Optional hero image or video. Upload Video takes priority over Video URL. Leave empty for title-only hero.',
    },
    {
      name: 'primaryCtaLabel',
      title: 'Hero CTA — button text',
      group: 'hero',
      ...i18nString,
      description: 'Optional hero call-to-action. Leave blank to hide the button.',
    },
    {
      name: 'primaryCtaPath',
      title: 'Hero CTA — link',
      type: 'string',
      group: 'hero',
      description: 'Internal path without locale, e.g. /booking',
    },
    {
      name: 'categoriesIntroTitle',
      title: 'Categories intro – title',
      type: 'internationalizedArrayString',
      group: 'content',
      description:
        'Page-owned heading above Guide Sections (e.g. Our Treatments).',
    },
    {
      name: 'categoriesIntroDescription',
      title: 'Categories intro – description',
      type: 'internationalizedArrayText',
      group: 'content',
      description:
        'Page-owned supporting text under the categories intro title.',
    },
    {
      name: 'guideSections',
      title: 'Guide sections',
      type: 'array',
      group: 'content',
      description:
        'Repeatable marketing sections rendered below Categories Intro in this order.',
      of: [
        {
          type: 'object',
          // Named member type so API/migration-written items include `_type: "guideSection"`.
          name: 'guideSection',
          title: 'Guide section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: requiredNoEnI18n('Title'),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'internationalizedArrayBlockContent',
              description:
                'Full section body: paragraphs and bullet lists. Edit everything here.',
              validation: requiredNoEnBlockContent('Description'),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({title, media}: {title?: unknown; media?: unknown}) {
              return {
                title: pickNo(title) || 'Guide section',
                media,
              }
            },
          },
        },
      ],
    },
    {
      ...pageSectionsFieldForGroup('content', 'sharedSections', GUIDE_SHARED_SECTIONS),
      validation: (Rule: any) => Rule.required().min(1),
    },
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
    select: {title: 'heroTitle'},
    prepare({title}: {title?: unknown}) {
      return {title: pickNo(title) || 'Guide'}
    },
  },
}
