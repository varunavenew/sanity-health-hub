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
      : 'The path must be a relative link starting with a slash (e.g. /prices)'
  })

export const subTreatmentLayoutType = {
  name: 'subTreatmentLayout',
  title: 'Page layout (hero, process, symptoms)',
  type: 'object',
  fields: [
    { name: 'homeBreadcrumbLabel', title: 'Breadcrumb — home', ...i18nString },
    { name: 'srOnlyTitle', title: 'Hidden H1', ...i18nString },
    { name: 'themesAriaLabel', title: 'Temaer — aria-label', ...i18nString },
    { name: 'seePricesLabel', title: 'See prices — text', ...i18nString },
    { name: 'seePricesHref', title: 'See prices — link', type: 'string', validation: validateRelativePath },
    { name: 'callCtaLabel', title: 'Call us — text', ...i18nString },
    { name: 'expertReadMoreLabel', title: 'Ekspertkort — lenketekst', ...i18nString },
    { name: 'scrollLeftLabel', title: 'Karusell — scroll venstre', ...i18nString },
    { name: 'scrollRightLabel', title: 'Carousel — scroll right', ...i18nString },
    { name: 'insuranceEyebrow', title: 'Insurance — eyebrow', ...i18nString },
    { name: 'insuranceTitle', title: 'Insurance — title', ...i18nString },
    {
      name: 'insurancePartners',
      title: 'Insurance partners',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', title: 'Key', type: 'string' },
          { name: 'label', title: 'Name', ...i18nString },
        ],
        preview: {
          select: { title: 'label', subtitle: 'key' },
          prepare({ title, subtitle }: any) {
            return {
              title: pickNo(title) || 'Unnamed',
              subtitle,
            }
          },
        },
      }],
    },
    { name: 'eyebrow', title: 'Eyebrow', ...i18nString },
    { name: 'heroTitle', title: 'Hero Title', ...i18nString },
    { name: 'heroDescription', title: 'Hero-ingress', ...i18nText },
    {
      name: 'heroPoints',
      title: 'Hero-punkter',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', ...i18nString },
            { name: 'desc', title: 'Description', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'rating', title: 'Rating / tagline', ...i18nString },
    { name: 'heroPrice', title: 'Hero — prislinje', ...i18nString },
    { name: 'hideSeePriser', title: 'Hide \'See prices\' link', type: 'boolean' },
    { name: 'heroAvailability', title: 'Hero — tilgjengelighet', ...i18nString },
    {
      name: 'heroThemes',
      title: 'Hero — tema-chips',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    { name: 'heroImage', title: 'Hero image (right column)', type: 'image', options: { hotspot: true } },
    { name: 'heroImageAlt', title: 'Hero image — alt', ...i18nString },
    { name: 'heroVideo', title: 'Hero-video URL', type: 'url' },
    { name: 'primaryCtaLabel', title: 'Primary CTA text', ...i18nString },
    {
      name: 'bookingService',
      title: 'Booking service ID',
      type: 'string',
      description: 'Optional — sent to booking (e.g. hysterectomy)',
    },
    { name: 'reasonsEyebrow', title: 'Symptoms — eyebrow', ...i18nString },
    { name: 'reasonsTitle', title: 'Symptoms — title', ...i18nString },
    { name: 'reasonsLead', title: 'Symptoms — introduction 1', ...i18nText },
    { name: 'reasonsLead2', title: 'Symptoms — introduction 2', ...i18nText },
    {
      name: 'reasonsLayout',
      title: 'Symptoms — layout',
      type: 'string',
      options: {
        list: [
          { title: 'Prosa (standard)', value: 'prose' },
          { title: 'Trekkspill', value: 'accordion' },
          { title: 'Automatic', value: 'auto' },
        ],
        layout: 'radio',
      },
      initialValue: 'prose',
    },
    {
      name: 'reasons',
      title: 'Symptoms / indications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Number', ...i18nString },
            { name: 'title', title: 'Title', ...i18nString },
            { name: 'desc', title: 'Description', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    { name: 'flowEyebrow', title: 'Process — eyebrow', ...i18nString },
    { name: 'flowTitle', title: 'Process — title', ...i18nString },
    { name: 'flowImage', title: 'Process — image', type: 'image', options: { hotspot: true } },
    { name: 'flowImageAlt', title: 'Process — image alt', ...i18nString },
    { name: 'flowLinkLabel', title: 'Process — link text', ...i18nString },
    { name: 'flowLinkHref', title: 'Process — link', type: 'string', validation: validateRelativePath },
    {
      name: 'flow',
      title: 'Process — steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Step number / label', ...i18nString },
            { name: 'title', title: 'Title', ...i18nString },
            { name: 'desc', title: 'Description', ...i18nText },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    {
      name: 'expertAreas',
      title: 'Areas of expertise',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', ...i18nString },
        { name: 'description', title: 'Ingress', ...i18nText },
        {
          name: 'items',
          title: 'Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', ...i18nString },
                { name: 'desc', title: 'Description', ...i18nText },
                { name: 'path', title: 'Link', type: 'string', validation: validateRelativePath },
                { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                { name: 'imageAlt', title: 'Image — alt', ...i18nString },
              ],
              preview: titledItemPreview,
            },
          ],
        },
      ],
    },
    {
      name: 'promises',
      title: 'Promises / advantages (3 columns)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', ...i18nString },
            { name: 'title', title: 'Title', ...i18nString },
            { name: 'desc', title: 'Description', ...i18nText },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Image — alt', ...i18nString },
          ],
          preview: titledItemPreview,
        },
      ],
    },
    {
      name: 'textSection',
      title: 'Text + image section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', ...i18nString },
        { name: 'lead', title: 'Ingress', ...i18nText },
        {
          name: 'points',
          title: 'Punkter',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'n', title: 'Number', ...i18nString },
                { name: 'title', title: 'Title', ...i18nString },
                { name: 'desc', title: 'Description', ...i18nText },
              ],
              preview: titledItemPreview,
            },
          ],
        },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'imageAlt', title: 'Image alt', ...i18nString },
      ],
    },
    { name: 'relatedEyebrow', title: 'Relatert — eyebrow', ...i18nString },
    { name: 'relatedTitle', title: 'Related — title', ...i18nString },
    { name: 'relatedLead', title: 'Relatert — ingress', ...i18nText },
    { name: 'relatedAsIntro', title: 'Relatert rett etter hero', type: 'boolean' },
    { name: 'relatedAsServices', title: 'Related as service carousel', type: 'boolean' },
    {
      name: 'relatedSeeAllHref',
      title: 'Related — \'see all\' link',
      type: 'string',
      description: 'E.g. /treatments/fertility',
      validation: validateRelativePath,
    },
    { name: 'relatedSeeAllLabel', title: 'Related — \'see all\' text', ...i18nString },
    { name: 'ctaTitle', title: 'Closing CTA — Title [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'ctaDescription', title: 'Closing CTA — Text [DEPRECATED]', ...i18nText, hidden: true, readOnly: true },
    { name: 'conversationCtaTitle', title: 'Mid-page CTA — title [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistTitle', title: 'Specialist section — title [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistDescription', title: 'Specialist section — introduction [DEPRECATED]', ...i18nText, hidden: true, readOnly: true },
    { name: 'specialistCtaLabel', title: 'Specialist section — CTA text [DEPRECATED]', ...i18nString, hidden: true, readOnly: true },
    { name: 'specialistCtaHref', title: 'Specialist section — CTA link [DEPRECATED]', type: 'string', hidden: true, readOnly: true },
  ],
}
