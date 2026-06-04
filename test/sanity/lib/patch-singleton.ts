import { sanityClient } from '../config'

/** Published + draft ids for singleton documents (e.g. servicesPage). */
export function singletonDocumentIds(documentId: string): string[] {
  const baseId = documentId.replace(/^drafts\./, '')
  return [...new Set([baseId, `drafts.${baseId}`])]
}

/**
 * Patch fields on published + draft singletons.
 * Never creates an empty draft — copies published first when the draft is missing.
 */
export async function patchSingletonFields(
  documentId: string,
  fields: Record<string, unknown>,
  documentType?: string,
): Promise<string[]> {
  const baseId = documentId.replace(/^drafts\./, '')
  const draftId = `drafts.${baseId}`
  const patched: string[] = []

  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: baseId },
  )

  const type =
    documentType ||
    (typeof published?._type === 'string' ? published._type : baseId.replace(/Page$/, 'Page'))

  if (!published) {
    await sanityClient.createIfNotExists({
      _id: baseId,
      _type: type,
      ...fields,
    })
    patched.push(`${baseId} (created)`)
  } else {
    await sanityClient
      .patch(baseId)
      .set(fields)
      .commit({ autoGenerateArrayKeys: true })
    patched.push(baseId)
  }

  const draftExists = await sanityClient.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    { id: draftId },
  )

  const publishedAfter = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: baseId },
  )

  if (draftExists) {
    await sanityClient
      .patch(draftId)
      .set(fields)
      .commit({ autoGenerateArrayKeys: true })
    patched.push(draftId)
  } else if (publishedAfter) {
    await sanityClient.createOrReplace({
      ...publishedAfter,
      ...fields,
      _id: draftId,
      _type: (publishedAfter._type as string) || type,
    })
    patched.push(`${draftId} (created from published)`)
  }

  return patched
}
