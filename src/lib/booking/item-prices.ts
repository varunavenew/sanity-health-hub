import { BOOKING_URLS, fetchBookingResource, unwrapList } from "@/lib/booking/upstream";

interface ApiItemPrice {
  price?: number;
  amount?: number;
}

/** Parse "fra kr 2 100" style price hints from activity names. */
export function parsePriceFromActivityName(name: string): string {
  const match =
    name.match(/fra\s+kr\s*([\d\s]+)/i) ?? name.match(/kr\s*([\d\s]+)/i);
  if (match) return match[1].replace(/\s/g, "").trim();
  return "0";
}

function normalizePriceAmount(amount: number | undefined): string | null {
  if (amount === undefined || !Number.isFinite(amount)) return null;
  return String(amount);
}

/** Fetch price for one procedure id (`activity-id` / `item.procedure.id`). */
export async function fetchProcedurePrice(
  procedureId: number,
  apiKey: string,
): Promise<string | null> {
  const url = `${BOOKING_URLS.itemPrices}/?item.procedure.id=${procedureId}`;
  const payload = await fetchBookingResource(url, apiKey);
  const prices = unwrapList(payload) as ApiItemPrice[];
  return normalizePriceAmount(prices[0]?.price ?? prices[0]?.amount);
}

/** Batch-fetch prices for many procedure ids (parallel, skips failures). */
export async function fetchProcedurePriceMap(
  procedureIds: number[],
  apiKey: string,
): Promise<Map<number, string>> {
  const unique = [...new Set(procedureIds)];
  const entries = await Promise.all(
    unique.map(async (procedureId) => {
      try {
        const price = await fetchProcedurePrice(procedureId, apiKey);
        return [procedureId, price] as const;
      } catch {
        return [procedureId, null] as const;
      }
    }),
  );

  return new Map(
    entries.filter((entry): entry is [number, string] => entry[1] !== null),
  );
}
