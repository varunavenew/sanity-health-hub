"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { appLocaleToI18n, syncI18nLanguage } from "@/lib/i18n/sync-language";

export function LocaleSync() {
  const params = useParams<{ locale?: string }>();
  const { i18n } = useTranslation();
  const locale = params?.locale === "en" ? "en" : "nb";
  const i18nCode = appLocaleToI18n(locale);

  syncI18nLanguage(i18nCode);

  useEffect(() => {
    const htmlLang = locale === "en" ? "en" : "nb-NO";
    if (typeof document !== "undefined") {
      document.documentElement.lang = htmlLang;
    }
    if (i18n.language !== i18nCode) {
      void i18n.changeLanguage(i18nCode);
    }
    try {
      localStorage.setItem("i18n-lang", i18nCode);
    } catch {
      /* ignore */
    }
  }, [locale, i18n]);

  return null;
}
