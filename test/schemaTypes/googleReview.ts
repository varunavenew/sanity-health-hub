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
      name: 'avatar',
      title: 'Profile image',
      type: 'image',
      options: mediaImageOptions('avatar'),
      description: mediaDescription('avatar'),
      validation: softImageRules('avatar'),
    },
  ],
  preview: {
    select: { title: 'author', subtitle: 'text' },
    prepare({ title, subtitle }: { title?: string; subtitle?: unknown }) {
      const excerpt = pickStudioEn(subtitle)
      return {
        title: title || 'Review',
        subtitle: excerpt ? `${excerpt.slice(0, 60)}…` : '',
      }
    },
  },
}
