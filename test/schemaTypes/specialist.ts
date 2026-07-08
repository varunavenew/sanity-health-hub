// Schema: Specialist (Spesialist)
import { SpecialistIcon } from './icons'
import {
  hasNoEnBlockContent,
  hasSpecialtyWithEnText,
  hasSpecialtyWithNoText,
  requiredNoEnBlockContent,
  i18nSlugFieldFromString,
  pickForLang,
  pickNo,
  pickSpecialtyLabel,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { geoSummaryField } from './geoSummary'
import { BOOKING_ACTIVITY_GROUP_IDS } from './bookingActivityGroups'

export default {
  name: 'specialist',
  title: 'Specialist',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('Name is required for publishing'),
      description: 'Personnavn (oversettes ikke)',
    },
    i18nSlugFieldFromString('name'),
    {
      name: 'photo',
      title: 'Profilbilde',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required().error('Profile picture is required for publishing'),
    },
    {
      name: 'role',
      title: 'Title/role',
      type: 'internationalizedArrayString',
      description: 'E.g. "Gynecologist", "Urologist", "Orthopedist"',
      validation: requiredNoEnI18n('Title/role'),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
      description: 'E.g. "Robot surgeon", "Specialist", "Surgeon"',
    },
    {
      name: 'specialties',
      title: 'Expertise / Specialties',
      type: 'array',
      options: { layout: 'list' },
      of: [
        {
          type: 'object',
          name: 'specialtyItem',
          title: 'Specialty / Area of expertise',
          fields: [
            {
              name: 'label',
              title: 'Text',
              type: 'internationalizedArrayString',
              validation: requiredNoEnI18n('Specialty / Area of expertise'),
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }: { label?: unknown }) {
              return { title: pickSpecialtyLabel({ label }) || 'New specialty' }
            },
          },
        },
      ],
      description:
        'Short keywords shown on the profile page and in specialist cards (on website: \'expertise\'). E.g. \'Robot surgery\', \'Fertility\'. Click + Add item, fill in Norwegian (NO) and English (EN) text.',
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
      title: 'Tilknyttede kategorier',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
      validation: (Rule: any) =>
        Rule.required().min(1).error('Velg minst én behandlingskategori'),
    },
    {
      name: 'bookingCategoryIds',
      title: 'Booking category IDs (Methodology)',
      type: 'array',
      of: [
        {
          type: 'number',
          title: 'Category ID',
          validation: (Rule: any) =>
            Rule.required()
              .integer()
              .custom((id: number) => {
                if ((BOOKING_ACTIVITY_GROUP_IDS as readonly number[]).includes(id)) return true
                return `Ugyldig ID. Tillatte: ${BOOKING_ACTIVITY_GROUP_IDS.join(', ')}`
              }),
        },
      ],
      description:
        'One or more numeric wbactivitygroup IDs (numbers only). Example: 8=Gynecologist, 10=Fetal Medicine Specialist, 6=Urologist, 17=Orthopedist, 1=Fertility.',
      validation: (Rule: any) =>
        Rule.required().min(1).error('Select at least one booking category ID'),
    },
    {
      name: 'treatments',
      title: 'Treatments',
      type: 'array',
      description:
        'Optional: select specific treatments. Empty list = all treatments in linked categories (when displayed on the website).',
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
            filter: '_type == "treatment" && category._ref in $categoryIds',
            params: { categoryIds },
          }
        },
      },
    },
    {
      name: 'clinics',
      title: 'Clinics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
      description: 'Clinics the specialist works at – select from existing clinic documents.',
      validation: (Rule: any) => Rule.required().min(1).error('Select at least one clinic'),
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'internationalizedArrayBlockContent',
      description: 'Extended biography on the profile page. Must be filled out in Norwegian and English.',
      validation: requiredNoEnBlockContent('Biography'),
    },
    {
      name: 'shortBio',
      title: 'Kort biografi',
      type: 'internationalizedArrayText',
      description: 'Displayed on the profile page and in specialist cards.',
      validation: requiredNoEnI18n('Kort biografi'),
    },
    {
      name: 'education',
      title: 'Utdanning',
      type: 'array',
      options: { layout: 'list' },
      of: [
        {
          type: 'object',
          name: 'educationItem',
          title: 'Utdanningslinje',
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
              return { title: pickSpecialtyLabel({ label }) || 'Ny linje' }
            },
          },
        },
      ],
    },
    {
      name: 'languages',
      title: 'Language',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Language codes/names (do not translate)',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      type: 'internationalizedArrayString',
      description: 'Heading for the FAQ section (e.g. \'Frequently Asked Questions\'). Must be filled out in Norwegian and English.',
      validation: requiredNoEnI18n('FAQ Heading'),
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      description:
        'Optional FAQ items shown on the profile page. Each FAQ document must have questions and answers in Norwegian and English.',
    },
    {
      name: 'relatedSpecialistsSection',
      title: 'Related specialists',
      type: 'object',
      description:
        'The \'Other specialists\' section at the bottom of the profile page. Select at least one other specialist to display.',
      options: { collapsible: true, collapsed: false },
      validation: (Rule: any) => Rule.required().error('Related specialists must be filled out'),
      fields: [
        {
          name: 'eyebrow',
          title: 'Subheading',
          type: 'internationalizedArrayString',
          description: 'E.g. \'Same specialty\'. Must be filled out in Norwegian and English.',
          validation: requiredNoEnI18n('Subheading'),
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'internationalizedArrayString',
          description: 'E.g. \'Other specialists\'. Must be filled out in Norwegian and English.',
          validation: requiredNoEnI18n('Heading'),
        },
        {
          name: 'ctaLabel',
          title: 'Link Text',
          type: 'internationalizedArrayString',
          description: 'E.g. \'See all\'. Must be filled out in Norwegian and English.',
          validation: requiredNoEnI18n('Link Text'),
        },
        {
          name: 'ctaPath',
          title: 'Link',
          type: 'string',
          description: 'Internal path without language prefix, e.g. /specialists',
          initialValue: '/spesialister',
          validation: (Rule: any) => Rule.required().error('Link is required'),
        },
        {
          name: 'specialists',
          title: 'Specialists',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
          description:
            'Select which specialists to display (order from Studio is kept). At least one required.',
          validation: (Rule: any) =>
            Rule.required()
              .min(1)
              .error('Select at least one specialist')
              .custom((refs: Array<{ _ref?: string }> | undefined, context: { document?: { _id?: string } }) => {
                if (!Array.isArray(refs) || refs.length === 0) return true
                const docId = String(context.document?._id || '').replace(/^drafts\./, '')
                if (!docId) return true
                const includesSelf = refs.some((ref) => ref?._ref === docId)
                return includesSelf ? 'Select other specialists — not the profile you are editing' : true
              }),
        },
      ],
    },
    {
      name: 'bookingEnabled',
      title: 'Booking aktivert',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      description: 'Lower numbers are shown first. Leave blank for alphabetical.',
    },
    {
      name: 'patientReviews',
      title: 'Patient Reviews',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description:
        'Select Google reviews shown in \'What patients say\' on the profile page. Order from Studio is kept. Empty list = auto-selection based on name and specialty.',
      validation: (Rule: any) => Rule.max(6).error('Select up to six reviews'),
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta title and meta description for the specialist profile page',
      validation: requiredNoEnSeo,
    },
    geoSummaryField,
  ],
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!String(document.name || '').trim()) issues.push('Name is missing')
      if (!document.photo) issues.push('Profilbilde mangler')
      if (!pickNo(document.role)?.trim()) issues.push('Title/role (Norwegian) is missing')
      if (!pickForLang(document.role, 'en')?.trim()) issues.push('Title/role (English) is missing')
      if (!pickNo(document.shortBio)?.trim()) issues.push('Kort biografi (norsk) mangler')
      if (!pickForLang(document.shortBio, 'en')?.trim()) {
        issues.push('Kort biografi (engelsk) mangler')
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
        issues.push('At least one booking category ID must be selected')
      }
      const faqs = document.faqs as unknown[] | undefined
      const hasFaqs = Array.isArray(faqs) && faqs.length > 0
      if (hasFaqs && !pickNo(document.faqSectionTitle)?.trim()) {
        issues.push('FAQ heading (Norwegian) is missing')
      }
      if (hasFaqs && !pickForLang(document.faqSectionTitle, 'en')?.trim()) {
        issues.push('FAQ heading (English) is missing')
      }
      const related = document.relatedSpecialistsSection as Record<string, unknown> | undefined
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
      if (!String(related?.ctaPath || '').trim()) {
        issues.push('Related specialists: link is missing')
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
      bookingCategoryIds: 'bookingCategoryIds',
      t0: 'treatments.0->title',
      t1: 'treatments.1->title',
      t2: 'treatments.2->title',
    },
    prepare({ title, role, media, booking, bookingCategoryIds, t0, t1, t2 }: any) {
      const treatmentNames = [t0, t1, t2].map(pickNo).filter(Boolean)
      const roleLabel = pickNo(role) || 'No role'
      const idPart =
        Array.isArray(bookingCategoryIds) && bookingCategoryIds.length
          ? ` · Booking #${bookingCategoryIds.join(', #')}`
          : ''
      const treatmentLine = treatmentNames.length
        ? ` · Behandlinger: ${treatmentNames.join(', ')}${treatmentNames.length === 3 ? '…' : ''}`
        : ''
      return {
        title: `${booking === false ? '🚫 ' : ''}${title || ''}`,
        subtitle: `${roleLabel}${idPart}${treatmentLine}`,
        media,
      }
    },
  },
}
