/**
 * Factory for Insurance / CTA Shared Section collapsed-card previews.
 */
import type {PreviewProps} from 'sanity'
import {PageSectionCollectionBandPreview} from '../sanity/components/PageSectionCollectionBandPreview'
import {pageSectionCollectionBandPreviewFromCollection} from './studioPreview'

type RefField = 'insuranceCollection' | 'ctaCollection'

type Selection = {
  legacyTitle?: unknown
  collectionRef?: string
  collectionInternalName?: string
  collectionTitle?: unknown
}

export function createPageSectionCollectionBandPreview(config: {
  refField: RefField
  bandTypeLabel: string
  legacyFallback: string
}) {
  function CollectionBandPreview(props: PreviewProps) {
    return (
      <PageSectionCollectionBandPreview
        {...props}
        bandTypeLabel={config.bandTypeLabel}
        legacyFallback={config.legacyFallback}
      />
    )
  }

  return {
    select: {
      legacyTitle: 'title',
      collectionRef: `${config.refField}._ref`,
      collectionInternalName: `${config.refField}.internalName`,
      collectionTitle: `${config.refField}.title`,
    },
    prepare(selection: Selection) {
      const isLinked = Boolean(
        selection.collectionRef?.trim() ||
          selection.collectionInternalName?.trim(),
      )

      if (
        isLinked &&
        (selection.collectionInternalName?.trim() || selection.collectionTitle)
      ) {
        return pageSectionCollectionBandPreviewFromCollection({
          collection: {
            internalName: selection.collectionInternalName,
            title: selection.collectionTitle,
          },
          legacyTitle: selection.legacyTitle,
          bandTypeLabel: config.bandTypeLabel,
          legacyFallback: config.legacyFallback,
        })
      }

      if (!isLinked) {
        return pageSectionCollectionBandPreviewFromCollection({
          collection: null,
          legacyTitle: selection.legacyTitle,
          bandTypeLabel: config.bandTypeLabel,
          legacyFallback: config.legacyFallback,
        })
      }

      // Linked but only `_ref` in stored value — component fetches collection doc.
      return {
        title: config.legacyFallback,
        subtitle: config.bandTypeLabel,
        ...selection,
        bandTypeLabel: config.bandTypeLabel,
        legacyFallback: config.legacyFallback,
      }
    },
    component: CollectionBandPreview,
  }
}
