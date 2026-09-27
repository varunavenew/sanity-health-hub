/**
 * Specialist → Treatments. Native array-of-references UI (same as Treatment categories).
 *
 * Shows the published treatments whose Specialists band shows this specialist.
 * Adding or removing a treatment here is only saved on the specialist draft;
 * the treatment pages are updated when the specialist is published
 * (see actions/publishSpecialistTreatments). A panel lists what will change.
 *
 * While the editor has not changed the list (value == treatmentsBaseline), it
 * is kept in step with the treatments, e.g. after a treatment page added them —
 * on the draft if there is one, otherwise on the published specialist.
 */
import {useEffect, useMemo, useRef, useState} from 'react'
import {Card, Stack, Text} from '@sanity/ui'
import {type ArrayOfObjectsInputProps, useClient, useDocumentOperation, useFormValue} from 'sanity'
import {publishedDocumentId} from '../lib/resolve-page-section-specialists'
import {
  fetchLinkState,
  pendingTreatmentChanges,
  publishedRefIds,
  resolveSelf,
  sameIdSet,
  treatmentItemKey,
  treatmentTitle,
  treatmentsShowingSpecialist,
  type LinkState,
  type RefRow,
} from '../lib/specialist-treatment-links'
import type {StudioSpecialist} from '../lib/resolve-page-section-specialists'

export function SpecialistTreatmentsInput(props: ArrayOfObjectsInputProps) {
  const {value, renderDefault, readOnly} = props
  const client = useClient({apiVersion: '2024-01-01'}).withConfig({useCdn: false})
  const specialistIdRaw = (useFormValue(['_id']) as string | undefined) || ''
  const name = useFormValue(['name']) as string | undefined
  const slug = useFormValue(['slug']) as unknown
  const categories = useFormValue(['categories']) as Array<{_ref?: string}> | undefined
  const baselineValue = useFormValue(['treatmentsBaseline']) as string[] | undefined
  const specialistId = publishedDocumentId(specialistIdRaw)
  const {patch} = useDocumentOperation(specialistId, 'specialist')
  const hasDraft = specialistIdRaw.startsWith('drafts.')

  const desired = useMemo(() => publishedRefIds(value), [value])

  const [state, setState] = useState<LinkState | null>(null)
  const [self, setSelf] = useState<StudioSpecialist | null>(null)
  const [publishedList, setPublishedList] = useState<string[] | null>(null)

  // Load the treatments, and reload when one is published (e.g. a treatment
  // page added or removed this specialist while this form is open).
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const load = () =>
      Promise.all([
        fetchLinkState(client),
        client.fetch<string[] | null>(`*[_id == $id][0].appearingOnTreatments[]._ref`, {
          id: specialistId,
        }),
      ])
        .then(([linkState, published]) => {
          if (cancelled) return
          setState(linkState)
          setPublishedList(publishedRefIds(published ?? []))
        })
        .catch(() => {
          // Keep the stored list as-is when loading fails.
        })
    load()
    const subscription = client
      .listen(
        `*[_type == "treatment" && !(_id in path("drafts.**"))]`,
        {},
        {events: ['mutation'], includeResult: false, visibility: 'query'},
      )
      .subscribe(() => {
        clearTimeout(timer)
        timer = setTimeout(load, 800)
      })
    return () => {
      cancelled = true
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [client, specialistId])

  const categoryKey = (categories ?? []).map((row) => row?._ref).join('|')
  useEffect(() => {
    let cancelled = false
    resolveSelf(client, {
      _id: specialistId,
      name,
      slug,
      categories: categoryKey ? categoryKey.split('|').map((_ref) => ({_ref})) : [],
    })
      .then((resolved) => {
        if (!cancelled) setSelf(resolved)
      })
      .catch((error: unknown) => console.error('[specialist-treatments]', error))
    return () => {
      cancelled = true
    }
  }, [categoryKey, client, name, slug, specialistId])

  const showing = useMemo(
    () => (state && self ? treatmentsShowingSpecialist(state, self) : null),
    [self, state],
  )

  // Older documents have no baseline yet: the published list is the last sync.
  const baseline = useMemo(
    () => (Array.isArray(baselineValue) ? publishedRefIds(baselineValue) : publishedList),
    [baselineValue, publishedList],
  )

  const untouched = baseline !== null && sameIdSet(desired, baseline)
  const syncedRef = useRef<string>('')

  // Keep an unchanged list in step with the treatments, e.g. after a treatment
  // page added this specialist. On a draft this is a normal form patch. On a
  // published specialist without a draft, patch the published document
  // directly so opening it never creates a draft by itself.
  const isVersion = specialistIdRaw.startsWith('versions.')
  useEffect(() => {
    if (!showing || !untouched || readOnly || isVersion || !specialistId) return
    if (sameIdSet(showing, desired) && Array.isArray(baselineValue)) return
    const signature = `${hasDraft ? 'draft' : 'published'}:${showing.join('|')}`
    if (syncedRef.current === signature) return
    syncedRef.current = signature

    const keyById = new Map(
      ((Array.isArray(value) ? value : []) as RefRow[])
        .filter((row) => row?._ref)
        .map((row) => [publishedDocumentId(row._ref || ''), row._key]),
    )
    const ordered = [
      ...desired.filter((id) => showing.includes(id)),
      ...showing.filter((id) => !desired.includes(id)),
    ]
    const fields = {
      appearingOnTreatments: ordered.map((id) => ({
        _type: 'reference',
        _weak: true,
        _key: keyById.get(id) || treatmentItemKey(id),
        _ref: id,
      })),
      treatmentsBaseline: ordered,
    }

    if (hasDraft) {
      patch.execute([{set: fields}])
      return
    }
    client
      .patch(specialistId)
      .set(fields)
      .commit()
      .catch((error: unknown) => {
        syncedRef.current = ''
        console.error('[specialist-treatments]', error)
      })
  }, [baselineValue, client, desired, hasDraft, isVersion, patch, readOnly, showing, specialistId, untouched, value])

  const pending = useMemo(() => {
    if (!showing || baseline === null) return null
    return pendingTreatmentChanges({desired, baseline, showing})
  }, [baseline, desired, showing])

  const titleOf = (id: string) =>
    treatmentTitle(state?.treatments.find((row) => publishedDocumentId(row._id) === id))

  const hasPending = Boolean(pending && (pending.add.length || pending.remove.length))

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {hasPending && pending ? (
        <Card padding={3} radius={2} tone="caution" border>
          <Stack space={2}>
            <Text size={1} weight="medium">
              Changes when you publish this specialist
            </Text>
            {pending.add.length ? (
              <Text size={1}>Will show on: {pending.add.map(titleOf).join(', ')}</Text>
            ) : null}
            {pending.remove.length ? (
              <Text size={1}>Will be removed from: {pending.remove.map(titleOf).join(', ')}</Text>
            ) : null}
            <Text size={1} muted>
              The treatment pages are updated on publish. Nothing changes on the website before that.
            </Text>
          </Stack>
        </Card>
      ) : null}
    </Stack>
  )
}
