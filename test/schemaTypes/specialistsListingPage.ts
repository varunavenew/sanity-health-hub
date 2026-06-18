// Schema: Specialists directory (/spesialister) — hero + SEO (singleton)
import { SpecialistIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'

export default {
  name: 'specialistsListingPage',
  title: 'Spesialistoversikt',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'heroEyebrow',
      title: 'Hero – eyebrow',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Vårt team" / "Our team".',
    },
    {
      name: 'heroTitle',
      title: 'Hero – tittel',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('heroTitle', {
      description: 'URL-sti uten locale, f.eks. /spesialister (NO) og /specialists (EN).',
    }),
    {
      name: 'heroDescription',
      title: 'Hero – beskrivelse',
      type: 'internationalizedArrayText',
    },
    {
      name: 'countLabel',
      title: 'Antall spesialister (etikett)',
      type: 'internationalizedArrayString',
      description:
        'Vises over rutenettet. Bruk {count} for antall (f.eks. "{count} spesialister").',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel (metaTitle) og meta-beskrivelse (metaDescription) for /spesialister',
    },
  ],
  preview: {
    select: { title: 'heroTitle' },
    prepare({ title }: { title?: unknown }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: { language?: string; _key?: string; value?: string }) => (t.language || t._key) === 'no')?.value ||
            (title[0] as { value?: string })?.value ||
            'Spesialistoversikt')
        : (title || 'Spesialistoversikt')
      return { title: titleStr }
    },
  },
}
