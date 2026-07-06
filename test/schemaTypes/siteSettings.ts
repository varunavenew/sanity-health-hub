// Schema: Site Settings
// Global settings: navigation menu, contact info, social media, 404 page
import { SettingsIcon } from './icons'
import { pickNo, requiredNoEnI18n } from './i18n'

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: SettingsIcon,
  groups: [
    { name: 'general', title: 'Generelt', default: true },
    { name: 'navigation', title: 'Navigasjon' },
    { name: 'footer', title: 'Footer' },
    { name: 'social', title: 'Sosiale medier' },
    { name: 'notFound', title: '404-side' },
    { name: 'treatment', title: 'Behandlingsside' },
  ],
  fields: [
    // ── General ──
    {
      name: 'treatmentPageUi',
      title: 'Generisk behandlingsside',
      type: 'object',
      group: 'treatment',
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'loadingLabel',
          title: 'Laster-tekst',
          type: 'internationalizedArrayString',
        },
        {
          name: 'notFoundTitle',
          title: 'Ikke funnet — tittel',
          type: 'internationalizedArrayString',
        },
        {
          name: 'notFoundBody',
          title: 'Ikke funnet — tekst',
          type: 'internationalizedArrayText',
        },
        {
          name: 'backLabel',
          title: 'Tilbake-lenke',
          type: 'internationalizedArrayString',
        },
      ],
    },
    {
      name: 'title',
      title: 'Nettstedsnavn',
      type: 'string',
      group: 'general',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      group: 'general',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      group: 'general',
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
      group: 'general',
      description: 'Kort adressetekst for footer (f.eks. "Oslo · Bekkestua · Moss · Moelv")',
    },

    // ── Navigation ──
    {
      name: 'mainNavigation',
      title: 'Hovedmeny',
      type: 'array',
      group: 'navigation',
      description: 'Menyelementer som vises i headeren. Dra for å endre rekkefølge.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Menyelement',
          fields: [
            {
              name: 'label',
              title: 'Tekst',
              type: 'internationalizedArrayString',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'navId',
              title: 'Meny-ID (fallback)',
              type: 'string',
              description:
                'Valgfri. Brukes til automatisk oversettelse når engelsk tekst mangler (f.eks. services, pricing).',
              options: {
                list: [
                  { title: 'Tjenester', value: 'services' },
                  { title: 'Priser', value: 'pricing' },
                  { title: 'Forsikring', value: 'insurance' },
                  { title: 'Aktuelt', value: 'news' },
                  { title: 'Om oss', value: 'about' },
                  { title: 'Klinikker', value: 'clinics' },
                  { title: 'Kontakt', value: 'contact' },
                  { title: 'Spesialister', value: 'specialists' },
                ],
              },
            },
            {
              name: 'path',
              title: 'Lenke',
              type: 'internationalizedArrayString',
              description:
                'Synkroniseres automatisk fra sidens URL-slug når du publiserer (f.eks. Tjenester, Priser, Kontakt). Du kan fortsatt redigere manuelt; neste publisering av siden overskriver lenken igjen.',
              validation: (Rule: any) => Rule.required(),
              readOnly: ({ parent }: { parent?: { navId?: string } }) =>
                Boolean(
                  parent?.navId &&
                    [
                      'services',
                      'pricing',
                      'insurance',
                      'news',
                      'about',
                      'clinics',
                      'contact',
                      'specialists',
                    ].includes(parent.navId),
                ),
            },
            {
              name: 'isServicesDropdown',
              title: 'Er tjenestermeny?',
              type: 'boolean',
              description: 'Aktiver for å vise tjenester-dropdown i stedet for vanlig lenke',
              initialValue: false,
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'path' },
            prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
              const pathStr =
                typeof subtitle === 'string'
                  ? subtitle
                  : pickNo(subtitle)
              return { title: pickNo(title) || 'Menyelement', subtitle: pathStr }
            },
          },
        },
      ],
    },
    {
      name: 'ctaButton',
      title: 'CTA-knapp',
      type: 'object',
      group: 'navigation',
      description: 'Handlingsknapp i headeren (f.eks. "Bestill time")',
      fields: [
        {
          name: 'label',
          title: 'Tekst',
          type: 'internationalizedArrayString',
        },
        {
          name: 'path',
          title: 'Lenke',
          type: 'internationalizedArrayString',
          description: 'Intern sti per språk, f.eks. NO: /booking · EN: /book-appointment',
          initialValue: undefined,
        },
      ],
    },

    // ── Footer ──
    {
      name: 'footerAboutLinks',
      title: 'Om CMedical-lenker (footer)',
      type: 'array',
      group: 'footer',
      description: 'Lenker som vises i "Om CMedical"-kolonnen i footeren. Dra for å endre rekkefølge.',
      of: [
        {
          type: 'object',
          name: 'footerLink',
          title: 'Footer-lenke',
          fields: [
            {
              name: 'label',
              title: 'Tekst',
              type: 'internationalizedArrayString',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'navId',
              title: 'Meny-ID (fallback)',
              type: 'string',
              options: {
                list: [
                  { title: 'Om oss', value: 'about' },
                  { title: 'Spesialister', value: 'specialists' },
                  { title: 'Priser', value: 'pricing' },
                  { title: 'Forsikring', value: 'insurance' },
                  { title: 'Aktuelt', value: 'news' },
                ],
              },
            },
            {
              name: 'path',
              title: 'Lenke',
              type: 'internationalizedArrayString',
              description:
                'Synkroniseres automatisk fra sidens URL-slug ved publisering når Meny-ID er satt.',
              validation: (Rule: any) => Rule.required(),
              readOnly: ({ parent }: { parent?: { navId?: string } }) =>
                Boolean(
                  parent?.navId &&
                    ['about', 'specialists', 'pricing', 'insurance', 'news'].includes(
                      parent.navId,
                    ),
                ),
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'path' },
            prepare({ title, subtitle }: { title?: unknown; subtitle?: unknown }) {
              const pathStr =
                typeof subtitle === 'string'
                  ? subtitle
                  : pickNo(subtitle)
              return { title: pickNo(title) || 'Footer-lenke', subtitle: pathStr }
            },
          },
        },
      ],
    },

    // ── Social Media ──
    {
      name: 'socialMedia',
      title: 'Sosiale medier',
      type: 'object',
      group: 'social',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'twitter',
          title: 'Twitter / X URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
        {
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
          validation: (Rule: any) => Rule.uri({ allowRelative: false, scheme: ['https'] }),
        },
      ],
    },

    // ── 404 Not Found Page ──
    {
      name: 'notFoundTitle',
      title: 'Overskrift',
      type: 'string',
      group: 'notFound',
      description: 'Overskrift på 404-siden',
      initialValue: 'Siden ble ikke funnet',
    },
    {
      name: 'notFoundText',
      title: 'Brødtekst',
      type: 'text',
      group: 'notFound',
      description: 'Forklarende tekst på 404-siden',
      initialValue: 'Beklager, vi finner ikke siden du leter etter. Den kan ha blitt flyttet eller slettet.',
    },
    {
      name: 'notFoundImage',
      title: 'Bilde',
      type: 'image',
      group: 'notFound',
      description: 'Valgfritt bilde som vises på 404-siden',
      options: { hotspot: true },
    },
    {
      name: 'notFoundCtaLabel',
      title: 'Knappetekst',
      type: 'string',
      group: 'notFound',
      initialValue: 'Tilbake til forsiden',
    },
    {
      name: 'notFoundCtaPath',
      title: 'Knappelenke',
      type: 'string',
      group: 'notFound',
      initialValue: '/',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
