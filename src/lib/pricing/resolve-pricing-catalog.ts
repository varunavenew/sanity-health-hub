import { formatDurationMinutes } from "@/lib/booking/duration";
import type { BookingCategoryFromApi } from "@/lib/booking/activity-groups-catalog";
import { slugifyNo } from "@/lib/bookingLinks";
import { mergeLegacyItemsIntoSubcategories } from "@/lib/pricing/merge-legacy-price-lines";
import {
  type MetodikaActivityIndexEntry,
  buildMetodikaActivityIndex,
} from "@/lib/pricing/metodika-activity-index";
import { localizePricingText } from "@/lib/pricing/pricing-i18n";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";

export type PricingItemSource = "metodika" | "cmedical";

export type ResolvedPriceItem = {
  name: string;
  price: string;
  duration: string;
  source: PricingItemSource;
  apiActivityId?: number;
  bookable: boolean;
};

export type ResolvedPriceSubcategory = {
  label: string;
  learnMorePath: string | null;
  items: ResolvedPriceItem[];
};

export type ResolvedPriceCategory = {
  id: string;
  label: string;
  bookingCategorySlug: string;
  path: string;
  subcategories: ResolvedPriceSubcategory[];
};

type RawSanityPriceLine = {
  name?: string;
  price?: number;
  priceLabel?: string;
  note?: string;
  source?: string;
  apiActivityId?: number;
};

/** Bookable Metodika slot: wbactivity id set unless row is explicitly Sanity-only (legacy `source` still supported). */
function isMetodikaRow(raw: RawSanityPriceLine): boolean {
  const source = raw.source;
  if (source === "cmedical" || source === "sanity") return false;
  const id = parseApiActivityId(raw.apiActivityId);
  if (id != null) return true;
  return source === "metodika";
}

function parseApiActivityId(raw: unknown): number | undefined {
  return typeof raw === "number" && raw > 0 ? raw : undefined;
}

function sanityPriceLabel(raw: RawSanityPriceLine): string {
  const priceLabel = raw.priceLabel?.trim();
  if (priceLabel) return priceLabel;
  if (typeof raw.price === "number" && Number.isFinite(raw.price)) {
    return `${raw.price},-`;
  }
  return "";
}

function formatMetodikaPriceDigits(price: string): string {
  const digits = price.replace(/\s/g, "").trim();
  if (!digits || digits === "0") return "0";
  return digits;
}

function metodikaDurationNote(
  entry: MetodikaActivityIndexEntry,
  locale: "no" | "en",
): string {
  if (entry.durationMinutes == null || entry.durationMinutes <= 0) return "";
  return formatDurationMinutes(
    entry.durationMinutes,
    locale === "en" ? "en" : "no",
  );
}

/**
 * Deduping rules (deterministic, order-preserving):
 *
 * 1. Walk Sanity subcategory `items` in CMS order (after legacy merge).
 * 2. Metodika row (wbactivity id; legacy `source=metodika`):
 *    - If id already rendered → skip (duplicate Sanity row).
 *    - If id exists in Metodika index → render Metodika name/price/duration; bookable.
 *    - If id missing from index → skip row (Metodika-only bookable; no stale Sanity duplicate).
 * 3. `source === cmedical` (or legacy sanity):
 *    - If row has `apiActivityId` present in Metodika index → skip (duplicate of bookable activity).
 *    - Otherwise render Sanity name/price/note; not bookable.
 */
export function resolveOrderedPriceItems(
  rawItems: RawSanityPriceLine[],
  metodikaIndex: Map<number, MetodikaActivityIndexEntry>,
  locale: "no" | "en",
  seenActivityIds: Set<number>,
): ResolvedPriceItem[] {
  const resolved: ResolvedPriceItem[] = [];

  for (const raw of rawItems) {
    const apiActivityId = parseApiActivityId(raw.apiActivityId);
    const cmsName = String(raw.name ?? "").trim();
    const cmsNote = String(raw.note ?? "").trim();

    if (isMetodikaRow(raw)) {
      if (apiActivityId == null) continue;
      if (seenActivityIds.has(apiActivityId)) continue;

      const fromApi = metodikaIndex.get(apiActivityId);
      if (!fromApi) continue;

      seenActivityIds.add(apiActivityId);
      const name = localizePricingText(fromApi.name, locale);
      resolved.push({
        name,
        price: formatMetodikaPriceDigits(fromApi.price),
        duration: cmsNote || metodikaDurationNote(fromApi, locale),
        source: "metodika",
        apiActivityId,
        bookable: true,
      });
      continue;
    }

    if (apiActivityId != null && metodikaIndex.has(apiActivityId)) {
      continue;
    }

    if (!cmsName) continue;

    resolved.push({
      name: localizePricingText(cmsName, locale),
      price: localizePricingText(sanityPriceLabel(raw), locale),
      duration: localizePricingText(cmsNote, locale),
      source: "cmedical",
      bookable: false,
    });
  }

  return resolved;
}

function resolveSubcategoryLearnMorePath(
  sub: {
    linkToCategoryPage?: boolean;
    treatmentRef?: {
      slug?: string;
      categorySlug?: string;
      categoryId?: string;
    } | null;
  },
  bookingCategorySlug: string,
  locale: "no" | "en",
): string | null {
  const treatmentSlug = String(sub.treatmentRef?.slug ?? "").trim();
  if (treatmentSlug) {
    const routeKey =
      normalizeCategoryRouteKey(
        String(
          sub.treatmentRef?.categoryId ||
            sub.treatmentRef?.categorySlug ||
            bookingCategorySlug,
        ),
      ) || bookingCategorySlug;
    const segmentSource =
      bookingCategorySlug && bookingCategorySlug !== "flere-fagomrader"
        ? normalizeCategoryRouteKey(bookingCategorySlug) || routeKey
        : routeKey;
    const segment = behandlingerCategorySegment(
      segmentSource === "annet" ? FLERE_FAGOMRADER_CATEGORY_ID : segmentSource,
      locale,
    );
    return `/${segment}/${treatmentSlug}`;
  }

  if (sub.linkToCategoryPage) {
    const key =
      normalizeCategoryRouteKey(bookingCategorySlug) || bookingCategorySlug;
    if (key === FLERE_FAGOMRADER_CATEGORY_ID || key === "annet") {
      return `/${behandlingerCategorySegment(FLERE_FAGOMRADER_CATEGORY_ID, locale)}`;
    }
    return categoryLandingPath(key, locale);
  }

  return null;
}

/** Sanity defines category/subcategory/item order; Metodika fills bookable rows. */
export function buildPricingPageCategories(
  rawCategories: unknown,
  metodikaCategories: BookingCategoryFromApi[],
  locale: "no" | "en",
): ResolvedPriceCategory[] {
  if (!Array.isArray(rawCategories)) return [];

  const metodikaIndex = buildMetodikaActivityIndex(metodikaCategories);
  const seenActivityIds = new Set<number>();

  return rawCategories
    .map((raw: any, index: number) => {
      const label = localizePricingText(
        String(raw?.categoryName ?? "").trim(),
        locale,
      );
      if (!label) return null;

      const bookingCategorySlug =
        String(raw?.bookingCategorySlug ?? raw?.categoryRef?.slug ?? "").trim() ||
        slugifyNo(label);

      const rawLegacyLines = Array.isArray(raw?.items) ? raw.items : [];
      const subsWithLegacy =
        Array.isArray(raw?.subcategories) && raw.subcategories.length > 0
          ? mergeLegacyItemsIntoSubcategories(
              raw.subcategories,
              rawLegacyLines,
              (line) => String(line?.name ?? "").trim(),
            )
          : Array.isArray(raw?.subcategories)
            ? raw.subcategories
            : [];

      const fromSubs: ResolvedPriceSubcategory[] = subsWithLegacy
        .map((sub: any) => {
          const subLabel =
            localizePricingText(String(sub?.label ?? "").trim(), locale) ||
            label;
          const items = resolveOrderedPriceItems(
            Array.isArray(sub?.items) ? sub.items : [],
            metodikaIndex,
            locale,
            seenActivityIds,
          );
          if (items.length === 0) return null;
          return {
            label: subLabel,
            learnMorePath: resolveSubcategoryLearnMorePath(
              sub,
              bookingCategorySlug,
              locale,
            ),
            items,
          };
        })
        .filter((s): s is ResolvedPriceSubcategory => s != null);

      const legacyItems =
        subsWithLegacy.length === 0
          ? resolveOrderedPriceItems(
              rawLegacyLines,
              metodikaIndex,
              locale,
              seenActivityIds,
            )
          : [];

      const subcategories =
        fromSubs.length > 0
          ? fromSubs
          : legacyItems.length > 0
            ? [{ label, learnMorePath: null, items: legacyItems }]
            : [];

      if (subcategories.length === 0) return null;

      return {
        id: `${slugifyNo(label) || "cat"}-${index}`,
        label,
        bookingCategorySlug,
        path: `/${bookingCategorySlug}`,
        subcategories,
      } satisfies ResolvedPriceCategory;
    })
    .filter((c): c is ResolvedPriceCategory => c != null);
}
