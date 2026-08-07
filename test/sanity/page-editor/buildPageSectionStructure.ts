/**
 * Structure Builder helpers for page-section navigation panes.
 * Reusable: any page config can open section cards → same-document edit panes.
 *
 * Edit view uses native `S.view.form()` so Sanity owns FormBuilder/FormProvider.
 * Section filtering happens in document `components.input` (ObjectInputMembers).
 *
 * Do NOT attach a nested `.child()` that builds editors from `params.type`
 * without a guaranteed type — that throws SerializeError and crashes Structure
 * (e.g. stale URLs like `…;category-*-root;insurance`).
 * Open collection/references via intent links (OpenCollectionButton) instead.
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

export type BuildDocumentPageSectionChildOptions = {
  documentId: string
  schemaType: string
  config: PageEditorConfig
  title?: string
  withLocalePreviews?: boolean
}

/**
 * Section list → filtered document panes for a single document id.
 * Used by fixed singletons and by documentTypeList `.child((id) => …)`.
 */
export function buildDocumentPageSectionChild(
  S: StructureBuilder,
  options: BuildDocumentPageSectionChildOptions,
) {
  const {
    documentId,
    schemaType,
    config,
    title = config.title,
    withLocalePreviews = true,
  } = options

  const publishedId = documentId.replace(/^drafts\./, '')
  const PreviewNo = createLocalePreviewPane({locale: 'no', schemaType})
  const PreviewEn = createLocalePreviewPane({locale: 'en', schemaType})

  return S.component(PageSectionListPane)
    .id(`${publishedId}-sections`)
    .title(title)
    .options({
      documentId: publishedId,
      schemaType,
      config,
    })
    .canHandleIntent((intentName, params) =>
      Boolean(
        intentName === 'edit' &&
          params?.type === schemaType &&
          params?.id === publishedId,
      ),
    )
    .child((sectionId: string) => {
      const section = config.sections.find((entry) => entry.id === sectionId)

      return S.document()
        .schemaType(schemaType)
        .documentId(publishedId)
        .id(`${publishedId}-section-${sectionId}`)
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
    })
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

  let item = S.listItem().title(title).id(`${documentId}-root`).schemaType(schemaType)
  if (icon) {
    item = item.icon(icon)
  }

  return item.child(
    buildDocumentPageSectionChild(S, {
      documentId,
      schemaType,
      config,
      title,
      withLocalePreviews,
    }),
  )
}
