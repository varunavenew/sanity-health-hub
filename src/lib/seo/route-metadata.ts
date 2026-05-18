import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanityClient";
import { appLocaleFromParam, buildPageMetadata } from "@/lib/seo/metadata-builders";
import {
  fetchAboutPageDocument,
  fetchContactPageDocument,
  fetchHomepageDocument,
} from "@/lib/seo/fetch-sanity-seo";
import { resolveMetaStrings } from "@/lib/seo/seo-fields";
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

export async function buildHomeMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchHomepageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, HOME_DEFAULTS);
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
  const { title, description } = resolveMetaStrings(seo, lang, CONTACT_FALLBACK);

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
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchAboutPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, ABOUT_FALLBACK);

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
