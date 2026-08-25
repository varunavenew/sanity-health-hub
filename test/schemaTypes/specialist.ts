// Schema: Specialist (Spesialist)
// Phase 16B: Studio polish — Category/Treatment UX parity; architecture preserved
import { SpecialistIcon } from './icons'
import {
  hasNoEnBlockContent,
  hasSpecialtyWithEnText,
  hasSpecialtyWithNoText,
  requiredNoEnBlockContent,
  i18nSlugFieldFromString,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import {pickStudioEn} from './studioPreview'
import { geoSummaryField } from './geoSummary'
import {
  BOOKING_ACTIVITY_GROUP_IDS,
  bookingActivityGroupList,
} from './bookingActivityGroups'
import { AutoSlugFromTitleInput } from '../sanity/components/AutoSlugFromTitleInput'
import {
  composeImageValidation,
  mediaDescription,
  mediaImageOptions,
} from './mediaGuidelines'

const reqI18n = requiredNoEnI18n

const sectionCollapsed = { collapsible: true, collapsed: true } as const

export default {
  name: 'specialist',
  title: 'Specialist',
  type: 'document',
  icon: SpecialistIcon,
  components: {
    input: AutoSlugFromTitleInput,
  },
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'pageContent', title: 'Page Content' },
    { name: 'sharedSections', title: 'Shared Sections' },
    { name: 'seo', title: 'SEO' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fieldsets: [
    {
      name: 'pcBio',
      title: 'Biography',
      description: 'Short card text and full profile biography (NO + EN).',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcCredentials',
      title: 'Credentials',
      description: 'Education lines and languages. Optional.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcRelated',
      title: 'Related specialists',
      description:
        '“Other specialists” band at the bottom of the profile. Required for publish — select at least one peer.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'ssFaq',
      title: 'FAQ',
      description:
        'Select, replace, clear, or create an FAQ Collection from the Content Library.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'faqAdvanced',
      title: 'Previous FAQ list',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'ssReviews',
      title: 'Reviews',
      description:
        'Curated Google reviews for this profile (up to 6). Empty = no reviews section on the website.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'seoFields',
      title: 'Search & AI',
      description: 'Meta tags and AI summary for this profile.',
      options: sectionCollapsed,
      group: 'seo',
    },
    {
      name: 'advancedBooking',
      title: 'Booking system',
      description:
        'Technical booking IDs for the booking wizard. Treatment categories (General) define medical membership; these numbers drive Metodika.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedList',
      title: 'List order',
      description: 'Order on specialist lists. Rarely edited after setup.',
      options: sectionCollapsed,
      group: 'advanced',
    },
  ],
  fields: [
    // ── General ─────────────────────────────────────────────────────────────
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'general',
      validation: (Rule: any) =>
        Rule.required().error('Name is required for publishing'),
      description: 'Full name (not translated). URL Slug fills from this while typing.',
    },
    {
      ...i18nSlugFieldFromString('name', {
        description:
          'URL Slug (NO) and URL Slug (EN). Fills automatically from Name when empty. Manual edits are kept — changing the name later will not overwrite a filled slug.',
      }),
      group: 'general',
    },
    {
      name: 'photo',
      title: 'Profile image (legacy)',
      type: 'image',
      group: 'general',
      options: mediaImageOptions('specialist'),
      description: mediaDescription(
        'specialist',
        'Legacy portrait. Prefer Hero Media → Image. Website dual-reads both until migration is verified.',
      ),
      hidden: ({ document }: { document?: { heroMedia?: unknown } }) =>
        Boolean(document?.heroMedia),
      validation: composeImageValidation('specialist', (Rule: any) =>
        Rule.custom((value: unknown, context: { document?: { heroMedia?: { mediaType?: string; image?: unknown } } }) => {
          const media = context.document?.heroMedia
          if (media?.mediaType === 'image' && media.image) return true
          if (media?.mediaType === 'video') return true
          if (value) return true
          return 'Profile picture is required for publishing (or set Hero Media)'
        }),
      ),
    },
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'media',
      group: 'general',
      description: mediaDescription(
        'specialist',
        'Preferred profile / hero media (Image or Video).',
      ),
    },
    {
      name: 'role',
      title: 'Title / role',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'E.g. Gynecologist, Urologist, Orthopedist (NO + EN).',
      validation: reqI18n('Title / role'),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'Optional. E.g. Robot surgeon, Specialist (NO + EN).',
    },
    {
      name: 'specialties',
      title: 'Expertise / specialties',
      type: 'array',
      group: 'general',
      options: { layout: 'list' },
      of: [
        {
          type: 'object',
          name: 'specialtyItem',
          title: 'Specialty',
          fields: [
            {
              name: 'label',
              title: 'Text',
              type: 'internationalizedArrayString',
              validation: reqI18n('Specialty'),
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }: { label?: unknown }) {
              return { title: pickStudioEn(label) || 'New specialty' }
            },
          },
        },
      ],
      description:
        'Short keywords on profile and cards. Add at least one row with Norwegian and English text.',
      validation: (Rule: any) =>
        Rule.custom((items: unknown[] | undefined) => {
          if (!Array.isArray(items) || items.length === 0) {
            return 'Add at least one specialty'
          }
          if (!hasSpecialtyWithNoText(items)) {
            return 'Fill in Norwegian (NO) text for at least one specialty'
          }
          if (!hasSpecialtyWithEnText(items)) {
            return 'Fill in English (EN) text for at least one specialty'
          }
          return true
        }),
    },
    {
      name: 'categories',
      title: 'Treatment categories',
      type: 'array',
      group: 'general',
      description:
        'Required. Medical categories this specialist belongs to. Booking system numbers live under Advanced.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
      validation: (Rule: any) =>
        Rule.required().min(1).error('Select at least one treatment category'),
    },
    {
      name: 'treatments',
      title: 'Treatments (reserved)',
      type: 'array',
      group: 'general',
      description:
        'Not shown on the website today. Keep existing links if present; prefer categories for membership.',
      hidden: true,
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
        },
      ],
      options: {
        layout: 'grid',
        filter: ({ document }: { document?: { categories?: { _ref?: string }[] } }) => {
          const categoryIds = (document?.categories || [])
            .map((c) => c._ref)
            .filter(Boolean) as string[]
          if (!categoryIds.length) {
            return { filter: '_type == "treatment"' }
          }
          return {
            filter:
              '_type == "treatment" && (category._ref in $categoryIds || count((categories[]._ref)[@ in $categoryIds]) > 0)',
            params: { categoryIds },
          }
        },
      },
    },
    {
      name: 'clinics',
      title: 'Clinics',
      type: 'array',
      group: 'general',
      of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
      description: 'Required. Clinics where this specialist works.',
      validation: (Rule: any) =>
        Rule.required().min(1).error('Select at least one clinic'),
    },
    {
      name: 'showBookingButton',
      title: 'Show booking button',
      type: 'boolean',
      group: 'general',
      initialValue: true,
      description:
        'Show the booking button on this specialist’s profile. Leave on unless this specialist should not be bookable from the website.',
    },
    {
      name: 'showCallButton',
      title: 'Show call button',
      type: 'boolean',
      group: 'general',
      initialValue: true,
      description:
        'Show the call button on this specialist’s profile. Leave on unless this specialist should not show a call action.',
    },

    // ── Page Content ────────────────────────────────────────────────────────
    {
      name: 'shortBio',
      title: 'Short biography',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      fieldset: 'pcBio',
      description:
        'Required. Short card / summary text. Full biography is below — avoid pasting the same long text twice.',
      validation: reqI18n('Short biography'),
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'internationalizedArrayBlockContent',
      group: 'pageContent',
      fieldset: 'pcBio',
      description: 'Required. Extended biography on the profile page (NO + EN).',
      validation: requiredNoEnBlockContent('Biography'),
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcCredentials',
      options: { layout: 'list' },
      description: 'Optional education lines (NO + EN per row).',
      of: [
        {
          type: 'object',
          name: 'educationItem',
          title: 'Education line',
          fields: [
            {
              name: 'label',
              title: 'Text',
              type: 'internationalizedArrayString',
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }: { label?: unknown }) {
              return { title: pickStudioEn(label) || 'New line' }
            },
          },
        },
      ],
    },
    {
      name: 'languages',
      title: 'Languages',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcCredentials',
      of: [{ type: 'string' }],
      description: 'Optional language codes or names (not translated as i18n fields).',
    },
    {
      name: 'relatedSpecialistsSection',
      title: 'Related specialists',
      type: 'object',
      group: 'pageContent',
      fieldset: 'pcRelated',
      description:
        'Required for publish. The “Other specialists” section at the bottom of the profile.',
      options: { collapsible: true, collapsed: false },
      validation: (Rule: any) =>
        Rule.required().error('Related specialists must be filled out'),
      fields: [
        {
          name: 'eyebrow',
          title: 'Subheading',
          type: 'internationalizedArrayString',
          description: 'E.g. Same specialty (NO + EN).',
          validation: reqI18n('Subheading'),
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'internationalizedArrayString',
          description: 'E.g. Other specialists (NO + EN).',
          validation: reqI18n('Heading'),
        },
        {
          name: 'ctaLabel',
          title: 'Link text',
          type: 'internationalizedArrayString',
          description: 'E.g. See all (NO + EN).',
          validation: reqI18n('Link text'),
        },
        {
          name: 'ctaPath',
          title: 'Link',
          type: 'string',
          description: 'Internal path without language prefix, e.g. /spesialister',
          initialValue: '/spesialister',
          validation: (Rule: any) =>
            Rule.required()
              .error('Link is required')
              .custom((value: any) => {
                if (!value) return true
                if (typeof value !== 'string') return true
                return value.startsWith('/')
                  ? true
                  : 'The path must be a relative link starting with a slash (e.g. /spesialister)'
              }),
        },
        {
          name: 'specialists',
          title: 'Specialists',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
          description:
            'Select peers to display (Studio order kept). At least one required — not yourself.',
          validation: (Rule: any) =>
            Rule.required()
              .min(1)
              .error('Select at least one specialist')
              .custom(
                (
                  refs: Array<{ _ref?: string }> | undefined,
                  context: { document?: { _id?: string } },
                ) => {
                  if (!Array.isArray(refs) || refs.length === 0) return true
                  const docId = String(context.document?._id || '').replace(
                    /^drafts\./,
                    '',
                  )
                  if (!docId) return true
                  const includesSelf = refs.some((ref) => ref?._ref === docId)
                  return includesSelf
                    ? 'Select other specialists — not the profile you are editing'
                    : true
                },
              ),
        },
      ],
    },

    // ── Shared Sections ─────────────────────────────────────────────────────
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      type: 'internationalizedArrayString',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      description: 'Heading above the FAQ. Questions live in the Collection.',
      initialValue: [
        { _key: 'no', language: 'no', value: 'Ofte stilte spørsmål' },
        { _key: 'en', language: 'en', value: 'Frequently asked questions' },
      ],
    },
    {
      name: 'faqCollection',
      title: 'Specialist FAQ',
      type: 'reference',
      to: [{ type: 'faqCollection' }],
      description:
        'Select, replace, clear, or create an FAQ Collection from the Content Library.',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      options: {
        disableNew: false,
      },
    },
    {
      name: 'faqs',
      title: 'Previous FAQ list',
      type: 'array',
      group: 'sharedSections',
      fieldset: 'faqAdvanced',
      hidden: () => true,
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    },
    {
      name: 'patientReviews',
      title: 'Patient reviews',
      type: 'array',
      group: 'sharedSections',
      fieldset: 'ssReviews',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description:
        'Google reviews for “What patients say”. Studio order is kept. Leave empty to hide the section on the website.',
      validation: (Rule: any) => Rule.max(6).error('Select up to six reviews'),
    },

    // ── SEO ─────────────────────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      fieldset: 'seoFields',
      description: 'Search title, description, and social previews.',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      fieldset: 'seoFields',
      title: 'AI / GEO summary',
      description: 'Short summary for search and AI. Not the same as the role title.',
    },

    // ── Advanced ────────────────────────────────────────────────────────────
    {
      name: 'bookingEnabled',
      title: 'Booking enabled',
      type: 'boolean',
      group: 'advanced',
      fieldset: 'advancedBooking',
      initialValue: true,
      description:
        'Studio list indicator (🚫 when off). Website booking still uses booking category numbers below.',
    },
    {
      name: 'metodikaUserId',
      title: 'Metodika user ID',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedBooking',
      description:
        'Metodika caregiver / user id. Used to show this specialist’s photo in the booking wizard. Leave empty if they are not in Metodika.',
      validation: (Rule: any) => Rule.integer().positive(),
    },
    {
      name: 'bookingCategoryIds',
      title: 'Booking activity groups',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedBooking',
      of: [
        {
          type: 'number',
          title: 'Activity group',
          options: {
            list: bookingActivityGroupList,
            layout: 'dropdown',
          },
          validation: (Rule: any) =>
            Rule.required()
              .integer()
              .custom((id: number) => {
                if ((BOOKING_ACTIVITY_GROUP_IDS as readonly number[]).includes(id)) {
                  return true
                }
                return `Invalid ID. Allowed: ${BOOKING_ACTIVITY_GROUP_IDS.join(', ')}`
              }),
        },
      ],
      description:
        'Required. One or more Metodika wbactivitygroup IDs. Pick from the list (data shape unchanged).',
      validation: (Rule: any) =>
        Rule.required().min(1).error('Select at least one booking activity group'),
    },
    {
      name: 'sortOrder',
      title: 'List order',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedList',
      description: 'Lower numbers appear first on specialist lists. Leave blank for alphabetical.',
    },
  ],
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!String(document.name || '').trim()) issues.push('Name is missing')
      if (!document.photo) issues.push('Profile image is missing')
      if (!pickNo(document.role)?.trim()) issues.push('Title / role (Norwegian) is missing')
      if (!pickForLang(document.role, 'en')?.trim()) {
        issues.push('Title / role (English) is missing')
      }
      if (!pickNo(document.shortBio)?.trim()) issues.push('Short biography (Norwegian) is missing')
      if (!pickForLang(document.shortBio, 'en')?.trim()) {
        issues.push('Short biography (English) is missing')
      }
      if (!hasNoEnBlockContent(document.bio)) {
        issues.push('Biography (Norwegian and English) is missing')
      }
      if (!hasSpecialtyWithNoText(document.specialties)) {
        issues.push('At least one specialty with Norwegian text is missing')
      }
      if (!hasSpecialtyWithEnText(document.specialties)) {
        issues.push('At least one specialty with English text is missing')
      }
      const categories = document.categories as unknown[] | undefined
      if (!Array.isArray(categories) || categories.length === 0) {
        issues.push('At least one treatment category must be selected')
      }
      const clinics = document.clinics as unknown[] | undefined
      if (!Array.isArray(clinics) || clinics.length === 0) {
        issues.push('At least one clinic must be selected')
      }
      const bookingIds = document.bookingCategoryIds as unknown[] | undefined
      if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        issues.push('At least one booking activity group must be selected')
      }
      const faqs = document.faqs as unknown[] | undefined
      const hasFaqs = Array.isArray(faqs) && faqs.length > 0
      const hasFaqCollection = Boolean(
        (document.faqCollection as {_ref?: string} | undefined)?._ref,
      )
      if ((hasFaqs || hasFaqCollection) && !pickNo(document.faqSectionTitle)?.trim()) {
        issues.push('FAQ heading (Norwegian) is missing')
      }
      if ((hasFaqs || hasFaqCollection) && !pickForLang(document.faqSectionTitle, 'en')?.trim()) {
        issues.push('FAQ heading (English) is missing')
      }
      const related = document.relatedSpecialistsSection as
        | Record<string, unknown>
        | undefined
      if (!related || typeof related !== 'object') {
        issues.push('Related specialists section is missing')
      }
      if (!pickNo(related?.eyebrow)?.trim()) {
        issues.push('Related specialists: subheading (Norwegian) is missing')
      }
      if (!pickForLang(related?.eyebrow, 'en')?.trim()) {
        issues.push('Related specialists: subheading (English) is missing')
      }
      if (!pickNo(related?.heading)?.trim()) {
        issues.push('Related specialists: heading (Norwegian) is missing')
      }
      if (!pickForLang(related?.heading, 'en')?.trim()) {
        issues.push('Related specialists: heading (English) is missing')
      }
      if (!pickNo(related?.ctaLabel)?.trim()) {
        issues.push('Related specialists: link text (Norwegian) is missing')
      }
      if (!pickForLang(related?.ctaLabel, 'en')?.trim()) {
        issues.push('Related specialists: link text (English) is missing')
      }
      const ctaPath = String(related?.ctaPath || '').trim()
      if (!ctaPath) {
        issues.push('Related specialists: link is missing')
      } else if (!ctaPath.startsWith('/')) {
        issues.push('Related specialists: link must start with /')
      }
      const relatedSpecialists = related?.specialists as unknown[] | undefined
      if (!Array.isArray(relatedSpecialists) || relatedSpecialists.length === 0) {
        issues.push('Related specialists: select at least one specialist')
      }
      const seo = document.seo as Record<string, unknown> | undefined
      if (!pickNo(seo?.metaTitle)?.trim()) issues.push('SEO meta title (Norwegian) is missing')
      if (!pickForLang(seo?.metaTitle, 'en')?.trim()) {
        issues.push('SEO meta title (English) is missing')
      }
      if (!pickNo(seo?.metaDescription)?.trim()) {
        issues.push('SEO meta description (Norwegian) is missing')
      }
      if (!pickForLang(seo?.metaDescription, 'en')?.trim()) {
        issues.push('SEO meta description (English) is missing')
      }
      return issues.length ? issues.join('. ') : true
    }),
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Name (A–Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Role → Name',
      name: 'roleName',
      by: [
        { field: 'role', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'photo',
      booking: 'bookingEnabled',
      metodikaUserId: 'metodikaUserId',
      bookingCategoryIds: 'bookingCategoryIds',
      c0: 'categories.0->title',
      c1: 'categories.1->title',
      c2: 'categories.2->title',
    },
    prepare({ title, role, media, booking, metodikaUserId, bookingCategoryIds, c0, c1, c2 }: any) {
      const categoryNames = [c0, c1, c2]
        .map((c) => pickStudioEn(c))
        .filter(Boolean)
      const roleLabel = pickStudioEn(role) || 'No role'
      const userPart =
        typeof metodikaUserId === 'number' && metodikaUserId > 0
          ? ` · User #${metodikaUserId}`
          : ''
      const idPart =
        Array.isArray(bookingCategoryIds) && bookingCategoryIds.length
          ? ` · Booking #${bookingCategoryIds.join(', #')}`
          : ''
      const categoryLine = categoryNames.length
        ? ` · ${categoryNames.join(', ')}${categoryNames.length === 3 ? '…' : ''}`
        : ''
      return {
        title: `${booking === false ? '🚫 ' : ''}${title || ''}`,
        subtitle: `${roleLabel}${userPart}${idPart}${categoryLine}`,
        media,
      }
    },
  },
}
