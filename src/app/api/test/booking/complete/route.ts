import { runWithBookingUpstreamEnv } from "@/lib/booking/bookingUpstreamEnv.server";
import { POST as livePost } from "@/app/api/booking/complete/route";

/** TEST BFF → Laravel /api/test/… → Metodika TEST appointments. Reuses LIVE handler. */
export async function POST(request: Request) {
  return runWithBookingUpstreamEnv("test", () => livePost(request));
}
