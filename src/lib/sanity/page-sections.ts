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
  limit?: number;
  variant?: "carousel" | "gridDark";
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

export type PageSection = PageSectionSpecialistsConfig | PageSectionArticlesConfig;

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

      return null;
    })
    .filter((x): x is PageSection => x != null);
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}
