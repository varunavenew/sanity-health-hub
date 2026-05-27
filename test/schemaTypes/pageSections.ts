/**
 * Reusable page sections (specialists, articles) for any singleton or document page.
 */
import { pickNo } from './i18n'

const displayModeSpecialists = {
  name: 'displayMode',
  type: 'string',
  title: 'Visning',
  options: {
    list: [
      { title: 'Alle spesialister', value: 'all' },
      { title: 'Velg manuelt', value: 'manual' },
      { title: 'Filtrer på kategori', value: 'category' },
    ],
    layout: 'radio',
  },
  initialValue: 'all',
}

const displayModeArticles = {
  name: 'displayMode',
  type: 'string',
  title: 'Visning',
  options: {
    list: [
      { title: 'Nyeste artikler', value: 'latest' },
      { title: 'Velg manuelt', value: 'manual' },
      { title: 'Filtrer på kategori', value: 'category' },
    ],
    layout: 'radio',
  },
  initialValue: 'latest',
}

export const pageSectionSpecialists = {
  name: 'pageSectionSpecialists',
  title: 'Spesialister',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow / etikett',
      type: 'internationalizedArrayString',
      description: 'Valgfri liten tekst over overskriften',
    },
    {
      name: 'title',
      title: 'Overskrift',
      type: 'internationalizedArrayString',
    },
    {
      name: 'description',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    displayModeSpecialists,
    {
      name: 'specialists',
      title: 'Spesialister (manuelt valg)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'treatmentCategory',
      title: 'Behandlingskategori',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'categorySlug',
      title: 'Kategori-slug (alternativ)',
      type: 'string',
      description:
        'F.eks. gynekologi, fertilitet — brukes hvis kategori-referanse ikke er satt',
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'limit',
      title: 'Maks antall',
      type: 'number',
      initialValue: 8,
      validation: (Rule: { min: (n: number) => unknown; max: (n: number) => unknown }) =>
        Rule.min(1).max(24),
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Horisontal karusell (forside)', value: 'carousel' },
          { title: 'Mørkt rutenett (Om oss)', value: 'gridDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'carousel',
    },
  ],
  preview: {
    select: { title: 'title', variant: 'variant', displayMode: 'displayMode' },
    prepare({
      title,
      variant,
      displayMode,
    }: {
      title?: unknown
      variant?: string
      displayMode?: string
    }) {
      return {
        title: pickNo(title) || 'Spesialister',
        subtitle: `${displayMode || 'all'} · ${variant || 'carousel'}`,
      }
    },
  },
}

export const pageSectionArticles = {
  name: 'pageSectionArticles',
  title: 'Artikler',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow / etikett',
      type: 'internationalizedArrayString',
    },
    {
      name: 'title',
      title: 'Overskrift',
      type: 'internationalizedArrayString',
    },
    {
      name: 'description',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    displayModeArticles,
    {
      name: 'articles',
      title: 'Artikler (manuelt valg)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'manual',
    },
    {
      name: 'articleCategory',
      title: 'Artikkelkategori',
      type: 'string',
      options: {
        list: [
          { title: 'Fagartikkel', value: 'fagartikkel' },
          { title: 'Nytt fra oss', value: 'nyheter' },
          { title: 'Prisliste', value: 'prisliste' },
          { title: 'Stillingsutlysning', value: 'stillingsutlysning' },
        ],
      },
      hidden: ({ parent }: { parent?: { displayMode?: string } }) =>
        parent?.displayMode !== 'category',
    },
    {
      name: 'limit',
      title: 'Maks antall',
      type: 'number',
      initialValue: 6,
      validation: (Rule: { min: (n: number) => unknown; max: (n: number) => unknown }) =>
        Rule.min(1).max(12),
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Rutenett', value: 'grid' },
          { title: 'Fremhevet + rutenett', value: 'featured' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    },
    {
      name: 'ctaLabel',
      title: 'Lenketekst til Aktuelt',
      type: 'internationalizedArrayString',
    },
    {
      name: 'ctaPath',
      title: 'Lenke til Aktuelt',
      type: 'string',
      initialValue: '/aktuelt',
    },
  ],
  preview: {
    select: { title: 'title', displayMode: 'displayMode' },
    prepare({ title, displayMode }: { title?: unknown; displayMode?: string }) {
      return {
        title: pickNo(title) || 'Artikler',
        subtitle: displayMode || 'latest',
      }
    },
  },
}

/** Add to any page schema `fields` array */
export const pageSectionsField = {
  name: 'pageSections',
  title: 'Modulære seksjoner',
  description:
    'Legg til spesialist- og/eller artikkel-seksjoner. Vises etter sidens hovedinnhold, i rekkefølgen du setter her.',
  type: 'array',
  of: [{ type: 'pageSectionSpecialists' }, { type: 'pageSectionArticles' }],
}
