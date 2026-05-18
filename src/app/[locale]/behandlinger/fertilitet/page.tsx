import type { Metadata } from "next";
import Fertility from "@/site-pages/treatments/Fertility";
import { createBehandlingerCategoryMetadata } from "@/lib/seo/behandlinger-metadata";

export const generateMetadata = createBehandlingerCategoryMetadata("fertilitet");

export default function Page() {
  return <Fertility isChatOpen={false} />;
}
