import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanityClient";
import {
  appLocaleFromParam,
  buildPageMetadata,
  type LocalizedPaths,
} from "@/lib/seo/metadata-builders";
import { resolveMetaStrings, type SanitySeoFields } from "@/lib/seo/seo-fields";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";
import {
  fetchArticleSeo,
  fetchThemePageSeo,
  fetchTreatmentCategorySeo,
  fetchTreatmentSeo,
} from "@/lib/seo/fetch-sanity-seo";

function metadataFromSeo(
  locale: string,
  paths: LocalizedPaths,
  seo: SanitySeoFields | undefined,
  fallbacks: {
    nb: { title: string; description: string };
    en: { title: string; description: string };
  },
  opts?: { type?: "website" | "article"; publishedTime?: string },
): Metadata {
  const lang = appLocaleFromParam(locale);
  const { title, description } = resolveMetaStrings(seo, lang, fallbacks);
  const ogImage = seo?.ogImage ? getImageUrl(seo.ogImage) : undefined;

  return buildPageMetadata({
    locale,
    paths,
    title,
    description,
    ogImage: ogImage || undefined,
    noIndex: !!seo?.noIndex,
    type: opts?.type ?? "website",
    publishedTime: opts?.publishedTime,
  });
}

export async function buildArticleMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchArticleSeo(slug, sanityLang);
  const base = `/${locale}/aktuelt/${slug}`;
  return metadataFromSeo(
    locale,
    { nbPath: base, enPath: base },
    doc?.seo,
    {
      nb: {
        title: doc?.title ? `${doc.title} | CMedical` : "Aktuelt | CMedical",
        description:
          doc?.excerpt ||
          "Les siste nyheter og artikler fra CMedical innen kvinnehelse, fertilitet og urologi.",
      },
      en: {
        title: doc?.title ? `${doc.title} | CMedical` : "News | CMedical",
        description:
          doc?.excerpt ||
          "Read the latest news and articles from CMedical on women's health, fertility and urology.",
      },
    },
    { type: "article", publishedTime: doc?.date },
  );
}

export async function buildTreatmentCategoryMetadata(
  locale: string,
  categorySlug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchTreatmentCategorySeo(categorySlug, sanityLang);
  const base = `/${locale}/behandlinger/${categorySlug}`;
  const title = doc?.title || categorySlug;
  return metadataFromSeo(
    locale,
    { nbPath: base, enPath: base },
    doc?.seo,
    {
      nb: {
        title: `${title} – Spesialistbehandling hos CMedical`,
        description: doc?.description?.slice(0, 160) || `Behandlinger innen ${title} hos CMedical.`,
      },
      en: {
        title: `${title} – Specialist care at CMedical`,
        description: doc?.description?.slice(0, 160) || `Treatments in ${title} at CMedical.`,
      },
    },
  );
}

export async function buildTreatmentMetadata(
  locale: string,
  categorySlug: string,
  treatmentSlug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchTreatmentSeo(categorySlug, treatmentSlug, sanityLang);
  const base = `/${locale}/behandlinger/${categorySlug}/${treatmentSlug}`;
  const title = doc?.title || treatmentSlug;
  const category = doc?.parentCategory || categorySlug;
  return metadataFromSeo(
    locale,
    { nbPath: base, enPath: base },
    doc?.seo,
    {
      nb: {
        title: `${title} – ${category} | CMedical`,
        description:
          doc?.description?.slice(0, 160) ||
          `Les om ${title} hos CMedical.`,
      },
      en: {
        title: `${title} – ${category} | CMedical`,
        description:
          doc?.description?.slice(0, 160) ||
          `Learn about ${title} at CMedical.`,
      },
    },
  );
}

export async function buildThemePageMetadata(
  locale: string,
  themeSlug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchThemePageSeo(themeSlug, sanityLang);
  const base = `/${locale}/${themeSlug}`;
  const title = doc?.title || themeSlug;
  return metadataFromSeo(
    locale,
    { nbPath: base, enPath: base },
    doc?.seo,
    {
      nb: {
        title: `${title} | CMedical`,
        description: `Les mer om ${title} hos CMedical.`,
      },
      en: {
        title: `${title} | CMedical`,
        description: `Learn more about ${title} at CMedical.`,
      },
    },
  );
}
