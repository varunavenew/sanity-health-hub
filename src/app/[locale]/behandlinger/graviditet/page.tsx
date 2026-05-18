import type { Metadata } from "next";
import CategoryPageNew from "@/site-pages/treatments/CategoryPageNew";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("graviditet");

export default function Page() {
  return <CategoryPageNew categoryId="graviditet" isChatOpen={false} />;
}
