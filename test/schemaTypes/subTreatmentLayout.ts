/**
 * Rich treatment sub-page layout (hero, flow, reasons, promises, related).
 * Matches SubTreatmentLayout on the frontend.
 */
import { pickNo } from './i18n'

const i18nString = { type: 'internationalizedArrayString' as const }
const i18nText = { type: 'internationalizedArrayText' as const }

const titledItemPreview = {
  select: { title: 'title' },
  prepare({ title }: { title?: unknown }) {
    return { title: pickNo(title) || 'Element' }
  },
}

export const subTreatmentLayoutType = {
  name: 'subTreatmentLayout',
  title: 'Sidelayout (hero, forløp, symptomer)',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', ...i18nString },
    { name: 'heroTitle', title: 'Hero-tittel', ...i18nString },
    { name: 'heroDescription', title: 'Hero-ingress', ...i18nText },
    {
      name: 'heroPoints',
      title: 'Hero-punkter',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', ...i18nString },
            { name: 'desc', title: 'Beskrivelse', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'rating', title: 'Vurdering / tagline', ...i18nString },
    { name: 'primaryCtaLabel', title: 'Primær CTA-tekst', ...i18nString },
    {
      name: 'bookingService',
      title: 'Booking tjeneste-ID',
      type: 'string',
      description: 'Valgfritt — sendes til booking (f.eks. hysterektomi)',
    },
    { name: 'flowEyebrow', title: 'Forløp — eyebrow', ...i18nString },
    { name: 'flowTitle', title: 'Forløp — tittel', ...i18nString },
    {
      name: 'flow',
      title: 'Forløp — steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Steg-nummer / etikett', ...i18nString },
            { name: 'title', title: 'Tittel', ...i18nString },
            { name: 'desc', title: 'Beskrivelse', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'reasonsEyebrow', title: 'Symptomer — eyebrow', ...i18nString },
    { name: 'reasonsTitle', title: 'Symptomer — tittel', ...i18nString },
    { name: 'reasonsLead', title: 'Symptomer — ingress 1', ...i18nText },
    { name: 'reasonsLead2', title: 'Symptomer — ingress 2', ...i18nText },
    {
      name: 'reasons',
      title: 'Symptomer / indikasjoner',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Nummer', ...i18nString },
            { name: 'title', title: 'Tittel', ...i18nString },
            { name: 'desc', title: 'Beskrivelse', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    {
      name: 'promises',
      title: 'Løfter / fordeler (3 kolonner)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', ...i18nString },
            { name: 'title', title: 'Tittel', ...i18nString },
            { name: 'desc', title: 'Beskrivelse', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'relatedEyebrow', title: 'Relatert — eyebrow', ...i18nString },
    { name: 'relatedTitle', title: 'Relatert — tittel', ...i18nString },
    {
      name: 'related',
      title: 'Relaterte behandlinger',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', ...i18nString },
            { name: 'title', title: 'Tittel', ...i18nString },
            { name: 'desc', title: 'Beskrivelse', ...i18nText },
            {
              name: 'path',
              title: 'URL-sti (NO)',
              type: 'string',
              description: 'F.eks. /behandlinger/gynekologi/endometriose',
            },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'ctaTitle', title: 'Avsluttende CTA — tittel', ...i18nString },
    { name: 'ctaDescription', title: 'Avsluttende CTA — tekst', ...i18nText },
    {
      name: 'specialistCtaLabel',
      title: 'Spesialist-seksjon — CTA-tekst',
      ...i18nString,
    },
    {
      name: 'specialistCtaHref',
      title: 'Spesialist-seksjon — CTA-lenke',
      type: 'string',
      description: 'F.eks. /spesialister?kategori=gynekologi',
    },
  ],
}
