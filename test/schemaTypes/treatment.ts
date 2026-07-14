// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category
import { TreatmentIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  i18nTitleItemPreview,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} is required`)

const validateRelativePath = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!value) return true
    if (typeof value !== 'string') return true
    return value.startsWith('/')
      ? true
      : 'The path must be a relative link starting with a slash (e.g. /prices)'
  })

export default {
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  icon: TreatmentIcon,
  groups: [
    { name: 'general', title: 'General' },
    { name: 'hero', title: 'Hero section' },
    { name: 'symptoms', title: 'Symptoms (About us)' },
    { name: 'flow', title: 'Process (How it works)' },
    { name: 'features', title: 'Areas of expertise & promises' },
    { name: 'seo', title: 'SEO / Synlighet' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Treatment name',
      type: 'internationalizedArrayString',
      group: 'general',
      validation: reqI18n('Treatment name'),
    },
    {
      ...i18nSlugFieldFromTitle('title'),
      group: 'general',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'general',
      to: [{ type: 'treatmentCategory' }],
    },
    {
      name: 'parentCategoryLabel',
      title: 'Parent category (display name)',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'F.eks. "Gynecology" — vises som breadcrumb',
      validation: reqI18n('Parent Category'),
    },
    {
      name: 'description',
      title: 'Intro text',
      type: 'internationalizedArrayText',
      group: 'general',
      validation: reqI18n('Intro text'),
    },
    // FAQs
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      group: 'general',
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
    // Sub-items (shown in 3rd column of service dropdown)
    {
      name: 'subItems',
      title: 'Submenu items',
      group: 'general',
      description: 'Displayed as the third column in the services dropdown in the menu',
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
              return { title: pickNo(title) }
            },
          },
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      group: 'general',
      description: 'Lower numbers are shown first within the category.',
    },
    // ─── Hero Section ────────────────────────────────────────────────────────
    { name: 'homeBreadcrumbLabel', title: 'Breadcrumb — home', type: 'internationalizedArrayString', group: 'hero', description: 'The text displayed as the first segment in the breadcrumb navigation, e.g. \'Home\'.' },
    { name: 'srOnlyTitle', title: 'Hidden H1 (screen reader)', type: 'internationalizedArrayString', group: 'hero', description: 'A hidden heading for screen readers only. Briefly describe the page, e.g. \'Treatment page for hysteroscopy at CMedical\'.' },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      description: 'The main title displayed large in the hero section on the treatment page. Keep it short and punchy.',
      validation: reqI18n('Hero Title'),
    },
    {
      name: 'heroDescription',
      title: 'Hero-ingress',
      type: 'internationalizedArrayText',
      group: 'hero',
      description: 'Short introduction under the hero title. 1–3 sentences describing the treatment.',
      validation: reqI18n('Hero-ingress'),
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Image displayed to the right in the hero section. Recommended size: 800×600px or better.',
      validation: (Rule: any) => Rule.required().error('Hero image is required'),
    },
    { name: 'heroImageAlt', title: 'Hero image — alt text', type: 'internationalizedArrayString', group: 'hero', description: 'Descriptive alt text for accessibility, e.g. "Doctor performs hysteroscopy".' },
    {
      name: 'heroVideo',
      title: 'Hero-video URL',
      type: 'url',
      group: 'hero',
      description: 'Optional video URL played in the hero section. Upload an MP4 video (max 10MB, 16:9 format) and paste the URL here.',
    },
    { name: 'rating', title: 'Rating / tagline', type: 'internationalizedArrayString', group: 'hero', description: 'Short text shown under the hero image, e.g. \'4.9/5 from 200 patients\'.' },
    { name: 'heroPrice', title: 'Hero — prislinje', type: 'internationalizedArrayString', group: 'hero', description: 'Brief price info in the hero section, e.g., \'From NOK 2,500\'.' },
    { name: 'hideSeePriser', title: 'Hide \'See prices\' link', type: 'boolean', group: 'hero', initialValue: false },
    { name: 'heroAvailability', title: 'Hero — tilgjengelighet', type: 'internationalizedArrayString', group: 'hero', description: 'Availability text in the hero section, e.g., \'Available at 3 clinics\'.' },
    {
      name: 'heroThemes',
      title: 'Hero — tema-chips',
      type: 'array',
      group: 'hero',
      description: 'Keywords/theme chips shown in the hero section.',
      of: [{ type: 'internationalizedArrayString' }],
    },
    {
      name: 'heroPoints',
      title: 'Hero-punkter',
      type: 'array',
      group: 'hero',
      description: 'Short benefit points shown in the hero section.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc' },
            prepare({ title, subtitle }: any) {
              return {
                title: pickNo(title) || 'Untitled',
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Booking / CTA ───────────────────────────────────────────────────────
    { name: 'primaryCtaLabel', title: 'Primary CTA text', type: 'internationalizedArrayString', group: 'hero', description: 'The text on the \'Book appointment\' button in the hero section.' },
    { name: 'seePricesLabel', title: 'See prices — text', type: 'internationalizedArrayString', group: 'hero' },
    { name: 'seePricesHref', title: 'See prices — link', type: 'string', group: 'hero', description: 'URL to pricing page, e.g. /prices.', validation: validateRelativePath },
    { name: 'callCtaLabel', title: 'Call us — text', type: 'internationalizedArrayString', group: 'hero' },
    { name: 'bookingService', title: 'Booking service ID', type: 'string', group: 'hero', description: 'Optional service ID sent to the booking system (e.g. \'hysterectomy\').' },
    // ─── Reasons / Symptoms ──────────────────────────────────────────────────

    {
      name: 'reasonsTitle',
      title: 'Symptoms — title',
      type: 'internationalizedArrayString',
      group: 'symptoms',
      description: 'Heading for the symptoms/indications section.',
    },
    { name: 'reasonsLead', title: 'Symptoms — introduction 1', type: 'internationalizedArrayText', group: 'symptoms' },
    { name: 'reasonsLead2', title: 'Symptoms — introduction 2', type: 'internationalizedArrayText', group: 'symptoms' },
    {
      name: 'reasonsLayout',
      title: 'Symptoms — layout',
      type: 'string',
      group: 'symptoms',
      options: {
        list: [
          { title: 'Prosa (standard)', value: 'prose' },
          { title: 'Trekkspill', value: 'accordion' },
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
      group: 'symptoms',
      description: 'Add symptoms or indications for this treatment.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Number', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
              return {
                title: `${prefix}${pickNo(title) || 'Untitled'}`,
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Flow (Treatment Steps) ───────────────────────────────────────────────

    { name: 'flowTitle', title: 'Process — title', type: 'internationalizedArrayString', group: 'flow', description: 'Heading for the \'How it works\' section.' },
    { name: 'flowImage', title: 'Process — image', type: 'image', group: 'flow', options: { hotspot: true } },
    { name: 'flowImageAlt', title: 'Process — image alt', type: 'internationalizedArrayString', group: 'flow' },
    { name: 'flowLinkLabel', title: 'Process — link text', type: 'internationalizedArrayString', group: 'flow' },
    { name: 'flowLinkHref', title: 'Process — link', type: 'string', group: 'flow', validation: validateRelativePath },
    {
      name: 'flow',
      title: 'Process — steps',
      type: 'array',
      group: 'flow',
      description: 'Add treatment steps displayed in the \'How it works\' section, e.g. \'Consultation\', \'Examination\', \'Aftercare\'.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Step number / label', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
              return {
                title: `${prefix}${pickNo(title) || 'Untitled'}`,
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Expert Areas ────────────────────────────────────────────────────────
    {
      name: 'expertAreas',
      title: 'Areas of expertise',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
        { name: 'description', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'items',
          title: 'Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
                { name: 'path', title: 'Link', type: 'string', validation: validateRelativePath },
                { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                { name: 'imageAlt', title: 'Image — alt', type: 'internationalizedArrayString' },
              ],
              preview: {
                select: { title: 'title', subtitle: 'desc', media: 'image' },
                prepare({ title, subtitle, media }: any) {
                  return {
                    title: pickNo(title) || 'Untitled',
                    subtitle: pickNo(subtitle),
                    media,
                  }
                },
              },
            },
          ],
        },
      ],
    },
    // ─── Promises (3-column benefits) ────────────────────────────────────────
    {
      name: 'promises',
      title: 'Promises / advantages (3 columns)',
      type: 'array',
      group: 'features',
      description: 'Show three highlighted benefits with image and text.',
      validation: (Rule: any) => Rule.required().min(1).error('At least one advantage/promise must be added'),
      of: [
        {
          type: 'object',
          fields: [

            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Image — alt', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              return {
                title: pickNo(title) || 'Untitled',
                subtitle: pickNo(subtitle),
                media,
              }
            },
          },
        },
      ],
    },
    // ─── Text + Image Section ────────────────────────────────────────────────
    {
      name: 'textSection',
      title: 'Text + image section',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'points',
          title: 'Punkter',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'n', title: 'Number', type: 'internationalizedArrayString' },
                { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Description', type: 'internationalizedArrayText' },
              ],
              preview: {
                select: { title: 'title', n: 'n', subtitle: 'desc' },
                prepare({ title, n, subtitle }: any) {
                  const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
                  return {
                    title: `${prefix}${pickNo(title) || 'Untitled'}`,
                    subtitle: pickNo(subtitle),
                  }
                },
              },
            },
          ],
        },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'imageAlt', title: 'Image alt', type: 'internationalizedArrayString' },
      ],
    },
    // ─── Related Section ─────────────────────────────────────────────────────
    {
      name: 'relatedSection',
      title: 'Related services',
      type: 'object',
      group: 'features',
      fields: [

        { name: 'title', title: 'Related — title', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Relatert — ingress', type: 'internationalizedArrayText' },
        { name: 'asIntro', title: 'Relatert rett etter hero', type: 'boolean' },
        { name: 'asServices', title: 'Related as service carousel', type: 'boolean' },
        { name: 'seeAllHref', title: 'Related — \'see all\' link', type: 'string', description: 'E.g. /treatments/fertility', validation: validateRelativePath },
        { name: 'seeAllLabel', title: 'Related — \'see all\' text', type: 'internationalizedArrayString' },
        {
          name: 'items',
          title: 'Related treatments',
          description: 'Select and sort treatments to display in the carousel (Related services).',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'treatment' }],
            },
          ],
        },
      ],
    },
    // ─── CTA Sections ────────────────────────────────────────────────────────
    // [DEPRECATED] CTA and Specialist Section fields moved to pageSections
    /*
    { name: 'ctaTitle', title: 'Closing CTA — title', type: 'internationalizedArrayString' },
    { name: 'ctaDescription', title: 'Final CTA — text', type: 'internationalizedArrayText' },
    { name: 'conversationCtaTitle', title: 'Mid-page CTA — title', type: 'internationalizedArrayString' },
    // ─── Specialist Section ──────────────────────────────────────────────────
    { name: 'specialistTitle', title: 'Specialist section — title', type: 'internationalizedArrayString' },
    { name: 'specialistDescription', title: 'Specialist section — introduction', type: 'internationalizedArrayText' },
    { name: 'specialistCtaLabel', title: 'Specialist section — CTA text', type: 'internationalizedArrayString' },
    { name: 'specialistCtaHref', title: 'Specialist section — CTA link', type: 'string', description: 'E.g. /specialists?category=gynecology' },
    */
    // ─── Insurance ───────────────────────────────────────────────────────────
    { name: 'insuranceEyebrow', title: 'Insurance — eyebrow', type: 'internationalizedArrayString', group: 'features' },
    { name: 'insuranceTitle', title: 'Insurance — title', type: 'internationalizedArrayString', group: 'features' },
    {
      name: 'insurancePartners',
      title: 'Insurance partners',
      type: 'array',
      group: 'features',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', title: 'Key', type: 'string' },
          { name: 'label', title: 'Name', type: 'internationalizedArrayString' },
        ],
        preview: {
          select: { title: 'label', subtitle: 'key' },
          prepare({ title, subtitle }: any) {
            return {
              title: pickNo(title) || 'Unnamed',
              subtitle,
            }
          },
        },
      }],
    },
    // ─── UI Labels ───────────────────────────────────────────────────────────
    { name: 'expertReadMoreLabel', title: 'Expert card — link text', type: 'internationalizedArrayString', group: 'general' },
    { name: 'scrollLeftLabel', title: 'Karusell — scroll venstre', type: 'internationalizedArrayString', group: 'general' },
    { name: 'scrollRightLabel', title: 'Carousel — scroll right', type: 'internationalizedArrayString', group: 'general' },
    {
      ...pageSectionsField,
      group: 'general',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      validation: reqI18n('GEO-sammendrag'),
    },
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
      ],
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
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title: pickNo(title) || 'Treatment',
        subtitle: pickNo(subtitle) || 'No category',
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

      // Validation for the new flat design fields
      if (!document.heroImage) issues.push('Hero image is missing')
      if (!pickNo(document.heroTitle)?.trim()) issues.push('Hero title (Norwegian) is missing')
      if (!pickForLang(document.heroTitle, 'en')?.trim()) {
        issues.push('Hero title (English) is missing')
      }
      if (!pickNo(document.heroDescription)?.trim()) issues.push('Hero-ingress (norsk) mangler')
      if (!pickForLang(document.heroDescription, 'en')?.trim()) {
        issues.push('Hero-ingress (engelsk) mangler')
      }
      // Specialists validation removed as they are now managed under pageSections

      const promises = document.promises as unknown[] | undefined
      if (!Array.isArray(promises) || promises.length === 0) {
        issues.push('At least one advantage/promise must be added')
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
