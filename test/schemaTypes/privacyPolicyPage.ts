import {PrivacyIcon} from './icons'

import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'

import {geoSummaryField} from './geoSummary'

import {pageSectionsFieldForGroup} from './pageSections'

import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'

import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'

import {privacyPageEditorConfig} from '../sanity/page-editor/pages/privacySections'



const i18nString = {

  type: 'internationalizedArrayString' as const,

}



const i18nText = {

  type: 'internationalizedArrayText' as const,

}



export default {

  name: 'privacyPolicyPage',

  title: 'Privacy Policy',

  type: 'document',

  icon: PrivacyIcon,

  components: {

    input: createPageSectionDocumentInput(privacyPageEditorConfig),

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

      description: 'Optional intro below the page title.',

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

      description: 'Internal path without locale, e.g. /kontakt',

    },

    {

      name: 'body',

      title: 'Privacy policy body',

      type: 'internationalizedArrayBlockContent',

      group: 'content',

    },

    {

      name: 'emptyMessage',

      title: 'Message when content is missing',

      type: 'internationalizedArrayText',

      group: 'content',

      description: 'Displayed when the privacy policy has no content in the selected language.',

    },

    {

      name: 'cookiebotKey',

      title: 'Cookiebot key (legacy)',

      type: 'string',

      group: 'content',

      fieldset: 'legacy',

      description: 'Not injected on the website today. Kept for future Cookiebot integration.',

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

      return {title: pickStudioEn(title) || 'Privacy Policy'}

    },

  },

}


