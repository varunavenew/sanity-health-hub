// Schema: About Page (Om oss)
// Aligned with migration data: title, subtitle, body (blockContent), seo
import { GenericIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

export default {
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  icon: GenericIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroImageAlt',
      title: 'Hero-bilde – alternativ tekst',
      type: 'internationalizedArrayString',
    },
    {
      name: 'body',
      title: 'Innhold',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'values',
      title: 'Våre verdier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Ikon', type: 'string' },
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'clinicsSection',
      title: 'Seksjon — klinikker',
      description:
        'Vises på Om oss (og Kontakt). Tom klinikkliste = alle publiserte klinikker.',
      type: 'object',
      fields: [
        {
          name: 'showSection',
          title: 'Vis seksjonen',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Overskrift',
          type: 'internationalizedArrayString',
          description: 'F.eks. «Våre klinikker»',
        },
        {
          name: 'clinics',
          title: 'Klinikker (valgfritt)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
          description:
            'Velg rekkefølge. La stå tom for å liste alle publiserte klinikker automatisk.',
        },
      ],
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    geoSummaryField,
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
    prepare({ title, media }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Om oss')
        : (title || 'Om oss')
      return { title: titleStr, media }
    },
  },
}
