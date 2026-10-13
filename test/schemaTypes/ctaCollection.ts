/**

 * CTA Collection — reusable Booking CTA pack (Content Library).

 *

 * Phase 2 (schema only): mirrors pageSectionBookingCta content fields.

 * Page bands keep placement/order; dual-read + migration come in later phases.

 *

 * Replaces the unused generic `ctaModule` for new work (ctaModule stays registered,

 * desk-hidden, until cleanup).

 */

import {defineIncomingReferenceDecoration} from 'sanity/structure'

import {CtaIcon} from './icons'

import {bookingCtaContentFields} from './bookingCtaFields'

import {studioCollectionDocumentPreview} from './studioPreview'



const WEBSITE_HINT = 'Shown on the live website.'



const CTA_WEBSITE_COPY = new Set(['title', 'subtitle'])

const CTA_WEBSITE_BUTTONS = new Set([

  'primaryLabel',

  'showSecondaryButton',

  'secondaryLabel',

  'quickInfoItems',

])

const CTA_WEBSITE_LINKS = new Set(['primaryPath', 'bookingCategory', 'secondaryPath'])

const CTA_WEBSITE_APPEARANCE = new Set([

  'backgroundColor',

  'textColor',

  'primaryButtonStyle',

  'primaryButtonColor',

])



function fieldsetForWebsiteField(name: string): string {

  if (CTA_WEBSITE_COPY.has(name)) return 'websiteCopy'

  if (CTA_WEBSITE_BUTTONS.has(name)) return 'websiteButtons'

  if (CTA_WEBSITE_LINKS.has(name)) return 'websiteLinks'

  if (CTA_WEBSITE_APPEARANCE.has(name)) return 'websiteAppearance'

  return 'websiteCopy'

}



function withWebsiteFieldHint(field: (typeof bookingCtaContentFields)[number]) {

  const baseDesc =

    typeof field.description === 'string' && field.description.trim()

      ? field.description.trim()

      : undefined

  const description = baseDesc ? `${baseDesc} ${WEBSITE_HINT}` : WEBSITE_HINT



  return {

    ...field,

    group: 'website',

    fieldset: fieldsetForWebsiteField(field.name),

    description,

  }

}



export default {

  name: 'ctaCollection',

  title: 'CTA Collection',

  type: 'document',

  icon: CtaIcon,

  description:

    'Reusable booking CTA (call-to-action band). Use the **Website** tab for copy visitors see. Use **Studio only** for labels and editor notes — never shown on the site.',

  groups: [

    {name: 'website', title: 'Website', default: true},

    {name: 'studio', title: 'Studio only'},

  ],

  fieldsets: [

    {

      name: 'studioMeta',

      title: 'Studio only — not on the website',

      options: {collapsible: true, collapsed: false},

    },

    {

      name: 'websiteCopy',

      title: 'Website — heading & ingress',

      options: {collapsible: true, collapsed: false},

    },

    {

      name: 'websiteButtons',

      title: 'Website — buttons & quick info',

      options: {collapsible: true, collapsed: false},

    },

    {

      name: 'websiteLinks',

      title: 'Website — links & booking',

      options: {collapsible: true, collapsed: false},

    },

    {

      name: 'websiteAppearance',

      title: 'Website — colors (optional)',

      options: {collapsible: true, collapsed: true},

    },

  ],

  fields: [

    {

      name: 'internalName',

      title: 'Internal name',

      type: 'string',

      group: 'studio',

      fieldset: 'studioMeta',

      description:

        'Label for this pack in Studio lists only (e.g. “Fertilitet Booking CTA”). Not shown on the website.',

      validation: (Rule: any) => Rule.required(),

    },

    {

      name: 'description',

      title: 'Pack note (editors)',

      type: 'text',

      rows: 3,

      group: 'studio',

      fieldset: 'studioMeta',

      description:

        'Optional reminder for editors about when to use this pack. Not the website ingress — edit **Ingress** under the Website tab for public text.',

    },

    {

      name: 'sortOrder',

      title: 'Sorting order',

      type: 'number',

      group: 'studio',

      fieldset: 'studioMeta',

      description: 'Optional order when listing packs in Studio. Not shown on the website.',

      initialValue: 0,

    },

    {

      name: 'notes',

      title: 'Internal notes',

      type: 'text',

      rows: 3,

      group: 'studio',

      fieldset: 'studioMeta',

      description: 'Free-form editor notes. Not shown on the website.',

    },

    ...bookingCtaContentFields.map(withWebsiteFieldHint),

  ],

  renderMembers: (members: unknown[]) => [

    ...members,

    defineIncomingReferenceDecoration({

      name: 'usedOn',

      title: 'Used on',

      description:

        'Pages that reference this CTA pack from a Booking CTA band. Prefer editing from Pages day to day.',

      types: [

        {type: 'homepage'},

        {type: 'treatmentCategory'},

        {type: 'treatment'},

        {type: 'clinicPage'},

        {type: 'aboutPage'},

        {type: 'servicesPage'},

        {type: 'clinicsPage'},

        {type: 'contactPage'},

        {type: 'insurancePage'},

        {type: 'guidePage'},

        {type: 'themePage'},

        {type: 'pricingPage'},

        {type: 'specialistsPage'},

        {type: 'specialistsListingPage'},

        {type: 'newsPage'},

        {type: 'careersPage'},

        {type: 'article'},

      ],

      creationAllowed: false,

    }),

  ],

  orderings: [

    {

      title: 'Sorting order',

      name: 'sortOrderAsc',

      by: [{field: 'sortOrder', direction: 'asc'}],

    },

    {

      title: 'Internal name',

      name: 'internalNameAsc',

      by: [{field: 'internalName', direction: 'asc'}],

    },

  ],

  preview: {

    select: {

      internalName: 'internalName',

      title: 'title',

      primaryPath: 'primaryPath',

    },

    prepare({

      internalName,

      title,

      primaryPath,

    }: {

      internalName?: string

      title?: unknown

      primaryPath?: string

    }) {

      return studioCollectionDocumentPreview({

        internalName,

        title,

        typeLabel: 'CTA Collection',

        detail: primaryPath || '/booking',

      })

    },

  },

}


