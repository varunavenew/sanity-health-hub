import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

/** @deprecated Use TreatmentCategoryLanding or createSanityCategoryLandingPage */
export default function Fertility(props: CategoryLandingPageProps) {
  return <TreatmentCategoryLanding {...props} categoryId="fertilitet" />;
}
