import i18n from "@/i18n/config";

export type I18nUiLang = "nb" | "en";

export function appLocaleToI18n(locale: string): I18nUiLang {
  return locale === "en" ? "en" : "nb";
}

/** Keep SSR and client hydration aligned with the URL locale (not localStorage). */
export function syncI18nLanguage(lang: I18nUiLang): void {
  if (i18n.resolvedLanguage === lang || i18n.language === lang) return;
  // Use i18next API so subscribers re-render consistently in production.
  void i18n.changeLanguage(lang);
}
