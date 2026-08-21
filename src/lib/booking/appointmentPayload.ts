/** Metodika appointment categories — online booking defaults to Privat. */
export const METODIKA_APPOINTMENT_CATEGORY_PRIVAT = 1;

export type AppointmentCreateInput = {
  webAccountId: number;
  patientId: number;
  wbactivityId: number;
  activityTypeId: number;
  mainCaregiverUserId: number;
  roomId: number;
  starttime: string;
  lengthtime: string;
  appointmentCategoryId?: number;
  /** Optional patient message — Metodika `note` on POST /appointments/. */
  note?: string | null;
};

export function buildAppointmentCreateBody(
  input: AppointmentCreateInput,
): Record<string, unknown> {
  const categoryId =
    input.appointmentCategoryId ?? METODIKA_APPOINTMENT_CATEGORY_PRIVAT;

  const body: Record<string, unknown> = {
    "webaccount-id": input.webAccountId,
    "wbactivity-id": input.wbactivityId,
    patient: {
      patient: {
        id: input.patientId,
      },
    },
    activitytype: {
      activitytype: {
        id: input.activityTypeId,
      },
    },
    appointmentcategory: {
      appointmentcategory: {
        id: categoryId,
      },
    },
    "maincaregiver_user-id": input.mainCaregiverUserId,
    "room-id": input.roomId,
    starttime: input.starttime.trim(),
    lengthtime: input.lengthtime.trim(),
    smsreminder: true,
    smsconfirmation: true,
    emailconfirmation: true,
    createifnotexists: true,
  };

  const note = input.note?.trim();
  if (note) body.note = note;

  return body;
}
