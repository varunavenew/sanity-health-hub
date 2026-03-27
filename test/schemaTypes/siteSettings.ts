// Schema: Site Settings
// Global settings: navigation menu, contact info, social media, 404 page

export default {
  name: 'siteSettings',
  title: 'Nettstedsinnstillinger',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'general', title: 'Generelt', default: true },
    { name: 'navigation', title: 'Navigasjon' },
    { name: 'social', title: 'Sosiale medier' },
    { name: 'notFound', title: '404-side' },
  ],
  fields: [
    // ── General ──
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
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'path',
              title: 'Lenke',
              type: 'string',
              description: 'Intern sti, f.eks. /priser eller /om-oss',
              validation: (Rule: any) => Rule.required(),
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
          type: 'string',
          initialValue: 'Bestill time',
        },
        {
          name: 'path',
          title: 'Lenke',
          type: 'string',
          initialValue: '/booking',
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
