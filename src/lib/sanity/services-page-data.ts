import { SERVICES_PAGE_QUERY } from "@/lib/queries";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
} from "@/lib/sanity/category-keys";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { sortBySortOrder } from "@/lib/sortAlphabetical";
import { sanityClient } from "@/lib/sanityClient";

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

export type ServicesPageCategoryCard = {
  categoryId: string;
  title: string;
  heroImage?: string;
  path: string;
};

export type ServicesPageListItem = {
  title: string;
  path: string;
};

export type ServicesPageFaq = {
  question: string;
  answer: string;
};

export type ServicesPageData = {
  breadcrumbHome: string;
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
  faqCategory: string;
  pageSections?: ReturnType<typeof normalizePageSections>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  searchItems: ServicesPageListItem[];
};

function mapCategoryTreatments(
  category: Record<string, unknown>,
  lang: "no" | "en",
): ServicesPageListItem[] {
  const categoryId =
    asPlainString(category.categoryId) || asPlainString(category.slug) || "";
  const treatmentsRaw = (category.treatments as unknown[]) || [];
  return sortBySortOrder(
    treatmentsRaw.map((row) => {
      const t = row as Record<string, unknown>;
      const slug = asPlainString(t.slug);
      return {
        title: asPlainString(t.title),
        sortOrder: t.sortOrder,
        path: slug
          ? `/behandlinger/${behandlingerCategorySegment(categoryId, lang)}/${slug}`
          : "",
      };
    }),
    (t) => t.sortOrder,
    (t) => t.title,
    lang,
  );
}

export function mapServicesPageDocument(
  data: Record<string, unknown> | null | undefined,
  lang: "no" | "en",
): ServicesPageData | null {
  if (!data) return null;

  const moreSectionRaw = (data.moreServicesSection as Record<string, unknown>) || {};

  const badgesRaw = (data.badges as unknown[]) || [];
  const badges = badgesRaw
    .map((b) => asPlainString((b as Record<string, unknown>).label))
    .filter(Boolean);

  const featuredRaw =
    (data.featuredCategories as unknown[])?.length
      ? (data.featuredCategories as unknown[])
      : ((data.categories as unknown[]) || []).slice(0, 4);

  const featuredCategories: ServicesPageCategoryCard[] = sortBySortOrder(
    featuredRaw
      .map((row) => {
        const c = row as Record<string, unknown>;
        const categoryId =
          asPlainString(c.categoryId) || asPlainString(c.slug) || "";
        if (!categoryId) return null;
        const card: ServicesPageCategoryCard & { sortOrder?: unknown } = {
          categoryId,
          title: asPlainString(c.title),
          path: categoryLandingPath(categoryId, lang),
          sortOrder: c.sortOrder,
        };
        const heroImage = asPlainString(c.heroImage);
        if (heroImage) card.heroImage = heroImage;
        return card;
      })
      .filter((c): c is ServicesPageCategoryCard & { sortOrder?: unknown } => c !== null),
    (c) => c.sortOrder,
    (c) => c.title,
    lang,
  ).map(({ sortOrder: _sortOrder, ...card }) => card);

  const moreServicesItems: ServicesPageListItem[] = [];
  const moreCategoriesRaw = (data.moreServicesCategories as unknown[]) || [];

  for (const row of moreCategoriesRaw) {
    const entry = row as Record<string, unknown>;
    const category = (entry.category as Record<string, unknown>) || {};
    const categoryId =
      asPlainString(category.categoryId) || asPlainString(category.slug) || "";
    const displayMode = asPlainString(entry.displayMode) || "categoryLink";

    if (!categoryId) continue;

    if (displayMode === "treatmentsList") {
      moreServicesItems.push(...mapCategoryTreatments(category, lang));
    } else {
      moreServicesItems.push({
        title: asPlainString(category.title),
        path: categoryLandingPath(categoryId, lang),
      });
    }
  }

  const searchItems: ServicesPageListItem[] = [];
  for (const card of featuredCategories) {
    searchItems.push({ title: card.title, path: card.path });
  }
  for (const item of moreServicesItems) {
    searchItems.push(item);
  }

  const seoRaw = data.seo as Record<string, unknown> | undefined;

  const faqsRaw = (data.faqs as unknown[]) || [];
  const faqs: ServicesPageFaq[] = faqsRaw
    .map((row) => {
      const f = row as Record<string, unknown>;
      const question = asPlainString(f.question);
      const answer = asPlainString(f.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((f): f is ServicesPageFaq => f !== null);

  return {
    breadcrumbHome: asPlainString(data.breadcrumbHome),
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
    faqCategory: asPlainString(data.faqCategory) || "tjenester",
    pageSections: normalizePageSections(data.pageSections),
    seo: seoRaw
      ? {
          metaTitle: asPlainString(seoRaw.metaTitle) || undefined,
          metaDescription: asPlainString(seoRaw.metaDescription) || undefined,
        }
      : undefined,
    searchItems,
  };
}

export async function fetchServicesPageData(
  lang: "no" | "en",
): Promise<ServicesPageData | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    SERVICES_PAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapServicesPageDocument(normalized, lang);
}
