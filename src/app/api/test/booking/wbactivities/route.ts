import { runWithBookingUpstreamEnv } from "@/lib/booking/bookingUpstreamEnv.server";
import { GET as liveGet } from "@/app/api/booking/wbactivities/route";

/** TEST BFF → Laravel /api/test/v1/resources/wbactivities. Reuses LIVE handler. */
export async function GET(request: Request) {
  return runWithBookingUpstreamEnv("test", () => liveGet(request));
}
