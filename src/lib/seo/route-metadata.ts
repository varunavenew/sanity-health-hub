import type { Metadata } from "next";
import { getImageUrl } from "@/lib/sanity/image-url";
import { appLocaleFromParam, buildPageMetadata } from "@/lib/seo/metadata-builders";
import {
  fetchAboutPageDocument,
  fetchClinicsPageDocument,
  fetchContactPageDocument,
  fetchHomepageDocument,
  fetchInsurancePageDocument,
  fetchNewsPageDocument,
  fetchPricingPageDocument,
  fetchPrivacyPolicyPageDocument,
  fetchServicesPageDocument,
  fetchSpecialistsListingPageDocument,
  fetchSpecialistsPageDocument,
  fetchGuidePageDocument,
  fetchCareersPageDocument,
} from "@/lib/seo/fetch-sanity-seo";
import type { LocalizedPaths } from "@/lib/seo/metadata-builders";
import { plainMetaString, resolveMetaStrings } from "@/lib/seo/seo-fields";
import { fetchSingletonLocalizedPaths } from "@/lib/routing/singleton-slug-paths";
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

const NEWS_FALLBACK = {
  nb: {
    title: "Aktuelt | CMedical",
    description:
      "Hold deg oppdatert med nyheter og medisinske fagartikler fra CMedical.",
  },
  en: {
    title: "News | CMedical",
    description:
      "Stay updated with news and medical insights from CMedical.",
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
    paths: await fetchSingletonLocalizedPaths("contactPage"),
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

const PRIVACY_FALLBACK = {
  nb: {
    title: "Personvernerklæring",
    description:
      "Les CMedicals personvernerklæring. Informasjon om hvordan vi behandler dine personopplysninger i samsvar med GDPR og norsk personvernlovgivning.",
  },
  en: {
    title: "Privacy Policy",
    description:
      "Read CMedical's privacy policy. Information about how we process your personal data in accordance with GDPR and applicable privacy legislation.",
  },
} as const;

export async function buildPrivacyMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchPrivacyPolicyPageDocument(sanityLang);
  const title = data?.title?.trim() || PRIVACY_FALLBACK[lang].title;
  const description = PRIVACY_FALLBACK[lang].description;

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("privacyPolicyPage"),
    title,
    description,
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
    paths: await fetchSingletonLocalizedPaths("aboutPage"),
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

const INSURANCE_FALLBACK = {
  nb: {
    title: "Helseforsikring – Bruk forsikringen din hos CMedical",
    description:
      "CMedical har avtale med alle store forsikringsselskaper. Ingen utlegg – vi fakturerer forsikringen direkte. Kort ventetid og ledende spesialister.",
  },
  en: {
    title: "Health insurance – Use your insurance at CMedical",
    description:
      "CMedical works with all major insurance providers. No out-of-pocket costs – we bill your insurer directly. Short waiting times and leading specialists.",
  },
} as const;

export async function buildInsuranceMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchInsurancePageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, INSURANCE_FALLBACK);

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("insurancePage"),
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

export async function buildNewsMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchNewsPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, NEWS_FALLBACK);

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("newsPage"),
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

const SPECIALISTS_ABOUT_FALLBACK = {
  nb: {
    title: "Om våre spesialister – Erfaring og spisskompetanse",
    description:
      "Les om CMedicals spesialistteam. Ledende eksperter innen gynekologi, fertilitet, urologi og ortopedi – samlet på ett sted.",
  },
  en: {
    title: "About our specialists – Experience and expertise",
    description:
      "Learn about CMedical's specialist team. Leading experts in gynecology, fertility, urology and orthopedics – all in one place.",
  },
} as const;

export async function buildSpecialistsAboutMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchSpecialistsPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(
    seo,
    lang,
    SPECIALISTS_ABOUT_FALLBACK,
  );

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("specialistsPage"),
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

const SERVICES_FALLBACK = {
  nb: {
    title: "Tjenester – Finn behandlingen som passer for deg",
    description:
      "Se alle tjenester hos CMedical: gynekologi, fertilitet, urologi, ortopedi og flere fagområder. Ingen henvisning, kort ventetid.",
  },
  en: {
    title: "Services – Find the right treatment for you",
    description:
      "View all services at CMedical: gynecology, fertility, urology, orthopedics and more specialties. No referral needed, short waiting times.",
  },
} as const;

export async function buildServicesMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const paths = await fetchSingletonLocalizedPaths("servicesPage");
  const data = await fetchServicesPageDocument(sanityLang);
  const seo = data?.seo;
  const resolved = resolveMetaStrings(seo, lang, SERVICES_FALLBACK);
  const title = plainMetaString(
    seo?.metaTitle,
    data?.title?.trim() || resolved.title,
    sanityLang,
  );
  const description = plainMetaString(
    seo?.metaDescription,
    data?.introText?.trim().slice(0, 160) || resolved.description,
    sanityLang,
  );

  return buildPageMetadata({
    locale,
    paths,
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

const PRICING_FALLBACK = {
  nb: {
    title: "Priser – Oversiktlig prisliste sortert etter tjeneste",
    description:
      "Se alle priser hos CMedical. Oversiktlig prisliste for gynekologi, fertilitet, urologi, ortopedi og flere tjenester. Transparent og forutsigbar prising.",
  },
  en: {
    title: "Pricing – Complete price list by service",
    description:
      "See all CMedical prices. A clear price list for gynecology, fertility, urology, orthopedics and more. Transparent and predictable pricing.",
  },
} as const;

export async function buildPricingMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchPricingPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, PRICING_FALLBACK);

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("pricingPage"),
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

const SPECIALISTS_LISTING_FALLBACK = {
  nb: {
    title: "Våre spesialister – Ledende eksperter samlet på ett sted",
    description:
      "Møt CMedicals spesialister innen gynekologi, fertilitet, urologi og ortopedi. Erfaring, spisskompetanse og moderne teknologi – ingen henvisning nødvendig.",
  },
  en: {
    title: "Our specialists – Leading experts in one place",
    description:
      "Meet CMedical's specialists in gynecology, fertility, urology and orthopedics. Experience, expertise and modern technology – no referral needed.",
  },
} as const;

export async function buildSpecialistsListingMetadata(
  locale: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchSpecialistsListingPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(
    seo,
    lang,
    SPECIALISTS_LISTING_FALLBACK,
  );

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("specialistsListingPage"),
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

const CLINICS_LISTING_FALLBACK = {
  nb: {
    title: "Våre klinikker | CMedical",
    description:
      "Oversikt over CMedicals fire klinikker i Norge: Oslo Majorstuen, Bekkestua, Moss og Moelv. Adresse, åpningstider, parkering, kollektivtransport og tjenester.",
  },
  en: {
    title: "Our clinics | CMedical",
    description:
      "Overview of CMedical's clinics in Norway: Oslo Majorstuen, Bekkestua, Moss and Moelv. Address, opening hours, parking, public transport and services.",
  },
} as const;

export async function buildClinicsListingMetadata(
  locale: string,
): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchClinicsPageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(
    seo,
    lang,
    CLINICS_LISTING_FALLBACK,
  );

  return buildPageMetadata({
    locale,
    paths: await fetchSingletonLocalizedPaths("clinicsPage"),
    title,
    description,
    ogImage: (() => {
      const u = data?.heroImage || (seo?.ogImage ? getImageUrl(seo.ogImage) : "");
      return u || undefined;
    })(),
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}

const GUIDE_FALLBACK = {
  nb: {
    title: "Våre Behandlinger | CMedical",
    description:
      "Spesialiserte behandlinger for kvinnen og mannens underliv. Gynekologi, fertilitet og urologi hos CMedical.",
  },
  en: {
    title: "Our Treatments | CMedical",
    description:
      "Specialized treatments for women's and men's intimate health. Gynecology, fertility and urology at CMedical.",
  },
} as const;

export async function buildGuideMetadata(locale: string): Promise<Metadata> {
  const lang = appLocaleFromParam(locale);
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchGuidePageDocument(sanityLang);
  const seo = data?.seo;
  const { title, description } = resolveMetaStrings(seo, lang, GUIDE_FALLBACK);
  const resolvedTitle = plainMetaString(
    seo?.metaTitle,
    data?.heroTitle?.trim() || title,
    sanityLang,
  );
  const resolvedDescription = plainMetaString(
    seo?.metaDescription,
    data?.heroSubtitle?.trim().slice(0, 160) || description,
    sanityLang,
  );

  let paths = { nbPath: "/no/guide", enPath: "/en/guide" };
  try {
    paths = await fetchSingletonLocalizedPaths("guidePage");
  } catch {
    // guidePage slug not yet in CMS
  }

  return buildPageMetadata({
    locale,
    paths,
    title: resolvedTitle,
    description: resolvedDescription,
    ogImage: seo?.ogImage ? getImageUrl(seo.ogImage) : undefined,
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}

export async function buildKarriereListingMetadata(
  locale: string,
): Promise<Metadata> {
  const sanityLang = sanityContentLangFromLocale(locale);
  const data = await fetchCareersPageDocument(sanityLang);
  if (!data) return {};

  const seo = data.seo;
  const title = plainMetaString(seo?.metaTitle, data.title?.trim() || "", sanityLang);
  const description = plainMetaString(
    seo?.metaDescription,
    data.heroSubtitle?.trim().slice(0, 160) || data.introText?.trim().slice(0, 160) || "",
    sanityLang,
  );
  if (!title && !description) return {};

  let paths: { nbPath: string; enPath: string };
  try {
    paths = await fetchSingletonLocalizedPaths("careersPage");
  } catch {
    return {};
  }

  return buildPageMetadata({
    locale,
    paths,
    title,
    description,
    ogImage: seo?.ogImage ? getImageUrl(seo.ogImage) : undefined,
    noIndex: !!seo?.noIndex,
    type: "website",
  });
}
