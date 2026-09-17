import { parseDurationMinutes } from "@/lib/booking/duration";

export type NormalizedFreeTimeSlot = {
  startDateTime: string;
  time: string;
  durationMinutes?: number;
  lengthTime?: string;
  caregiverUserId?: number;
  roomId?: number;
  locationId?: number;
};

interface ApiFreeTime {
  startdatetime?: string;
  timelength?: string;
  "caregiver_user-id"?: number;
  caregiverUserId?: number;
  "room-id"?: number;
  roomId?: number;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeSlot(
  entry: ApiFreeTime,
  locationId?: number,
): NormalizedFreeTimeSlot | null {
  const startDateTime = entry.startdatetime?.trim();
  if (!startDateTime) return null;

  const time = formatTime(startDateTime);
  if (!time) return null;

  const timelength = entry.timelength?.trim();
  const durationMinutes = parseDurationMinutes(timelength);

  return {
    startDateTime,
    time,
    ...(durationMinutes != null ? { durationMinutes } : {}),
    ...(timelength ? { lengthTime: timelength } : {}),
    caregiverUserId: entry["caregiver_user-id"] ?? entry.caregiverUserId,
    roomId: entry["room-id"] ?? entry.roomId,
    ...(locationId != null ? { locationId } : {}),
  };
}

export function normalizeFreetimeSlots(
  rawSlots: unknown[],
  locationId?: number,
): NormalizedFreeTimeSlot[] {
  return rawSlots
    .map((entry) => normalizeSlot(entry as ApiFreeTime, locationId))
    .filter((item): item is NormalizedFreeTimeSlot => item !== null)
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );
}
