import type { Metadata } from "next";
import UrologiPage from "@/site-pages/treatments/UrologiPage";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("urologi");

export default function Page() {
  return <UrologiPage isChatOpen={false} />;
}
