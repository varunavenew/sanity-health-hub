// Schema: Careers listing page (Karriere)
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

const i18nString = {
  type: 'internationalizedArrayString',
}

const i18nText = {
  type: 'internationalizedArrayText',
}

const optionRowPreview = {
  select: { value: 'value', label: 'label' },
  prepare({ value, label }: { value?: string; label?: unknown }) {
    return { title: pickNo(label) || value || 'Option' }
  },
}

export default {
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  icon: GenericIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'labels', title: 'Labels' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'breadcrumbHome',
      title: 'Breadcrumb — home',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'title',
      title: 'Hero — title',
      group: 'content',
      ...i18nString,
      validation: (Rule: any) => Rule.required(),
    },
    { ...i18nSlugFieldFromTitle('title', { group: 'content' }) },
    {
      name: 'heroSubtitle',
      title: 'Hero — subtitle',
      group: 'content',
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
      title: 'Filter — «Alle»',
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
      description: 'E.g. \'Deadline:\' (date added automatically)',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'ongoingLabel',
      title: 'Ongoing — label (list)',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'ongoingDeadlineLabel',
      title: 'Ongoing — label (detail)',
      group: 'content',
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
      title: 'Department — labels',
      group: 'labels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', ...i18nString },
          ],
          preview: optionRowPreview,
        },
      ],
    },
    {
      name: 'employmentTypeOptions',
      title: 'Position type — labels',
      group: 'labels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', ...i18nString },
          ],
          preview: optionRowPreview,
        },
      ],
    },
    {
      name: 'notFoundTitle',
      title: '404 — title',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'notFoundDescription',
      title: '404 — description',
      group: 'labels',
      ...i18nText,
    },
    {
      name: 'backToJobsLabel',
      title: '404 — back button',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'backLinkLabel',
      title: 'Detail — back link',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyCardTitle',
      title: 'Detail — search card title',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyExternalLabel',
      title: 'Detail — external application',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyEmailLabel',
      title: 'Detail — email application',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'contactCardTitle',
      title: 'Detail — contact title',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'jobSeoTitleSuffix',
      title: 'SEO — suffix for job title',
      description: 'E.g. \'– Careers at CMedical\'',
      group: 'seo',
      ...i18nString,
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      const t = Array.isArray(title)
        ? (title.find((x: any) => (x.language || x._key) === 'no')?.value || title[0]?.value)
        : title
      return { title: (t as string) || 'Careers' }
    },
  },
}
