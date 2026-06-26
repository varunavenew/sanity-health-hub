import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CategoryDataProvider } from "@/components/providers/CategoryDataProvider";
import { TreatmentDataProvider } from "@/components/providers/TreatmentDataProvider";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import { fetchTreatmentCategoryData } from "@/lib/sanity/category-data";
import { fetchTreatmentData } from "@/lib/sanity/treatment-data";
import type { ResolvedCmsRoute } from "@/lib/routing/cms-route-types";
import type { SingletonPageType } from "@/lib/routing/cms-route-types";
import { pathsForRoute } from "@/lib/routing/path-builder";
import About from "@/site-pages/About";
import AboutSpecialists from "@/site-pages/AboutSpecialists";
import Aktuelt from "@/site-pages/Aktuelt";
import ArticlePage from "@/site-pages/ArticlePage";
import ClinicDetailPage from "@/site-pages/ClinicDetailPage";
import Clinics from "@/site-pages/Clinics";
import CmsThemePage from "@/site-pages/CmsThemePage";
import Contact from "@/site-pages/Contact";
import Insurance from "@/site-pages/Insurance";
import Karriere from "@/site-pages/Karriere";
import KarriereDetail from "@/site-pages/KarriereDetail";
import Personvern from "@/site-pages/Personvern";
import Priser from "@/site-pages/Priser";
import Services from "@/site-pages/Services";
import SpecialistProfile from "@/site-pages/SpecialistProfile";
import Specialists from "@/site-pages/Specialists";
import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import TreatmentPage from "@/site-pages/treatments/TreatmentPage";
import Guide from "@/site-pages/Guide";
import GynekologiSubPage from "@/site-pages/treatments/GynekologiSubPage";
import FertilitetSubPage from "@/site-pages/treatments/FertilitetSubPage";
import {
  buildAboutMetadata,
  buildClinicsListingMetadata,
  buildContactMetadata,
  buildInsuranceMetadata,
  buildNewsMetadata,
  buildPricingMetadata,
  buildPrivacyMetadata,
  buildServicesMetadata,
  buildSpecialistsAboutMetadata,
  buildSpecialistsListingMetadata,
  buildKarriereListingMetadata,
  buildGuideMetadata,
} from "@/lib/seo/route-metadata";
import {
  buildArticleMetadata,
  buildClinicMetadata,
  buildJobListingMetadata,
  buildSpecialistMetadata,
  buildThemePageMetadata,
  buildTreatmentCategoryMetadata,
  buildTreatmentMetadata,
} from "@/lib/seo/dynamic-route-metadata";

const SINGLETON_HANDLERS: Record<
  SingletonPageType,
  { Component: React.ComponentType<{ isChatOpen: boolean }>; buildMetadata: (locale: string) => Promise<Metadata> }
> = {
  aboutPage: { Component: About, buildMetadata: buildAboutMetadata },
  contactPage: { Component: Contact, buildMetadata: buildContactMetadata },
  newsPage: { Component: Aktuelt, buildMetadata: buildNewsMetadata },
  pricingPage: { Component: Priser, buildMetadata: buildPricingMetadata },
  insurancePage: { Component: Insurance, buildMetadata: buildInsuranceMetadata },
  servicesPage: { Component: Services, buildMetadata: buildServicesMetadata },
  specialistsPage: { Component: AboutSpecialists, buildMetadata: buildSpecialistsAboutMetadata },
  specialistsListingPage: { Component: Specialists, buildMetadata: buildSpecialistsListingMetadata },
  clinicsPage: { Component: Clinics, buildMetadata: buildClinicsListingMetadata },
  privacyPolicyPage: { Component: Personvern, buildMetadata: buildPrivacyMetadata },
  careersPage: { Component: Karriere, buildMetadata: buildKarriereListingMetadata },
  guidePage: { Component: Guide, buildMetadata: buildGuideMetadata },
};

const TREATMENT_COMPONENTS: Record<string, React.ComponentType<{ isChatOpen: boolean; sanityLang?: "no" | "en"; initialTreatment?: unknown }>> = {
  gynekologi: GynekologiSubPage,
  fertilitet: FertilitetSubPage,
};

export async function buildCmsRouteMetadata(
  route: ResolvedCmsRoute,
  locale: string,
): Promise<Metadata> {
  switch (route.kind) {
    case "singleton": {
      const handler = SINGLETON_HANDLERS[route.documentType as SingletonPageType];
      return handler ? handler.buildMetadata(locale) : {};
    }
    case "listing":
      if (route.documentType === "careersPage") return buildKarriereListingMetadata(locale);
      return SINGLETON_HANDLERS[route.documentType as SingletonPageType]?.buildMetadata(locale) ?? {};
    case "theme":
      return buildThemePageMetadata(locale, route.slug, route.slug);
    case "category":
      return buildTreatmentCategoryMetadata(locale, route.categoryId || route.slug);
    case "treatment":
      return buildTreatmentMetadata(
        locale,
        route.categoryId || route.categorySlug || "",
        route.slug,
      );
    case "clinic":
      return buildClinicMetadata(locale, route.slug);
    case "specialist":
      return buildSpecialistMetadata(locale, route.slug);
    case "article":
      return buildArticleMetadata(locale, route.slug);
    case "job":
      return buildJobListingMetadata(locale, route.slug);
    default:
      return {};
  }
}

export async function renderCmsRoute(
  route: ResolvedCmsRoute,
  locale: string,
): Promise<ReactNode> {
  const sanityLang = locale === "en" ? "en" : "no";

  switch (route.kind) {
    case "singleton":
    case "listing": {
      const handler = SINGLETON_HANDLERS[route.documentType as SingletonPageType];
      if (!handler) return null;
      const { Component } = handler;
      return <Component isChatOpen={false} />;
    }
    case "theme":
      return <CmsThemePage isChatOpen={false} themeSlug={route.slug} />;
    case "category": {
      const categoryId = route.categoryId || route.slug;
      const initialCategory = await fetchTreatmentCategoryData(categoryId, sanityLang);
      const queryClient = new QueryClient();
      queryClient.setQueryData(
        ["sanity", "treatmentCategory", categoryId, sanityLang],
        initialCategory,
      );
      return (
        <CategoryDataProvider
          categorySlug={categoryId}
          data={initialCategory}
          lang={sanityLang}
        >
          <TreatmentCategoryLanding
            isChatOpen={false}
            categoryId={categoryId}
            initialCategory={initialCategory}
            sanityLang={sanityLang}
          />
        </CategoryDataProvider>
      );
    }
    case "treatment": {
      const categorySlug = route.categorySlug || route.categoryId || "";
      const categoryId = route.categoryId || categorySlug;
      const initialTreatment = await fetchTreatmentData(categorySlug, route.slug, sanityLang);
      const SubPage = TREATMENT_COMPONENTS[categoryId] || TreatmentPage;
      const queryClient = new QueryClient();
      queryClient.setQueryData(
        ["sanity", "treatment", categorySlug, route.slug, sanityLang],
        initialTreatment,
      );
      return (
        <TreatmentHydration state={dehydrate(queryClient)}>
          <TreatmentDataProvider
            lang={sanityLang}
            categorySlug={categorySlug}
            treatmentSlug={route.slug}
            contentSlug={route.slugPair.slugNb}
            data={initialTreatment}
          >
            <SubPage
              isChatOpen={false}
              categoryId={categoryId}
              initialTreatment={initialTreatment}
              sanityLang={sanityLang}
            />
          </TreatmentDataProvider>
        </TreatmentHydration>
      );
    }
    case "clinic":
      return <ClinicDetailPage isChatOpen={false} />;
    case "specialist":
      return <SpecialistProfile isChatOpen={false} />;
    case "article":
      return <ArticlePage isChatOpen={false} />;
    case "job":
      return <KarriereDetail isChatOpen={false} />;
    default:
      return null;
  }
}

export { pathsForRoute };
