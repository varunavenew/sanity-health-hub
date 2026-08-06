/**
 * Specialist delete cleanup — remove-only, reference-graph based.
 *
 * Discovers incoming refs with `references()`, walks each document for
 * exact paths, validates relatedSpecialistsSection.specialists min-1,
 * then patches drafts + published in one transaction (or aborts entirely).
 */
import type {SanityClient} from '@sanity/client'

export type SpecialistRefHit = {
  documentId: string
  documentType: string
  documentTitle: string
  fieldPath: string
  arrayPath: string
  arrayIndex: number
  isRequiredRelatedList: boolean
}

export type CleanupBlockedDoc = {
  documentId: string
  documentTitle: string
  documentType: string
  reason: string
}

export type CleanupPlan = {
  specialistId: string
  docs: Array<{
    documentId: string
    documentType: string
    documentTitle: string
    hits: SpecialistRefHit[]
  }>
  blocked: CleanupBlockedDoc[]
}

type SanityDoc = {
  _id: string
  _type: string
  name?: string
  title?: unknown
  [key: string]: unknown
}

function publishedIdOf(id: string): string {
  return id.replace(/^drafts\./, '')
}

function draftIdOf(id: string): string {
  return `drafts.${publishedIdOf(id)}`
}

export function documentTitle(doc: SanityDoc | null | undefined): string {
  if (!doc) return '(untitled)'
  if (typeof doc.name === 'string' && doc.name.trim()) return doc.name.trim()
  if (typeof doc.title === 'string' && doc.title.trim()) return doc.title.trim()
  if (Array.isArray(doc.title)) {
    const rows = doc.title as Array<{language?: string; value?: string}>
    const no = rows.find((r) => r.language === 'no' || r.language === 'nb')
    const en = rows.find((r) => r.language === 'en')
    const v = no?.value || en?.value || rows[0]?.value
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return doc._id
}

function isReferenceTo(node: unknown, targetId: string): boolean {
  if (!node || typeof node !== 'object') return false
  const ref = node as {_type?: string; _ref?: string}
  return ref._type === 'reference' && ref._ref === targetId
}

function isRequiredRelatedArrayPath(arrayPath: string): boolean {
  return /(^|\.)relatedSpecialistsSection\.specialists$/.test(arrayPath)
}

/** Walk any document structure; no hardcoded page types. */
export function findSpecialistRefHits(
  doc: SanityDoc,
  targetId: string,
): SpecialistRefHit[] {
  const hits: SpecialistRefHit[] = []
  const title = documentTitle(doc)

  const walk = (value: unknown, path: string) => {
    if (value === null || value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemPath = path ? `${path}[${index}]` : `[${index}]`
        if (isReferenceTo(item, targetId)) {
          hits.push({
            documentId: doc._id,
            documentType: doc._type,
            documentTitle: title,
            fieldPath: itemPath,
            arrayPath: path,
            arrayIndex: index,
            isRequiredRelatedList: isRequiredRelatedArrayPath(path),
          })
        } else {
          walk(item, itemPath)
        }
      })
      return
    }

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>
      if (isReferenceTo(obj, targetId) && path) {
        hits.push({
          documentId: doc._id,
          documentType: doc._type,
          documentTitle: title,
          fieldPath: path,
          arrayPath: path,
          arrayIndex: -1,
          isRequiredRelatedList: false,
        })
        return
      }
      for (const [key, child] of Object.entries(obj)) {
        if (key.startsWith('_')) continue
        walk(child, path ? `${path}.${key}` : key)
      }
    }
  }

  walk(doc, '')
  return hits
}

function getAtPath(doc: SanityDoc, path: string): unknown {
  if (!path) return doc
  const parts = path.match(/[^.\[\]]+|\[\d+\]/g) || []
  let cur: unknown = doc
  for (const part of parts) {
    if (cur === null || cur === undefined) return undefined
    if (part.startsWith('[') && part.endsWith(']')) {
      const idx = Number(part.slice(1, -1))
      cur = Array.isArray(cur) ? cur[idx] : undefined
    } else {
      cur = (cur as Record<string, unknown>)[part]
    }
  }
  return cur
}

/**
 * Would removing targetId from this document leave
 * relatedSpecialistsSection.specialists empty?
 */
export function validateRemove(
  doc: SanityDoc,
  targetId: string,
): CleanupBlockedDoc | null {
  const hits = findSpecialistRefHits(doc, targetId)
  const requiredPaths = new Set(
    hits.filter((h) => h.isRequiredRelatedList).map((h) => h.arrayPath),
  )

  for (const arrayPath of requiredPaths) {
    const arr = getAtPath(doc, arrayPath)
    if (!Array.isArray(arr)) continue
    const next = arr.filter((item) => !isReferenceTo(item, targetId))
    if (next.length < 1) {
      return {
        documentId: doc._id,
        documentTitle: documentTitle(doc),
        documentType: doc._type,
        reason:
          'relatedSpecialistsSection.specialists must keep at least 1 specialist',
      }
    }
  }
  return null
}

/** Incoming refs to published id and draft id (same graph on both datasets). */
export async function fetchIncomingReferenceIds(
  client: SanityClient,
  specialistId: string,
): Promise<string[]> {
  const baseId = publishedIdOf(specialistId)
  const draftId = draftIdOf(baseId)
  const referringIds: string[] = await client.fetch(
    `*[references($id) || references($draftId)]._id`,
    {id: baseId, draftId},
  )
  return referringIds
}

/**
 * Wait until the Content Lake reference index reports no inbound refs.
 * `visibility: 'sync'` on patches guarantees document reads, but production
 * delete integrity can still lag the reference index briefly.
 */
export async function waitUntilNoIncomingReferences(
  client: SanityClient,
  specialistId: string,
  options?: {timeoutMs?: number; intervalMs?: number},
): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? 15000
  const intervalMs = options?.intervalMs ?? 250
  const baseId = publishedIdOf(specialistId)
  const started = Date.now()

  for (;;) {
    const remaining = await fetchIncomingReferenceIds(client, baseId)
    const blockers = remaining.filter((id) => publishedIdOf(id) !== baseId)
    if (blockers.length === 0) return
    if (Date.now() - started >= timeoutMs) {
      throw new Error(
        `References were patched, but the dataset still reports inbound references after ${timeoutMs}ms:\n${blockers
          .map((id) => `• ${id}`)
          .join('\n')}\n\nRetry delete in a moment.`,
      )
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
}

/** Build cleanup plan from the reference graph (published + drafts). */
export async function planSpecialistCleanup(
  client: SanityClient,
  specialistId: string,
): Promise<CleanupPlan> {
  const baseId = publishedIdOf(specialistId)
  const draftId = draftIdOf(baseId)
  const referringIds = await fetchIncomingReferenceIds(client, baseId)

  const expanded = new Set<string>()
  for (const id of referringIds) {
    // Skip the specialist being deleted (should not appear, but be safe)
    if (publishedIdOf(id) === baseId) continue
    expanded.add(id)
    expanded.add(publishedIdOf(id))
    expanded.add(draftIdOf(id))
  }

  const docs: CleanupPlan['docs'] = []
  const blocked: CleanupBlockedDoc[] = []

  for (const id of expanded) {
    const doc = (await client.getDocument(id)) as SanityDoc | null
    if (!doc) continue
    // Refs normally store the published id; also clear rare draft-id refs.
    const hits = [
      ...findSpecialistRefHits(doc, baseId),
      ...findSpecialistRefHits(doc, draftId),
    ]
    if (hits.length === 0) continue

    const block =
      validateRemove(doc, baseId) || validateRemove(doc, draftId)
    if (block) blocked.push(block)

    docs.push({
      documentId: doc._id,
      documentType: doc._type,
      documentTitle: documentTitle(doc),
      hits,
    })
  }

  return {specialistId: baseId, docs, blocked}
}

/**
 * Remove this specialist from all referencing documents in a single transaction.
 * Aborts (throws) if any document would violate min-1 validation.
 * Does not delete the specialist itself.
 */
export async function cleanupSpecialistReferences(
  client: SanityClient,
  specialistId: string,
): Promise<{documentsUpdated: number; referencesRemoved: number}> {
  const baseId = publishedIdOf(specialistId)
  const plan = await planSpecialistCleanup(client, baseId)

  if (plan.blocked.length > 0) {
    const list = plan.blocked
      .map((b) => `• ${b.documentTitle} (${b.documentId}): ${b.reason}`)
      .join('\n')
    throw new Error(
      `Cannot delete this specialist — removing it would leave some documents with no related specialists:\n\n${list}`,
    )
  }

  if (plan.docs.length === 0) {
    return {documentsUpdated: 0, referencesRemoved: 0}
  }

  let tx = client.transaction()
  let referencesRemoved = 0

  const draftId = draftIdOf(baseId)
  const targetIds = new Set([baseId, draftId])

  for (const entry of plan.docs) {
    const doc = (await client.getDocument(entry.documentId)) as SanityDoc | null
    if (!doc) continue

    // Re-validate against latest doc before patching
    const block =
      validateRemove(doc, baseId) || validateRemove(doc, draftId)
    if (block) {
      throw new Error(
        `Cannot delete this specialist — ${block.documentTitle} (${block.documentId}): ${block.reason}`,
      )
    }

    const hits = [
      ...findSpecialistRefHits(doc, baseId),
      ...findSpecialistRefHits(doc, draftId),
    ]
    if (hits.length === 0) continue

    const byArray = new Map<string, SpecialistRefHit[]>()
    for (const hit of hits) {
      const list = byArray.get(hit.arrayPath) || []
      list.push(hit)
      byArray.set(hit.arrayPath, list)
    }

    const sets: Record<string, unknown> = {}
    const unsets: string[] = []

    for (const [arrayPath, arrayHits] of byArray) {
      if (arrayHits[0]?.arrayIndex < 0) {
        unsets.push(arrayPath)
        referencesRemoved += 1
        continue
      }
      const arr = getAtPath(doc, arrayPath)
      if (!Array.isArray(arr)) continue
      const before = arr.length
      const next = arr.filter((item) => {
        if (!item || typeof item !== 'object') return true
        const ref = item as {_type?: string; _ref?: string}
        return !(ref._type === 'reference' && ref._ref && targetIds.has(ref._ref))
      })
      referencesRemoved += before - next.length
      sets[arrayPath] = next
    }

    if (Object.keys(sets).length === 0 && unsets.length === 0) continue

    tx = tx.patch(doc._id, (p) => {
      let patch = p
      if (Object.keys(sets).length > 0) patch = patch.set(sets)
      if (unsets.length > 0) patch = patch.unset(unsets)
      return patch
    })
  }

  await tx.commit({visibility: 'sync'})

  // Same gate native delete uses — do not return until the index is clear.
  await waitUntilNoIncomingReferences(client, baseId)

  return {
    documentsUpdated: plan.docs.length,
    referencesRemoved,
  }
}
