/**
 * Section registry helpers — keep page configs declarative and reusable.
 * Shared UI never imports a specific page's sections directly (except factories).
 */
import type {PageEditorConfig, PageSectionDefinition} from './types'

export function definePageSections(
  sections: PageSectionDefinition[],
): PageSectionDefinition[] {
  const ids = new Set<string>()
  for (const section of sections) {
    if (ids.has(section.id)) {
      throw new Error(`Duplicate page editor section id: ${section.id}`)
    }
    ids.add(section.id)
  }
  return sections
}

export function definePageEditorConfig(config: PageEditorConfig): PageEditorConfig {
  return {
    ...config,
    sections: definePageSections(config.sections),
  }
}

export function getSectionById(
  config: PageEditorConfig,
  sectionId: string,
): PageSectionDefinition | undefined {
  return config.sections.find((section) => section.id === sectionId)
}

export function listMappedFieldNames(config: PageEditorConfig): string[] {
  const names = new Set<string>()
  for (const section of config.sections) {
    for (const field of section.fields) names.add(field)
  }
  return [...names]
}
