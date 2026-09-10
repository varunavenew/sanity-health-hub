import "server-only";

import { THEME_PAGE_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { mapThemePageData, type ThemePageData } from "@/lib/sanity/theme-page-data";

/** Server-side theme page payload for RSC + hydration (mirrors `useThemePage`). */
export async function fetchThemePageData(
  slug: string,
  lang: "no" | "en",
): Promise<ThemePageData | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    THEME_PAGE_QUERY,
    { slug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Parameters<typeof mapThemePageData>[0];
  return mapThemePageData(normalized);
}
