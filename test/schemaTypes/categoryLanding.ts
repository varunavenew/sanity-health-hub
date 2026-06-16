/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 */
import { i18nTitleItemPreview, requiredNoEnI18n } from './i18n'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

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
      title: 'Stikkord',
      type: 'array',
      of: [i18nStr],
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
        ],
      },
      validation: reqStr('Ikon'),
    },
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
  options: { collapsible: true, collapsed: false },
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
        { name: 'secondaryImageAlt', title: 'Sekundærbilde alt-tekst', ...i18nStr },
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
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Målgrupper',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Målgrupper-seksjonen er påkrevd'),
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
      name: 'symptomsSection',
      title: 'Symptomsjekk',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Symptomsjekk-seksjonen er påkrevd'),
      fields: [
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
      name: 'servicesSection',
      title: 'Tjenester',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Tjenester-seksjonen er påkrevd'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Resultater',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Resultater-seksjonen er påkrevd'),
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'description', title: 'Ingress', ...i18nTxt, validation: reqI18n('Ingress') },
        { name: 'categoryLabel', title: 'Kategori-etikett', ...i18nStr, validation: reqI18n('Kategori-etikett') },
        { name: 'footnote', title: 'Fotnote', ...i18nStr },
      ],
    },
    {
      name: 'reviewsSection',
      title: 'Anmeldelser',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Anmeldelser-seksjonen er påkrevd'),
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
      name: 'specialistsSection',
      title: 'Spesialister',
      type: 'object',
      validation: (Rule: any) => Rule.required().error('Spesialister-seksjonen er påkrevd'),
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr, validation: reqI18n('Overskrift') },
        { name: 'seeAllLabel', title: 'Se alle-tekst', ...i18nStr, validation: reqI18n('Se alle-tekst') },
        { name: 'seeAllHref', title: 'Se alle-lenke', type: 'string', validation: reqStr('Se alle-lenke') },
      ],
    },
    {
      name: 'documentTitle',
      title: 'Nettleser-tittel',
      type: 'internationalizedArrayString',
      validation: reqI18n('Nettleser-tittel'),
    },
    {
      name: 'srOnlyTitle',
      title: 'Skjult H1 (SEO)',
      type: 'internationalizedArrayString',
      validation: reqI18n('Skjult H1 (SEO)'),
    },
  ],
}
