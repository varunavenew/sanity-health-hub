/** Keywords for auto-matching Google reviews to specialist category (Norwegian text). */
export const CATEGORY_REVIEW_KEYWORDS: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ultralyd"],
  fertilitet: ["fertil", "ivf", "egg", "befruktning", "embryo"],
  urologi: ["urolog", "prostata"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "ortoped", "kirurg"],
  annet: [],
};

export type ReviewMatchItem = {
  id: string;
  text: string;
};

/** Same selection rules as SpecialistReviews auto-match (up to 6 reviews). */
export function getAutoMatchedReviews(
  specialistName: string,
  category: string,
  allReviews: ReviewMatchItem[],
): ReviewMatchItem[] {
  const parts = specialistName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || allReviews.length === 0) return [];

  const firstName = parts[0].toLowerCase();
  const lastName = parts[parts.length - 1].toLowerCase();

  const nameMatched = allReviews.filter(
    (r) =>
      r.text.toLowerCase().includes(firstName) ||
      r.text.toLowerCase().includes(lastName),
  );

  if (nameMatched.length >= 3) return nameMatched.slice(0, 6);

  const keywords = CATEGORY_REVIEW_KEYWORDS[category] || [];
  const catMatched = allReviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw)),
  );

  const combined: ReviewMatchItem[] = [...nameMatched];
  for (const r of catMatched) {
    if (!combined.some((item) => item.id === r.id) && combined.length < 3) {
      combined.push(r);
    }
  }

  for (const r of allReviews) {
    if (combined.length >= 3) break;
    if (!combined.some((item) => item.id === r.id)) combined.push(r);
  }

  return combined;
}
