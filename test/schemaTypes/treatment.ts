// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category
import { TreatmentIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  i18nTitleItemPreview,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

const validateRelativePath = (Rule: any) =>
  Rule.custom((value: any) => {
    if (!value) return true
    if (typeof value !== 'string') return true
    return value.startsWith('/')
      ? true
      : 'Stien må være en relativ lenke som starter med skråstrek (f.eks. /priser)'
  })

export default {
  name: 'treatment',
  title: 'Behandling',
  type: 'document',
  icon: TreatmentIcon,
  groups: [
    { name: 'general', title: 'Generelt' },
    { name: 'hero', title: 'Hero-seksjon' },
    { name: 'symptoms', title: 'Symptomer (Om oss)' },
    { name: 'flow', title: 'Forløp (Slik foregår det)' },
    { name: 'features', title: 'Ekspertområder & Løfter' },
    { name: 'seo', title: 'SEO / Synlighet' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Behandlingsnavn',
      type: 'internationalizedArrayString',
      group: 'general',
      validation: reqI18n('Behandlingsnavn'),
    },
    {
      ...i18nSlugFieldFromTitle('title'),
      group: 'general',
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      group: 'general',
      to: [{ type: 'treatmentCategory' }],
    },
    {
      name: 'parentCategoryLabel',
      title: 'Overordnet kategori (visningsnavn)',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'F.eks. "Gynekologi" — vises som breadcrumb',
      validation: reqI18n('Overordnet kategori'),
    },
    {
      name: 'description',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
      group: 'general',
      validation: reqI18n('Introduksjonstekst'),
    },
    // FAQs
    {
      name: 'faqs',
      title: 'Vanlige spørsmål',
      type: 'array',
      group: 'general',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faq' }],
        },
        {
          type: 'object',
          title: 'FAQ',
          fields: [
            {
              name: 'question',
              title: 'Spørsmål',
              type: 'internationalizedArrayString',
              validation: reqI18n('Spørsmål'),
            },
            {
              name: 'answer',
              title: 'Svar',
              type: 'internationalizedArrayText',
              validation: reqI18n('Svar'),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    // Sub-items (shown in 3rd column of service dropdown)
    {
      name: 'subItems',
      title: 'Undermeny-elementer',
      group: 'general',
      description: 'Vises som tredje kolonne i tjeneste-dropdown i menyen',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Tittel',
              type: 'internationalizedArrayString',
              validation: reqI18n('Tittel'),
            },
            {
              name: 'anchor',
              title: 'Anker (valgfritt)',
              type: 'string',
              description: 'Anker-lenke på siden (#seksjon)',
            },
            {
              name: 'path',
              title: 'Egen URL (valgfritt)',
              type: 'string',
              description: 'Full URL hvis elementet skal lenke til en annen side',
            },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
      group: 'general',
      description: 'Kort tekst som vises under behandlingsnavnet (brukes som eyebrow i hero-seksjonen).',
      validation: reqI18n('Undertittel'),
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      group: 'general',
      description: 'Lavere tall vises først innenfor kategorien.',
    },
    // ─── Hero Section ────────────────────────────────────────────────────────
    { name: 'homeBreadcrumbLabel', title: 'Brødsmule — hjem', type: 'internationalizedArrayString', group: 'hero', description: 'Teksten som vises som første ledd i brødsmule-navigasjonen, f.eks. «Hjem».' },
    { name: 'srOnlyTitle', title: 'Skjult H1 (skjermleser)', type: 'internationalizedArrayString', group: 'hero', description: 'En skjult overskrift kun for skjermlesere. Beskriv siden kort, f.eks. «Behandlingsside for hysteroskopi hos CMedical».' },
    { name: 'themesAriaLabel', title: 'Temaer — aria-label', type: 'internationalizedArrayString', group: 'hero' },
    { name: 'eyebrow', title: 'Eyebrow (over hero-tittel)', type: 'internationalizedArrayString', group: 'hero', description: 'Liten tekst over tittelen i hero-seksjonen, f.eks. «Gynekologi».' },
    {
      name: 'heroTitle',
      title: 'Hero-tittel',
      type: 'internationalizedArrayString',
      group: 'hero',
      description: 'Hovedtittelen som vises stort i hero-seksjonen på behandlingssiden. Hold den kort og slagkraftig.',
      validation: reqI18n('Hero-tittel'),
    },
    {
      name: 'heroDescription',
      title: 'Hero-ingress',
      type: 'internationalizedArrayText',
      group: 'hero',
      description: 'Kort ingressen under hero-tittelen. 1–3 setninger som beskriver behandlingen.',
      validation: reqI18n('Hero-ingress'),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Bilde som vises til høyre i hero-seksjonen. Anbefalt størrelse: 800×600px or better.',
      validation: (Rule: any) => Rule.required().error('Hero-bilde er påkrevd'),
    },
    { name: 'heroImageAlt', title: 'Hero-bilde — alt-tekst', type: 'internationalizedArrayString', group: 'hero', description: 'Beskrivende alt-tekst for tilgjengelighet, f.eks. «Lege utfører hysteroskopi».' },
    {
      name: 'heroVideo',
      title: 'Hero-video URL',
      type: 'url',
      group: 'hero',
      description: 'Valgfri video-URL som spilles av i hero-seksjonen. Last opp en MP4-video (maks 10MB, 16:9-format) og lim inn URL-en her.',
    },
    { name: 'rating', title: 'Vurdering / tagline', type: 'internationalizedArrayString', group: 'hero', description: 'Kort tekst som vises under hero-bildet, f.eks. «4.9/5 fra 200 pasienter».' },
    { name: 'heroPrice', title: 'Hero — prislinje', type: 'internationalizedArrayString', group: 'hero', description: 'Kortfattet prisinformasjon i hero-seksjonen, f.eks. «Fra 2 500 kr».' },
    { name: 'hideSeePriser', title: 'Skjul «Se priser»-lenke', type: 'boolean', group: 'hero', initialValue: false },
    { name: 'heroAvailability', title: 'Hero — tilgjengelighet', type: 'internationalizedArrayString', group: 'hero', description: 'Tilgjengelighetstekst i hero-seksjonen, f.eks. «Tilgjengelig på 3 klinikker».' },
    {
      name: 'heroThemes',
      title: 'Hero — tema-chips',
      type: 'array',
      group: 'hero',
      description: 'Nøkkelord/tema-chips som vises i hero-seksjonen.',
      of: [{ type: 'internationalizedArrayString' }],
    },
    {
      name: 'heroPoints',
      title: 'Hero-punkter',
      type: 'array',
      group: 'hero',
      description: 'Korte fordels-punkter som vises i hero-seksjonen.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc' },
            prepare({ title, subtitle }: any) {
              return {
                title: pickNo(title) || 'Uten tittel',
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Booking / CTA ───────────────────────────────────────────────────────
    { name: 'primaryCtaLabel', title: 'Primær CTA-tekst', type: 'internationalizedArrayString', group: 'hero', description: 'Teksten på «Bestill time»-knappen i hero-seksjonen.' },
    { name: 'seePricesLabel', title: 'Se priser — tekst', type: 'internationalizedArrayString', group: 'hero' },
    { name: 'seePricesHref', title: 'Se priser — lenke', type: 'string', group: 'hero', description: 'URL til prissiden, f.eks. /priser.', validation: validateRelativePath },
    { name: 'callCtaLabel', title: 'Ring oss — tekst', type: 'internationalizedArrayString', group: 'hero' },
    { name: 'bookingService', title: 'Booking tjeneste-ID', type: 'string', group: 'hero', description: 'Valgfri tjeneste-ID som sendes til booking-systemet (f.eks. «hysterektomi»).' },
    // ─── Reasons / Symptoms ──────────────────────────────────────────────────
    { name: 'reasonsEyebrow', title: 'Symptomer — eyebrow', type: 'internationalizedArrayString', group: 'symptoms' },
    {
      name: 'reasonsTitle',
      title: 'Symptomer — tittel',
      type: 'internationalizedArrayString',
      group: 'symptoms',
      description: 'Overskriften for symptom/indikasjons-seksjonen.',
      validation: reqI18n('Symptomer — tittel'),
    },
    { name: 'reasonsLead', title: 'Symptomer — ingress 1', type: 'internationalizedArrayText', group: 'symptoms' },
    { name: 'reasonsLead2', title: 'Symptomer — ingress 2', type: 'internationalizedArrayText', group: 'symptoms' },
    {
      name: 'reasonsLayout',
      title: 'Symptomer — layout',
      type: 'string',
      group: 'symptoms',
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
      group: 'symptoms',
      description: 'Legg til symptomer eller indikasjoner for denne behandlingen.',
      validation: (Rule: any) => Rule.required().min(1).error('Minst ett symptom/indikasjon må legges til'),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Nummer', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
              return {
                title: `${prefix}${pickNo(title) || 'Uten tittel'}`,
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Flow (Treatment Steps) ───────────────────────────────────────────────
    { name: 'flowEyebrow', title: 'Forløp — eyebrow', type: 'internationalizedArrayString', group: 'flow' },
    { name: 'flowTitle', title: 'Forløp — tittel', type: 'internationalizedArrayString', group: 'flow', description: 'Overskriften for «Slik foregår det»-seksjonen.' },
    { name: 'flowImage', title: 'Forløp — bilde', type: 'image', group: 'flow', options: { hotspot: true } },
    { name: 'flowImageAlt', title: 'Forløp — bilde alt', type: 'internationalizedArrayString', group: 'flow' },
    { name: 'flowLinkLabel', title: 'Forløp — lenketekst', type: 'internationalizedArrayString', group: 'flow' },
    { name: 'flowLinkHref', title: 'Forløp — lenke', type: 'string', group: 'flow', validation: validateRelativePath },
    {
      name: 'flow',
      title: 'Forløp — steg',
      type: 'array',
      group: 'flow',
      description: 'Legg til behandlingssteg som vises i «Slik foregår det»-seksjonen, f.eks. «Konsultasjon», «Undersøkelse», «Etterbehandling».',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'n', title: 'Steg-nummer / etikett', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
          preview: {
            select: { title: 'title', n: 'n', subtitle: 'desc' },
            prepare({ title, n, subtitle }: any) {
              const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
              return {
                title: `${prefix}${pickNo(title) || 'Uten tittel'}`,
                subtitle: pickNo(subtitle),
              }
            },
          },
        },
      ],
    },
    // ─── Expert Areas ────────────────────────────────────────────────────────
    {
      name: 'expertAreas',
      title: 'Ekspertområder',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
        { name: 'description', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'items',
          title: 'Kort',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
                { name: 'path', title: 'Lenke', type: 'string', validation: validateRelativePath },
                { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
                { name: 'imageAlt', title: 'Bilde — alt', type: 'internationalizedArrayString' },
              ],
              preview: {
                select: { title: 'title', subtitle: 'desc', media: 'image' },
                prepare({ title, subtitle, media }: any) {
                  return {
                    title: pickNo(title) || 'Uten tittel',
                    subtitle: pickNo(subtitle),
                    media,
                  }
                },
              },
            },
          ],
        },
      ],
    },
    // ─── Promises (3-column benefits) ────────────────────────────────────────
    {
      name: 'promises',
      title: 'Løfter / fordeler (3 kolonner)',
      type: 'array',
      group: 'features',
      description: 'Vis tre fremhevede fordeler med bilde og tekst.',
      validation: (Rule: any) => Rule.required().min(1).error('Minst én fordel/løfte må legges til'),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'internationalizedArrayString' },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Bilde — alt', type: 'internationalizedArrayString' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'desc', media: 'image' },
            prepare({ title, subtitle, media }: any) {
              return {
                title: pickNo(title) || 'Uten tittel',
                subtitle: pickNo(subtitle),
                media,
              }
            },
          },
        },
      ],
    },
    // ─── Text + Image Section ────────────────────────────────────────────────
    {
      name: 'textSection',
      title: 'Tekst + bilde-seksjon',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Ingress', type: 'internationalizedArrayText' },
        {
          name: 'points',
          title: 'Punkter',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'n', title: 'Nummer', type: 'internationalizedArrayString' },
                { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
                { name: 'desc', title: 'Beskrivelse', type: 'internationalizedArrayText' },
              ],
              preview: {
                select: { title: 'title', n: 'n', subtitle: 'desc' },
                prepare({ title, n, subtitle }: any) {
                  const prefix = pickNo(n) ? `${pickNo(n)}: ` : ''
                  return {
                    title: `${prefix}${pickNo(title) || 'Uten tittel'}`,
                    subtitle: pickNo(subtitle),
                  }
                },
              },
            },
          ],
        },
        { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
        { name: 'imageAlt', title: 'Bilde alt', type: 'internationalizedArrayString' },
      ],
    },
    // ─── Related Section ─────────────────────────────────────────────────────
    {
      name: 'relatedSection',
      title: 'Relaterte tjenester',
      type: 'object',
      group: 'features',
      fields: [
        { name: 'eyebrow', title: 'Relatert — eyebrow', type: 'internationalizedArrayString' },
        { name: 'title', title: 'Relatert — tittel', type: 'internationalizedArrayString' },
        { name: 'lead', title: 'Relatert — ingress', type: 'internationalizedArrayText' },
        { name: 'asIntro', title: 'Relatert rett etter hero', type: 'boolean' },
        { name: 'asServices', title: 'Relatert som tjenestekarusell', type: 'boolean' },
        { name: 'seeAllHref', title: 'Relatert — «se alle»-lenke', type: 'string', description: 'F.eks. /behandlinger/fertilitet', validation: validateRelativePath },
        { name: 'seeAllLabel', title: 'Relatert — «se alle»-tekst', type: 'internationalizedArrayString' },
        {
          name: 'items',
          title: 'Relaterte behandlinger',
          description: 'Velg og sorter behandlingene som skal vises i karusellen (Relaterte tjenester).',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'treatment' }],
            },
          ],
        },
      ],
    },
    // ─── CTA Sections ────────────────────────────────────────────────────────
    // [DEPRECATED] CTA and Specialist Section fields moved to pageSections
    /*
    { name: 'ctaTitle', title: 'Avsluttende CTA — tittel', type: 'internationalizedArrayString' },
    { name: 'ctaDescription', title: 'Avsluttende CTA — tekst', type: 'internationalizedArrayText' },
    { name: 'conversationCtaTitle', title: 'Midt-CTA — tittel', type: 'internationalizedArrayString' },
    // ─── Specialist Section ──────────────────────────────────────────────────
    { name: 'specialistTitle', title: 'Spesialist-seksjon — tittel', type: 'internationalizedArrayString' },
    { name: 'specialistDescription', title: 'Spesialist-seksjon — ingress', type: 'internationalizedArrayText' },
    { name: 'specialistCtaLabel', title: 'Spesialist-seksjon — CTA-tekst', type: 'internationalizedArrayString' },
    { name: 'specialistCtaHref', title: 'Spesialist-seksjon — CTA-lenke', type: 'string', description: 'F.eks. /spesialister?kategori=gynekologi' },
    */
    // ─── Insurance ───────────────────────────────────────────────────────────
    { name: 'insuranceEyebrow', title: 'Forsikring — eyebrow', type: 'internationalizedArrayString', group: 'features' },
    { name: 'insuranceTitle', title: 'Forsikring — tittel', type: 'internationalizedArrayString', group: 'features' },
    {
      name: 'insurancePartners',
      title: 'Forsikringspartnere',
      type: 'array',
      group: 'features',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', title: 'Nøkkel', type: 'string' },
          { name: 'label', title: 'Navn', type: 'internationalizedArrayString' },
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
    // ─── UI Labels ───────────────────────────────────────────────────────────
    { name: 'expertReadMoreLabel', title: 'Ekspertkort — lenketekst', type: 'internationalizedArrayString', group: 'general' },
    { name: 'scrollLeftLabel', title: 'Karusell — scroll venstre', type: 'internationalizedArrayString', group: 'general' },
    { name: 'scrollRightLabel', title: 'Karusell — scroll høyre', type: 'internationalizedArrayString', group: 'general' },
    {
      ...pageSectionsField,
      group: 'general',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      group: 'seo',
      validation: reqI18n('GEO-sammendrag'),
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parentCategoryLabel',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title: pickNo(title) || 'Behandling',
        subtitle: pickNo(subtitle) || 'Ingen kategori',
        media,
      }
    },
  },
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!pickNo(document.title)?.trim()) issues.push('Behandlingsnavn (norsk) mangler')
      if (!pickForLang(document.title, 'en')?.trim()) {
        issues.push('Behandlingsnavn (engelsk) mangler')
      }

      // Validation for the new flat design fields
      if (!document.heroImage) issues.push('Hero-bilde mangler')
      if (!pickNo(document.heroTitle)?.trim()) issues.push('Hero-tittel (norsk) mangler')
      if (!pickForLang(document.heroTitle, 'en')?.trim()) {
        issues.push('Hero-tittel (engelsk) mangler')
      }
      if (!pickNo(document.heroDescription)?.trim()) issues.push('Hero-ingress (norsk) mangler')
      if (!pickForLang(document.heroDescription, 'en')?.trim()) {
        issues.push('Hero-ingress (engelsk) mangler')
      }
      // Specialists validation removed as they are now managed under pageSections

      const reasons = document.reasons as unknown[] | undefined
      if (!Array.isArray(reasons) || reasons.length === 0) {
        issues.push('Minst ett symptom/indikasjon må legges til')
      }
      if (!pickNo(document.reasonsTitle)?.trim()) {
        issues.push('Symptomer — tittel (norsk) mangler')
      }
      if (!pickForLang(document.reasonsTitle, 'en')?.trim()) {
        issues.push('Symptomer — tittel (engelsk) mangler')
      }

      const promises = document.promises as unknown[] | undefined
      if (!Array.isArray(promises) || promises.length === 0) {
        issues.push('Minst én fordel/løfte må legges til')
      }

      const seo = document.seo as Record<string, unknown> | undefined
      if (!pickNo(seo?.metaTitle)?.trim()) issues.push('SEO meta-tittel (norsk) mangler')
      if (!pickForLang(seo?.metaTitle, 'en')?.trim()) {
        issues.push('SEO meta-tittel (engelsk) mangler')
      }
      if (!pickNo(seo?.metaDescription)?.trim()) {
        issues.push('SEO meta-beskrivelse (norsk) mangler')
      }
      if (!pickForLang(seo?.metaDescription, 'en')?.trim()) {
        issues.push('SEO meta-beskrivelse (engelsk) mangler')
      }
      if (issues.length === 0) return true
      return issues.join('. ')
    }),
}
