/**
 * Shared Metodika caregiver fetch for specialist audit / patch scripts.
 */
export type MetodikaUser = {
  id: number;
  firstname: string;
  lastname: string;
  caregiver?: boolean;
  deactivated?: boolean;
};

const BOOKING_API_BASE =
  process.env.BOOKING_API_BASE_URL || "http://13.50.107.42/api/v1/resources";
export const METODIKA_USERS_URL =
  process.env.BOOKING_USERS_URL || `${BOOKING_API_BASE}/users`;
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

export function displayMetodikaUserName(user: MetodikaUser): string {
  return [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
}

/** Active Metodika caregivers (users list, with freetimes fallback). */
export async function fetchMetodikaCaregivers(
  apiKey: string,
): Promise<MetodikaUser[]> {
  const listed = unwrapList(await fetchJson(METODIKA_USERS_URL, apiKey))
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
      const entries = unwrapList(
        await fetchJson(`${METODIKA_USERS_URL}?id=${userId}`, apiKey),
      );
      const user = asUser(entries[0]);
      if (user) users.push(user);
    } catch {
      // Skip missing users.
    }
  }
  return users;
}
