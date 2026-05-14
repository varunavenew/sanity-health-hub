"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function LocaleSync() {
  const params = useParams<{ locale?: string }>();
  const { i18n } = useTranslation();
  const locale = params?.locale === "en" ? "en" : "nb";

  useEffect(() => {
    const i18nCode = locale === "en" ? "en" : "nb";
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
