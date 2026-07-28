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

export default {
  name: 'ctaCollection',
  title: 'CTA Collection',
  type: 'document',
  icon: CtaIcon,
  fields: [
    {
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description:
        'Editor-only label (e.g. Gynekologi Booking CTA, Default Booking CTA). Not shown on the website.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional note about when this pack should be used.',
    },
    ...bookingCtaContentFields,
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
      description: 'Optional order when listing packs in Studio.',
      initialValue: 0,
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      rows: 3,
      description: 'Editor-only notes. Not shown on the website.',
    },
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
