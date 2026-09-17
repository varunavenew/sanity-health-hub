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

function readHideFromWebsite(
  draft: Record<string, unknown> | null | undefined,
  published: Record<string, unknown> | null | undefined,
): boolean {
  if (draft && 'hideFromWebsite' in draft) {
    return draft.hideFromWebsite === true
  }
  return published?.hideFromWebsite === true
}

/**
 * Treatment publish: when "Hide from website" is enabled, strip CMS listing refs
 * then publish with hideFromWebsite=true so the page disappears on the site.
 */
export const PublishTreatment: DocumentActionComponent = (props) => {
  const {publish} = useDocumentOperation(props.id, props.type)
  const client = useClient({apiVersion: '2024-01-01'}).withConfig({useCdn: false})
  const toast = useToast()
  const hideFromWebsite = readHideFromWebsite(
    props.draft as Record<string, unknown> | null | undefined,
    props.published as Record<string, unknown> | null | undefined,
  )

  const onHandle = useCallback(async () => {
    const baseId = props.id.replace(/^drafts\./, '')
    const draftId = `drafts.${baseId}`

    if (hideFromWebsite) {
      try {
        const cleanup = await removeTreatmentReferences(client, baseId)
        await client.patch(draftId).set({hideFromWebsite: true}).commit()
        await publish.execute()
        toast.push({
          status: 'success',
          title: 'Hidden from website',
          description: `Removed from ${summarizeReferenceCleanup(cleanup)}. The treatment is hidden on the public site.`,
        })
      } catch (err) {
        console.error('[publishTreatment]', err)
        toast.push({
          status: 'error',
          title: 'Could not hide treatment',
          description: err instanceof Error ? err.message : 'Unknown error',
        })
      }

      props.onComplete()
      return
    }

    try {
      await client.patch(draftId).set({hideFromWebsite: false}).commit()
    } catch {
      // Draft may not exist yet — publish will create it.
    }

    await publish.execute()
    props.onComplete()
  }, [client, hideFromWebsite, props, publish, toast])

  return {
    label: hideFromWebsite ? 'Hide from website' : 'Publish',
    tone: hideFromWebsite ? 'caution' : 'positive',
    disabled: publish.disabled !== false,
    onHandle,
  }
}

PublishTreatment.action = 'publish'
