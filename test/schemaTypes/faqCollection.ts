/**
 * FAQ Collection — reusable bundle of FAQ Item references (Content Library pack).
 *
 * Page attachment uses the Reusable Module Framework:
 * create / open / replace from Pages; this type stores the pack body.
 * Incoming “Used on” is a native decoration (not a custom input).
 *
 * Existing page `faqs[]` fields remain as legacy fallback until cleanup.
 */
import {defineIncomingReferenceDecoration} from 'sanity/structure'
import {FAQIcon} from './icons'

export default {
  name: 'faqCollection',
  title: 'FAQ Collection',
  type: 'document',
  icon: FAQIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name for editors (e.g. Homepage FAQ, Fertility FAQs).',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional note about when this pack should be used.',
    },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'faq'}],
        },
      ],
      description: 'Ordered FAQ questions. Create new or pick existing FAQ Items.',
      validation: (Rule: any) => Rule.unique(),
    },
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
      description: 'Pages that use this FAQ pack. Prefer editing from Pages day to day.',
      types: [
        {type: 'homepage'},
        {type: 'treatmentCategory'},
        {type: 'treatment'},
        {type: 'specialist'},
        {type: 'clinicPage'},
        {type: 'servicesPage'},
        {type: 'pricingPage'},
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
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      questions: 'questions',
    },
    prepare({
      title,
      questions,
    }: {
      title?: string
      questions?: unknown[]
    }) {
      const count = Array.isArray(questions) ? questions.length : 0
      return {
        title: title || 'FAQ Collection',
        subtitle: `${count} question${count === 1 ? '' : 's'}`,
      }
    },
  },
}
