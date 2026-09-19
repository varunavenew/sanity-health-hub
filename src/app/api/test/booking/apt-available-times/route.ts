import { runWithBookingUpstreamEnv } from "@/lib/booking/bookingUpstreamEnv";
import { GET as liveGet } from "@/app/api/booking/apt-available-times/route";

/** TEST BFF → Laravel /api/test/v1/resources/aptavailabletimes */
export async function GET(request: Request) {
  return runWithBookingUpstreamEnv("test", () => liveGet(request));
}
