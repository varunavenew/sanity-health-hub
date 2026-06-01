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
import { sanityClient } from "@/lib/sanityClient";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0] as { value?: unknown } | undefined;
    if (first && typeof first.value === "string") return first.value;
  }
  if (typeof value === "object" && "value" in (value as object)) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
  return "";
}

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
    tagline: asPlainString(data.tagline) || undefined,
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
          label: asPlainString(s.heading),
          subtitle: asPlainString(s.subheading),
          cta: asPlainString(s.ctaText) || "Les mer",
          ctaPath: asPlainString(s.ctaLink) || "/",
          image: asPlainString(s.image),
          objectPosition: "center 30%",
        };
      })
      .filter((s) => s.image && s.label),
    categoryCards: sortBySlug(
      serviceCategories
        .map((c) => {
          const row = c as Record<string, unknown>;
          const slug = asPlainString(row.slug);
          return {
            id: slug || "",
            title: asPlainString(row.title),
            path: slug ? `/${slug}` : "",
            image: asPlainString(row.heroImage),
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

async function fetchHomepageRaw(
  lang: "no" | "en",
): Promise<Record<string, unknown> | null> {
  return sanityClient.fetch<Record<string, unknown> | null>(HOMEPAGE_QUERY, { lang });
}

/** Server-side homepage payload for RSC + React Query hydration. */
export async function fetchHomepageData(
  lang: "no" | "en",
): Promise<HomepageData | null> {
  let raw = await sanityFetchCached<Record<string, unknown> | null>({
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

  // Avoid serving a cached empty homepage when the first build had no Sanity env.
  if (!raw) {
    raw = await fetchHomepageRaw(lang);
  }

  if (!raw) return null;
  return mapHomepageDocument(normalizeI18n(raw, lang) as Record<string, unknown>, lang);
}
