import type { Specialist } from "@/lib/sanity/specialist-types";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import type { SanitySpecialist } from "@/hooks/useSanity";
import { resolveSpecialistsDisplayMode } from "@/lib/sanity/specialists-display-mode";

export type HomepageSpecialistsDisplayMode = "all" | "manual" | "category";

export type HomepageSpecialistsCategoryRef = {
  categoryId?: string;
  slug?: string;
};

export type HomepageSpecialistsSectionConfig = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  displayMode?: HomepageSpecialistsDisplayMode;
  specialists?: { slug: string }[];
  categories?: HomepageSpecialistsCategoryRef[];
  seeAllLabel?: string;
  seeAllHref?: string;
  maxItems?: number;
  layout?: "carousel" | "grid";
  randomizeOrder?: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function applyMaxItems<T>(items: T[], maxItems?: number): T[] {
  if (typeof maxItems !== "number" || maxItems < 1) return items;
  return items.slice(0, maxItems);
}

function specialistMatchesAnyCategory(
  specialist: Specialist,
  categories: HomepageSpecialistsCategoryRef[],
): boolean {
  return categories.some((category) => {
    const key = category.categoryId || category.slug;
    return key ? specialistMatchesCategory(specialist, key) : false;
  });
}

/** Resolve homepage specialists from Medical Content + homepage display settings. */
export function resolveHomepageSpecialists(
  config: HomepageSpecialistsSectionConfig | undefined,
  all: Specialist[],
): Specialist[] {
  const mode = resolveSpecialistsDisplayMode(config?.displayMode);
  if (!mode) return [];

  let resolved: Specialist[];

  if (mode === "manual") {
    if (!config?.specialists?.length) return [];
    const slugs = config.specialists.map((row) => row.slug).filter(Boolean);
    resolved = slugs
      .map((slug) => all.find((specialist) => specialist.slug === slug))
      .filter((specialist): specialist is Specialist => Boolean(specialist));
  } else if (mode === "category") {
    if (!config?.categories?.length) return [];
    resolved = all.filter((specialist) =>
      specialistMatchesAnyCategory(specialist, config.categories!),
    );
  } else {
    // mode === "all"
    resolved = all;
  }

  if (config?.randomizeOrder) {
    resolved = shuffle(resolved);
  }

  return applyMaxItems(resolved, config?.maxItems);
}

/** Map homepage specialists settings to a page-section config for grid layout reuse. */
export function homepageSpecialistsAsPageSection(
  config: HomepageSpecialistsSectionConfig,
  specialists: Specialist[],
): import("@/lib/sanity/page-sections").PageSectionSpecialistsConfig {
  return {
    _type: "pageSectionSpecialists",
    title: config.heading,
    description: config.intro,
    displayMode: "manual",
    specialists: specialists.map((specialist) => ({ slug: specialist.slug })) as SanitySpecialist[],
    seeAllLabel: config.seeAllLabel,
    seeAllHref: config.seeAllHref,
    limit: config.maxItems ?? specialists.length,
    variant: "gridLight",
  };
}
