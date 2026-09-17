/** Pure helper — safe to import from client bundles (no Node/server deps). */
export function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const level1 = root.data;

  if (Array.isArray(level1)) return level1;
  if (level1 && typeof level1 === "object") {
    const nested = (level1 as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested;
  }

  if (Array.isArray(root.result)) return root.result;
  return [];
}
