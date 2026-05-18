// Section library — polymorphic blocks used by Master A (treatmentCategory),
// Master B (treatment), and Master C (article). Each section has:
//   - enabled (boolean, default true) — soft toggle
//   - anchorId (string, optional) — for #scroll links
// Frontend renders via SectionRenderer registry. Editors pick from a
// per-template whitelist (see allowedSectionsFor* in this file).

const baseFields = [
  {
    name: 'enabled',
    title: 'Aktiv',
    type: 'boolean',
    description: 'Slå av for å skjule seksjonen uten å slette innholdet.',
    initialValue: true,
  },
  {
    name: 'anchorId',
    title: 'Anker-ID (valgfritt)',
    type: 'string',
    description: 'Brukes for #scroll-lenker (f.eks. "behandling").',
  },
]

const previewWithToggle = (titleField: string, fallback: string) => ({
  select: { title: titleField, enabled: 'enabled' },
  prepare({ title, enabled }: any) {
    const t = Array.isArray(title)
      ? title.find((x: any) => (x.language || x._key) === 'no')?.value || title[0]?.value
      : title
    return {
      title: `${enabled === false ? '🚫 ' : ''}${t || fallback}`,
      subtitle: enabled === false ? 'Skjult' : undefined,
    }
  },
})

/* ────────────── Shared sections (all masters) ────────────── */

export const sectionHero = {
  name: 'sectionHero',
  title: 'Seksjon: Hero',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'eyebrow', title: 'Eyebrow (kort tagline)', type: 'internationalizedArrayString' },
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'subheading', title: 'Undertekst', type: 'internationalizedArrayText' },
    { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
    { name: 'videoUrl', title: 'Video-URL (valgfritt)', type: 'url' },
    { name: 'ctaLabel', title: 'CTA-tekst', type: 'internationalizedArrayString' },
    { name: 'ctaHref', title: 'CTA-lenke', type: 'string' },
  ],
  preview: previewWithToggle('heading', 'Hero'),
}

export const sectionIntro = {
  name: 'sectionIntro',
  title: 'Seksjon: Intro',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Brødtekst', type: 'internationalizedArrayText' },
    { name: 'image', title: 'Bilde (valgfritt)', type: 'image', options: { hotspot: true } },
  ],
  preview: previewWithToggle('heading', 'Intro'),
}

export const sectionStats = {
  name: 'sectionStats',
  title: 'Seksjon: Statistikk',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift (valgfritt)', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Statistikker',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Tall/verdi', type: 'string' },
            { name: 'label', title: 'Etikett', type: 'internationalizedArrayString' },
          ],
          preview: { select: { title: 'value', subtitle: 'label.0.value' } },
        },
      ],
    },
    {
      name: 'background',
      title: 'Bakgrunn',
      type: 'string',
      options: { list: [{ title: 'Lys', value: 'light' }, { title: 'Mørk', value: 'dark' }] },
      initialValue: 'dark',
    },
  ],
  preview: previewWithToggle('heading', 'Statistikk'),
}

export const sectionFaq = {
  name: 'sectionFaq',
  title: 'Seksjon: FAQ',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro (valgfritt)', type: 'internationalizedArrayText' },
    {
      name: 'items',
      title: 'Spørsmål/svar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'internationalizedArrayString' },
            { name: 'answer', title: 'Svar', type: 'internationalizedArrayText' },
          ],
          preview: { select: { title: 'question.0.value' } },
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'FAQ'),
}

export const sectionCta = {
  name: 'sectionCta',
  title: 'Seksjon: CTA',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Tekst', type: 'internationalizedArrayText' },
    { name: 'ctaLabel', title: 'Knappetekst', type: 'internationalizedArrayString' },
    { name: 'ctaHref', title: 'Lenke', type: 'string' },
    {
      name: 'background',
      title: 'Bakgrunn',
      type: 'string',
      options: { list: [{ title: 'Lys', value: 'light' }, { title: 'Mørk', value: 'dark' }] },
      initialValue: 'dark',
    },
  ],
  preview: previewWithToggle('heading', 'CTA'),
}

export const sectionRichText = {
  name: 'sectionRichText',
  title: 'Seksjon: Rich text',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift (valgfritt)', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Innhold', type: 'internationalizedArrayBlockContent' },
  ],
  preview: previewWithToggle('heading', 'Rich text'),
}

export const sectionVideo = {
  name: 'sectionVideo',
  title: 'Seksjon: Video',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'url', title: 'Video-URL', type: 'url' },
    { name: 'thumbnail', title: 'Thumbnail (for .mp4)', type: 'image' },
    { name: 'caption', title: 'Caption', type: 'internationalizedArrayString' },
  ],
  preview: previewWithToggle('caption', 'Video'),
}

export const sectionImageGallery = {
  name: 'sectionImageGallery',
  title: 'Seksjon: Bildegalleri',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'images',
      title: 'Bilder',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Bilde', type: 'image', options: { hotspot: true } },
            { name: 'caption', title: 'Caption', type: 'internationalizedArrayString' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Bildegalleri'),
}

export const sectionQuote = {
  name: 'sectionQuote',
  title: 'Seksjon: Sitat',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'quote', title: 'Sitat', type: 'internationalizedArrayText' },
    { name: 'source', title: 'Kilde', type: 'string' },
    { name: 'image', title: 'Bilde av kilde', type: 'image' },
  ],
  preview: previewWithToggle('quote', 'Sitat'),
}

export const sectionTrustBadges = {
  name: 'sectionTrustBadges',
  title: 'Seksjon: Trust-merker',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Merker',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tekst', type: 'internationalizedArrayString' },
            { name: 'logo', title: 'Logo', type: 'image' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Trust-merker'),
}

/* ────────────── Master A: hovedkategori-spesifikke ────────────── */

export const sectionServicesList = {
  name: 'sectionServicesList',
  title: 'Seksjon: Tjenesteliste',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro', type: 'internationalizedArrayText' },
    {
      name: 'treatmentRefs',
      title: 'Behandlinger (referanser)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
    },
    {
      name: 'manualItems',
      title: 'Manuelle elementer (alternativ til referanser)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'path', title: 'URL', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Tjenesteliste'),
}

export const sectionServiceGroups = {
  name: 'sectionServiceGroups',
  title: 'Seksjon: Tjeneste-grupper',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'groups',
      title: 'Grupper',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Gruppe-etikett', type: 'internationalizedArrayString' },
            { name: 'caption', title: 'Underlinje', type: 'internationalizedArrayString' },
            {
              name: 'items',
              title: 'Tjenester i gruppen',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: { select: { title: 'label.0.value' } },
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Tjeneste-grupper'),
}

export const sectionSpecialists = {
  name: 'sectionSpecialists',
  title: 'Seksjon: Spesialister',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro', type: 'internationalizedArrayText' },
    {
      name: 'filterCategory',
      title: 'Filtrer på kategori-ID',
      type: 'string',
      description: 'F.eks. "gynekologi". La stå tomt for å vise alle.',
    },
    { name: 'maxCount', title: 'Maks antall', type: 'number', initialValue: 8 },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['carousel', 'grid'] },
      initialValue: 'carousel',
    },
    {
      name: 'manualRefs',
      title: 'Manuelle spesialister (overstyrer filter)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Spesialister'),
}

export const sectionJourney = {
  name: 'sectionJourney',
  title: 'Seksjon: Pasientreise',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'steps',
      title: 'Steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Lucide-ikon', type: 'string' },
            { name: 'label', title: 'Steg-etikett (f.eks. "Steg 01")', type: 'string' },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'body', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
          preview: { select: { title: 'title.0.value', subtitle: 'label' } },
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Pasientreise'),
}

export const sectionReviews = {
  name: 'sectionReviews',
  title: 'Seksjon: Anmeldelser',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'source',
      title: 'Kilde',
      type: 'string',
      options: { list: ['google', 'legelisten', 'begge'] },
      initialValue: 'google',
    },
    { name: 'maxCount', title: 'Maks antall', type: 'number', initialValue: 6 },
  ],
  preview: previewWithToggle('heading', 'Anmeldelser'),
}

export const sectionPriceTeaser = {
  name: 'sectionPriceTeaser',
  title: 'Seksjon: Pris-teaser',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Priser',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Behandling', type: 'internationalizedArrayString' },
            { name: 'price', title: 'Pris (f.eks. "fra 2100,-")', type: 'string' },
          ],
        },
      ],
    },
    { name: 'ctaHref', title: 'Lenke til prisliste', type: 'string' },
  ],
  preview: previewWithToggle('heading', 'Pris-teaser'),
}

export const sectionRelatedThemes = {
  name: 'sectionRelatedThemes',
  title: 'Seksjon: Relaterte tema',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'themes',
      title: 'Tema-sider',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'themePage' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Relaterte tema'),
}

/* ────────────── Master B: undertjeneste-spesifikke ────────────── */

export const sectionBenefits = {
  name: 'sectionBenefits',
  title: 'Seksjon: Fordeler',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Punkter',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
  ],
  preview: previewWithToggle('heading', 'Fordeler'),
}

export const sectionProcess = {
  name: 'sectionProcess',
  title: 'Seksjon: Behandlingsprosess',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'steps',
      title: 'Steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Behandlingsprosess'),
}

export const sectionAccordionContent = {
  name: 'sectionAccordionContent',
  title: 'Seksjon: Trekkspill-innhold',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Trekkspill-elementer',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'Anker-ID', type: 'string' },
            { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
            { name: 'content', title: 'Innhold (markdown)', type: 'internationalizedArrayText' },
          ],
          preview: { select: { title: 'heading.0.value' } },
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Trekkspill'),
}

export const sectionLinkedServices = {
  name: 'sectionLinkedServices',
  title: 'Seksjon: Koblede tjenester',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'items',
      title: 'Tjenester',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'path', title: 'URL', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Koblede tjenester'),
}

export const sectionSymptoms = {
  name: 'sectionSymptoms',
  title: 'Seksjon: Symptomer',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro', type: 'internationalizedArrayText' },
    {
      name: 'symptoms',
      title: 'Symptomliste',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    { name: 'whenToContact', title: 'Når bør du kontakte oss?', type: 'internationalizedArrayText' },
  ],
  preview: previewWithToggle('heading', 'Symptomer'),
}

export const sectionTreatmentOptions = {
  name: 'sectionTreatmentOptions',
  title: 'Seksjon: Behandlingsalternativer',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'options',
      title: 'Alternativer',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'icon', title: 'Lucide-ikon', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Behandlingsalternativer'),
}

export const sectionPriceCard = {
  name: 'sectionPriceCard',
  title: 'Seksjon: Pris-kort',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'priceFrom', title: 'Pris fra (f.eks. "2100")', type: 'string' },
    { name: 'currency', title: 'Valuta', type: 'string', initialValue: 'NOK' },
    {
      name: 'includes',
      title: 'Hva inngår',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    { name: 'note', title: 'Notat', type: 'internationalizedArrayText' },
  ],
  preview: previewWithToggle('heading', 'Pris-kort'),
}

export const sectionInsuranceInfo = {
  name: 'sectionInsuranceInfo',
  title: 'Seksjon: Forsikrings-info',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Tekst', type: 'internationalizedArrayText' },
    {
      name: 'providers',
      title: 'Forsikringsselskap',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  preview: previewWithToggle('heading', 'Forsikring'),
}

export const sectionClinicLocations = {
  name: 'sectionClinicLocations',
  title: 'Seksjon: Klinikker',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'clinicRefs',
      title: 'Klinikker',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Klinikker'),
}

export const sectionBookingCta = {
  name: 'sectionBookingCta',
  title: 'Seksjon: Booking-CTA',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Tekst', type: 'internationalizedArrayText' },
    { name: 'bookingPath', title: 'Booking-URL', type: 'string' },
  ],
  preview: previewWithToggle('heading', 'Booking-CTA'),
}

export const sectionRelatedTreatments = {
  name: 'sectionRelatedTreatments',
  title: 'Seksjon: Relaterte behandlinger',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'treatmentRefs',
      title: 'Behandlinger',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Relaterte behandlinger'),
}

/* ────────────── Master C: artikkel-spesifikke ────────────── */

export const sectionArticleHero = {
  name: 'sectionArticleHero',
  title: 'Seksjon: Artikkel-hero',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'showCategory', title: 'Vis kategori-tag', type: 'boolean', initialValue: true },
    { name: 'showDate', title: 'Vis dato', type: 'boolean', initialValue: true },
    { name: 'showAuthor', title: 'Vis forfatter', type: 'boolean', initialValue: true },
    { name: 'showReadingTime', title: 'Vis leselengde', type: 'boolean', initialValue: false },
  ],
  preview: { prepare: () => ({ title: 'Artikkel-hero' }) },
}

export const sectionArticleBody = {
  name: 'sectionArticleBody',
  title: 'Seksjon: Artikkel-innhold',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'body', title: 'Innhold', type: 'internationalizedArrayBlockContent' },
  ],
  preview: { prepare: () => ({ title: 'Artikkel-innhold' }) },
}

export const sectionAuthorBio = {
  name: 'sectionAuthorBio',
  title: 'Seksjon: Forfatter-bio',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'specialist', title: 'Spesialist', type: 'reference', to: [{ type: 'specialist' }] },
  ],
  preview: { select: { title: 'specialist.name' } },
}

export const sectionRelatedArticles = {
  name: 'sectionRelatedArticles',
  title: 'Seksjon: Relaterte artikler',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'mode',
      title: 'Modus',
      type: 'string',
      options: { list: ['auto', 'manual'] },
      initialValue: 'auto',
    },
    {
      name: 'manualRefs',
      title: 'Manuelle artikler',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    },
    { name: 'maxCount', title: 'Maks antall (auto)', type: 'number', initialValue: 3 },
  ],
  preview: previewWithToggle('heading', 'Relaterte artikler'),
}

export const sectionNewsletterCta = {
  name: 'sectionNewsletterCta',
  title: 'Seksjon: Nyhetsbrev-CTA',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'body', title: 'Tekst', type: 'internationalizedArrayText' },
  ],
  preview: previewWithToggle('heading', 'Nyhetsbrev'),
}

export const sectionTableOfContents = {
  name: 'sectionTableOfContents',
  title: 'Seksjon: Innholdsfortegnelse',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
  ],
  preview: previewWithToggle('heading', 'Innholdsfortegnelse'),
}

export const sectionDownload = {
  name: 'sectionDownload',
  title: 'Seksjon: Nedlasting',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
    { name: 'file', title: 'Fil', type: 'file' },
    { name: 'externalUrl', title: 'Ekstern URL (alternativ)', type: 'url' },
  ],
  preview: previewWithToggle('heading', 'Nedlasting'),
}

export const sectionJobApplication = {
  name: 'sectionJobApplication',
  title: 'Seksjon: Stillingssøknad',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'deadline', title: 'Søknadsfrist', type: 'date' },
    { name: 'contactEmail', title: 'Kontakt-e-post', type: 'string' },
    { name: 'applyUrl', title: 'Søknads-URL', type: 'url' },
  ],
  preview: previewWithToggle('heading', 'Stillingssøknad'),
}

/* ────────────── Tema-spesifikke seksjoner ────────────── */

export const sectionCategoryLinks = {
  name: 'sectionCategoryLinks',
  title: 'Seksjon: Lenker til fagområder',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro', type: 'internationalizedArrayText' },
    {
      name: 'categoryRefs',
      title: 'Fagområder',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatmentCategory' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Lenker til fagområder'),
}

export const sectionTreatmentHighlights = {
  name: 'sectionTreatmentHighlights',
  title: 'Seksjon: Utvalgte behandlinger',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    { name: 'intro', title: 'Intro', type: 'internationalizedArrayText' },
    {
      name: 'treatmentRefs',
      title: 'Behandlinger',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
    },
  ],
  preview: previewWithToggle('heading', 'Utvalgte behandlinger'),
}

export const sectionArticleFeed = {
  name: 'sectionArticleFeed',
  title: 'Seksjon: Artikkel-feed',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'mode',
      title: 'Modus',
      type: 'string',
      options: { list: ['auto', 'manual'] },
      initialValue: 'auto',
    },
    {
      name: 'category',
      title: 'Filtrer på kategori (auto)',
      type: 'string',
      options: { list: ['fagartikkel', 'nyheter', 'alle'] },
      initialValue: 'alle',
    },
    { name: 'maxCount', title: 'Maks antall', type: 'number', initialValue: 6 },
    {
      name: 'manualRefs',
      title: 'Manuelle artikler / nyheter',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'article' }] },
        { type: 'reference', to: [{ type: 'newsItem' }] },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Artikkel-feed'),
}

export const sectionLifePhases = {
  name: 'sectionLifePhases',
  title: 'Seksjon: Livsfaser',
  type: 'object',
  fields: [
    ...baseFields,
    { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString' },
    {
      name: 'phases',
      title: 'Faser',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'text', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'icon', title: 'Lucide-ikon', type: 'string' },
          ],
          preview: { select: { title: 'title.0.value' } },
        },
      ],
    },
  ],
  preview: previewWithToggle('heading', 'Livsfaser'),
}

/* ────────────── Export bundles ────────────── */

export const allSectionTypes = [
  sectionHero, sectionIntro, sectionStats, sectionFaq, sectionCta,
  sectionRichText, sectionVideo, sectionImageGallery, sectionQuote, sectionTrustBadges,
  sectionServicesList, sectionServiceGroups, sectionSpecialists, sectionJourney,
  sectionReviews, sectionPriceTeaser, sectionRelatedThemes,
  sectionBenefits, sectionProcess, sectionAccordionContent, sectionLinkedServices,
  sectionSymptoms, sectionTreatmentOptions, sectionPriceCard, sectionInsuranceInfo,
  sectionClinicLocations, sectionBookingCta, sectionRelatedTreatments,
  sectionArticleHero, sectionArticleBody, sectionAuthorBio, sectionRelatedArticles,
  sectionNewsletterCta, sectionTableOfContents, sectionDownload, sectionJobApplication,
  sectionCategoryLinks, sectionTreatmentHighlights, sectionArticleFeed, sectionLifePhases,
]

// Whitelist of allowed section _types per master template
export const allowedSectionsForCategory = [
  'sectionHero', 'sectionIntro', 'sectionStats', 'sectionServicesList',
  'sectionServiceGroups', 'sectionSpecialists', 'sectionJourney', 'sectionReviews',
  'sectionPriceTeaser', 'sectionRelatedThemes', 'sectionFaq', 'sectionCta',
  'sectionRichText', 'sectionVideo', 'sectionImageGallery', 'sectionQuote',
  'sectionTrustBadges',
]

export const allowedSectionsForTheme = [
  'sectionHero', 'sectionIntro', 'sectionRichText', 'sectionLifePhases',
  'sectionCategoryLinks', 'sectionTreatmentHighlights', 'sectionSpecialists',
  'sectionArticleFeed', 'sectionStats', 'sectionReviews', 'sectionJourney',
  'sectionImageGallery', 'sectionVideo', 'sectionQuote', 'sectionTrustBadges',
  'sectionFaq', 'sectionCta',
]

export const allowedSectionsForTreatment = [
  'sectionHero', 'sectionIntro', 'sectionStats', 'sectionBenefits', 'sectionProcess',
  'sectionAccordionContent', 'sectionSymptoms', 'sectionTreatmentOptions',
  'sectionLinkedServices', 'sectionSpecialists', 'sectionPriceCard',
  'sectionInsuranceInfo', 'sectionClinicLocations', 'sectionBookingCta',
  'sectionRelatedTreatments', 'sectionFaq', 'sectionCta', 'sectionRichText',
  'sectionVideo', 'sectionImageGallery', 'sectionQuote',
]

export const allowedSectionsForArticle = [
  'sectionArticleHero', 'sectionIntro', 'sectionTableOfContents', 'sectionArticleBody',
  'sectionRichText', 'sectionVideo', 'sectionImageGallery', 'sectionQuote',
  'sectionAuthorBio', 'sectionRelatedArticles', 'sectionRelatedTreatments',
  'sectionDownload', 'sectionJobApplication', 'sectionNewsletterCta',
  'sectionTrustBadges', 'sectionFaq', 'sectionCta',
]

export const allowedSectionsForNews = [
  'sectionArticleHero', 'sectionRichText', 'sectionImageGallery', 'sectionVideo',
  'sectionQuote', 'sectionAuthorBio', 'sectionRelatedArticles', 'sectionCta',
  'sectionNewsletterCta',
]
