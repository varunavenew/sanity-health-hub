/**
 * Rich category landing page (e.g. /fertilitet) — editable per treatmentCategory.
 */
import { i18nTitleItemPreview } from './i18n'

const i18nStr = { type: 'internationalizedArrayString' as const }
const i18nTxt = { type: 'internationalizedArrayText' as const }

const segmentItem = {
  type: 'object',
  name: 'categoryLandingSegment',
  title: 'Segment',
  fields: [
    { name: 'id', title: 'ID (valgfri)', type: 'string' },
    { name: 'title', title: 'Tittel', ...i18nStr },
    { name: 'description', title: 'Tekst', ...i18nTxt },
    {
      name: 'tags',
      title: 'Stikkord',
      type: 'array',
      of: [i18nStr],
    },
    { name: 'ctaLabel', title: 'Lenketekst', ...i18nStr },
    {
      name: 'href',
      title: 'Lenke (intern sti)',
      type: 'string',
      description: 'F.eks. /booking?kategori=fertilitet&tjeneste=fertilitetssjekk',
    },
  ],
  preview: i18nTitleItemPreview,
}

const stepItem = {
  type: 'object',
  name: 'categoryLandingStep',
  title: 'Steg',
  fields: [
    { name: 'number', title: 'Nummer', type: 'string' },
    { name: 'title', title: 'Tittel', ...i18nStr },
    { name: 'description', title: 'Tekst', ...i18nTxt },
  ],
  preview: i18nTitleItemPreview,
}

const audienceItem = {
  type: 'object',
  name: 'categoryLandingAudience',
  title: 'Målgruppe',
  fields: [
    { name: 'title', title: 'Tittel', ...i18nStr },
    { name: 'description', title: 'Tekst', ...i18nTxt },
    { name: 'href', title: 'Lenke', type: 'string' },
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
    },
  ],
  preview: i18nTitleItemPreview,
}

const symptomItem = {
  type: 'object',
  name: 'categoryLandingSymptom',
  title: 'Symptom → tjeneste',
  fields: [
    { name: 'symptom', title: 'Symptom', ...i18nStr },
    { name: 'service', title: 'Tjeneste', ...i18nStr },
    { name: 'href', title: 'Lenke', type: 'string' },
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
    { name: 'text', title: 'Sitat', ...i18nTxt },
    { name: 'author', title: 'Navn', type: 'string' },
    { name: 'date', title: 'Dato / kontekst', ...i18nStr },
  ],
  preview: i18nTitleItemPreview,
}

export const categoryLandingPageField = {
  name: 'landingPage',
  title: 'Landingsside (kategori)',
  description:
    'Innhold for markedsføringslandingssiden (f.eks. /fertilitet). Tom = app viser standardtekst.',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'heading', title: 'Overskrift', ...i18nStr },
        { name: 'headingEmphasis', title: 'Overskrift (kursiv del)', ...i18nStr },
        { name: 'body', title: 'Ingress', ...i18nTxt },
        {
          name: 'bullets',
          title: 'Hurtigpunkter',
          type: 'array',
          of: [i18nStr],
        },
        { name: 'primaryCtaLabel', title: 'Primærknapp', ...i18nStr },
        { name: 'secondaryCtaLabel', title: 'Sekundærknapp (ring)', ...i18nStr },
        { name: 'heroImageAlt', title: 'Hero-bilde alt-tekst', ...i18nStr },
        { name: 'secondaryImageAlt', title: 'Sekundærbilde alt-tekst', ...i18nStr },
      ],
    },
    {
      name: 'segmentsSection',
      title: 'Segmenter',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'titleLine2', title: 'Overskrift linje 2', ...i18nStr },
        { name: 'segments', title: 'Kort', type: 'array', of: [segmentItem] },
      ],
    },
    {
      name: 'whySection',
      title: 'Hvorfor oss',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'steps', title: 'Steg', type: 'array', of: [stepItem] },
      ],
    },
    {
      name: 'audiencesSection',
      title: 'Målgrupper',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'titleAccent', title: 'Overskrift (accent)', ...i18nStr },
        { name: 'audiences', title: 'Kort', type: 'array', of: [audienceItem] },
        { name: 'readMoreLabel', title: 'Les mer-tekst', ...i18nStr },
      ],
    },
    {
      name: 'symptomsSection',
      title: 'Symptomsjekk',
      type: 'object',
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'items', title: 'Rader', type: 'array', of: [symptomItem] },
      ],
    },
    {
      name: 'servicesSection',
      title: 'Tjenester',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
      ],
    },
    {
      name: 'resultsSection',
      title: 'Resultater',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'description', title: 'Ingress', ...i18nTxt },
        { name: 'categoryLabel', title: 'Kategori-etikett', ...i18nStr },
        { name: 'footnote', title: 'Fotnote', ...i18nStr },
      ],
    },
    {
      name: 'reviewsSection',
      title: 'Anmeldelser',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', ...i18nStr },
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'reviews', title: 'Sitater', type: 'array', of: [reviewItem] },
      ],
    },
    {
      name: 'specialistsSection',
      title: 'Spesialister',
      type: 'object',
      fields: [
        { name: 'title', title: 'Overskrift', ...i18nStr },
        { name: 'seeAllLabel', title: 'Se alle-tekst', ...i18nStr },
        { name: 'seeAllHref', title: 'Se alle-lenke', type: 'string' },
      ],
    },
    {
      name: 'documentTitle',
      title: 'Nettleser-tittel',
      type: 'internationalizedArrayString',
    },
    {
      name: 'srOnlyTitle',
      title: 'Skjult H1 (SEO)',
      type: 'internationalizedArrayString',
    },
  ],
}
