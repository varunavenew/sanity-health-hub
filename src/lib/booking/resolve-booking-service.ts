import { slugifyNo } from "@/lib/bookingLinks";

export type BookingServiceLike = {
  name: string;
  apiActivityId?: number;
};

/** Slugify a Metodika activity name for matching against CMS option slugs. */
export function bookingServiceSlug(name: string): string {
  return slugifyNo(name);
}

/** True when a service name matches a configured option slug (exact or unique fragment). */
export function serviceMatchesOptionSlug(
  serviceName: string,
  optionSlug: string,
): boolean {
  const nameSlug = bookingServiceSlug(serviceName);
  const target = slugifyNo(optionSlug);
  if (!target) return false;
  return (
    nameSlug === target ||
    nameSlug.includes(target) ||
    target.includes(nameSlug)
  );
}

/** Keep only services that match at least one configured option slug. */
export function filterServicesByOptions<T extends BookingServiceLike>(
  services: T[],
  optionSlugs: string[],
): T[] {
  const options = optionSlugs.map((s) => slugifyNo(s)).filter(Boolean);
  if (options.length === 0) return services;
  return services.filter((service) =>
    options.some((option) => serviceMatchesOptionSlug(service.name, option)),
  );
}

/**
 * Resolve a single service from ?tjeneste= for auto-preselect.
 * Returns undefined when ambiguous (multiple fuzzy matches) so the user must choose.
 */
export function resolvePreselectedService<T extends BookingServiceLike>(
  services: T[],
  tjeneste: string,
): T | undefined {
  const targetSlug = slugifyNo(tjeneste);
  if (!targetSlug) return undefined;

  const exact = services.filter(
    (s) => bookingServiceSlug(s.name) === targetSlug,
  );
  if (exact.length === 1) return exact[0];

  const fuzzy = services.filter((s) => {
    const nameSlug = bookingServiceSlug(s.name);
    return nameSlug.includes(targetSlug) || targetSlug.includes(nameSlug);
  });
  if (fuzzy.length === 1) return fuzzy[0];
  return undefined;
}

/** Default option slugs for fertilitetsutredning when CMS field is not set yet. */
export const FERTILITETSUTREDNING_BOOKING_OPTIONS = [
  "fertilitetsutredning-for-eggfrys",
  "fertilitetsutredning-par",
  "fertilitetsutredning-singel-kvinne",
] as const;
