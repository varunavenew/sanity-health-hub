import type { BookingCaregiver } from "@/lib/booking/bookingCaregiver";
import { resolveBookingSpecialistImage } from "@/lib/booking/caregiverPlaceholders";
import { assetSrc } from "@/lib/media";
import { getImageUrl } from "@/lib/sanity/image-url";

const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { expiresAt: number; users: BookingCaregiver[] }>();
const inFlight = new Map<string, Promise<BookingCaregiver[]>>();

function usersCacheKey(ids: number[], specialty?: string): string {
  return `${[...ids].sort((a, b) => a - b).join(",")}:${specialty ?? ""}`;
}

export function peekBookingUsersClient(
  ids: number[],
  specialty?: string,
): BookingCaregiver[] | undefined {
  if (ids.length === 0) return [];
  const key = usersCacheKey(ids, specialty);
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.users;
  return undefined;
}

/** Preload optimized thumb URLs so step 3 portraits appear instantly. */
export function preloadBookingCaregiverImages(users: BookingCaregiver[], limit = 8): void {
  if (typeof window === "undefined") return;

  for (const user of users.slice(0, limit)) {
    const raw = assetSrc(resolveBookingSpecialistImage(user.image));
    if (!raw) continue;
    const url = getImageUrl(raw, { width: 160, quality: 75 });
    if (!url) continue;
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
  }
}

/** Deduped fetch for step 3 specialists — uses cached /api/booking/users. */
export async function fetchBookingUsersClient(
  ids: number[],
  specialty?: string,
): Promise<BookingCaregiver[]> {
  if (ids.length === 0) return [];

  const peeked = peekBookingUsersClient(ids, specialty);
  if (peeked) return peeked;

  const key = usersCacheKey(ids, specialty);
  const pending = inFlight.get(key);
  if (pending) return pending;

  const params = new URLSearchParams({ ids: ids.join(",") });
  if (specialty?.trim()) params.set("specialty", specialty.trim());

  const promise = fetch(`/api/booking/users?${params.toString()}`)
    .then(async (res) => {
      const json = (await res.json()) as { ok?: boolean; users?: BookingCaregiver[] };
      const users =
        res.ok && json.ok && Array.isArray(json.users) ? json.users : [];
      cache.set(key, { users, expiresAt: Date.now() + CLIENT_CACHE_TTL_MS });
      preloadBookingCaregiverImages(users);
      return users;
    })
    .catch(() => {
      cache.set(key, { users: [], expiresAt: Date.now() + 15_000 });
      return [];
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}
