import { locales } from "@/lib/i18n/routing";

/** Path segments that should not be indexed (demos, internal tools). */
const NOINDEX_SEGMENTS = [
  "demoer",
  "design-demoer",
  "icon-preview",
  "fertilitet-design",
  "gynekologi-design",
  "godkjenning",
] as const;

/** `robots.txt` disallow entries for all locales. */
export function robotsDisallowPaths(): string[] {
  const paths = ["/api/"];
  for (const locale of locales) {
    for (const segment of NOINDEX_SEGMENTS) {
      paths.push(`/${locale}/${segment}`);
    }
  }
  return paths;
}
