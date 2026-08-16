import { NextResponse } from "next/server";
import {
  extractCreatedEntityId,
  extractWebAccountCreatedIds,
  pickExistingWebAccountIds,
} from "@/lib/booking/extractEntityId";
import {
  formatPatientNumberForLookup,
  formatPersonalNumberForCreate,
} from "@/lib/booking/personalNumber";
import { BOOKING_URLS, fetchBookingResource, postBookingResource } from "@/lib/booking/upstream";
import type { CreateAppointmentBody } from "@/app/api/booking/appointments/route";
import type { CreateWebAccountBody } from "@/app/api/booking/webaccounts/route";

async function resolveWebAccountIds(
  apiKey: string,
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    personalnumber: string;
    newsletter: boolean;
  },
): Promise<{ webAccountId: number; patientId: number; created: boolean }> {
  const patientnumber = formatPatientNumberForLookup(customer.personalnumber);
  if (patientnumber) {
    const lookupUrl = `${BOOKING_URLS.webaccounts}?patientnumber=${encodeURIComponent(patientnumber)}`;
    try {
      const existingPayload = await fetchBookingResource(lookupUrl, apiKey);
      const existing = pickExistingWebAccountIds(existingPayload, {
        email: customer.email,
      });
      if (existing) {
        return { ...existing, created: false };
      }
    } catch {
      // Lookup failed — fall through to create.
    }
  }

  const patientnumberForCreate =
    formatPatientNumberForLookup(customer.personalnumber) || undefined;

  const webPayload = await postBookingResource(BOOKING_URLS.webaccounts, apiKey, {
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    mobile: customer.mobile,
    personalnumber: customer.personalnumber,
    ...(patientnumberForCreate ? { patientnumber: patientnumberForCreate } : {}),
    newsletter: customer.newsletter,
    username: " ",
    password: " ",
  });

  let created = extractWebAccountCreatedIds(webPayload);

  // Metodika create often returns only `{ id }` — re-fetch for patient-id / patientnumber.
  if (created?.webAccountId) {
    try {
      const detailUrl = `${BOOKING_URLS.webaccounts}?id=${encodeURIComponent(String(created.webAccountId))}`;
      const detailPayload = await fetchBookingResource(detailUrl, apiKey);
      const detailed = pickExistingWebAccountIds(detailPayload, {
        email: customer.email,
      });
      if (detailed) created = detailed;
    } catch {
      // Keep create response ids.
    }
  }

  if (created == null) {
    throw new Error("Web account created but no id returned from booking API.");
  }

  return { ...created, created: true };
}

export async function POST(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  let body: { customer: CreateWebAccountBody; appointment: CreateAppointmentBody };
  try {
    body = (await request.json()) as {
      customer: CreateWebAccountBody;
      appointment: CreateAppointmentBody;
    };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const customer = body.customer;
  const appointment = body.appointment;

  const firstname = customer?.firstname?.trim();
  const lastname = customer?.lastname?.trim();
  const mobile = customer?.mobile?.trim();
  const email = customer?.email?.trim() || "";
  const personalnumber = formatPersonalNumberForCreate(customer?.personalnumber ?? "");

  if (!firstname || !lastname || !mobile || !personalnumber) {
    return NextResponse.json(
      { ok: false, message: "Customer firstname, lastname, mobile and personalnumber are required." },
      { status: 400 },
    );
  }

  if (
    !appointment?.wbactivityId ||
    !appointment?.activityTypeId ||
    !appointment?.mainCaregiverUserId ||
    !appointment?.roomId ||
    !appointment?.starttime?.trim() ||
    !appointment?.lengthtime?.trim()
  ) {
    return NextResponse.json(
      { ok: false, message: "Missing required appointment fields." },
      { status: 400 },
    );
  }

  try {
    const { webAccountId, patientId, created } = await resolveWebAccountIds(apiKey, {
      firstname,
      lastname,
      email,
      mobile,
      personalnumber,
      newsletter: Boolean(customer.newsletter),
    });

    const appointmentRequest = {
      "webaccount-id": webAccountId,
      "wbactivity-id": appointment.wbactivityId,
      patient: {
        patient: {
          id: patientId,
        },
      },
      activitytype: {
        activitytype: {
          id: appointment.activityTypeId,
        },
      },
      "maincaregiver_user-id": appointment.mainCaregiverUserId,
      "room-id": appointment.roomId,
      starttime: appointment.starttime.trim(),
      lengthtime: appointment.lengthtime.trim(),
      smsreminder: true,
      smsconfirmation: true,
      emailconfirmation: true,
      createifnotexists: true,
    };

    const appointmentPayload = await postBookingResource(
      BOOKING_URLS.appointments,
      apiKey,
      appointmentRequest,
    );

    const appointmentId = extractCreatedEntityId(appointmentPayload);

    return NextResponse.json({
      ok: true,
      webAccountId,
      patientId,
      webAccountCreated: created,
      appointmentId: appointmentId ?? undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
