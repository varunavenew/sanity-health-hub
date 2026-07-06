/**
 * Rich treatment sub-page layout (hero, flow, reasons, promises, related).
 * Matches SubTreatmentLayout on the frontend.
 * All fields are optional — only needed for gynekologi/fertilitet sub-page routes.
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

const validateRelativePath = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!value) return true
    if (typeof value !== 'string') return true
    return value.startsWith('/')
      ? true
      : 'Stien må være en relativ lenke som starter med skråstrek (f.eks. /priser)'
  })

export const subTreatmentLayoutType = {
  name: 'subTreatmentLayout',
  title: 'Sidelayout (hero, forløp, symptomer)',
  type: 'object',
  fields: [
    { name: 'homeBreadcrumbLabel', title: 'Brødsmule — hjem', ...i18nString },
    { name: 'srOnlyTitle', title: 'Skjult H1', ...i18nString },
    { name: 'themesAriaLabel', title: 'Temaer — aria-label', ...i18nString },
    { name: 'seePricesLabel', title: 'Se priser — tekst', ...i18nString },
    { name: 'seePricesHref', title: 'Se priser — lenke', type: 'string', validation: validateRelativePath },
    { name: 'callCtaLabel', title: 'Ring oss — tekst', ...i18nString },
    { name: 'expertReadMoreLabel', title: 'Ekspertkort — lenketekst', ...i18nString },
    { name: 'scrollLeftLabel', title: 'Karusell — scroll venstre', ...i18nString },
    { name: 'scrollRightLabel', title: 'Karusell — scroll høyre', ...i18nString },
    { name: 'insuranceEyebrow', title: 'Forsikring — eyebrow', ...i18nString },
    { name: 'insuranceTitle', title: 'Forsikring — tittel', ...i18nString },
    {
      name: 'insurancePartners',
      title: 'Forsikringspartnere',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', title: 'Nøkkel', type: 'string' },
          { name: 'label', title: 'Navn', ...i18nString },
        ],
        preview: {
          select: { title: 'label', subtitle: 'key' },
          prepare({ title, subtitle }: any) {
            return {
              title: pickNo(title) || 'Uten navn',
              subtitle,
            }
          },
        },
      }],
    },
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
    { name: 'heroPrice', title: 'Hero — prislinje', ...i18nString },
    { name: 'hideSeePriser', title: 'Skjul «Se priser»-lenke', type: 'boolean' },
    { name: 'heroAvailability', title: 'Hero — tilgjengelighet', ...i18nString },
    {
      name: 'heroThemes',
      title: 'Hero — tema-chips',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    { name: 'heroImage', title: 'Hero-bilde (høyre kolonne)', type: 'image', options: { hotspot: true } },
    { name: 'heroImageAlt', title: 'Hero-bilde — alt', ...i18nString },
    { name: 'heroVideo', title: 'Hero-video URL', type: 'url' },
    { name: 'primaryCtaLabel', title: 'Primær CTA-tekst', ...i18nString },
    {
      name: 'bookingService',
      title: 'Booking tjeneste-ID',
      type: 'string',
      description: 'Valgfritt — sendes til booking (f.eks. hysterektomi)',
    },
    { name: 'reasonsEyebrow', title: 'Symptomer — eyebrow', ...i18nString },
    { name: 'reasonsTitle', title: 'Symptomer — tittel', ...i18nString },
    { name: 'reasonsLead', title: 'Symptomer — ingress 1', ...i18nText },
    { name: 'reasonsLead2', title: 'Symptomer — ingress 2', ...i18nText },
    {
      name: 'reasonsLayout',
      title: 'Symptomer — layout',
      type: 'string',
      options: {
        list: [
          { title: 'Prosa (standard)', value: 'prose' },
          { title: 'Trekkspill', value: 'accordion' },
          { title: 'Auto', value: 'auto' },
        ],
        layout: 'radio',
      },
      initialValue: 'prose',
    },
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
    { name: 'flowEyebrow', title: 'Forløp — eyebrow', ...i18nString },
    { name: 'flowTitle', title: 'Forløp — tittel', ...i18nString },
    { name: 'flowImage', title: 'Forløp — bilde', type: 'image', options: { hotspot: true } },
    { name: 'flowImageAlt', title: 'Forløp — bilde alt', ...i18nString },
    { name: 'flowLinkLabel', title: 'Forløp — lenketekst', ...i18nString },
    { name: 'flowLinkHref', title: 'Forløp — lenke', type: 'string', validation: validateRelativePath },
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
    {
      name: 'expertAreas',
      title: 'Ekspertområder',
      type: 'object',
      fields: [
        { name: 'title', title: 'Tittel', ...i18nString },
        { name: 'description', title: 'Ingress', ...i18nText },
        {
          name: 'items',
          title: 'Kort',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Tittel', ...i18nString },
                { name: 'desc', title: 'Beskrivelse', ...i18nText },
                { name: 'path', title: 'Lenke', type: 'string', validation: validateRelativePath },
                { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
                { name: 'imageAlt', title: 'Bilde — alt', ...i18nString },
              ],
              preview: titledItemPreview,
            },
          ],
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
            { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Bilde — alt', ...i18nString },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    {
      name: 'textSection',
      title: 'Tekst + bilde-seksjon',
      type: 'object',
      fields: [
        { name: 'title', title: 'Tittel', ...i18nString },
        { name: 'lead', title: 'Ingress', ...i18nText },
        {
          name: 'points',
          title: 'Punkter',
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
        { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
        { name: 'imageAlt', title: 'Bilde alt', ...i18nString },
      ],
    },
    { name: 'relatedEyebrow', title: 'Relatert — eyebrow', ...i18nString },
    { name: 'relatedTitle', title: 'Relatert — tittel', ...i18nString },
    { name: 'relatedLead', title: 'Relatert — ingress', ...i18nText },
    { name: 'relatedAsIntro', title: 'Relatert rett etter hero', type: 'boolean' },
    { name: 'relatedAsServices', title: 'Relatert som tjenestekarusell', type: 'boolean' },
    {
      name: 'relatedSeeAllHref',
      title: 'Relatert — «se alle»-lenke',
      type: 'string',
      description: 'F.eks. /behandlinger/fertilitet',
      validation: validateRelativePath,
    },
    { name: 'relatedSeeAllLabel', title: 'Relatert — «se alle»-tekst', ...i18nString },
    { name: 'ctaTitle', title: 'Avsluttende CTA — tittel [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'ctaDescription', title: 'Avsluttende CTA — tekst [DEPRECATED]', ...i18nText, hidden: true, readOnly: true },
    { name: 'conversationCtaTitle', title: 'Midt-CTA — tittel [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistTitle', title: 'Spesialist-seksjon — tittel [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistDescription', title: 'Spesialist-seksjon — ingress [DEPRECATED]', ...i18nText, hidden: true, readOnly: true },
    { name: 'specialistCtaLabel', title: 'Spesialist-seksjon — CTA-tekst [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistCtaHref', title: 'Spesialist-seksjon — CTA-lenke [DEPRECATED]', type: 'string', hidden: true, readOnly: true },
  ],
}
