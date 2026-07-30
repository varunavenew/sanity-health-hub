// Schema: Careers listing page (Karriere)
import {GenericIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {seoFieldsetProps, singletonPageFieldsets, singletonPageGroups} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {careersPageEditorConfig} from '../sanity/page-editor/pages/careersSections'

const i18nString = {
  type: 'internationalizedArrayString',
}

const i18nText = {
  type: 'internationalizedArrayText',
}

const optionRowPreview = {
  select: {value: 'value', label: 'label'},
  prepare({value, label}: {value?: string; label?: unknown}) {
    return {title: pickStudioEn(label) || value || 'Option'}
  },
}

const labelField = (name: string, title: string, description?: string) => ({
  name,
  title,
  group: 'content',
  fieldset: 'advanced',
  description,
  ...i18nString,
})

export default {
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  icon: GenericIcon,
  components: {
    input: createPageSectionDocumentInput(careersPageEditorConfig),
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
      title: 'Hero — title',
      group: 'hero',
      ...i18nString,
      validation: (Rule: any) => Rule.required(),
    },
    {...i18nSlugFieldFromTitle('title', {group: 'hero'})},
    {
      name: 'heroSubtitle',
      title: 'Hero — subtitle',
      group: 'hero',
      ...i18nText,
    },
    {
      name: 'jobsSectionTitle',
      title: 'Job list — heading',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'introText',
      title: 'Job list — intro',
      group: 'content',
      ...i18nText,
    },
    {
      name: 'searchPlaceholder',
      title: 'Search field — placeholder',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'filterAllLabel',
      title: 'Filter — All',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'emptyResultsMessage',
      title: 'Empty search — message',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'emptyResultsResetHint',
      title: 'Empty search — hint before link',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'emptyResultsResetLabel',
      title: 'Empty search — link text',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'deadlineLabel',
      title: 'Deadline — prefix',
      description: "E.g. 'Deadline:' (date added automatically)",
      group: 'content',
      ...i18nString,
    },
    {
      name: 'ongoingLabel',
      title: 'Ongoing — label (list)',
      group: 'content',
      fieldset: 'legacy',
      description:
        'Shown on Careers listing cards when a job has no deadline. Job detail uses “Ongoing — label” below instead.',
      ...i18nString,
    },
    {
      name: 'ongoingDeadlineLabel',
      title: 'Ongoing — label (detail)',
      group: 'content',
      description: 'Shown on the job detail page when a job has no deadline.',
      ...i18nString,
    },
    {
      name: 'spontaneousTitle',
      title: 'Unsolicited application — title',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'spontaneousText',
      title: 'Unsolicited application — text',
      group: 'content',
      ...i18nText,
    },
    {
      name: 'spontaneousButtonLabel',
      title: 'Unsolicited application — button',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'spontaneousEmail',
      title: 'Unsolicited application — email',
      type: 'string',
      group: 'content',
      initialValue: 'jobb@cmedical.no',
    },
    {
      name: 'departmentOptions',
      title: 'Department — filter labels',
      group: 'content',
      fieldset: 'advanced',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Value', type: 'string'},
            {name: 'label', title: 'Label', ...i18nString},
          ],
          preview: optionRowPreview,
        },
      ],
    },
    {
      name: 'employmentTypeOptions',
      title: 'Position type — filter labels',
      group: 'content',
      fieldset: 'advanced',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Value', type: 'string'},
            {name: 'label', title: 'Label', ...i18nString},
          ],
          preview: optionRowPreview,
        },
      ],
    },
    labelField('notFoundTitle', '404 — title'),
    labelField('notFoundDescription', '404 — description'),
    labelField('backToJobsLabel', '404 — back button'),
    labelField('backLinkLabel', 'Job detail — back link'),
    labelField('applyCardTitle', 'Job detail — apply card title'),
    labelField('applyExternalLabel', 'Job detail — external application'),
    labelField('applyEmailLabel', 'Job detail — email application'),
    labelField('contactCardTitle', 'Job detail — contact title'),
    {
      name: 'jobSeoTitleSuffix',
      title: 'SEO — suffix for job detail title',
      description: "E.g. '– Careers at CMedical'",
      group: 'content',
      fieldset: 'advanced',
      ...i18nString,
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
      return {title: pickStudioEn(title) || 'Careers'}
    },
  },
}
