/**
 * Privacy Policy — page editor config (Homepage framework).
 * No shared pageSections bands on this page.
 */
import {DocumentTextIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument} from '../documentMeta'
import {heroSection, i18nPreview, seoSection} from '../sharedSectionBuilders'

const PRIVACY_HERO_FIELDS = [
  'breadcrumbHome',
  'title',
  'slug',
  'subtitle',
  'heroMedia',
  'primaryCtaLabel',
  'primaryCtaPath',
]

export const privacyPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Privacy Policy',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      ...heroSection(PRIVACY_HERO_FIELDS),
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title = i18nPreview(document.title)
          const subtitle = i18nPreview(document.subtitle)
          const heroMedia = document.heroMedia as {image?: unknown; videoFile?: unknown; videoUrl?: string} | undefined
          const hasMedia = Boolean(
            heroMedia?.image ||
              heroMedia?.videoFile ||
              (typeof heroMedia?.videoUrl === 'string' && heroMedia.videoUrl.trim()),
          )
          if (title || subtitle || hasMedia) return ['Configured']
          return ['Empty']
        }),
    },
    {
      id: 'content',
      title: 'Content',
      description: 'Privacy policy body and empty-state message.',
      icon: DocumentTextIcon,
      fields: ['body', 'emptyMessage'],
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const body = document.body
          if (body === undefined || body === null) return ['Empty']
          if (Array.isArray(body) && body.length === 0) return ['Empty']
          return ['Configured']
        }),
    },
    seoSection(),
  ],
})

