import { personNamesLooselyEqual } from "@/lib/booking/caregiverNameMatch";

export type PasientskyCalendarOption = {
  id: string;
  name: string;
};

/**
 * Match a Sanity specialist name to a Pasientsky calendar ("Behandler").
 * Calendar labels are often "Gynekolog Alenka Bindas".
 */
export function matchPasientskyCalendarId(
  calendars: PasientskyCalendarOption[],
  specialistName: string | undefined | null,
): string | undefined {
  const name = specialistName?.trim();
  if (!name || calendars.length === 0) return undefined;

  const exact = calendars.find((calendar) =>
    personNamesLooselyEqual(calendar.name, name),
  );
  if (exact) return exact.id;

  const normalizedTarget = name.toLowerCase();
  const contains = calendars.filter((calendar) => {
    const calendarName = calendar.name.toLowerCase();
    return (
      calendarName.includes(normalizedTarget) ||
      personNamesLooselyEqual(calendar.name, name)
    );
  });
  if (contains.length === 1) return contains[0].id;

  // Last/first token fallback: "Alenka Bindas" inside "Gynekolog Alenka Bindas"
  const tokens = normalizedTarget.split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length >= 2) {
    const byTokens = calendars.filter((calendar) => {
      const calendarName = calendar.name.toLowerCase();
      return tokens.every((token) => calendarName.includes(token));
    });
    if (byTokens.length === 1) return byTokens[0].id;
  }

  return undefined;
}
