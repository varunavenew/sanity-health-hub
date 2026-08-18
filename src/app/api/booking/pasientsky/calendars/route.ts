import { NextResponse } from "next/server";

export type PasientskyCalendarRow = {
  id: string;
  name: string;
  containsSelectedTimeslotTypes?: boolean;
  sortingPosition?: number;
  ownedByDepartment?: null | string;
};

function plannerApiBase(): string | undefined {
  return (
    process.env.PATIENTSKY_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_PATIENTSKY_API_URL?.trim() ||
    undefined
  );
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function normalizeCalendars(json: unknown): PasientskyCalendarRow[] {
  if (!json || typeof json !== "object") return [];
  const root = json as Record<string, unknown>;
  if (Array.isArray(root.calendars)) return root.calendars as PasientskyCalendarRow[];
  if (Array.isArray(root.data)) return root.data as PasientskyCalendarRow[];
  const data = root.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested.calendars)) return nested.calendars as PasientskyCalendarRow[];
  }
  return [];
}

async function fetchCalendars(serviceProviderId: string): Promise<PasientskyCalendarRow[]> {
  const base = plannerApiBase();
  if (!base) {
    throw new Error("Missing PATIENTSKY_API_URL or NEXT_PUBLIC_PATIENTSKY_API_URL");
  }

  const from = new Date();
  const to = new Date();
  to.setMonth(to.getMonth() + 6);

  const path =
    process.env.PATIENTSKY_CALENDARS_PATH?.trim() ||
    `/open-api/service-providers/{serviceProviderId}/external-booking-flow`;
  const resolvedPath = path.replace(
    "{serviceProviderId}",
    encodeURIComponent(serviceProviderId),
  );
  const url = new URL(resolvedPath, base.endsWith("/") ? base : `${base}/`);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customBookingFlowId: null,
      calendarIds: null,
      timeslotTypeIds: null,
      dateRange: { from: formatDate(from), to: formatDate(to) },
      selectedDateForDetails: null,
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Pasientsky calendars request failed (${res.status})`);
  }

  const json = (await res.json()) as unknown;
  return normalizeCalendars(json).filter(
    (calendar) =>
      typeof calendar?.id === "string" &&
      calendar.id.trim() &&
      typeof calendar?.name === "string" &&
      calendar.name.trim(),
  );
}

/** Public calendars list for a Pasientsky clinic (used to preselect Behandler). */
export async function GET(request: Request) {
  const serviceProviderId = new URL(request.url).searchParams
    .get("serviceProviderId")
    ?.trim();

  if (!serviceProviderId) {
    return NextResponse.json(
      { error: "Missing serviceProviderId query parameter" },
      { status: 400 },
    );
  }

  try {
    const calendars = await fetchCalendars(serviceProviderId);
    return NextResponse.json({ ok: true, calendars });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load Pasientsky calendars";
    return NextResponse.json(
      { ok: false, error: message, calendars: [] },
      { status: 502 },
    );
  }
}
