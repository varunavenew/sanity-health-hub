"use client";

import { useEffect } from "react";

type ClientDocumentHead = {
  title: string;
  description: string;
  canonical: string;
  noIndex?: boolean;
  ogTitle: string;
  ogDescription: string;
  ogType?: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  ogImage?: string;
  publishedAt?: string;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const hreflangPart = hreflang ? `[hreflang="${hreflang}"]` : ":not([hreflang])";
  const selector = `link[rel="${rel}"]${hreflangPart}`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Upserts head tags on the client without removing them on unmount (avoids removeChild races). */
export function useClientDocumentHead(spec: ClientDocumentHead | null) {
  useEffect(() => {
    if (!spec || typeof document === "undefined") return;

    document.title = spec.title;
    upsertMeta("name", "description", spec.description);
    upsertLink("canonical", spec.canonical);
    upsertLink("alternate", spec.canonical, "nb-NO");
    upsertLink("alternate", spec.canonical, "en");
    upsertLink("alternate", spec.canonical, "x-default");

    if (spec.noIndex) {
      upsertMeta("name", "robots", "noindex, nofollow");
    }

    upsertMeta("property", "og:title", spec.ogTitle);
    upsertMeta("property", "og:description", spec.ogDescription);
    upsertMeta("property", "og:url", spec.canonical);
    upsertMeta("property", "og:type", spec.ogType ?? "website");
    upsertMeta("property", "og:locale", spec.ogLocale);
    upsertMeta("property", "og:locale:alternate", spec.ogLocaleAlternate);
    upsertMeta("property", "og:site_name", "CMedical");
    if (spec.ogImage) upsertMeta("property", "og:image", spec.ogImage);
    if (spec.publishedAt) {
      upsertMeta("property", "article:published_time", spec.publishedAt);
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", spec.ogTitle);
    upsertMeta("name", "twitter:description", spec.ogDescription);
  }, [spec]);
}
