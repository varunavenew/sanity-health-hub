// Schema: Clinic Page
// Phase 17B: Studio polish + FAQ Collection alignment — location architecture preserved
import { ClinicIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { pageSectionsFieldForGroup } from './pageSections'
import { geoSummaryField } from './geoSummary'
import { AutoSlugFromTitleInput } from '../sanity/components/AutoSlugFromTitleInput'

const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

const sectionCollapsed = { collapsible: true, collapsed: true } as const

/** Avoid Studio GroupSelect crashes: skip validation when booking method does not apply. */
function whenBookingMethod(method: string, validate: (rule: any) => any) {
  return (rule: any, context: { parent?: { method?: string }; hidden?: boolean }) => {
    if (context?.hidden || context?.parent?.method !== method) return rule.skip()
    return validate(rule)
  }
}

/** Inline FAQ item fields — shared so named + unnamed members stay in sync. */
const clinicInlineFaqFields = [
  {
    name: 'question',
    title: 'Question',
    type: 'internationalizedArrayString',
    validation: requiredNoEnI18n('Question'),
  },
  {
    name: 'answer',
    title: 'Answer',
    type: 'internationalizedArrayText',
    validation: requiredNoEnI18n('Answer'),
  },
]

const BOOKING_METHOD_LABELS: Record<string, string> = {
  info: 'Contact info',
  pasientsky: 'PatientSky',
  metodika: 'Metodika',
  closed: 'Closed',
}

export default {
  name: 'clinicPage',
  title: 'Clinic',
  type: 'document',
  icon: ClinicIcon,
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
      name: 'pcPractical',
      title: 'Practical information',
      description: 'Parking, public transport, and accessibility shown on the clinic page.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcGallery',
      title: 'Gallery',
      description: 'Extra interior images (“Fra klinikken” strip). Optional.',
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
      name: 'ssAssemblers',
      title: 'Page Sections',
      description:
        'Website bands that assemble content from elsewhere (Specialists, Booking CTA, Articles, Insurance). FAQ is above.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'seoFields',
      title: 'Search & AI',
      description: 'Meta tags and AI summary for this clinic page.',
      options: sectionCollapsed,
      group: 'seo',
    },
    {
      name: 'advancedBooking',
      title: 'Booking setup',
      description:
        'How this clinic connects to booking systems. Method + technical IDs. Rarely changed after go-live.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedTech',
      title: 'Technical',
      description: 'Map coordinates, service IDs, and list order. Rarely edited day-to-day.',
      options: sectionCollapsed,
      group: 'advanced',
    },
  ],
  fields: [
    // ── General ─────────────────────────────────────────────────────────────
    {
      name: 'title',
      title: 'Name',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'Clinic name (NO + EN). URL Slug fills from this while typing.',
      validation: requiredNoEnI18n('Name'),
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        title: 'Slug',
        group: 'general',
        description:
          'URL Slug (NO) and URL Slug (EN). Fills automatically from Name when empty. Manual edits are kept — changing the name later will not overwrite a filled slug.',
      }),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'general',
      validation: reqStr('Address'),
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'general',
      validation: reqStr('Phone'),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'general',
      validation: (Rule: any) => Rule.email().error('Must be a valid email address'),
    },
    {
      name: 'hours',
      title: 'Opening hours',
      type: 'internationalizedArrayString',
      group: 'general',
      validation: requiredNoEnI18n('Opening hours'),
    },
    {
      name: 'contactDescription',
      title: 'Contact description',
      type: 'internationalizedArrayText',
      group: 'general',
      description: 'Optional extra contact copy shown near phone / email.',
    },
    {
      name: 'treatments',
      title: 'Treatments',
      type: 'array',
      group: 'general',
      description:
        'Treatments offered at this clinic. Optional — use Open / Replace / Create New / Clear.',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
    },
    {
      name: 'specialists',
      title: 'Specialists',
      type: 'array',
      group: 'general',
      description:
        'Specialists working at this clinic. Keep in sync with Specialist → Clinics when possible.',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
    },

    // ── Page Content ────────────────────────────────────────────────────────
    {
      name: 'primaryImage',
      title: 'Main image (legacy)',
      type: 'image',
      group: 'pageContent',
      options: { hotspot: true },
      description:
        'Legacy hero / primary photo. Prefer Hero Media → Image. Website dual-reads both.',
      hidden: ({ document }: { document?: { heroMedia?: unknown } }) =>
        Boolean(document?.heroMedia),
      validation: (Rule: any) =>
        Rule.custom((value: unknown, context: { document?: { heroMedia?: { mediaType?: string; image?: unknown } } }) => {
          const media = context.document?.heroMedia
          if (media?.mediaType === 'image' && media.image) return true
          if (media?.mediaType === 'video') return true
          if (value) return true
          return 'Main image is required (or set Hero Media)'
        }),
    },
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'media',
      group: 'pageContent',
      description:
        'Preferred clinic hero media (Image or Video). Upload Video takes priority over Video URL.',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      description: 'Main body copy for the clinic page (NO + EN).',
      validation: requiredNoEnI18n('Description'),
    },
    {
      name: 'valueProposition',
      title: 'Value propositions',
      type: 'object',
      group: 'pageContent',
      options: { collapsible: true, collapsed: true },
      description: 'Short marketing highlights near the top of the clinic page.',
      fields: [
        {
          name: 'valueProposition1',
          title: 'Value proposition 1',
          type: 'internationalizedArrayString',
        },
        {
          name: 'valueProposition2',
          title: 'Highlight line 2',
          type: 'string',
          description: 'Short highlight — not the same as Opening hours under General.',
          placeholder: '08:00–16:00',
        },
        {
          name: 'socialProof',
          title: 'Social proof',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'detail',
      title: 'Practical information',
      type: 'object',
      group: 'pageContent',
      fieldset: 'pcPractical',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'parking',
          title: 'Parking',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Parking'),
        },
        {
          name: 'publicTransport',
          title: 'Public transport',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Public transport'),
        },
        {
          name: 'accessibility',
          title: 'Accessibility',
          type: 'internationalizedArrayText',
          validation: requiredNoEnI18n('Accessibility'),
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Interior gallery',
      description: 'Extra images shown as the “Fra klinikken” strip on the clinic page.',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcGallery',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
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
      title: 'Clinic FAQ',
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
      of: [
        {
          type: 'reference',
          to: [{ type: 'faq' }],
        },
        // Named member — documents that already use `_type: clinicFaq`
        {
          type: 'object',
          name: 'clinicFaq',
          title: 'FAQ',
          fields: clinicInlineFaqFields,
          preview: i18nFaqItemPreview,
        },
        // Unnamed member — accepts legacy `_type: object` rows (fixes Studio list validation)
        {
          type: 'object',
          title: 'FAQ',
          fields: clinicInlineFaqFields,
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      ...pageSectionsFieldForGroup('sharedSections'),
      fieldset: 'ssAssemblers',
      title: 'Website bands',
      description: 'Add Specialists, Booking CTA, Articles, or Insurance bands.',
    },

    // ── SEO ─────────────────────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      fieldset: 'seoFields',
      description: 'Search title, description, and social previews for the clinic page.',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      fieldset: 'seoFields',
      title: 'AI / GEO summary',
      description: 'Short summary for search and AI assistants.',
    },

    // ── Advanced ────────────────────────────────────────────────────────────
    {
      name: 'booking',
      title: 'Booking setup',
      type: 'object',
      group: 'advanced',
      fieldset: 'advancedBooking',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'method',
          title: 'Method',
          type: 'string',
          options: {
            layout: 'radio',
            list: [
              { title: 'Show screen with contact info', value: 'info' },
              { title: 'Show PatientSky form', value: 'pasientsky' },
              { title: 'Show Metodika form', value: 'metodika' },
              { title: 'Closed for booking', value: 'closed' },
            ],
          },
          initialValue: 'info',
          validation: reqStr('Method'),
        },
        {
          name: 'serviceProviderId',
          title: 'PatientSky provider ID',
          description: 'Only when Method = PatientSky.',
          type: 'string',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'pasientsky',
          validation: whenBookingMethod('pasientsky', (rule) =>
            rule.custom((value: string | undefined) =>
              value?.trim() ? true : 'PatientSky Service Provider ID is required',
            ),
          ),
        },
        {
          name: 'metodikaLocationId',
          title: 'Metodika location ID',
          description:
            'Metodika `location-id` for this clinic (only when Method = Metodika). Recommended for correct linking in booking step 2.',
          type: 'number',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'metodika',
        },
        {
          name: 'externalBookingUrl',
          title: 'External booking URL',
          type: 'url',
          description:
            'Only when Method = contact info and booking goes via external partner.',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'info',
        },
        {
          name: 'closedMessage',
          title: 'Message when closed',
          type: 'internationalizedArrayText',
          description: 'Only when Method = Closed for booking',
          hidden: ({ parent }: { parent?: { method?: string } }) => parent?.method !== 'closed',
          validation: whenBookingMethod('closed', (rule) =>
            rule.custom((value: unknown) => {
              if (!pickNo(value)?.trim()) return 'Message when closed (Norwegian) is required'
              if (!pickForLang(value, 'en')?.trim()) return 'Message when closed (English) is required'
              return true
            }),
          ),
        },
      ],
    },
    {
      name: 'locationSearch',
      title: 'Map coordinates',
      type: 'object',
      group: 'advanced',
      fieldset: 'advancedTech',
      options: { collapsible: true, collapsed: false },
      description: 'Latitude / longitude for the embedded map on the clinic page.',
      validation: (Rule: any) =>
        Rule.required().custom((value: { lat?: number; lng?: number } | undefined) => {
          if (value?.lat == null || value?.lng == null) {
            return 'Latitude and longitude are required'
          }
          return true
        }),
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: reqStr('Latitude'),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: reqStr('Longitude'),
        },
      ],
    },
    {
      name: 'services',
      title: 'Service IDs',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedTech',
      of: [{ type: 'string' }],
      description:
        'Technical category/service IDs for booking filters and clinic matching. Prefer Treatments and Specialists under General for editor-facing relationships.',
      validation: (Rule: any) => Rule.required().min(1).error('Add at least one service ID'),
    },
    {
      name: 'sortOrder',
      title: 'List order',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedTech',
      description: 'Lower numbers appear first on clinic lists. Use Manual order in the desk to sort by this.',
      initialValue: 0,
      validation: (Rule: any) => Rule.integer().min(0).error('Must be 0 or higher'),
    },
  ],
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      const faqs = document.faqs as unknown[] | undefined
      const hasFaqs = Array.isArray(faqs) && faqs.length > 0
      const hasFaqCollection = Boolean(
        (document.faqCollection as { _ref?: string } | undefined)?._ref,
      )
      if ((hasFaqs || hasFaqCollection) && !pickNo(document.faqSectionTitle)?.trim()) {
        issues.push('FAQ heading (Norwegian) is missing')
      }
      if ((hasFaqs || hasFaqCollection) && !pickForLang(document.faqSectionTitle, 'en')?.trim()) {
        issues.push('FAQ heading (English) is missing')
      }
      return issues.length ? issues.join('. ') : true
    }),
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Name (A–Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      address: 'address',
      method: 'booking.method',
      specialists: 'specialists',
      media: 'primaryImage',
    },
    prepare({
      title,
      address,
      method,
      specialists,
      media,
    }: {
      title?: unknown
      address?: string
      method?: string
      specialists?: unknown[]
      media?: unknown
    }) {
      const specialistCount = Array.isArray(specialists) ? specialists.length : 0
      const methodLabel = method ? BOOKING_METHOD_LABELS[method] || method : ''
      const parts = [
        address || '',
        methodLabel,
        specialistCount > 0
          ? `${specialistCount} specialist${specialistCount === 1 ? '' : 's'}`
          : '',
      ].filter(Boolean)
      return {
        title: pickNo(title) || 'Clinic',
        subtitle: parts.join(' · '),
        media: media as any,
      }
    },
  },
}
