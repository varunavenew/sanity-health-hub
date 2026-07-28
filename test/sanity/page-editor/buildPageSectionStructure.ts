/**
 * Structure Builder helpers for page-section navigation panes.
 * Reusable: any page config can open section cards → same-document edit panes.
 *
 * Edit view uses native `S.view.form()` so Sanity owns FormBuilder/FormProvider.
 * Section filtering happens in document `components.input` (ObjectInputMembers).
 */
import type {ComponentType} from 'react'
import type {StructureBuilder} from 'sanity/structure'
import type {PageEditorConfig} from './types'
import {PageSectionListPane} from './components/PageSectionListPane'
import {EnglishFlagIcon, NorwegianFlagIcon} from '../components/FlagIcons'
import {createLocalePreviewPane} from '../components/LocalePreviewIframe'

export type BuildPageSectionStructureOptions = {
  title: string
  icon?: ComponentType
  documentId: string
  schemaType: string
  config: PageEditorConfig
  /** Include locale preview tabs on section document panes. */
  withLocalePreviews?: boolean
}

export function buildPageSectionListItem(S: StructureBuilder, options: BuildPageSectionStructureOptions) {
  const {
    title,
    icon,
    documentId,
    schemaType,
    config,
    withLocalePreviews = true,
  } = options

  const PreviewNo = createLocalePreviewPane({locale: 'no', schemaType})
  const PreviewEn = createLocalePreviewPane({locale: 'en', schemaType})

  let item = S.listItem().title(title).id(`${documentId}-root`).schemaType(schemaType)
  if (icon) {
    item = item.icon(icon)
  }

  return item.child(
    S.component(PageSectionListPane)
      .id(`${documentId}-sections`)
      .title(title)
      .options({
        documentId,
        schemaType,
        config,
      })
      .canHandleIntent((intentName, params) =>
        Boolean(intentName === 'edit' && params?.type === schemaType && params?.id === documentId),
      )
      .child((sectionId: string) => {
        const section = config.sections.find((entry) => entry.id === sectionId)

        return S.document()
          .schemaType(schemaType)
          .documentId(documentId)
          .id(`${documentId}-section-${sectionId}`)
          .title(section?.title || sectionId)
          .views([
            S.view.form().id('edit').title('Edit'),
            ...(withLocalePreviews
              ? [
                  S.view.component(PreviewNo).id('preview-no').title('View').icon(NorwegianFlagIcon),
                  S.view.component(PreviewEn).id('preview-en').title('View').icon(EnglishFlagIcon),
                ]
              : []),
          ])
          .child((childId, options) =>
            S.editor({
              id: childId,
              options: {
                id: childId,
                type: options?.params?.type,
                template: options?.params?.template,
              },
            }),
          )
      }),
  )
}

