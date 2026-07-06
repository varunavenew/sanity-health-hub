import { SERVICES_PAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
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
  loadingLabel: string;
  pageErrorMessage: string;
  emptyCategoriesMessage: string;
  pageSections?: ReturnType<typeof normalizePageSections>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  geoSummary?: string;
  searchItems: ServicesPageListItem[];
};

function mapCategoryTreatments(
  category: Record<string, unknown>,
): ServicesPageListItem[] {
  const categoryId =
    asPlainString(category.categoryId) || asPlainString(category.slug) || "";
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
            ? `/behandlinger/${categorySlug}/${slug}`
            : "",
      };
    })
    .filter((item) => item.title && item.path);
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
    loadingLabel: asPlainString(data.loadingLabel),
    pageErrorMessage: asPlainString(data.pageErrorMessage),
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
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    SERVICES_PAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapServicesPageDocument(normalized, lang);
}
