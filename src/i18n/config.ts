import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nb from "./locales/nb.json";
import en from "./locales/en.json";

const savedLang = localStorage.getItem("i18n-lang") || "nb";

i18n.use(initReactI18next).init({
  resources: {
    nb: { translation: nb },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "nb",
  interpolation: { escapeValue: false },
});

export default i18n;
