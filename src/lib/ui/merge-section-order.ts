/**
 * Merge CMS sectionOrder with a category template fallback.
 *
 * - Empty CMS order → fallback.
 * - Partial CMS order → keep fallback skeleton so unlisted sections stay in
 *   template positions (never append them after unrelated CMS keys).
 * - CMS keys still control relative order among themselves.
 */
export function mergeSectionOrder(
  cmsOrder: string[] | null | undefined,
  fallback: string[],
  extraAllowed: string[] = [],
): string[] {
  const allowed = new Set([...fallback, ...extraAllowed]);
  const cms = (cmsOrder ?? []).filter(
    (key, index, arr) => allowed.has(key) && arr.indexOf(key) === index,
  );
  if (!cms.length) return [...fallback];

  const cmsKeys = new Set(cms);
  const result: string[] = [];
  let cmsIdx = 0;

  for (const key of fallback) {
    if (cmsKeys.has(key)) {
      if (cmsIdx < cms.length) {
        result.push(cms[cmsIdx++]);
      }
    } else {
      result.push(key);
    }
  }

  while (cmsIdx < cms.length) {
    if (!result.includes(cms[cmsIdx])) {
      result.push(cms[cmsIdx]);
    }
    cmsIdx++;
  }

  return result;
}
