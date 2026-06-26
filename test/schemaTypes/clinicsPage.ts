// Schema: Clinics listing page (/klinikker) — hero + SEO (singleton)
import { ClinicIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { pageSectionsField } from './pageSections'

export default {
  name: 'clinicsPage',
  title: 'Klinikker-side',
  type: 'document',
  icon: ClinicIcon,
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      description:
        'Vises over hovedtittelen. Bruk {count} for antall klinikker (f.eks. "{count} klinikker · Ingen henvisning · Kort ventetid").',
    },
    {
      name: 'heroTitle',
      title: 'Hero – tittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL-sti uten locale, f.eks. /klinikker (NO) og /clinics (EN).',
    }),
    {
      name: 'heroDescription',
      title: 'Hero – beskrivelse',
      type: 'internationalizedArrayText',
    },
    {
      name: 'heroImage',
      title: 'Hero – bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'primaryCtaLabel',
      title: 'Primær CTA – tekst',
      type: 'internationalizedArrayString',
    },
    {
      name: 'primaryCtaPath',
      title: 'Primær CTA – lenke',
      type: 'string',
      description: 'Intern sti uten locale, f.eks. /booking',
    },
    {
      name: 'secondaryCtaLabel',
      title: 'Sekundær CTA – tekst',
      type: 'internationalizedArrayString',
    },
    {
      name: 'secondaryCtaPath',
      title: 'Sekundær CTA – lenke',
      type: 'string',
      description: 'Intern sti uten locale, f.eks. /kontakt',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel og meta-beskrivelse for klinikkoversikten (/klinikker)',
    },
    pageSectionsField,
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: { language?: string; _key?: string; value?: string }) => (t.language || t._key) === 'no')?.value ||
            (title[0] as { value?: string })?.value ||
            'Klinikker')
        : (title || 'Klinikker')
      return { title: titleStr }
    },
  },
}
