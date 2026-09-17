import { AsyncLocalStorage } from "node:async_hooks";

/** Upstream Metodika profile for Next booking BFF → Laravel. Default is LIVE. */
export type BookingUpstreamEnv = "live" | "test";

const bookingUpstreamAls = new AsyncLocalStorage<BookingUpstreamEnv>();

const TEST_UPSTREAM_PATH = "/api/test/v1/resources";
const LIVE_UPSTREAM_PATH = "/api/v1/resources";

/** Local `.env.local` only — never set on Vercel production. */
export function isLocalMetodikaTestUpstream(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.BOOKING_METODIKA_UPSTREAM?.trim().toLowerCase() === "test";
}

function resolveDefaultBookingUpstreamEnv(): BookingUpstreamEnv {
  return isLocalMetodikaTestUpstream() ? "test" : "live";
}

export function runWithBookingUpstreamEnv<T>(
  env: BookingUpstreamEnv,
  fn: () => T,
): T {
  return bookingUpstreamAls.run(env, fn);
}

export function currentBookingUpstreamEnv(): BookingUpstreamEnv {
  return bookingUpstreamAls.getStore() ?? resolveDefaultBookingUpstreamEnv();
}

export function resolveTestBookingApiBaseFromLive(liveBase: string): string {
  const trimmed = liveBase.replace(/\/$/, "");
  if (trimmed.includes(TEST_UPSTREAM_PATH)) return trimmed;
  if (trimmed.includes(LIVE_UPSTREAM_PATH)) {
    return trimmed.replace(LIVE_UPSTREAM_PATH, TEST_UPSTREAM_PATH);
  }
  return `${trimmed}${TEST_UPSTREAM_PATH}`;
}

export function logMetodikaUpstreamConfiguration(source: string): void {
  const env = resolveDefaultBookingUpstreamEnv();
  const explicitTest = process.env.TEST_BOOKING_API_BASE_URL?.trim();
  const liveBase =
    process.env.BOOKING_API_BASE_URL?.trim() ||
    "http://13.50.107.42/api/v1/resources";
  const testBase = explicitTest || resolveTestBookingApiBaseFromLive(liveBase);

  console.log(
    [
      "",
      "Metodika booking upstream",
      `Source: ${source}`,
      `Default profile: ${env}`,
      `LIVE base: ${liveBase.replace(/\/$/, "")}`,
      `TEST base: ${testBase.replace(/\/$/, "")}`,
      `Environment: ${process.env.NODE_ENV ?? "unknown"}`,
      "",
    ].join("\n"),
  );
}
