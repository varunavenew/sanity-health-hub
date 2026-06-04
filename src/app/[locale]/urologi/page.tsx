import {
  createSanityCategoryLandingMetadata,
  createSanityCategoryLandingPage,
} from "@/lib/behandlinger/create-category-landing-page";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createSanityCategoryLandingMetadata("urologi");

export default createSanityCategoryLandingPage("urologi");
