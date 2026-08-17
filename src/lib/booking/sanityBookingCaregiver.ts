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

export async function fetchSanityCaregiverPortraits(): Promise<SanityCaregiverPortrait[]> {
  try {
    const rows = await sanityClient.fetch<
      Array<{
        name?: string;
        metodikaUserId?: number;
        image?: string;
      }>
    >(SANITY_CAREGIVER_PORTRAITS_QUERY);

    return (rows || [])
      .map((row) => ({
        name: typeof row.name === "string" ? row.name.trim() : "",
        metodikaUserId:
          typeof row.metodikaUserId === "number" && row.metodikaUserId > 0
            ? row.metodikaUserId
            : undefined,
        image: typeof row.image === "string" ? row.image.trim() : undefined,
      }))
      .filter((row) => row.name);
  } catch {
    return [];
  }
}
