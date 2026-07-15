import type { Specialist } from "@/lib/sanity/specialist-types";
import type { SanitySpecialist } from "@/hooks/useSanity";

export type PageSectionSpecialistsConfig = {
  _type: "pageSectionSpecialists";
  _key?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  displayMode?: "all" | "manual" | "category";
  specialists?: SanitySpecialist[];
  treatmentCategory?: { categoryId?: string; slug?: string };
  categorySlug?: string;
  seeAllLabel?: string;
  seeAllHref?: string;
  limit?: number;
  variant?: "carousel" | "gridDark" | "gridLight";
};

export type BookingCtaQuickInfoItem = {
  icon?: "clock" | "shield";
  text?: string;
};

export type PageSectionBookingCtaConfig = {
  _type: "pageSectionBookingCta";
  _key?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  variant?: "dark" | "warm" | "withImage";
  primaryLabel?: string;
  primaryPath?: string;
  bookingCategory?: { categoryId?: string };
  showSecondaryButton?: boolean;
  secondaryLabel?: string;
  secondaryPath?: string;
  quickInfoItems?: BookingCtaQuickInfoItem[];
};

export type PageSectionArticlesConfig = {
  _type: "pageSectionArticles";
  _key?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  displayMode?: "latest" | "manual" | "category";
  articles?: PageSectionArticleCard[];
  articleCategory?: string;
  limit?: number;
  variant?: "grid" | "featured";
  ctaLabel?: string;
  ctaPath?: string;
};

export type PageSectionArticleCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  externalUrl?: string;
};

export type PageSectionInsurancePartner = {
  key: string;
  label: string;
};

export type PageSectionInsuranceConfig = {
  _type: "pageSectionInsurance";
  _key?: string;
  eyebrow?: string;
  title?: string;
  partners?: PageSectionInsurancePartner[];
};

export type PageSection =
  | PageSectionSpecialistsConfig
  | PageSectionArticlesConfig
  | PageSectionInsuranceConfig
  | PageSectionBookingCtaConfig;

/** Attach normalized page sections to any Sanity page document. */
export function withPageSections<T extends Record<string, unknown>>(
  data: T | null | undefined,
): (T & { pageSections: PageSection[] }) | null {
  if (!data) return null;
  return {
    ...data,
    pageSections: normalizePageSections(data.pageSections),
  };
}

export function sanitySpecialistToCard(s: SanitySpecialist): Specialist {
  return {
    name: s.name,
    title: s.title,
    subtitle: s.subtitle,
    expertise: s.expertise,
    image: s.image,
    category: s.category as Specialist["category"],
    slug: s.slug,
    bio: s.bio,
    education: s.education,
    languages: s.languages,
    clinics: s.clinics,
  };
}

/** Normalize raw GROQ pageSections after normalizeI18n. */
export function normalizePageSections(raw: unknown): PageSection[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): PageSection | null => {
      if (!item || typeof item !== "object") return null;
      const block = item as Record<string, unknown>;
      const type = block._type as string;

      if (type === "pageSectionSpecialists") {
        return {
          _type: "pageSectionSpecialists",
          _key: block._key as string | undefined,
          eyebrow: str(block.eyebrow),
          title: str(block.title),
          description: str(block.description),
          displayMode:
            (block.displayMode as PageSectionSpecialistsConfig["displayMode"]) || "all",
          specialists: Array.isArray(block.specialists)
            ? (block.specialists as SanitySpecialist[])
            : [],
          treatmentCategory: block.treatmentCategory as PageSectionSpecialistsConfig["treatmentCategory"],
          categorySlug: str(block.categorySlug) || undefined,
          seeAllLabel: str(block.seeAllLabel) || undefined,
          seeAllHref: str(block.seeAllHref) || undefined,
          limit: typeof block.limit === "number" ? block.limit : 8,
          variant:
            (block.variant as PageSectionSpecialistsConfig["variant"]) || "carousel",
        };
      }

      if (type === "pageSectionArticles") {
        const articles = Array.isArray(block.articles)
          ? block.articles.map((a): PageSectionArticleCard | null => {
              if (!a || typeof a !== "object") return null;
              const row = a as Record<string, unknown>;
              const slug = str(row.slug);
              if (!slug) return null;
              return {
                slug,
                title: str(row.title),
                excerpt: str(row.excerpt),
                image: str(row.image),
                date: str(row.date),
                category: str(row.category) || "nyheter",
                externalUrl: str(row.externalUrl) || undefined,
              };
            })
          : [];

        return {
          _type: "pageSectionArticles",
          _key: block._key as string | undefined,
          eyebrow: str(block.eyebrow),
          title: str(block.title),
          description: str(block.description),
          displayMode:
            (block.displayMode as PageSectionArticlesConfig["displayMode"]) || "latest",
          articles: articles.filter((x): x is PageSectionArticleCard => x != null),
          articleCategory: str(block.articleCategory) || undefined,
          limit: typeof block.limit === "number" ? block.limit : 6,
          variant: (block.variant as PageSectionArticlesConfig["variant"]) || "grid",
          ctaLabel: str(block.ctaLabel) || undefined,
          ctaPath: str(block.ctaPath) || "/aktuelt",
        };
      }

      if (type === "pageSectionInsurance") {
        const partners = Array.isArray(block.partners)
          ? block.partners
              .map((p): PageSectionInsurancePartner | null => {
                if (!p || typeof p !== "object") return null;
                const row = p as Record<string, unknown>;
                const key = str(row.key);
                if (!key) return null;
                return {
                  key,
                  label: str(row.label),
                };
              })
              .filter((x): x is PageSectionInsurancePartner => x != null)
          : [];

        return {
          _type: "pageSectionInsurance",
          _key: block._key as string | undefined,
          eyebrow: str(block.eyebrow),
          title: str(block.title),
          partners,
        };
      }

      if (type === "pageSectionBookingCta") {
        const quickInfoItems = Array.isArray(block.quickInfoItems)
          ? block.quickInfoItems
              .map((row): BookingCtaQuickInfoItem | null => {
                if (!row || typeof row !== "object") return null;
                const item = row as Record<string, unknown>;
                const icon = item.icon === "shield" ? "shield" : "clock";
                const text = str(item.text);
                if (!text) return null;
                return { icon, text };
              })
              .filter((x): x is BookingCtaQuickInfoItem => x != null)
          : undefined;

        return {
          _type: "pageSectionBookingCta",
          _key: block._key as string | undefined,
          title: str(block.title) || undefined,
          subtitle: str(block.subtitle) || undefined,
          image: str(block.image) || undefined,
          imageAlt: str(block.imageAlt) || undefined,
          variant:
            block.variant === "warm" || block.variant === "withImage"
              ? block.variant
              : "dark",
          primaryLabel: str(block.primaryLabel) || undefined,
          primaryPath: str(block.primaryPath) || undefined,
          bookingCategory: block.bookingCategory as PageSectionBookingCtaConfig["bookingCategory"],
          showSecondaryButton: block.showSecondaryButton !== false,
          secondaryLabel: str(block.secondaryLabel) || undefined,
          secondaryPath: str(block.secondaryPath) || undefined,
          quickInfoItems,
        };
      }

      return null;
    })
    .filter((x): x is PageSection => x != null);
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}
