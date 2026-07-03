import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

/** Sanity-driven category landing for /flere-fagomrader */
export default function FlereFagomraderPage(props: CategoryLandingPageProps) {
  return <TreatmentCategoryLanding {...props} categoryId="flere-fagomrader" />;
}
