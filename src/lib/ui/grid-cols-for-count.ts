/** Grid column classes sized to item count — avoids empty tracks showing background gaps. */

function clamp(count: number, max: number): number {
  return Math.min(Math.max(count, 1), max);
}

/** gap-px bordered tile grids (ServicesListSection) — max 3 columns at lg. */
export function servicesTileGridClass(itemCount: number): string {
  const n = clamp(itemCount, 3);
  if (n === 1) return "grid grid-cols-1 max-w-2xl";
  if (n === 2) return "grid sm:grid-cols-2";
  return "grid sm:grid-cols-2 lg:grid-cols-3";
}

/** gap-px bordered tile grids (category segments) — max 4 columns at lg. */
export function segmentTileGridClass(itemCount: number): string {
  const n = clamp(itemCount, 4);
  if (n === 1) return "grid grid-cols-1 max-w-2xl";
  if (n === 2) return "grid md:grid-cols-2";
  if (n === 3) return "grid md:grid-cols-2 lg:grid-cols-3";
  return "grid md:grid-cols-2 lg:grid-cols-4";
}

/** Card grids with gap (audiences, reviews) — max 3 columns at md+. */
export function threeCardGridClass(itemCount: number): string {
  const n = clamp(itemCount, 3);
  if (n === 1) return "grid grid-cols-1 max-w-md";
  if (n === 2) return "grid sm:grid-cols-2";
  return "grid md:grid-cols-3";
}

/** Symptom cards — max 3 columns at lg. */
export function symptomCardGridClass(itemCount: number): string {
  const n = clamp(itemCount, 3);
  if (n === 1) return "grid grid-cols-1 max-w-lg";
  if (n === 2) return "grid sm:grid-cols-2";
  return "grid sm:grid-cols-2 lg:grid-cols-3";
}

/** Stats row — max 4 columns at md+. */
export function statsGridClass(itemCount: number): string {
  const n = clamp(itemCount, 4);
  if (n === 1) return "grid grid-cols-1 max-w-xs";
  if (n === 2) return "grid grid-cols-2 max-w-xl";
  if (n === 3) return "grid grid-cols-2 md:grid-cols-3";
  return "grid grid-cols-2 md:grid-cols-4";
}
