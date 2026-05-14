import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanityClient";
import {
  appLocaleFromParam,
  buildPageMetadata,
  type AppLocaleStr,
} from "@/lib/seo/metadata-builders";
import {
  fetchAboutPageDocument,
  fetchContactPageDocument,
  fetchHomepageDocument,
} from "@/lib/seo/fetch-sanity-seo";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";

const HOME_DEFAULTS = {
  nb: {
    title: "CMedical – Skandinavias ledende helhetskonsept",
    description:
      "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  },
  en: {
    title: "CMedical – Scandinavia's leading healthcare concept",
    description:
      "The Nordics' most complete private offering within gynecology, fertility and urology. Leading specialists, short waiting times, no referral needed.",
  },
} as const;

const CONTACT_FALLBACK = {
  nb: {
    title: "Kontakt oss",
    description: "Har du spørsmål? Vi svarer gjerne på alle henvendelser",
  },
  en: {
    title: "Contact us",
    description: "Do you have questions? We are happy to help",
  },
} as const;

const ABOUT_FALLBACK = {
  nb: {
    title: "Om oss – Faglig trygghet og personlig omsorg",
    description:
      "CMedical er Nordens ledende klinikk for gynekologi, fertilitet og urologi. Kvinnehelse er vårt strategiske satsningsområde. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
  },
  en: {
    title: "About us – Clinical expertise and personal care",
    description:
      "CMedical is Scandinavia's leading clinic for gynecology, fertility and urology. Women's health is our strategic focus area. Since 2002, over 150,000 patients have been treated with us.",
  },
} as const;

/** Ensure meta title/description are plain strings for Next Metadata API. */
function plainMetaString(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const t = value.trim();
    return t || fallback;
  }
  return fallback;
}

/**
 * When the URL is English but Sanity only has Norwegian SEO (or i18n falls back
 * to `no`), meta strings often match the Norwegian defaults. Prefer English
 * fallbacks in that case so `/en` does not ship Norwegian titles in metadata.
 */
function resolveSeoStringsForLocale(
  lang: AppLocaleStr,
  nbFallback: { title: string; description: string },
  enFallback: { title: string; description: string },
  seoTitle: unknown,
  seoDescription: unknown,
): { title: string; description: string } {
  const defaults = lang === "en" ? enFallback : nbFallback;
  let title = plainMetaString(seoTitle, defaults.title);
  let description = plainMetaString(seoDescription, defaults.description);
  if (lang === "en") {
    if (title === nbFallback.title) title = enFallback.title;
    if (description === nbFallback.description)
      description = enFallback.description;
  }
  return { title, description };
}

export async function buildHomeMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchHomepageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveSeoStringsForLocale(
    lang,
    HOME_DEFAULTS.nb,
    HOME_DEFAULTS.en,
    seo?.metaTitle,
    seo?.metaDescription,
  );
  const ogImage = seo?.ogImage ? getImageUrl(seo.ogImage) : undefined;

  return buildPageMetadata({
    locale,
    paths: { nbPath: "/nb", enPath: "/en" },
    title,
    description,
    ogImage: ogImage || undefined,
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}

export async function buildContactMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchContactPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveSeoStringsForLocale(
    lang,
    CONTACT_FALLBACK.nb,
    CONTACT_FALLBACK.en,
    seo?.metaTitle,
    seo?.metaDescription,
  );

  return buildPageMetadata({
    locale,
    paths: { nbPath: "/nb/kontakt", enPath: "/en/contact" },
    title,
    description,
    ogImage: (() => {
      const u = seo?.ogImage ? getImageUrl(seo.ogImage) : "";
      return u || undefined;
    })(),
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}

export async function buildAboutMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = lang === "en" ? "en" : "no";
  const data = await fetchAboutPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveSeoStringsForLocale(
    lang,
    ABOUT_FALLBACK.nb,
    ABOUT_FALLBACK.en,
    seo?.metaTitle,
    seo?.metaDescription,
  );

  return buildPageMetadata({
    locale,
    paths: { nbPath: "/nb/om-oss", enPath: "/en/about" },
    title,
    description,
    ogImage: (() => {
      const u = seo?.ogImage ? getImageUrl(seo.ogImage) : "";
      return u || undefined;
    })(),
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}
