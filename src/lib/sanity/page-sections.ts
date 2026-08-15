import type { Specialist } from "@/lib/sanity/specialist-types";
import type { SanitySpecialist } from "@/hooks/useSanity";
import { resolveBookingCtaFromCollection } from "@/lib/sanity/cta-dual-read";
import { resolveInsuranceFromCollection } from "@/lib/sanity/insurance-dual-read";
import { ensurePageSectionKeys } from "@/lib/sanity/section-visibility";
import {
  resolveArticlesDisplayMode,
  resolveSpecialistsDisplayMode,
} from "@/lib/sanity/specialists-display-mode";

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
  backgroundColor?: string;
  textColor?: string;
  primaryButtonStyle?: "accent" | "white" | "custom";
  primaryButtonColor?: string;
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

  const normalized = raw
    .map((item): PageSection | null => {
      if (!item || typeof item !== "object") return null;
      const block = item as Record<string, unknown>;
      const type = block._type as string;

      if (type === "pageSectionSpecialists") {
        const displayMode = resolveSpecialistsDisplayMode(block.displayMode);
        return {
          _type: "pageSectionSpecialists",
          _key: block._key as string | undefined,
          eyebrow: str(block.eyebrow),
          title: str(block.title),
          description: str(block.description),
          // Stored value only — never invent "all" for missing displayMode.
          displayMode,
          specialists: Array.isArray(block.specialists)
            ? (block.specialists as SanitySpecialist[])
            : [],
          treatmentCategory: block.treatmentCategory as PageSectionSpecialistsConfig["treatmentCategory"],
          categorySlug: str(block.categorySlug) || undefined,
          seeAllLabel: str(block.seeAllLabel) || undefined,
          seeAllHref: str(block.seeAllHref) || undefined,
          limit: typeof block.limit === "number" ? block.limit : undefined,
          variant: (block.variant as PageSectionSpecialistsConfig["variant"]) || undefined,
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
          displayMode: resolveArticlesDisplayMode(block.displayMode),
          articles: articles.filter((x): x is PageSectionArticleCard => x != null),
          articleCategory: str(block.articleCategory) || undefined,
          limit: typeof block.limit === "number" ? block.limit : undefined,
          variant: (block.variant as PageSectionArticlesConfig["variant"]) || undefined,
          ctaLabel: str(block.ctaLabel) || undefined,
          ctaPath: str(block.ctaPath) || "/aktuelt",
        };
      }

      if (type === "pageSectionInsurance") {
        const resolved = resolveInsuranceFromCollection(
          block.insuranceCollection,
          block,
        );

        return {
          _type: "pageSectionInsurance",
          _key: block._key as string | undefined,
          eyebrow: resolved.eyebrow,
          title: resolved.title,
          partners: resolved.partners,
        };
      }

      if (type === "pageSectionBookingCta") {
        const resolved = resolveBookingCtaFromCollection(
          block.ctaCollection,
          block,
        );

        return {
          _type: "pageSectionBookingCta",
          _key: block._key as string | undefined,
          title: resolved.title,
          subtitle: resolved.subtitle,
          // Band-only reserved fields — collections do not own image/variant.
          image: str(block.image) || undefined,
          imageAlt: str(block.imageAlt) || undefined,
          variant:
            block.variant === "warm" || block.variant === "withImage"
              ? block.variant
              : "dark",
          primaryLabel: resolved.primaryLabel,
          primaryPath: resolved.primaryPath,
          bookingCategory: resolved.bookingCategory,
          showSecondaryButton: resolved.showSecondaryButton !== false,
          secondaryLabel: resolved.secondaryLabel,
          secondaryPath: resolved.secondaryPath,
          quickInfoItems: resolved.quickInfoItems,
          backgroundColor: resolved.backgroundColor,
          textColor: resolved.textColor,
          primaryButtonStyle: resolved.primaryButtonStyle,
          primaryButtonColor: resolved.primaryButtonColor,
        };
      }

      return null;
    })
    .filter((x): x is PageSection => x != null);

  return ensurePageSectionKeys(normalized);
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}
