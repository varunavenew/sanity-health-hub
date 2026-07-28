/**
 * Shared Section band preview (Insurance / Booking CTA).
 *
 * Array-item previews cannot always dereference `collection.internalName` via
 * preview.select alone. This component resolves the linked collection by `_ref`
 * when needed so collapsed cards always show the English identifier.
 */
import {useEffect, useMemo, useState} from 'react'
import {type PreviewProps, useClient} from 'sanity'
import {pageSectionCollectionBandPreviewFromCollection} from '../../schemaTypes/studioPreview'

type CollectionDoc = {
  internalName?: string
  title?: unknown
  name?: string
}

export type PageSectionCollectionBandPreviewProps = PreviewProps & {
  legacyTitle?: unknown
  collectionRef?: string
  collectionInternalName?: string
  collectionTitle?: unknown
  bandTypeLabel: string
  legacyFallback: string
}

export function PageSectionCollectionBandPreview(
  props: PageSectionCollectionBandPreviewProps,
) {
  const {
    legacyTitle,
    collectionRef,
    collectionInternalName,
    collectionTitle,
    bandTypeLabel,
    legacyFallback,
    renderDefault,
  } = props

  const client = useClient({apiVersion: '2024-01-01'})
  const [fetched, setFetched] = useState<CollectionDoc | null | undefined>(
    undefined,
  )

  const isLinked = Boolean(collectionRef?.trim() || collectionInternalName?.trim())
  const hasSyncCollection = Boolean(
    collectionInternalName?.trim() || collectionTitle,
  )

  useEffect(() => {
    if (!isLinked) {
      setFetched(null)
      return
    }
    if (hasSyncCollection) {
      setFetched({
        internalName: collectionInternalName,
        title: collectionTitle,
      })
      return
    }
    if (!collectionRef) {
      setFetched(null)
      return
    }

    let cancelled = false
    client
      .fetch<CollectionDoc | null>(
        `*[_id == $id][0]{internalName, title, name}`,
        {id: collectionRef},
      )
      .then((doc) => {
        if (!cancelled) setFetched(doc ?? null)
      })
      .catch(() => {
        if (!cancelled) setFetched(null)
      })

    return () => {
      cancelled = true
    }
  }, [
    client,
    collectionInternalName,
    collectionRef,
    collectionTitle,
    hasSyncCollection,
    isLinked,
  ])

  const resolved = useMemo(() => {
    if (isLinked && fetched === undefined) {
      return {
        title: legacyFallback,
        subtitle: bandTypeLabel,
      }
    }

    return pageSectionCollectionBandPreviewFromCollection({
      collection: isLinked ? fetched ?? null : null,
      legacyTitle,
      bandTypeLabel,
      legacyFallback,
    })
  }, [
    bandTypeLabel,
    fetched,
    isLinked,
    legacyFallback,
    legacyTitle,
  ])

  return renderDefault({
    ...props,
    title: resolved.title,
    subtitle: resolved.subtitle,
  })
}
