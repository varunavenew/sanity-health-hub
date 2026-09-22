#!/usr/bin/env npx tsx
/**
 * Daily check: every Sanity specialist at a Metodika clinic must exist in
 * Metodika. Moss (phone/info) and Moelv (pasientsky) are skipped on purpose.
 *
 *   cd test && npx tsx sanity/check-specialists-in-metodika.ts
 *
 * Exit code 1 if any in-scope specialist is missing from Metodika.
 */
import { personNamesLooselyEqual } from "../../src/lib/booking/caregiverNameMatch";
import { DATASET, sanityClient } from "./config";
import {
  displayMetodikaUserName,
  fetchMetodikaCaregivers,
  type MetodikaUser,
} from "./lib/metodika-caregivers";
import {
  resolveMetodikaCheckScope,
  type SpecialistClinicBooking,
} from "./lib/specialist-metodika-scope";

type SanitySpecialistRow = {
  _id: string;
  name?: string;
  metodikaUserId?: number;
  clinics?: SpecialistClinicBooking[];
};

const SPECIALISTS_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**"))]{
  _id,
  name,
  metodikaUserId,
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

function findInMetodika(
  specialist: SanitySpecialistRow,
  users: MetodikaUser[],
): MetodikaUser | undefined {
  if (
    typeof specialist.metodikaUserId === "number" &&
    specialist.metodikaUserId > 0
  ) {
    const byId = users.find((user) => user.id === specialist.metodikaUserId);
    if (byId) return byId;
  }
  const name = specialist.name?.trim();
  if (!name) return undefined;
  return matchUser(name, users);
}

async function main() {
  const apiKey = process.env.BOOKING_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing BOOKING_API_KEY");
  }

  const specialists = await sanityClient.fetch<SanitySpecialistRow[]>(
    SPECIALISTS_QUERY,
  );
  const users = await fetchMetodikaCaregivers(apiKey);
  const usersById = new Map(users.map((user) => [user.id, user]));

  console.log(`Dataset: ${DATASET}`);
  console.log(`Sanity specialists: ${specialists.length}`);
  console.log(`Metodika caregivers: ${users.length}`);
  console.log(
    "Comparing only specialists with clinicPage.booking.method === metodika",
  );

  let skipped = 0;
  let ok = 0;
  let missing = 0;
  let staleIds = 0;
  const missingNames: string[] = [];

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

    const storedId = specialist.metodikaUserId;
    if (
      typeof storedId === "number" &&
      storedId > 0 &&
      !usersById.has(storedId)
    ) {
      staleIds += 1;
      console.log(
        `  warn  ${name} — Sanity metodikaUserId #${storedId} not in Metodika caregiver list`,
      );
    }

    const user = findInMetodika(specialist, users);
    if (!user) {
      missing += 1;
      missingNames.push(name);
      const clinicLabels = scope.metodikaClinics
        .map((c) => c.label || c.slug || "?")
        .join(", ");
      console.log(
        `  missing from Metodika  ${name}${clinicLabels ? ` (${clinicLabels})` : ""}`,
      );
      continue;
    }

    ok += 1;
    const stored =
      specialist.metodikaUserId === user.id
        ? `metodikaUserId=#${user.id}`
        : specialist.metodikaUserId
          ? `matched #${user.id}, Sanity has #${specialist.metodikaUserId}`
          : `matched #${user.id} (no metodikaUserId in Sanity)`;
    console.log(`  ok  ${name} — ${stored}`);
  }

  console.log(
    `Done. ok=${ok} missing=${missing} skipped=${skipped} staleIds=${staleIds}`,
  );
  if (missingNames.length > 0) {
    console.log(`Missing: ${missingNames.join("; ")}`);
  }

  if (missing > 0 || staleIds > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
