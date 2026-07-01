import { BOOKING_URLS, fetchBookingResource, unwrapList } from "@/lib/booking/upstream";
import { mapWithConcurrency } from "@/lib/booking/resolveActivityLocations";

const PRICE_FETCH_CONCURRENCY = Number(process.env.BOOKING_PRICE_FETCH_CONCURRENCY || 4);

interface ApiItemPrice {
  price?: number;
  amount?: number;
  priceinctax?: number;
  priceextax?: number;
}

function parsePriceDigits(raw: string): string | null {
  const digits = raw.replace(/\s/g, "").trim();
  return digits && /^\d+$/.test(digits) ? digits : null;
}

const NAME_PRICE_PATTERNS = [
  /fra\s+kr\s*([\d\s]+)(?:,-)?/i,
  /(?:^|[\s,])(?:kr|nok|dkk)\s*([\d\s]+)(?:,-)?/i,
  /,\s*([\d\s]+),-/,
  /\s([\d\s]+),-\s*$/,
] as const;

/** Parse embedded price hints from Metodika activity names (fallback when itemPrices is missing). */
export function parsePriceFromActivityName(name: string): string {
  for (const pattern of NAME_PRICE_PATTERNS) {
    const match = name.match(pattern);
    if (!match) continue;
    const parsed = parsePriceDigits(match[1]);
    if (parsed) return parsed;
  }
  return "0";
}

/** Resolve display price: prefer embedded name hint, optional API when name has no price. */
export function resolveActivityPrice(
  rawName: string,
  procedureId: number | undefined,
  priceMap: Map<number, string>,
): string {
  const fromName = parsePriceFromActivityName(rawName);
  if (fromName !== "0") return fromName;
  if (procedureId !== undefined && priceMap.has(procedureId)) {
    const fromApi = priceMap.get(procedureId)!;
    if (fromApi !== "0") return fromApi;
  }
  return fromName;
}

/** Remove embedded price hints from activity display names. */
export function stripPriceFromActivityName(name: string): string {
  return name
    .replace(/\s*fra\s+kr\s*[\d\s]+(?:,-)?\s*/gi, " ")
    .replace(/\s*(?:kr|nok|dkk)\s*[\d\s]+(?:,-)?\s*/gi, " ")
    .replace(/,\s*[\d\s]+,-\s*$/g, "")
    .replace(/\s[\d\s]+,-\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizePriceAmount(amount: number | undefined): string | null {
  if (amount === undefined || !Number.isFinite(amount)) return null;
  return String(Math.round(amount));
}

function priceFromApiItem(entry: ApiItemPrice | undefined): string | null {
  if (!entry) return null;
  return normalizePriceAmount(
    entry.priceinctax ?? entry.priceextax ?? entry.price ?? entry.amount,
  );
}

/** Fetch price for one procedure id (`activity-id` / `item.procedure.id`). */
export async function fetchProcedurePrice(
  procedureId: number,
  apiKey: string,
): Promise<string | null> {
  const url = `${BOOKING_URLS.itemPrices}?item.procedure.id=${procedureId}`;
  const payload = await fetchBookingResource(url, apiKey);
  const prices = unwrapList(payload) as ApiItemPrice[];
  return priceFromApiItem(prices[0]);
}

/** Batch-fetch prices for many procedure ids (concurrency-limited, skips failures). */
export async function fetchProcedurePriceMap(
  procedureIds: number[],
  apiKey: string,
): Promise<Map<number, string>> {
  const unique = [...new Set(procedureIds)];
  const entries = await mapWithConcurrency(unique, PRICE_FETCH_CONCURRENCY, async (procedureId) => {
    try {
      const price = await fetchProcedurePrice(procedureId, apiKey);
      return [procedureId, price] as const;
    } catch {
      return [procedureId, null] as const;
    }
  });

  return new Map(
    entries.filter((entry): entry is [number, string] => entry[1] !== null),
  );
}
