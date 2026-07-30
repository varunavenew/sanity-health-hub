// Schema: Testimonial — patient quotes for Pricing page (not Google Reviews)
import {ReviewIcon} from './icons'
import {requiredNoI18n} from './i18n'
import {pickStudioEn} from './studioPreview'

export default {
  name: 'testimonial',
  title: 'Patient quote (Pricing)',
  type: 'document',
  icon: ReviewIcon,
  description:
    'Curated patient quotes shown on the Pricing page only. For Google Reviews, use Content Library → Google Reviews.',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'age',
      title: 'Age',
      type: 'number',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayText',
      validation: requiredNoI18n('Quote text'),
    },
    {
      name: 'location',
      title: 'City',
      type: 'internationalizedArrayString',
    },
    {
      name: 'treatment',
      title: 'Treatment',
      type: 'internationalizedArrayString',
      description: 'e.g. Gynekologi / Gynecology, Urologi / Urology, Fertilitet / Fertility',
    },
    {
      name: 'sortOrder',
      title: 'Sorting order',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'Published order (manual → A–Z)',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Rating (highest first)',
      name: 'ratingDesc',
      by: [{field: 'rating', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'text', rating: 'rating', treatment: 'treatment'},
    prepare({
      title,
      subtitle,
      rating,
      treatment,
    }: {
      title?: string
      subtitle?: unknown
      rating?: number
      treatment?: unknown
    }) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(Math.max(0, 5 - (rating || 0)))
      const quote = pickStudioEn(subtitle)?.trim()
      const treatmentLabel = pickStudioEn(treatment)?.trim()
      const excerpt = quote
        ? `${quote.slice(0, 72)}${quote.length > 72 ? '…' : ''}`
        : ''
      const line = [stars, excerpt].filter(Boolean).join('  ')
      return {
        title: title || 'Patient quote',
        subtitle: treatmentLabel ? `${line} · ${treatmentLabel}` : line || undefined,
      }
    },
  },
}
