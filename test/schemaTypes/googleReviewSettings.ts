// Schema: Google Review Settings (singleton)
import { ReviewIcon } from './icons'

export default {
  name: 'googleReviewSettings',
  title: 'Google Review-innstillinger',
  type: 'document',
  icon: ReviewIcon,
  fields: [
    {
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      initialValue: 'Trygghet, omsorg og helsehjelp i livets ulike faser',
    },
    {
      name: 'subheading',
      title: 'Undertekst',
      type: 'string',
      initialValue: 'Våre pasienter forteller',
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
      title: 'CTA tittel',
      type: 'string',
      initialValue: 'Over 150 000 fornøyde pasienter siden 2002',
    },
    {
      name: 'ctaSubtitle',
      title: 'CTA undertekst',
      type: 'string',
      initialValue: 'Bli en del av vår historie',
    },
  ],
  preview: {
    prepare: () => ({ title: 'Google Review-innstillinger' }),
  },
}
