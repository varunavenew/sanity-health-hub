import {useCallback} from 'react'
import {useToast} from '@sanity/ui'
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type SanityClient,
} from 'sanity'
import {
  applyTreatmentChanges,
  fetchLinkState,
  pendingTreatmentChanges,
  publishedRefIds,
  resolveSelf,
  sameIdSet,
  treatmentsShowingSpecialist,
  type SpecialistLike,
} from '../lib/specialist-treatment-links'

type SpecialistDoc = SpecialistLike & {
  appearingOnTreatments?: unknown
  treatmentsBaseline?: string[]
}

async function waitForPublished(client: SanityClient, id: string): Promise<boolean> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const doc = await client.getDocument(id)
    if (doc) return true
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return false
}

/**
 * Wrap specialist Publish: changes made in the specialist's Treatments field
 * are written to the published treatment pages when the specialist is
 * published — not before.
 */
export function createPublishSpecialistTreatments(
  OriginalPublish: DocumentActionComponent,
): DocumentActionComponent {
  const PublishSpecialistTreatments: DocumentActionComponent = (props) => {
    const original = OriginalPublish(props)
    const client = useClient({apiVersion: '2024-01-01'}).withConfig({useCdn: false})
    const {patch} = useDocumentOperation(props.id, props.type)
    const toast = useToast()

    const onHandle = useCallback(async () => {
      const draft = props.draft as SpecialistDoc | null
      const published = props.published as (SpecialistDoc & {_rev?: string}) | null
      if (!draft) {
        await original?.onHandle?.()
        return
      }

      const desired = publishedRefIds(draft.appearingOnTreatments)
      const baseline = Array.isArray(draft.treatmentsBaseline)
        ? publishedRefIds(draft.treatmentsBaseline)
        : publishedRefIds(published?.appearingOnTreatments)

      if (sameIdSet(desired, baseline)) {
        await original?.onHandle?.()
        return
      }

      let changes: {add: string[]; remove: string[]}
      let self: Awaited<ReturnType<typeof resolveSelf>>
      try {
        const [state, resolved] = await Promise.all([
          fetchLinkState(client),
          resolveSelf(client, {...draft, _id: props.id}),
        ])
        self = resolved
        changes = pendingTreatmentChanges({
          desired,
          baseline,
          showing: treatmentsShowingSpecialist(state, resolved),
        })
      } catch (error: unknown) {
        toast.push({
          status: 'error',
          title: 'Not published',
          description: `Could not check the treatment pages: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        })
        return
      }

      const run = () => applyTreatmentChanges({client, self, ...changes})
      const report = (result: Awaited<ReturnType<typeof run>>) => {
        if (result.added.length || result.removed.length) {
          const parts = [
            result.added.length ? `now shows on ${result.added.join(', ')}` : '',
            result.removed.length ? `removed from ${result.removed.join(', ')}` : '',
          ].filter(Boolean)
          toast.push({
            status: 'success',
            title: 'Treatment pages updated',
            description: `${self.name} ${parts.join('; ')}.`,
          })
        }
        if (result.failed.length) {
          toast.push({
            status: 'error',
            title: 'Some treatment pages were not updated',
            description: result.failed.map((row) => `${row.title}: ${row.error}`).join('\n'),
          })
        }
      }
      // Failed ones stay out of the baseline, so the next publish retries them.
      const baselineAfter = (result: Awaited<ReturnType<typeof run>>) => {
        const failedAdd = new Set(result.failed.filter((r) => r.action === 'add').map((r) => r.id))
        const failedRemove = result.failed.filter((r) => r.action === 'remove').map((r) => r.id)
        return [...desired.filter((id) => !failedAdd.has(id)), ...failedRemove]
      }

      if (published) {
        // Live treatment pages reference the published specialist, which exists.
        const result = await run()
        report(result)
        patch.execute([{set: {treatmentsBaseline: baselineAfter(result)}}])
        await original?.onHandle?.()
        return
      }

      // New specialist: publish first so treatment pages can reference it.
      patch.execute([{set: {treatmentsBaseline: desired}}])
      await original?.onHandle?.()
      const ready = await waitForPublished(client, props.id)
      if (!ready) {
        toast.push({
          status: 'error',
          title: 'Treatment pages not updated',
          description: 'Publishing took too long. Publish the specialist again to update the treatment pages.',
        })
        return
      }
      const result = await run()
      report(result)
      if (result.failed.length) {
        await client
          .patch(props.id)
          .set({treatmentsBaseline: baselineAfter(result)})
          .commit()
          .catch((error: unknown) => console.error('[publish-specialist-treatments]', error))
      }
    }, [client, original, patch, props.draft, props.id, props.published, toast])

    if (!original) return null
    return {...original, onHandle}
  }
  PublishSpecialistTreatments.action = 'publish'
  return PublishSpecialistTreatments
}
