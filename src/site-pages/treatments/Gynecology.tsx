import TreatmentCategoryLanding from "@/site-pages/treatments/TreatmentCategoryLanding";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

/** Sanity-driven gynekologi landing — content from Behandlingskategori → Landingsside. */
export default function Gynecology(props: CategoryLandingPageProps) {
  return <TreatmentCategoryLanding {...props} categoryId="gynekologi" />;
}
