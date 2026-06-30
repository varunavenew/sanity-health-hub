"use client";

import { useTranslation } from "react-i18next";
import type { NavRouteId } from "@/lib/i18n/nav-paths";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { pathForNavId } from "@/lib/routing/nav-cms-paths";

const FALLBACK_PATHS: Partial<Record<NavRouteId, { no: string; en: string }>> = {
  about: { no: "/om-oss", en: "/about" },
  clinics: { no: "/klinikker", en: "/clinics" },
  specialists: { no: "/spesialister", en: "/specialists" },
  services: { no: "/tjenester", en: "/services" },
};
export function useNavCmsPath(navId: NavRouteId): string {
  const { index } = useCmsRouteContext();
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "no";
  const fromCms = index ? pathForNavId(index, navId, lang) : "";
  if (fromCms) return fromCms;
  return FALLBACK_PATHS[navId]?.[lang] || "";
}
