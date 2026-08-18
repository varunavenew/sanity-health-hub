import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export interface PatientskyCalendar {
  id: string;
  containsSelectedTimeslotTypes: boolean;
  name: string;
  sortingPosition: number;
  ownedByDepartment: null | string;
}

const CLINIC_BOOKING_QUERY = `*[_type == "clinicPage" && _id == $id][0]{
  booking{
    method,
    serviceProviderId
  }
}`;

function patientskyApiBase(): string | undefined {
  return (
    process.env.PATIENTSKY_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_PATIENTSKY_API_URL?.trim() ||
    undefined
  );
}

async function fetchCalendars(serviceProviderId: string): Promise<PatientskyCalendar[]> {
  const base = patientskyApiBase();
  if (!base) {
    throw new Error("Missing PATIENTSKY_API_URL or NEXT_PUBLIC_PATIENTSKY_API_URL");
  }

  const from = new Date();
  const to = new Date();
  to.setMonth(to.getMonth() + 6);
  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const pathTemplate =
    process.env.PATIENTSKY_CALENDARS_PATH?.trim() ||
    "/open-api/service-providers/{serviceProviderId}/external-booking-flow";
  const path = pathTemplate.replace(
    "{serviceProviderId}",
    encodeURIComponent(serviceProviderId),
  );
  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);

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

  const json = (await res.json()) as PatientskyCalendar[] | { calendars?: PatientskyCalendar[] };
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.calendars)) return json.calendars;
  return [];
}

/** Sanity Studio helper: list Pasientsky calendars for a clinic document. */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id query parameter" }, { status: 400 });
  }

  const docId = id.replace(/^drafts\./, "");

  try {
    const clinic = await sanityClient.fetch<{ booking?: { method?: string; serviceProviderId?: string } }>(
      CLINIC_BOOKING_QUERY,
      { id: docId },
    );

    const serviceProviderId = clinic?.booking?.serviceProviderId?.trim();
    if (clinic?.booking?.method !== "pasientsky" || !serviceProviderId) {
      return NextResponse.json({ calendars: undefined });
    }

    const calendars = await fetchCalendars(serviceProviderId);
    return NextResponse.json({ calendars });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Pasientsky calendars";
    return NextResponse.json({ error: message, calendars: undefined }, { status: 502 });
  }
}
