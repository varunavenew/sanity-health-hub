// Schema: Careers listing page (Karriere)
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle, pickNo } from './i18n'
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
  title: 'Karriere-side',
  type: 'document',
  icon: GenericIcon,
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'labels', title: 'Etiketter' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'breadcrumbHome',
      title: 'Brødsmule — hjem',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'title',
      title: 'Hero — tittel',
      group: 'content',
      ...i18nString,
      validation: (Rule: any) => Rule.required(),
    },
    { ...i18nSlugFieldFromTitle('title', { group: 'content' }) },
    {
      name: 'heroSubtitle',
      title: 'Hero — undertittel',
      group: 'content',
      ...i18nText,
    },
    {
      name: 'jobsSectionTitle',
      title: 'Stillingsliste — overskrift',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'introText',
      title: 'Stillingsliste — intro',
      group: 'content',
      ...i18nText,
    },
    {
      name: 'searchPlaceholder',
      title: 'Søkefelt — placeholder',
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
      title: 'Tomt søk — melding',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'emptyResultsResetHint',
      title: 'Tomt søk — hint før lenke',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'emptyResultsResetLabel',
      title: 'Tomt søk — lenketekst',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'deadlineLabel',
      title: 'Frist — prefiks',
      description: 'F.eks. «Frist:» (dato legges til automatisk)',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'ongoingLabel',
      title: 'Løpende — etikett (liste)',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'ongoingDeadlineLabel',
      title: 'Løpende — etikett (detalj)',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'spontaneousTitle',
      title: 'Spontansøknad — tittel',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'spontaneousText',
      title: 'Spontansøknad — tekst',
      group: 'content',
      ...i18nText,
    },
    {
      name: 'spontaneousButtonLabel',
      title: 'Spontansøknad — knapp',
      group: 'content',
      ...i18nString,
    },
    {
      name: 'spontaneousEmail',
      title: 'Spontansøknad — e-post',
      type: 'string',
      group: 'content',
      initialValue: 'jobb@cmedical.no',
    },
    {
      name: 'departmentOptions',
      title: 'Avdeling — etiketter',
      group: 'labels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', ...i18nString },
          ],
          preview: optionRowPreview,
        },
      ],
    },
    {
      name: 'employmentTypeOptions',
      title: 'Stillingstype — etiketter',
      group: 'labels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', ...i18nString },
          ],
          preview: optionRowPreview,
        },
      ],
    },
    {
      name: 'notFoundTitle',
      title: '404 — tittel',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'notFoundDescription',
      title: '404 — beskrivelse',
      group: 'labels',
      ...i18nText,
    },
    {
      name: 'backToJobsLabel',
      title: '404 — tilbake-knapp',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'backLinkLabel',
      title: 'Detalj — tilbake-lenke',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyCardTitle',
      title: 'Detalj — søk-kort tittel',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyExternalLabel',
      title: 'Detalj — ekstern søknad',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'applyEmailLabel',
      title: 'Detalj — e-post søknad',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'contactCardTitle',
      title: 'Detalj — kontakt tittel',
      group: 'labels',
      ...i18nString,
    },
    {
      name: 'jobSeoTitleSuffix',
      title: 'SEO — suffiks for stilling',
      description: 'F.eks. «– Karriere hos CMedical»',
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
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      const t = Array.isArray(title)
        ? (title.find((x: any) => (x.language || x._key) === 'no')?.value || title[0]?.value)
        : title
      return { title: (t as string) || 'Karriere' }
    },
  },
}
