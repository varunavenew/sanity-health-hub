// Schema: Clinician Guide Page (Fastlegeveiledning)
// Dedicated document type for professional guides aimed at GPs (fastleger),
// e.g. /fastlegeveiledning-overgangsalder.
// Fully localized (NO/EN) via sanity-plugin-internationalized-array v5.
import { ThemeIcon } from './icons'

const pickNo = (v: any) =>
  Array.isArray(v)
    ? v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || ''
    : v || ''

// ---- Content blocks used inside each guide section ----

const guideSubheading = {
  name: 'guideSubheading',
  title: 'Underoverskrift',
  type: 'object',
  fields: [
    { name: 'text', title: 'Tekst', type: 'internationalizedArrayString' },
    {
      name: 'level',
      title: 'Nivå',
      type: 'string',
      options: {
        list: [
          { title: 'Stor (H3)', value: 'h3' },
          { title: 'Liten (H4)', value: 'h4' },
        ],
        layout: 'radio',
      },
      initialValue: 'h3',
    },
  ],
  preview: {
    select: { text: 'text', level: 'level' },
    prepare({ text, level }: any) {
      return { title: pickNo(text) || 'Underoverskrift', subtitle: (level || 'h3').toUpperCase() }
    },
  },
}

const guideParagraph = {
  name: 'guideParagraph',
  title: 'Avsnitt',
  type: 'object',
  fields: [
    { name: 'text', title: 'Tekst', type: 'internationalizedArrayText' },
    {
      name: 'style',
      title: 'Stil',
      type: 'string',
      options: {
        list: [
          { title: 'Vanlig', value: 'normal' },
          { title: 'Liten merknad', value: 'note' },
          { title: 'Uthevet (fet innledning)', value: 'lead' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
    },
  ],
  preview: {
    select: { text: 'text', style: 'style' },
    prepare({ text, style }: any) {
      return { title: pickNo(text)?.slice(0, 70) || 'Avsnitt', subtitle: style || 'normal' }
    },
  },
}

const guideList = {
  name: 'guideList',
  title: 'Liste',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Listetype',
      type: 'string',
      options: {
        list: [
          { title: 'Punktliste', value: 'bullet' },
          { title: 'Nummerert', value: 'number' },
        ],
        layout: 'radio',
      },
      initialValue: 'bullet',
    },
    {
      name: 'items',
      title: 'Punkter',
      type: 'array',
      of: [{ type: 'internationalizedArrayText' }],
    },
  ],
  preview: {
    select: { items: 'items', style: 'style' },
    prepare({ items = [], style }: any) {
      return {
        title: pickNo(items[0]?.value ?? items[0]) || 'Liste',
        subtitle: `${style === 'number' ? 'Nummerert' : 'Punktliste'} – ${items.length} punkter`,
      }
    },
  },
}

const guideQuote = {
  name: 'guideQuote',
  title: 'Sitat',
  type: 'object',
  fields: [
    { name: 'text', title: 'Sitat', type: 'internationalizedArrayText' },
    { name: 'source', title: 'Kilde', type: 'internationalizedArrayString' },
  ],
  preview: {
    select: { text: 'text', source: 'source' },
    prepare({ text, source }: any) {
      return { title: pickNo(text)?.slice(0, 70) || 'Sitat', subtitle: pickNo(source) }
    },
  },
}

const guideSection = {
  name: 'guideSection',
  title: 'Seksjon',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Overskrift (H2)',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'blocks',
      title: 'Innhold',
      type: 'array',
      of: [
        { type: 'guideSubheading' },
        { type: 'guideParagraph' },
        { type: 'guideList' },
        { type: 'guideQuote' },
      ],
      options: { sortable: true },
    },
  ],
  preview: {
    select: { heading: 'heading', blocks: 'blocks' },
    prepare({ heading, blocks = [] }: any) {
      return { title: pickNo(heading) || 'Seksjon', subtitle: `${blocks.length} innholdsblokker` }
    },
  },
}

const clinicianGuidePage = {
  name: 'clinicianGuidePage',
  title: 'Fastlegeveiledere',
  type: 'document',
  icon: ThemeIcon,
  groups: [
    { name: 'hero', title: 'Topp' },
    { name: 'content', title: 'Innhold', default: true },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      group: 'hero',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      group: 'hero',
      description: 'F.eks. "fastlegeveiledning-overgangsalder" → /fastlegeveiledning-overgangsalder',
      options: {
        source: (doc: any) => pickNo(doc?.title),
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
      group: 'hero',
      description: 'Vises under H1 i den mørke toppen',
    },
    {
      name: 'backLinkLabel',
      title: 'Tilbake-lenke: tekst',
      type: 'internationalizedArrayString',
      group: 'hero',
      description: 'F.eks. "Tilbake til overgangsalder"',
    },
    {
      name: 'backLinkUrl',
      title: 'Tilbake-lenke: URL',
      type: 'string',
      group: 'hero',
      initialValue: '/behandlinger/gynekologi/overgangsalder',
    },
    {
      name: 'introTexts',
      title: 'Introduksjonstekster',
      type: 'array',
      group: 'content',
      of: [{ type: 'internationalizedArrayText' }],
    },
    {
      name: 'disclaimer',
      title: 'Viktig presisering (kursiv, øverst)',
      type: 'internationalizedArrayText',
      group: 'content',
    },
    {
      name: 'sections',
      title: 'Seksjoner',
      type: 'array',
      group: 'content',
      of: [{ type: 'guideSection' }],
      options: { sortable: true },
    },
    {
      name: 'sources',
      title: 'Kilder',
      type: 'array',
      group: 'content',
      of: [{ type: 'internationalizedArrayText' }],
      description: 'Vises som nummerert kildeliste nederst',
    },
    {
      name: 'closingNote',
      title: 'Avsluttende merknad',
      type: 'internationalizedArrayText',
      group: 'content',
    },
    {
      name: 'ctaText',
      title: 'CTA-knappetekst',
      type: 'internationalizedArrayString',
      group: 'cta',
      initialValue: [{ _key: 'no', value: 'Bestill time' }],
    },
    {
      name: 'ctaLink',
      title: 'CTA-lenke',
      type: 'string',
      group: 'cta',
      initialValue: '/booking?kategori=gynekologi',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }: any) {
      return {
        title: pickNo(title) || 'Fastlegeveileder',
        subtitle: slug ? `/${slug}` : 'Mangler slug',
      }
    },
  },
}

export const clinicianGuideObjectTypes = [
  guideSubheading,
  guideParagraph,
  guideList,
  guideQuote,
  guideSection,
]

export default clinicianGuidePage
