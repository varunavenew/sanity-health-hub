import { unwrapList } from "@/lib/booking/upstream";

function readNestedId(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    if (typeof obj.id === "number") return obj.id;
    const nested = obj.activitytype;
    if (nested) return readNestedId(nested);
  }
  return null;
}

/** Resolve `activitytype.id` from a wbactivities GET payload. */
export function parseActivityTypeId(payload: unknown): number | null {
  const entries = unwrapList(payload);
  const activity = entries[0];
  if (!activity || typeof activity !== "object") return null;

  const row = activity as Record<string, unknown>;
  const direct =
    row["activitytype-id"] ??
    row.activitytypeId ??
    readNestedId(row.activitytype);

  return typeof direct === "number" ? direct : null;
}
