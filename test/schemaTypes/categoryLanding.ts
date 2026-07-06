/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 */
import { i18nTitleItemPreview, requiredNoEnI18n } from './i18n'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

const segmentTagLinkItem = {
  type: 'object',
  name: 'categoryLandingSegmentTagLink',
  title: 'Stikkord-lenke',
  fields: [
    { name: 'label', title: 'Tekst', ...i18nStr, validation: reqI18n('Tekst') },
    {
      name: 'href',
      title: 'Lenke (intern sti)',
      type: 'string',
      validation: reqStr('Lenke'),
    },
  ],
  preview: i18nTitleItemPreview,
}

const segmentItem = {
  type: 'object',
  name: 'categoryLandingSegment',
  title: 'Segment',
  fields: [
    { name: 'id', title: 'ID (valgfri)', type: 'string' },
    { name: 'title', title: 'Tittel', ...i18nStr, validation: reqI18n('Tittel') },
    { name: 'description', title: 'Tekst', ...i18nTxt, validation: reqI18n('Tekst') },
    {
      name: 'tags',
      title: 'Stikkord (kun tekst)',
      type: 'array',
      of: [i18nStr],
      description: 'Brukes hvis tagLinks ikke er fylt ut.',
    },
    {
      name: 'tagLinks',
      title: 'Stikkord med lenker',
      type: 'array',
      of: [segmentTagLinkItem],
      description: 'Vises som klikkbare lenker i accordion-visning.',
    },
    { name: 'ctaLabel', title: 'Lenketekst', ...i18nStr, validation: reqI18n('Lenketekst') },
    {
      name: 'href',
      title: 'Lenke (intern sti)',
      type: 'string',
      description: 'F.eks. /booking?kategori=fertilitet&tjeneste=fertilitetssjekk',
      validation: reqStr('Lenke'),
    },
  ],
  preview: i18nTitleItemPreview,
}

const stepItem = {
  type: 'object',
  name: 'categoryLandingStep',
  title: 'Steg',
  fields: [
    { name: 'number', title: 'Nummer', type: 'string', validation: reqStr('Nummer') },
    { name: 'title', title: 'Tittel', ...i18nStr, validation: reqI18n('Tittel') },
    { name: 'description', title: 'Tekst', ...i18nTxt, validation: reqI18n('Tekst') },
  ],
  preview: i18nTitleItemPreview,
}

const audienceItem = {
  type: 'object',
  name: 'categoryLandingAudience',
  title: 'Målgruppe',
  fields: [
    { name: 'title', title: 'Tittel', ...i18nStr, validation: reqI18n('Tittel') },
    { name: 'description', title: 'Tekst', ...i18nTxt, validation: reqI18n('Tekst') },
    { name: 'href', title: 'Lenke', type: 'string', validation: reqStr('Lenke') },
    {
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      options: {
        list: [
          { title: 'Par', value: 'couple' },
          { title: 'Horisont', value: 'horizon' },
          { title: 'Bue', value: 'arch' },
          { title: 'Person', value: 'user' },
          { title: 'Personer', value: 'users' },
          { title: 'Klokke', value: 'clock' },
        ],
      },
      validation: reqStr('Ikon'),
    },
  ],
  preview: i18nTitleItemPreview,
}

const expertAreaCard = {
  type: 'object',
  name: 'categoryLandingExpertArea',
  title: 'Kort',
  fields: [
    { name: 'title', title: 'Tittel', ...i18nStr, validation: reqI18n('Tittel') },
    { name: 'description', title: 'Tekst', ...i18nTxt, validation: reqI18n('Tekst') },
    { name: 'href', title: 'Lenke', type: 'string', validation: reqStr('Lenke') },
    {
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true },
    },
    { name: 'imageAlt', title: 'Bilde alt-tekst', ...i18nStr, validation: reqI18n('Bilde alt-tekst') },
  ],
  preview: i18nTitleItemPreview,
}

const symptomItem = {
  type: 'object',
  name: 'categoryLandingSymptom',
  title: 'Symptom → tjeneste',
  fields: [
    { name: 'symptom', title: 'Symptom', ...i18nStr, validation: reqI18n('Symptom') },
    { name: 'service', title: 'Tjeneste', ...i18nStr, validation: reqI18n('Tjeneste') },
    { name: 'href', title: 'Lenke', type: 'string', validation: reqStr('Lenke') },
    {
      name: 'image',
      title: 'Bilde (valgfritt)',
      type: 'image',
      options: { hotspot: true },
    },
    { name: 'imageAlt', title: 'Bilde alt-tekst', ...i18nStr, validation: reqI18n('Bilde alt-tekst') },
  ],
  preview: {
    select: { title: 'symptom', subtitle: 'service' },
    prepare: i18nTitleItemPreview.prepare,
  },
}

const reviewItem = {
  type: 'object',
  name: 'categoryLandingReview',
  title: 'Anmeldelse',
  fields: [
    { name: 'text', title: 'Sitat', ...i18nTxt, validation: reqI18n('Sitat') },
    { name: 'author', title: 'Navn', type: 'string', validation: reqStr('Navn') },
    { name: 'date', title: 'Dato / kontekst', ...i18nStr, validation: reqI18n('Dato / kontekst') },
  ],
  preview: i18nTitleItemPreview,
}

export const categoryLandingPageField = {
  name: 'landingPage',
  title: 'Landingsside (kategori)',
  description: 'Innhold for markedsføringslandingssiden (f.eks. /fertilitet). Alle felt er påkrevd (norsk + engelsk).',
  type: 'object',
  validation: (Rule: any) => Rule.required().error('Landingsside-innhold er påkrevd'),
  fields: [
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Hero-seksjonen er påkrevd'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'heading', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'headingEmphasis', title: 'Overskrift (kursiv del)', ...i18nStr },
        { name: 'body', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'bullets',
          title: 'Hurtigpunkter',
          type: 'array',
          of: [i18nStr],
        },
        { name: 'primaryCtaLabel', title: 'Primærknapp', ...i18nStr, validation: reqI18n('Primærknapp') },
        { name: 'secondaryCtaLabel', title: 'Sekundærknapp (ring)', ...i18nStr, validation: reqI18n('Sekundærknapp') },
        { name: 'heroImageAlt', title: 'Hero-bilde alt-tekst', ...i18nStr, validation: reqI18n('Hero-bilde alt-tekst') },
        {
          name: 'primaryBookingService',
          title: 'Booking-tjeneste (slug)',
          type: 'string',
          description: 'Valgfri tjeneste-slug for primærknapp, f.eks. generell-undersokelse',
        },
        { name: 'entryPriceLabel', title: 'Pris — etikett', ...i18nStr },
        { name: 'entryPriceValue', title: 'Pris — verdi', ...i18nStr },
      ],
    },
    {
      name: 'segmentsSection',
      title: 'Segmenter',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Segmenter-seksjonen er påkrevd'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'titleLine2', title: 'Overskrift linje 2', ...i18nStr },
        {
          name: 'layout',
          title: 'Visning',
          type: 'string',
          options: {
            list: [
              { title: 'Accordion', value: 'accordion' },
              { title: 'Kort-rutenett', value: 'grid' },
            ],
            layout: 'radio',
          },
          initialValue: 'accordion',
        },
        {
          name: 'segments',
          title: 'Kort',
          type: 'array',
          of: [segmentItem],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst ett segment'),
        },
      ],
    },
    {
      name: 'whySection',
      title: 'Hvorfor oss',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Hvorfor oss-seksjonen er påkrevd'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'steps',
          title: 'Steg',
          type: 'array',
          of: [stepItem],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst ett steg'),
        },
        {
          name: 'image',
          title: 'Sidebilde',
          type: 'image',
          options: { hotspot: true },
          description: 'Vises til høyre for steg-listen i «Hvorfor oss»-seksjonen.',
          validation: (Rule: any) => Rule.required().error('Sidebilde er påkrevd'),
        },
        {
          name: 'imageAlt',
          title: 'Sidebilde alt-tekst',
          ...i18nStr,
          validation: reqI18n('Sidebilde alt-tekst'),
        },
        { name: 'footerLinkLabel', title: 'Footer-lenke tekst', ...i18nStr, validation: reqI18n('Footer-lenke tekst') },
        { name: 'footerLinkHref', title: 'Footer-lenke URL', type: 'string', validation: reqStr('Footer-lenke URL') },
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Målgrupper',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'titleAccent', title: 'Overskrift (accent)', ...i18nStr },
        {
          name: 'audiences',
          title: 'Kort',
          type: 'array',
          of: [audienceItem],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én målgruppe'),
        },
        { name: 'readMoreLabel', title: 'Les mer-tekst', ...i18nStr, validation: reqI18n('Les mer-tekst') },
      ],
    },
    {
      name: 'expertAreasSection',
      title: 'Ekspertområder',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'readMoreLabel', title: 'Les mer-tekst', ...i18nStr, validation: reqI18n('Les mer-tekst') },
        {
          name: 'layout',
          title: 'Visning',
          type: 'string',
          options: {
            list: [
              { title: 'Rutenett', value: 'grid' },
              { title: 'Horisontal karusell (mobil)', value: 'carousel' },
            ],
            layout: 'radio',
          },
          initialValue: 'carousel',
        },
        {
          name: 'areas',
          title: 'Kort',
          type: 'array',
          of: [expertAreaCard],
        },
      ],
    },
    {
      name: 'symptomsSection',
      title: 'Symptomsjekk',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr, validation: reqI18n('Eyebrow') },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'items',
          title: 'Rader',
          type: 'array',
          of: [symptomItem],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én symptom-rad'),
        },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Resultater',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        { name: 'categoryLabel', title: 'Kategori-etikett', ...i18nStr, validation: reqI18n('Kategori-etikett') },
        { name: 'footnote', title: 'Fotnote', ...i18nStr },
      ],
    },
    {
      name: 'servicesSection',
      title: 'Tjenester',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        {
          name: 'groups',
          title: 'Grupper',
          description: 'Gruppert tjenesteliste i ønsket visningsrekkefølge.',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'categoryLandingServiceGroup',
              title: 'Tjenestegruppe',
              fields: [
                { name: 'label', title: 'Gruppetittel', ...i18nStr, validation: reqI18n('Gruppetittel') },
                {
                  name: 'items',
                  title: 'Tjenester',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      name: 'categoryLandingServiceItem',
                      title: 'Tjeneste',
                      fields: [
                        { name: 'title', title: 'Tittel', ...i18nStr, validation: reqI18n('Tittel') },
                        { name: 'description', title: 'Beskrivelse', ...i18nStr },
                        { name: 'href', title: 'Lenke', type: 'string', validation: reqStr('Lenke') },
                      ],
                      preview: i18nTitleItemPreview,
                    },
                  ],
                },
              ],
              preview: i18nTitleItemPreview,
            },
          ],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én tjenestegruppe'),
        },
      ],
    },
    {
      name: 'supportSection',
      title: 'Støtte / tilleggstjenester',
      type: 'object',
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'readMoreLabel', title: 'Les mer-tekst', ...i18nStr, validation: reqI18n('Les mer-tekst') },
        {
          name: 'areas',
          title: 'Kort',
          type: 'array',
          of: [expertAreaCard],
        },
      ],
    },
    {
      name: 'reviewsSection',
      title: 'Anmeldelser',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        {
          name: 'reviews',
          title: 'Sitater',
          type: 'array',
          of: [reviewItem],
          validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én anmeldelse'),
        },
      ],
    },
    {
      name: 'spotlightSection',
      title: 'Spotlight (CTA-blokk)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'titleEmphasis', title: 'Overskrift (kursiv del)', ...i18nStr },
        { name: 'text', title: 'Tekst', ...i18nTxt },
        { name: 'ctaLabel', title: 'Knappetekst', ...i18nStr, validation: reqI18n('Knappetekst') },
        { name: 'ctaHref', title: 'Knappelenke', type: 'string', validation: reqStr('Knappelenke') },
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: { hotspot: true },
        },
        { name: 'imageAlt', title: 'Bilde alt-tekst', ...i18nStr, validation: reqI18n('Bilde alt-tekst') },
      ],
    },
    {
      name: 'journeySection',
      title: 'Pasientreisen (valgfritt, etter anmeldelser)',
      type: 'object',
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        {
          name: 'steps',
          title: 'Steg',
          type: 'array',
          of: [stepItem],
        },
        { name: 'ctaLabel', title: 'Knappetekst', ...i18nStr, validation: reqI18n('Knappetekst') },
        { name: 'ctaHref', title: 'Knappelenke', type: 'string' },
      ],
    },
    {
      name: 'breadcrumbHomeLabel',
      title: 'Brødsmule — hjem',
      type: 'internationalizedArrayString',
      validation: reqI18n('Brødsmule — hjem'),
    },
    {
      name: 'srOnlyTitle',
      title: 'Skjult H1 (SEO)',
      type: 'internationalizedArrayString',
      validation: reqI18n('Skjult H1 (SEO)'),
    },
  ],
}
