import { defineField, defineType } from 'sanity'
import { ListIcon } from './icons'

export default defineType({
  name: 'trackingEventsReference',
  title: 'Tracking events (reference)',
  type: 'document',
  icon: ListIcon,
  description:
    'Read-only documentation for SEO and GTM. Event wiring lives in code (src/lib/tracking/); conversion mapping lives in GTM. Developers update this list via migrate-tracking-events-reference.ts.',
  fields: [
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      readOnly: true,
      rows: 10,
    }),
    defineField({
      name: 'parameterKeysReference',
      title: 'Parameter keys (must match exactly)',
      type: 'text',
      readOnly: true,
      rows: 6,
    }),
    defineField({
      name: 'ownershipSplit',
      title: 'Who manages what',
      type: 'text',
      readOnly: true,
      rows: 8,
    }),
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      readOnly: true,
      of: [{ type: 'trackingEventReferenceItem' }],
    }),
    defineField({
      name: 'seoTeamNotes',
      title: 'SEO team notes (editable)',
      type: 'text',
      rows: 6,
      description:
        'Optional internal notes for the SEO/GTM team. Does not affect the live site.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Tracking events (reference)' }
    },
  },
})
