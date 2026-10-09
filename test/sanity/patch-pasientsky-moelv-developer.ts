#!/usr/bin/env npx tsx
/**
 * Developer-only: sync Moelv PatientSky calendar ids onto specialists and
 * Metodika→PatientSky timetype mappings onto the Moelv clinicPage.
 *
 *   cd test && npx tsx sanity/patch-pasientsky-moelv-developer.ts
 *   cd test && npx tsx sanity/patch-pasientsky-moelv-developer.ts --write
 */
import { matchPasientskyCalendarId } from "../../src/lib/booking/pasientskyCalendarMatch";
import {
  inferPasientskyTimeslotTypeIdFromServiceName,
  MOELV_PASIENTSKY_TIMESLOT_BY_METODIKA_ACTIVITY,
  type PasientskyTimeslotMappingRow,
} from "../../src/lib/booking/pasientskyTimeslotMapping";
import { DATASET, sanityClient } from "./config";
import { setSpecialistPasientskyCalendarId } from "./lib/patch-specialist";

type PasientskyCalendar = { id: string; name: string };
type PasientskyTimeslot = { id: string; name: string };

type SanitySpecialistRow = {
  _id: string;
  name?: string;
  title?: string;
  pasientskyCalendarId?: string;
  slug?: { current?: string };
  bookingCategoryIds?: number[];
};

type MoelvClinicRow = {
  _id: string;
  booking?: {
    serviceProviderId?: string;
    pasientskyTimeslotMappings?: PasientskyTimeslotMappingRow[];
  };
};

type MetodikaActivity = { id: number; name: string; groupId?: number };

const BOOKING_API_BASE =
  process.env.BOOKING_API_BASE_URL || "https://web-api.cmedical.no/api/v1/resources";
const ACTIVITIES_URL =
  process.env.BOOKING_WBACTIVITIES_URL || `${BOOKING_API_BASE}/wbactivities`;
const GROUPS_URL =
  process.env.BOOKING_ACTIVITY_GROUPS_URL || `${BOOKING_API_BASE}/wbactivitygroups`;

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root.data)) {
    const inner = root.data;
    if (Array.isArray(inner)) return inner;
  }
  if (root.data && typeof root.data === "object") {
    const nested = root.data as Record<string, unknown>;
    if (Array.isArray(nested.data)) return nested.data;
  }
  if (Array.isArray(root.result)) return root.result;
  return [];
}

async function fetchJson(url: string, apiKey: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Metodika ${res.status} for ${url}`);
  return res.json();
}

async function fetchPasientskyFlow(
  serviceProviderId: string,
): Promise<{ calendars: PasientskyCalendar[]; timeslotTypes: PasientskyTimeslot[] }> {
  const base =
    process.env.PATIENTSKY_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_PATIENTSKY_API_URL?.trim();
  if (!base) throw new Error("Missing PATIENTSKY_API_URL");

  const from = new Date();
  const to = new Date();
  to.setMonth(to.getMonth() + 6);
  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const path =
    process.env.PATIENTSKY_CALENDARS_PATH?.trim() ||
    "/open-api/service-providers/{serviceProviderId}/external-booking-flow";
  const url = new URL(
    path.replace("{serviceProviderId}", encodeURIComponent(serviceProviderId)),
    base.endsWith("/") ? base : `${base}/`,
  );

  const res = await fetch(url, {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      customBookingFlowId: null,
      calendarIds: null,
      timeslotTypeIds: null,
      dateRange: { from: formatDate(from), to: formatDate(to) },
      selectedDateForDetails: null,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Pasientsky ${res.status}`);
  }
  const json = (await res.json()) as {
    calendars?: PasientskyCalendar[];
    timeslotTypes?: PasientskyTimeslot[];
  };
  return {
    calendars: json.calendars ?? [],
    timeslotTypes: json.timeslotTypes ?? [],
  };
}

function activityId(entry: unknown): number | null {
  if (!entry || typeof entry !== "object") return null;
  const row = entry as Record<string, unknown>;
  const id = typeof row.id === "number" ? row.id : Number(row.id);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

function activityName(entry: unknown): string {
  if (!entry || typeof entry !== "object") return "";
  const row = entry as Record<string, unknown>;
  return typeof row.name === "string" ? row.name.trim() : "";
}

function activityGroupId(entry: unknown): number | undefined {
  if (!entry || typeof entry !== "object") return undefined;
  const row = entry as Record<string, unknown>;
  const raw =
    row["wbactivitygroup-id"] ?? row.wbactivitygroupId ?? row.wbactivitygroup_id;
  const id = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(id) ? id : undefined;
}

async function fetchMetodikaActivities(apiKey: string): Promise<MetodikaActivity[]> {
  const listed = unwrapList(await fetchJson(ACTIVITIES_URL, apiKey))
    .map((entry) => {
      const id = activityId(entry);
      if (id == null) return null;
      return {
        id,
        name: activityName(entry),
        groupId: activityGroupId(entry),
      };
    })
    .filter((row): row is MetodikaActivity => row != null && Boolean(row.name));
  if (listed.length > 0) return listed;

  const groups = unwrapList(await fetchJson(GROUPS_URL, apiKey));
  const out: MetodikaActivity[] = [];
  for (const group of groups) {
    if (!group || typeof group !== "object") continue;
    const groupRow = group as Record<string, unknown>;
    const groupId =
      typeof groupRow.id === "number" ? groupRow.id : Number(groupRow.id);
    const activities = unwrapList(groupRow.activities ?? groupRow.wbactivities);
    for (const entry of activities) {
      const id = activityId(entry);
      if (id == null) continue;
      out.push({ id, name: activityName(entry), groupId });
    }
  }
  return out;
}

function mappingKey(row: PasientskyTimeslotMappingRow): string {
  return `${row.metodikaActivityId}:${row.timeslotTypeId}`;
}

async function patchClinicTimeslotMappings(
  clinicId: string,
  mappings: PasientskyTimeslotMappingRow[],
  write: boolean,
): Promise<void> {
  const ids = [clinicId.replace(/^drafts\./, ""), `drafts.${clinicId.replace(/^drafts\./, "")}`];
  for (const id of ids) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id });
    if (!exists) continue;
    console.log(`  clinic ${id}: ${mappings.length} timetype mapping(s)`);
    if (write) {
      await sanityClient
        .patch(id)
        .set({ "booking.pasientskyTimeslotMappings": mappings })
        .commit();
    }
  }
}

async function main() {
  const write = process.argv.includes("--write");
  const apiKey = process.env.BOOKING_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing BOOKING_API_KEY");

  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}" — developer only.`);
  }

  const moelv = await sanityClient.fetch<MoelvClinicRow | null>(
    `*[_type == "clinicPage" && booking.method == "pasientsky"][0]{
      _id,
      booking{ serviceProviderId, pasientskyTimeslotMappings }
    }`,
  );
  const serviceProviderId = moelv?.booking?.serviceProviderId?.trim();
  if (!moelv?._id || !serviceProviderId) {
    throw new Error("No Moelv clinicPage with PatientSky serviceProviderId in developer.");
  }

  const { calendars, timeslotTypes } = await fetchPasientskyFlow(serviceProviderId);
  console.log(
    `PatientSky: ${calendars.length} calendars, ${timeslotTypes.length} timetyper`,
  );

  const specialists = await sanityClient.fetch<SanitySpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, title, pasientskyCalendarId, slug, bookingCategoryIds
    } | order(name asc)`,
  );

  console.log(write ? "Mode: WRITE (developer)" : "Mode: dry-run (pass --write)");

  let calendarSet = 0;
  let calendarKeep = 0;
  let calendarMiss = 0;

  for (const specialist of specialists) {
    const name = specialist.name?.trim();
    if (!name) continue;
    const calendarId = matchPasientskyCalendarId(calendars, name, {
      alternateNames: specialist.title ? [`${specialist.title} ${name}`] : [],
    });
    if (!calendarId) {
      calendarMiss += 1;
      continue;
    }
    if (specialist.pasientskyCalendarId?.trim() === calendarId) {
      calendarKeep += 1;
      console.log(`  keep calendar  ${name} → ${calendarId}`);
      continue;
    }
    calendarSet += 1;
    console.log(`  set calendar   ${name} → ${calendarId}`);
    if (write) {
      await setSpecialistPasientskyCalendarId(specialist._id, calendarId);
    }
  }

  const groupIds = new Set<number>();
  for (const specialist of specialists) {
    for (const id of specialist.bookingCategoryIds ?? []) {
      if (typeof id === "number" && id > 0) groupIds.add(id);
    }
  }

  const activities = await fetchMetodikaActivities(apiKey);
  console.log(`Metodika activities loaded: ${activities.length}`);

  const relevantActivities =
    groupIds.size > 0
      ? activities.filter((row) => row.groupId != null && groupIds.has(row.groupId))
      : activities;
  const mappingSource =
    relevantActivities.length > 0 ? relevantActivities : activities;

  const mappingsByKey = new Map<string, PasientskyTimeslotMappingRow>();
  for (const activity of mappingSource) {
    const timeslotTypeId = inferPasientskyTimeslotTypeIdFromServiceName(
      activity.name,
      timeslotTypes,
    );
    if (!timeslotTypeId) continue;
    const row: PasientskyTimeslotMappingRow = {
      metodikaActivityId: activity.id,
      timeslotTypeId,
      label: activity.name,
    };
    mappingsByKey.set(mappingKey(row), row);
  }

  for (const [rawId, timeslotTypeId] of Object.entries(
    MOELV_PASIENTSKY_TIMESLOT_BY_METODIKA_ACTIVITY,
  )) {
    const metodikaActivityId = Number(rawId);
    if (!Number.isFinite(metodikaActivityId)) continue;
    const activity = activities.find((row) => row.id === metodikaActivityId);
    const row: PasientskyTimeslotMappingRow = {
      metodikaActivityId,
      timeslotTypeId,
      label: activity?.name ?? `Metodika activity ${metodikaActivityId}`,
    };
    mappingsByKey.set(mappingKey(row), row);
  }

  const mappings = [...mappingsByKey.values()].sort(
    (a, b) => a.metodikaActivityId - b.metodikaActivityId,
  );

  console.log(`\nTimetype mappings (${mappings.length}):`);
  for (const row of mappings.slice(0, 40)) {
    const ts = timeslotTypes.find((t) => t.id === row.timeslotTypeId);
    console.log(`  #${row.metodikaActivityId} → ${ts?.name ?? row.timeslotTypeId}`);
  }
  if (mappings.length > 40) console.log(`  … +${mappings.length - 40} more`);

  await patchClinicTimeslotMappings(moelv._id, mappings, write);

  console.log(
    `\nDone. calendars set=${calendarSet} keep=${calendarKeep} unmatched=${calendarMiss} mappings=${mappings.length}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
