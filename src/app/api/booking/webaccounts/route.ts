import { NextResponse } from "next/server";
import { extractWebAccountCreatedIds } from "@/lib/booking/extractEntityId";
import { BOOKING_URLS, postBookingResource } from "@/lib/booking/upstream";

export interface CreateWebAccountBody {
  firstname: string;
  lastname: string;
  email?: string;
  mobile: string;
  personalnumber: string;
  newsletter?: boolean;
}

function formatPersonalNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  }
  return digits;
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
  const personalnumber = formatPersonalNumber(body.personalnumber ?? "");

  if (!firstname || !lastname || !mobile || !personalnumber) {
    return NextResponse.json(
      { ok: false, message: "firstname, lastname, mobile and personalnumber are required." },
      { status: 400 },
    );
  }

  try {
    const payload = await postBookingResource(BOOKING_URLS.webaccounts, apiKey, {
      firstname,
      lastname,
      email: body.email?.trim() || "",
      mobile,
      personalnumber,
      newsletter: Boolean(body.newsletter),
      username: " ",
      password: " ",
    });

    const ids = extractWebAccountCreatedIds(payload);
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
