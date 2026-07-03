import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

/** Sanity-driven category landing for /urologi */
export default function UrologiPage(props: CategoryLandingPageProps) {
  return <TreatmentCategoryLanding {...props} categoryId="urologi" />;
}
