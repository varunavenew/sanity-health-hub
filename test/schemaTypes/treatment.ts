// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category
// Phase 11F / 11G / 11X: Studio IA + FAQ Collection
// Phase 12UX: Medical Content UX sprint — fewer duplicates, Advanced for technical fields
// Phase 15T: Final Studio polish (Category parity — auto-slug, validation, SEO fieldset)
import { TreatmentIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import {pickStudioEn} from './studioPreview'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'
import { TreatmentDocumentInput } from '../sanity/components/TreatmentDocumentInput'
import {
  composeImageValidation,
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const reqI18n = requiredNoEnI18n

const validateRelativePath = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!value) return true
    if (typeof value !== 'string') return true
    return value.startsWith('/')
      ? true
      : 'The path must be a relative link starting with a slash (e.g. /prices)'
  })

const sectionCollapsed = { collapsible: true, collapsed: true } as const

export default {
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  icon: TreatmentIcon,
  components: {
    input: TreatmentDocumentInput,
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
      name: 'pcHero',
      title: 'Hero',
      description: 'Top of the treatment page. Media, headings, and primary buttons.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcIntro',
      title: 'Introduction',
      description:
        'Required intro text for the hero body. Hero ingress (under Hero) is optional backup only.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcSymptoms',
      title: 'Symptoms',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcProcess',
      title: 'Treatment process',
      description: 'How it works — steps and optional image.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcBenefits',
      title: 'Benefits',
      description: 'Promises / advantages (typically three columns).',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcExpertAreas',
      title: 'Expert areas',
      description: 'Linked services cards. Optional.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcTextSection',
      title: 'Text section',
      description: 'Optional text + points band.',
      options: sectionCollapsed,
      group: 'pageContent',
    },
    {
      name: 'pcRelated',
      title: 'Related treatments',
      description:
        'Page-owned curated list for this treatment page (not automatic category siblings). Choose which treatments appear and how the band displays.',
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
      title: 'Specialists · Insurance · Articles · Booking CTA',
      description:
        'Website order is fixed: Specialists → Insurance → Articles → Booking CTA. FAQ is above. Select an Insurance Collection from the Content Library.',
      options: sectionCollapsed,
      group: 'sharedSections',
    },
    {
      name: 'pcInsuranceLegacy',
      title: 'Previous insurance fields',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'seoFields',
      title: 'Search & AI',
      description: 'Meta tags and AI summary for this page.',
      options: sectionCollapsed,
      group: 'seo',
    },
    {
      name: 'advancedList',
      title: 'List order',
      description: 'Order within category menus and lists. Rarely edited after setup.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedOverrides',
      title: 'Overrides & booking',
      description:
        'Optional overrides and booking IDs. Leave empty when the website can use Category / defaults.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedNav',
      title: 'Navigation (megamenu)',
      description: 'Third-column links in the services megamenu. Not page body content.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedChrome',
      title: 'UI chrome labels',
      description: 'Rarely edited labels. Safe defaults apply when empty.',
      options: sectionCollapsed,
      group: 'advanced',
    },
    {
      name: 'advancedLegacy',
      title: 'Legacy fields',
      description:
        'Compatibility fields from earlier Treatment schemas. Kept only to avoid Studio unknown-field warnings until Phase 19/20 migration and cleanup.',
      options: sectionCollapsed,
      group: 'advanced',
    },
  ],
  fields: [
    // ── General (Business Entity) ─────────────────────────────────────────────
    {
      name: 'title',
      title: 'Treatment name',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'Official treatment name. Page hero copy lives under Page Content.',
      validation: reqI18n('Treatment name'),
    },
    {
      ...i18nSlugFieldFromTitle('title', {
        description:
          'URL Slug (NO) and URL Slug (EN). Fills automatically from Treatment name when empty. Manual edits are kept — changing the name later will not overwrite a filled slug.',
      }),
      group: 'general',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'general',
      of: [{type: 'reference', to: [{type: 'treatmentCategory'}]}],
      options: {sortable: true},
      description:
        'Assign one or more Treatment Categories. First category is primary (breadcrumbs, booking, canonical path). Drag to reorder.',
      validation: (Rule: any) =>
        Rule.required()
          .min(1)
          .error(
            'Select at least one Treatment Category before publishing — breadcrumbs, menus, and booking depend on it.',
          )
          .unique()
          .error('Each category can only be selected once'),
    },
    {
      name: 'pageRole',
      title: 'Page role',
      type: 'string',
      group: 'general',
      description:
        'Treatment/service pages can appear in Related Services. Team pages are routable but are excluded from Related Services on other treatments.',
      options: {
        list: [
          {title: 'Treatment / service', value: 'service'},
          {title: 'Team page', value: 'team'},
        ],
        layout: 'radio',
      },
      initialValue: 'service',
    },
    {
      // Stored for historical dual-read / rollback only. Never shown in Studio.
      // Prefer categories[]; migrate-treatment-categories.ts copies category → categories[].
      name: 'category',
      title: 'category',
      type: 'reference',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      to: [{type: 'treatmentCategory'}],
      hidden: () => true,
      readOnly: true,
    },

    // ── Page Content ──────────────────────────────────────────────────────────
    {
      name: 'description',
      title: 'Intro text',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      fieldset: 'pcIntro',
      description:
        'Required. Primary introduction shown in the hero body on the website. Hero ingress is optional and only used if this is empty on the site.',
      validation: reqI18n('Intro text'),
    },
    {
      name: 'heroTitle',
      title: 'Hero title',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
      description:
        'Large title in the hero. Often the same as Treatment name — copy from General if unsure. Required for publish.',
      validation: reqI18n('Hero Title'),
    },
    {
      name: 'heroDescription',
      title: 'Hero ingress (optional)',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      fieldset: 'pcHero',
      description:
        'Optional. Only used on the website if Intro text is empty. Prefer editing Intro text — you do not need both.',
    },
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'media',
      group: 'pageContent',
      fieldset: 'pcHero',
      description: mediaDescription(
        'hero',
        'Preferred hero media (Image or Video).',
      ),
    },
    {
      name: 'heroImage',
      title: 'Hero image (legacy)',
      type: 'image',
      group: 'pageContent',
      fieldset: 'pcHero',
      options: mediaImageOptions('hero'),
      description: mediaDescription(
        'hero',
        'Legacy. Prefer Hero Media → Image. Required only when Hero Media is unset; website dual-reads both.',
      ),
      hidden: ({ document }: { document?: { heroMedia?: unknown } }) =>
        Boolean(document?.heroMedia),
      validation: composeImageValidation('hero', (Rule: any) =>
        Rule.custom((value: unknown, context: { document?: { heroMedia?: { mediaType?: string; image?: unknown } } }) => {
          const media = context.document?.heroMedia
          if (media?.mediaType === 'image' && media.image) return true
          if (media?.mediaType === 'video') return true
          if (value) return true
          return 'Hero image is required (or set Hero Media)'
        }),
      ),
    },
    {
      name: 'heroImageAlt',
      title: 'Hero image — alt text',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },
    {
      name: 'heroVideo',
      title: 'Hero video URL (legacy)',
      type: 'url',
      group: 'pageContent',
      fieldset: 'pcHero',
      description: 'Legacy video URL. Prefer Hero Media → Video URL.',
      hidden: ({ document }: { document?: { heroMedia?: unknown } }) =>
        Boolean(document?.heroMedia),
    },
    {
      name: 'rating',
      title: 'Rating / tagline',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },
    {
      name: 'heroPrice',
      title: 'Price info',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },
    {
      name: 'hideSeePriser',
      title: 'Hide See prices link',
      type: 'boolean',
      group: 'pageContent',
      fieldset: 'pcHero',
      initialValue: false,
    },
    {
      name: 'heroAvailability',
      title: 'Availability',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },
    {
      name: 'heroThemes',
      title: 'Theme chips',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcHero',
      of: [{ type: 'internationalizedArrayString' }],
    },
    {
      name: 'heroPoints',
      title: 'Hero points',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcHero',
      description: 'Short benefit points in the hero (titles shown on the site).',
      of: [
        {
          name: 'heroPoint',
          title: 'Hero point',
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc' },
            prepare({ title, subtitle }: any) {
              return {
                title: pickStudioEn(title) || 'Untitled',
                subtitle: pickStudioEn(subtitle),
              }
            },
          },
        },
      ],
    },
    {
      name: 'primaryCtaLabel',
      title: 'Primary button text',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
      description:
        'Book appointment button text in the hero only. Mid-page / footer Booking CTA is under Shared Sections.',
    },
    {
      name: 'seePricesLabel',
      title: 'See prices — text',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },
    {
      name: 'seePricesHref',
      title: 'See prices — link',
      type: 'string',
      group: 'pageContent',
      fieldset: 'pcHero',
      description: 'Internal path, e.g. /priser.',
      validation: validateRelativePath,
    },
    {
      name: 'callCtaLabel',
      title: 'Call us — text',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcHero',
    },

    // Symptoms
    {
      name: 'reasonsTitle',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcSymptoms',
    },
    {
      name: 'reasonsLead',
      title: 'Introduction 1',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      fieldset: 'pcSymptoms',
    },
    {
      name: 'reasonsLead2',
      title: 'Introduction 2',
      type: 'internationalizedArrayText',
      group: 'pageContent',
      fieldset: 'pcSymptoms',
    },
    {
      name: 'reasonsLayout',
      title: 'Layout',
      type: 'string',
      group: 'pageContent',
      fieldset: 'pcSymptoms',
      options: {
        list: [
          { title: 'Prose (standard)', value: 'prose' },
          { title: 'Accordion', value: 'accordion' },
          { title: 'Automatic', value: 'auto' },
        ],
        layout: 'radio',
      },
      initialValue: 'prose',
    },
    {
      name: 'reasons',
      title: 'Symptoms / indications',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcSymptoms',
      of: [
        {
          name: 'reasonItem',
          title: 'Symptom',
          type: 'object',
          fields: [
            { name: 'n', title: 'Number', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickStudioEn(n) ? `${pickStudioEn(n)}: ` : ''
              return {
                title: `${prefix}${pickStudioEn(title) || 'Untitled'}`,
                subtitle: pickStudioEn(subtitle),
              }
            },
          },
        },
      ],
    },

    // Process
    {
      name: 'flowTitle',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcProcess',
    },
    {
      name: 'flowImage',
      title: 'Image',
      type: 'image',
      group: 'pageContent',
      fieldset: 'pcProcess',
      options: mediaImageOptions('treatment'),
      description: mediaDescription('treatment'),
      validation: softImageRules('treatment'),
    },
    {
      name: 'flowImageAlt',
      title: 'Image alt',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcProcess',
    },
    {
      name: 'flowLinkLabel',
      title: 'Link text',
      type: 'internationalizedArrayString',
      group: 'pageContent',
      fieldset: 'pcProcess',
    },
    {
      name: 'flowLinkHref',
      title: 'Link',
      type: 'string',
      group: 'pageContent',
      fieldset: 'pcProcess',
      validation: validateRelativePath,
    },
    {
      name: 'flow',
      title: 'Steps',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcProcess',
      of: [
        {
          name: 'flowStep',
          title: 'Step',
          type: 'object',
          fields: [
            { name: 'n', title: 'Step number / label', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickStudioEn(n) ? `${pickStudioEn(n)}: ` : ''
              return {
                title: `${prefix}${pickStudioEn(title) || 'Untitled'}`,
                subtitle: pickStudioEn(subtitle),
              }
            },
          },
        },
      ],
    },

    // Benefits
    {
      name: 'promises',
      title: 'Promises / advantages',
      type: 'array',
      group: 'pageContent',
      fieldset: 'pcBenefits',
      description: 'Highlighted benefits with image and text. Leave empty to hide on the website.',
      of: [
        {
          name: 'promiseItem',
          title: 'Benefit',
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'image', title: 'Image', type: 'image', options: mediaImageOptions('treatment'), description: mediaDescription('treatment'), validation: softImageRules('treatment') },
            { name: 'imageAlt', title: 'Image — alt', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              return {
                title: pickStudioEn(title) || 'Untitled',
                subtitle: pickStudioEn(subtitle),
                media,
              }
            },
          },
        },
      ],
    },

    // Expert areas
    {
      name: 'expertAreas',
      title: 'Content',
      type: 'object',
      group: 'pageContent',
      fieldset: 'pcExpertAreas',
      fields: [
        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
        { name: 'description', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'items',
          title: 'Linked services',
          type: 'array',
          of: [
            {
              name: 'expertAreaItem',
              title: 'Linked service',
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
                { name: 'path', title: 'Link', type: 'string', validation: validateRelativePath },
                { name: 'image', title: 'Image', type: 'image', options: mediaImageOptions('treatment'), description: mediaDescription('treatment'), validation: softImageRules('treatment') },
                { name: 'imageAlt', title: 'Image — alt', type: 'internationalizedArrayString' },
              ],
              preview: {
                select: { title: 'title', subtitle: 'desc', media: 'image' },
                prepare({ title, subtitle, media }: any) {
                  return {
                    title: pickStudioEn(title) || 'Untitled',
                    subtitle: pickStudioEn(subtitle),
                    media,
                  }
                },
              },
            },
          ],
        },
      ],
    },

    // Text section
    {
      name: 'textSection',
      title: 'Content',
      type: 'object',
      group: 'pageContent',
      fieldset: 'pcTextSection',
      fields: [
        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'points',
          title: 'Points',
          type: 'array',
          of: [
            {
              name: 'textSectionPoint',
              title: 'Point',
              type: 'object',
              fields: [
                { name: 'n', title: 'Number', type: 'internationalizedArrayString' },
                { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
              ],
              preview: {
                select: { title: 'title', n: 'n', subtitle: 'desc' },
                prepare({ title, n, subtitle }: any) {
                  const prefix = pickStudioEn(n) ? `${pickStudioEn(n)}: ` : ''
                  return {
                    title: `${prefix}${pickStudioEn(title) || 'Untitled'}`,
                    subtitle: pickStudioEn(subtitle),
                  }
                },
              },
            },
          ],
        },
        { name: 'image', title: 'Image', type: 'image', options: mediaImageOptions('treatment'), description: mediaDescription('treatment'), validation: softImageRules('treatment') },
        { name: 'imageAlt', title: 'Image alt', type: 'internationalizedArrayString' },
      ],
    },

    // Insurance (legacy Page Content — fallback until production verification)
    {
      name: 'insuranceEyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'pcInsuranceLegacy',
      hidden: () => true,
    },
    {
      name: 'insuranceTitle',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'pcInsuranceLegacy',
      hidden: () => true,
    },
    {
      name: 'insurancePartners',
      title: 'Partners',
      type: 'array',
      group: 'advanced',
      fieldset: 'pcInsuranceLegacy',
      hidden: () => true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', title: 'Key', type: 'string' },
            { name: 'label', title: 'Name', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'key' },
            prepare({ title, subtitle }: any) {
              return {
                title: pickStudioEn(title) || 'Unnamed',
                subtitle,
              }
            },
          },
        },
      ],
    },

    // Related
    {
      name: 'relatedSection',
      title: 'Content',
      type: 'object',
      group: 'pageContent',
      fieldset: 'pcRelated',
      description:
        'Curated related treatments for this page. This is page content — not the Shared Sections assembler list.',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'internationalizedArrayString' },
        { name: 'title', title: 'Heading', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'asIntro',
          title: 'Show right after hero',
          type: 'boolean',
        },
        {
          name: 'asServices',
          title: 'Show as service carousel',
          type: 'boolean',
        },
        {
          name: 'seeAllHref',
          title: 'See all — link',
          type: 'string',
          validation: validateRelativePath,
        },
        {
          name: 'seeAllLabel',
          title: 'See all — text',
          type: 'internationalizedArrayString',
        },
        {
          name: 'items',
          title: 'Related treatments',
          description:
            'Manual selection and order for this page’s related band. Team pages cannot be selected.',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'treatment'}],
              options: {
                filter: 'pageRole != "team" || !defined(pageRole)',
              },
            },
          ],
        },
      ],
    },

    // ── Shared Sections ─────────────────────────────────────────────────────
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      description: 'Heading above the FAQ. Questions live in the Collection.',
      type: 'internationalizedArrayString',
      group: 'sharedSections',
      fieldset: 'ssFaq',
      initialValue: [
        { _key: 'no', language: 'no', value: 'Ofte stilte spørsmål' },
        { _key: 'en', language: 'en', value: 'Frequently asked questions' },
      ],
    },
    {
      name: 'faqCollection',
      title: 'Treatment FAQ',
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
        {
          type: 'object',
          title: 'FAQ',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'internationalizedArrayString',
              validation: reqI18n('Question'),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'internationalizedArrayText',
              validation: reqI18n('Answer'),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      ...pageSectionsField,
      group: 'sharedSections',
      fieldset: 'ssAssemblers',
      title: 'Website bands',
      description:
        'Website order is fixed: Specialists → Insurance → Articles → Booking CTA. Dragging only changes Studio order. Select an Insurance Collection here — same workflow as Treatment Category.',
    },

    // ── SEO ─────────────────────────────────────────────────────────────────
    {
      name: 'srOnlyTitle',
      title: 'Hidden H1',
      type: 'internationalizedArrayString',
      group: 'seo',
      fieldset: 'seoFields',
      description:
        'Optional screen-reader / SEO H1. Leave empty unless SEO needs a different heading than the hero.',
    },
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
      description: 'Short summary for search and AI. Not the same as the Hero heading.',
      validation: reqI18n('GEO-sammendrag'),
    },

    // ── Advanced (rarely edited — do not delete) ────────────────────────────
    {
      name: 'sortOrder',
      title: 'List order',
      type: 'number',
      group: 'advanced',
      fieldset: 'advancedList',
      description: 'Order in category menus and lists. Lower numbers appear first.',
    },
    {
      name: 'parentCategoryLabel',
      title: 'Parent category label (override)',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedOverrides',
      description:
        'Optional. Breadcrumb uses the linked Category name when this is empty. Only fill if you need a different display name.',
    },
    {
      name: 'bookingService',
      title: 'Booking service ID',
      type: 'string',
      group: 'advanced',
      fieldset: 'advancedOverrides',
      description:
        'Optional service ID for the booking system (e.g. hysterectomy). Not the Booking CTA band — that is under Shared Sections → Website bands.',
    },
    {
      name: 'subItems',
      title: 'Submenu items',
      group: 'advanced',
      fieldset: 'advancedNav',
      description:
        'Third column in the services megamenu. Leave empty if this treatment has no submenu links.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: reqI18n('Title'),
            },
            {
              name: 'anchor',
              title: 'Anchor (optional)',
              type: 'string',
              description: 'Anchor link on page (#section)',
            },
            {
              name: 'path',
              title: 'Custom URL (optional)',
              type: 'string',
              description: 'Full URL if the element should link to another page',
            },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickStudioEn(title) }
            },
          },
        },
      ],
    },
    {
      name: 'themesAriaLabel',
      title: 'Themes aria label',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedChrome',
      description:
        'Legacy accessibility label for hero theme chips. Still read by the frontend with safe defaults.',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy subtitle from earlier treatment pages. Not rendered by the current Treatment layout.',
    },
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy page label from earlier treatment layouts. Queried for compatibility, not rendered today.',
    },
    {
      name: 'reasonsEyebrow',
      title: 'Symptoms eyebrow',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy symptoms section label. Current Treatment layout renders the symptoms heading directly.',
    },
    {
      name: 'flowEyebrow',
      title: 'Process eyebrow',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy process section label. Current Treatment layout renders the process heading directly.',
    },
    {
      name: 'benefitsTitle',
      title: 'Benefits title',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy title for old benefits arrays. Current Benefits section uses Promises / advantages.',
    },
    {
      name: 'processSectionTitle',
      title: 'Process section title',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy heading for old process[] content. Current field is Treatment process → Heading.',
    },
    {
      name: 'linkedServicesSectionTitle',
      title: 'Linked services section title',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy heading for old linkedServices content. Current field is Expert areas.',
    },
    {
      name: 'process',
      title: 'Process (legacy)',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy process steps. Migrated equivalent is Treatment process → Steps (`flow`).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
          ],
        },
      ],
    },
    {
      name: 'sections',
      title: 'Sections (legacy)',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy about sections. Migrated equivalent is Symptoms / indications (`reasons`).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'ID', type: 'string' },
            { name: 'heading', title: 'Heading', type: 'internationalizedArrayString' },
            { name: 'content', title: 'Content', type: 'internationalizedArrayText' },
          ],
        },
      ],
    },
    {
      name: 'linkedServices',
      title: 'Linked services (legacy)',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy linked service cards. Migrated equivalent is Expert areas → Linked services.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'path', title: 'Link', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'quickInfoItems',
      title: 'Quick info items (legacy)',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy quick-info rows from old CTA/UI contract. Not rendered by the current Treatment layout.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'iconKey', title: 'Icon key', type: 'string' },
            { name: 'label', title: 'Label', type: 'internationalizedArrayString' },
          ],
        },
        { type: 'internationalizedArrayString' },
      ],
    },
    {
      name: 'bottomCta',
      title: 'Bottom CTA (legacy)',
      type: 'object',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description:
        'Legacy bottom CTA copy. Current Treatment layout uses pageSectionBookingCta / fallback BookingCTA.',
      fields: [
        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
        { name: 'subtitle', title: 'Subtitle', type: 'internationalizedArrayText' },
        { name: 'primaryLabel', title: 'Primary label', type: 'internationalizedArrayString' },
        { name: 'secondaryLabel', title: 'Secondary label', type: 'internationalizedArrayString' },
        { name: 'primaryPath', title: 'Primary path', type: 'string' },
        { name: 'secondaryPath', title: 'Secondary path', type: 'string' },
      ],
    },
    {
      name: 'layout',
      title: 'Layout object (legacy)',
      type: 'subTreatmentLayout',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description:
        'Legacy nested treatment layout object. Root fields are used by the current page; keep this until final migration cleanup.',
    },
    {
      name: 'relatedSpecialists',
      title: 'Related specialists (legacy)',
      type: 'array',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description:
        'Legacy specialist references. Current specialist bands use Shared Sections → Website bands.',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
    },
    {
      name: 'ctaTitle',
      title: 'Closing CTA title (legacy)',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy CTA title queried for compatibility. Current layout uses booking CTA bands.',
    },
    {
      name: 'ctaDescription',
      title: 'Closing CTA text (legacy)',
      type: 'internationalizedArrayText',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy CTA text queried for compatibility. Current layout uses booking CTA bands.',
    },
    {
      name: 'conversationCtaTitle',
      title: 'Mid-page CTA title (legacy)',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy override still used by the hardcoded mid-page CTA.',
    },
    {
      name: 'specialistTitle',
      title: 'Specialist section title (legacy)',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy specialist section chrome. Current specialist band uses Shared Sections.',
    },
    {
      name: 'specialistDescription',
      title: 'Specialist section description (legacy)',
      type: 'internationalizedArrayText',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy specialist section chrome. Current specialist band uses Shared Sections.',
    },
    {
      name: 'specialistCtaLabel',
      title: 'Specialist CTA label (legacy)',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy specialist CTA copy. Current specialist band uses Shared Sections.',
    },
    {
      name: 'specialistCtaHref',
      title: 'Specialist CTA link (legacy)',
      type: 'string',
      group: 'advanced',
      fieldset: 'advancedLegacy',
      description: 'Legacy specialist CTA link. Current specialist band uses Shared Sections.',
    },
    {
      name: 'homeBreadcrumbLabel',
      title: 'Breadcrumb — home',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedChrome',
      description: 'First breadcrumb segment (e.g. Home). Rarely changed.',
    },
    {
      name: 'expertReadMoreLabel',
      title: 'Expert card — link text',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedChrome',
      description: 'Read more label on expert area cards. Defaults apply if empty.',
    },
    {
      name: 'scrollLeftLabel',
      title: 'Carousel — scroll left',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedChrome',
    },
    {
      name: 'scrollRightLabel',
      title: 'Carousel — scroll right',
      type: 'internationalizedArrayString',
      group: 'advanced',
      fieldset: 'advancedChrome',
    },
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Title (A–Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parentCategoryLabel',
      categoryTitle: 'categories.0.title',
      legacyCategoryTitle: 'category.title',
      media: 'heroImage',
    },
    prepare({ title, subtitle, categoryTitle, legacyCategoryTitle, media }: any) {
      return {
        title: pickStudioEn(title) || 'Treatment',
        subtitle:
          pickStudioEn(subtitle) ||
          pickStudioEn(categoryTitle) ||
          pickStudioEn(legacyCategoryTitle) ||
          'No category',
        media,
      }
    },
  },
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!pickNo(document.title)?.trim()) issues.push('Treatment name (Norwegian) is missing')
      if (!pickForLang(document.title, 'en')?.trim()) {
        issues.push('Treatment name (English) is missing')
      }

      if (!document.heroImage) {
        const media = document.heroMedia as
          | {mediaType?: string; image?: unknown; videoUrl?: unknown}
          | undefined
        const hasHeroMedia =
          (media?.mediaType === 'image' && Boolean(media.image)) ||
          media?.mediaType === 'video' ||
          Boolean(media?.image) ||
          Boolean(media?.videoUrl)
        if (!hasHeroMedia) {
          issues.push('Hero media is missing — set Hero Media or a legacy Hero image')
        }
      }
      if (!pickNo(document.heroTitle)?.trim()) issues.push('Hero title (Norwegian) is missing')
      if (!pickForLang(document.heroTitle, 'en')?.trim()) {
        issues.push('Hero title (English) is missing')
      }
      if (!pickNo(document.description)?.trim()) {
        issues.push('Intro text (Norwegian) is missing')
      }
      if (!pickForLang(document.description, 'en')?.trim()) {
        issues.push('Intro text (English) is missing')
      }

      const categories = document.categories as {_ref?: string}[] | undefined
      const hasCategories =
        Array.isArray(categories) && categories.some((c) => Boolean(c?._ref))
      if (!hasCategories) {
        issues.push(
          'Category is missing — choose at least one Treatment Category before publishing',
        )
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
      if (issues.length === 0) return true
      return issues.join('. ')
    }),
}
