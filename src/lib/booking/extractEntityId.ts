import { unwrapList } from "@/lib/booking/upstream";

export type WebAccountCreatedIds = {
  /** Web account record id (`id` on webaccounts response). */
  webAccountId: number;
  /** Patient record id (`patient-id` on webaccounts response). */
  patientId: number;
};

function firstEntity(payload: unknown): Record<string, unknown> | null {
  const list = unwrapList(payload);
  const first = list[0];
  if (first && typeof first === "object" && first !== null) {
    return first as Record<string, unknown>;
  }

  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    const level1 = root.data;
    if (level1 && typeof level1 === "object" && level1 !== null && !Array.isArray(level1)) {
      const nested = level1 as Record<string, unknown>;
      const inner = nested.data;
      // POST webaccounts: { data: { data: { id, patient-id } } }
      if (inner && typeof inner === "object" && inner !== null && !Array.isArray(inner)) {
        return inner as Record<string, unknown>;
      }
      if (typeof nested.id === "number" && Number.isFinite(nested.id)) {
        return nested;
      }
    }
  }

  return null;
}

function readPatientId(row: Record<string, unknown>): number | null {
  const raw = row["patient-id"] ?? row.patientId ?? row.patient_id;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;

  const patient = row.patient;
  if (patient && typeof patient === "object") {
    const nested = patient as Record<string, unknown>;
    const inner = nested.patient;
    if (inner && typeof inner === "object") {
      const id = (inner as Record<string, unknown>).id;
      if (typeof id === "number" && Number.isFinite(id)) return id;
    }
    if (typeof nested.id === "number" && Number.isFinite(nested.id)) return nested.id;
  }

  return null;
}

/** Read web account `id` and linked `patient-id` from webaccounts POST response. */
export function extractWebAccountCreatedIds(payload: unknown): WebAccountCreatedIds | null {
  const row = firstEntity(payload);
  if (!row) return null;

  const webAccountId = row.id;
  if (typeof webAccountId !== "number" || !Number.isFinite(webAccountId)) return null;

  const patientId = readPatientId(row) ?? webAccountId;
  return { webAccountId, patientId };
}

function isDeactivated(row: Record<string, unknown>): boolean {
  return row.deactivated === true || row.deactivated === 1 || row.deactivated === "true";
}

/**
 * Pick an existing webaccount from GET `/webaccounts?patientnumber=…` results.
 * Prefers active accounts, then email match (when provided), then lowest id (oldest).
 */
export function pickExistingWebAccountIds(
  payload: unknown,
  options?: { email?: string },
): WebAccountCreatedIds | null {
  const list = unwrapList(payload).filter(
    (entry): entry is Record<string, unknown> =>
      !!entry && typeof entry === "object" && !Array.isArray(entry),
  );

  if (list.length === 0) return null;

  const email = options?.email?.trim().toLowerCase();
  const active = list.filter((row) => !isDeactivated(row));
  const pool = active.length > 0 ? active : list;

  const ranked = [...pool].sort((a, b) => {
    if (email) {
      const aMatch = String(a.email ?? "").trim().toLowerCase() === email ? 0 : 1;
      const bMatch = String(b.email ?? "").trim().toLowerCase() === email ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
    }
    const aId = typeof a.id === "number" ? a.id : Number.POSITIVE_INFINITY;
    const bId = typeof b.id === "number" ? b.id : Number.POSITIVE_INFINITY;
    return aId - bId;
  });

  const best = ranked[0];
  if (!best) return null;

  const webAccountId = best.id;
  if (typeof webAccountId !== "number" || !Number.isFinite(webAccountId)) return null;

  const patientId = readPatientId(best);
  // Metodika may return patient-id 0 for incomplete guest accounts; still reusable by webaccount id.
  if (patientId == null) return { webAccountId, patientId: webAccountId };
  if (patientId === 0) return { webAccountId, patientId: 0 };

  return { webAccountId, patientId };
}

/** Read created entity `id` from booking API POST responses. */
export function extractCreatedEntityId(payload: unknown): number | null {
  const list = unwrapList(payload);
  const first = list[0];
  if (first && typeof first === "object" && first !== null) {
    const id = (first as Record<string, unknown>).id;
    if (typeof id === "number" && Number.isFinite(id)) return id;
  }

  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    const data = root.data;
    if (data && typeof data === "object" && data !== null) {
      const nested = data as Record<string, unknown>;
      if (typeof nested.id === "number") return nested.id;
      const inner = nested.data;
      if (inner && typeof inner === "object" && inner !== null) {
        const id = (inner as Record<string, unknown>).id;
        if (typeof id === "number") return id;
      }
    }
  }

  return null;
}
