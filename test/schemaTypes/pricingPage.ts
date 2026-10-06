// Schema: Pricing Page
import {PricingIcon} from './icons'
import {i18nSlugFieldFromTitle, pickNo, requiredNoEnSeo} from './i18n'
import {pickStudioEn} from './studioPreview'
import {geoSummaryField} from './geoSummary'
import {pageSectionsFieldForGroup} from './pageSections'
import {
  faqCollectionField,
  seoFieldsetProps,
  singletonPageFieldsets,
  singletonPageGroups,
  testimonialsFieldsetProps,
} from './singletonPageLayout'
import {createPageSectionDocumentInput} from '../sanity/page-editor/components/PageSectionDocumentInput'
import {pricingPageEditorConfig} from '../sanity/page-editor/pages/pricingSections'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

const PRICING_SHARED_SECTIONS = [
  'pageSectionInsurance',
  'pageSectionArticles',
] as const

/** Structure list preview for price lines — must not show stale Sanity prices for Metodika rows. */
function preparePricingPriceLinePreview(values: {
  title?: unknown
  subtitle?: unknown
  priceLabel?: unknown
  apiActivityId?: unknown
  source?: unknown
}): {title: string; subtitle: string} {
  const source = values.source
  const apiActivityId =
    typeof values.apiActivityId === 'number' && values.apiActivityId > 0
      ? values.apiActivityId
      : null
  const isCmedicalExplicit = source === 'cmedical' || source === 'sanity'
  const isMetodikaSlot =
    !isCmedicalExplicit &&
    (apiActivityId != null || source === 'metodika')

  if (isMetodikaSlot) {
    return {
      title:
        apiActivityId != null
          ? `Bookable online · Metodika #${apiActivityId}`
          : 'Bookable online · set Metodika wbactivity id',
      subtitle: 'Order in Sanity · name and price from Metodika',
    }
  }

  const title = pickStudioEn(values.title) || 'Unnamed'
  const label = pickStudioEn(values.priceLabel)
  const numericPrice =
    typeof values.subtitle === 'number' && Number.isFinite(values.subtitle)
      ? `${values.subtitle} kr`
      : ''
  const pricePart = label || numericPrice || 'No price set'

  return {
    title,
    subtitle: `Sanity-only · not bookable · ${pricePart}`,
  }
}

const PRICING_PRICE_LINE_PREVIEW = {
  select: {
    title: 'name',
    subtitle: 'price',
    priceLabel: 'priceLabel',
    apiActivityId: 'apiActivityId',
    source: 'source',
  },
  prepare: preparePricingPriceLinePreview,
}

type PriceLineParent = {source?: string; apiActivityId?: number}

/** Sanity-only fields hidden when this row is a bookable Metodika slot (wbactivity id set). */
function hideSanityOnlyPriceFields(parent?: PriceLineParent): boolean {
  if (parent?.source === 'cmedical' || parent?.source === 'sanity') {
    return false
  }
  if (parent?.source === 'metodika') return true
  return typeof parent?.apiActivityId === 'number' && parent.apiActivityId > 0
}

function isSanityOnlyPriceLine(parent?: PriceLineParent): boolean {
  return !hideSanityOnlyPriceFields(parent)
}

/**
 * Bookable online: set Metodika wbactivity id (order slot). Leave id empty for Sanity-only lines.
 * Legacy `source` field is kept hidden for old documents; not shown in Studio.
 */
function pricingPriceLineObjectFields() {
  return [
    {
      name: 'apiActivityId',
      title: 'Metodika wbactivity id (bookable online)',
      type: 'number',
      description:
        'When set: this row is bookable on /priser — name and price come from Metodika; only order is edited here. Leave empty for Sanity-only treatments (name and price below).',
    },
    {
      name: 'name',
      title: 'Treatment',
      type: 'internationalizedArrayString',
      description: 'Sanity-only rows (no wbactivity id). Not used when id is set above.',
      hidden: ({parent}: {parent?: PriceLineParent}) =>
        hideSanityOnlyPriceFields(parent),
      validation: (Rule: any) =>
        Rule.custom((value: unknown, context: {parent?: PriceLineParent}) => {
          if (!isSanityOnlyPriceLine(context.parent)) return true
          if (!pickNo(value)?.trim()) {
            return 'Treatment name is required when wbactivity id is empty'
          }
          return true
        }),
    },
    {
      name: 'price',
      title: 'Price (NOK)',
      type: 'number',
      description: 'Sanity-only rows.',
      hidden: ({parent}: {parent?: PriceLineParent}) =>
        hideSanityOnlyPriceFields(parent),
    },
    {
      name: 'priceLabel',
      title: 'Price display',
      type: 'internationalizedArrayString',
      description: 'Sanity-only (e.g. "fra 2.100,-").',
      hidden: ({parent}: {parent?: PriceLineParent}) =>
        hideSanityOnlyPriceFields(parent),
    },
    {
      name: 'note',
      title: 'Duration / note',
      type: 'internationalizedArrayString',
      description:
        'Sanity-only: duration or note. With wbactivity id: optional duration override on /priser (price still from Metodika).',
    },
    {
      name: 'source',
      title: 'Data source (legacy)',
      type: 'string',
      hidden: () => true,
      readOnly: true,
    },
  ]
}

export default {
  name: 'pricingPage',
  title: 'Pricing',
  type: 'document',
  icon: PricingIcon,
  components: {
    input: createPageSectionDocumentInput(pricingPageEditorConfig),
  },
  groups: [...singletonPageGroups],
  fieldsets: [...singletonPageFieldsets],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {...i18nSlugFieldFromTitle('title', {group: 'hero'})},
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: mediaImageOptions('hero'),
      description: mediaDescription('hero'),
      validation: softImageRules('hero'),
    },
    {
      name: 'introText',
      title: 'Subtitle / intro text',
      type: 'internationalizedArrayText',
      group: 'hero',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      ...testimonialsFieldsetProps,
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
      description:
        'Patient quotes used ONLY on Pricing. These are NOT Google Reviews — manage Google Reviews in Content Library → Google Reviews.',
    },
    {
      name: 'testimonialsTitle',
      title: 'Testimonials heading',
      type: 'internationalizedArrayString',
      ...testimonialsFieldsetProps,
      description: 'Heading above the testimonial cards (not Google Reviews).',
    },
    {
      name: 'faqTitle',
      title: 'FAQ heading',
      type: 'internationalizedArrayString',
      group: 'content',
    },
    faqCollectionField('content'),
    {
      name: 'faqs',
      title: 'Previous FAQ list',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      hidden: () => true,
    },
    {
      name: 'priceCategories',
      title: 'Price categories',
      type: 'array',
      group: 'content',
      description:
        'Structure and order for /priser. Metodika rows: only wbactivity id in Sanity (no treatment name or price in CMS). CMedical rows: full Sanity name/price (not bookable online).',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'categoryName', title: 'Category name', type: 'internationalizedArrayString'},
            {
              name: 'category',
              title: 'Treatment category',
              type: 'reference',
              to: [{type: 'treatmentCategory'}],
              description:
                'Sanity category relationship used for booking fallback (Step 1). Prefer a real category when one exists.',
            },
            {
              name: 'bookingCategorySlug',
              title: 'Booking category slug',
              type: 'string',
              description:
                'Category page slug used in /booking?kategori=… (e.g. gynekologi, urologi, fertilitet). Required for booking links and Step 1 fallback.',
            },
            {
              name: 'subcategories',
              title: 'Subcategories',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Subcategory label',
                      type: 'internationalizedArrayString',
                    },
                    {
                      name: 'treatment',
                      title: 'Related treatment page',
                      type: 'reference',
                      to: [{type: 'treatment'}],
                      description:
                        'Optional. Powers the “Les mer om …” link to the matching treatment page under /behandlinger/…',
                    },
                    {
                      name: 'linkToCategoryPage',
                      title: 'Link “Les mer” to category page',
                      type: 'boolean',
                      initialValue: false,
                      description:
                        'When no treatment is set, link “Les mer om …” to the parent treatment category page (e.g. /fertilitet).',
                    },
                    {
                      name: 'items',
                      title: 'Price lines',
                      type: 'array',
                      description:
                        'Ordered lines. Metodika: choose Metodika + wbactivity id only. CMedical: name, price, note (not bookable online).',
                      of: [
                        {
                          type: 'object',
                          fields: pricingPriceLineObjectFields(),
                          preview: PRICING_PRICE_LINE_PREVIEW,
                        },
                      ],
                    },
                  ],
                  preview: {
                    select: {title: 'label'},
                    prepare({title}: any) {
                      return {title: pickStudioEn(title) || 'Subcategory'}
                    },
                  },
                },
              ],
            },
            {
              name: 'items',
              title: 'Legacy flat price lines',
              type: 'array',
              description:
                'Deprecated. Rows here are invisible in the page editor but may still appear on the site until merged. Run patch-pricing-merge-legacy-into-price-lines.ts to move them into Price lines above, then this list is cleared.',
              hidden: ({parent}: {parent?: {items?: unknown[]}}) =>
                !Array.isArray(parent?.items) || parent.items.length === 0,
              of: [
                {
                  type: 'object',
                  fields: pricingPriceLineObjectFields(),
                  preview: PRICING_PRICE_LINE_PREVIEW,
                },
              ],
            },
          ],
          preview: {
            select: {title: 'categoryName', slug: 'bookingCategorySlug'},
            prepare({title, slug}: any) {
              return {
                title: pickStudioEn(title) || 'Unnamed',
                subtitle: slug || '',
              }
            },
          },
        },
      ],
    },
    {
      name: 'insuranceNote',
      title: 'Insurance note',
      type: 'internationalizedArrayText',
      group: 'content',
      fieldset: 'legacy',
      hidden: () => true,
    },
    {
      name: 'specialistsSection',
      title: 'Specialists',
      type: 'homepageSpecialistsSection',
      group: 'content',
      description:
        'Specialists grid on the Pricing page. Heading, intro, display mode, and max items are edited here — not via Website bands. Layout is fixed (dark grid) on the website.',
    },
    {
      name: 'pricingCta',
      title: 'Pricing CTA',
      type: 'pageSectionBookingCta',
      group: 'content',
      description:
        'Pricing-page-owned booking CTA (Content Library collection). Not the shared Website Booking CTA band — other pages keep their own CTAs.',
    },
    pageSectionsFieldForGroup('content', 'sharedSections', PRICING_SHARED_SECTIONS),
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      ...seoFieldsetProps,
      validation: requiredNoEnSeo,
    },
    {...geoSummaryField, ...seoFieldsetProps},
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: any) {
      return {title: pickStudioEn(title) || 'Pricing'}
    },
  },
}
