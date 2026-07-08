// Schema: Homepage
// Sanity document type for the main landing page
import { HomeIcon } from './icons'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'homepage',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero & tagline', default: true },
    { name: 'sections', title: 'Sections' },
    { name: 'reviews', title: 'Patient Reviews' },
    { name: 'seo', title: 'SEO & Meta' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
      group: 'hero',
    },
    // Hero Banner
    {
      name: 'heroBanner',
      title: 'Hero Banner',
      type: 'object',
      group: 'hero',
      fields: [
        {
          name: 'slides',
          title: 'Slides',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                {
                  name: 'videoFile',
                  title: 'Video File',
                  type: 'file',
                  options: {
                    accept: 'video/*',
                  },
                  description: 'Upload a video file (e.g. MP4) to play in the background of the slide instead of an image.',
                },
                { name: 'heading', title: 'Heading', type: 'internationalizedArrayString' },
                { name: 'subheading', title: 'Subheading', type: 'internationalizedArrayString' },
                { name: 'ctaText', title: 'CTA text', type: 'internationalizedArrayString' },
                {
                  name: 'ctaLink',
                  title: 'CTA link',
                  type: 'internationalizedArrayString',
                  description:
                    'Internal path without locale. NO: e.g. /gynecology — EN: e.g. /gynecology',
                },
              ],
              preview: {
                select: { title: 'heading', subtitle: 'subheading', media: 'image' },
                prepare({ title, subtitle, media }: any) {
                  const pick = (v: any) =>
                    Array.isArray(v)
                      ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                      : (v || '')
                  return { title: pick(title), subtitle: pick(subtitle), media }
                },
              },
            },
          ],
        },
      ],
    },
    // Tagline
    {
      name: 'tagline',
      title: 'Tagline Banner',
      type: 'internationalizedArrayString',
      group: 'hero',
    },
    // Service Categories (Tjenester)
    {
      name: 'serviceCategories',
      title: 'Tjenester (kategorier)',
      description: 'The categories displayed in the service grid on the homepage',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    {
      name: 'patientTrustBanner',
      title: 'Pasienttillit-banner',
      description:
        'Terracotta banner under hero with a large number and link (e.g., \'150,000+\' / \'See our services\')',
      type: 'object',
      group: 'sections',
      fields: [
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Optional textured background image (e.g. blur-skin). Terracotta used as fallback.',
        },
        {
          name: 'value',
          title: 'Number / value',
          type: 'string',
          description: 'E.g. \'150 000 +\'',
        },
        { name: 'label', title: 'Subheading', type: 'internationalizedArrayString' },
        { name: 'ctaText', title: 'Link Text', type: 'internationalizedArrayString' },
        {
          name: 'ctaLink',
          title: 'Link',
          type: 'string',
          description: 'Internal path without locale, e.g. /services',
        },
      ],
    },
    {
      name: 'newsSplitSection',
      title: 'News – splitscreen',
      description: 'Left column in the \'News and articles\' section',
      type: 'object',
      group: 'sections',
      fields: [
        { name: 'heading', title: 'Heading', type: 'internationalizedArrayString' },
        { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
        { name: 'ctaLabel', title: 'Link Text', type: 'internationalizedArrayString' },
        {
          name: 'ctaPath',
          title: 'Link',
          type: 'string',
          description: 'Internal path without locale, e.g. /news',
        },
      ],
    },
    {
      name: 'resultsStatsSection',
      title: 'Resultatstatistikk',
      description: '\'Numbers that tell a story\' section',
      type: 'object',
      group: 'sections',
      fields: [
        { name: 'title', title: 'Heading', type: 'internationalizedArrayString' },
        { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
        {
          name: 'category',
          title: 'Category label (optional)',
          type: 'internationalizedArrayString',
        },
        { name: 'footnote', title: 'Footnote', type: 'internationalizedArrayString' },
        {
          name: 'stats',
          title: 'Statistikkrader',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Value', type: 'string' },
                { name: 'label', title: 'Label', type: 'internationalizedArrayString' },
                { name: 'sub', title: 'Subheading', type: 'internationalizedArrayString' },
              ],
              preview: {
                select: { title: 'value', subtitle: 'label' },
                prepare({ title, subtitle }: any) {
                  const pick = (v: any) =>
                    Array.isArray(v)
                      ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                      : (v || '')
                  return { title: title || '', subtitle: pick(subtitle) }
                },
              },
            },
          ],
        },
      ],
    },
    // Stats Bar
    {
      name: 'statsBar',
      title: 'Statistikkbar',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: title || '', subtitle: pick(subtitle) }
            },
          },
        },
      ],
    },
    // Value Badges
    {
      name: 'valueBadges',
      title: 'Verdibadges',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon', type: 'string', description: 'Lucide icon name' },
            { name: 'label', title: 'Text', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'icon' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: subtitle || '' }
            },
          },
        },
      ],
    },
    {
      name: 'promoBlocksTitle',
      title: 'Promo section heading',
      description: 'Title above promo blocks (e.g. \'News and articles\')',
      type: 'internationalizedArrayString',
      group: 'sections',
    },
    // Promo Blocks
    {
      name: 'promoBlocks',
      title: 'Promosjonsblokker',
      type: 'array',
      group: 'sections',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'CTA text', type: 'internationalizedArrayString' },
            { name: 'ctaLink', title: 'CTA link', type: 'string' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: pick(subtitle), media }
            },
          },
        },
      ],
    },
    {
      ...pageSectionsField,
      group: 'sections',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      description: 'Heading for the FAQ section (e.g. \'Frequently Asked Questions\')',
      type: 'internationalizedArrayString',
      group: 'sections',
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      description:
        'FAQ items displayed on the homepage. Select and sort questions from FAQ documents in Sanity.',
      group: 'sections',
    },
    {
      name: 'reviewsSubheading',
      title: 'Reviews - Subtitle',
      description: 'E.g. \'What our patients say\'',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsHeading',
      title: 'Reviews - Headline',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsGoogleRating',
      title: 'Google gjennomsnittsvurdering',
      type: 'number',
      group: 'reviews',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.6,
    },
    {
      name: 'reviewsLegelistenRating',
      title: 'Legelisten gjennomsnittsvurdering',
      type: 'number',
      group: 'reviews',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.8,
    },
    {
      name: 'reviewsCtaTitle',
      title: 'Reviews - CTA title',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'reviewsCtaSubtitle',
      title: 'Reviews - CTA subtitle',
      type: 'internationalizedArrayString',
      group: 'reviews',
    },
    {
      name: 'googleReviews',
      title: 'Google Reviews on the homepage',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description: 'Select and sort reviews shown in the carousel on the homepage.',
      group: 'reviews',
    },
    // SEO
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
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Hjemmeside')
        : (title || 'Hjemmeside')
      return { title: titleStr }
    },
  },
}
