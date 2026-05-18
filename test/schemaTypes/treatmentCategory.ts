// Schema: Treatment Category
// Covers: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader
import { CategoryIcon } from './icons'
import { allowedSectionsForCategory } from './sections'

const pickNo = (v: any) =>
  Array.isArray(v)
    ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
    : (v || '')

export default {
  name: 'treatmentCategory',
  title: 'Behandlingskategori',
  type: 'document',
  icon: CategoryIcon,
  fields: [
    {
      name: 'title',
      title: 'Kategorinavn',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {
        source: (doc: any) => pickNo(doc?.title),
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoryId',
      title: 'Kategori-ID',
      type: 'string',
      description: 'Intern ID: gynekologi, fertilitet, urologi, ortopedi, graviditet, flere-fagomrader',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroVideo',
      title: 'Hero-video (valgfritt)',
      type: 'file',
      options: { accept: 'video/*' },
    },
    {
      name: 'description',
      title: 'Kort beskrivelse',
      type: 'internationalizedArrayText',
    },
    {
      name: 'longDescription',
      title: 'Utvidet beskrivelse',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      description: 'Lucide icon name (f.eks. Heart, Baby, Bone)',
    },
    {
      name: 'color',
      title: 'Farge',
      type: 'string',
      description: 'Accent-farge for kategorien (HSL-verdi)',
    },
    {
      name: 'treatments',
      title: 'Behandlinger',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
        },
      ],
    },
    {
      name: 'stats',
      title: 'Statistikk',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'internationalizedArrayString' },
          ],
        },
      ],
    },
    // ─── Statisk innhold migrert fra src/pages/treatments/categoryPageContent.ts ───
    {
      name: 'subtitle',
      title: 'Undertittel (eyebrow)',
      type: 'string',
      description: 'Kort tagline som "Ingen ventetid • Ingen henvisning"',
    },
    {
      name: 'servicesHeading',
      title: 'Overskrift for tjeneste-seksjon',
      type: 'string',
    },
    {
      name: 'servicesIntro',
      title: 'Introtekst for tjeneste-seksjon',
      type: 'text',
      rows: 3,
    },
    {
      name: 'serviceGroups',
      title: 'Tjeneste-grupper (tematisk gruppering)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Gruppe-etikett', type: 'string' },
            { name: 'caption', title: 'Underlinje (valgfritt)', type: 'string' },
            { name: 'serviceNames', title: 'Tjeneste-navn', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: { select: { title: 'label' } },
        },
      ],
    },
    {
      name: 'journey',
      title: 'Pasient-reise (steg)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Lucide-ikon', type: 'string' },
            { name: 'label', title: 'Steg-etikett (f.eks. "Steg 01")', type: 'string' },
            { name: 'title', title: 'Tittel', type: 'string' },
            { name: 'body', title: 'Beskrivelse', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title', subtitle: 'label' } },
        },
      ],
    },
    {
      name: 'staticFaqs',
      title: 'FAQ (per kategori)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'string' },
            { name: 'answer', title: 'Svar', type: 'text', rows: 4 },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    },
    {
      name: 'closingTitle',
      title: 'Avsluttende CTA – tittel',
      type: 'string',
    },
    {
      name: 'closingBody',
      title: 'Avsluttende CTA – tekst',
      type: 'text',
      rows: 3,
    },
    {
      name: 'closingCta',
      title: 'Avsluttende CTA – knappetekst',
      type: 'string',
    },
    {
      name: 'bookingPath',
      title: 'Booking-lenke',
      type: 'string',
      description: 'F.eks. "/booking?kategori=gynekologi"',
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først. La stå tom for alfabetisk.',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'categoryId', media: 'heroImage' },
    prepare({ title, subtitle, media }: any) {
      return { title: pickNo(title) || 'Kategori', subtitle: subtitle || '', media }
    },
  },
}
