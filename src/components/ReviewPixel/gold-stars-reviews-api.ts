/**
 * Direct read of the Gold Stars widget review feed — the same endpoint
 * `emr-simple-slider` calls internally (CORS: `*`). The API has no location
 * filter, so we fetch every page once and filter by `location_id` client-side.
 *
 * Known locations (Oct 2026): 86 = Majorstuen, 87 = Bekkestua.
 */
import { DEFAULT_GOLD_STARS_WIDGET_ID } from "./gold-stars-slider-config";

export const GOLD_STARS_API_HOST = "onlinerep.goldstars.no";

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

export type GoldStarsReview = {
  id: number;
  location_id: number;
  rating: number;
  hidden?: boolean;
  [key: string]: unknown;
};

type ReviewsPage = {
  data?: GoldStarsReview[];
  meta?: { next_cursor?: string | null } | null;
};

async function fetchAllWidgetReviews(widgetId: string): Promise<GoldStarsReview[]> {
  const all: GoldStarsReview[] = [];
  const seen = new Set<number>();
  let cursor: string | null | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await fetch(`https://${GOLD_STARS_API_HOST}/api/widgets/${widgetId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ per_page: PAGE_SIZE, ...(cursor ? { cursor } : {}) }),
    });
    if (!response.ok) throw new Error(`Gold Stars reviews request failed (${response.status})`);

    const json = (await response.json()) as ReviewsPage;
    const rows = Array.isArray(json.data) ? json.data : [];
    rows.forEach((row) => {
      if (seen.has(row.id)) return;
      seen.add(row.id);
      all.push(row);
    });

    cursor = json.meta?.next_cursor;
    if (!cursor || rows.length === 0) break;
  }

  return all;
}

export function fetchGoldStarsLocationReviews(
  locationId: number,
  widgetId: string = DEFAULT_GOLD_STARS_WIDGET_ID,
): Promise<GoldStarsReview[]> {
  return fetchAllWidgetReviews(widgetId).then((rows) =>
    rows.filter((row) => row.location_id === locationId && !row.hidden),
  );
}
