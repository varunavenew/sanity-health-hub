"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

/**
 * Sanity CMS language for GROQ ($lang) and normalizeI18n.
 * Prefer URL `[locale]` so the first fetch matches the page language
 * (i18next may still be syncing from a previous route).
 */
export function useSanityContentLang(): "no" | "en" {
  const params = useParams<{ locale?: string }>();
  const routeLocale = params?.locale;
  const { i18n } = useTranslation();

  if (routeLocale === "en") return "en";
  if (routeLocale === "nb" || routeLocale === "no") return "no";

  const lang = i18n.language || "nb";
  return lang.startsWith("en") ? "en" : "no";
}

export function appLocaleToSanityLang(locale: string): "no" | "en" {
  return locale === "en" ? "en" : "no";
}
