// Schema: Contact Page (Kontakt)
// Aligned with migration data: title, introText, phone, email, address, openingHours, seo
import { ContactIcon } from './icons'
import { pageSectionsField } from './pageSections'

export default {
  name: 'contactPage',
  title: 'Kontakt',
  type: 'document',
  icon: ContactIcon,
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        { name: 'street', title: 'Gateadresse', type: 'string' },
        { name: 'city', title: 'By', type: 'string' },
        { name: 'zip', title: 'Postnummer', type: 'string' },
      ],
    },
    {
      name: 'openingHours',
      title: 'Åpningstider',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', title: 'Dager', type: 'internationalizedArrayString' },
            { name: 'hours', title: 'Timer', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'ctaCards',
      title: 'Hjelpekort (CTA-seksjon)',
      type: 'array',
      description: 'De tre kortene som vises under klinikkoversikten',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Ikon',
              type: 'string',
              description: 'Lucide ikon-navn (Calendar, Shield, Phone, Mail, MessageCircle)',
            },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'Knappetekst', type: 'internationalizedArrayString' },
            {
              name: 'ctaAction',
              title: 'Handling',
              type: 'string',
              options: {
                list: [
                  { title: 'Åpne kontakt-modal', value: 'openContactDialog' },
                  { title: 'Naviger til lenke', value: 'navigate' },
                ],
                layout: 'radio',
              },
              initialValue: 'navigate',
            },
            { name: 'ctaLink', title: 'CTA-lenke (hvis naviger)', type: 'string' },
            {
              name: 'variant',
              title: 'Knappevariant',
              type: 'string',
              options: {
                list: [
                  { title: 'Solid (hvit fyll)', value: 'solid' },
                  { title: 'Outline (kun kant)', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'solid',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'ctaText' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: pick(subtitle) }
            },
          },
        },
      ],
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Kontakt')
        : (title || 'Kontakt')
      return { title: titleStr }
    },
  },
}
