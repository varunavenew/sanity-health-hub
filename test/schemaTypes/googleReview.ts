// Schema: Google Review
import { ReviewIcon } from './icons'
import { pickStudioEn } from './studioPreview'
import {
  mediaDescription,
  mediaImageOptions,
  softImageRules,
} from './mediaGuidelines'

export default {
  name: 'googleReview',
  title: 'Google Review',
  type: 'document',
  icon: ReviewIcon,
  fields: [
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Review text',
      type: 'internationalizedArrayText',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
    },
    {
      name: 'source',
      title: 'Review source',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Legelisten', value: 'legelisten' },
        ],
        layout: 'radio',
      },
      initialValue: 'google',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'avatar',
      title: 'Profile image',
      type: 'image',
      options: mediaImageOptions('avatar'),
      description: mediaDescription('avatar'),
      validation: softImageRules('avatar'),
    },
  ],
  preview: {
    select: {title: 'author', subtitle: 'text', source: 'source', rating: 'rating'},
    prepare({
      title,
      subtitle,
      source,
      rating,
    }: {
      title?: string
      subtitle?: unknown
      source?: string
      rating?: number
    }) {
      const excerpt = pickStudioEn(subtitle)
      const platform = source === 'legelisten' ? 'Legelisten' : 'Google'
      const stars =
        typeof rating === 'number'
          ? `${'★'.repeat(Math.max(0, Math.min(5, rating)))}${'☆'.repeat(Math.max(0, 5 - rating))}`
          : ''
      const quote = excerpt ? `${excerpt.slice(0, 56)}${excerpt.length > 56 ? '…' : ''}` : ''
      return {
        title: title || 'Review',
        subtitle: [platform, stars, quote].filter(Boolean).join(' · '),
      }
    },
  },
}
