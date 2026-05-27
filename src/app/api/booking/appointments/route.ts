import { NextResponse } from "next/server";
import { extractCreatedEntityId } from "@/lib/booking/extractEntityId";
import { BOOKING_URLS, postBookingResource } from "@/lib/booking/upstream";

export interface CreateAppointmentBody {
  webAccountId: number;
  patientId: number;
  wbactivityId: number;
  activityTypeId: number;
  mainCaregiverUserId: number;
  roomId: number;
  starttime: string;
  lengthtime: string;
  smsreminder?: boolean;
  smsconfirmation?: boolean;
  emailconfirmation?: boolean;
}

export async function POST(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  let body: CreateAppointmentBody;
  try {
    body = (await request.json()) as CreateAppointmentBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const {
    webAccountId,
    patientId,
    wbactivityId,
    activityTypeId,
    mainCaregiverUserId,
    roomId,
    starttime,
    lengthtime,
  } = body;

  if (
    webAccountId == null ||
    patientId == null ||
    wbactivityId == null ||
    activityTypeId == null ||
    mainCaregiverUserId == null ||
    roomId == null ||
    !starttime?.trim() ||
    !lengthtime?.trim()
  ) {
    return NextResponse.json(
      { ok: false, message: "Missing required appointment fields." },
      { status: 400 },
    );
  }

  try {
    const payload = await postBookingResource(BOOKING_URLS.appointments, apiKey, {
      "webaccount-id": webAccountId,
      "wbactivity-id": wbactivityId,
      patient: {
        patient: {
          id: patientId,
        },
      },
      activitytype: {
        activitytype: {
          id: activityTypeId,
        },
      },
      "maincaregiver_user-id": mainCaregiverUserId,
      "room-id": roomId,
      starttime: starttime.trim(),
      lengthtime: lengthtime.trim(),
      smsreminder: true,
      smsconfirmation: true,
      emailconfirmation: true,
      createifnotexists: true,
    });

    const appointmentId = extractCreatedEntityId(payload);

    return NextResponse.json({
      ok: true,
      appointmentId: appointmentId ?? undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
