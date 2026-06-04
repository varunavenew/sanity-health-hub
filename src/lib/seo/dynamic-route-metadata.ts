import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanityClient";
import {
  appLocaleFromParam,
  buildPageMetadata,
  type LocalizedPaths,
} from "@/lib/seo/metadata-builders";
import { resolveMetaStrings, type SanitySeoFields } from "@/lib/seo/seo-fields";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";
import { NAV_ROUTE_PATHS } from "@/lib/i18n/nav-paths";
import {
  fetchArticleSeo,
  fetchClinicSeo,
  fetchJobListingSeo,
  fetchSpecialistSeo,
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
  try {
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

function specialistSeoFallbacks(
  doc: {
    name?: string;
    role?: string;
    shortBio?: string;
    expertise?: string[];
  },
  lang: "nb" | "en",
): { title: string; description: string } {
  const name = doc.name || "Specialist";
  const role = doc.role || "";
  const expertise = doc.expertise?.filter(Boolean).join(", ") || "";
  const bio = doc.shortBio?.trim().slice(0, 160);

  if (lang === "en") {
    return {
      title: role ? `${name} – ${role}` : name,
      description:
        bio ||
        `Book an appointment with ${name}${role ? `, ${role}` : ""} at CMedical.${expertise ? ` ${expertise}.` : ""} No referral needed.`.slice(
          0,
          160,
        ),
    };
  }

  return {
    title: role ? `${name} – ${role}` : name,
    description:
      bio ||
      `Bestill time hos ${name}${role ? `, ${role}` : ""} hos CMedical.${expertise ? ` ${expertise}.` : ""} Ingen henvisning nødvendig.`.slice(
        0,
        160,
      ),
  };
}

export async function buildSpecialistMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchSpecialistSeo(slug, sanityLang);
  const base = `/${locale}/spesialister/${slug}`;
  const fallbacks = {
    nb: specialistSeoFallbacks(doc || {}, "nb"),
    en: specialistSeoFallbacks(doc || {}, "en"),
  };

  return metadataFromSeo(
    locale,
    { nbPath: base, enPath: base },
    doc?.seo,
    fallbacks,
  );
}

export async function buildClinicMetadata(
  locale: string,
  slug: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchClinicSeo(slug, sanityLang);
  const label = doc?.label || slug;
  const nbClinics = NAV_ROUTE_PATHS.clinics.nb;
  const enClinics = NAV_ROUTE_PATHS.clinics.en;

  return metadataFromSeo(
    locale,
    {
      nbPath: `/no${nbClinics}/${slug}`,
      enPath: `/en${enClinics}/${slug}`,
    },
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
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const doc = await fetchJobListingSeo(slug, sanityLang);
  const jobTitle = doc?.title?.trim() || slug;

  return buildPageMetadata({
    locale,
    paths: { nbPath: `/no/karriere/${slug}`, enPath: `/en/karriere/${slug}` },
    title: `${jobTitle} – Karriere hos CMedical`,
    description:
      doc?.excerpt?.trim() ||
      (lang === "en"
        ? `Apply for the ${jobTitle} position at CMedical.`
        : `Søk på stillingen ${jobTitle} hos CMedical.`),
    type: "website",
  });
}
