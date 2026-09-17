import { runWithBookingUpstreamEnv } from "@/lib/booking/bookingUpstreamEnv.server";
import { GET as liveGet } from "@/app/api/booking/availability/route";

/** TEST BFF → Laravel /api/test/v1/resources/* → Metodika TEST. Reuses LIVE handler. */
export async function GET(request: Request) {
  return runWithBookingUpstreamEnv("test", () => liveGet(request));
}
