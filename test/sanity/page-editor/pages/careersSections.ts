/**
 * Careers — page editor config (Homepage framework).
 * No shared pageSections bands on this page.
 *
 * Field ownership (verified against Karriere.tsx + KarriereDetail.tsx):
 * - Hero: listing PageHero title/subtitle (+ slug/breadcrumb stored)
 * - Open Positions: listing list UI + detail deadline label
 * - Application: listing spontaneous block (+ email fallback on detail)
 * - Advanced Labels: filter option maps + job-detail / 404 / job SEO suffix
 * - Legacy: ongoingLabel still rendered on listing cards when job has no deadline
 */
import {CaseIcon, CogIcon, EnvelopeIcon, ComposeIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument, countArray, countChip} from '../documentMeta'
import {heroSection, i18nPreview, seoSection} from '../sharedSectionBuilders'

const CAREERS_ADVANCED_FIELDS = [
  'departmentOptions',
  'employmentTypeOptions',
  'notFoundTitle',
  'notFoundDescription',
  'backToJobsLabel',
  'backLinkLabel',
  'applyCardTitle',
  'applyExternalLabel',
  'applyEmailLabel',
  'contactCardTitle',
  'jobSeoTitleSuffix',
]

export const careersPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Careers',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      ...heroSection(['breadcrumbHome', 'title', 'slug', 'heroSubtitle']),
      description:
        'Listing hero title and subtitle (PageHero). No hero image/video/CTA on this page today.',
      notice:
        'Breadcrumb home is stored but not rendered on Careers. Title + subtitle drive PageHero.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.title) || i18nPreview(document.heroSubtitle)
            ? ['Configured']
            : ['Empty']
        }),
    },
    {
      id: 'openPositions',
      title: 'Open Positions',
      description: 'Job list headings, search, empty states, and deadline labels.',
      icon: CaseIcon,
      fields: [
        'jobsSectionTitle',
        'introText',
        'searchPlaceholder',
        'filterAllLabel',
        'emptyResultsMessage',
        'emptyResultsResetHint',
        'emptyResultsResetLabel',
        'deadlineLabel',
        'ongoingDeadlineLabel',
      ],
      notice:
        'Ongoing deadline label is used on the job detail page. Listing “ongoing” badge uses Legacy → Ongoing label (list).',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.jobsSectionTitle) || i18nPreview(document.introText)
            ? ['Configured']
            : ['Empty']
        }),
    },
    {
      id: 'application',
      title: 'Application',
      description: 'Unsolicited application block on the listing page.',
      icon: EnvelopeIcon,
      fields: [
        'spontaneousTitle',
        'spontaneousText',
        'spontaneousButtonLabel',
        'spontaneousEmail',
      ],
      notice:
        'Email is also the fallback apply address on job detail when a job has no contact email.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.spontaneousTitle) ||
            (typeof document.spontaneousEmail === 'string' && document.spontaneousEmail.trim())
            ? ['Configured']
            : ['Empty']
        }),
    },
    {
      id: 'advanced',
      title: 'Advanced Labels',
      description:
        'Department / employment option labels, job-detail copy, 404 copy, and job SEO title suffix.',
      icon: ComposeIcon,
      fields: CAREERS_ADVANCED_FIELDS,
      notice:
        'Department and employment options map job document values → display labels on listing and detail.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const dept = countArray(document.departmentOptions) || 0
          const emp = countArray(document.employmentTypeOptions) || 0
          const detailCopy = CAREERS_ADVANCED_FIELDS.some((name) => {
            if (name === 'departmentOptions' || name === 'employmentTypeOptions') return false
            return Boolean(i18nPreview(document[name]))
          })
          if (dept || emp) {
            return [countChip(dept + emp, 'Option', 'Options'), 'Configured']
          }
          return detailCopy ? ['Configured'] : ['Empty']
        }),
    },
    seoSection(),
    {
      id: 'legacy',
      title: 'Legacy',
      description: 'Listing “ongoing” badge when a job has no deadline.',
      icon: CogIcon,
      fields: ['ongoingLabel'],
      notice:
        'Still rendered on the Careers listing card badge when job.deadline is empty. Detail page uses Ongoing deadline label (Open Positions) instead.',
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          return i18nPreview(document.ongoingLabel) ? ['Legacy', 'In use'] : ['Empty']
        }),
    },
  ],
})
