// Schema: About Page
import {GenericIcon} from './icons'
import {i18nSlugFieldFromTitle} from './i18n'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {aboutPageEditorConfig} from '../sanity/page-editor/pages/aboutSections'

const ABOUT_SHARED_SECTIONS = [
  'pageSectionSpecialists',
  'pageSectionArticles',
  'pageSectionBookingCta',
] as const

export default {
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  icon: GenericIcon,
  components: {
    input: createPageSectionDocumentInput(aboutPageEditorConfig),
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
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      group: 'hero',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
      group: 'hero',
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    },
    {
      name: 'heroImageAlt',
      title: 'Hero image – alt text',
      type: 'internationalizedArrayString',
      group: 'hero',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
      group: 'content',
    },
    {
      name: 'clinicsSection',
      title: 'Section — clinics',
      description:
        'Clinic grid on About us. Empty clinic list = all published clinics.',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'showSection',
          title: 'Show section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Heading',
          type: 'internationalizedArrayString',
          description: 'For example: "Our clinics"',
        },
        {
          name: 'clinics',
          title: 'Clinics (optional)',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'clinicPage'}]}],
          description:
            'Choose the order. Leave empty to list all published clinics automatically.',
        },
      ],
    },
    {
      name: 'values',
      title: 'Our values (legacy)',
      description:
        'Not rendered on the website today. Kept for rollback only.',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'icon', title: 'Icon', type: 'string'},
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
        },
      ],
    },
    pageSectionsFieldForGroup('content', 'sharedSections', ABOUT_SHARED_SECTIONS),
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
    },
    {...geoSummaryField, ...seoFieldsetProps},
  ],
  preview: {
    select: {title: 'title', media: 'heroImage'},
    prepare({title, media}: any) {
      const titleStr = Array.isArray(title)
        ? title.find((t: any) => (t.language || t._key) === 'no')?.value ||
          title[0]?.value ||
          'About us'
        : title || 'About us'
      return {title: titleStr, media}
    },
  },
}
