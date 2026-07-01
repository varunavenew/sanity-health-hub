import type { SanityClinicListRow } from "@/hooks/useSanity";
import {
  type CategoryClinicDisplayTag,
  findSanityClinicBySlugOrId,
  resolveBookingCategoryKeys,
  sanityAllClinicDisplayTags,
  sanityClinicDisplayTagsForCategory,
  validateSanityClinicBookingConfig,
} from "@/lib/booking/sanityBookingClinic";

export type BookingStep1ClinicBadge = {
  badgeKey: string;
  label: string;
  sortOrder: number;
  clinicId?: string;
  metodikaLocationId?: number;
  image?: string;
};

export type BookingStep1CategoryClinicBadges = {
  categoryKeys: string[];
  badges: BookingStep1ClinicBadge[];
};

type RawStep1Badge = {
  badgeKey?: string;
  label?: unknown;
  sortOrder?: number;
  clinicId?: string;
  metodikaLocationId?: number;
  image?: string;
};

type RawStep1CategoryGroup = {
  categoryKeys?: string[];
  badges?: RawStep1Badge[];
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function badgeMappingOk(
  badge: BookingStep1ClinicBadge,
  sanityClinics: SanityClinicListRow[],
): boolean {
  if (
    typeof badge.metodikaLocationId === "number" &&
    Number.isFinite(badge.metodikaLocationId) &&
    badge.metodikaLocationId > 0
  ) {
    return true;
  }

  if (!badge.clinicId) return false;

  const clinic = findSanityClinicBySlugOrId(sanityClinics, badge.clinicId);
  if (!clinic) return false;

  return validateSanityClinicBookingConfig(clinic).ok;
}

function toDisplayTag(
  badge: BookingStep1ClinicBadge,
  sanityClinics: SanityClinicListRow[],
): CategoryClinicDisplayTag {
  const clinicId = badge.clinicId?.trim() || badge.badgeKey;
  return {
    tagKey: badge.badgeKey,
    id: clinicId,
    slug: clinicId,
    label: badge.label,
    image: badge.image,
    sortOrder: badge.sortOrder,
    bookingMappingOk: badgeMappingOk(badge, sanityClinics),
  };
}

export function mapStep1CategoryClinicBadges(
  raw: RawStep1CategoryGroup[] | null | undefined,
): BookingStep1CategoryClinicBadges[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((group) => {
      const categoryKeys = (group.categoryKeys ?? [])
        .map((key) => asString(key).toLowerCase())
        .filter(Boolean);
      const badges = (group.badges ?? [])
        .map((badge): BookingStep1ClinicBadge | null => {
          const badgeKey = asString(badge.badgeKey);
          const label = asString(badge.label);
          if (!badgeKey || !label) return null;
          return {
            badgeKey,
            label,
            sortOrder:
              typeof badge.sortOrder === "number" && Number.isFinite(badge.sortOrder)
                ? badge.sortOrder
                : 9999,
            ...(asString(badge.clinicId) ? { clinicId: asString(badge.clinicId) } : {}),
            ...(typeof badge.metodikaLocationId === "number" &&
            Number.isFinite(badge.metodikaLocationId)
              ? { metodikaLocationId: badge.metodikaLocationId }
              : {}),
            ...(asString(badge.image) ? { image: asString(badge.image) } : {}),
          };
        })
        .filter((badge): badge is BookingStep1ClinicBadge => badge != null)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (!categoryKeys.length || !badges.length) return null;
      return { categoryKeys, badges } satisfies BookingStep1CategoryClinicBadges;
    })
    .filter((group): group is BookingStep1CategoryClinicBadges => group != null);
}

function findCategoryBadgeGroup(
  config: BookingStep1CategoryClinicBadges[],
  categoryKeys: string[],
): BookingStep1CategoryClinicBadges | undefined {
  const keys = new Set(categoryKeys.map((key) => key.toLowerCase()));
  return config.find((group) =>
    group.categoryKeys.some((key) => keys.has(key.toLowerCase())),
  );
}

/** Step 1 badges for one category — from bookingPage.step1CategoryClinicBadges in Sanity. */
export function step1ClinicDisplayTagsForCategory(
  config: BookingStep1CategoryClinicBadges[],
  sanityClinics: SanityClinicListRow[],
  categoryId?: string,
  categoryApiSlug?: string,
): CategoryClinicDisplayTag[] {
  const categoryKeys = resolveBookingCategoryKeys(categoryId, categoryApiSlug);

  if (!config.length) {
    return sanityClinicDisplayTagsForCategory(sanityClinics, categoryId, categoryApiSlug);
  }

  const group = findCategoryBadgeGroup(config, categoryKeys);
  if (!group) return [];

  return group.badges.map((badge) => toDisplayTag(badge, sanityClinics));
}

/** Unique step 1 badges across all configured categories (for «Alle klinikker»). */
export function allStep1ClinicDisplayTags(
  config: BookingStep1CategoryClinicBadges[],
  sanityClinics: SanityClinicListRow[],
): CategoryClinicDisplayTag[] {
  if (!config.length) {
    return sanityAllClinicDisplayTags(sanityClinics);
  }

  const byKey = new Map<string, CategoryClinicDisplayTag>();

  for (const group of config) {
    for (const badge of group.badges) {
      const tag = toDisplayTag(badge, sanityClinics);
      const existing = byKey.get(badge.badgeKey);
      if (!existing || tag.sortOrder < existing.sortOrder) {
        byKey.set(badge.badgeKey, tag);
      }
    }
  }

  return [...byKey.values()].sort((a, b) => a.sortOrder - b.sortOrder);
}
