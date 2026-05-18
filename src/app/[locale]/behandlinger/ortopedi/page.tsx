import type { Metadata } from "next";
import OrtopediPage from "@/site-pages/treatments/OrtopediPage";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("ortopedi");

export default function Page() {
  return <OrtopediPage isChatOpen={false} />;
}
