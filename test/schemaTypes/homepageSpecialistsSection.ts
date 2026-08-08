import {SpecialistIcon} from './icons'
import {HomepageSpecialistsSectionInput} from '../sanity/components/HomepageSpecialistsSectionInput'
import {requiredNoEnI18n} from './i18n'
import {pickStudioEn} from './studioPreview'
import {specialistsDisplayModeChip} from '../sanity/page-editor/specialistsDisplayMode'

const INTERNAL_PAGE_REF_TYPES = [
  {type: 'specialistsListingPage'},
  {type: 'specialistsPage'},
  {type: 'aboutPage'},
  {type: 'servicesPage'},
  {type: 'newsPage'},
  {type: 'clinicsPage'},
  {type: 'contactPage'},
  {type: 'guidePage'},
  {type: 'pricingPage'},
  {type: 'insurancePage'},
  {type: 'careersPage'},
]

export const homepageSpecialistsSectionType = {
  name: 'homepageSpecialistsSection',
  title: 'Specialists',
  type: 'object',
  icon: SpecialistIcon,
  components: {
    input: HomepageSpecialistsSectionInput,
  },
  fieldsets: [
    {
      name: 'seeAll',
      title: 'See All',
      options: {collapsible: false},
    },
  ],
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
      description: 'Optional small label above the heading (used on Pricing).',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      validation: requiredNoEnI18n('Heading'),
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'internationalizedArrayText',
      validation: requiredNoEnI18n('Intro'),
    },
    {
      name: 'displayMode',
      title: 'Display',
      type: 'string',
      options: {
        list: [
          {title: 'All Specialists', value: 'all'},
          {title: 'Manual Selection', value: 'manual'},
          {title: 'Filter by Category', value: 'category'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    },
    {
      name: 'specialists',
      title: 'Selected Specialists',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'specialist'}]}],
      hidden: ({parent}: {parent?: {displayMode?: string}}) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'treatmentCategory'}]}],
      hidden: ({parent}: {parent?: {displayMode?: string}}) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'maxItems',
      title: 'Maximum Specialists',
      type: 'number',
      initialValue: 8,
      validation: (Rule: any) => Rule.min(1).max(48),
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Carousel', value: 'carousel'},
          {title: 'Grid', value: 'grid'},
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
      // Pricing reuses this object for selection/copy only — its frontend is a fixed
      // dark grid and never reads `layout`. Hide the control there so editors are not
      // offered an unsupported option. Homepage still uses Carousel / Grid.
      hidden: ({document}: {document?: {_type?: string}}) =>
        document?._type === 'pricingPage',
    },
    {
      name: 'seeAllLabel',
      title: 'Text',
      type: 'internationalizedArrayString',
      fieldset: 'seeAll',
    },
    {
      name: 'seeAllLink',
      title: 'Internal Link',
      type: 'reference',
      to: INTERNAL_PAGE_REF_TYPES,
      fieldset: 'seeAll',
    },
    {
      name: 'randomizeOrder',
      title: 'Randomize Order',
      type: 'boolean',
      initialValue: false,
      hidden: () => true,
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      displayMode: 'displayMode',
      layout: 'layout',
      maxItems: 'maxItems',
    },
    prepare({
      heading,
      displayMode,
      layout,
      maxItems,
    }: {
      heading?: unknown
      displayMode?: string
      layout?: string
      maxItems?: number
    }) {
      const title = pickStudioEn(heading) || 'Specialists'
      const parts = [
        specialistsDisplayModeChip(displayMode),
        layout === 'grid' ? 'grid' : layout === 'carousel' ? 'carousel' : 'Layout unset',
      ]
      if (typeof maxItems === 'number') parts.push(`max ${maxItems}`)
      return {title, subtitle: parts.join(' · ')}
    },
  },
}

export default homepageSpecialistsSectionType
