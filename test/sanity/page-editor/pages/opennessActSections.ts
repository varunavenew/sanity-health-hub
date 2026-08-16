/**
 * Transparency Act 2025 — page editor config.
 */
import {DocumentTextIcon} from '@sanity/icons'
import type {PageEditorConfig} from '../types'
import {definePageEditorConfig} from '../SectionRegistry'
import {chipsFromDocument} from '../documentMeta'
import {heroSection, i18nPreview, seoSection} from '../sharedSectionBuilders'

const OPENNESS_HERO_FIELDS = [
  'breadcrumbHome',
  'title',
  'slug',
  'subtitle',
]

export const opennessActPageEditorConfig: PageEditorConfig = definePageEditorConfig({
  title: 'Transparency Act 2025',
  subtitle: 'Choose a section to edit.',
  defaultSectionId: 'hero',
  sections: [
    {
      ...heroSection(OPENNESS_HERO_FIELDS),
      getChips: (doc) =>
        chipsFromDocument(doc, Boolean(doc), (document) => {
          const title = i18nPreview(document.title)
          const subtitle = i18nPreview(document.subtitle)
          if (title || subtitle) return ['Configured']
          return ['Empty']
        }),
    },
    {
      id: 'content',
      title: 'Content',
      description: 'Main page body, FAQ toggle, and empty-state message.',
      icon: DocumentTextIcon,
      fields: ['body', 'emptyMessage', 'showPracticalInfoSection'],
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
