// Schema: SEO object (reusable across all pages)
// Localized via sanity-plugin-internationalized-array.
// Frontend hooks (`useSanity.ts`) auto-resolve i18n entries to the active
// language, so consumers continue to read `seo.metaTitle` / `seo.metaDescription`
// as plain strings.
import { SEOIcon } from './icons'

export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SEOIcon,
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta-tittel',
      type: 'internationalizedArrayString',
      description: 'Maks 60 tegn per språk',
    },
    {
      name: 'metaDescription',
      title: 'Meta-beskrivelse',
      type: 'internationalizedArrayText',
      description: 'Maks 160 tegn per språk',
    },
    {
      name: 'ogImage',
      title: 'OG-bilde (deling)',
      type: 'image',
    },
    {
      name: 'noIndex',
      title: 'Skjul fra søkemotorer',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
