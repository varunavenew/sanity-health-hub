import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

/** Sanity-driven category landing for /ortopedi */
export default function OrtopediPage(props: CategoryLandingPageProps) {
  return <TreatmentCategoryLanding {...props} categoryId="ortopedi" />;
}
