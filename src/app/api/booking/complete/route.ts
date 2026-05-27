import { NextResponse } from "next/server";
import {
  extractCreatedEntityId,
  extractWebAccountCreatedIds,
} from "@/lib/booking/extractEntityId";
import { BOOKING_URLS, postBookingResource } from "@/lib/booking/upstream";
import type { CreateAppointmentBody } from "@/app/api/booking/appointments/route";
import type { CreateWebAccountBody } from "@/app/api/booking/webaccounts/route";

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
  const personalnumber = formatPersonalNumber(customer?.personalnumber ?? "");

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
    const webPayload = await postBookingResource(BOOKING_URLS.webaccounts, apiKey, {
      firstname,
      lastname,
      email: customer.email?.trim() || "",
      mobile,
      personalnumber,
      newsletter: Boolean(customer.newsletter),
      username: " ",
      password: " ",
    });

    const webAccountIds = extractWebAccountCreatedIds(webPayload);
    if (webAccountIds == null) {
      return NextResponse.json(
        { ok: false, message: "Web account created but no id returned from booking API." },
        { status: 502 },
      );
    }

    const { webAccountId, patientId } = webAccountIds;

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

    console.log("[booking/complete] appointment request", appointmentRequest);
    console.log("[booking/complete] appointment response", appointmentPayload);

    const appointmentId = extractCreatedEntityId(appointmentPayload);

    return NextResponse.json({
      ok: true,
      webAccountId,
      patientId,
      appointmentId: appointmentId ?? undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
