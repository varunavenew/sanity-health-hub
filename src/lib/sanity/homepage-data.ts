import { HOMEPAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";
import { sortBySlug, type SortLocale } from "@/lib/sortAlphabetical";
import type { SanitySeoFields } from "@/lib/seo/seo-fields";

export type HomepageHeroSlide = {
  id: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  image: string;
  objectPosition: string;
};

export type HomepageCategoryCard = {
  id: string;
  title: string;
  path: string;
  image: string;
};

export type HomepageData = {
  tagline?: string;
  promoBlocksTitle: string;
  statsBar: { value: string; label: string }[];
  heroSlides: HomepageHeroSlide[];
  categoryCards: HomepageCategoryCard[];
  valueBadges: string[];
  promoBlocks: {
    id: string;
    title: string;
    description: string;
    cta: string;
    path: string;
    image: string;
  }[];
  pageSections: ReturnType<typeof normalizePageSections>;
  seo?: SanitySeoFields;
};

export function mapHomepageDocument(
  data: Record<string, unknown> | null | undefined,
  lang: SortLocale,
): HomepageData | null {
  if (!data) return null;

  const heroBanner = data.heroBanner as { slides?: unknown[] } | undefined;
  const serviceCategories = (data.serviceCategories as unknown[]) || [];
  const valueBadges = (data.valueBadges as unknown[]) || [];
  const promoBlocks = (data.promoBlocks as unknown[]) || [];
  const statsBar = (data.statsBar as unknown[]) || [];

  return {
    tagline: typeof data.tagline === "string" ? data.tagline : undefined,
    promoBlocksTitle:
      typeof data.promoBlocksTitle === "string" ? data.promoBlocksTitle : "",
    statsBar: statsBar.map((s) => {
      const row = s as { value?: string; label?: string };
      return { value: row.value || "", label: row.label || "" };
    }),
    heroSlides: (heroBanner?.slides || [])
      .map((slide, i) => {
        const s = slide as Record<string, unknown>;
        return {
          id: `slide-${i}`,
          label: (s.heading as string) || "",
          subtitle: (s.subheading as string) || "",
          cta: (s.ctaText as string) || "Les mer",
          ctaPath: (s.ctaLink as string) || "/",
          image: (s.image as string) || "",
          objectPosition: "center 30%",
        };
      })
      .filter((s) => s.image && s.label),
    categoryCards: sortBySlug(
      serviceCategories
        .map((c) => {
          const row = c as Record<string, unknown>;
          const slug = row.slug as string | undefined;
          return {
            id: slug || "",
            title: (row.title as string) || "",
            path: slug ? `/${slug}` : "",
            image: (row.heroImage as string) || "",
          };
        })
        .filter((c) => c.image && c.title),
      (c) => c.id || c.title,
      lang,
    ),
    valueBadges: valueBadges.map((v) => {
      if (typeof v === "string") return v;
      const row = v as { label?: string };
      return row.label || "";
    }),
    promoBlocks: promoBlocks.map((p, i) => {
      const row = p as Record<string, unknown>;
      return {
        id: `promo-${i}`,
        title: (row.title as string) || "",
        description: (row.description as string) || "",
        cta: (row.ctaText as string) || "Les mer",
        path: (row.ctaLink as string) || "/",
        image: (row.image as string) || "",
      };
    }),
    pageSections: normalizePageSections(data.pageSections),
    seo: data.seo as SanitySeoFields | undefined,
  };
}

/** Server-side homepage payload for RSC + React Query hydration. */
export async function fetchHomepageData(
  lang: "no" | "en",
): Promise<HomepageData | null> {
  const raw = await sanityFetchCached<Record<string, unknown> | null>({
    query: HOMEPAGE_QUERY,
    params: { lang },
    key: ["sanity", "homepage", lang, HOMEPAGE_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.homepage,
      SANITY_CACHE_TAGS.type("homepage"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.homepage,
  });
  if (!raw) return null;
  return mapHomepageDocument(normalizeI18n(raw, lang) as Record<string, unknown>, lang);
}
