import { NextResponse } from "next/server";
import { buildBookingActivityGroupsCatalog } from "@/lib/booking/activity-groups-catalog";

export type { BookingCategoryFromApi as BookingCategory } from "@/lib/booking/activity-groups-catalog";

export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const includeApiPrices = searchParams.get("prices") === "api";
  const baseDate =
    searchParams.get("basedate") ?? searchParams.get("baseDate") ?? undefined;

  try {
    const categories = await buildBookingActivityGroupsCatalog(apiKey, {
      includeApiPrices,
      baseDate,
    });

    return NextResponse.json(
      { ok: true, categories },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    console.error("[booking/activity-groups] error:", message);
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
