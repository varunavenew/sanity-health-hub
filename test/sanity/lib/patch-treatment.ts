import { sanityClient } from '../config'

export function treatmentDocumentIds(documentId: string): string[] {
  const baseId = documentId.replace(/^drafts\./, '')
  return [...new Set([baseId, `drafts.${baseId}`])]
}

export function treatmentIdFromKey(treatmentKey: string): string {
  return `treatment-${treatmentKey.replace(/\//g, '-')}`
}

export function treatmentKeyFromId(documentId: string): string | null {
  const base = documentId.replace(/^drafts\./, '').replace(/^treatment-/, '')
  const dash = base.indexOf('-')
  if (dash < 0) return null
  return `${base.slice(0, dash)}/${base.slice(dash + 1)}`
}

export async function patchTreatmentFields(
  documentId: string,
  fields: Record<string, unknown>,
): Promise<string[]> {
  const patched: string[] = []

  for (const id of treatmentDocumentIds(documentId)) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) continue

    await sanityClient.patch(id).set(fields).commit()
    patched.push(id)
  }

  return patched
}

/** @deprecated Use patchTreatmentFields */
export async function setTreatmentSections(
  documentId: string,
  sections: unknown[],
): Promise<string[]> {
  return patchTreatmentFields(documentId, { sections })
}
