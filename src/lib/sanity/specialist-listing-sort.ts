import {
  compareAlphabetical,
  textForSort,
  type SortLocale,
} from "@/lib/sortAlphabetical";

/**
 * `/spesialister` clinic buckets — independent of specialist `sortOrder`
 * (which is for the homepage slider / other carousels).
 */
export const SPECIALIST_LISTING_CLINIC_ORDER = [
  "majorstuen",
  "bekkestua",
  "moelv",
  "moss",
] as const;

export type SpecialistListingClinicKey =
  (typeof SPECIALIST_LISTING_CLINIC_ORDER)[number];

const MULTI_CLINIC_RANK = 1000;
const UNKNOWN_SINGLE_RANK = SPECIALIST_LISTING_CLINIC_ORDER.length;
const NO_CLINIC_RANK = 2000;

export type SpecialistListingClinicSource = {
  name?: string;
  clinics?: string[];
  clinicRefs?: Array<{ label?: string; slug?: string }>;
};

function foldClinicText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hasFoldedToken(folded: string, token: string): boolean {
  if (!folded) return false;
  return (
    folded === token ||
    folded.startsWith(`${token} `) ||
    folded.endsWith(` ${token}`) ||
    folded.includes(` ${token} `)
  );
}

/** Map a clinic slug or display title onto the listing bucket keys. */
export function matchListingClinicKey(
  value: string,
): SpecialistListingClinicKey | null {
  const folded = foldClinicText(value);
  if (!folded) return null;
  if (hasFoldedToken(folded, "majorstuen")) return "majorstuen";
  if (hasFoldedToken(folded, "bekkestua")) return "bekkestua";
  if (hasFoldedToken(folded, "moelv")) return "moelv";
  if (hasFoldedToken(folded, "moss")) return "moss";
  return null;
}

function clinicEntries(
  specialist: SpecialistListingClinicSource,
): Array<{ slug?: string; label?: string }> {
  if (Array.isArray(specialist.clinicRefs) && specialist.clinicRefs.length > 0) {
    return specialist.clinicRefs;
  }
  return (specialist.clinics ?? []).map((label) => ({ label }));
}

function listingClinicPartition(specialist: SpecialistListingClinicSource): {
  known: Set<SpecialistListingClinicKey>;
  unmatchedCount: number;
} {
  const known = new Set<SpecialistListingClinicKey>();
  let unmatchedCount = 0;
  const seen = new Set<string>();

  for (const entry of clinicEntries(specialist)) {
    const slug = typeof entry.slug === "string" ? entry.slug.trim() : "";
    const label = typeof entry.label === "string" ? entry.label.trim() : "";
    const identity = foldClinicText(slug || label);
    if (!identity || seen.has(identity)) continue;
    seen.add(identity);

    const key = matchListingClinicKey(slug) || matchListingClinicKey(label);
    if (key) known.add(key);
    else unmatchedCount += 1;
  }

  return { known, unmatchedCount };
}

export function listingClinicRank(specialist: SpecialistListingClinicSource): number {
  const { known, unmatchedCount } = listingClinicPartition(specialist);
  const distinct = known.size + unmatchedCount;
  if (distinct === 0) return NO_CLINIC_RANK;
  if (distinct > 1) return MULTI_CLINIC_RANK;
  if (known.size === 1) {
    const key = [...known][0];
    return SPECIALIST_LISTING_CLINIC_ORDER.indexOf(key);
  }
  return UNKNOWN_SINGLE_RANK;
}

/** Majorstuen → Bekkestua → Moelv → Moss → multi-clinic last; A–Å within each bucket. */
export function sortSpecialistsForListingPage<T extends SpecialistListingClinicSource>(
  items: T[],
  locale: SortLocale = "no",
): T[] {
  return [...items].sort((a, b) => {
    const rankA = listingClinicRank(a);
    const rankB = listingClinicRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return compareAlphabetical(
      textForSort(a.name, locale),
      textForSort(b.name, locale),
      locale,
    );
  });
}

export function sortClinicFilterLabels(labels: string[], locale: SortLocale = "no"): string[] {
  return [...labels].sort((a, b) => {
    const keyA = matchListingClinicKey(a);
    const keyB = matchListingClinicKey(b);
    const rankA = keyA
      ? SPECIALIST_LISTING_CLINIC_ORDER.indexOf(keyA)
      : UNKNOWN_SINGLE_RANK;
    const rankB = keyB
      ? SPECIALIST_LISTING_CLINIC_ORDER.indexOf(keyB)
      : UNKNOWN_SINGLE_RANK;
    if (rankA !== rankB) return rankA - rankB;
    return compareAlphabetical(a, b, locale);
  });
}

export function specialistListingClinicFilterLabels(
  specialists: SpecialistListingClinicSource[],
  locale: SortLocale = "no",
): string[] {
  const labels = new Set<string>();
  for (const specialist of specialists) {
    for (const clinic of specialist.clinics ?? []) {
      const label = clinic.trim();
      if (label) labels.add(label);
    }
  }
  return sortClinicFilterLabels([...labels], locale);
}
