#!/usr/bin/env npx tsx
/**
 * Developer-only: match Sanity specialists to live Metodika caregivers
 * and store metodikaUserId so booking step 3 can load the CMS photo.
 *
 * Only specialists at Metodika clinics (booking.method === "metodika") are
 * matched. Moss (phone/info) and Moelv (pasientsky) are skipped.
 *
 *   cd test && npx tsx sanity/patch-specialist-metodika-user-ids-developer.ts
 *   cd test && npx tsx sanity/patch-specialist-metodika-user-ids-developer.ts --write
 */
import { personNamesLooselyEqual } from "../../src/lib/booking/caregiverNameMatch";
import { DATASET, sanityClient } from "./config";
import {
  displayMetodikaUserName,
  fetchMetodikaCaregivers,
  type MetodikaUser,
} from "./lib/metodika-caregivers";
import { setSpecialistMetodikaUserId } from "./lib/patch-specialist";
import {
  resolveMetodikaCheckScope,
  type SpecialistClinicBooking,
} from "./lib/specialist-metodika-scope";

type SanitySpecialistRow = {
  _id: string;
  name?: string;
  metodikaUserId?: number;
  image?: string;
  clinics?: SpecialistClinicBooking[];
};

const SPECIALISTS_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**"))]{
  _id,
  name,
  metodikaUserId,
  "image": photo.asset->url,
  "clinics": clinics[]->{
    "label": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug.current),
    "method": booking.method
  }
} | order(name asc)`;

function matchUser(
  specialistName: string,
  users: MetodikaUser[],
): MetodikaUser | undefined {
  const matches = users.filter((user) =>
    personNamesLooselyEqual(specialistName, displayMetodikaUserName(user)),
  );
  if (matches.length === 1) return matches[0];
  return undefined;
}

async function main() {
  const write = process.argv.includes("--write");
  const apiKey = process.env.BOOKING_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing BOOKING_API_KEY");
  }

  const specialists = await sanityClient.fetch<SanitySpecialistRow[]>(
    SPECIALISTS_QUERY,
  );
  const users = await fetchMetodikaCaregivers(apiKey);

  console.log(`Dataset: ${DATASET}`);
  console.log(`Sanity specialists: ${specialists.length}`);
  console.log(`Metodika caregivers: ${users.length}`);
  console.log(write ? "Mode: WRITE" : "Mode: dry-run (pass --write to patch)");
  console.log(
    "Matching only specialists with clinicPage.booking.method === metodika",
  );

  const usedUserIds = new Set<number>();
  let matched = 0;
  let unchanged = 0;
  let unmatched = 0;
  let skipped = 0;

  for (const specialist of specialists) {
    const name = specialist.name?.trim() || specialist._id;
    const scope = resolveMetodikaCheckScope(specialist.clinics);

    if (!scope.compare) {
      skipped += 1;
      const clinicLabels = scope.clinics
        .map((c) => c.label || c.slug || "?")
        .join(", ");
      console.log(
        `  ${scope.skipReason}  ${name}${clinicLabels ? ` (${clinicLabels})` : ""}`,
      );
      continue;
    }

    const user = matchUser(name, users);
    if (!user) {
      unmatched += 1;
      console.log(`  miss  ${name}`);
      continue;
    }
    if (usedUserIds.has(user.id) && specialist.metodikaUserId !== user.id) {
      unmatched += 1;
      console.log(`  skip  ${name} — Metodika #${user.id} already assigned`);
      continue;
    }
    usedUserIds.add(user.id);
    if (specialist.metodikaUserId === user.id) {
      unchanged += 1;
      console.log(
        `  keep  ${name} → #${user.id}${specialist.image ? "" : " (no photo)"}`,
      );
      continue;
    }
    matched += 1;
    console.log(`  set   ${name} → #${user.id} (${displayMetodikaUserName(user)})`);
    if (write) {
      await setSpecialistMetodikaUserId(specialist._id, user.id);
    }
  }

  console.log(
    `Done. matched=${matched} unchanged=${unchanged} unmatched=${unmatched} skipped=${skipped}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
