// Schema: Google Review Settings (singleton)
import { ReviewIcon } from './icons'
import { pickNo } from './i18n'

export default {
  name: 'googleReviewSettings',
  title: 'Google Review-innstillinger',
  type: 'document',
  icon: ReviewIcon,
  description:
    'Average reviews for treatment categories. The homepage review section is edited under Homepage → Patient Reviews.',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'internationalizedArrayString',
    },
    {
      name: 'googleAverageRating',
      title: 'Google gjennomsnittsvurdering',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.6,
    },
    {
      name: 'legelistenAverageRating',
      title: 'Legelisten gjennomsnittsvurdering',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5).precision(1),
      initialValue: 4.8,
    },
    {
      name: 'ctaTitle',
      title: 'CTA title',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaSubtitle',
      title: 'CTA subtitle',
      type: 'internationalizedArrayString',
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }: { title?: unknown }) {
      return { title: pickNo(title) || 'Google Review-innstillinger' }
    },
  },
}
