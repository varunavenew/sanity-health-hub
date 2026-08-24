import { defineField, defineType } from 'sanity'

/** One row in the Tracking events reference — seeded read-only documentation for SEO/GTM. */
export default defineType({
  name: 'trackingEventReferenceItem',
  title: 'Event',
  type: 'object',
  fields: [
    defineField({
      name: 'eventName',
      title: 'Event name',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Priority 1 — Google Ads', value: 'priority1' },
          { title: 'Priority 2 — Reporting', value: 'priority2' },
          { title: 'Live — do not change', value: 'preserve' },
          { title: 'GTM only (no site push)', value: 'gtmOnly' },
        ],
      },
    }),
    defineField({
      name: 'implementationStatus',
      title: 'Site implementation',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Implemented', value: 'implemented' },
          { title: 'Partial', value: 'partial' },
          { title: 'Pending', value: 'pending' },
          { title: 'Not applicable (GTM/content only)', value: 'na' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'What it does',
      type: 'text',
      readOnly: true,
      rows: 3,
    }),
    defineField({
      name: 'whereItFires',
      title: 'Where it fires',
      type: 'text',
      readOnly: true,
      rows: 4,
    }),
    defineField({
      name: 'parameters',
      title: 'Parameters (exact keys for GA4)',
      type: 'text',
      readOnly: true,
      rows: 5,
    }),
    defineField({
      name: 'examplePayload',
      title: 'Example dataLayer push',
      type: 'text',
      readOnly: true,
      rows: 8,
    }),
    defineField({
      name: 'verifyCommand',
      title: 'Verify in browser console',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'developerNotes',
      title: 'Developer / GTM notes',
      type: 'text',
      readOnly: true,
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'eventName',
      priority: 'priority',
      status: 'implementationStatus',
    },
    prepare({ title, priority, status }) {
      const badge = [priority, status].filter(Boolean).join(' · ')
      return {
        title: title || 'Event',
        subtitle: badge || undefined,
      }
    },
  },
})
