// Helpers for "Legg i kalender" — generates a Google Calendar URL and an .ics file.
// Works on mobile (Safari/Chrome trigger .ics download which opens the native
// calendar app) and on desktop.

export interface CalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  /** Duration in minutes (default 30). */
  durationMinutes?: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Format Date as YYYYMMDDTHHmmssZ (UTC) for ICS/Google. */
const toICSDate = (d: Date): string =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const escapeICS = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export const buildGoogleCalendarUrl = ({
  title,
  description = "",
  location = "",
  start,
  durationMinutes = 30,
}: CalendarEventInput): string => {
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    details: description,
    location,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
};

export const buildICS = ({
  title,
  description = "",
  location = "",
  start,
  durationMinutes = 30,
}: CalendarEventInput): string => {
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const uid = `${start.getTime()}-${Math.random().toString(36).slice(2)}@cmedical`;
  const stamp = toICSDate(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CMedical//Booking//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/** Trigger a download of the .ics file. Safe on mobile + desktop. */
export const downloadICS = (input: CalendarEventInput, filename = "cmedical-time.ics"): void => {
  const blob = new Blob([buildICS(input)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Parse a duration string like "30 minutter" or "1 time" or "1 t 30 min" → minutes. */
export const parseDurationToMinutes = (duration?: string): number => {
  if (!duration) return 30;
  const text = duration.toLowerCase();
  let minutes = 0;
  const hourMatch = text.match(/(\d+)\s*(t|time|timer)/);
  if (hourMatch) minutes += parseInt(hourMatch[1], 10) * 60;
  const minMatch = text.match(/(\d+)\s*(m|min|minutt|minutter)/);
  if (minMatch) minutes += parseInt(minMatch[1], 10);
  return minutes || 30;
};

/** Combine a date and a "HH:mm" string into a Date in local time. */
export const combineDateAndTime = (date: Date, time: string): Date => {
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  const d = new Date(date);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
};
