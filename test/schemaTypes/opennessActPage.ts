import {GenericIcon} from './icons'

import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'

import {geoSummaryField} from './geoSummary'

import {pageSectionsFieldForGroup} from './pageSections'

import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'

import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'

import {opennessActPageEditorConfig} from '../sanity/page-editor/pages/opennessActSections'

const i18nString = {
  type: 'internationalizedArrayString' as const,
}

const i18nText = {
  type: 'internationalizedArrayText' as const,
}

export default {
  name: 'opennessActPage',
  title: 'Transparency Act 2025',
  type: 'document',
  icon: GenericIcon,
  components: {
    input: createPageSectionDocumentInput(opennessActPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'breadcrumbHome',
      title: 'Breadcrumb — home',
      group: 'hero',
      ...i18nString,
    },
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {...i18nSlugFieldFromTitle('title', {title: 'Slug', group: 'hero'})},
    {
      name: 'subtitle',
      title: 'Subtitle',
      group: 'hero',
      ...i18nText,
      description: 'Intro below the page title.',
    },
    {
      name: 'body',
      title: 'Page body',
      type: 'internationalizedArrayBlockContent',
      group: 'content',
    },
    {
      name: 'emptyMessage',
      title: 'Message when content is missing',
      type: 'internationalizedArrayText',
      group: 'content',
      description: 'Displayed when the page has no content in the selected language.',
    },
    {
      name: 'showPracticalInfoSection',
      title: 'Show practical information (FAQ)',
      type: 'boolean',
      group: 'content',
      initialValue: true,
      description: 'Shows the shared Finansiering / FAQ accordion at the bottom of the page.',
    },
    pageSectionsFieldForGroup('content', 'sharedSections', []),
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
      return {title: pickStudioEn(title) || 'Transparency Act 2025'}
    },
  },
}
