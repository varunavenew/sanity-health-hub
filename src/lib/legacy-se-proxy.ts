import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_ASSET_PREFIX = "/__legacy";

const SKIP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "cookie",
  "accept",
  "accept-language",
  "accept-encoding",
  "user-agent",
  "origin",
  "referer",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-dest",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
]);

export function readLegacySeOrigin(): string | undefined {
  const raw = process.env.LEGACY_SE_ORIGIN?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/+$/, "");
}

export function getLegacyAssetPrefix(): string {
  const raw = process.env.LEGACY_SE_ASSET_PREFIX?.trim();
  const prefix = raw ? raw.replace(/\/+$/, "") : DEFAULT_ASSET_PREFIX;
  return prefix.startsWith("/") ? prefix : `/${prefix}`;
}

export function isLegacySeProxyPath(pathname: string): boolean {
  if (pathname === "/se" || pathname.startsWith("/se/")) return true;

  const prefix = getLegacyAssetPrefix();
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return true;

  if (pathname === "/files" || pathname.startsWith("/files/")) return true;

  if (pathname === "/api/booking") return true;

  if (pathname.startsWith("/api/booking/se")) return true;
  if (pathname === "/api/booking/categories") return true;
  if (pathname === "/api/booking/clinics") return true;
  if (pathname.startsWith("/api/specialists/random")) return true;
  if (pathname.startsWith("/api/coordinates")) return true;

  return false;
}

export function upstreamPathForLegacyProxy(
  pathname: string,
  search: string,
): string {
  const prefix = getLegacyAssetPrefix();
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const rest = pathname.slice(prefix.length) || "/";
    return `${rest}${search}`;
  }
  return `${pathname}${search}`;
}

export function rewriteLegacyLocation(
  location: string,
  legacyOrigin: string,
  publicOrigin: string,
): string {
  try {
    const loc = new URL(location, legacyOrigin);
    const legacy = new URL(legacyOrigin);
    if (loc.host === legacy.host) {
      return `${publicOrigin}${loc.pathname}${loc.search}${loc.hash}`;
    }
  } catch {
    /* keep original */
  }
  return location;
}

export function rewriteLegacyText(
  body: string,
  legacyOrigin: string,
  publicOrigin: string,
  assetPrefix: string = getLegacyAssetPrefix(),
): string {
  let out = body.split(legacyOrigin).join(publicOrigin);
  const escapedPrefix = assetPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  out = out.replace(
    new RegExp(`(?<!${escapedPrefix})/_next/`, "g"),
    `${assetPrefix}/_next/`,
  );
  return out;
}

/** HTML, CSS, and JS all contain `/_next/` paths that must stay on the proxy prefix. */
function shouldRewriteLegacyBody(contentType: string): boolean {
  return (
    contentType.includes("text/") ||
    contentType.includes("javascript") ||
    contentType.includes("json") ||
    contentType.includes("xml")
  );
}

export async function proxyLegacySeRequest(
  request: NextRequest,
): Promise<NextResponse> {
  const origin = readLegacySeOrigin();
  if (!origin) {
    return new NextResponse("LEGACY_SE_ORIGIN is not configured", {
      status: 502,
    });
  }

  const upstreamPath = upstreamPathForLegacyProxy(
    request.nextUrl.pathname,
    request.nextUrl.search,
  );
  const upstreamUrl = new URL(upstreamPath, origin);
  const publicOrigin = request.nextUrl.origin;

  const headers = new Headers(request.headers);
  headers.set("host", new URL(origin).host);
  headers.set(
    "x-forwarded-host",
    request.headers.get("x-forwarded-host") || request.nextUrl.host,
  );
  headers.set(
    "x-forwarded-proto",
    request.headers.get("x-forwarded-proto") ||
      request.nextUrl.protocol.replace(":", ""),
  );
  headers.set("x-cmedical-legacy-proxy", "1");
  headers.delete("connection");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    Object.assign(init, { duplex: "half" });
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, init);
  } catch {
    return new NextResponse("Legacy Swedish site is unreachable", {
      status: 502,
    });
  }

  const outHeaders = new Headers();
  outHeaders.set("x-cmedical-legacy-proxy", "1");
  upstreamRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (SKIP_RESPONSE_HEADERS.has(lower)) return;
    if (lower === "location") {
      outHeaders.append(
        key,
        rewriteLegacyLocation(value, origin, publicOrigin),
      );
      return;
    }
    outHeaders.append(key, value);
  });

  // `fetch` already decompresses the body. Forwarding content-encoding/br
  // makes the browser try to inflate the plaintext again (unstyled CSS/JS).
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");

  const contentType = upstreamRes.headers.get("content-type") || "";
  if (shouldRewriteLegacyBody(contentType) && request.method !== "HEAD") {
    const body = rewriteLegacyText(
      await upstreamRes.text(),
      origin,
      publicOrigin,
    );
    return new NextResponse(body, {
      status: upstreamRes.status,
      headers: outHeaders,
    });
  }

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: outHeaders,
  });
}
