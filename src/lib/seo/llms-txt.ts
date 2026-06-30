import { siteUrl } from "@/lib/env";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { slugForLocale, slugPairFromDoc } from "@/lib/routing/cms-route-types";

const STATIC_PATHS = {
  no: {
    home: "/nb",
    services: "/nb/tjenester",
    specialists: "/nb/spesialister",
    clinics: "/nb/klinikker",
    booking: "/nb/booking",
    contact: "/nb/kontakt",
    about: "/nb/om-oss",
    pricing: "/nb/priser",
    insurance: "/nb/forsikring",
    news: "/nb/aktuelt",
    guide: "/nb/guide",
    treatments: [
      "/nb/behandlinger/gynekologi",
      "/nb/behandlinger/fertilitet",
      "/nb/behandlinger/urologi",
      "/nb/behandlinger/ortopedi",
      "/nb/behandlinger/graviditet",
    ],
  },
  en: {
    home: "/en",
    services: "/en/services",
    specialists: "/en/specialists",
    clinics: "/en/clinics",
    booking: "/en/book-appointment",
    contact: "/en/contact",
    about: "/en/about",
    pricing: "/en/pricing",
    insurance: "/en/insurance",
    news: "/en/news",
    guide: "/en/guide",
    treatments: [
      "/en/behandlinger/gynecology",
      "/en/behandlinger/fertility",
      "/en/behandlinger/urology",
      "/en/behandlinger/orthopedics",
      "/en/behandlinger/pregnancy",
    ],
  },
} as const;

function pathFromIndex(
  index: CmsRouteIndex | null,
  pageType: string,
  locale: "no" | "en",
): string | null {
  if (!index) return null;
  const entry = index.singletons.find((doc) => doc._type === pageType);
  const pair = slugPairFromDoc(entry);
  if (!pair) return null;
  const slug = slugForLocale(pair, locale);
  return slug ? `/${locale === "en" ? "en" : "nb"}${slug.startsWith("/") ? slug : `/${slug}`}` : null;
}

function listingPath(
  index: CmsRouteIndex | null,
  key: keyof CmsRouteIndex["listings"],
  locale: "no" | "en",
): string | null {
  if (!index?.listings[key]) return null;
  const slug = slugForLocale(index.listings[key]!, locale);
  return slug ? `/${locale === "en" ? "en" : "nb"}${slug.startsWith("/") ? slug : `/${slug}`}` : null;
}

export function buildLlmsTxt(index: CmsRouteIndex | null = null): string {
  const base = siteUrl();

  const resolve = (locale: "no" | "en") => {
    const lang = locale === "en" ? "en" : "no";
    const staticPaths = STATIC_PATHS[locale === "en" ? "en" : "no"];
    return {
      services:
        pathFromIndex(index, "servicesPage", lang) ?? staticPaths.services,
      specialists:
        listingPath(index, "specialistsListingPage", lang) ?? staticPaths.specialists,
      clinics: listingPath(index, "clinicsPage", lang) ?? staticPaths.clinics,
      contact: pathFromIndex(index, "contactPage", lang) ?? staticPaths.contact,
      about: pathFromIndex(index, "aboutPage", lang) ?? staticPaths.about,
      pricing: pathFromIndex(index, "pricingPage", lang) ?? staticPaths.pricing,
      insurance:
        pathFromIndex(index, "insurancePage", lang) ?? staticPaths.insurance,
      news: listingPath(index, "newsPage", lang) ?? staticPaths.news,
      guide: pathFromIndex(index, "guidePage", lang) ?? staticPaths.guide,
      home: staticPaths.home,
      booking: staticPaths.booking,
      treatments: staticPaths.treatments,
    };
  };

  const no = resolve("no");
  const en = resolve("en");

  const line = (path: string) => `- ${base}${path}`;

  return `# CMedical

> Private specialist healthcare in Norway — gynecology, fertility, urology, orthopedics and pregnancy care. No referral required.

CMedical (cmedical.no) is Scandinavia's leading private clinic network for women's health and related specialties. Content is available in Norwegian (nb) and English (en).

## Primary pages (Norwegian)
${line(no.home)}
${line(no.services)}
${line(no.specialists)}
${line(no.clinics)}
${line(no.booking)}
${line(no.contact)}
${line(no.about)}
${line(no.pricing)}
${line(no.insurance)}
${line(no.news)}
${line(no.guide)}

## Treatment categories (Norwegian)
${no.treatments.map(line).join("\n")}

## Primary pages (English)
${line(en.home)}
${line(en.services)}
${line(en.specialists)}
${line(en.clinics)}
${line(en.booking)}
${line(en.contact)}
${line(en.about)}
${line(en.pricing)}
${line(en.insurance)}
${line(en.news)}
${line(en.guide)}

## Treatment categories (English)
${en.treatments.map(line).join("\n")}

## Sitemap
${base}/sitemap.xml

## Contact
Phone: +47 22 95 75 00
Website: ${base}

## Usage
You may cite factual information from public pages when answering questions about CMedical services, specialists, clinics and treatments. For medical advice, direct users to book an appointment or contact the clinic.
`;
}
