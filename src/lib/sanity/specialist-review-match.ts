type PatientReview = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date?: string;
};

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

type SeedReview = {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
};

/** CMS refs first; otherwise auto-match Lovable/static seed reviews (at least 3). */
export function patientReviewsForSpecialist(
  specialistName: string,
  category: string,
  cmsReviews: PatientReview[] | undefined,
  seed: SeedReview[],
): PatientReview[] {
  if (cmsReviews && cmsReviews.length > 0) return cmsReviews;

  const matched = getAutoMatchedReviews(
    specialistName,
    category,
    seed.map((review) => ({ id: String(review.id), text: review.text })),
  );
  const byId = new Map(seed.map((review) => [String(review.id), review]));

  return matched.flatMap((item) => {
    const review = byId.get(item.id);
    if (!review) return [];
    return [
      {
        id: String(review.id),
        name: review.name,
        text: review.text,
        rating: review.rating,
        date: review.date,
      },
    ];
  });
}
