import { sanityClient } from "../config";

/** Published + draft ids for singleton documents (e.g. servicesPage). */
export function singletonDocumentIds(documentId: string): string[] {
  const baseId = documentId.replace(/^drafts\./, "");
  return [...new Set([baseId, `drafts.${baseId}`])];
}

/** Patch the same fields on published and draft so Studio shows updated content. */
export async function patchSingletonFields(
  documentId: string,
  fields: Record<string, unknown>,
): Promise<string[]> {
  const baseId = documentId.replace(/^drafts\./, "");
  const patched: string[] = [];

  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: baseId },
  );

  if (published) {
    await sanityClient
      .patch(baseId)
      .set(fields)
      .commit({ autoGenerateArrayKeys: true });
    patched.push(baseId);
  }

  const draftId = `drafts.${baseId}`;
  const draftExists = await sanityClient.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    { id: draftId },
  );

  if (draftExists) {
    await sanityClient
      .patch(draftId)
      .set(fields)
      .commit({ autoGenerateArrayKeys: true });
    patched.push(draftId);
  } else if (published) {
    await sanityClient.createOrReplace({
      ...published,
      ...fields,
      _id: draftId,
    });
    patched.push(`${draftId} (created)`);
  }

  return patched;
}
