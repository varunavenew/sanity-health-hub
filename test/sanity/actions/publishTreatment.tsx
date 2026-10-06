import {useCallback} from 'react'
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type SanityClient,
} from 'sanity'
import {useToast} from '@sanity/ui'
import {
  removeTreatmentReferences,
  summarizeReferenceCleanup,
} from '../lib/remove-treatment-references'
import {
  specialistsShownByTreatment,
  syncSpecialistsForTreatment,
} from '../lib/specialist-treatment-links'

async function waitForDraftGone(client: SanityClient, draftId: string): Promise<boolean> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const doc = await client.getDocument(draftId)
    if (!doc) return true
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return false
}

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
 * Otherwise publish, then update the Treatments field of every specialist the
 * Specialists band now shows (or no longer shows).
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

    const before = await specialistsShownByTreatment(client, baseId).catch(() => null)
    await publish.execute()
    props.onComplete()

    if (!(await waitForDraftGone(client, draftId))) {
      toast.push({
        status: 'warning',
        title: 'Specialists not updated',
        description: 'Publishing took too long. Publish the treatment again to update the specialists.',
      })
      return
    }
    try {
      const result = await syncSpecialistsForTreatment({client, treatmentId: baseId, before})
      if (result.added.length || result.removed.length) {
        const parts = [
          result.added.length ? `added to ${result.added.join(', ')}` : '',
          result.removed.length ? `removed from ${result.removed.join(', ')}` : '',
        ].filter(Boolean)
        toast.push({
          status: 'success',
          title: 'Specialists updated',
          description: `Treatment ${parts.join('; ')}.`,
        })
      }
      if (result.failed.length) {
        toast.push({
          status: 'error',
          title: 'Some specialists were not updated',
          description: result.failed.join(', '),
        })
      }
    } catch (err) {
      console.error('[publishTreatment] specialist sync', err)
      toast.push({
        status: 'error',
        title: 'Specialists not updated',
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [client, hideFromWebsite, props, publish, toast])

  return {
    label: hideFromWebsite ? 'Hide from website' : 'Publish',
    tone: hideFromWebsite ? 'caution' : 'positive',
    disabled: publish.disabled !== false,
    onHandle,
  }
}

PublishTreatment.action = 'publish'
