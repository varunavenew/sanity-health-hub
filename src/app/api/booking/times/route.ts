import { NextResponse } from "next/server";
import { fetchProcedurePrice } from "@/lib/booking/item-prices";

/**
 * GET ?activity-id=123 or ?item.procedure.id=123
 * Proxies Metodika itemprices for a single procedure.
 */
export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("activity-id") ?? searchParams.get("item.procedure.id");
  const procedureId = rawId ? Number.parseInt(rawId, 10) : Number.NaN;

  if (!Number.isFinite(procedureId) || procedureId <= 0) {
    return NextResponse.json(
      { ok: false, message: "Missing or invalid procedure id query parameter." },
      { status: 400 },
    );
  }

  try {
    const price = await fetchProcedurePrice(procedureId, apiKey);
    if (price === null) {
      return NextResponse.json(
        { ok: false, message: `No price found for procedure ${procedureId}.` },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, procedureId, price });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
