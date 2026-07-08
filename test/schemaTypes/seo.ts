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
      title: 'Meta title',
      type: 'internationalizedArrayString',
      description: 'Max 60 characters per language',
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      type: 'internationalizedArrayText',
      description: 'Max 160 characters per language',
    },
    {
      name: 'ogImage',
      title: 'OG Image (sharing)',
      type: 'image',
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
