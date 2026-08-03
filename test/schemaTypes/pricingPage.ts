// Schema: Pricing Page
import {PricingIcon} from './icons'
import {i18nSlugFieldFromTitle, requiredNoEnSeo, resolveLocalizedString} from './i18n'
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

const PRICING_SHARED_SECTIONS = [
  'pageSectionSpecialists',
  'pageSectionArticles',
  'pageSectionBookingCta',
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
      options: {hotspot: true},
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
      title: 'Previous FAQ list (legacy)',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      of: [{type: 'reference', to: [{type: 'faq'}]}],
      description:
        'Legacy backup. Website dual-reads this only when no FAQ Collection is linked.',
      hidden: ({document}: {document?: {faqCollection?: unknown}}) =>
        Boolean(document?.faqCollection),
    },
    {
      name: 'priceCategories',
      title: 'Price categories (legacy)',
      type: 'array',
      group: 'content',
      fieldset: 'legacy',
      description:
        'Not used on the live Pricing page — prices come from the booking API. Kept for rollback only.',
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
            },
            {
              name: 'items',
              title: 'Price lines',
              type: 'array',
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
                      description: 'E.g. "from 2500,-"',
                    },
                    {name: 'note', title: 'Note', type: 'internationalizedArrayString'},
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'price', priceLabel: 'priceLabel'},
                    prepare({title, subtitle, priceLabel}: any) {
                      const label = resolveLocalizedString(priceLabel)
                      return {
                        title: resolveLocalizedString(title) || 'Unnamed',
                        subtitle: label || (subtitle != null ? `${subtitle} kr` : ''),
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {title: 'categoryName'},
            prepare({title}: any) {
              return {title: resolveLocalizedString(title) || 'Unnamed'}
            },
          },
        },
      ],
    },
    {
      name: 'insuranceNote',
      title: 'Insurance note (legacy)',
      type: 'internationalizedArrayText',
      group: 'content',
      fieldset: 'legacy',
      description: 'Not rendered on the website today. Use Insurance Collection bands or the Insurance page.',
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
      return {title: resolveLocalizedString(title) || 'Pricing'}
    },
  },
}
