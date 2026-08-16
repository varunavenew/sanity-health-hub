#!/usr/bin/env npx tsx
/**
 * Developer-only: match Sanity specialists to live Metodika caregivers
 * and store metodikaUserId so booking step 3 can load the CMS photo.
 *
 *   cd test && npx tsx sanity/patch-specialist-metodika-user-ids-developer.ts
 *   cd test && npx tsx sanity/patch-specialist-metodika-user-ids-developer.ts --write
 */
import { personNamesLooselyEqual } from "../../src/lib/booking/caregiverNameMatch";
import { DATASET, sanityClient } from "./config";
import { setSpecialistMetodikaUserId } from "./lib/patch-specialist";

type SanitySpecialistRow = {
  _id: string;
  name?: string;
  metodikaUserId?: number;
  image?: string;
};

type MetodikaUser = {
  id: number;
  firstname: string;
  lastname: string;
  caregiver?: boolean;
  deactivated?: boolean;
};

const BOOKING_API_BASE =
  process.env.BOOKING_API_BASE_URL || "http://13.50.107.42/api/v1/resources";
const USERS_URL = process.env.BOOKING_USERS_URL || `${BOOKING_API_BASE}/users`;
const ACTIVITIES_URL =
  process.env.BOOKING_WBACTIVITIES_URL || `${BOOKING_API_BASE}/wbactivities`;
const FREETIMES_URL =
  process.env.BOOKING_FREETIMES_URL || `${BOOKING_API_BASE}/wbfreetimes`;

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && typeof root.data === "object") {
    const nested = (root.data as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray(root.result)) return root.result;
  return [];
}

function asUser(entry: unknown): MetodikaUser | null {
  if (!entry || typeof entry !== "object") return null;
  const row = entry as Record<string, unknown>;
  const id = typeof row.id === "number" ? row.id : Number(row.id);
  if (!Number.isFinite(id) || id <= 0) return null;
  if (row.deactivated === true) return null;
  if (row.caregiver === false) return null;
  return {
    id,
    firstname: typeof row.firstname === "string" ? row.firstname.trim() : "",
    lastname: typeof row.lastname === "string" ? row.lastname.trim() : "",
    caregiver: row.caregiver === true,
    deactivated: row.deactivated === true,
  };
}

async function fetchJson(url: string, apiKey: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "X-API-KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Metodika ${response.status} for ${url}`);
  }
  return response.json();
}

async function fetchMetodikaUsers(apiKey: string): Promise<MetodikaUser[]> {
  const listed = unwrapList(await fetchJson(USERS_URL, apiKey))
    .map(asUser)
    .filter((user): user is MetodikaUser => user !== null);
  if (listed.length > 0) return listed;

  const activities = unwrapList(await fetchJson(ACTIVITIES_URL, apiKey));
  const activityIds = [
    ...new Set(
      activities
        .map((row) => {
          if (!row || typeof row !== "object") return 0;
          const id = (row as Record<string, unknown>).id;
          return typeof id === "number" ? id : Number(id);
        })
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  ];

  const caregiverIds = new Set<number>();
  for (const activityId of activityIds) {
    try {
      const slots = unwrapList(
        await fetchJson(`${FREETIMES_URL}?wbactivity-id=${activityId}`, apiKey),
      );
      for (const slot of slots) {
        if (!slot || typeof slot !== "object") continue;
        const row = slot as Record<string, unknown>;
        const raw = row["caregiver_user-id"] ?? row.caregiverUserId;
        const id = typeof raw === "number" ? raw : Number(raw);
        if (Number.isFinite(id) && id > 0) caregiverIds.add(id);
      }
    } catch {
      // Skip activities without freetimes.
    }
  }

  const users: MetodikaUser[] = [];
  for (const userId of caregiverIds) {
    try {
      const entries = unwrapList(await fetchJson(`${USERS_URL}?id=${userId}`, apiKey));
      const user = asUser(entries[0]);
      if (user) users.push(user);
    } catch {
      // Skip missing users.
    }
  }
  return users;
}

function displayName(user: MetodikaUser): string {
  return [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
}

function matchUser(
  specialistName: string,
  users: MetodikaUser[],
): MetodikaUser | undefined {
  const matches = users.filter((user) =>
    personNamesLooselyEqual(specialistName, displayName(user)),
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
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, metodikaUserId, "image": photo.asset->url
    } | order(name asc)`,
  );
  const users = await fetchMetodikaUsers(apiKey);

  console.log(`Dataset: ${DATASET}`);
  console.log(`Sanity specialists: ${specialists.length}`);
  console.log(`Metodika caregivers: ${users.length}`);
  console.log(write ? "Mode: WRITE" : "Mode: dry-run (pass --write to patch)");

  const usedUserIds = new Set<number>();
  let matched = 0;
  let unchanged = 0;
  let unmatched = 0;

  for (const specialist of specialists) {
    const name = specialist.name?.trim() || specialist._id;
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
      console.log(`  keep  ${name} → #${user.id}${specialist.image ? "" : " (no photo)"}`);
      continue;
    }
    matched += 1;
    console.log(`  set   ${name} → #${user.id} (${displayName(user)})`);
    if (write) {
      await setSpecialistMetodikaUserId(specialist._id, user.id);
    }
  }

  console.log(
    `Done. matched=${matched} unchanged=${unchanged} unmatched=${unmatched}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
