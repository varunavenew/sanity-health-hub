import { personNamesLooselyEqual } from "@/lib/booking/caregiverNameMatch";
import { sanityClient } from "@/lib/sanityClient";

export type SanityCaregiverPortrait = {
  name: string;
  metodikaUserId?: number;
  image?: string;
};

const SANITY_CAREGIVER_PORTRAITS_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**"))]{
  name,
  metodikaUserId,
  "image": photo.asset->url
}`;

export function resolveSanityCaregiverImage(
  portraits: SanityCaregiverPortrait[],
  opts: { apiUserId: number; name: string },
): string | undefined {
  const byId = portraits.find(
    (portrait) =>
      portrait.metodikaUserId === opts.apiUserId && Boolean(portrait.image?.trim()),
  );
  if (byId?.image?.trim()) return byId.image.trim();

  const nameMatches = portraits.filter(
    (portrait) =>
      Boolean(portrait.image?.trim()) && personNamesLooselyEqual(portrait.name, opts.name),
  );
  if (nameMatches.length === 1) return nameMatches[0].image!.trim();
  return undefined;
}

const PORTRAIT_CACHE_TTL_MS = 5 * 60 * 1000;
let portraitsCache: { expiresAt: number; data: SanityCaregiverPortrait[] } | null = null;
let portraitsInFlight: Promise<SanityCaregiverPortrait[]> | null = null;

export async function fetchSanityCaregiverPortraits(): Promise<SanityCaregiverPortrait[]> {
  if (portraitsCache && portraitsCache.expiresAt > Date.now()) {
    return portraitsCache.data;
  }
  if (portraitsInFlight) return portraitsInFlight;

  portraitsInFlight = sanityClient
    .fetch<
      Array<{
        name?: string;
        metodikaUserId?: number;
        image?: string;
      }>
    >(SANITY_CAREGIVER_PORTRAITS_QUERY)
    .then((rows) => {
      const data = (rows || [])
        .map((row) => ({
          name: typeof row.name === "string" ? row.name.trim() : "",
          metodikaUserId:
            typeof row.metodikaUserId === "number" && row.metodikaUserId > 0
              ? row.metodikaUserId
              : undefined,
          image: typeof row.image === "string" ? row.image.trim() : undefined,
        }))
        .filter((row) => row.name);
      portraitsCache = { data, expiresAt: Date.now() + PORTRAIT_CACHE_TTL_MS };
      return data;
    })
    .catch(() => portraitsCache?.data ?? [])
    .finally(() => {
      portraitsInFlight = null;
    });

  return portraitsInFlight;
}
