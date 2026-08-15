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

export function rewriteLegacyHtml(
  html: string,
  legacyOrigin: string,
  publicOrigin: string,
  assetPrefix: string = getLegacyAssetPrefix(),
): string {
  let out = html.split(legacyOrigin).join(publicOrigin);
  const escapedPrefix = assetPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  out = out.replace(
    new RegExp(`(?<!${escapedPrefix})/_next/`, "g"),
    `${assetPrefix}/_next/`,
  );
  return out;
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

  const contentType = upstreamRes.headers.get("content-type") || "";
  if (contentType.includes("text/html") && request.method !== "HEAD") {
    const html = rewriteLegacyHtml(
      await upstreamRes.text(),
      origin,
      publicOrigin,
    );
    outHeaders.delete("content-encoding");
    outHeaders.delete("content-length");
    return new NextResponse(html, {
      status: upstreamRes.status,
      headers: outHeaders,
    });
  }

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: outHeaders,
  });
}
