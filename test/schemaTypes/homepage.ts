// Schema: Homepage
// Sanity document type for the main landing page
// Phase 10: editor experience follows docs/REUSABLE_MODULE_FRAMEWORK.md
// Phase 2: Structure section panes + filtered native form input (ObjectInputMembers)
import { HomeIcon } from './icons'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'
import {pickStudioEn} from './studioPreview'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {homepagePageEditorConfig} from '../sanity/page-editor/pages/homepageSections'
import {HomepageSpecialistsSectionField} from '../sanity/components/HomepageSpecialistsSectionField'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
  softVideoRules,
  videoDescription,
  VIDEO_GUIDELINE,
} from './mediaGuidelines'

export default {
  name: 'homepage',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Structure opens section panes; native form view filters fields via this input.
  components: {
    input: createPageSectionDocumentInput(homepagePageEditorConfig),
  },
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    // Hero Banner — page-owned for now (Hero Module attach comes later)
    {
      name: 'heroBanner',
      title: 'Hero Banner',
      description:
        'Homepage hero slides. Edited on this page. Content Library Hero Modules are not wired yet.',
      type: 'object',
      fields: [
        {
          name: 'slides',
          title: 'Slides',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'media',
                  title: 'Media',
                  type: 'media',
                  description: mediaDescription(
                    'hero',
                    'Preferred. Image or Video for this slide.',
                  ),
                },
                {
                  name: 'mobileImage',
                  title: 'Mobile Image',
                  type: 'image',
                  options: mediaImageOptions('heroMobile'),
                  description: mediaDescription(
                    'heroMobile',
                    'Optional. Used instead of the main Image on mobile screens. Desktop keeps using Media.',
                  ),
                  validation: softImageRules('heroMobile'),
                },
                {
                  name: 'image',
                  title: 'Image (legacy)',
                  type: 'image',
                  options: mediaImageOptions('hero'),
                  description: mediaDescription(
                    'hero',
                    'Legacy. Prefer Media → Image. Kept until migration is verified; website dual-reads both.',
                  ),
                  validation: softImageRules('hero'),
                  hidden: ({parent}: {parent?: {media?: unknown}}) => Boolean(parent?.media),
                },
                {
                  name: 'videoFile',
                  title: 'Video File (legacy)',
                  type: 'file',
                  options: {
                    accept: VIDEO_GUIDELINE.accept,
                  },
                  description: videoDescription(
                    'Legacy. Prefer Media → Upload Video. Website dual-reads both until migration is verified.',
                  ),
                  validation: softVideoRules(),
                  hidden: ({parent}: {parent?: {media?: unknown}}) => Boolean(parent?.media),
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
                select: {
                  title: 'heading',
                  subtitle: 'subheading',
                  mediaImage: 'media.image',
                  legacyImage: 'image',
                },
                prepare({ title, subtitle, mediaImage, legacyImage }: any) {
                  return {
                    title: pickStudioEn(title),
                    subtitle: pickStudioEn(subtitle),
                    media: mediaImage || legacyImage,
                  }
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
    },
    // Service / treatment categories — page selects Medical Content entities
    {
      name: 'serviceCategories',
      title: 'Treatment categories',
      description:
        'Categories shown in the homepage grid. Tile image comes from each category → General → Homepage category tile image. Order categories here. Not a Library pack.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    {
      name: 'patientTrustBanner',
      title: 'Patient trust banner',
      description:
        'Band under the hero (large number + link). Page-owned content — not a reusable Library pack.',
      type: 'object',
      fields: [
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: mediaImageOptions('background'),
          description: mediaDescription(
            'background',
            'Optional textured background image (e.g. blur-skin). Terracotta used as fallback.',
          ),
          validation: softImageRules('background'),
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
      title: 'Articles – intro column',
      description:
        'Left column copy for the news/articles band. Featured articles below are Medical Content picks.',
      type: 'object',
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
    // Featured Articles – page picks Medical Content entities
    {
      name: 'featuredArticles',
      title: 'Featured articles (top 4)',
      description:
        'Articles shown in the homepage news grid. Select up to 4 from Medical Content. Not a Library pack.',
      type: 'array',
      validation: (Rule: any) => Rule.max(4),
      of: [
        {
          type: 'reference',
          to: [{ type: 'article' }],
        },
      ],
      options: {
        sortable: true,
      },
    },
    {
      name: 'resultsStatsSection',
      title: 'Statistics',
      description:
        'Result statistics band on this page. Page-owned for now — Library Statistics packs come later only if reused.',
      type: 'object',
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
          title: 'Statistic rows',
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
                  return { title: title || '', subtitle: pickStudioEn(subtitle) }
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
      title: 'Statistics bar',
      type: 'array',
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
              return { title: title || '', subtitle: pickStudioEn(subtitle) }
            },
          },
        },
      ],
    },
    // Value Badges
    {
      name: 'valueBadges',
      title: 'Why choose us',
      description:
        'Short trust / value points for this page. Page-owned — not a Library pack yet.',
      type: 'array',
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
              return { title: pickStudioEn(title), subtitle: subtitle || '' }
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
    },
    // Promo Blocks
    {
      name: 'promoBlocks',
      title: 'Promotion blocks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: mediaImageOptions('card'), description: mediaDescription('card'), validation: softImageRules('card') },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'CTA text', type: 'internationalizedArrayString' },
            { name: 'ctaLink', title: 'CTA link', type: 'string' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              return { title: pickStudioEn(title), subtitle: pickStudioEn(subtitle), media }
            },
          },
        },
      ],
    },
    {
      name: 'bookingCta',
      title: 'Booking CTA',
      type: 'pageSectionBookingCta',
      description:
        'Select, replace, clear, or create a CTA Collection from the Content Library.',
    },
    {
      ...pageSectionsField,
      title: 'Website bands',
      hidden: () => true,
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ Heading',
      description:
        'Heading shown above the FAQ on the homepage (e.g. Frequently Asked Questions). Belongs to this page.',
      type: 'internationalizedArrayString',
    },
    {
      name: 'faqCollection',
      title: 'Homepage FAQ',
      type: 'reference',
      to: [{ type: 'faqCollection' }],
      description:
        'Select, replace, clear, or create an FAQ Collection from the Content Library.',
      options: {
        disableNew: false,
      },
    },
    {
      name: 'faqs',
      title: 'Previous FAQ list',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      hidden: () => true,
    },
    {
      name: 'reviewsSubheading',
      title: 'Reviews - Subtitle',
      description:
        'Page-owned review band chrome. Review cards load from Gold Stars; set ratings and widget ID below.',
      type: 'internationalizedArrayString',
    },
    {
      name: 'reviewsHeading',
      title: 'Reviews - Headline',
      type: 'internationalizedArrayString',
    },
    {
      name: 'reviewsGoogleRating',
      title: 'Google average rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.6,
    },
    {
      name: 'reviewsLegelistenRating',
      title: 'Legelisten average rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.8,
    },
    {
      name: 'reviewsCtaTitle',
      title: 'Reviews - CTA title',
      type: 'internationalizedArrayString',
    },
    {
      name: 'reviewsCtaSubtitle',
      title: 'Reviews - CTA subtitle',
      type: 'internationalizedArrayString',
    },
    {
      name: 'reviewsGoldStarsWidgetId',
      title: 'Gold Stars slider widget ID',
      type: 'string',
      description:
        'Review Pixel simple-slider widget ID from Gold Stars. Leave empty to use the default homepage slider.',
      initialValue: '6137cba4-0791-45ec-9cab-6ea667442f9a',
    },
    {
      name: 'googleReviews',
      title: 'Reviews on the homepage (legacy)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description:
        'Deprecated — homepage review cards now load from Gold Stars. Kept for reference only.',
      hidden: () => true,
    },
    {
      name: 'specialistsSection',
      type: 'homepageSpecialistsSection',
      components: {
        field: HomepageSpecialistsSectionField,
      },
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    { ...geoSummaryField, title: 'AI / GEO summary', description: 'Short summary for search and AI assistants.' },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      return { title: pickStudioEn(title) || 'Homepage' }
    },
  },
}
