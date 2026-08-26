import "server-only";

import type { QueryClient } from "@tanstack/react-query";
import {
  ABOUT_PAGE_QUERY,
  CAREERS_PAGE_QUERY,
  CLINICS_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  GUIDE_PAGE_QUERY,
  INSURANCE_PAGE_QUERY,
  NEWS_PAGE_QUERY,
  OPENNESS_ACT_PAGE_QUERY,
  PRICING_PAGE_QUERY,
  PRIVACY_POLICY_PAGE_QUERY,
  SPECIALISTS_PAGE_QUERY,
} from "@/lib/queries";
import { mapAboutPageData } from "@/lib/sanity/about-page-data";
import { mapContactPageData } from "@/lib/sanity/contact-page-data";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { mapInsurancePageData } from "@/lib/sanity/insurance-page-data";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections, withPageSections } from "@/lib/sanity/page-sections";
import { mapPricingPageData } from "@/lib/sanity/pricing-page-data";
import { fetchServicesPageData } from "@/lib/sanity/services-page-data.server";
import { fetchSpecialistsListingPageData } from "@/lib/sanity/specialists-listing-page.server";

async function fetchNormalized(
  query: string,
  lang: "no" | "en",
): Promise<Record<string, unknown> | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    query,
    { lang },
  );
  if (!raw) return null;
  return normalizeI18n(raw, lang) as Record<string, unknown>;
}

function queryKeyForSingleton(
  documentType: string,
  lang: "no" | "en",
): unknown[] | null {
  switch (documentType) {
    case "aboutPage":
      return ["sanity", "aboutPage", lang];
    case "contactPage":
      return ["sanity", "contactPage", lang];
    case "newsPage":
      return ["sanity", "newsPage", lang];
    case "pricingPage":
      return ["sanity", "pricingPage", lang, "src-v2"];
    case "insurancePage":
      return ["sanity", "insurancePage", lang];
    case "servicesPage":
      return ["sanity", "servicesPage", lang];
    case "specialistsPage":
      return ["sanity", "specialistsPage", lang];
    case "specialistsListingPage":
      return ["sanity", "specialistsListingPage", lang];
    case "clinicsPage":
      return ["sanity", "clinicsPage", lang];
    case "privacyPolicyPage":
      return ["sanity", "privacyPolicyPage", lang];
    case "opennessActPage":
      return ["sanity", "opennessActPage", lang];
    case "careersPage":
      return ["sanity", "careersPage", lang];
    case "guidePage":
      return ["sanity", "guidePage", lang];
    default:
      return null;
  }
}

async function fetchSingletonPageData(documentType: string, lang: "no" | "en") {
  switch (documentType) {
    case "aboutPage":
      return mapAboutPageData(await fetchNormalized(ABOUT_PAGE_QUERY, lang), lang);
    case "contactPage":
      return mapContactPageData(await fetchNormalized(CONTACT_PAGE_QUERY, lang), lang);
    case "newsPage":
      return withPageSections(await fetchNormalized(NEWS_PAGE_QUERY, lang));
    case "pricingPage":
      return mapPricingPageData(await fetchNormalized(PRICING_PAGE_QUERY, lang), lang);
    case "insurancePage":
      return mapInsurancePageData(await fetchNormalized(INSURANCE_PAGE_QUERY, lang));
    case "servicesPage":
      return fetchServicesPageData(lang);
    case "specialistsPage":
      return withPageSections(await fetchNormalized(SPECIALISTS_PAGE_QUERY, lang));
    case "specialistsListingPage":
      return fetchSpecialistsListingPageData(lang);
    case "clinicsPage":
      return withPageSections(await fetchNormalized(CLINICS_PAGE_QUERY, lang));
    case "privacyPolicyPage": {
      const data = await fetchNormalized(PRIVACY_POLICY_PAGE_QUERY, lang);
      if (!data) return null;
      const title = typeof data.title === "string" ? data.title : "";
      const firstBlock = Array.isArray(data.body)
        ? (data.body[0] as { _type?: string } | undefined)
        : undefined;
      const body =
        firstBlock?._type === "block"
          ? data.body
          : Array.isArray(data.body)
            ? data.body
            : [];
      return {
        ...data,
        title,
        body,
        pageSections: normalizePageSections(data.pageSections),
      };
    }
    case "opennessActPage": {
      const data = await fetchNormalized(OPENNESS_ACT_PAGE_QUERY, lang);
      if (!data) return null;
      const title = typeof data.title === "string" ? data.title : "";
      const firstBlock = Array.isArray(data.body)
        ? (data.body[0] as { _type?: string } | undefined)
        : undefined;
      const body =
        firstBlock?._type === "block"
          ? data.body
          : Array.isArray(data.body)
            ? data.body
            : [];
      return {
        ...data,
        title,
        body,
        showPracticalInfoSection: data.showPracticalInfoSection !== false,
        pageSections: normalizePageSections(data.pageSections),
      };
    }
    case "careersPage":
      return withPageSections(await fetchNormalized(CAREERS_PAGE_QUERY, lang));
    case "guidePage":
      return withPageSections(await fetchNormalized(GUIDE_PAGE_QUERY, lang));
    default:
      return null;
  }
}

/** Prefetch mapped singleton page data into the RSC QueryClient for hydration. */
export async function prefetchSingletonPage(
  queryClient: QueryClient,
  documentType: string,
  lang: "no" | "en",
): Promise<void> {
  const queryKey = queryKeyForSingleton(documentType, lang);
  if (!queryKey) return;
  const data = await fetchSingletonPageData(documentType, lang);
  queryClient.setQueryData(queryKey, data);
}
