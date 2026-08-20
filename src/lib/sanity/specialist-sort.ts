import {
  compareAlphabetical,
  parseSortOrder,
  sortByLabel,
  textForSort,
  type SortLocale,
} from "@/lib/sortAlphabetical";
import type { Specialist } from "@/lib/sanity/specialist-types";

/** Clinic priority for `/spesialister` — single-clinic specialists only. */
export const SPECIALIST_LISTING_CLINIC_SLUGS = [
  "majorstuen",
  "bekkestua",
  "moelv",
  "moss",
] as const;

/** Group index for multi-clinic, all-clinic, unknown, or unassigned specialists. */
export const SPECIALIST_LISTING_MULTI_CLINIC_GROUP = SPECIALIST_LISTING_CLINIC_SLUGS.length;

const CLINIC_SLUG_PRIORITY = new Map<string, number>(
  SPECIALIST_LISTING_CLINIC_SLUGS.map((slug, index) => [slug, index]),
);

function normalizeClinicSlug(value: string | undefined): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** Resolve listing-page clinic group (0–3 = single clinic, 4 = fallback). */
export function resolveSpecialistListingClinicGroup(specialist: Specialist): number {
  const slugs = [
    ...new Set(
      (specialist.clinicRefs ?? [])
        .map((ref) => normalizeClinicSlug(ref.slug))
        .filter(Boolean),
    ),
  ];

  if (slugs.length !== 1) {
    return SPECIALIST_LISTING_MULTI_CLINIC_GROUP;
  }

  return CLINIC_SLUG_PRIORITY.get(slugs[0]!) ?? SPECIALIST_LISTING_MULTI_CLINIC_GROUP;
}

/** Homepage carousel: numbered specialists first, then A–Z. */
export function sortSpecialistsForHomepage<T extends { homepageSortOrder?: number; name: string }>(
  items: T[],
  locale: SortLocale = "no",
): T[] {
  const withOrder: { item: T; order: number }[] = [];
  const withoutOrder: T[] = [];

  for (const item of items) {
    const order = parseSortOrder(item.homepageSortOrder);
    if (order === null) {
      withoutOrder.push(item);
    } else {
      withOrder.push({ item, order });
    }
  }

  withOrder.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return compareAlphabetical(
      textForSort(a.item.name, locale),
      textForSort(b.item.name, locale),
      locale,
    );
  });

  const sortedWithout = sortByLabel(withoutOrder, (item) => item.name, locale);
  return [...withOrder.map((row) => row.item), ...sortedWithout];
}

/** `/spesialister`: clinic groups (Majorstuen → Bekkestua → Moelv → Moss → multi), A–Z within each. */
export function sortSpecialistsForListing(
  items: Specialist[],
  locale: SortLocale = "no",
): Specialist[] {
  return [...items].sort((a, b) => {
    const groupA = resolveSpecialistListingClinicGroup(a);
    const groupB = resolveSpecialistListingClinicGroup(b);
    if (groupA !== groupB) return groupA - groupB;

    return compareAlphabetical(
      textForSort(a.name, locale),
      textForSort(b.name, locale),
      locale,
    );
  });
}
