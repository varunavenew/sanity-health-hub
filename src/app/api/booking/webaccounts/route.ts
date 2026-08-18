import { NextResponse } from "next/server";
import {
  extractWebAccountCreatedIds,
  pickExistingWebAccountIds,
} from "@/lib/booking/extractEntityId";
import {
  formatPatientNumberForLookup,
  patientNumberLookupCandidates,
} from "@/lib/booking/personalNumber";
import { buildWebAccountCreateBody } from "@/lib/booking/webAccountPayload";
import { BOOKING_URLS, fetchBookingResource, postBookingResource } from "@/lib/booking/upstream";

export interface CreateWebAccountBody {
  firstname: string;
  lastname: string;
  email?: string;
  mobile: string;
  personalnumber: string;
  newsletter?: boolean;
}

/**
 * GET ?patientnumber=25099112345&email=optional@x.y
 * Also accepts 11-digit personalnumber (any separators) and normalizes to plain digits.
 */
export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const rawPatientNumber =
    searchParams.get("patientnumber")?.trim() ||
    searchParams.get("personalnumber")?.trim() ||
    "";
  const email = searchParams.get("email")?.trim() || "";

  const normalized = formatPatientNumberForLookup(rawPatientNumber);
  const patientnumber =
    normalized ||
    (rawPatientNumber.includes("-") || rawPatientNumber.includes(".")
      ? rawPatientNumber
      : null);

  if (!patientnumber) {
    return NextResponse.json(
      {
        ok: false,
        message: "patientnumber (or 11-digit personalnumber) is required.",
      },
      { status: 400 },
    );
  }

  try {
    const lookupUrl = `${BOOKING_URLS.webaccounts}?patientnumber=${encodeURIComponent(patientnumber)}${
      email ? `&email=${encodeURIComponent(email)}` : ""
    }`;
    const payload = await fetchBookingResource(lookupUrl, apiKey);
    const ids = pickExistingWebAccountIds(payload, { email });

    return NextResponse.json({
      ok: true,
      exists: ids != null,
      webAccountId: ids?.webAccountId,
      patientId: ids?.patientId,
      patientnumber,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  let body: CreateWebAccountBody;
  try {
    body = (await request.json()) as CreateWebAccountBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const firstname = body.firstname?.trim();
  const lastname = body.lastname?.trim();
  const mobile = body.mobile?.trim();
  const email = body.email?.trim() || "";
  const personalnumberRaw = body.personalnumber ?? "";
  const personalnumber = formatPatientNumberForLookup(personalnumberRaw);

  if (!firstname || !lastname || !mobile || !personalnumber) {
    return NextResponse.json(
      { ok: false, message: "firstname, lastname, mobile and 11-digit personalnumber are required." },
      { status: 400 },
    );
  }

  try {
    for (const patientnumber of patientNumberLookupCandidates(personalnumber)) {
      const lookupUrl = `${BOOKING_URLS.webaccounts}?patientnumber=${encodeURIComponent(patientnumber)}`;
      try {
        const existingPayload = await fetchBookingResource(lookupUrl, apiKey);
        const existing = pickExistingWebAccountIds(existingPayload, { email });
        if (existing) {
          return NextResponse.json({
            ok: true,
            webAccountId: existing.webAccountId,
            patientId: existing.patientId,
            created: false,
          });
        }
      } catch {
        // Try next candidate / fall through to create.
      }
    }

    const payload = await postBookingResource(
      BOOKING_URLS.webaccounts,
      apiKey,
      buildWebAccountCreateBody({
        firstname,
        lastname,
        email,
        mobile,
        personalnumber,
      }),
    );

    let ids = extractWebAccountCreatedIds(payload);
    if (ids?.webAccountId) {
      try {
        const detailPayload = await fetchBookingResource(
          `${BOOKING_URLS.webaccounts}?id=${encodeURIComponent(String(ids.webAccountId))}`,
          apiKey,
        );
        const detailed = pickExistingWebAccountIds(detailPayload, { email });
        if (detailed) ids = detailed;
      } catch {
        // Keep create response ids.
      }
    }

    if (ids == null) {
      return NextResponse.json(
        { ok: false, message: "Web account created but no id returned from booking API." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      webAccountId: ids.webAccountId,
      patientId: ids.patientId,
      created: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
