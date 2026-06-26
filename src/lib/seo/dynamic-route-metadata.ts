import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanity/image-url";
import {
  appLocaleFromParam,
  buildPageMetadata,
  type LocalizedPaths,
} from "@/lib/seo/metadata-builders";
import { resolveMetaStrings, type SanitySeoFields } from "@/lib/seo/seo-fields";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";
import {
  fetchArticleSeo,
  fetchClinicSeo,
  fetchJobListingSeo,
  fetchCareersPageDocument,
  fetchSpecialistSeo,
  fetchThemePageSeo,
  fetchTreatmentCategorySeo,
  fetchTreatmentSeo,
} from "@/lib/seo/fetch-sanity-seo";
import { fetchThemeLocalizedPaths, pathsForDetailBySlug, pathsForCategorySlug, pathsForTreatment } from "@/lib/routing/singleton-slug-paths";
import { categorySlugForFetch } from "@/lib/sanity/category-keys";

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
  try {
    const sanityLang = sanityContentLangFromLocale(locale);
    const doc = await fetchArticleSeo(slug, sanityLang);
    const paths = await pathsForDetailBySlug("articles", "newsPage", slug, sanityLang);
    return metadataFromSeo(
      locale,
      paths,
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
  } catch {
    const isEn = locale === "en";
    const base = `/${locale}/aktuelt/${slug}`;
    return buildPageMetadata({
      locale,
      paths: { nbPath: base, enPath: base },
      title: isEn ? "News | CMedical" : "Aktuelt | CMedical",
      description: isEn
        ? "Read the latest news and articles from CMedical on women's health, fertility and urology."
        : "Les siste nyheter og artikler fra CMedical innen kvinnehelse, fertilitet og urologi.",
      type: "article",
    });
  }
}

export async function buildTreatmentCategoryMetadata(
  locale: string,
  categorySlug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const paths = await pathsForCategorySlug(categorySlug);
  const doc = await fetchTreatmentCategorySeo(categorySlug, sanityLang);
  const title = doc?.title || categorySlug;
  return metadataFromSeo(
    locale,
    paths,
    doc?.seo,
    {
      nb: {
        title: `${title} – Spesialistbehandling hos CMedical`,
        description: `Behandlinger innen ${title} hos CMedical.`,
      },
      en: {
        title: `${title} – Specialist care at CMedical`,
        description: `Treatments in ${title} at CMedical.`,
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
  const fetchCategorySlug = categorySlugForFetch(categorySlug);
  try {
    const paths = await pathsForTreatment(categorySlug, treatmentSlug, sanityLang);
    const doc = await fetchTreatmentSeo(fetchCategorySlug, treatmentSlug, sanityLang);
    const title = doc?.title || treatmentSlug;
    const category = doc?.parentCategory || categorySlug;
    return metadataFromSeo(
      locale,
      paths,
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
  } catch {
    const isEn = locale === "en";
    const base = `/${locale}/behandlinger/${categorySlug}/${treatmentSlug}`;
    return buildPageMetadata({
      locale,
      paths: { nbPath: base, enPath: base },
      title: isEn
        ? `${treatmentSlug} | CMedical`
        : `${treatmentSlug} | CMedical`,
      description: isEn
        ? `Learn about ${treatmentSlug} at CMedical.`
        : `Les om ${treatmentSlug} hos CMedical.`,
    });
  }
}

export async function buildThemePageMetadata(
  locale: string,
  themeQuerySlug: string,
  publicUrlSlug?: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchThemePageSeo(themeQuerySlug, sanityLang);
  const paths = publicUrlSlug
    ? await fetchThemeLocalizedPaths(publicUrlSlug)
    : await fetchThemeLocalizedPaths(themeQuerySlug);
  const title = doc?.title || themeQuerySlug;
  return metadataFromSeo(
    locale,
    paths,
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

export async function buildSpecialistMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchSpecialistSeo(slug, sanityLang);
  const paths = await pathsForDetailBySlug("specialists", "specialistsListingPage", slug, sanityLang);

  if (!doc?.seo?.metaTitle?.trim() || !doc?.seo?.metaDescription?.trim()) {
    return buildPageMetadata({
      locale,
      paths,
      title: lang === "en" ? "Specialist not found" : "Spesialist ikke funnet",
      description: "",
      noIndex: true,
    });
  }

  const cmsSeo = {
    nb: {
      title: doc.seo.metaTitle,
      description: doc.seo.metaDescription,
    },
    en: {
      title: doc.seo.metaTitle,
      description: doc.seo.metaDescription,
    },
  };

  return metadataFromSeo(locale, paths, doc.seo, cmsSeo);
}

export async function buildClinicMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchClinicSeo(slug, sanityLang);
  const label = doc?.label || slug;
  const paths = await pathsForDetailBySlug("clinics", "clinicsPage", slug, sanityLang);

  return metadataFromSeo(
    locale,
    paths,
    doc?.seo,
    {
      nb: {
        title: `CMedical ${label} – Klinikk`,
        description: `Besøk CMedical ${label}. Åpningstider, tjenester og kontaktinformasjon for vår klinikk.`,
      },
      en: {
        title: `CMedical ${label} – Clinic`,
        description: `Visit CMedical ${label}. Opening hours, services and contact information for our clinic.`,
      },
    },
  );
}

export async function buildJobListingMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const [doc, careersPage] = await Promise.all([
    fetchJobListingSeo(slug, sanityLang),
    fetchCareersPageDocument(sanityLang),
  ]);
  const jobTitle = doc?.title?.trim();
  if (!jobTitle) return {};

  const suffix = careersPage?.jobSeoTitleSuffix?.trim() || "";
  const description = doc?.excerpt?.trim() || "";

  let paths: { nbPath: string; enPath: string };
  try {
    paths = await pathsForDetailBySlug("jobs", "careersPage", slug, sanityLang);
  } catch {
    return {};
  }

  return buildPageMetadata({
    locale,
    paths,
    title: `${jobTitle}${suffix}`,
    description,
    type: "website",
  });
}
