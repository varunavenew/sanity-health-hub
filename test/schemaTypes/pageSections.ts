/**
 * Reusable page sections (specialists, articles, booking CTA) for any singleton or document page.
 */
import { defineField } from 'sanity'
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
      name: 'seeAllLabel',
      title: 'Se alle-tekst',
      type: 'internationalizedArrayString',
      description: 'F.eks. «Se alle spesialister – Gynekologi»',
    },
    {
      name: 'seeAllHref',
      title: 'Se alle-lenke',
      type: 'string',
      initialValue: '/spesialister',
    },
    {
      name: 'limit',
      title: 'Maks antall',
      type: 'number',
      initialValue: 8,
      validation: (Rule: any) => Rule.min(1).max(24),
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Horisontal karusell', value: 'carousel' },
          { title: 'Mørkt rutenett', value: 'gridDark' },
          { title: 'Lyst rutenett', value: 'gridLight' },
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
      validation: (Rule: any) => Rule.min(1).max(12),
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

const quickInfoIconOptions = {
  list: [
    { title: 'Klokke', value: 'clock' },
    { title: 'Skjold', value: 'shield' },
  ],
  layout: 'radio' as const,
}

export const pageSectionBookingCta = {
  name: 'pageSectionBookingCta',
  title: 'Bestill time (CTA)',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Overskrift',
      type: 'internationalizedArrayString',
      description: 'F.eks. «Bestill time hos spesialist»',
    },
    {
      name: 'subtitle',
      title: 'Ingress',
      type: 'internationalizedArrayText',
    },
    {
      name: 'image',
      title: 'Bilde (valgfritt)',
      type: 'image',
      options: { hotspot: true },
      description: 'Vises ved siden av teksten når «Med bilde»-variant er valgt',
      fields: [
        {
          name: 'alt',
          title: 'Alt-tekst',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'variant',
      title: 'Utseende',
      type: 'string',
      options: {
        list: [
          { title: 'Mørk (standard)', value: 'dark' },
          { title: 'Varm bakgrunn', value: 'warm' },
          { title: 'Med bilde', value: 'withImage' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    },
    {
      name: 'primaryLabel',
      title: 'Primærknapp',
      type: 'internationalizedArrayString',
      initialValue: [{ _key: 'no', language: 'no', value: 'Bestill time nå' }],
    },
    {
      name: 'primaryPath',
      title: 'Primær lenke',
      type: 'string',
      initialValue: '/booking',
      description: 'Intern sti (f.eks. /booking) eller full URL',
    },
    {
      name: 'bookingCategory',
      title: 'Booking-kategori (valgfritt)',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      description: 'Legger til ?kategori= på booking-lenken når primær lenke er /booking',
    },
    {
      name: 'showSecondaryButton',
      title: 'Vis «Ring oss»-knapp',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'secondaryLabel',
      title: 'Sekundærknapp-tekst',
      type: 'internationalizedArrayString',
      hidden: ({ parent }: { parent?: { showSecondaryButton?: boolean } }) =>
        parent?.showSecondaryButton === false,
    },
    {
      name: 'secondaryPath',
      title: 'Sekundær lenke (valgfritt)',
      type: 'string',
      description:
        'Intern sti (f.eks. /kontakt). Når satt brukes lenkeknapp i stedet for «Ring oss»-velger.',
      hidden: ({ parent }: { parent?: { showSecondaryButton?: boolean } }) =>
        parent?.showSecondaryButton === false,
    },
    {
      name: 'quickInfoItems',
      title: 'Hurtiginfo',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Ikon',
              type: 'string',
              options: quickInfoIconOptions,
              initialValue: 'clock',
            },
            {
              name: 'text',
              title: 'Tekst',
              type: 'internationalizedArrayString',
            },
          ],
          preview: {
            select: { text: 'text', icon: 'icon' },
            prepare({ text, icon }: { text?: unknown; icon?: string }) {
              return {
                title: pickNo(text) || 'Hurtiginfo',
                subtitle: icon === 'shield' ? 'Skjold' : 'Klokke',
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: unknown }) {
      return {
        title: pickNo(title) || 'Bestill time (CTA)',
        subtitle: 'Booking-seksjon',
      }
    },
  },
}

/** Reusable page-builder field — add to any document schema `fields` array. */
export const pageSectionsField = defineField({
  name: 'pageSections',
  title: 'Modulære seksjoner',
  description:
    'Page builder: legg til, fjern og sorter spesialist-, artikkel- og booking-CTA-blokker. Vises etter sidens hovedinnhold.',
  type: 'array',
  of: [
    { type: 'pageSectionSpecialists' },
    { type: 'pageSectionArticles' },
    { type: 'pageSectionBookingCta' },
  ],
  options: {
    insertMenu: {
      filter: true,
      views: [
        { name: 'list' },
      ],
    },
  },
})

/** Same as pageSectionsField with an optional Sanity field group. */
export function pageSectionsFieldForGroup(group?: string) {
  return group ? { ...pageSectionsField, group } : pageSectionsField
}
