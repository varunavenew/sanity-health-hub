import { sanityClient } from '../config'

/** Published + draft ids for the same specialist document. */
export function specialistDocumentIds(documentId: string): string[] {
  const baseId = documentId.replace(/^drafts\./, '')
  return [...new Set([baseId, `drafts.${baseId}`])]
}

/** Set bookingCategoryIds on published and draft (whichever exist). */
export async function setSpecialistBookingCategoryIds(
  documentId: string,
  bookingCategoryIds: number[],
): Promise<string[]> {
  const patched: string[] = []

  for (const id of specialistDocumentIds(documentId)) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) continue

    await sanityClient.patch(id).set({ bookingCategoryIds }).commit()
    patched.push(id)
  }

  return patched
}
