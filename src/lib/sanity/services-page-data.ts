import { SERVICES_PAGE_QUERY } from "@/lib/queries";
import { fetchSanityGroqBrowser } from "@/lib/sanity/fetch-groq-browser";
import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { rewriteRetiredIvfPath } from "@/lib/sanity/ivf-canonical";
import type { ServicesSearchItem } from "@/lib/sanity/services-search";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "value" in first) {
      const inner = (first as { value: unknown }).value;
      if (typeof inner === "string") return inner;
    }
  }
  return "";
}

function asKeywordList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => asPlainString(entry).trim())
    .filter(Boolean);
}

export type ServicesPageCategoryCard = {
  _createdAt?: string;
  sortOrder?: number;
  categoryId: string;
  title: string;
  heroImage?: string;
  path: string;
};

export type ServicesPageListItem = {
  title: string;
  path: string;
  searchKeywords?: string[];
};

export type ServicesPageFaq = {
  question: string;
  answer: string;
};

export type ServicesPageData = {
  breadcrumbHome: string;
  slug: string;
  title: string;
  eyebrow: string;
  introText: string;
  badges: string[];
  searchPlaceholder: string;
  featuredSectionTitle: string;
  featuredCategories: ServicesPageCategoryCard[];
  moreServicesSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  moreServicesItems: ServicesPageListItem[];
  faqSectionTitle: string;
  faqs: ServicesPageFaq[];
  emptyCategoriesMessage: string;
  pageSections?: ReturnType<typeof normalizePageSections>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  geoSummary?: string;
  /** Catalog for the Tjenester search box (categories + treatments + synonyms). */
  searchItems: ServicesSearchItem[];
};

function mapCategoryTreatments(
  category: Record<string, unknown>,
): ServicesPageListItem[] {
  const categorySlug = asPlainString(category.slug);
  const treatmentsRaw = (category.treatments as unknown[]) || [];
  return treatmentsRaw
    .map((row) => {
      const t = row as Record<string, unknown>;
      const slug = asPlainString(t.slug);
      return {
        title: asPlainString(t.title),
        path:
          slug && categorySlug
            ? rewriteRetiredIvfPath(`/${categorySlug}/${slug}`)
            : "",
        searchKeywords: asKeywordList(t.searchKeywords),
      };
    })
    .filter((item) => item.title && item.path);
}

function pushUniqueSearchItem(
  byPath: Map<string, ServicesSearchItem>,
  item: ServicesSearchItem,
) {
  const path = item.path.trim();
  const label = item.label.trim();
  if (!path || !label) return;

  const existing = byPath.get(path);
  if (!existing) {
    byPath.set(path, {
      label,
      path,
      category: item.category?.trim() || undefined,
      searchKeywords: [...(item.searchKeywords || [])],
    });
    return;
  }

  const merged = new Set([
    ...(existing.searchKeywords || []),
    ...(item.searchKeywords || []),
  ]);
  // Prefer the longer / more specific visible label when duplicates share a path.
  if (label.length > existing.label.length) {
    existing.label = label;
  }
  if (!existing.category && item.category?.trim()) {
    existing.category = item.category.trim();
  }
  existing.searchKeywords = [...merged];
}

function buildSearchCatalog(
  data: Record<string, unknown>,
  featuredCategories: ServicesPageCategoryCard[],
  moreServicesItems: ServicesPageListItem[],
): ServicesSearchItem[] {
  const byPath = new Map<string, ServicesSearchItem>();
  const catalog = (data.searchCatalog as Record<string, unknown>) || {};

  const categoriesRaw = (catalog.categories as unknown[]) || [];
  for (const row of categoriesRaw) {
    const c = row as Record<string, unknown>;
    const slug = asPlainString(c.slug);
    pushUniqueSearchItem(byPath, {
      label: asPlainString(c.title),
      path: slug ? `/${slug}` : "",
      category: "Fagområde",
      searchKeywords: asKeywordList(c.searchKeywords),
    });
  }

  const treatmentsRaw = (catalog.treatments as unknown[]) || [];
  for (const row of treatmentsRaw) {
    const t = row as Record<string, unknown>;
    const slug = asPlainString(t.slug);
    const categorySlug = asPlainString(t.categorySlug);
    pushUniqueSearchItem(byPath, {
      label: asPlainString(t.title),
      path:
        slug && categorySlug
          ? rewriteRetiredIvfPath(`/${categorySlug}/${slug}`)
          : "",
      category: asPlainString(t.categoryTitle) || undefined,
      searchKeywords: asKeywordList(t.searchKeywords),
    });
  }

  // Ensure hub cards / more-services rows are always searchable even if catalog is empty.
  for (const card of featuredCategories) {
    pushUniqueSearchItem(byPath, {
      label: card.title,
      path: card.path,
      category: "Fagområde",
    });
  }
  for (const item of moreServicesItems) {
    pushUniqueSearchItem(byPath, {
      label: item.title,
      path: item.path,
      searchKeywords: item.searchKeywords,
    });
  }

  return [...byPath.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "nb"),
  );
}

export function mapServicesPageDocument(
  data: Record<string, unknown> | null | undefined,
  _lang: "no" | "en",
): ServicesPageData | null {
  if (!data) return null;

  const moreSectionRaw = (data.moreServicesSection as Record<string, unknown>) || {};

  const badgesRaw = (data.badges as unknown[]) || [];
  const badges = badgesRaw
    .map((b) => asPlainString((b as Record<string, unknown>).label))
    .filter(Boolean);

  const featuredRaw = (data.featuredCategories as unknown[]) || [];

  const featuredCategories: ServicesPageCategoryCard[] = featuredRaw
      .map((row) => {
        const c = row as Record<string, unknown>;
        const categoryId =
          asPlainString(c.categoryId) || asPlainString(c.slug) || "";
        if (!categoryId) return null;
        const card: ServicesPageCategoryCard = {
          _createdAt: asPlainString(c._createdAt) || undefined,
          sortOrder: typeof c.sortOrder === "number" ? c.sortOrder : undefined,
          categoryId,
          title: asPlainString(c.title),
          path: asPlainString(c.slug) ? `/${asPlainString(c.slug)}` : "",
        };
        const heroImage = asPlainString(c.heroImage);
        if (heroImage) card.heroImage = heroImage;
        return card;
      })
      .filter((c): c is ServicesPageCategoryCard => c !== null && Boolean(c.path));

  const moreServicesItems: ServicesPageListItem[] = [];
  const moreCategoriesRaw = (data.moreServicesCategories as unknown[]) || [];

  for (const row of moreCategoriesRaw) {
    const entry = row as Record<string, unknown>;
    const category = (entry.category as Record<string, unknown>) || {};
    const categoryId =
      asPlainString(category.categoryId) || asPlainString(category.slug) || "";
    const displayMode = asPlainString(entry.displayMode);

    if (!categoryId || !displayMode) continue;

    if (displayMode === "treatmentsList") {
      moreServicesItems.push(...mapCategoryTreatments(category));
    } else {
      moreServicesItems.push({
        title: asPlainString(category.title),
        path: asPlainString(category.slug) ? `/${asPlainString(category.slug)}` : "",
        searchKeywords: asKeywordList(category.searchKeywords),
      });
    }
  }

  const searchItems = buildSearchCatalog(
    data,
    featuredCategories,
    moreServicesItems,
  );

  const seoRaw = data.seo as Record<string, unknown> | undefined;

  const faqsRaw = (data.faqs as unknown[]) || [];
  const faqs: ServicesPageFaq[] = resolveFaqsFromCollection(
    data.faqCollection,
    faqsRaw,
  );

  return {
    breadcrumbHome: asPlainString(data.breadcrumbHome),
    slug: asPlainString(data.slug),
    title: asPlainString(data.title),
    eyebrow: asPlainString(data.eyebrow),
    introText: asPlainString(data.introText),
    badges,
    searchPlaceholder: asPlainString(data.searchPlaceholder),
    featuredSectionTitle: asPlainString(data.featuredSectionTitle),
    featuredCategories,
    moreServicesSection: {
      eyebrow: asPlainString(moreSectionRaw.eyebrow),
      title: asPlainString(moreSectionRaw.title),
      description: asPlainString(moreSectionRaw.description),
    },
    moreServicesItems,
    faqSectionTitle: asPlainString(data.faqSectionTitle),
    faqs,
    emptyCategoriesMessage: asPlainString(data.emptyCategoriesMessage),
    pageSections: normalizePageSections(data.pageSections),
    seo: seoRaw
      ? {
          metaTitle: asPlainString(seoRaw.metaTitle) || undefined,
          metaDescription: asPlainString(seoRaw.metaDescription) || undefined,
        }
      : undefined,
    geoSummary: asPlainString(data.geoSummary) || undefined,
    searchItems,
  };
}

export async function fetchServicesPageData(
  lang: "no" | "en",
): Promise<ServicesPageData | null> {
  const raw = await fetchSanityGroqBrowser<Record<string, unknown> | null>(
    SERVICES_PAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapServicesPageDocument(normalized, lang);
}
