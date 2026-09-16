import {useCallback} from 'react'
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
} from 'sanity'
import {useToast} from '@sanity/ui'
import {
  removeTreatmentReferences,
  summarizeReferenceCleanup,
} from '../lib/remove-treatment-references'

/**
 * Treatment unpublish: remove CMS listing refs first, then unpublish.
 */
export const UnpublishTreatment: DocumentActionComponent = (props) => {
  const {unpublish} = useDocumentOperation(props.id, props.type)
  const client = useClient({apiVersion: '2024-01-01'}).withConfig({useCdn: false})
  const toast = useToast()

  const onHandle = useCallback(async () => {
    const baseId = props.id.replace(/^drafts\./, '')

    try {
      const cleanup = await removeTreatmentReferences(client, baseId)
      await unpublish.execute()
      toast.push({
        status: 'success',
        title: 'Unpublished',
        description: `Removed from ${summarizeReferenceCleanup(cleanup)} before unpublishing.`,
      })
    } catch (err) {
      console.error('[unpublishTreatment]', err)
      toast.push({
        status: 'error',
        title: 'Could not unpublish treatment',
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }

    props.onComplete()
  }, [client, props, toast, unpublish])

  return {
    label: 'Unpublish',
    disabled: unpublish.disabled !== false,
    onHandle,
  }
}

UnpublishTreatment.action = 'unpublish'
