// Schema: Pricing Page
import {PricingIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo} from './i18n'
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
        'CMS source of truth for the Pricing page list. Optional Metodika activity ID on each line controls whether “Bestill time” appears — Metodika never removes a line from this list.',
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
                      of: [
                        {
                          type: 'object',
                          fields: [
                            {
                              name: 'name',
                              title: 'Treatment',
                              type: 'internationalizedArrayString',
                            },
                            {name: 'price', title: 'Price (NOK)', type: 'number'},
                            {
                              name: 'priceLabel',
                              title: 'Price display',
                              type: 'internationalizedArrayString',
                              description: 'E.g. "fra 2.100,-"',
                            },
                            {
                              name: 'note',
                              title: 'Duration / note',
                              type: 'internationalizedArrayString',
                            },
                            {
                              name: 'source',
                              title: 'Data source',
                              type: 'string',
                              options: {
                                list: [
                                  {title: 'Metodika', value: 'metodika'},
                                  {title: 'Sanity only', value: 'sanity'},
                                ],
                                layout: 'radio',
                              },
                              initialValue: 'sanity',
                              validation: (Rule: any) =>
                                Rule.required().custom((value: unknown) =>
                                  value === 'metodika' || value === 'sanity'
                                    ? true
                                    : 'Choose metodika or sanity',
                                ),
                              description:
                                'Identifies whether this pricing item originates from Metodika or is managed only in Sanity. Metodika items may have an activity ID and can show “Bestill time”. Sanity-only items never show a booking button.',
                            },
                            {
                              name: 'apiActivityId',
                              title: 'Metodika activity ID',
                              type: 'number',
                              description:
                                'Optional Metodika wbactivity id. Required for booking when source is Metodika. Leave empty for Sanity-only lines — the line still appears on the Pricing page without “Bestill time”.',
                              hidden: ({parent}: {parent?: {source?: string}}) =>
                                parent?.source !== 'metodika',
                            },
                          ],
                          preview: {
                            select: {
                              title: 'name',
                              subtitle: 'price',
                              priceLabel: 'priceLabel',
                              apiActivityId: 'apiActivityId',
                              source: 'source',
                            },
                            prepare({title, subtitle, priceLabel, apiActivityId, source}: any) {
                              const label = pickStudioEn(priceLabel)
                              const isMetodika = source === 'metodika'
                              const bookable =
                                isMetodika &&
                                typeof apiActivityId === 'number' &&
                                apiActivityId > 0
                              const origin =
                                source === 'metodika'
                                  ? 'metodika'
                                  : source === 'sanity'
                                    ? 'sanity'
                                    : 'source?'
                              const booking = bookable
                                ? ` · bookable #${apiActivityId}`
                                : ' · not bookable'
                              return {
                                title: pickStudioEn(title) || 'Unnamed',
                                subtitle:
                                  (label || (subtitle != null ? `${subtitle} kr` : '')) +
                                  ` · ${origin}` +
                                  booking,
                              }
                            },
                          },
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
              hidden: () => true,
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'name', title: 'Treatment', type: 'internationalizedArrayString'},
                    {name: 'price', title: 'Price (NOK)', type: 'number'},
                    {
                      name: 'priceLabel',
                      title: 'Price display',
                      type: 'internationalizedArrayString',
                    },
                    {name: 'note', title: 'Note', type: 'internationalizedArrayString'},
                    {
                      name: 'source',
                      title: 'Data source',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Metodika', value: 'metodika'},
                          {title: 'Sanity only', value: 'sanity'},
                        ],
                      },
                    },
                    {name: 'apiActivityId', title: 'Metodika activity ID', type: 'number'},
                  ],
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
