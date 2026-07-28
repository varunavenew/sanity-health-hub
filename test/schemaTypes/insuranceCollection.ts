/**
 * Insurance Collection — reusable insurance partner pack (Content Library).
 *
 * Not a singleton: editors may create Standard, Corporate, Fertility, etc.
 * Page insurance bands reference a collection; dual-read + migration later.
 */
import {defineIncomingReferenceDecoration} from 'sanity/structure'
import {InsuranceIcon} from './icons'
import {insuranceContentFields} from './bookingCtaFields'
import {studioCollectionDocumentPreview} from './studioPreview'

export default {
  name: 'insuranceCollection',
  title: 'Insurance Collection',
  type: 'document',
  icon: InsuranceIcon,
  fields: [
    {
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description:
        'Editor-only label (e.g. Standard Insurance Partners, Corporate Partners). Not shown on the website.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional note about when this pack should be used.',
    },
    ...insuranceContentFields,
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
        'Pages that reference this insurance pack from an Insurance band. Prefer editing from Pages day to day.',
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
      partners: 'partners',
    },
    prepare({
      internalName,
      title,
      partners,
    }: {
      internalName?: string
      title?: unknown
      partners?: unknown[]
    }) {
      const count = Array.isArray(partners) ? partners.length : 0
      const partnerDetail = `${count} partner${count === 1 ? '' : 's'}`
      const base = studioCollectionDocumentPreview({
        internalName,
        title,
        typeLabel: 'Insurance Collection',
        detail: partnerDetail,
      })
      return base
    },
  },
}
