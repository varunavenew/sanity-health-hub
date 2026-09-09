/** True when `seo.ogImageAlt` is missing or has no non-empty language value. */
export function isOgImageAltMissing(seo: unknown): boolean {
  if (!seo || typeof seo !== "object") return true;
  const alt = (seo as { ogImageAlt?: unknown }).ogImageAlt;
  if (alt == null) return true;
  if (Array.isArray(alt)) {
    return !alt.some((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const value = (entry as { value?: unknown }).value;
      return typeof value === "string" && value.trim().length > 0;
    });
  }
  return typeof alt === "string" ? alt.trim().length === 0 : true;
}

type SanityMutateClient = {
  patch: (id: string) => {
    set: (ops: Record<string, unknown>) => {
      commit: (opts?: { autoGenerateArrayKeys?: boolean }) => Promise<unknown>;
    };
  };
};

/**
 * If the draft would publish without ogImageAlt, copy it from the published
 * sibling so a later publish cannot wipe the field (4 Sept batch issue).
 */
export async function copyPublishedOgImageAltToDraft(
  client: SanityMutateClient,
  documentId: string,
  draft: {_id?: string; seo?: unknown} | null | undefined,
  published: {seo?: unknown} | null | undefined,
): Promise<boolean> {
  if (!draft || !isOgImageAltMissing(draft.seo)) return false;
  if (isOgImageAltMissing(published?.seo)) return false;
  const publishedAlt = (published!.seo as {ogImageAlt: unknown}).ogImageAlt;
  const draftId = draft._id?.startsWith("drafts.")
    ? draft._id
    : documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId.replace(/^drafts\./, "")}`;
  await client
    .patch(draftId)
    .set({"seo.ogImageAlt": publishedAlt})
    .commit({autoGenerateArrayKeys: true});
  return true;
}
