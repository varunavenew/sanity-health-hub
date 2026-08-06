/**
 * Specialist Delete — wraps Sanity's default Delete action.
 *
 * Before deleting: cleans all incoming strong references via the reference
 * graph (drafts + published). If cleanup would violate validation (e.g.
 * relatedSpecialistsSection.specialists min 1), abort with an error toast
 * and do not delete.
 *
 * UX stays native: same Delete menu item + confirm dialog. No wizard.
 */
import {useCallback, useState} from 'react'
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'
import {TrashIcon} from '@sanity/icons'
import {useToast} from '@sanity/ui'
import {
  cleanupSpecialistReferences,
  waitUntilNoIncomingReferences,
} from '../lib/specialist-safe-delete'

function publishedId(id: string): string {
  return id.replace(/^drafts\./, '')
}

/**
 * Factory: wrap the default Delete action for specialists only.
 * Keeps native confirm dialog; runs cleanup on confirm before delete.execute().
 */
export function createSpecialistDeleteAction(
  OriginalDelete: DocumentActionComponent,
): DocumentActionComponent {
  const SpecialistDeleteAction: DocumentActionComponent = (
    props: DocumentActionProps,
  ) => {
    const original = OriginalDelete(props)
    const {delete: deleteOp} = useDocumentOperation(props.id, props.type)
    const client = useClient({apiVersion: '2024-01-01'})
    const toast = useToast()
    const [busy, setBusy] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const specialistName =
      (typeof (props.draft || props.published)?.name === 'string' &&
        String((props.draft || props.published)?.name)) ||
      publishedId(props.id)

    const runCleanupAndDelete = useCallback(async () => {
      setBusy(true)
      try {
        // 1) Patch drafts + published (single tx, visibility sync + index wait)
        await cleanupSpecialistReferences(client, props.id)
        // 2) Re-confirm reference index is empty on this dataset before delete
        //    (production can lag briefly after multi-doc patches)
        await waitUntilNoIncomingReferences(client, props.id)
        // 3) Native delete — same DocumentOperation as default Delete
        deleteOp.execute()
        // 4) Do not toast / dismiss until both draft + published are gone
        const baseId = publishedId(props.id)
        const draftId = `drafts.${baseId}`
        const deadline = Date.now() + 15000
        for (;;) {
          const stillThere = await client.fetch(
            `count(*[_id in [$id, $draftId]])`,
            {id: baseId, draftId},
          )
          if (stillThere === 0) break
          if (Date.now() >= deadline) {
            throw new Error(
              'Reference cleanup finished, but the specialist documents were not deleted in time. Retry delete.',
            )
          }
          await new Promise((r) => setTimeout(r, 250))
        }
        toast.push({
          status: 'success',
          title: 'Specialist deleted',
          description:
            'The specialist was removed from all related documents and deleted successfully.',
        })
        setConfirmOpen(false)
        props.onComplete()
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[specialist-delete]', err)
        toast.push({
          status: 'error',
          title: 'Could not delete specialist',
          description: message,
          duration: 12000,
        })
        // Abort — do not treat as success if cleanup / wait / delete failed
        setConfirmOpen(false)
        props.onComplete()
      } finally {
        setBusy(false)
      }
    }, [client, props, deleteOp, toast])

    if (!original) return null

    return {
      label: original.label || 'Delete',
      icon: original.icon || TrashIcon,
      tone: original.tone || 'critical',
      title: original.title,
      disabled: Boolean(original.disabled) || busy || Boolean(deleteOp.disabled),
      shortcut: original.shortcut,
      onHandle: () => {
        setConfirmOpen(true)
      },
      dialog: confirmOpen
        ? {
            type: 'confirm',
            tone: 'critical',
            message: busy
              ? 'Removing specialist from related documents…'
              : `Delete “${specialistName}”? Related documents will be updated automatically first.`,
            onCancel: () => {
              setConfirmOpen(false)
              props.onComplete()
            },
            onConfirm: () => {
              void runCleanupAndDelete()
            },
          }
        : undefined,
    }
  }

  SpecialistDeleteAction.action = 'delete'
  return SpecialistDeleteAction
}

export default createSpecialistDeleteAction
