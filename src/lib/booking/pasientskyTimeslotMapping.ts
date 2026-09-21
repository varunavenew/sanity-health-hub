import type { SanityClinicListRow } from "@/lib/sanity/clinic-list-row";

export type PasientskyTimeslotMappingRow = {
  metodikaActivityId: number;
  timeslotTypeId: string;
  label?: string;
};

function normalizeMatchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Heuristic fallback when CMS mapping is missing (Moelv PatientSky timetyper). */
export function inferPasientskyTimeslotTypeIdFromServiceName(
  serviceName: string | undefined,
  timeslotTypes: Array<{ id: string; name: string }>,
): string | undefined {
  const serviceKey = normalizeMatchText(serviceName ?? "");
  if (!serviceKey || timeslotTypes.length === 0) return undefined;

  const rules: Array<{ test: (key: string) => boolean; pick: (name: string) => boolean }> = [
    {
      test: (key) => key.includes("vasectom") || key.includes("sterilis"),
      pick: (name) => normalizeMatchText(name).includes("vasectom"),
    },
    {
      test: (key) =>
        key.includes("areknut") ||
        key.includes("karkirurg") ||
        key.includes("aorta") ||
        key.includes("carotis"),
      pick: (name) => normalizeMatchText(name).includes("karkirurgisk"),
    },
    {
      test: (key) => key.includes("gynekolog") || key.includes("kvinne"),
      pick: (name) => normalizeMatchText(name).includes("gynekologisk"),
    },
    {
      test: (key) => key.includes("ortoped"),
      pick: (name) => normalizeMatchText(name).includes("ortoped"),
    },
    {
      test: (key) => key.includes("urolog"),
      pick: (name) => normalizeMatchText(name).includes("urolog"),
    },
  ];

  for (const rule of rules) {
    if (!rule.test(serviceKey)) continue;
    const hit = timeslotTypes.filter((row) => rule.pick(row.name));
    if (hit.length === 1) return hit[0].id;
  }

  return undefined;
}

/** Moelv PatientSky timetyper when CMS mappings are missing (developer parity). */
export const MOELV_PASIENTSKY_TIMESLOT_BY_METODIKA_ACTIVITY: Readonly<
  Record<number, string>
> = {
  /** Vurdering åreknuter → Karkirurgisk konsultasjon (closest Moelv timetype). */
  107: "67994dac-971a-11ed-917b-9af61bccbfa9",
};

export function resolvePasientskyTimeslotTypeId(input: {
  clinic?: SanityClinicListRow | null;
  metodikaActivityId?: number;
  serviceName?: string;
  timeslotTypes?: Array<{ id: string; name: string }>;
}): string | undefined {
  const activityId = input.metodikaActivityId;
  const mappings = input.clinic?.booking?.pasientskyTimeslotMappings;
  if (activityId != null && mappings?.length) {
    const fromCms = mappings.find((row) => row.metodikaActivityId === activityId);
    if (fromCms?.timeslotTypeId?.trim()) return fromCms.timeslotTypeId.trim();
  }

  if (activityId != null && MOELV_PASIENTSKY_TIMESLOT_BY_METODIKA_ACTIVITY[activityId]) {
    return MOELV_PASIENTSKY_TIMESLOT_BY_METODIKA_ACTIVITY[activityId];
  }

  if (input.timeslotTypes?.length) {
    return inferPasientskyTimeslotTypeIdFromServiceName(
      input.serviceName,
      input.timeslotTypes,
    );
  }

  return undefined;
}
