import {
  normalizePersonName,
  personNamesLooselyEqual,
} from "@/lib/booking/caregiverNameMatch";

export type PasientskyCalendarOption = {
  id: string;
  name: string;
};

/** Role prefixes on Pasientsky calendar labels, e.g. "Karkirurg Einar Brevik". */
const CALENDAR_ROLE_PREFIX =
  /^(gynekolog|karkirurg|nevrolog|ortoped|urolog|allmennlege|hjertespesialist|spesialist|fysioterapeut|psykolog|hudlege|revmatolog|gastrokirurg|endokrinolog|handterapeut|osteopat|sexolog|ernaeringsfysiolog|fostermedisiner|dr\.?|prof\.?)(\s+|$)/i;

export function stripPasientskyCalendarRolePrefix(label: string): string {
  let rest = label.trim();
  for (let i = 0; i < 4; i++) {
    const next = rest.replace(CALENDAR_ROLE_PREFIX, "").trim();
    if (next === rest) break;
    rest = next;
  }
  return rest || label.trim();
}

function firstAndLastKey(fullName: string): string | null {
  const normalized = normalizePersonName(fullName);
  const tokens = normalized.split(" ").filter(Boolean);
  if (tokens.length < 2) return null;
  return `${tokens[0]} ${tokens[tokens.length - 1]}`;
}

function matchOneSpecialistName(
  calendars: PasientskyCalendarOption[],
  specialistName: string,
): string | undefined {
  const name = specialistName.trim();
  if (!name) return undefined;

  const personCalendars = calendars.map((calendar) => ({
    ...calendar,
    personName: stripPasientskyCalendarRolePrefix(calendar.name),
  }));

  const exact = personCalendars.find((calendar) =>
    personNamesLooselyEqual(calendar.personName, name),
  );
  if (exact) return exact.id;

  const exactFullLabel = calendars.find((calendar) =>
    personNamesLooselyEqual(calendar.name, name),
  );
  if (exactFullLabel) return exactFullLabel.id;

  const targetFirstLast = firstAndLastKey(name);
  if (targetFirstLast) {
    const byFirstLast = personCalendars.filter(
      (calendar) => firstAndLastKey(calendar.personName) === targetFirstLast,
    );
    if (byFirstLast.length === 1) return byFirstLast[0].id;
  }

  const normalizedTarget = normalizePersonName(name);
  const contains = personCalendars.filter((calendar) => {
    const calendarName = normalizePersonName(calendar.name);
    const personNorm = normalizePersonName(calendar.personName);
    return (
      calendarName.includes(normalizedTarget) ||
      personNorm.includes(normalizedTarget) ||
      personNamesLooselyEqual(calendar.personName, name)
    );
  });
  if (contains.length === 1) return contains[0].id;

  const tokens = normalizedTarget.split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length >= 2) {
    const significant = tokens.filter(
      (token) => token.length > 2 || tokens.length <= 2,
    );
    const matchTokens =
      significant.length >= 2
        ? [significant[0], significant[significant.length - 1]]
        : tokens;
    const byTokens = personCalendars.filter((calendar) => {
      const calendarName = normalizePersonName(calendar.personName);
      return matchTokens.every((token) => calendarName.includes(token));
    });
    if (byTokens.length === 1) return byTokens[0].id;
  }

  return undefined;
}

export function pasientskyCalendarMatchCandidateNames(input: {
  name?: string | null;
  title?: string | null;
}): string[] {
  const name = input.name?.trim();
  const title = input.title?.trim();
  const candidates: string[] = [];
  if (name) candidates.push(name);
  if (title && name) candidates.push(`${title} ${name}`);
  return [...new Set(candidates)];
}

/**
 * Match a Sanity specialist name to a Pasientsky calendar ("Behandler").
 * Calendar labels are often "Gynekolog Alenka Bindas" or "Karkirurg Einar Brevik".
 */
export function matchPasientskyCalendarId(
  calendars: PasientskyCalendarOption[],
  specialistName: string | undefined | null,
  options?: { alternateNames?: string[] },
): string | undefined {
  if (calendars.length === 0) return undefined;

  const names = [
    ...pasientskyCalendarMatchCandidateNames({ name: specialistName }),
    ...(options?.alternateNames ?? []),
  ].filter(Boolean);

  for (const name of names) {
    const hit = matchOneSpecialistName(calendars, name);
    if (hit) return hit;
  }

  return undefined;
}
