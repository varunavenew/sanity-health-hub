"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { appLocaleToI18n, syncI18nLanguage } from "@/lib/i18n/sync-language";

export function LocaleSync() {
  const params = useParams<{ locale?: string }>();
  useTranslation();
  const locale = params?.locale === "en" ? "en" : "no";
  const i18nCode = appLocaleToI18n(locale);

  useEffect(() => {
    syncI18nLanguage(i18nCode);
    const htmlLang = locale === "en" ? "en" : "no-NO";
    if (typeof document !== "undefined") {
      document.documentElement.lang = htmlLang;
    }
    try {
      localStorage.setItem("i18n-lang", i18nCode);
    } catch {
      /* ignore */
    }
  }, [locale, i18nCode]);

  return null;
}
