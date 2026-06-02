import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";
import { createSanityCategoryLandingPage } from "@/lib/behandlinger/create-category-landing-page";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const generateMetadata = createBehandlingerCategoryMetadata("ortopedi");

export default createSanityCategoryLandingPage("ortopedi");
