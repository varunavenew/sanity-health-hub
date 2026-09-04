// Schema: SEO object (reusable across all pages)
// Localized via sanity-plugin-internationalized-array.
// Frontend hooks (`useSanity.ts`) auto-resolve i18n entries to the active
// language, so consumers continue to read `seo.metaTitle` / `seo.metaDescription`
// as plain strings.
import { SEOIcon } from './icons'
import {
  mediaDescription,
  mediaImageOptions,
} from './mediaGuidelines'
import { SeoSharingImageToggleField } from '../sanity/components/SeoAutoHeroPreviewInput'

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
      name: 'useCustomOgImage',
      title: 'Use a different sharing image',
      type: 'boolean',
      initialValue: false,
      description:
        'Off (default): the page hero image is used for Google and social previews. On: upload a custom image below.',
      components: {
        field: SeoSharingImageToggleField,
      },
    },
    {
      name: 'ogImage',
      title: 'Custom sharing image (OG)',
      type: 'image',
      options: mediaImageOptions('seo'),
      description: mediaDescription('seo'),
      hidden: ({ parent }: { parent?: { useCustomOgImage?: boolean } }) =>
        !parent?.useCustomOgImage,
      validation: (Rule: any) =>
        Rule.custom((value: unknown, context: { parent?: { useCustomOgImage?: boolean } }) => {
          if (context.parent?.useCustomOgImage && !value) {
            return 'Upload a sharing image or turn off “Use a different sharing image”.'
          }
          return true
        }),
    },
    {
      name: 'ogImageAlt',
      title: 'Sharing image alt text',
      type: 'internationalizedArrayString',
      description:
        'Describes the sharing image for accessibility and social previews (og:image:alt). Leave empty to use an automatic default from the page (e.g. clinic name, article title).',
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
